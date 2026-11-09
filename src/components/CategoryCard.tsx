"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MAX_OPTIONS, type Category } from "@/lib/data";

interface Props {
  category: Category;
  options: string[];
  index: number;
  onChange: (options: string[]) => void;
}

export default function CategoryCard({ category, options, index, onChange }: Props) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(0);
  const full = options.length >= MAX_OPTIONS;

  const add = (raw: string) => {
    const item = raw.trim().replace(/\s+/g, " ");
    if (!item) return;
    const exists = options.some((o) => o.toLowerCase() === item.toLowerCase());
    if (full || exists) {
      setShake((s) => s + 1);
      return;
    }
    onChange([...options, item.slice(0, 40)]);
    setValue("");
  };

  const remove = (item: string) => onChange(options.filter((o) => o !== item));

  const suggestions = category.suggestions.filter(
    (s) => !options.some((o) => o.toLowerCase() === s.toLowerCase()),
  );

  const progress = options.length / MAX_OPTIONS;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * index, type: "spring", stiffness: 120, damping: 18 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-colors hover:border-rose-400/30 sm:p-6"
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${category.gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-35`}
      />

      <header className="relative flex items-center gap-4">
        <motion.div
          whileHover={{ rotate: [0, -12, 12, 0], scale: 1.1 }}
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${category.gradient} text-3xl shadow-lg shadow-rose-900/40`}
        >
          {category.emoji}
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300/80">
            {category.label}
          </p>
          <h2 className="text-lg font-bold leading-tight text-white sm:text-xl">{category.title}</h2>
        </div>
        <div className="relative h-12 w-12 shrink-0" aria-label={`${options.length} de ${MAX_OPTIONS}`}>
          <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <motion.circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="url(#ring)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: progress }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            />
            <defs>
              <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#c026d3" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 grid place-items-center text-sm font-bold text-white">
            {options.length}/{MAX_OPTIONS}
          </span>
        </div>
      </header>

      <motion.form
        key={shake}
        animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : undefined}
        transition={{ duration: 0.4 }}
        onSubmit={(e) => {
          e.preventDefault();
          add(value);
        }}
        className="relative mt-5 flex gap-2"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={full}
          maxLength={40}
          placeholder={full ? "Limite de 5 opções atingido" : category.placeholder}
          aria-label={`Adicionar ${category.label.toLowerCase()}`}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-rose-400/60 focus:ring-2 focus:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={full || !value.trim()}
          className={`rounded-xl bg-gradient-to-br ${category.gradient} px-4 text-xl font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40`}
          aria-label="Adicionar"
        >
          +
        </motion.button>
      </motion.form>

      <ul className="relative mt-4 flex min-h-[3rem] flex-col gap-2">
        <AnimatePresence initial={false}>
          {options.map((item, i) => (
            <motion.li
              key={item}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.08] to-transparent px-3 py-2.5"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-200">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">{item}</span>
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Remover ${item}`}
                className="grid h-7 w-7 place-items-center rounded-lg text-white/50 transition hover:bg-rose-500/20 hover:text-white"
              >
                ✕
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
        {options.length === 0 && (
          <li className="rounded-xl border border-dashed border-white/15 px-3 py-3 text-center text-sm text-white/40">
            Adicione até {MAX_OPTIONS} opções ou toque nas sugestões 👇
          </li>
        )}
      </ul>

      <div className="relative mt-auto pt-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Sugestões
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 8).map((s) => (
            <motion.button
              key={s}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              disabled={full}
              onClick={() => add(s)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 transition hover:border-rose-400/50 hover:bg-rose-500/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              + {s}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
