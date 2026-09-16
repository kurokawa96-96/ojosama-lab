import ReactMarkdown from "react-markdown";

interface ResearchBodyProps {
  content: string;
}

export default function ResearchBody({ content }: ResearchBodyProps) {
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
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </section>
  );
}
