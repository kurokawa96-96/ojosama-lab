"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { id: "history", label: "歴史" },
  { id: "culture", label: "文化" },
  { id: "thought", label: "社会・思想" },
];

const VERDICT_TYPES = [
  { id: "unquestionable", label: "文句なしの認定" },
  { id: "unparalleled", label: "比類なき認定" },
  { id: "conditional", label: "条件付き認定" },
  { id: "special", label: "特殊認定" },
  { id: "reluctant", label: "不本意ながら認定" },
  { id: "denied", label: "お嬢様性を認めず" },
];

interface IndicatorRow {
  label: string;
  strength: "strong" | "medium" | "weak" | "none";
  note: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [content, setContent] = useState("");
  const [sealType, setSealType] = useState<"seal-tensho" | "seal-kaisho">("seal-tensho");
  const [indicators, setIndicators] = useState<IndicatorRow[]>([
    { label: "", strength: "medium", note: "" },
  ]);
  const [verdictType, setVerdictType] = useState(VERDICT_TYPES[0].id);
  const [verdictText, setVerdictText] = useState("");
  const [basedOn, setBasedOn] = useState<Set<number>>(new Set());
  const [existingArticles, setExistingArticles] = useState<{ slug: string; title: string }[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((res) => res.json())
      .then((data) => setExistingArticles(data.articles ?? []))
      .catch(() => setExistingArticles([]));
  }, []);

  const updateIndicator = (i: number, patch: Partial<IndicatorRow>) => {
    setIndicators((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row))
    );
  };

  const addIndicator = () =>
    setIndicators((prev) => [...prev, { label: "", strength: "medium", note: "" }]);

  const removeIndicator = (i: number) => {
    setIndicators((prev) => prev.filter((_, idx) => idx !== i));
    setBasedOn((prev) => {
      const next = new Set(prev);
      next.delete(i);
      return next;
    });
  };

  const toggleBasedOn = (i: number) => {
    setBasedOn((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleRelated = (slug: string) => {
    setRelatedArticles((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    const indicatorItems = indicators
      .filter((row) => row.label.trim())
      .map((row, i) => ({
        key: `item-${i}`,
        label: row.label,
        strength: row.strength,
        note: row.note,
      }));

    const basedOnKeys = Array.from(basedOn).map((i) => `item-${i}`);

    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        excerpt,
        categoryId,
        content,
        indicators: indicatorItems,
        verdict: { type: verdictType, text: verdictText, basedOn: basedOnKeys },
        sealType,
        relatedArticles: Array.from(relatedArticles),
      }),
    });

    setSubmitting(false);

    if (res.ok) {
