import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LeftPanel } from "@/components/home/LeftPanel";
import { RightPanel } from "@/components/home/RightPanel";
import { EditableContent } from "@/components/home/EditableContent";

const fetchWorkPosts = async () => {
  const { data, error } = await supabase
    .from('work_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
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
    .maybeSingle();
  
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

  // Fetch data
  const { data: workPosts, isLoading: isLoadingWork } = useQuery({
    queryKey: ['workPosts'],
    queryFn: fetchWorkPosts,
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

  // Mutations
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

  const renderEditableContent = (section: any) => (
    <EditableContent
      section={section}
      editingSection={editingSection}
      editedContent={editedContent}
      editedTitle={editedTitle}
      isPrivate={isPrivate}
      session={session}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      setEditedTitle={setEditedTitle}
      setEditedContent={setEditedContent}
      setIsPrivate={setIsPrivate}
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        <LeftPanel
          workPosts={workPosts}
          isLoadingWork={isLoadingWork}
          homeIntro={homeIntro}
          renderEditableContent={renderEditableContent}
        />
        <RightPanel
          seniorDirector={seniorDirector}
          artDirector={artDirector}
          education={education}
          blogPosts={blogPosts}
          isLoadingBlog={isLoadingBlog}
          renderEditableContent={renderEditableContent}
        />
      </div>
    </div>
  );
};

export default Index;