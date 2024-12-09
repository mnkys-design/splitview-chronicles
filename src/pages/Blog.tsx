import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pencil, Save, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

const Blog = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updatePostMutation = useMutation({
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
      setEditingPost(null);
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

  const createPostMutation = useMutation({
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "Success",
        description: "New blog post created",
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

  const handleEdit = (post: any) => {
    setEditingPost(post.id);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  };

  const handleSave = async (id: string) => {
    updatePostMutation.mutate({
      id,
      title: editedTitle,
      content: editedContent,
    });
  };

  const handleCancel = () => {
    setEditingPost(null);
    setEditedTitle("");
    setEditedContent("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="brutalist-container py-12">
          <h1 className="brutalist-heading mb-12">Blog Archive</h1>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-t border-muted pt-8 animate-pulse">
                <div className="h-4 bg-muted w-24 mb-4"></div>
                <div className="h-8 bg-muted w-3/4 mb-4"></div>
                <div className="h-20 bg-muted w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="brutalist-container py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="brutalist-heading">Blog Archive</h1>
          {session && (
            <Button onClick={() => createPostMutation.mutate()} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          )}
        </div>
        <div className="space-y-16">
          {blogPosts?.map((post) => (
            <article key={post.id} className="border-t border-muted pt-8 group relative">
              <time className="text-sm text-muted-foreground">
                {new Date(post.published_at).toLocaleDateString()}
              </time>
              {editingPost === post.id ? (
                <div className="space-y-4 mt-4">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="brutalist-subheading bg-background"
                  />
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[100px] brutalist-text bg-background"
                  />
                  <div className="space-x-2">
                    <Button onClick={() => handleSave(post.id)}>
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
                <>
                  <h2 className="brutalist-subheading mt-4 mb-4">{post.title}</h2>
                  <p className="brutalist-text text-muted-foreground mb-4">
                    {post.content}
                  </p>
                  <Link to={`/blog/${post.id}`} className="brutalist-link">
                    Read More →
                  </Link>
                  {session && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleEdit(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;