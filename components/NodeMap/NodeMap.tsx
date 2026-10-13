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
import TreeEdge from "./TreeEdge";
import { getMainNodes, getRelations, getChildNodes } from "@/lib/nodes";

const nodeTypes = { ojosama: OjosamaNode };
const edgeTypes = { tree: TreeEdge };

const SIZE = { center: 140, main: 100, satellite: 14 };

// 横型の家系図レイアウトの数値（見た目の調整はここだけで済みます）
const CATEGORY_X = 180; // カテゴリ列の位置（中心ノードからの距離）
const CATEGORY_GAP = 116; // カテゴリ同士の縦の間隔
const SATELLITE_X = 300; // 記事列の位置
const SATELLITE_GAP = 38; // 記事同士の縦の間隔
// 右側に空けておく余白の位置。大きくするほど全体が左へ寄ります（その分わずかに縮小されます）
const RESERVED_RIGHT_X = 320;

// 画面に収める計算に「右側の余白」を含めるための、見えない目印
const spacerNode: FlowNode = {
  id: "__spacer__",
  position: { x: RESERVED_RIGHT_X, y: 0 },
  data: { label: "" },
  style: {
    width: 1,
    height: 1,
    opacity: 0,
    pointerEvents: "none",
    border: "none",
    padding: 0,
    background: "transparent",
  },
  selectable: false,
  draggable: false,
  focusable: false,
};

// 展開できるノードの種類（「その他の研究」もカテゴリと同じ扱い）
const isExpandableType = (type: string | undefined) =>
  type === "category" || type === "etc-collector";

export default function NodeMap() {
  const router = useRouter();
  const [rf, setRf] = useState<ReactFlowInstance | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

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

      // 線は「中心 → 各カテゴリ」の木構造として描く
      const baseEdges: Edge[] = [];
      if (center) {
        const seen = new Set<string>();
        validRelations.forEach((r) => {
          if (r.source !== center.id && r.target !== center.id) return;
          const other = r.source === center.id ? r.target : r.source;
          if (seen.has(other)) return;
          seen.add(other);
          baseEdges.push({
            id: `edge-${other}`,
            source: center.id,
            target: other,
            sourceHandle: "right",
            targetHandle: "left",
          });
        });
      }

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
        if (isExpandableType(n.type)) {
          childrenByParent.set(n.id, getChildNodes(n.id));
        }
      });

      return { baseNodes, baseEdges, connectionMap, mainNodeTypeMap, nodePositions, childrenByParent };
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
      sourceHandle: "right",
      targetHandle: "left",
      type: "tree",
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
    spacerNode,
  ];

  // 色づいた線が幹の上に重なるよう、選ばれていない線を先に描く
  const displayEdges: Edge[] = [
    ...baseEdges
      .map((e) => {
        const active =
          !selectedId || e.source === selectedId || e.target === selectedId;
        const edge: Edge = {
          ...e,
          type: "tree",
          style: {
            stroke: active ? "var(--color-accent)" : "var(--color-border)",
            strokeWidth: active && selectedId ? 1.5 : 1,
            opacity: active ? 1 : 0.25,
            transition: "stroke 0.4s ease, opacity 0.4s ease",
          },
        };
        return { edge, active };
      })
      .sort((a, b) => Number(a.active) - Number(b.active))
      .map((x) => x.edge),
    ...satelliteEdges,
  ];

  const handleNodeClick = useCallback(
    (_: unknown, node: FlowNode) => {
      const type = mainNodeTypeMap.get(node.id);

      if (isExpandableType(type)) {
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
    </div>
  );
}
