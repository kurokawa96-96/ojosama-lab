import nodesData from "@/content/nodes.json";
import relationsData from "@/content/relations.json";
import type { Node, Relation } from "@/types/content";

export function getNodes(): Node[] {
  return nodesData.nodes as Node[];
}

export function getRelations(): Relation[] {
  return relationsData.relations as Relation[];
}

export function getMainNodes(): Node[] {
  return getNodes().filter((n) => n.isMainNode);
}
