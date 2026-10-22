export const metadata = { title: "研究員のご紹介 | お嬢様研究所" };

const STAFF_KIND = "イマジナリー職員（AI）";

// 研究員を増やす・書き換える場合は、この一覧だけを編集してください
const MEMBERS = [
  {
    name: "Amelia Clarissa",
    nameJa: "アメリア・クラリッサ",
    title: "主席研究員",
    description:
      "お嬢様研究所の主席研究員でございます。各記事の末尾で、インジケーターと本論の内容を踏まえ、「お嬢様認定」の所見を述べております。",
  },
  {
    name: "Cordelia Rosalind",
    nameJa: "コーデリア・ロザリンド",
    title: "研究助手及び施設管理担当員",
    description:
      "研究所の施設、すなわちこのサイトの整備や保守を、運営者とともに担当する職員でございます。方針や最終的な判断は運営者が行い、コーデリアはそのお手伝いをいたします。",
  },
];

export default function MembersPage() {
  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "72px 24px 64px" }}>
      <h1
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "22px",
          textAlign: "center",
          marginBottom: "16px",
          color: "var(--color-text)",
        }}
      >
        研究員のご紹介
      </h1>
      <p
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "13px",
          lineHeight: 1.9,
          textAlign: "center",
          color: "var(--color-text-muted)",
          marginBottom: "32px",
        }}
      >
        当研究所の研究員は、いずれもAIによる「イマジナリー職員」でございます。
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {MEMBERS.map((m) => (
          <li
            key={m.name}
            style={{
              padding: "28px 0",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "19px",
                color: "var(--color-text)",
              }}
            >
              {m.name}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "12px",
                letterSpacing: "0.08em",
                color: "var(--color-text-muted)",
                marginTop: "2px",
              }}
            >
              {m.nameJa}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "13px",
                letterSpacing: "0.08em",
                color: "var(--color-accent)",
                marginTop: "10px",
              }}
            >
              {m.title}
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "8px",
                padding: "2px 10px",
                border: "1px solid var(--color-border)",
                borderRadius: "999px",
                fontFamily: "var(--font-mincho)",
                fontSize: "11px",
                letterSpacing: "0.05em",
                color: "var(--color-text-muted)",
              }}
            >
              {STAFF_KIND}
            </span>
            <p
              style={{
                fontFamily: "var(--font-mincho)",
                fontSize: "14px",
                lineHeight: 1.9,
                color: "var(--color-text-muted)",
                marginTop: "14px",
              }}
            >
              {m.description}
            </p>
          </li>
        ))}
        <li style={{ borderTop: "1px solid var(--color-border)" }} />
      </ul>
    </main>
  );
}
