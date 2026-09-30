"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const PETAL_COUNT = 14;

type Phase = "greeting" | "petals" | "logo" | "done";

function Petal({ size, hue }: { size: number; hue: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`petal-grad-${hue}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${340 + hue}, 70%, 88%)`} />
          <stop offset="100%" stopColor={`hsl(${340 + hue}, 60%, 74%)`} />
        </linearGradient>
      </defs>
      <path
        d="M20 2 C28 8, 34 16, 20 38 C6 16, 12 8, 20 2 Z"
        fill={`url(#petal-grad-${hue})`}
      />
      <path
        d="M20 6 C20 16, 20 26, 20 34"
        stroke={`hsl(${340 + hue}, 40%, 65%)`}
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

export default function OpeningAnimation() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("greeting");

  useEffect(() => {
    const seen = sessionStorage.getItem("ojosama-opening-seen");
    if (seen) return;

    setVisible(true);
    sessionStorage.setItem("ojosama-opening-seen", "1");

    const t1 = setTimeout(() => setPhase("petals"), 1100);
    const t2 = setTimeout(() => setPhase("logo"), 2600);
    const t3 = setTimeout(() => setPhase("done"), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => {
        const angle = (360 / PETAL_COUNT) * i + (Math.random() * 26 - 13);
        const distance = 190 + Math.random() * 160;
        return {
          id: i,
          angle,
          distance,
          size: 20 + Math.random() * 16,
          hue: Math.random() * 20 - 10,
          delay: Math.random() * 0.35,
          duration: 1.4 + Math.random() * 0.6,
          wobble: 12 + Math.random() * 16,
          spin: 140 + Math.random() * 200,
        };
      }),
    []
  );

  if (!visible || phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "#fdf3f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
  {phase === "logo" && (
    <motion.div
      key="logo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      style={{ position: "absolute" }}
    >
      <Image
        src="/logo.png"
        alt="お嬢様研究所"
        width={440}
        height={260}
        style={{ width: "min(70vw, 320px)", height: "auto" }}
      />
    </motion.div>
  )}
</AnimatePresence>

      {phase === "petals" &&
        petals.map((petal) => {
          const rad = (petal.angle * Math.PI) / 180;
          const midX = Math.cos(rad) * petal.distance * 0.55 + petal.wobble;
          const endX = Math.cos(rad) * petal.distance;
          const midY = Math.sin(rad) * petal.distance * 0.55 - 20;
          const endY = Math.sin(rad) * petal.distance - 50;

          return (
            <motion.div
              key={petal.id}
              initial={{ x: 0, y: 0, opacity: 0.95, scale: 0.6, rotate: 0 }}
              animate={{
                x: [0, midX, endX],
                y: [0, midY, endY],
                opacity: [0.95, 0.9, 0],
                scale: [0.6, 1, 0.5],
                rotate: [0, petal.spin * 0.5, petal.spin],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                ease: "easeOut",
                times: [0, 0.5, 1],
              }}
              style={{ position: "absolute" }}
            >
              <Petal size={petal.size} hue={petal.hue} />
            </motion.div>
          );
        })}

      <AnimatePresence>
        {phase === "logo" && (
          <motion.p
            key="logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: "24px",
              color: "var(--color-text)",
              letterSpacing: "0.12em",
              position: "absolute",
            }}
          >
            お嬢様研究所
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
