"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PETAL_COUNT = 8;

type Phase = "greeting" | "petals" | "logo" | "done";

export default function OpeningAnimation() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("greeting");

  useEffect(() => {
    const seen = sessionStorage.getItem("ojosama-opening-seen");
    if (seen) return;

    setVisible(true);
    sessionStorage.setItem("ojosama-opening-seen", "1");

    const t1 = setTimeout(() => setPhase("petals"), 800);
    const t2 = setTimeout(() => setPhase("logo"), 1800);
    const t3 = setTimeout(() => setPhase("done"), 3200);

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
        angle: (360 / PETAL_COUNT) * i + Math.random() * 20,
        distance: 110 + Math.random() * 70,
        delay: Math.random() * 0.25,
      })),
    []
  );

  if (!visible || phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="opening"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
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
        {phase === "greeting" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: "26px",
              color: "#e8a0b0",
              letterSpacing: "0.15em",
              position: "absolute",
            }}
          >
            ごきげんよう
          </motion.p>
        )}

        {phase === "petals" &&
          petals.map((petal) => (
            <motion.div
              key={petal.id}
              initial={{ x: 0, y: 0, opacity: 0.9, scale: 1, rotate: 0 }}
              animate={{
                x: Math.cos((petal.angle * Math.PI) / 180) * petal.distance,
                y: Math.sin((petal.angle * Math.PI) / 180) * petal.distance - 30,
                opacity: 0,
                scale: 0.4,
                rotate: 180,
              }}
              transition={{ duration: 1, delay: petal.delay, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: "14px",
                height: "14px",
                background: "#f2b8c6",
                borderRadius: "0 100% 0 100%",
              }}
            />
          ))}

        {phase === "logo" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "var(--font-mincho)",
              fontSize: "22px",
              color: "var(--color-text)",
              letterSpacing: "0.1em",
            }}
          >
            お嬢様研究所
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
