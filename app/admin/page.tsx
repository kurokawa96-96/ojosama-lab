export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "48px" }}>
      <h1 style={{ fontFamily: "var(--font-mincho)", fontSize: "20px" }}>
        管理ページ
      </h1>
      <p style={{ marginTop: "12px", color: "var(--color-text-muted)" }}>
        ログインに成功いたしましたわ。ここに記事投稿フォームを追加してまいります。
      </p>
    </div>
  );
}
