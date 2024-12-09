import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Fetch functions
const fetchWorkPosts = async () => {
  const { data, error } = await supabase
    .from('work_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

const fetchContentSection = async (identifier: string) => {
  const { data, error } = await supabase
    .from('content_sections')
    .select('*')
    .eq('identifier', identifier)
    .single();
  
  if (error) throw error;
  return data;
};

const fetchSkills = async () => {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data;
};

const Work = () => {
  const { data: workPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['workPosts'],
    queryFn: fetchWorkPosts,
  });

  const { data: introBio, isLoading: isLoadingIntro } = useQuery({
    queryKey: ['contentSection', 'intro_bio'],
    queryFn: () => fetchContentSection('intro_bio'),
  });

  const { data: getInTouch, isLoading: isLoadingContact } = useQuery({
    queryKey: ['contentSection', 'get_in_touch'],
    queryFn: () => fetchContentSection('get_in_touch'),
  });

  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
  });

  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="brutalist-container py-12">
          {/* Introduction Section */}
          <div className="mb-16">
            <h1 className="brutalist-heading mb-6">
              {isLoadingIntro ? "Loading..." : introBio?.title}
            </h1>
            <p className="brutalist-text text-muted-foreground mb-8 max-w-3xl">
              {isLoadingIntro ? "Loading..." : introBio?.content}
            </p>
            
            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {isLoadingSkills ? (
                // Loading skeleton
                [...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-muted animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-background/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-background/20 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Skills grid
                skills?.map((skill) => (
                  <Card key={skill.id} className="bg-muted hover:bg-muted/80 transition-colors">
                    <CardContent className="p-4">
                      <div className="font-mono text-sm">{skill.skill_name}</div>
                      <div className="text-muted-foreground text-xs">{skill.level}</div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Work Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingPosts ? (
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
              workPosts?.map((post) => (
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
              ))
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-16 pt-8 border-t border-muted">
            <h2 className="brutalist-subheading mb-4">
              {isLoadingContact ? "Loading..." : getInTouch?.title}
            </h2>
            <p className="text-muted-foreground">
              {isLoadingContact ? "Loading..." : getInTouch?.content}
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Work;
