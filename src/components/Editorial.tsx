export function IssueLabel({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`font-serif text-[11px] font-light tracking-[0.2em] text-text-tertiary ${className}`}>
      {text}
    </div>
  );
}

export function ChapterLabel({
  number,
  title,
  className = "",
}: {
  number: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`font-serif text-[12px] font-light uppercase tracking-[0.18em] text-text-tertiary ${className}`}>
      CHAPTER {number}
      <span className="mx-2 text-border">──</span>
      {title}
    </div>
  );
}

export function PullQuote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`title-metallic font-serif font-medium text-xl md:text-2xl leading-relaxed tracking-[0.08em] ${className}`}
    >
      『{children}』
    </p>
  );
}

/** Positioned with `top-X right-X` utility classes via `className`; renders reading top-to-bottom along the right edge. */
export function VerticalMicrocopy({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`pointer-events-none select-none absolute font-sans whitespace-nowrap ${className}`}
      style={{
        transform: "rotate(90deg)",
        transformOrigin: "top right",
        color: "#b0b0b0",
        fontSize: "10px",
        letterSpacing: "0.15em",
      }}
    >
      {text}
    </span>
  );
}
