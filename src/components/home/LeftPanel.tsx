import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeftPanelProps {
  workPosts: any[];
  isLoadingWork: boolean;
}

const LeftPanel = ({ workPosts, isLoadingWork }: LeftPanelProps) => {
  return (
    <ScrollArea className="w-full md:w-1/2 h-[calc(100vh-4rem)] bg-background">
      <div className="p-8">
        <div className="grid grid-cols-2 gap-4 mb-12">
          {isLoadingWork ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-card/50 animate-pulse"></div>
            ))
          ) : (
            workPosts?.map((post) => (
              <Link key={post.id} to={`/work/${post.id}`} className="group">
                <div className="aspect-square bg-card overflow-hidden">
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
              </Link>
            ))
          )}
        </div>
        <Link to="/work" className="brutalist-link text-sm">
          Work Index →
        </Link>
      </div>
    </ScrollArea>
  );
};

export default LeftPanel;