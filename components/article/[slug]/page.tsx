import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/content";
import ResearchBody from "@/components/article/ResearchBody";
import IndicatorPanel from "@/components/article/IndicatorPanel";
import AmeliaVerdict from "@/components/article/AmeliaVerdict";
import Seal from "@/components/article/Seal";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  return (
    <main style={{ padding: "64px 24px" }}>
      <h1
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "26px",
          textAlign: "center",
          marginBottom: "48px",
          color: "var(--color-text)",
        }}
      >
        {article.title}
      </h1>

      <ResearchBody content={article.content} />
      <IndicatorPanel items={article.indicators} />
      <AmeliaVerdict verdict={article.verdict} indicators={article.indicators} />
      <Seal sealType={article.sealType} sealLabel={article.sealLabel} />
    </main>
  );
}
