import type { ReactNode } from "react";
import { cx } from "./ui";

const W = 640;
const H = 240;
const PAD = { left: 38, right: 14, top: 16, bottom: 30 };

export function ChartCard({
  title,
  subtitle,
  legend,
  children,
}: {
  title: string;
  subtitle?: string;
  legend?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-extrabold text-night">{title}</h2>
          {subtitle && <p className="mt-1 text-[12px] font-medium text-night/55">{subtitle}</p>}
        </div>
        {legend}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function LineChart({
  labels,
  series,
  height = 240,
}: {
  labels: string[];
  series: Array<{ label: string; color: string; values: number[] }>;
  height?: number;
}) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const peak = Math.max(1, ...series.flatMap((s) => s.values));
  const max = Math.ceil(peak / 5) * 5 || 5;
  const stepX = innerW / Math.max(1, labels.length - 1);
  const y = (value: number) => PAD.top + innerH - (value / max) * innerH;
  const x = (index: number) => PAD.left + index * stepX;
  const labelEvery = labels.length > 8 ? 2 : 1;

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Trend chart">
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const gy = PAD.top + innerH * (1 - fraction);
          return (
            <g key={fraction}>
              <line x1={PAD.left} y1={gy} x2={W - PAD.right} y2={gy} stroke="#E8E4F5" strokeWidth={1} />
              <text x={PAD.left - 10} y={gy + 4} textAnchor="end" fontSize={10} fill="#77748B" fontWeight={600}>
                {Math.round(max * fraction)}
              </text>
            </g>
          );
        })}
        {labels.map((label, i) =>
          i % labelEvery === 0 ? (
            <text key={`${label}-${i}`} x={x(i)} y={H - 8} textAnchor="middle" fontSize={10} fill="#77748B" fontWeight={600}>
              {label}
            </text>
          ) : null,
        )}
        {series.map((line) => {
          const points = line.values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
          return (
            <g key={line.label}>
              <polyline
                points={points}
                fill="none"
                stroke={line.color}
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {line.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={3.2} fill="#FFFFFF" stroke={line.color} strokeWidth={2} />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function BarChart({
  data,
  height = 240,
  color = "#6544E8",
}: {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
  color?: string;
}) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const peak = Math.max(1, ...data.map((d) => d.value));
  const max = Math.ceil(peak / 5) * 5 || 5;
  const band = innerW / Math.max(1, data.length);
  const barW = Math.min(42, band * 0.58);

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Bar chart">
        {[0, 0.5, 1].map((fraction) => {
          const gy = PAD.top + innerH * (1 - fraction);
          return (
            <g key={fraction}>
              <line x1={PAD.left} y1={gy} x2={W - PAD.right} y2={gy} stroke="#E8E4F5" strokeWidth={1} />
              <text x={PAD.left - 10} y={gy + 4} textAnchor="end" fontSize={10} fill="#77748B" fontWeight={600}>
                {Math.round(max * fraction)}
              </text>
            </g>
          );
        })}
        {data.map((item, i) => {
          const barH = (item.value / max) * innerH;
          const bx = PAD.left + band * i + (band - barW) / 2;
          return (
            <g key={`${item.label}-${i}`}>
              <rect x={bx} y={PAD.top + innerH - barH} width={barW} height={Math.max(barH, 1)} rx={6} fill={item.color ?? color} />
              <text x={bx + barW / 2} y={H - 8} textAnchor="middle" fontSize={10} fill="#77748B" fontWeight={600}>
                {item.label}
              </text>
              <text x={bx + barW / 2} y={PAD.top + innerH - barH - 6} textAnchor="middle" fontSize={10} fill="#17152B" fontWeight={700}>
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function DonutChart({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  centerLabel?: string;
  centerValue?: string | number;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative h-[148px] w-[148px] shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90" role="img" aria-label="Distribution chart">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#F1EEFD" strokeWidth={16} />
          {segments.map((segment) => {
            const length = (segment.value / total) * circumference;
            const circle = (
              <circle
                key={segment.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={16}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
              />
            );
            offset += length;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-extrabold leading-none text-night">{centerValue ?? total}</span>
          {centerLabel && <span className="mt-1 text-[11px] font-bold text-night/50">{centerLabel}</span>}
        </div>
      </div>
      <div className="min-w-[140px] flex-1 space-y-2">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex items-center gap-2 font-medium text-night/65">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: segment.color }} />
              {segment.label}
            </span>
            <span className="font-extrabold text-night">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  total,
  color = "#6544E8",
  className,
}: {
  value: number;
  total: number;
  color?: string;
  className?: string;
}) {
  const percent = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-primary-100", className)}>
      <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: color }} />
    </div>
  );
}
