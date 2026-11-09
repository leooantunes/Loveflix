const HEARTS = [
  { left: 4, delay: 0, dur: 16, size: 0.8, o: 0.35 },
  { left: 14, delay: 6, dur: 20, size: 1.2, o: 0.25 },
  { left: 23, delay: 2, dur: 14, size: 0.6, o: 0.4 },
  { left: 35, delay: 9, dur: 18, size: 1, o: 0.3 },
  { left: 47, delay: 4, dur: 22, size: 0.7, o: 0.25 },
  { left: 58, delay: 11, dur: 17, size: 1.3, o: 0.2 },
  { left: 66, delay: 1, dur: 15, size: 0.9, o: 0.35 },
  { left: 75, delay: 7, dur: 19, size: 0.6, o: 0.4 },
  { left: 84, delay: 3, dur: 21, size: 1.1, o: 0.25 },
  { left: 93, delay: 10, dur: 16, size: 0.8, o: 0.3 },
];

export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#3b0a17_0%,#0b0507_60%)]" />
      <div
        className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-rose-600/30 blur-3xl"
        style={{ animation: "blob 18s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full bg-fuchsia-700/25 blur-3xl"
        style={{ animation: "blob 22s ease-in-out infinite reverse" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl"
        style={{ animation: "blob 26s ease-in-out infinite" }}
      />
      {HEARTS.map((h, i) => (
        <span
          key={i}
          className="absolute -bottom-10 text-2xl text-rose-500"
          style={
            {
              left: `${h.left}%`,
              animation: `float-up ${h.dur}s linear ${h.delay}s infinite`,
              "--s": h.size,
              "--o": h.o,
              opacity: 0,
            } as React.CSSProperties
          }
        >
          ♥
        </span>
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_70%,#0b0507)]" />
    </div>
  );
}
