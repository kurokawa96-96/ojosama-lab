import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import matter from "gray-matter";
import { getFile, deleteFile, putFile } from "@/lib/github";
import type { IndicatorItem, Verdict } from "@/types/content";

function isAuthed() {
  const session = cookies().get("admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "ログインが必要ですわ" }, { status: 401 });
  }

  const { slug } = params;
  const file = await getFile(`content/articles/${slug}.md`);

  if (!file) {
    return NextResponse.json({ error: "記事が見つかりませんでしたわ" }, { status: 404 });
  }

  const { data, content } = matter(file.content);

  return NextResponse.json({ ...data, content });
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "ログインが必要ですわ" }, { status: 401 });
  }

  const { slug } = params;
  const body = await request.json();
  const { title, excerpt, categoryId, content, indicators, verdict, sealType, relatedArticles } = body as {
    title: string;
    excerpt: string;
    categoryId: string;
    content: string;
    indicators: IndicatorItem[];
    verdict: Verdict;
    sealType: "seal-tensho" | "seal-kaisho";
    relatedArticles: string[];
  };

  const existing = await getFile(`content/articles/${slug}.md`);
  if (!existing) {
    return NextResponse.json({ error: "記事が見つかりませんでしたわ" }, { status: 404 });
  }

  const { data: existingData } = matter(existing.content);

  const frontmatter = {
    ...existingData,
    title,
    excerpt,
    categories: [categoryId],
    updatedAt: new Date().toISOString(),
    indicators,
    verdict,
    sealType,
    relatedArticles,
  };

  const fileContent = matter.stringify(content, frontmatter);

  try {
    await putFile(
      `content/articles/${slug}.md`,
      fileContent,
      `記事更新: ${title}`,
      existing.sha
    );
  } catch (e) {
    return NextResponse.json({ error: "記事の更新に失敗しましたわ" }, { status: 500 });
  }

  try {
    const nodesFile = await getFile("content/nodes.json");
    if (nodesFile) {
      const nodesData = JSON.parse(nodesFile.content);
      const node = nodesData.nodes.find((n: { id: string }) => n.id === slug);
      if (node) {
        node.label = title;
        node.parentNode = categoryId;
        await putFile(
          "content/nodes.json",
          JSON.stringify(nodesData, null, 2),
          `ノード更新: ${title}`,
          nodesFile.sha
        );
      }
    }
  } catch (e) {
    return NextResponse.json(
      { error: "記事は更新されましたが、ノードの更新に失敗しましたわ" },
      { status: 207 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "ログインが必要ですわ" }, { status: 401 });
  }

  const { slug } = params;

  const articleFile = await getFile(`content/articles/${slug}.md`);
  if (!articleFile) {
    return NextResponse.json({ error: "記事が見つかりませんでしたわ" }, { status: 404 });
  }

  try {
    await deleteFile(`content/articles/${slug}.md`, `記事削除: ${slug}`, articleFile.sha);
  } catch (e) {
    return NextResponse.json({ error: "記事の削除に失敗しましたわ" }, { status: 500 });
  }

  try {
    const nodesFile = await getFile("content/nodes.json");
    if (nodesFile) {
      const nodesData = JSON.parse(nodesFile.content);
      nodesData.nodes = nodesData.nodes.filter((n: { id: string }) => n.id !== slug);
      await putFile(
        "content/nodes.json",
        JSON.stringify(nodesData, null, 2),
        `ノード削除: ${slug}`,
        nodesFile.sha
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: "記事は削除されましたが、ノードの削除に失敗しましたわ。お手数ですが手動でnodes.jsonをご確認くださいませ" },
      { status: 207 }
    );
  }

  return NextResponse.json({ ok: true });
}
