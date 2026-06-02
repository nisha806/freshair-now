import { memo } from "react";
import type { LucideIcon } from "lucide-react";

export type MetricAccent = "default" | "good" | "moderate" | "unhealthy";

type Props = {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  accent?: MetricAccent;
};

const accentMap: Record<MetricAccent, string> = {
  default: "bg-card text-card-foreground border-border",
  good: "bg-[var(--good)]/10 border-[var(--good)]/30",
  moderate: "bg-[var(--moderate)]/10 border-[var(--moderate)]/30",
  unhealthy: "bg-[var(--unhealthy)]/10 border-[var(--unhealthy)]/30",
};

export const MetricCard = memo(function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  accent = "default",
}: Props) {
  return (
    <div className={`rounded-xl border p-5 shadow-sm transition-all ${accentMap[accent]}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
});
