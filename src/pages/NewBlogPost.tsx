import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogPostEditor } from "@/components/blog/BlogPostEditor";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const NewBlogPost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createPost = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{ 
          title, 
          content,
          published_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      navigate(`/blog/${data.id}`);
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

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }
    createPost.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="brutalist-container py-12">
          <h1 className="brutalist-heading mb-8">Create New Blog Post</h1>
          <BlogPostEditor
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onSave={handleSave}
            onCancel={() => navigate('/blog')}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default NewBlogPost;