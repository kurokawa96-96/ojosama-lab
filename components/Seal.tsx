"use client";

export default function Seal({
  sealType,
  sealLabel,
}: {
  sealType: "seal-tensho" | "seal-kaisho";
  sealLabel?: string;
}) {
  return (
    <div className="seal-container fade-in">
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            border: "2px solid var(--color-seal)",
            color: "var(--color-seal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "serif",
            fontSize: "26px",
            margin: "0 auto",
          }}
        >
          嬢
        </div>
        {sealLabel ? (
          <p
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "var(--color-text-muted)",
              letterSpacing: "0.1em",
            }}
          >
            {sealLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
