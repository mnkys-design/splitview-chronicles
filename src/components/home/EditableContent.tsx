import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, X, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { RedactedContent } from "@/components/RedactedContent";

interface EditableContentProps {
  section: any;
  onSave: (id: string, title: string, content: string) => void;
}

const EditableContent = ({ section, onSave }: EditableContentProps) => {
  const { session } = useSessionContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(section?.title || "");
  const [editedContent, setEditedContent] = useState(section?.content || "");
  const [isPrivate, setIsPrivate] = useState(section?.private || false);

  if (!session && section?.private) {
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
        {section?.title && <h2 className="brutalist-subheading mb-4">{section.title}</h2>}
        <p className="brutalist-text text-muted-foreground mb-8">{section?.content}</p>
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
        <Button onClick={() => {
          onSave(section.id, editedTitle, editedContent);
          setIsEditing(false);
        }}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  ) : (
    <div className="relative group">
      <div className="flex items-center mb-4">
        {section?.title && <h2 className="brutalist-subheading">{section.title}</h2>}
        {section?.private && <EyeOff className="h-4 w-4 ml-2 text-muted-foreground" />}
      </div>
      <p className="brutalist-text text-muted-foreground mb-8">{section?.content}</p>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => {
          setEditedTitle(section?.title || "");
          setEditedContent(section?.content || "");
          setIsPrivate(section?.private || false);
          setIsEditing(true);
        }}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditableContent;