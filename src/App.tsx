import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

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
            <Route path="/work/new" element={<NewWorkPost />} />
            <Route path="/work/:id" element={<WorkPost />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/new" element={<NewBlogPost />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;