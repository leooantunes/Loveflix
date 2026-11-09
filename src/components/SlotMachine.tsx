"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { CATEGORIES, type Result, type Selections } from "@/lib/data";
import Logo from "./Logo";

const ITEM_H = 76;
const LOOPS = 6;
const MESSAGES = [
  "Misturando as opções…",
  "Consultando o cupido…",
  "Preparando a pipoca…",
  "Quase lá…",
];

function buildStrip(options: string[], final: string, seed: number): string[] {
  const strip: string[] = [];
  for (let l = 0; l < LOOPS + seed; l++) {
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    strip.push(...shuffled);
  }
  strip.push(final);
  return strip;
}

interface Props {
  selections: Selections;
  result: Result;
  onDone: () => void;
}

export default function SlotMachine({ selections, result, onDone }: Props) {
  const strips = useMemo(
    () =>
      CATEGORIES.map((c, i) => buildStrip(selections[c.key], result[c.key], i * 2)),
    [selections, result],
  );
  const [stopped, setStopped] = useState(0);
  const [msg, setMsg] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setMsg((m) => (m + 1) % MESSAGES.length), 900);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (stopped < CATEGORIES.length || doneRef.current) return;
    doneRef.current = true;
    const colors = ["#f43f5e", "#fb7185", "#e879f9", "#fde68a", "#ffffff"];
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors });
    confetti({ particleCount: 60, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors, shapes: ["circle"] });
    confetti({ particleCount: 60, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors, shapes: ["circle"] });
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [stopped, onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 px-4 backdrop-blur-md"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
      >
        <Logo className="text-6xl sm:text-7xl" />
      </motion.div>

      <motion.p
        key={stopped >= CATEGORIES.length ? "done" : msg}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 h-6 text-sm text-rose-200/80"
      >
        {stopped >= CATEGORIES.length ? "Date definido! 💘" : MESSAGES[msg]}
      </motion.p>

      <div className="mt-8 w-full max-w-3xl rounded-[2rem] border border-rose-500/30 bg-gradient-to-b from-rose-950/80 to-black p-3 shadow-[0_0_80px_-10px_rgba(225,29,72,0.6)] sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((c, i) => {
            const strip = strips[i];
            const target = -(strip.length - 1) * ITEM_H;
            const isStopped = stopped > i;
            return (
              <div key={c.key} className="flex flex-col items-center">
                <span className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-300/80">
                  {c.emoji} {c.label}
                </span>
                <div
                  className={`relative w-full overflow-hidden rounded-2xl border bg-black/60 transition-colors duration-500 ${
                    isStopped ? "border-rose-400 shadow-[0_0_30px_-5px_rgba(244,63,94,0.8)]" : "border-white/10"
                  }`}
                  style={{ height: ITEM_H }}
                >
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: target }}
                    transition={{ duration: 2.2 + i * 0.9, ease: [0.12, 0.8, 0.2, 1] }}
                    onAnimationComplete={() => setStopped((s) => s + 1)}
                  >
                    {strip.map((item, k) => (
                      <div
                        key={k}
                        className="flex items-center justify-center px-3 text-center text-lg font-bold text-white"
                        style={{ height: ITEM_H }}
                      >
                        <span className="line-clamp-2">{item}</span>
                      </div>
                    ))}
                  </motion.div>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.85),transparent_30%,transparent_70%,rgba(0,0,0,0.85))]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
