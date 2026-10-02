import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getFile, deleteFile, putFile } from "@/lib/github";

function isAuthed() {
  const session = cookies().get("admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
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
