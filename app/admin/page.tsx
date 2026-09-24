"use client";

import { useState } from "react";
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
}),
    });

    setSubmitting(false);

    if (res.ok) {
      router.push("/admin?posted=1");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "投稿に失敗いたしましたわ");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    border: "1px solid var(--color-border)",
    borderRadius: "4px",
    fontFamily: "var(--font-mincho)",
    fontSize: "14px",
    marginBottom: "16px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    color: "var(--color-text-muted)",
    marginBottom: "6px",
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-mincho)", fontSize: "20px", marginBottom: "32px" }}>
        新規記事の投稿
      </h1>

      <label style={labelStyle}>タイトル</label>
      <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />

      <label style={labelStyle}>スラッグ（URL・ノードID／半角英数とハイフンのみ）</label>
      <input style={inputStyle} value={slug} onChange={(e) => setSlug(e.target.value)} />

      <label style={labelStyle}>抜粋</label>
      <input style={inputStyle} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />

      <label style={labelStyle}>カテゴリ（接続先ノード）</label>
      <select
        style={inputStyle}
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        {CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>

      <label style={labelStyle}>本論（Markdown）</label>
      <textarea
        style={{ ...inputStyle, minHeight: "240px", fontFamily: "monospace" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <h2 style={{ fontFamily: "var(--font-mincho)", fontSize: "16px", margin: "32px 0 12px" }}>
        お嬢様インジケーター
      </h2>
      {indicators.map((row, i) => (
        <div
          key={i}
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "4px",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <input
            style={{ ...inputStyle, marginBottom: "8px" }}
            placeholder="項目名（例：出自）"
            value={row.label}
            onChange={(e) => updateIndicator(i, { label: e.target.value })}
          />
          <select
            style={{ ...inputStyle, marginBottom: "8px" }}
            value={row.strength}
            onChange={(e) =>
              updateIndicator(i, { strength: e.target.value as IndicatorRow["strength"] })
            }
          >
            <option value="strong">強</option>
            <option value="medium">中</option>
            <option value="weak">弱</option>
            <option value="none">該当なし</option>
          </select>
          <textarea
            style={{ ...inputStyle, minHeight: "60px", marginBottom: "8px" }}
            placeholder="根拠"
            value={row.note}
            onChange={(e) => updateIndicator(i, { note: e.target.value })}
          />
          <label style={{ fontSize: "13px", marginRight: "12px" }}>
            <input
              type="checkbox"
              checked={basedOn.has(i)}
              onChange={() => toggleBasedOn(i)}
              style={{ marginRight: "6px" }}
            />
            認定の根拠にする
          </label>
          <button
            type="button"
            onClick={() => removeIndicator(i)}
            style={{ fontSize: "13px", color: "crimson", background: "none", border: "none", cursor: "pointer" }}
          >
            削除
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addIndicator}
        style={{
          fontSize: "13px",
          background: "none",
          border: "1px dashed var(--color-border)",
          borderRadius: "4px",
          padding: "8px 12px",
          cursor: "pointer",
          marginBottom: "32px",
        }}
      >
        + インジケーターを追加
      </button>

      <h2 style={{ fontFamily: "var(--font-mincho)", fontSize: "16px", margin: "0 0 12px" }}>
        アメリアのお嬢様認定
      </h2>
      <h2 style={{ fontFamily: "var(--font-mincho)", fontSize: "16px", margin: "32px 0 12px" }}>
  落款を選ぶ
</h2>
<div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
  {(["seal-tensho", "seal-kaisho"] as const).map((type) => (
    <label
      key={type}
      style={{
        border: `2px solid ${sealType === type ? "var(--color-accent)" : "var(--color-border)"}`,
        borderRadius: "8px",
        padding: "8px",
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <input
        type="radio"
        name="sealType"
        value={type}
        checked={sealType === type}
        onChange={() => setSealType(type)}
        style={{ display: "none" }}
      />
      <img
        src={`/seals/${type}.png`}
        alt={type}
        style={{ width: "72px", height: "72px", objectFit: "contain" }}
      />
      <p style={{ fontSize: "12px", marginTop: "4px", color: "var(--color-text-muted)" }}>
        {type === "seal-tensho" ? "篆書" : "楷書"}
      </p>
    </label>
  ))}
</div>
      <select
        style={inputStyle}
        value={verdictType}
        onChange={(e) => setVerdictType(e.target.value)}
      >
        {VERDICT_TYPES.map((v) => (
          <option key={v.id} value={v.id}>
            {v.label}
          </option>
        ))}
      </select>
      <textarea
        style={{ ...inputStyle, minHeight: "80px" }}
        placeholder="アメリアの台詞"
        value={verdictText}
        onChange={(e) => setVerdictText(e.target.value)}
      />

      {error && <p style={{ color: "crimson", marginBottom: "16px" }}>{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !title || !slug}
        style={{
          width: "100%",
          padding: "12px",
          background: "var(--color-accent)",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontFamily: "var(--font-mincho)",
        }}
      >
        {submitting ? "投稿中…" : "落款を押す（公開する）"}
      </button>
    </div>
  );
}
