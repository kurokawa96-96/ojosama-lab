"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("パスワードが違いますわ");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "280px",
          padding: "32px",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: "15px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          お嬢様研究所 管理ページ
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
          }}
        />
        {error && (
          <p style={{ color: "crimson", fontSize: "13px", marginBottom: "12px" }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "var(--color-accent)",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "確認中…" : "ログイン"}
        </button>
      </form>
    </div>
  );
}
