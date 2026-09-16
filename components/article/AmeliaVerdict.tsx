import type { IndicatorItem, Verdict } from "@/types/content";

interface AmeliaVerdictProps {
  verdict: Verdict;
  indicators: IndicatorItem[];
}

export default function AmeliaVerdict({ verdict, indicators }: AmeliaVerdictProps) {
  const basedOnLabels = verdict.basedOn
    .map((key) => indicators.find((i) => i.key === key)?.label)
    .filter(Boolean);

  return (
    <section
      style={{
        maxWidth: "680px",
        margin: "48px auto",
        padding: "32px 28px",
        background: "var(--color-bg-accent, rgba(0,0,0,0.02))",
        borderRadius: "4px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "13px",
          letterSpacing: "0.1em",
          color: "var(--color-text-muted)",
          marginBottom: "16px",
        }}
      >
        アメリアのお嬢様認定
      </p>
      <p
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "19px",
          lineHeight: 1.8,
          color: "var(--color-text)",
        }}
      >
        {verdict.text}
      </p>
      {basedOnLabels.length > 0 && (
        <p
          style={{
            marginTop: "16px",
            fontSize: "12px",
            color: "var(--color-text-muted)",
          }}
        >
          根拠：{basedOnLabels.join("・")}
        </p>
      )}
    </section>
  );
}
