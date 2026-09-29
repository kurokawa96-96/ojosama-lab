"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PETAL_COUNT = 12;

type Phase = "greeting" | "petals" | "logo" | "done";

export default function OpeningAnimation() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("greeting");

  useEffect(() => {
    const seen = sessionStorage.getItem("ojosama-opening-seen");
    if (seen) return;

    setVisible(true);
    sessionStorage.setItem("ojosama-opening-seen", "1");

    const t1 = setTimeout(() => setPhase("petals"), 1100);
    const t2 = setTimeout(() => setPhase("logo"), 2400);
    const t3 = setTimeout(() => setPhase("done"), 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => ({
        id: i,
        angle: (360 / PETAL_COUNT) * i + (Math.random() * 26 - 13),
        distance: 180 + Math.random() * 140,
        size: 22 + Math.random() * 14,
        delay: Math.random() * 0.3,
        duration: 1.3 + Math.random() * 0.5,
      })),
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
        {phase === "greeting" && (
          <motion.p
            key="greeting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, exit: { duration: 0.5 } }}
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: "28px",
              color: "#e8a0b0",
              letterSpacing: "0.18em",
              position: "absolute",
            }}
          >
            ごきげんよう
          </motion.p>
        )}
      </AnimatePresence>

      {phase === "petals" &&
        petals.map((petal) => (
          <motion.div
            key={petal.id}
            initial={{ x: 0, y: 0, opacity: 0.95, scale: 1, rotate: 0 }}
            animate={{
              x: Math.cos((petal.angle * Math.PI) / 180) * petal.distance,
              y: Math.sin((petal.angle * Math.PI) / 180) * petal.distance - 40,
              opacity: 0,
              scale: 0.5,
              rotate: 200,
            }}
            transition={{ duration: petal.duration, delay: petal.delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: `${petal.size}px`,
              height: `${petal.size}px`,
              background: "linear-gradient(135deg, #f6c3d0, #eda3b6)",
              borderRadius: "0 100% 0 100%",
            }}
          />
        ))}

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
