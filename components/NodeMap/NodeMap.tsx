"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node as FlowNode,
} from "reactflow";
import "reactflow/dist/style.css";
import OjosamaNode from "./OjosamaNode";
import { getMainNodes, getRelations } from "@/lib/content";

const nodeTypes = { ojosama: OjosamaNode };

export default function NodeMap() {
  const { flowNodes, flowEdges } = useMemo(() => {
    const mainNodes = getMainNodes();
    const relations = getRelations();

    const center = mainNodes.find((n) => n.type === "center");
    const others = mainNodes.filter((n) => n.type !== "center");

    const radius = 220;
    const angleStep = (2 * Math.PI) / others.length;

    const flowNodes: FlowNode[] = [];

    if (center) {
      flowNodes.push({
        id: center.id,
        type: "ojosama",
        position: { x: 0, y: 0 },
        data: { label: center.label, isCenter: true },
      });
    }

    others.forEach((node, i) => {
      const angle = angleStep * i - Math.PI / 2;
      flowNodes.push({
        id: node.id,
        type: "ojosama",
        position: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        },
        data: { label: node.label },
      });
    });

    const flowEdges: Edge[] = relations
      .filter(
        (r) =>
          mainNodes.some((n) => n.id === r.source) &&
          mainNodes.some((n) => n.id === r.target)
      )
      .map((r, i) => ({
        id: `edge-${i}`,
        source: r.source,
        target: r.target,
        style: { stroke: "var(--color-border)", strokeWidth: 1 },
        animated: false,
      }));

    return { flowNodes, flowEdges };
  }, []);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        panOnScroll
        zoomOnScroll={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--color-border)" gap={32} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
