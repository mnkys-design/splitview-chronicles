import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BlogPost } from "@/types/blog";

interface BlogPostListProps {
  posts: BlogPost[];
  isAuthenticated: boolean;
  onEdit: (post: BlogPost) => void;
}

export const BlogPostList = ({ posts, isAuthenticated, onEdit }: BlogPostListProps) => {
  return (
    <div className="space-y-8">
      {posts?.map((post) => (
        <Card key={post.id} className="p-6 group relative">
          <div className="flex gap-6">
            {post.featured_image_url && (
              <div className="w-1/3 shrink-0">
                <div className="aspect-[3/4] overflow-hidden rounded-md">
                  <img 
                    src={post.featured_image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <time className="text-sm text-muted-foreground">
                {new Date(post.published_at).toLocaleDateString()}
              </time>
              <h2 className="brutalist-subheading mt-4 mb-4">{post.title}</h2>
              <p className="brutalist-text text-muted-foreground mb-4 line-clamp-3 flex-1">
                {post.content}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <Link to={`/blog/${post.id}`} className="brutalist-link">
                  Read More →
                </Link>
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onEdit(post)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};