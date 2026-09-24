const OWNER = "kurokawa96-96";
const REPO = "ojosama-lab";
const BRANCH = "main";

const GITHUB_API = "https://api.github.com";

function headers() {
  return {
    Authorization: `Bearer ${process.env.GH_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

/** 指定パスのファイル内容とSHAを取得する。存在しなければnull */
export async function getFile(
  path: string
): Promise<{ content: string; sha: string } | null> {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: headers(), cache: "no-store" }
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub取得失敗: ${res.status}`);

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

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
