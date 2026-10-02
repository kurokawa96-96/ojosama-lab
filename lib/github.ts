/** 指定パスにファイルを新規作成・更新する */
export async function putFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({
        message,
        content: Buffer.from(content, "utf-8").toString("base64"),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub更新失敗: ${res.status} ${err}`);
  }
}

export async function deleteFile(path: string, message: string, sha: string): Promise<void> {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: "DELETE",
      headers: headers(),
      body: JSON.stringify({ message, sha, branch: BRANCH }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub削除失敗: ${res.status} ${err}`);
  }
}
