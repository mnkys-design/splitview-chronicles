import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogPostEditor } from "@/components/blog/BlogPostEditor";
import { useBlogMutations } from "@/hooks/blog/useBlogMutations";
import { Card } from "@/components/ui/card";

const BlogPost = () => {
  const { id } = useParams();
  const { session } = useSessionContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const { updatePost } = useBlogMutations();

  console.log("Auth session:", session); // Debug log

  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: async () => {
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(post?.title || "");
    setEditedContent(post?.content || "");
  };

  const handleSave = async () => {
    if (!id) return;
    
    await updatePost.mutateAsync({
      id,
      title: editedTitle,
      content: editedContent,
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle("");
    setEditedContent("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="brutalist-container py-12">
          <Card className="p-6 animate-pulse">
            <div className="h-4 w-32 bg-muted mb-4"></div>
            <div className="h-12 w-2/3 bg-muted mb-8"></div>
            <div className="h-64 bg-muted"></div>
          </Card>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="brutalist-container py-12">
          <Card className="p-6">
            <h1 className="brutalist-heading mb-4">Error</h1>
            <p className="text-muted-foreground">
              Blog post not found or an error occurred.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="brutalist-container py-12">
          <Card className="p-6 group relative bg-background">
            {isEditing ? (
              <BlogPostEditor
                title={editedTitle}
                content={editedContent}
                onTitleChange={setEditedTitle}
                onContentChange={setEditedContent}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <>
                {post.featured_image_url && (
                  <div className="aspect-video mb-8 overflow-hidden rounded-md">
                    <img 
                      src={post.featured_image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <time className="text-sm text-muted-foreground block mb-4">
                  {new Date(post.published_at).toLocaleDateString()}
                </time>
                <h1 className="brutalist-heading mb-8">{post.title}</h1>
                <div className="brutalist-text text-muted-foreground whitespace-pre-wrap">
                  {post.content}
                </div>
                {session && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleEdit}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BlogPost;
