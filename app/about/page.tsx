export const metadata = { title: "研究所概要 | お嬢様研究所" };

const AREAS = ["歴史", "文化", "社会・思想", "定義", "ですわ探訪", "その他の研究"];

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-mincho)",
  fontSize: "17px",
  fontWeight: 600,
  marginTop: "40px",
  marginBottom: "12px",
  paddingBottom: "8px",
  borderBottom: "1px solid var(--color-border)",
  color: "var(--color-text)",
};

const bodyText: React.CSSProperties = {
  fontFamily: "var(--font-mincho)",
  fontSize: "15px",
  lineHeight: 1.9,
  color: "var(--color-text)",
};

const todoText: React.CSSProperties = {
  ...bodyText,
  color: "var(--color-text-muted)",
};

export default function AboutPage() {
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
        研究所概要
      </h1>

      <p style={bodyText}>
        お嬢様研究所は、「お嬢様」を単なるキャラクター属性として紹介するサイトではございません。
        歴史、階級、文化、言葉、フィクション——それらを横断しながら、「お嬢様とは何なのか」を共に探検する場所として、この研究所は開かれました。
      </p>

      <h2 style={sectionTitle}>研究領域</h2>
      <ul style={{ ...bodyText, paddingLeft: "1.4em", margin: 0 }}>
        {AREAS.map((area) => (
          <li key={area}>{area}</li>
        ))}
      </ul>

      <h2 style={sectionTitle}>研究の方針</h2>
      <p style={todoText}>（研究にあたっての姿勢や、事実と仮説の扱い方などを、ここにお書きくださいませ）</p>

      <h2 style={sectionTitle}>運営者情報</h2>
      <p style={todoText}>（運営者のお名前または屋号、運営開始年月などを、ここにお書きくださいませ）</p>
    </main>
  );
}
