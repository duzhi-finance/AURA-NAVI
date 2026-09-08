export default function TotemEmblem({
  seed,
  size = 96,
  className,
}: {
  seed: number;
  size?: number;
  className?: string;
}) {
  const spokeCount = 8 + (seed % 5) * 2; // 8, 10, 12, 14, 16
  const rotation = (seed * 17) % 360;
  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = (360 / spokeCount) * i;
    const rad = (angle * Math.PI) / 180;
    return {
      x1: 50 + 32 * Math.cos(rad),
      y1: 50 + 32 * Math.sin(rad),
      x2: 50 + 41 * Math.cos(rad),
      y2: 50 + 41 * Math.sin(rad),
    };
  });

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <g transform={`rotate(${rotation} 50 50)`}>
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
        <circle cx="50" cy="50" r="31" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
        {spokes.map((s, i) => (
          <line
            key={`l-${i}`}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.55"
          />
        ))}
        {spokes.map((s, i) => (
          <rect
            key={`d-${i}`}
            x={s.x2 - 1.6}
            y={s.y2 - 1.6}
            width="3.2"
            height="3.2"
            transform={`rotate(45 ${s.x2} ${s.y2})`}
            fill="currentColor"
            opacity="0.65"
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.07" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.65" />
    </svg>
  );
}
