import { memo } from "react";
import type { AqiStatus } from "@/lib/sensor";

const STATUS_BG: Record<AqiStatus, string> = {
  Good: "bg-[var(--good)]",
  Moderate: "bg-[var(--moderate)]",
  Unhealthy: "bg-[var(--unhealthy)]",
};

const STATUS_TEXT: Record<AqiStatus, string> = {
  Good: "text-[var(--good)]",
  Moderate: "text-[var(--moderate)]",
  Unhealthy: "text-[var(--unhealthy)]",
};

export const AqiGauge = memo(function AqiGauge({
  aqi,
  status,
}: {
  aqi: number;
  status: AqiStatus;
}) {
  const pct = Math.min(100, (aqi / 200) * 100);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Air Quality Index</p>
          <p
            className={`mt-1 text-5xl font-bold tracking-tight ${STATUS_TEXT[status]}`}
            aria-live="polite"
          >
            {aqi}
          </p>
        </div>
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-semibold text-white ${STATUS_BG[status]}`}
        >
          {status}
        </span>
      </div>
      <div
        className="mt-5 h-3 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Air Quality Index"
        aria-valuemin={0}
        aria-valuemax={200}
        aria-valuenow={aqi}
      >
        <div
          className={`h-full transition-all duration-700 ${STATUS_BG[status]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>50</span>
        <span>100</span>
        <span>150</span>
        <span>200+</span>
      </div>
    </div>
  );
});
