"use client";

import { BaseEdge, getSmoothStepPath, type EdgeProps } from "reactflow";

export default function TreeEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
}: EdgeProps) {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  });

  return <BaseEdge path={path} style={style} />;
}
