import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkGridProps {
  workPosts: any[];
  isLoading: boolean;
}

export const WorkGrid = ({ workPosts, isLoading }: WorkGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="aspect-video bg-muted"></div>
            <div className="h-4 bg-muted w-3/4"></div>
            <div className="h-4 bg-muted w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {workPosts?.map((post) => (
        <Link key={post.id} to={`/work/${post.id}`} className="group">
          <Card className="bg-muted hover:bg-muted/80 transition-colors">
            <CardHeader>
              <div className="aspect-video mb-4 overflow-hidden bg-background">
                {post.main_image_url ? (
                  <img 
                    src={post.main_image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full diagonal-line" />
                )}
              </div>
              <CardTitle className="text-lg font-mono">{post.title}</CardTitle>
              {post.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
              )}
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
};