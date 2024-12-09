import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch functions
const fetchLatestWorkPosts = async () => {
  const { data, error } = await supabase
    .from('work_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);
  
  if (error) throw error;
  return data;
};

const fetchLatestBlogPosts = async () => {
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
    queryFn: fetchLatestWorkPosts,
  });

  const { data: blogPosts, isLoading: isLoadingBlog } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchLatestBlogPosts,
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel - Work Showcase */}
        <ScrollArea className="w-full md:w-1/2 h-[calc(100vh-4rem)] bg-background">
          <div className="p-8">
            <div className="mb-12">
              <p className="text-sm text-muted-foreground mb-4">Senior Art Director</p>
              <h1 className="brutalist-heading mb-8">Michael Chruscinski</h1>
              <p className="brutalist-text mb-12">
                From classical advertising to AI-driven automation, I bridge the gap 
                between traditional design principles and modern digital platforms. 
                With over 15 years of experience, I specialize in optimizing creative 
                workflows without compromising on quality.
              </p>
            </div>

            {/* Featured Image */}
            <div className="mb-12 aspect-[4/3] bg-muted overflow-hidden">
              <img 
                src={getStorageUrl('hero-image.jpg')}
                alt="Michael Chruscinski at work"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Work Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {isLoadingWork ? (
                // Loading skeleton
                [...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted animate-pulse"></div>
                ))
              ) : (
                // Work posts grid
                workPosts?.map((post, index) => (
                  <Link key={post.id} to={`/work/${post.id}`} className="group">
                    <div className="aspect-square bg-muted overflow-hidden">
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
                  </Link>
                ))
              )}
            </div>

            <Link to="/work" className="brutalist-link text-sm">
              View Full Portfolio →
            </Link>
          </div>
        </ScrollArea>

        {/* Right Panel - Experience & Blog */}
        <ScrollArea className="w-full md:w-1/2 h-[calc(100vh-4rem)] bg-card">
          <div className="p-8">
            {/* Experience Table */}
            <div className="mb-12">
              <h2 className="brutalist-heading mb-8">Experience</h2>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">2020 - Present</TableCell>
                    <TableCell>
                      <span className="font-bold">Senior Art Director</span>
                      <br />
                      <span className="text-muted-foreground">Remazing GmbH</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Leading AI integration and process automation initiatives for 
                        E-commerce design optimization.
                      </p>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">2015 - 2020</TableCell>
                    <TableCell>
                      <span className="font-bold">Art Director</span>
                      <br />
                      <span className="text-muted-foreground">WirWinzer GmbH</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Spearheaded rebranding efforts and established design systems 
                        for digital platforms.
                      </p>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">2008 - 2015</TableCell>
                    <TableCell>
                      <span className="font-bold">Senior Designer</span>
                      <br />
                      <span className="text-muted-foreground">LunchNow.com</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Led the Frankfurt launch campaign and developed automated 
                        design workflows.
                      </p>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Latest Insights */}
            <div className="mb-8">
              <h3 className="brutalist-subheading mb-6">Latest Insights</h3>
              <div className="space-y-8">
                {isLoadingBlog ? (
                  // Loading skeleton
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 bg-background/5 rounded-sm animate-pulse">
                      <div className="h-4 bg-background/10 rounded w-1/3 mb-2"></div>
                      <div className="h-16 bg-background/10 rounded"></div>
                    </div>
                  ))
                ) : (
                  // Blog posts
                  blogPosts?.map((post) => (
                    <Link key={post.id} to={`/blog/${post.id}`}>
                      <article className="p-4 bg-background/5 rounded-sm hover:bg-background/10 transition-colors">
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <time>{new Date(post.published_at).toLocaleDateString()}</time>
                          <span>({String(post.id).slice(-3)})</span>
                        </div>
                        <h4 className="font-mono text-base mb-2">{post.title}</h4>
                        <p className="brutalist-text line-clamp-2 text-muted-foreground">
                          {post.content}
                        </p>
                      </article>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="mt-12">
              <Link to="/blog" className="brutalist-link text-sm">
                Read More Insights →
              </Link>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Index;