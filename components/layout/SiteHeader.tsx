"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const MENU_ITEMS = [
  { href: "/", label: "TOP" },
  { href: "/about", label: "研究所概要" },
  { href: "/members", label: "研究員のご紹介" },
  { href: "/articles", label: "記事一覧" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  // ページを移動したら、メニューを閉じる
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // メニューを開いている間：背面のスクロールを止め、Escキーで閉じられるようにする
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-border)",
          padding: "8px 20px",
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
            style={{ height: "52px", width: "auto" }}
          />
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="メニューを開く"
          aria-expanded={open}
          aria-controls="site-menu"
          style={{
            width: "44px",
            height: "44px",
            marginRight: "-8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text)",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3 7h18M3 12h18M3 17h18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 60,
              background: "rgba(0, 0, 0, 0.35)",
            }}
          />
        )}
        {open && (
          <motion.nav
            key="menu-panel"
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="メニュー"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 61,
              width: "min(80vw, 320px)",
              background: "var(--color-bg)",
              borderLeft: "1px solid var(--color-border)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 12px 4px" }}>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="メニューを閉じる"
                style={{
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </button>
            </div>

            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {MENU_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    style={{
                      display: "block",
                      padding: "16px 28px",
                      fontFamily: "var(--font-mincho)",
                      fontSize: "16px",
                      letterSpacing: "0.08em",
                      textDecoration: "none",
                      color: isActive(item.href) ? "var(--color-accent)" : "var(--color-text)",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "auto", padding: "32px 0", textAlign: "center" }}>
              <img
                src="/seals/seal-tensho.png"
                alt=""
                style={{ width: "44px", height: "44px", objectFit: "contain", opacity: 0.7 }}
              />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
