import { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save } from "lucide-react";

interface WorkIntroSectionProps {
  introBio: any;
  isLoading: boolean;
  onSave: (id: string, title: string, content: string) => void;
}

export const WorkIntroSection = ({ introBio, isLoading, onSave }: WorkIntroSectionProps) => {
  const { session } = useSessionContext();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");

  const handleEdit = (section: any) => {
    setEditingSection(section.id);
    setEditedContent(section.content);
    setEditedTitle(section.title || "");
  };

  const handleSave = async (id: string) => {
    onSave(id, editedTitle, editedContent);
    setEditingSection(null);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-24 bg-muted rounded"></div>
      </div>
    );
  }

  if (!introBio) return null;

  return (
    <div className="mb-16">
      {editingSection === introBio.id ? (
        <div className="space-y-4">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Section Title"
            className="max-w-md"
          />
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={() => handleSave(introBio.id)} className="mr-2">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={() => setEditingSection(null)}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="relative group">
          {introBio.title && <h2 className="brutalist-subheading mb-4">{introBio.title}</h2>}
          <p className="brutalist-text text-muted-foreground mb-8 max-w-3xl">{introBio.content}</p>
          {session && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleEdit(introBio)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};