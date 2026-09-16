interface SealProps {
  sealType: "seal-tensho" | "seal-kaisho";
  sealLabel?: string;
}

export default function Seal({ sealType, sealLabel }: SealProps) {
  return (
    <div
      style={{
        maxWidth: "680px",
        margin: "40px auto 80px",
        textAlign: "right",
        paddingRight: "28px",
      }}
    >
      <p style={{ fontFamily: "var(--font-mincho)", fontSize: "14px", color: "var(--color-text-muted)" }}>
        Amelia Clarissa
      </p>
      <p style={{ fontFamily: "var(--font-mincho)", fontSize: "12px", color: "var(--color-text-muted)" }}>
        お嬢様研究所 主席研究員
      </p>
      <p style={{ fontFamily: "var(--font-mincho)", fontSize: "14px", color: "var(--color-text)", marginTop: "8px" }}>
        {sealLabel ?? "認定いたしますわ。"}
      </p>
      <p style={{ fontSize: "20px", marginTop: "4px" }}>🌹</p>
    </div>
  );
}
