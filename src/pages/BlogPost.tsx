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

  // Add dummy posts with images
  const addDummyPosts = async () => {
    const dummyPosts = [
      {
        title: "The Evolution of Web Development",
        content: `In the ever-evolving landscape of web development, staying ahead of the curve is crucial. From the early days of static HTML pages to today's dynamic, interactive applications, the journey has been remarkable.

![Modern Web Development](https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80)

The modern web stack has transformed significantly, embracing new technologies and methodologies that enhance both developer experience and user interaction.`,
        published_at: new Date().toISOString(),
      },
      {
        title: "Exploring Modern Design Patterns",
        content: `Design patterns serve as the foundation for scalable and maintainable applications. Let's explore some of the most impactful patterns in modern software development.

![Design Thinking](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80)

From MVC to MVVM, and now to more component-based architectures, the evolution of design patterns reflects our growing understanding of software architecture.`,
        published_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        title: "The Impact of AI on Software Development",
        content: `Artificial Intelligence is revolutionizing how we approach software development. From code completion to automated testing, AI tools are becoming indispensable.

![AI and Technology](https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80)

The integration of AI in development workflows has opened new possibilities for efficiency and innovation in software creation.`,
        published_at: new Date(Date.now() - 172800000).toISOString(),
      }
    ];

    for (const post of dummyPosts) {
      await supabase.from('blog_posts').insert([post]);
    }
  };

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