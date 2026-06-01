import type { Reading } from "@/lib/sensor";

export function AqiGauge({ aqi, status }: { aqi: number; status: Reading["status"] }) {
  const pct = Math.min(100, (aqi / 200) * 100);
  const color =
    status === "Good"
      ? "var(--good)"
      : status === "Moderate"
        ? "var(--moderate)"
        : "var(--unhealthy)";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Air Quality Index</p>
          <p className="mt-1 text-5xl font-bold tracking-tight" style={{ color }}>
            {aqi}
          </p>
        </div>
        <span
          className="rounded-full px-4 py-1.5 text-sm font-semibold"
          style={{ backgroundColor: `${color}`, color: "white" }}
        >
          {status}
        </span>
      </div>
      <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
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
}
