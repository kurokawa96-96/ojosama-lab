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
      <p style={todoText}>お嬢様という人物像を入り口に、言葉・歴史・文化・社会を読み解く。

身近な表現から歴史的な背景まで、さまざまな視点を結びながら、お嬢様という文化的な記号の意味を探究します。</p>

      <h2 style={sectionTitle}>運営者情報</h2>
      <p style={todoText}>## 運営者情報

**運営：PROJECT EUREKA**

お嬢様研究所は、PROJECT EUREKAが運営する、お嬢様という人物像を多角的に探究する研究サイトです。

言葉・歴史・文化・社会・作品表現など、さまざまな視点から情報を収集・整理し、独自の考察を通じて、お嬢様という文化的な存在への理解を深めることを目指しています。</p>
    </main>
  );
}
