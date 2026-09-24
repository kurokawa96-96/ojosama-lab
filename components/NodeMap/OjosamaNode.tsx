"use client";

import { Handle, Position } from "reactflow";

export default function OjosamaNode({
  data,
}: {
  data: { label: string; isCenter?: boolean; isSatellite?: boolean; selected?: boolean };
}) {
  const handleStyle = { opacity: 0, pointerEvents: "none" as const };
  return (
    <div
      style={{
        padding: data.isCenter ? "24px 32px" : data.isSatellite ? "10px 16px" : "16px 24px",
        borderRadius: "50%",
        border: `1px solid ${
          data.selected ? "var(--color-accent)" : "var(--color-border)"
        }`,
        background: "var(--color-bg)",
        color: data.isSatellite ? "var(--color-text-muted)" : "var(--color-text)",
        fontFamily: "var(--font-serif-jp)",
        fontSize: data.isCenter ? "20px" : data.isSatellite ? "12px" : "15px",
        fontWeight: data.isCenter ? 600 : 400,
        letterSpacing: "0.05em",
        textAlign: "center",
        boxShadow: data.isCenter ? "0 0 0 1px var(--color-accent)" : "none",
        transition: "border-color 0.4s ease",
        position: "relative",
        maxWidth: data.isSatellite ? "100px" : "none",
      }}
    >
      <Handle type="source" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="target" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" style={handleStyle} />
      <Handle type="target" position={Position.Left} id="left" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />
      <Handle type="target" position={Position.Right} id="right" style={handleStyle} />
      {data.label}
    </div>
  );
}
