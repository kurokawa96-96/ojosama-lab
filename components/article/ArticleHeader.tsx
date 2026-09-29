import Link from "next/link";

export default function ArticleHeader() {
  return (
    <header
      style={{
        maxWidth: "680px",
        margin: "0 auto 24px",
        padding: "0 4px",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "13px",
          color: "var(--color-text-muted)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        ← お嬢様研究所 TOPへ戻る
      </Link>
    </header>
  );
}
