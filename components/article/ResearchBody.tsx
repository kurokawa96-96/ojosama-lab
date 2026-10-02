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
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: "19px",
                fontWeight: 600,
                marginTop: "36px",
                marginBottom: "12px",
                paddingBottom: "8px",
                borderBottom: "1px solid var(--color-border)",
                letterSpacing: "0.05em",
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                marginTop: "28px",
                marginBottom: "10px",
                color: "var(--color-accent)",
              }}
            >
              {children}
            </h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </section>
  );
}
