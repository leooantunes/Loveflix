"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES, type Result } from "@/lib/data";
import { buildAssets, downloadBlob, shareFile, type ShareAssets } from "@/lib/share";
import ResultCard from "./ResultCard";

interface Props {
  result: Result;
  names: [string, string];
  onReroll: () => void;
  onEdit: () => void;
}

function useCardScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => setScale(Math.min(1, (window.innerWidth - 32) / 360));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

type ActionKey = "pdf" | "story" | "whats" | "download";
const ACTIONS: { key: ActionKey; label: string; icon: string; primary?: boolean; wide?: boolean }[] = [
  { key: "pdf", label: "Compartilhar PDF", icon: "📤", primary: true },
  { key: "story", label: "Story no Instagram", icon: "📸" },
  { key: "whats", label: "Enviar no WhatsApp", icon: "💬" },
  { key: "download", label: "Baixar PDF", icon: "⬇️", primary: false, wide: true },
];

const today = () =>
  new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

export default function ResultScreen({ result, names, onReroll, onEdit }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [assets, setAssets] = useState<ShareAssets | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [date] = useState(today);
  const scale = useCardScale();

  const summary = `💘 Nosso date no Loveflix:\n🍔 Lanche: ${result.lanche}\n🎬 Filme: ${result.filme}\n🍰 Sobremesa: ${result.sobremesa}`;

  // Pré-gera PDF/PNG para que o compartilhamento abra instantaneamente
  // (navegadores exigem que o share aconteça logo após o clique).
  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      if (!cardRef.current) return;
      try {
        const a = await buildAssets(cardRef.current);
        if (alive) setAssets(a);
      } catch (e) {
        console.error(e);
      }
    }, 900);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [result, names]);

  const ensureAssets = useCallback(async () => {
    if (assets) return assets;
    if (!cardRef.current) throw new Error("card indisponível");
    const a = await buildAssets(cardRef.current);
    setAssets(a);
    return a;
  }, [assets]);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2600);
  };

  const run = async (key: string, fn: (a: ShareAssets) => Promise<void> | void) => {
    setBusy(key);
    try {
      await fn(await ensureAssets());
    } catch (e) {
      console.error(e);
      showToast("Ops! Não consegui gerar o arquivo 😢");
    } finally {
      setBusy(null);
    }
  };

  const sharePdf = () =>
    run("pdf", async (a) => {
      const r = await shareFile(a.pdf, summary);
      if (r === "downloaded") showToast("PDF baixado! Agora é só enviar no WhatsApp ou Insta 📲");
    });

  const shareStory = () =>
    run("story", async (a) => {
      const r = await shareFile(a.png, summary);
      if (r === "downloaded") showToast("Imagem salva! Poste nos Stories do Instagram ✨");
    });

  const downloadPdf = () =>
    run("download", (a) => {
      downloadBlob(a.pdf, a.pdf.name);
      showToast("PDF baixado 💾");
    });

  const whatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, "_blank", "noopener");
  };

  const handleAction = (key: ActionKey) => {
    if (key === "pdf") return sharePdf();
    if (key === "story") return shareStory();
    if (key === "whats") return whatsapp();
    return downloadPdf();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 pb-16 pt-6 lg:flex-row lg:items-center lg:justify-center lg:gap-16"
    >
      <motion.div
        initial={{ rotateY: 90, scale: 0.7, opacity: 0 }}
        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 14 }}
        style={{ perspective: 1200 }}
        className="relative"
      >
        <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-rose-600/40 via-fuchsia-600/30 to-orange-500/20 blur-3xl" />
        <div style={{ width: 360 * scale, height: 640 * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <ResultCard ref={cardRef} result={result} names={names} date={date} />
          </div>
        </div>
      </motion.div>

      <div className="flex w-full max-w-sm flex-col">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-300"
        >
          O destino escolheu
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-2 font-display text-5xl leading-none text-white"
        >
          Date perfeito definido!
        </motion.h2>

        <ul className="mt-6 space-y-2">
          {CATEGORIES.map((c, i) => (
            <motion.li
              key={c.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3 text-white/80"
            >
              <span className="text-xl">{c.emoji}</span>
              <span className="text-sm text-white/50">{c.label}:</span>
              <span className="font-semibold text-white">{result[c.key]}</span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {ACTIONS.map((a, i) => (
            <motion.button
              key={a.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.08 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction(a.key)}
              disabled={busy !== null}
              className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition disabled:opacity-60 ${
                a.primary
                  ? "col-span-2 bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white shadow-lg shadow-rose-900/50"
                  : `border border-white/15 bg-white/5 text-white hover:bg-white/10 ${a.wide ? "col-span-2" : ""}`
              }`}
            >
              {busy === a.key ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <span>{a.icon}</span>
              )}
              {a.label}
            </motion.button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-white/40">
          {assets ? "Arquivos prontos ✓" : "Preparando PDF…"} · No celular, o botão abre
          Instagram, WhatsApp e outros apps.
        </p>

        <div className="mt-8 flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onReroll}
            className="flex-1 rounded-2xl border border-rose-400/40 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10"
          >
            🎲 Sortear de novo
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            ✏️ Editar opções
          </motion.button>
        </div>
      </div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-rose-700 shadow-2xl"
        >
          {toast}
        </motion.div>
      )}
    </motion.div>
  );
}
