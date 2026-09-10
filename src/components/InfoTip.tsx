import { useEffect, useRef, useState } from "react";

/** Small "(?)" icon that reveals a one-line plain-language explanation on hover or tap. */
export default function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <span ref={rootRef} className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="說明"
        className="flex h-4 w-4 items-center justify-center rounded-full border border-border text-[9px] text-text-tertiary hover:border-luxe-gold hover:text-luxe-gold transition-colors"
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 bottom-full z-20 mb-1.5 w-48 -translate-x-1/2 rounded-lg border border-border-gold bg-surface px-2.5 py-2 text-[11px] leading-relaxed text-text-secondary shadow-lg desc-text"
        >
          {text}
        </span>
      )}
    </span>
  );
}
