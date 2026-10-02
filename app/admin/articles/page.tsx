"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ArticleSummary {
  slug: string;
  title: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data.articles ?? []))
      .catch(() => setError("記事一覧の取得に失敗しましたわ"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm(`「${slug}」を削除いたします。よろしいですか？`)) return;

    setDeletingSlug(slug);
    setError("");

    const res = await fetch(`/api/admin/articles/${slug}`, { method: "DELETE" });

    setDeletingSlug(null);

    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a.slug !== slug));
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "削除に失敗しましたわ");
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-mincho)", fontSize: "20px" }}>
          記事管理
        </h1>
        <Link
          href="/admin"
          style={{ fontSize: "13px", color: "var(--color-accent)", textDecoration: "none" }}
        >
          + 新規投稿
        </Link>
      </div>

      {loading && <p style={{ color: "var(--color-text-muted)" }}>読み込み中…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {articles.map((a) => (
          <li
            key={a.slug}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span style={{ fontFamily: "var(--font-mincho)", fontSize: "14px" }}>
              {a.title}
            </span>
            <div style={{ display: "flex", gap: "12px" }}>
              <Link
                href={`/admin/articles/${a.slug}/edit`}
                style={{ fontSize: "13px", color: "var(--color-text-muted)", textDecoration: "none" }}
              >
                編集
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(a.slug)}
                disabled={deletingSlug === a.slug}
                style={{
                  fontSize: "13px",
                  color: "crimson",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {deletingSlug === a.slug ? "削除中…" : "削除"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
