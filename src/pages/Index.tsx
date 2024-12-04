import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

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

        {/* Right Panel - Blog Posts */}
        <ScrollArea className="w-full md:w-1/2 h-[calc(100vh-4rem)] bg-card">
          <div className="p-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="brutalist-heading">chrustek.AI</h2>
              <a href="https://instagram.com" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>

            <div className="mb-8">
              <h2 className="brutalist-heading mb-4">Michael Chruściński</h2>
              <div className="flex gap-8 text-sm text-muted-foreground mb-8">
                <span>Senior Art Director</span>
                <span>AI, Generative, Generative Art</span>
                <span>Gravida</span>
              </div>
              <p className="brutalist-text mb-12">
                Nulla ipsum augue, viverra ac neque a, gravida tempus tellus. Nam vitae nisl risus.
                Pellentes que ex libero pharetra sodales vel eu ante. Quisque interdum ipsum a ante
                lacinia, a vehicula quam gravida.
              </p>
            </div>

            <div className="space-y-8">
              {[...Array(5)].map((_, i) => (
                <article key={i} className="p-4 bg-background/5 rounded-sm">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <time>{`07-${24 + i}-00024`}</time>
                    <span>(094)</span>
                  </div>
                  <p className="brutalist-text">
                    Aenean ut bibendum ipsum. Nam vitae felis diam. Aenean ligula ligula, malesuada et
                    volutpat ullamcorper, convallis quis dolor. Quisque elit Avellit, efficitur eu erat non,
                    suscipit consectetur neque.
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-12">
              <p className="brutalist-text mb-4">
                Nulla ipsum augue, viverra ac neque a, gravida tempus tellus. Nam vitae nisl risus.
                Pellentes que ex libero pharetra sodales vel eu ante. Quisque interdum ipsum a ante
                lacinia, a vehicula quam gravida. In hac habitasse platea dictum deus est.
              </p>
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