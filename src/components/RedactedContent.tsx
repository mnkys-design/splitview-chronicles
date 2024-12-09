interface RedactedContentProps {
  length?: number;
}

export const RedactedContent = ({ length = 100 }: RedactedContentProps) => {
  const blocks = '█'.repeat(length);
  return <span className="font-mono text-muted-foreground">{blocks}</span>;
};