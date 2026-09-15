"use client";

import type { Node } from "@/types/content";

interface EtcPanelProps {
  open: boolean;
  nodes: Node[];
  onClose: () => void;
}

export default function EtcPanel({ open, nodes, onClose }: EtcPanelProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0, 0, 0, 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          padding: "24px 28px",
          minWidth: "240px",
          maxWidth: "320px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mincho)",
            fontSize: "14px",
            color: "var(--color-text-muted)",
            marginBottom: "12px",
          }}
        >
          その他の研究
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {nodes.map((n) => (
            <li
              key={n.id}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid var(--color-border)",
                fontFamily: "var(--font-mincho)",
                fontSize: "15px",
                color: "var(--color-text)",
                cursor: "pointer",
              }}
            >
              {n.label}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          style={{
            marginTop: "16px",
            background: "none",
            border: "none",
            color: "var(--color-accent)",
            fontFamily: "var(--font-mincho)",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
