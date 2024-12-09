import { Card, CardContent } from "@/components/ui/card";

interface SkillsGridProps {
  skills: any[];
  isLoading: boolean;
}

export const SkillsGrid = ({ skills, isLoading }: SkillsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-muted animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-background/20 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-background/20 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
      {skills?.map((skill) => (
        <Card key={skill.id} className="bg-muted hover:bg-muted/80 transition-colors">
          <CardContent className="p-4">
            <div className="font-mono text-sm">{skill.skill_name}</div>
            <div className="text-muted-foreground text-xs">{skill.level}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};