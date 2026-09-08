import type { CompatibilityAxis } from "../lib/compatibility";

export default function FrequencyRadar({
  axes,
  size = 260,
}: {
  axes: CompatibilityAxis[];
  size?: number;
}) {
  const center = size / 2;
  const maxR = size * 0.32;
  const n = axes.length;

  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, r: number): [number, number] => {
    const a = angleFor(i);
    return [center + r * Math.cos(a), center + r * Math.sin(a)];
  };

  const rings = [0.33, 0.66, 1].map((frac) =>
    axes.map((_, i) => point(i, maxR * frac).join(",")).join(" ")
  );

  const dataPoints = axes.map((ax, i) => point(i, (ax.value / 100) * maxR).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="mx-auto">
      {rings.map((pts, idx) => (
        <polygon key={idx} points={pts} fill="none" stroke="var(--color-border)" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, maxR);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="var(--color-border)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={dataPoints}
        fill="var(--color-luxe-gold)"
        fillOpacity="0.18"
        stroke="var(--color-luxe-gold)"
        strokeWidth="1.5"
      />
      {axes.map((ax, i) => {
        const [x, y] = point(i, (ax.value / 100) * maxR);
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--color-luxe-gold)" />;
      })}
      {axes.map((ax, i) => {
        const [lx, ly] = point(i, maxR + 28);
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill="var(--color-text-secondary)"
          >
            {ax.label}
          </text>
        );
      })}
    </svg>
  );
}
