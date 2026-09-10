import { Position, type Node, type XYPosition } from "reactflow";

function getNodeCenter(node: Node): XYPosition {
  return {
    x: node.positionAbsolute!.x + (node.width ?? 0) / 2,
    y: node.positionAbsolute!.y + (node.height ?? 0) / 2,
  };
}

// 円の中心から相手の中心へ向かう直線と、円周との交点を求める
function getCircleIntersection(node: Node, target: XYPosition): XYPosition {
  const center = getNodeCenter(node);
  const radius = (node.width ?? 0) / 2;

  const dx = target.x - center.x;
  const dy = target.y - center.y;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;

  return {
    x: center.x + (dx / distance) * radius,
    y: center.y + (dy / distance) * radius,
  };
}

export function getFloatingEdgeParams(sourceNode: Node, targetNode: Node) {
  const sourceCenter = getNodeCenter(sourceNode);
  const targetCenter = getNodeCenter(targetNode);

  const sourcePoint = getCircleIntersection(sourceNode, targetCenter);
  const targetPoint = getCircleIntersection(targetNode, sourceCenter);

  return { sourcePoint, targetPoint };
}
