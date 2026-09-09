import "./globals.css";

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
      </head>
      <body>{children}</body>
    </html>
  );
}
