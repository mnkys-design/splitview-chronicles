import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Work from "./pages/Work";
import Blog from "./pages/Blog";
import WorkPost from "./pages/WorkPost";
import BlogPost from "./pages/BlogPost";
import CV from "./pages/CV";
import Auth from "./pages/Auth";
import NewBlogPost from "./pages/NewBlogPost";
import NewWorkPost from "./pages/NewWorkPost";
import ImpressData from "./pages/ImpressData";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSessionContext();
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/work" element={<Work />} />
            <Route 
              path="/work/new" 
              element={
                <ProtectedRoute>
                  <NewWorkPost />
                </ProtectedRoute>
              } 
            />
            <Route path="/work/:id" element={<WorkPost />} />
            <Route path="/blog" element={<Blog />} />
            <Route 
              path="/blog/new" 
              element={
                <ProtectedRoute>
                  <NewBlogPost />
                </ProtectedRoute>
              } 
            />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/impress" element={<ImpressData />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;