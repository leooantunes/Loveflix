import { forwardRef } from "react";
import { CATEGORIES, type Result } from "@/lib/data";

interface Props {
  result: Result;
  names: [string, string];
  date: string;
}

/**
 * Pôster em formato story (9:16) — é este nó que vira PNG/PDF.
 * Usa estilos inline/hex para ficar idêntico na captura.
 */
const ResultCard = forwardRef<HTMLDivElement, Props>(function ResultCard(
  { result, names, date },
  ref,
) {
  const [a, b] = names.map((n) => n.trim());
  const couple = a && b ? `${a} & ${b}` : a || b || "Nós dois";

  return (
    <div
      ref={ref}
      className="relative flex flex-col overflow-hidden font-sans text-white"
      style={{
        width: 360,
        height: 640,
        borderRadius: 28,
        background:
          "radial-gradient(120% 70% at 50% 0%, #9f1239 0%, #4c0519 38%, #0b0507 75%)",
      }}
    >
      {/* brilhos */}
      <div
        className="absolute"
        style={{
          right: -80,
          top: 180,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(192,38,211,0.45), transparent 70%)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: -90,
          bottom: 40,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.3), transparent 70%)",
        }}
      />

      <div className="relative flex flex-1 flex-col px-7 pb-6 pt-8">
        <div className="flex items-center justify-between">
          <span
            className="font-display"
            style={{ fontSize: 34, letterSpacing: 2, color: "#f43f5e", lineHeight: 1 }}
          >
            LOVEFLIX
          </span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: 2,
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.3)",
              color: "rgba(255,255,255,0.85)",
              fontWeight: 700,
            }}
          >
            ESTREIA HOJE
          </span>
        </div>

        <div className="mt-8">
          <p
            style={{
              fontSize: 11,
              letterSpacing: 3,
              color: "#fda4af",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Uma produção original de
          </p>
          <h1
            className="font-display"
            style={{ fontSize: 44, lineHeight: 1, marginTop: 6, wordBreak: "break-word" }}
          >
            {couple}
          </h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
            {date} · Sessão do date 💘
          </p>
        </div>

        <div className="mt-7 flex flex-col" style={{ gap: 12 }}>
          {CATEGORIES.map((c, i) => (
            <div
              key={c.key}
              className="flex items-center"
              style={{
                gap: 14,
                padding: "12px 14px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div
                className={`grid place-items-center bg-gradient-to-br ${c.gradient}`}
                style={{ width: 48, height: 48, borderRadius: 14, fontSize: 24, flexShrink: 0 }}
              >
                {c.emoji}
              </div>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: "#fda4af",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Ep. {i + 1} · {c.label}
                </p>
                <p
                  style={{
                    fontSize: 19,
                    fontWeight: 700,
                    lineHeight: 1.15,
                    marginTop: 2,
                    wordBreak: "break-word",
                  }}
                >
                  {result[c.key]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="flex" style={{ gap: 3 }}>
              {[0, 1, 2, 3, 4].map((s) => (
                <span key={s} style={{ color: "#f43f5e", fontSize: 14 }}>
                  ♥
                </span>
              ))}
            </div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
              98% de compatibilidade · Classificação: Livre pra amar
            </p>
          </div>
        </div>
        <p
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.4)",
            marginTop: 10,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Sorteado no Loveflix 🍿
        </p>
      </div>
    </div>
  );
});

export default ResultCard;
