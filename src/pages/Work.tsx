import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pencil, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Fetch functions
const fetchWorkPosts = async () => {
  const { data, error } = await supabase
    .from('work_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

const fetchContentSection = async (identifier: string) => {
  const { data, error } = await supabase
    .from('content_sections')
    .select('*')
    .eq('identifier', identifier)
    .single();
  
  if (error) throw error;
  return data;
};

const fetchSkills = async () => {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data;
};

const Work = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [session, setSession] = useState<any>(null);

  // Check authentication status
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  const { data: workPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['workPosts'],
    queryFn: fetchWorkPosts,
  });

  const { data: introBio, isLoading: isLoadingIntro } = useQuery({
    queryKey: ['contentSection', 'intro_bio'],
    queryFn: () => fetchContentSection('intro_bio'),
  });

  const { data: getInTouch, isLoading: isLoadingContact } = useQuery({
    queryKey: ['contentSection', 'get_in_touch'],
    queryFn: () => fetchContentSection('get_in_touch'),
  });

  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
  });

  // Mutation for updating content sections
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string, title: string | null, content: string }) => {
      const { error } = await supabase
        .from('content_sections')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSection'] });
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      setEditingSection(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
      console.error('Error updating content:', error);
    },
  });

  const handleEdit = (section: any) => {
    setEditingSection(section.id);
    setEditedContent(section.content);
    setEditedTitle(section.title || "");
  };

  const handleSave = async (id: string) => {
    updateContentMutation.mutate({
      id,
      title: editedTitle,
      content: editedContent,
    });
  };

  const renderEditableContent = (section: any) => {
    if (!session) return (
      <>
        {section.title && <h2 className="brutalist-subheading mb-4">{section.title}</h2>}
        <p className="brutalist-text text-muted-foreground mb-8 max-w-3xl">{section.content}</p>
      </>
    );

    return editingSection === section.id ? (
      <div className="space-y-4">
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Section Title"
          className="max-w-md"
        />
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={() => handleSave(section.id)} className="mr-2">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={() => setEditingSection(null)}>
          Cancel
        </Button>
      </div>
    ) : (
      <div className="relative group">
        {section.title && <h2 className="brutalist-subheading mb-4">{section.title}</h2>}
        <p className="brutalist-text text-muted-foreground mb-8 max-w-3xl">{section.content}</p>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleEdit(section)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="brutalist-container py-12">
          {/* Introduction Section */}
          <div className="mb-16">
            {isLoadingIntro ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-24 bg-muted rounded"></div>
              </div>
            ) : introBio && renderEditableContent(introBio)}
            
            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {isLoadingSkills ? (
                // Loading skeleton
                [...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-muted animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-background/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-background/20 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Skills grid
                skills?.map((skill) => (
                  <Card key={skill.id} className="bg-muted hover:bg-muted/80 transition-colors">
                    <CardContent className="p-4">
                      <div className="font-mono text-sm">{skill.skill_name}</div>
                      <div className="text-muted-foreground text-xs">{skill.level}</div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Work Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingPosts ? (
              // Loading skeleton
              [...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-video bg-muted"></div>
                  <div className="h-4 bg-muted w-3/4"></div>
                  <div className="h-4 bg-muted w-1/2"></div>
                </div>
              ))
            ) : (
              // Work posts grid
              workPosts?.map((post) => (
                <Link key={post.id} to={`/work/${post.id}`} className="group">
                  <Card className="bg-muted hover:bg-muted/80 transition-colors">
                    <CardHeader>
                      <div className="aspect-video mb-4 overflow-hidden bg-background">
                        {post.main_image_url ? (
                          <img 
                            src={post.main_image_url} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full diagonal-line" />
                        )}
                      </div>
                      <CardTitle className="text-lg font-mono">{post.title}</CardTitle>
                      {post.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.description}
                        </p>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-16 pt-8 border-t border-muted">
            {isLoadingContact ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ) : getInTouch && renderEditableContent(getInTouch)}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Work;