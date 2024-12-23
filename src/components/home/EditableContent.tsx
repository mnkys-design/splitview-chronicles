import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Save, X, Eye, EyeOff } from "lucide-react";
import { RedactedContent } from "@/components/RedactedContent";

interface EditableContentProps {
  section: any;
  editingSection: string | null;
  editedContent: string;
  editedTitle: string;
  isPrivate: boolean;
  session: any;
  onEdit: (section: any) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  setEditedTitle: (title: string) => void;
  setEditedContent: (content: string) => void;
  setIsPrivate: (isPrivate: boolean) => void;
}

export const EditableContent = ({
  section,
  editingSection,
  editedContent,
  editedTitle,
  isPrivate,
  session,
  onEdit,
  onSave,
  onCancel,
  setEditedTitle,
  setEditedContent,
  setIsPrivate,
}: EditableContentProps) => {
  const isEditing = editingSection === section.id;
  const showFullContent = !section.private || session;

  if (!session && section.private) {
    return (
      <>
        {section.title && <h2 className="brutalist-subheading mb-4">{section.title}</h2>}
        <p className="brutalist-text text-muted-foreground mb-8">
          <RedactedContent length={section.content.length} />
        </p>
      </>
    );
  }

  if (!session) {
    return (
      <>
        {section.title && <h2 className="brutalist-subheading mb-4">{section.title}</h2>}
        <p className="brutalist-text text-muted-foreground mb-8">{section.content}</p>
      </>
    );
  }

  return isEditing ? (
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
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          checked={isPrivate}
          onCheckedChange={setIsPrivate}
          id="private-mode"
        />
        <label htmlFor="private-mode" className="text-sm">
          Private Content
        </label>
        {isPrivate ? <EyeOff className="h-4 w-4 ml-2" /> : <Eye className="h-4 w-4 ml-2" />}
      </div>
      <div className="space-x-2">
        <Button onClick={() => onSave(section.id)}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  ) : (
    <div className="relative group">
      <div className="flex items-center mb-4">
        {section.title && <h2 className="brutalist-subheading">{section.title}</h2>}
        {section.private && <EyeOff className="h-4 w-4 ml-2 text-muted-foreground" />}
      </div>
      <p className="brutalist-text text-muted-foreground mb-8">{section.content}</p>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onEdit(section)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
};