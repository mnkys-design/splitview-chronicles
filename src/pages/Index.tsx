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
        {/* Left Panel - CV Summary & Work */}
        <ScrollArea className="w-full md:w-1/2 h-[calc(100vh-4rem)] bg-background">
          <div className="p-8">
            <div className="mb-12">
              <p className="text-sm text-muted-foreground mb-4">Lorem Ipsum</p>
              <h1 className="brutalist-heading mb-8">Maximus Gravida</h1>
              <p className="brutalist-text mb-12">
                Nulla ipsum augue, viverra ac neque a, gravida tempus tellus. Nam vitae nisl risus. 
                Pellentes que ex libero pharetra sodales vel eu ante. Quisque interdum ipsum a ante 
                lacinia, a vehicula quam gravida. In hac habitasse.
              </p>
            </div>

            {/* Work Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {isLoadingWork ? (
                // Loading skeleton
                [...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-card/50 animate-pulse"></div>
                ))
              ) : (
                // Work posts grid
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

        {/* Right Panel - CV Table & Blog Teasers */}
        <ScrollArea className="w-full md:w-1/2 h-[calc(100vh-4rem)] bg-card">
          <div className="p-8">
            {/* CV Table */}
            <div className="mb-12">
              <h2 className="brutalist-heading mb-8">Experience</h2>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">2023 - Present</TableCell>
                    <TableCell>
                      <span className="font-bold">Senior Art Director</span>
                      <br />
                      <span className="text-muted-foreground">Creative Agency XYZ</span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">2020 - 2023</TableCell>
                    <TableCell>
                      <span className="font-bold">Art Director</span>
                      <br />
                      <span className="text-muted-foreground">Design Studio ABC</span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">2018 - 2020</TableCell>
                    <TableCell>
                      <span className="font-bold">Senior Designer</span>
                      <br />
                      <span className="text-muted-foreground">Digital Agency DEF</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Blog Teasers */}
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
                      <p className="brutalist-text line-clamp-3">
                        {post.content}
                      </p>
                    </article>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-12">
              <Link to="/blog" className="brutalist-link text-sm">
                Blog Archive →
              </Link>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Index;