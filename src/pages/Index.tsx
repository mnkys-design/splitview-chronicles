import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const fetchWorkPosts = async () => {
  const { data, error } = await supabase
    .from('work_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

const fetchBlogPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(3);
  
  if (error) throw error;
  return data;
};

// Helper function to get storage URL
const getStorageUrl = (path: string) => {
  const { data } = supabase.storage.from('content-images').getPublicUrl(path);
  return data.publicUrl;
};

const Index = () => {
  const { data: workPosts, isLoading: isLoadingWork } = useQuery({
    queryKey: ['workPosts'],
    queryFn: fetchWorkPosts,
  });

  const { data: blogPosts, isLoading: isLoadingBlog } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts,
  });

  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Panel - Work */}
        <ResizablePanel defaultSize={50}>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="brutalist-container py-12">
              <div className="mb-16">
                <h1 className="brutalist-heading mb-6">Michael Chruscinski</h1>
                <p className="brutalist-text text-muted-foreground mb-8 max-w-3xl">
                  Senior Art Director specializing in graphic optimization and process automation 
                  in the E-commerce sector. With over 15 years of experience, I've developed 
                  innovative design solutions that merge classical advertising principles with 
                  modern digital platforms.
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
                {isLoadingWork ? (
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
            </div>
          </ScrollArea>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle />

        {/* Right Panel - Blog Posts & Experience */}
        <ResizablePanel defaultSize={50}>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="brutalist-container py-12">
              {/* Recent Blog Posts */}
              <div className="mb-16">
                <h2 className="brutalist-subheading mb-8">Recent Blog Posts</h2>
                <div className="space-y-8">
                  {isLoadingBlog ? (
                    // Loading skeleton for blog posts
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-4 animate-pulse">
                        <div className="h-4 bg-muted w-3/4"></div>
                        <div className="h-4 bg-muted w-1/2"></div>
                      </div>
                    ))
                  ) : (
                    blogPosts?.map((post) => (
                      <Link key={post.id} to={`/blog/${post.id}`}>
                        <Card className="bg-muted hover:bg-muted/80 transition-colors">
                          <CardContent className="p-6">
                            <h3 className="font-mono text-lg mb-2">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {post.content}
                            </p>
                            <div className="text-xs text-muted-foreground mt-2">
                              {new Date(post.published_at).toLocaleDateString()}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Experience Section */}
              <div>
                <h2 className="brutalist-subheading mb-8">Experience</h2>
                <div className="space-y-8">
                  {[
                    {
                      title: "Senior Art Director",
                      company: "E-commerce Solutions Inc.",
                      period: "2018 - Present",
                      description: "Leading creative direction and optimization strategies for major e-commerce platforms."
                    },
                    {
                      title: "Art Director",
                      company: "Digital Creative Agency",
                      period: "2014 - 2018",
                      description: "Managed creative teams and developed brand identities for various clients."
                    },
                    {
                      title: "Senior Designer",
                      company: "Marketing Solutions Ltd.",
                      period: "2010 - 2014",
                      description: "Created visual solutions for print and digital marketing campaigns."
                    }
                  ].map((job, index) => (
                    <Card key={index} className="bg-muted">
                      <CardContent className="p-6">
                        <h3 className="font-mono text-lg mb-1">{job.title}</h3>
                        <div className="text-sm text-muted-foreground mb-2">
                          {job.company} | {job.period}
                        </div>
                        <p className="text-sm">{job.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;