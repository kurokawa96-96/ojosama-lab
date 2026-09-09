"use client";

import { useMemo, useState, useCallback } from "react";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { baseNodes, baseEdges, connectionMap } = useMemo(() => {
    const mainNodes = getMainNodes();
    const relations = getRelations();

    const center = mainNodes.find((n) => n.type === "center");
    const others = mainNodes.filter((n) => n.type !== "center");

    const radius = 220;
    const angleStep = (2 * Math.PI) / others.length;

    const baseNodes: FlowNode[] = [];

    if (center) {
      baseNodes.push({
        id: center.id,
        type: "ojosama",
        position: { x: 0, y: 0 },
        data: { label: center.label, isCenter: true },
      });
    }

    others.forEach((node, i) => {
      const angle = angleStep * i - Math.PI / 2;
      baseNodes.push({
        id: node.id,
        type: "ojosama",
        position: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        },
        data: { label: node.label },
      });
    });

    const validRelations = relations.filter(
      (r) =>
        mainNodes.some((n) => n.id === r.source) &&
        mainNodes.some((n) => n.id === r.target)
    );

    const baseEdges: Edge[] = validRelations.map((r, i) => ({
      id: `edge-${i}`,
      source: r.source,
      target: r.target,
    }));

    // 各ノードにとって「つながっている相手」の一覧を作っておく
    const connectionMap = new Map<string, Set<string>>();
    validRelations.forEach((r) => {
      if (!connectionMap.has(r.source)) connectionMap.set(r.source, new Set());
      if (!connectionMap.has(r.target)) connectionMap.set(r.target, new Set());
      connectionMap.get(r.source)!.add(r.target);
      connectionMap.get(r.target)!.add(r.source);
    });

    return { baseNodes, baseEdges, connectionMap };
  }, []);

  const isConnected = useCallback(
    (nodeId: string) => {
      if (!selectedId) return true;
      if (nodeId === selectedId) return true;
      return connectionMap.get(selectedId)?.has(nodeId) ?? false;
    },
    [selectedId, connectionMap]
  );

  const displayNodes: FlowNode[] = baseNodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      selected: n.id === selectedId,
    },
    style: {
      opacity: isConnected(n.id) ? 1 : 0.3,
      transition: "opacity 0.4s ease",
    },
  }));

  const displayEdges: Edge[] = baseEdges.map((e) => {
    const active =
      !selectedId ||
      e.source === selectedId ||
      e.target === selectedId;
    return {
      ...e,
      style: {
        stroke: active ? "var(--color-accent)" : "var(--color-border)",
        strokeWidth: active && selectedId ? 1.5 : 1,
        opacity: active ? 1 : 0.25,
        transition: "stroke 0.4s ease, opacity 0.4s ease",
      },
    };
  });

  const handleNodeClick = useCallback(
    (_: unknown, node: FlowNode) => {
      setSelectedId((prev) => (prev === node.id ? null : node.id));
    },
    []
  );

  const handlePaneClick = useCallback(() => {
    setSelectedId(null);
  }, []);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
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
