import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { BlogPostEditor } from "@/components/blog/BlogPostEditor";
import { useBlogPosts } from "@/hooks/blog/useBlogPosts";
import { useBlogMutations } from "@/hooks/blog/useBlogMutations";
import type { BlogPost } from "@/types/blog";

const Blog = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const { data: blogPosts, isLoading } = useBlogPosts();
  const { updatePost, createPost } = useBlogMutations();

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post.id);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  };

  const handleSave = async (id: string) => {
    updatePost.mutate({
      id,
      title: editedTitle,
      content: editedContent,
    });
    setEditingPost(null);
  };

  const handleCancel = () => {
    setEditingPost(null);
    setEditedTitle("");
    setEditedContent("");
  };

  const handleCreatePost = () => {
    createPost.mutate(undefined, {
      onSuccess: (data) => {
        navigate(`/blog/${data.id}`);
      },
    });
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
            <Button onClick={handleCreatePost} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          )}
        </div>
        {blogPosts && blogPosts.length > 0 ? (
          <div className="space-y-16">
            {blogPosts.map((post) => (
              <div key={post.id}>
                {editingPost === post.id ? (
                  <BlogPostEditor
                    title={editedTitle}
                    content={editedContent}
                    onTitleChange={setEditedTitle}
                    onContentChange={setEditedContent}
                    onSave={() => handleSave(post.id)}
                    onCancel={handleCancel}
                  />
                ) : (
                  <BlogPostList
                    posts={[post]}
                    isAuthenticated={!!session}
                    onEdit={handleEdit}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No blog posts yet. {session && "Click 'New Post' to create one!"}</p>
        )}
      </div>
    </div>
  );
};

export default Blog;