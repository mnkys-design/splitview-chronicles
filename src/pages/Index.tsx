import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Pencil, Save, X, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

// Fetch functions
const fetchLatestWorkPosts = async () => {
  const { data, error } = await supabase
    .from('work_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);
  
  if (error) throw error;
  return data;
};

const fetchLatestBlogPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(3);
  
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

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<any>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  // Check authentication status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: workPosts, isLoading: isLoadingWork } = useQuery({
    queryKey: ['workPosts'],
    queryFn: fetchLatestWorkPosts,
  });

  const { data: blogPosts, isLoading: isLoadingBlog } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchLatestBlogPosts,
  });

  const { data: homeIntro } = useQuery({
    queryKey: ['contentSection', 'home_intro'],
    queryFn: () => fetchContentSection('home_intro'),
  });

  const { data: seniorDirector } = useQuery({
    queryKey: ['contentSection', 'experience_senior_director'],
    queryFn: () => fetchContentSection('experience_senior_director'),
  });

  const { data: artDirector } = useQuery({
    queryKey: ['contentSection', 'experience_art_director'],
    queryFn: () => fetchContentSection('experience_art_director'),
  });

  const { data: education } = useQuery({
    queryKey: ['contentSection', 'education'],
    queryFn: () => fetchContentSection('education'),
  });

  // Mutation for updating content sections
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, title, content, private: isPrivate }: { id: string, title: string | null, content: string, private: boolean }) => {
      const { error } = await supabase
        .from('content_sections')
        .update({ 
          title, 
          content, 
          private: isPrivate,
          updated_at: new Date().toISOString() 
        })
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
    setIsPrivate(section.private || false);
  };

  const handleSave = async (id: string) => {
    updateContentMutation.mutate({
      id,
      title: editedTitle,
      content: editedContent,
      private: isPrivate,
    });
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditedContent("");
    setEditedTitle("");
    setIsPrivate(false);
  };

  const renderEditableContent = (section: any) => {
    const isEditing = editingSection === section.id;
    const showContent = !section.private || session;

    if (!showContent) return null;

    if (!session) {
      return (
        <>
          {section.title && <h2 className="brutalist-subheading mb-4">{section.title}</h2>}
          <p className="brutalist-text text-muted-foreground mb-8">{section.content}</p>
        </>
      );
    }

    return isEditing ? (
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
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            checked={isPrivate}
            onCheckedChange={setIsPrivate}
            id="private-mode"
          />
          <label htmlFor="private-mode" className="text-sm">
            Private Content
          </label>
          {isPrivate ? <EyeOff className="h-4 w-4 ml-2" /> : <Eye className="h-4 w-4 ml-2" />}
        </div>
        <div className="space-x-2">
          <Button onClick={() => handleSave(section.id)}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    ) : (
      <div className="relative group">
        <div className="flex items-center mb-4">
          {section.title && <h2 className="brutalist-subheading">{section.title}</h2>}
          {section.private && <EyeOff className="h-4 w-4 ml-2 text-muted-foreground" />}
        </div>
        <p className="brutalist-text text-muted-foreground mb-8">{section.content}</p>
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
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel - CV Summary & Work */}
        <ScrollArea className="w-full md:w-1/2 h-[calc(100vh-4rem)] bg-background">
          <div className="p-8">
            <div className="mb-12">
              {homeIntro && renderEditableContent(homeIntro)}
            </div>

            {/* Work Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {isLoadingWork ? (
                [...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-card/50 animate-pulse"></div>
                ))
              ) : (
                workPosts?.map((post) => (
                  <Link key={post.id} to={`/work/${post.id}`} className="group">
                    <div className="aspect-square bg-card overflow-hidden">
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
                  </Link>
                ))
              )}
            </div>

            <Link to="/work" className="brutalist-link text-sm">
              Work Index →
            </Link>
          </div>
        </ScrollArea>

        {/* Right Panel - CV Table & Blog Teasers */}
        <ScrollArea className="w-full md:w-1/2 h-[calc(100vh-4rem)] bg-card">
          <div className="p-8">
            {/* CV Table */}
            <div className="mb-12">
              <h2 className="brutalist-heading mb-8">Experience</h2>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">2023 - Present</TableCell>
                    <TableCell>
                      {seniorDirector && renderEditableContent(seniorDirector)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">2020 - 2023</TableCell>
                    <TableCell>
                      {artDirector && renderEditableContent(artDirector)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">2018 - 2020</TableCell>
                    <TableCell>
                      {education && renderEditableContent(education)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Blog Teasers */}
            <div className="space-y-8">
              <h3 className="brutalist-subheading mb-6">Latest Posts</h3>
              {isLoadingBlog ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-background/5 rounded-sm animate-pulse">
                    <div className="h-4 bg-background/10 rounded w-1/3 mb-2"></div>
                    <div className="h-16 bg-background/10 rounded"></div>
                  </div>
                ))
              ) : (
                blogPosts?.map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <article className="p-4 bg-background/5 rounded-sm hover:bg-background/10 transition-colors">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <time>{new Date(post.published_at).toLocaleDateString()}</time>
                        <span>({String(post.id).slice(-3)})</span>
                      </div>
                      <h4 className="font-bold mb-2">{post.title}</h4>
                      <p className="brutalist-text line-clamp-3">
                        {post.content}
                      </p>
                    </article>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-12">
              <Link to="/blog" className="brutalist-link text-sm">
                Blog Archive →
              </Link>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Index;
