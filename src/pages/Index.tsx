import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const Index = () => {
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
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-card diagonal-line"></div>
              ))}
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
              {[...Array(3)].map((_, i) => (
                <article key={i} className="p-4 bg-background/5 rounded-sm">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <time>{`07-${24 + i}-00024`}</time>
                    <span>(094)</span>
                  </div>
                  <p className="brutalist-text">
                    Aenean ut bibendum ipsum. Nam vitae felis diam. Aenean ligula ligula, malesuada et
                    volutpat ullamcorper, convallis quis dolor. Quisque elit Avellit.
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-12">
              <Link to="/blog" className="brutalist-link text-sm">
                Blog Archive →
              </Link>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Bottom Navigation */}
      <nav className="h-16 border-t border-muted flex items-center justify-between px-8 bg-background/80 backdrop-blur-sm fixed bottom-0 left-0 right-0">
        <Link to="/" className="hover:text-muted-foreground transition-colors">
          Work Index
        </Link>
        <Link to="/" className="hover:text-muted-foreground transition-colors">
          Lorem Ipsum
        </Link>
        <Link to="/blog" className="hover:text-muted-foreground transition-colors">
          Blog Archive
        </Link>
      </nav>
    </div>
  );
};

export default Index;