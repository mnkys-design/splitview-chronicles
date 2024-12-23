import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LeftPanel from "@/components/home/LeftPanel";
import RightPanel from "@/components/home/RightPanel";

const fetchWorkPosts = async () => {
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
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workPosts, isLoading: isLoadingWork } = useQuery({
    queryKey: ['workPosts'],
    queryFn: fetchWorkPosts,
  });

  const { data: blogPosts, isLoading: isLoadingBlog } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchLatestBlogPosts,
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

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string, title: string, content: string }) => {
      const { error } = await supabase
        .from('content_sections')
        .update({ 
          title, 
          content,
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

  const handleSave = async (id: string, title: string, content: string) => {
    updateContentMutation.mutate({ id, title, content });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        <LeftPanel 
          workPosts={workPosts} 
          isLoadingWork={isLoadingWork}
        />
        <RightPanel 
          blogPosts={blogPosts}
          isLoadingBlog={isLoadingBlog}
          seniorDirector={seniorDirector}
          artDirector={artDirector}
          education={education}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default Index;