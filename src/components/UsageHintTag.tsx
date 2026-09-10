/** Soft micro-tag telling the reader when/why to use the section above it. */
export default function UsageHintTag({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-subtle/70 border border-border px-2.5 py-1 text-[11px] text-text-tertiary">
      <span className="text-luxe-gold">💡</span>
      {text}
    </span>
  );
}
