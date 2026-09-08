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
      <body>{children}</body>
    </html>
  );
}
