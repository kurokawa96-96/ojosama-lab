"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node as FlowNode,
} from "reactflow";
import "reactflow/dist/style.css";
import OjosamaNode from "./OjosamaNode";
import FloatingEdge from "./FloatingEdge";
import EtcPanel from "../EtcPanel";
import { getMainNodes, getRelations, getChildNodes } from "@/lib/nodes";

const nodeTypes = { ojosama: OjosamaNode };
const edgeTypes = { floating: FloatingEdge };

const SATELLITE_RADIUS = 130;

export default function NodeMap() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [etcOpen, setEtcOpen] = useState(false);

  const { baseNodes, baseEdges, connectionMap, mainNodeTypeMap, nodePositions, childrenByParent } =
    useMemo(() => {
      const mainNodes = getMainNodes();
      const relations = getRelations();

      const center = mainNodes.find((n) => n.type === "center");
      const others = mainNodes.filter((n) => n.type !== "center");

      const radius = 220;
      const angleStep = (2 * Math.PI) / others.length;

      const baseNodes: FlowNode[] = [];
      const nodePositions = new Map<string, { x: number; y: number }>();

      if (center) {
        baseNodes.push({
          id: center.id,
          type: "ojosama",
          position: { x: 0, y: 0 },
          data: { label: center.label, isCenter: true },
        });
        nodePositions.set(center.id, { x: 0, y: 0 });
      }

      others.forEach((node, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const pos = {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        };
        baseNodes.push({
          id: node.id,
          type: "ojosama",
          position: pos,
          data: { label: node.label },
        });
        nodePositions.set(node.id, pos);
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

      const connectionMap = new Map<string, Set<string>>();
      validRelations.forEach((r) => {
        if (!connectionMap.has(r.source)) connectionMap.set(r.source, new Set());
        if (!connectionMap.has(r.target)) connectionMap.set(r.target, new Set());
        connectionMap.get(r.source)!.add(r.target);
        connectionMap.get(r.target)!.add(r.source);
      });

      const mainNodeTypeMap = new Map<string, string>();
      mainNodes.forEach((n) => mainNodeTypeMap.set(n.id, n.type));

      const childrenByParent = new Map<string, ReturnType<typeof getChildNodes>>();
      mainNodes.forEach((n) => {
        if (n.type === "category") {
          childrenByParent.set(n.id, getChildNodes(n.id));
        }
      });

      return { baseNodes, baseEdges, connectionMap, mainNodeTypeMap, nodePositions, childrenByParent };
    }, []);

  const etcChildren = useMemo(() => {
    const etcNode = getMainNodes().find((n) => n.type === "etc-collector");
    return etcNode ? getChildNodes(etcNode.id) : [];
  }, []);

  const isConnected = useCallback(
    (nodeId: string) => {
      if (!selectedId) return true;
      if (nodeId === selectedId) return true;
      return connectionMap.get(selectedId)?.has(nodeId) ?? false;
    },
    [selectedId, connectionMap]
  );

  const satelliteNodes: FlowNode[] = useMemo(() => {
    if (!expandedCategoryId) return [];
    const children = childrenByParent.get(expandedCategoryId) ?? [];
    const parentPos = nodePositions.get(expandedCategoryId);
    if (!parentPos || children.length === 0) return [];

    const angleStep = (2 * Math.PI) / Math.max(children.length, 1);

    return children.map((child, i) => {
      const angle = angleStep * i;
      return {
        id: child.id,
        type: "ojosama",
        position: {
          x: parentPos.x + Math.cos(angle) * SATELLITE_RADIUS,
          y: parentPos.y + Math.sin(angle) * SATELLITE_RADIUS,
        },
        data: { label: child.label, isSatellite: true },
        style: { opacity: 1, transition: "opacity 0.4s ease" },
      };
    });
  }, [expandedCategoryId, childrenByParent, nodePositions]);

  const satelliteEdges: Edge[] = useMemo(() => {
    if (!expandedCategoryId) return [];
    const children = childrenByParent.get(expandedCategoryId) ?? [];
    return children.map((child, i) => ({
      id: `satellite-edge-${expandedCategoryId}-${i}`,
      source: expandedCategoryId,
      target: child.id,
      type: "floating",
      style: {
        stroke: "var(--color-accent)",
        strokeWidth: 1,
        opacity: 0.7,
        transition: "opacity 0.4s ease",
      },
    }));
  }, [expandedCategoryId, childrenByParent]);

  const displayNodes: FlowNode[] = [
    ...baseNodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        selected: n.id === selectedId || n.id === expandedCategoryId,
      },
      style: {
        opacity: isConnected(n.id) ? 1 : 0.3,
        transition: "opacity 0.4s ease",
      },
    })),
    ...satelliteNodes,
  ];

  const displayEdges: Edge[] = [
    ...baseEdges.map((e) => {
      const active =
        !selectedId || e.source === selectedId || e.target === selectedId;
      return {
        ...e,
        type: "floating",
        style: {
          stroke: active ? "var(--color-accent)" : "var(--color-border)",
          strokeWidth: active && selectedId ? 1.5 : 1,
          opacity: active ? 1 : 0.25,
          transition: "stroke 0.4s ease, opacity 0.4s ease",
        },
      };
    }),
    ...satelliteEdges,
  ];

  const handleNodeClick = useCallback(
    (_: unknown, node: FlowNode) => {
      const type = mainNodeTypeMap.get(node.id);

      if (type === "etc-collector") {
        setEtcOpen(true);
        return;
      }

      if (type === "category") {
        setExpandedCategoryId((prev) => (prev === node.id ? null : node.id));
        setSelectedId((prev) => (prev === node.id ? null : node.id));
        return;
      }

      if (node.data?.isSatellite) {
        router.push(`/articles/${node.id}`);
        return;
      }

      setSelectedId((prev) => (prev === node.id ? null : node.id));
      setExpandedCategoryId(null);
    },
    [mainNodeTypeMap, router]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedId(null);
    setExpandedCategoryId(null);
  }, []);

  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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

      <EtcPanel
        open={etcOpen}
        nodes={etcChildren}
        onClose={() => setEtcOpen(false)}
      />
    </div>
  );
}
