import type { Reading } from "@/lib/sensor";

export function HistoryTable({ history }: { history: Reading[] }) {
  const rows = [...history].slice(-20).reverse();
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">AQI</th>
            <th className="px-4 py-3">PM2.5</th>
            <th className="px-4 py-3">PM10</th>
            <th className="px-4 py-3">Temp</th>
            <th className="px-4 py-3">Humidity</th>
            <th className="px-4 py-3">Gas</th>
            <th className="px-4 py-3">Status</th>
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
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{
                    backgroundColor:
                      r.status === "Good"
                        ? "var(--good)"
                        : r.status === "Moderate"
                          ? "var(--moderate)"
                          : "var(--unhealthy)",
                  }}
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
}
