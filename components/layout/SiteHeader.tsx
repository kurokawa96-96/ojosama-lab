"use client";

import Link from "next/link";

export default function SiteHeader() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "16px",
          color: "var(--color-text)",
          textDecoration: "none",
          letterSpacing: "0.05em",
        }}
      >
        お嬢様研究所
      </Link>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: "13px",
            color: "var(--color-text-muted)",
            textDecoration: "none",
          }}
        >
          TOP
        </Link>
        <Link
          href="/articles"
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: "13px",
            color: "var(--color-text-muted)",
            textDecoration: "none",
          }}
        >
          記事一覧
        </Link>
      </nav>
    </header>
  );
}
