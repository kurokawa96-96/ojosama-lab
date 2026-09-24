import Image from "next/image";

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
      {sealLabel && (
        <p style={{ fontFamily: "var(--font-mincho)", fontSize: "14px", color: "var(--color-text)", marginTop: "8px" }}>
          {sealLabel}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
        <Image
          src={`/seals/${sealType}.png`}
          alt="落款"
          width={100}
          height={100}
          loading="lazy"
          quality={60}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
