export default function PageHeader({
  eyebrow,
  title,
  description,
  titleGradient,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  titleGradient?: boolean;
}) {
  return (
    <div className="mb-10">
      <div className="text-[11px] uppercase tracking-[0.2em] text-text-tertiary mb-3">{eyebrow}</div>
      <h1
        className={`text-3xl md:text-[2.25rem] font-light ${
          titleGradient ? "title-metallic" : "text-text-primary"
        }`}
      >
        {title}
      </h1>
      {description && (
        <p
          className={`desc-text mt-3 text-sm max-w-2xl leading-relaxed ${
            titleGradient ? "title-metallic" : "text-text-secondary"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
