import Link from "next/link";
import { notFound } from "next/navigation";
import { getMainNodes } from "@/lib/nodes";
import { getAllArticles } from "@/lib/content";
import { CATEGORY_DESCRIPTIONS } from "@/lib/categoryMeta";
import ArticleHeader from "@/components/article/ArticleHeader";

const isCategory = (type: string) => type === "category" || type === "etc-collector";

const findCategory = (id: string) =>
  getMainNodes().find((n) => n.id === id && isCategory(n.type));

export function generateStaticParams() {
  return getMainNodes()
    .filter((n) => isCategory(n.type))
    .map((n) => ({ id: n.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const node = findCategory(params.id);
  return { title: node ? `${node.label} | お嬢様研究所` : "お嬢様研究所" };
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const node = findCategory(params.id);
  if (!node) notFound();

  const articles = getAllArticles()
    .filter((a) => a.categories?.includes(node.id))
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
    );
  const description = CATEGORY_DESCRIPTIONS[node.id];

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "72px 24px 64px" }}>
      <ArticleHeader />

      <h1
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "22px",
          textAlign: "center",
          margin: "16px 0 12px",
          color: "var(--color-text)",
        }}
      >
        {node.label}
      </h1>
      {description && (
        <p
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: "13px",
            lineHeight: 1.9,
            textAlign: "center",
            color: "var(--color-text-muted)",
            marginBottom: "36px",
          }}
        >
          {description}
        </p>
      )}

      {articles.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: "14px",
            textAlign: "center",
            color: "var(--color-text-muted)",
            padding: "32px 0",
          }}
        >
          記事は準備中でございますわ
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {articles.map((a) => (
            <li
              key={a.slug}
              style={{ padding: "20px 0", borderBottom: "1px solid var(--color-border)" }}
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
      )}
    </main>
  );
}
