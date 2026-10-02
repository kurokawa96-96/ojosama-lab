"use client";

import { Handle, Position } from "reactflow";

const SIZE = { center: 140, main: 100, satellite: 14 };

export default function OjosamaNode({
  data,
}: {
  data: { label: string; isCenter?: boolean; isSatellite?: boolean; selected?: boolean };
}) {
  const handleStyle = { opacity: 0, pointerEvents: "none" as const };

  if (data.isSatellite) {
    return (
      <div
        title={data.label}
        style={{
          width: `${SIZE.satellite}px`,
          height: `${SIZE.satellite}px`,
          borderRadius: "50%",
          background: data.selected ? "var(--color-accent)" : "var(--color-border)",
          border: `1px solid ${data.selected ? "var(--color-accent)" : "var(--color-border)"}`,
          position: "relative",
          overflow: "visible",
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
        <span
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "6px",
            width: "88px",
            fontFamily: "var(--font-serif-jp)",
            fontSize: "11px",
            lineHeight: 1.4,
            color: "var(--color-text-muted)",
            textAlign: "center",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {data.label}
        </span>
      </div>
    );
  }

  const size = data.isCenter ? SIZE.center : SIZE.main;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
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
        boxShadow: data.isCenter ? "0 0 0 1px var(--color-accent)" : "none",
        transition: "border-color 0.4s ease",
        position: "relative",
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
