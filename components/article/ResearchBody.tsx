interface ResearchBodyProps {
  html: string;
}

export default function ResearchBody({ html }: ResearchBodyProps) {
  return (
    <section
      style={{
        fontFamily: "var(--font-mincho)",
        fontSize: "16px",
        lineHeight: 1.9,
        color: "var(--color-text)",
        maxWidth: "680px",
        margin: "0 auto",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
