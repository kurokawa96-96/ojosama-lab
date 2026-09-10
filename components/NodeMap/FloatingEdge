"use client";

import { useStore, type EdgeProps } from "reactflow";
import { getFloatingEdgeParams } from "@/lib/floatingEdge";

export default function FloatingEdge({
  id,
  source,
  target,
  style,
}: EdgeProps) {
  const sourceNode = useStore((s) => s.nodeInternals.get(source));
  const targetNode = useStore((s) => s.nodeInternals.get(target));

  if (!sourceNode || !targetNode) return null;

  const { sourcePoint, targetPoint } = getFloatingEdgeParams(
    sourceNode,
    targetNode
  );

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={`M ${sourcePoint.x},${sourcePoint.y} L ${targetPoint.x},${targetPoint.y}`}
      style={style}
    />
  );
}
