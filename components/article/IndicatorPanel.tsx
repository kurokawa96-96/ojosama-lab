import type { IndicatorItem } from "@/types/content";

const strengthLabel: Record<IndicatorItem["strength"], string> = {
  strong: "強",
  medium: "中",
  weak: "弱",
  none: "該当なし",
};

interface IndicatorPanelProps {
  items: IndicatorItem[];
}

export default function IndicatorPanel({ items }: IndicatorPanelProps) {
  return (
    <section
      style={{
        maxWidth: "680px",
        margin: "48px auto",
        border: "1px solid var(--color-border)",
        borderRadius: "4px",
        padding: "24px 28px",
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
        お嬢様インジケーター
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li
            key={item.key}
            style={{
              display: "flex",
              gap: "16px",
              padding: "10px 0",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span
              style={{
                minWidth: "88px",
                fontFamily: "var(--font-mincho)",
                fontSize: "14px",
                color: "var(--color-text)",
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                minWidth: "40px",
                fontSize: "13px",
                color: "var(--color-accent)",
              }}
            >
              {strengthLabel[item.strength]}
            </span>
            <span
              style={{
                flex: 1,
                fontSize: "13px",
                color: "var(--color-text-muted)",
                lineHeight: 1.7,
              }}
            >
              {item.note}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
