interface RedactedContentProps {
  length?: number;
}

export const RedactedContent = ({ length = 100 }: RedactedContentProps) => {
  const redactedText = "XX REDACTED XX // -- ";  // 18 characters including spaces
  const repetitions = Math.ceil(length / redactedText.length);
  const fullText = redactedText.repeat(repetitions);
  const truncatedText = fullText.slice(0, length);
  
  return (
    <span className="font-mono text-muted-foreground leading-tight text-sm">
      {truncatedText}
    </span>
  );
};