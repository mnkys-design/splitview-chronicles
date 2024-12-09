import { Link } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthClick = async () => {
    if (session) {
      await supabase.auth.signOut();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Auth Button - Now in top right */}
      <div className="fixed top-4 right-4 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAuthClick}
                className="hover:bg-background/80 transition-colors"
              >
                {session ? (
                  <Unlock className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{session ? 'Sign Out' : 'Sign In'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <main className="flex-1">
        {children}
      </main>
      
      {/* Persistent Bottom Navigation */}
      <nav className="h-16 border-t border-muted flex items-center justify-between px-8 bg-background/80 backdrop-blur-sm fixed bottom-0 left-0 right-0">
        <Link to="/work" className="hover:text-muted-foreground transition-colors">
          Work Index
        </Link>
        <Link to="/" className="hover:text-muted-foreground transition-colors">
          Maximus Gravida
        </Link>
        <Link to="/blog" className="hover:text-muted-foreground transition-colors">
          Blog Archive
        </Link>
      </nav>
    </div>
  );
};

export default Layout;