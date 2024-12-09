import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Save, X } from "lucide-react";
import type { BlogPost } from "@/types/blog";

interface BlogPostEditorProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const BlogPostEditor = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel,
}: BlogPostEditorProps) => {
  return (
    <div className="space-y-4 mt-4">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="brutalist-subheading bg-background"
      />
      <Textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="min-h-[100px] brutalist-text bg-background"
      />
      <div className="space-x-2">
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};