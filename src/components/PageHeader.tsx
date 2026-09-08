export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10">
      <div className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary mb-3">{eyebrow}</div>
      <h1 className="text-3xl md:text-[2.25rem] font-light text-text-primary">{title}</h1>
      {description && (
        <p className="mt-3 text-sm text-text-secondary max-w-2xl leading-relaxed">{description}</p>
      )}
    </div>
  );
}
