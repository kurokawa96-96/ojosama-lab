import { type Node, type XYPosition } from "reactflow";

function getNodeCenter(node: Node): XYPosition {
  return {
    x: node.positionAbsolute!.x + (node.width ?? 0) / 2,
    y: node.positionAbsolute!.y + (node.height ?? 0) / 2,
  };
}

// 楕円の中心から相手の中心へ向かう直線と、楕円の縁との交点を求める
function getEllipseIntersection(node: Node, target: XYPosition): XYPosition {
  const center = getNodeCenter(node);
  const rx = (node.width ?? 0) / 2;
  const ry = (node.height ?? 0) / 2;

  const dx = target.x - center.x;
  const dy = target.y - center.y;

  // 方向ベクトルが楕円の縁と交わる係数tを求める
  const denom = Math.sqrt(
    (dx * dx) / (rx * rx || 1) + (dy * dy) / (ry * ry || 1)
  ) || 1;

  return {
    x: center.x + dx / denom,
    y: center.y + dy / denom,
  };
}

export function getFloatingEdgeParams(sourceNode: Node, targetNode: Node) {
  const sourceCenter = getNodeCenter(sourceNode);
  const targetCenter = getNodeCenter(targetNode);

  const sourcePoint = getEllipseIntersection(sourceNode, targetCenter);
  const targetPoint = getEllipseIntersection(targetNode, sourceCenter);

  return { sourcePoint, targetPoint };
}
