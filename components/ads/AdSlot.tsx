"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/ads";

interface AdSlotProps {
  slot: string;
  style?: React.CSSProperties;
}

export default function AdSlot({ slot, style }: AdSlotProps) {
  const isLive = Boolean(ADSENSE_CLIENT_ID);

  useEffect(() => {
    if (!isLive) return;
    try {
      // @ts-expect-error adsbygoogleはAdSenseスクリプトが注入するグローバル変数
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 広告の初期化に失敗しても、サイト全体には影響させない
    }
  }, [isLive]);

  return (
    <div style={{ margin: "32px auto", maxWidth: "680px", textAlign: "center", ...style }}>
      <p
        style={{
          fontFamily: "var(--font-mincho)",
          fontSize: "11px",
          letterSpacing: "0.15em",
          color: "var(--color-text-muted)",
          marginBottom: "8px",
        }}
      >
        —— 出入りの業者様 ——
      </p>
      {isLive ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div
          style={{
            border: "1px dashed var(--color-border)",
            borderRadius: "4px",
            padding: "24px",
            color: "var(--color-text-muted)",
            fontSize: "12px",
          }}
        >
          準備中でございますわ
        </div>
      )}
    </div>
  );
}
