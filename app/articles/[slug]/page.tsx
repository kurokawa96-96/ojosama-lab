import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getArticleBySlug, getAllArticles } from "@/lib/content";
import Seal from "@/components/Seal";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "64px 24px" }}>
      <header style={{ marginBottom: "48px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>
          {article.title}
        </h1>
        {article.excerpt ? (
          <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
            {article.excerpt}
          </p>
        ) : null}
      </header>

      <article style={{ fontSize: "16px" }}>
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </article>

      <Seal sealType={article.sealType} sealLabel={article.sealLabel} />
    </main>
  );
}
