import InfoTip from "./InfoTip";
import UsageHintTag from "./UsageHintTag";

/** In-page section title used inside a single route's body (not a full PageHeader). */
export default function SectionHeading({
  title,
  subtitle,
  hint,
  tag,
  tip,
}: {
  title: string;
  subtitle?: string;
  hint?: string;
  /** Small trailing caption after the title, e.g. a wavespell name. */
  tag?: string;
  /** One-sentence plain-language explanation shown via an inline (?) InfoTip. */
  tip?: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-1.5">
      <h2 className="flex items-center gap-1.5 text-base font-serif font-semibold text-text-primary">
        {title}
        {tag && <span className="text-xs font-sans font-normal text-text-tertiary">｜{tag}</span>}
        {tip && <InfoTip text={tip} />}
      </h2>
      {subtitle && <p className="desc-text text-sm text-text-secondary leading-relaxed">{subtitle}</p>}
      {hint && <UsageHintTag text={hint} />}
    </div>
  );
}
