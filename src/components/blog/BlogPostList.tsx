import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types/blog";

interface BlogPostListProps {
  posts: BlogPost[];
  isAuthenticated: boolean;
  onEdit: (post: BlogPost) => void;
}

export const BlogPostList = ({ posts, isAuthenticated, onEdit }: BlogPostListProps) => {
  return (
    <div className="space-y-16">
      {posts?.map((post) => (
        <article key={post.id} className="border-t border-muted pt-8 group relative">
          <time className="text-sm text-muted-foreground">
            {new Date(post.published_at).toLocaleDateString()}
          </time>
          <h2 className="brutalist-subheading mt-4 mb-4">{post.title}</h2>
          <p className="brutalist-text text-muted-foreground mb-4">
            {post.content}
          </p>
          <Link to={`/blog/${post.id}`} className="brutalist-link">
            Read More →
          </Link>
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onEdit(post)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </article>
      ))}
    </div>
  );
};