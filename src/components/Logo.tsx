export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display tracking-wider text-shine drop-shadow-[0_4px_24px_rgba(225,29,72,0.45)] ${className}`}
    >
      LOVEFLIX
    </span>
  );
}
