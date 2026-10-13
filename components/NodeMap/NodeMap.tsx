"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node as FlowNode,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import OjosamaNode from "./OjosamaNode";
import FloatingEdge from "./FloatingEdge";
import EtcPanel from "./EtcPanel";
import { getMainNodes, getRelations, getChildNodes } from "@/lib/nodes";

const nodeTypes = { ojosama: OjosamaNode };
const edgeTypes = { floating: FloatingEdge };

const SIZE = { center: 140, main: 100, satellite: 14 };

// 横型の家系図レイアウトの数値（見た目の調整はここだけで済みます）
const CATEGORY_X = 180; // カテゴリ列の位置（中心ノードからの距離）
const CATEGORY_GAP = 116; // カテゴリ同士の縦の間隔
const SATELLITE_X = 300; // 記事列の位置
const SATELLITE_GAP = 38; // 記事同士の縦の間隔

export default function NodeMap() {
  const router = useRouter();
  const [rf, setRf] = useState<ReactFlowInstance | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [etcOpen, setEtcOpen] = useState(false);

  const { baseNodes, baseEdges, connectionMap, mainNodeTypeMap, nodePositions, childrenByParent } =
    useMemo(() => {
      const mainNodes = getMainNodes();
      const relations = getRelations();

      const center = mainNodes.find((n) => n.type === "center");
      const others = mainNodes.filter((n) => n.type !== "center");

      const baseNodes: FlowNode[] = [];
      const nodePositions = new Map<string, { x: number; y: number }>();

      if (center) {
        baseNodes.push({
          id: center.id,
          type: "ojosama",
          position: { x: -SIZE.center / 2, y: -SIZE.center / 2 },
          data: { label: center.label, isCenter: true },
        });
        nodePositions.set(center.id, { x: 0, y: 0 });
      }

      others.forEach((node, i) => {
        const trueX = CATEGORY_X;
        const trueY = (i - (others.length - 1) / 2) * CATEGORY_GAP;
        baseNodes.push({
          id: node.id,
          type: "ojosama",
          position: { x: trueX - SIZE.main / 2, y: trueY - SIZE.main / 2 },
          data: { label: node.label },
        });
        nodePositions.set(node.id, { x: trueX, y: trueY });
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

    return children.map((child, i) => {
      const trueX = SATELLITE_X;
      const trueY = parentPos.y + (i - (children.length - 1) / 2) * SATELLITE_GAP;
      return {
        id: child.id,
        type: "ojosama",
        position: { x: trueX - SIZE.satellite / 2, y: trueY - SIZE.satellite / 2 },
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

  // 展開・収納のたびに、全体が画面に収まるよう表示を調整する
  useEffect(() => {
    if (!rf) return;
    const timer = setTimeout(() => {
      rf.fitView({ padding: 0.12, duration: 400 });
    }, 80);
    return () => clearTimeout(timer);
  }, [expandedCategoryId, rf]);

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
    <div style={{ width: "100%", height: "720px", position: "relative" }}>
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={setRf}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        nodesDraggable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
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
