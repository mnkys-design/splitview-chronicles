import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@/types/blog";

export const useBlogMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updatePost = useMutation({
    mutationFn: async ({ id, title, content }: { id: string, title: string, content: string }) => {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          title, 
          content,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
      console.error('Error updating blog post:', error);
    },
  });

  const createPost = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{ 
          title: "New Blog Post", 
          content: "Start writing your content here...",
          published_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Success",
        description: "New blog post created",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
      console.error('Error creating blog post:', error);
    },
  });

  return {
    updatePost,
    createPost,
  };
};