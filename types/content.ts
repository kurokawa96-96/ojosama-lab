export type IndicatorStrength = 'strong' | 'medium' | 'weak' | 'none';

export interface IndicatorItem {
  key: string;
  label: string;
  strength: IndicatorStrength;
  note: string;
}

export type VerdictType =
  | 'unquestionable'
  | 'unparalleled'
  | 'conditional'
  | 'special'
  | 'reluctant'
  | 'denied';

export interface Verdict {
  type: VerdictType;
  text: string;
  basedOn: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  publishedAt: string | null;
  updatedAt: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  relatedNodes: string[];
  relatedArticles: string[];
  sealType: 'seal-tensho' | 'seal-kaisho';
  sealLabel?: string;
  sectionType: 'fact' | 'research' | 'hypothesis';
  coverImage: string | null;
  indicators: IndicatorItem[];
  verdict: Verdict;
  content: string;
}

export interface Node {
  id: string;
  label: string;
  type: 'center' | 'category' | 'concept' | 'etc-collector';
  isMainNode: boolean;
  parentNode?: string;
}

export interface Relation {
  source: string;
  target: string;
  type: string;
}
