import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Article } from "@/types/content";

const articlesDir = path.join(process.cwd(), "content/articles");

function toArticle(data: unknown, content: string): Article {
  const article = data as Partial<Omit<Article, "content">>;

  return {
    ...article,
    indicators: article.indicators ?? [],
    verdict: article.verdict ?? { type: "conditional", text: "", basedOn: [] },
    content,
  } as Article;
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  const articles = files.map((filename) => {
    const filePath = path.join(articlesDir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return toArticle(data, content);
  });

  return articles.filter((a) => a.status === "published");
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(articlesDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return toArticle(data, content);
}
