import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, X } from "lucide-react";

const NewWorkPost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createPost = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('work_posts')
        .insert([{ 
          title, 
          description
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Work post created successfully",
      });
      navigate(`/work/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create work post",
        variant: "destructive",
      });
      console.error('Error creating work post:', error);
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    createPost.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="brutalist-container py-12">
          <h1 className="brutalist-heading mb-8">Create New Work Post</h1>
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="brutalist-subheading bg-background"
                placeholder="Enter work title..."
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px] brutalist-text bg-background"
                placeholder="Write your work description here..."
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => navigate('/work')}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default NewWorkPost;