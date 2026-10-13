import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        padding: "32px 20px",
        textAlign: "center",
      }}
    >
      <img
        src="/seals/seal-tensho.png"
        alt="お嬢様研究所"
        style={{ width: "40px", height: "40px", objectFit: "contain", opacity: 0.7 }}
      />
      <nav style={{ marginTop: "12px", display: "flex", justifyContent: "center", gap: "20px" }}>
        <Link
          href="/contact"
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: "12px",
            color: "var(--color-text-muted)",
            textDecoration: "none",
          }}
        >
          お問い合わせ
        </Link>
      </nav>
      <p
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "11px",
          color: "var(--color-text-muted)",
          marginTop: "8px",
        }}
      >
        © {new Date().getFullYear()} お嬢様研究所
      </p>
    </footer>
  );
}
