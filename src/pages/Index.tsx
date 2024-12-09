import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchWorkPosts = async () => {
  const { data, error } = await supabase
    .from('work_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Helper function to get storage URL
const getStorageUrl = (path: string) => {
  const { data } = supabase.storage.from('content-images').getPublicUrl(path);
  return data.publicUrl;
};

const Index = () => {
  const { data: workPosts, isLoading } = useQuery({
    queryKey: ['workPosts'],
    queryFn: fetchWorkPosts,
  });

  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="brutalist-container py-12">
          {/* Introduction Section */}
          <div className="mb-16">
            <h1 className="brutalist-heading mb-6">Michael Chruscinski</h1>
            <p className="brutalist-text text-muted-foreground mb-8 max-w-3xl">
              Senior Art Director specializing in graphic optimization and process automation 
              in the E-commerce sector. With over 15 years of experience, I've developed 
              innovative design solutions that merge classical advertising principles with 
              modern digital platforms. My passion lies in integrating artificial intelligence 
              and automation to enhance creative workflows without compromising on quality.
            </p>
            
            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {[
                { skill: "Adobe Photoshop", level: "Expert" },
                { skill: "Adobe Illustrator", level: "Expert" },
                { skill: "Adobe InDesign", level: "Expert" },
                { skill: "AI Integration", level: "Advanced" },
                { skill: "Process Optimization", level: "Expert" },
                { skill: "E-commerce Design", level: "Expert" },
              ].map((item) => (
                <Card key={item.skill} className="bg-muted hover:bg-muted/80 transition-colors">
                  <CardContent className="p-4">
                    <div className="font-mono text-sm">{item.skill}</div>
                    <div className="text-muted-foreground text-xs">{item.level}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Work Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading skeleton
              [...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-video bg-muted"></div>
                  <div className="h-4 bg-muted w-3/4"></div>
                  <div className="h-4 bg-muted w-1/2"></div>
                </div>
              ))
            ) : (
              // Work posts grid
              workPosts?.map((post, index) => (
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
                          <img 
                            src={getStorageUrl(`work-${index + 1}.jpg`)}
                            alt={post.title || 'Work showcase'}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
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
              ))
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-16 pt-8 border-t border-muted">
            <h2 className="brutalist-subheading mb-4">Get in Touch</h2>
            <p className="text-muted-foreground">
              Available for collaborations and consulting on process optimization 
              and AI integration in design workflows.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Index;