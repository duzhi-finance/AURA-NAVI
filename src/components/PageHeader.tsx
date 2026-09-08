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
    <div className="mb-8">
      <div className="text-xs uppercase tracking-[0.2em] text-eagle-blue/80 mb-2">{eyebrow}</div>
      <h1 className="text-2xl md:text-3xl font-semibold text-ink-100">{title}</h1>
      {description && <p className="mt-2 text-sm text-ink-300 max-w-2xl">{description}</p>}
    </div>
  );
}
