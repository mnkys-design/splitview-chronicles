import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

export const LeftPanel = ({ workPosts, isLoadingWork, homeIntro, renderEditableContent }: {
  workPosts: any[];
  isLoadingWork: boolean;
  homeIntro: any;
  renderEditableContent: (section: any) => React.ReactNode;
}) => {
  return (
    <ScrollArea className="w-full md:w-1/2 h-[calc(100vh-4rem)] bg-background">
      <div className="p-8">
        <div className="mb-12">
          {homeIntro && renderEditableContent(homeIntro)}
        </div>

        {/* Work Grid */}
        <div className="grid grid-cols-1 gap-4 mb-12">
          {isLoadingWork ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/1] bg-card/50 animate-pulse"></div>
            ))
          ) : (
            workPosts?.map((post) => (
              <Link key={post.id} to={`/work/${post.id}`} className="group">
                <div className="aspect-[3/1] bg-card overflow-hidden flex items-center">
                  {post.main_image_url ? (
                    <img 
                      src={post.main_image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full p-4">
                      <h3 className="text-lg font-bold">{post.title}</h3>
                      {post.description && (
                        <p className="text-sm text-muted-foreground mt-2">{post.description}</p>
                      )}
                    </div>
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