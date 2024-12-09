import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogImageUpload } from "@/components/blog/BlogImageUpload";

const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

const BlogPost = () => {
  const { id } = useParams();
  const { session } = useSessionContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      if (!isValidUUID(id!)) {
        throw new Error("Invalid blog post ID format");
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_images (
            id,
            image_url,
            caption,
            display_order
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string, content: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ['blogPost', id] });
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      setIsEditing(false);
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(post?.title || "");
    setEditedContent(post?.content || "");
  };

  const handleSave = async () => {
    updatePostMutation.mutate({
      title: editedTitle,
      content: editedContent,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle("");
    setEditedContent("");
  };

  const handleImageUploaded = (imageUrl: string) => {
    // You can either append the image URL to the content or handle it in a different way
    setEditedContent((prev) => `${prev}\n\n![Blog Image](${imageUrl})`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="brutalist-container py-12">
          <div className="h-4 w-32 bg-muted mb-4 animate-pulse"></div>
          <div className="h-12 w-2/3 bg-muted mb-8 animate-pulse"></div>
          <div className="h-64 bg-muted animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="brutalist-container py-12">
          <h1 className="brutalist-heading mb-4">Error</h1>
          <p className="text-muted-foreground">
            {error?.message === "Invalid blog post ID format" 
              ? "Invalid blog post ID format. Please check the URL."
              : "Blog post not found or an error occurred."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="brutalist-container py-12">
          <div className="mb-8 relative group">
            <time className="text-sm text-muted-foreground block mb-4">
              {new Date(post.published_at).toLocaleDateString()}
            </time>
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="brutalist-heading bg-background"
                />
                <BlogImageUpload postId={post.id} onImageUploaded={handleImageUploaded} />
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[300px] brutalist-text bg-background"
                />
                <div className="space-x-2">
                  <Button onClick={handleSave}>
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
                <h1 className="brutalist-heading mb-8">{post.title}</h1>
                <div className="brutalist-text text-muted-foreground whitespace-pre-wrap">
                  {post.content}
                </div>
                {session && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleEdit}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BlogPost;