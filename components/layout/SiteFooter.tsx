"use client";

import Link from "next/link";
import Image from "next/image";

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
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image
          src="/logo.png"
          alt="お嬢様研究所"
          width={220}
          height={130}
          priority
          style={{ height: "36px", width: "auto" }}
        />
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
