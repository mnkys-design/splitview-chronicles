import { Link } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      
      {/* Persistent Bottom Navigation */}
      <nav className="h-16 border-t border-muted flex items-center justify-between px-8 bg-background/80 backdrop-blur-sm fixed bottom-0 left-0 right-0">
        <Link to="/work" className="hover:text-muted-foreground transition-colors">
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

export default Layout;