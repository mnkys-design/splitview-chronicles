import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import EditableContent from "./EditableContent";

interface RightPanelProps {
  blogPosts: any[];
  isLoadingBlog: boolean;
  seniorDirector: any;
  artDirector: any;
  education: any;
  onSave: (id: string, title: string, content: string) => void;
}

const RightPanel = ({ 
  blogPosts, 
  isLoadingBlog, 
  seniorDirector,
  artDirector,
  education,
  onSave 
}: RightPanelProps) => {
  return (
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
                  <EditableContent section={seniorDirector} onSave={onSave} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">2020 - 2023</TableCell>
                <TableCell>
                  <EditableContent section={artDirector} onSave={onSave} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">2018 - 2020</TableCell>
                <TableCell>
                  <EditableContent section={education} onSave={onSave} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Blog Teasers */}
        <div className="space-y-8">
          <h3 className="brutalist-subheading mb-6">Latest Posts</h3>
          {isLoadingBlog ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-background/5 rounded-sm animate-pulse">
                <div className="h-4 bg-background/10 rounded w-1/3 mb-2"></div>
                <div className="h-16 bg-background/10 rounded"></div>
              </div>
            ))
          ) : (
            blogPosts?.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <article className="p-4 bg-background/5 rounded-sm hover:bg-background/10 transition-colors">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <time>{new Date(post.published_at).toLocaleDateString()}</time>
                    <span>({String(post.id).slice(-3)})</span>
                  </div>
                  <h4 className="font-bold mb-2">{post.title}</h4>
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
  );
};

export default RightPanel;