import fs from "fs";
import path from "path";
import matter from "gray-matter";
import nodesData from "@/content/nodes.json";
import relationsData from "@/content/relations.json";
import type { Article, Node, Relation } from "@/types/content";

const articlesDir = path.join(process.cwd(), "content/articles");

export function getNodes(): Node[] {
  return nodesData.nodes as Node[];
}

export function getRelations(): Relation[] {
  return relationsData.relations as Relation[];
}

export function getMainNodes(): Node[] {
  return getNodes().filter((n) => n.isMainNode);
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  const articles = files.map((filename) => {
    const filePath = path.join(articlesDir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
      ...(data as Omit<Article, "content">),
      content,
    } as Article;
  });

  return articles.filter((a) => a.status === "published");
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(articlesDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    ...(data as Omit<Article, "content">),
    content,
  } as Article;
}
