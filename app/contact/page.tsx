const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSflwL3d8l2hrVxx5S7jgxmveJAVXYKIhQzr3FD2O0FdF59KAw/viewform?usp=dialog";

export default function ContactPage() {
  const isReady = FORM_URL.startsWith("https://");

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "72px 24px 64px" }}>
      <h1
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "22px",
          textAlign: "center",
          marginBottom: "32px",
          color: "var(--color-text)",
        }}
      >
        お問い合わせ
      </h1>

      <p
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "15px",
          lineHeight: 1.9,
          color: "var(--color-text)",
          marginBottom: "16px",
        }}
      >
        ご意見・ご感想・取材やご提携のご相談など、お嬢様研究所へのお問い合わせは、下記のフォームよりお寄せくださいませ。
      </p>
      <p
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "13px",
          lineHeight: 1.9,
          color: "var(--color-text-muted)",
          marginBottom: "40px",
        }}
      >
        いただいた内容は、運営者のみが拝見いたします。返信をご希望の場合は、フォーム内にメールアドレスをご記入くださいませ。お返事までお時間を頂戴することがございます。
      </p>

      <div style={{ textAlign: "center" }}>
        {isReady ? (
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              background: "var(--color-accent)",
              color: "#fff",
              borderRadius: "4px",
              textDecoration: "none",
              fontFamily: "var(--font-mincho)",
              fontSize: "14px",
              letterSpacing: "0.1em",
            }}
          >
            お問い合わせフォームを開く
          </a>
        ) : (
          <p style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>
            お問い合わせフォームは準備中でございますわ
          </p>
        )}
      </div>
    </main>
  );
}
