"use client";

import { Handle, Position } from "reactflow";

export default function OjosamaNode({
  data,
}: {
  data: { label: string; isCenter?: boolean; selected?: boolean };
}) {
  return (
    <div
      style={{
        padding: data.isCenter ? "24px 32px" : "16px 24px",
        borderRadius: "50%",
        border: `1px solid ${
          data.selected ? "var(--color-accent)" : "var(--color-border)"
        }`,
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-serif-jp)",
        fontSize: data.isCenter ? "20px" : "15px",
        fontWeight: data.isCenter ? 600 : 400,
        letterSpacing: "0.05em",
        textAlign: "center",
        boxShadow: data.isCenter
          ? "0 0 0 1px var(--color-accent)"
          : "none",
        transition: "border-color 0.4s ease",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      {data.label}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
