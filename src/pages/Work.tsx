import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { WorkIntroSection } from "@/components/work/WorkIntroSection";
import { SkillsGrid } from "@/components/work/SkillsGrid";
import { WorkGrid } from "@/components/work/WorkGrid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const queryClient = useQueryClient();

  const { data: workPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['workPosts'],
    queryFn: fetchWorkPosts,
  });

  const { data: introBio, isLoading: isLoadingIntro } = useQuery({
    queryKey: ['contentSection', 'intro_bio'],
    queryFn: () => fetchContentSection('intro_bio'),
  });

  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string, title: string, content: string }) => {
      const { error } = await supabase
        .from('content_sections')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSection'] });
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
      console.error('Error updating content:', error);
    },
  });

  const handleSave = async (id: string, title: string, content: string) => {
    updateContentMutation.mutate({ id, title, content });
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="brutalist-container py-12">
          <div className="flex justify-between items-center mb-12">
            <h1 className="brutalist-heading">Work</h1>
            {session && (
              <Button onClick={() => navigate('/work/new')} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                New Work
              </Button>
            )}
          </div>
          
          <WorkIntroSection 
            introBio={introBio} 
            isLoading={isLoadingIntro}
            onSave={handleSave}
          />
          
          <SkillsGrid 
            skills={skills} 
            isLoading={isLoadingSkills}
          />

          <WorkGrid 
            workPosts={workPosts} 
            isLoading={isLoadingPosts}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Work;
