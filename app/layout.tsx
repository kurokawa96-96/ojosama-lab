import "./globals.css";
import Script from "next/script";
import { ADSENSE_CLIENT_ID } from "@/lib/ads";

export const metadata = {
  title: "お嬢様研究所 | OJOSAMA LABORATORY",
  description: "「お嬢様」という現象を研究するWebサイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600&family=EB+Garamond:ital@0;1&display=swap"
          rel="stylesheet"
        />
        {ADSENSE_CLIENT_ID && (
  <Script
    async
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
    crossOrigin="anonymous"
    strategy="afterInteractive"
  />
)}
      </head>
      <body>{children}</body>
    </html>
  );
}
