import { memo, useMemo } from "react";
import type { AqiStatus, Reading } from "@/lib/sensor";

const STATUS_CLASS: Record<AqiStatus, string> = {
  Good: "bg-[var(--good)]",
  Moderate: "bg-[var(--moderate)]",
  Unhealthy: "bg-[var(--unhealthy)]",
};

export const HistoryTable = memo(function HistoryTable({ history }: { history: Reading[] }) {
  const rows = useMemo(() => [...history].slice(-20).reverse(), [history]);
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <caption className="sr-only">Most recent 20 sensor readings</caption>
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3">Time</th>
            <th scope="col" className="px-4 py-3">AQI</th>
            <th scope="col" className="px-4 py-3">PM2.5</th>
            <th scope="col" className="px-4 py-3">PM10</th>
            <th scope="col" className="px-4 py-3">Temp</th>
            <th scope="col" className="px-4 py-3">Humidity</th>
            <th scope="col" className="px-4 py-3">Gas</th>
            <th scope="col" className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.timestamp} className="border-t border-border">
              <td className="px-4 py-2 text-muted-foreground">
                {new Date(r.timestamp).toLocaleTimeString()}
              </td>
              <td className="px-4 py-2 font-semibold">{r.aqi}</td>
              <td className="px-4 py-2">{r.pm25}</td>
              <td className="px-4 py-2">{r.pm10}</td>
              <td className="px-4 py-2">{r.temperature}°C</td>
              <td className="px-4 py-2">{r.humidity}%</td>
              <td className="px-4 py-2">{r.gas}</td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${STATUS_CLASS[r.status]}`}
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
