import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import matter from "gray-matter";
import { getFile, putFile } from "@/lib/github";
import type { IndicatorItem, Verdict } from "@/types/content";

function isAuthed() {
  const session = cookies().get("admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function POST(request: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "ログインが必要ですわ" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, excerpt, categoryId, content, indicators, verdict } = body as {
    title: string;
    slug: string;
    excerpt: string;
    categoryId: string;
    content: string;
    indicators: IndicatorItem[];
    verdict: Verdict;
  };

  if (!title || !slug) {
    return NextResponse.json({ error: "タイトルとスラッグは必須ですわ" }, { status: 400 });
  }

  const now = new Date().toISOString();

  const frontmatter = {
    id: slug,
    title,
    slug,
    status: "published",
    publishedAt: now,
    updatedAt: now,
    excerpt,
    categories: [categoryId],
    tags: [],
    relatedNodes: [slug],
    relatedArticles: [],
    sealType: body.sealType ?? "seal-tensho",
    sealLabel: "",
    sectionType: "research",
    coverImage: null,
    indicators,
    verdict,
  };

  const fileContent = matter.stringify(content, frontmatter);

  try {
    await putFile(
      `content/articles/${slug}.md`,
      fileContent,
      `記事投稿: ${title}`
    );
  } catch (e) {
    return NextResponse.json({ error: "記事ファイルの作成に失敗しましたわ" }, { status: 500 });
  }

  try {
    const nodesFile = await getFile("content/nodes.json");
    if (!nodesFile) throw new Error("nodes.json not found");

    const nodesData = JSON.parse(nodesFile.content);

    if (!nodesData.nodes.some((n: { id: string }) => n.id === slug)) {
      nodesData.nodes.push({
        id: slug,
        label: title,
        type: "concept",
        isMainNode: false,
        parentNode: categoryId,
      });
    }

    await putFile(
      "content/nodes.json",
      JSON.stringify(nodesData, null, 2),
      `ノード追加: ${title}`,
      nodesFile.sha
    );
  } catch (e) {
    return NextResponse.json(
      { error: "記事は保存されましたが、ノードへの接続に失敗しましたわ。お手数ですが手動でnodes.jsonをご確認くださいませ" },
      { status: 207 }
    );
  }

  return NextResponse.json({ ok: true });
}
