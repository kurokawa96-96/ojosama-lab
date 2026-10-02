import Link from "next/link";
import { getAllArticles } from "@/lib/content";

export default function ArticlesPage() {
  const articles = getAllArticles().sort(
    (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
  );

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "100px 24px 64px" }}>
      <h1
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "22px",
          textAlign: "center",
          marginBottom: "40px",
          color: "var(--color-text)",
        }}
      >
        記事一覧
      </h1>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {articles.map((a) => (
          <li
            key={a.slug}
            style={{
              padding: "20px 0",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <Link
              href={`/articles/${a.slug}`}
              style={{ textDecoration: "none", color: "var(--color-text)" }}
            >
              <p style={{ fontFamily: "var(--font-mincho)", fontSize: "17px" }}>
                {a.title}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-muted)",
                  marginTop: "6px",
                  lineHeight: 1.7,
                }}
              >
                {a.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
