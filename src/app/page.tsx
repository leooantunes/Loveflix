"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import Background from "@/components/Background";
import CategoryCard from "@/components/CategoryCard";
import Logo from "@/components/Logo";
import ResultScreen from "@/components/ResultScreen";
import SlotMachine from "@/components/SlotMachine";
import {
  CATEGORIES,
  EMPTY_SELECTIONS,
  MAX_OPTIONS,
  pickRandom,
  type Result,
  type Selections,
} from "@/lib/data";

type Stage = "pick" | "spinning" | "result";
const STORAGE_KEY = "loveflix:v1";

export default function Home() {
  const [selections, setSelections] = useState<Selections>(EMPTY_SELECTIONS);
  const [names, setNames] = useState<[string, string]>(["", ""]);
  const [stage, setStage] = useState<Stage>("pick");
  const [result, setResult] = useState<Result | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Restaura escolhas salvas (localStorage só existe no cliente, após a hidratação)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.selections) {
          const s = { ...EMPTY_SELECTIONS };
          for (const c of CATEGORIES) {
            const list = data.selections[c.key];
            if (Array.isArray(list)) s[c.key] = list.slice(0, MAX_OPTIONS).map(String);
          }
          setSelections(s);
        }
        if (Array.isArray(data.names)) setNames([String(data.names[0] ?? ""), String(data.names[1] ?? "")]);
      }
    } catch {}
    setLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ selections, names }));
    } catch {}
  }, [selections, names, loaded]);

  const missing = CATEGORIES.filter((c) => selections[c.key].length === 0);
  const ready = missing.length === 0;
  const total = CATEGORIES.reduce((n, c) => n + selections[c.key].length, 0);

  const generate = () => {
    if (!ready) return;
    const r = Object.fromEntries(
      CATEGORIES.map((c) => [c.key, pickRandom(selections[c.key])]),
    ) as Result;
    setResult(r);
    setStage("spinning");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSpinDone = useCallback(() => setStage("result"), []);

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-clip">
      <Background />

      <header className="flex items-center justify-between px-5 py-5 sm:px-10">
        <button onClick={() => setStage("pick")} aria-label="Início">
          <Logo className="text-4xl sm:text-5xl" />
        </button>
        <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/60 backdrop-blur sm:block">
          🍿 O date perfeito, sorteado pra vocês
        </span>
      </header>

      <AnimatePresence mode="wait">
        {stage !== "result" && (
          <motion.div
            key="pick"
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-36 sm:px-8"
          >
            <section className="mx-auto mt-4 w-full max-w-2xl text-center sm:mt-8">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                Noite do casal
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-5 font-display text-6xl leading-[0.9] text-white sm:text-8xl"
              >
                Chega de <span className="text-shine">“tanto faz”</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-base text-white/65 sm:text-lg"
              >
                Escolham até {MAX_OPTIONS} opções de lanche, filme e sobremesa. O Loveflix sorteia
                a combinação perfeita e vocês compartilham o pôster do date. 💘
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mx-auto mt-7 flex max-w-md items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur"
              >
                <input
                  value={names[0]}
                  onChange={(e) => setNames([e.target.value, names[1]])}
                  maxLength={18}
                  placeholder="Seu nome"
                  aria-label="Seu nome"
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2 text-center text-white placeholder:text-white/35 outline-none focus:bg-white/5"
                />
                <motion.span
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="text-xl text-rose-500"
                >
                  ♥
                </motion.span>
                <input
                  value={names[1]}
                  onChange={(e) => setNames([names[0], e.target.value])}
                  maxLength={18}
                  placeholder="Seu amor"
                  aria-label="Nome do seu amor"
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2 text-center text-white placeholder:text-white/35 outline-none focus:bg-white/5"
                />
              </motion.div>
            </section>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {CATEGORIES.map((c, i) => (
                <CategoryCard
                  key={c.key}
                  index={i}
                  category={c}
                  options={selections[c.key]}
                  onChange={(opts) => setSelections((s) => ({ ...s, [c.key]: opts }))}
                />
              ))}
            </div>
          </motion.div>
        )}

        {stage === "result" && result && (
          <ResultScreen
            key="result"
            result={result}
            names={names}
            onReroll={generate}
            onEdit={() => setStage("pick")}
          />
        )}
      </AnimatePresence>

      {/* Barra fixa do botão de gerar */}
      <AnimatePresence>
        {stage === "pick" && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.4 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/60 px-4 py-4 backdrop-blur-xl"
          >
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="text-center text-sm text-white/60 sm:text-left">
                {ready ? (
                  <>
                    <span className="font-semibold text-white">{total} opções</span> na mesa. Bora
                    sortear? 🎲
                  </>
                ) : (
                  <>
                    Falta escolher:{" "}
                    <span className="font-semibold text-rose-300">
                      {missing.map((m) => `${m.emoji} ${m.label}`).join(", ")}
                    </span>
                  </>
                )}
              </p>
              <div className="flex w-full gap-2 sm:w-auto">
                {total > 0 && (
                  <button
                    onClick={() => setSelections(EMPTY_SELECTIONS)}
                    className="rounded-2xl px-4 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
                  >
                    Limpar
                  </button>
                )}
                <motion.button
                  onClick={generate}
                  disabled={!ready}
                  whileHover={ready ? { scale: 1.04 } : undefined}
                  whileTap={ready ? { scale: 0.96 } : undefined}
                  className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-fuchsia-600 px-8 py-3.5 text-base font-bold text-white shadow-[0_10px_40px_-10px_rgba(225,29,72,0.8)] transition disabled:cursor-not-allowed disabled:from-zinc-700 disabled:via-zinc-700 disabled:to-zinc-700 disabled:shadow-none sm:flex-none"
                >
                  {ready && (
                    <motion.span
                      className="absolute inset-y-0 w-1/3 -skew-x-12 bg-white/25"
                      initial={{ x: "-150%" }}
                      animate={{ x: "400%" }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", repeatDelay: 0.8 }}
                    />
                  )}
                  <span className="relative">✨ Gerar resultado</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === "spinning" && result && (
          <SlotMachine selections={selections} result={result} onDone={onSpinDone} />
        )}
      </AnimatePresence>
    </main>
  );
}
