import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Wind,
  Thermometer,
  Droplets,
  Activity,
  Flame,
  Gauge,
  Bell,
  AlertTriangle,
  BellOff,
} from "lucide-react";
import { createSensor, type Reading } from "@/lib/sensor";
import { MetricCard, type MetricAccent } from "@/components/MetricCard";
import { AqiGauge } from "@/components/AqiGauge";
import { AqiTrend, ClimateTrend } from "@/components/TrendChart";
import { HistoryTable } from "@/components/HistoryTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Real-Time Air Quality Monitor" },
      {
        name: "description",
        content:
          "Live IoT air quality dashboard with AQI, PM2.5, PM10, temperature, humidity and gas readings.",
      },
    ],
  }),
  component: Dashboard,
});

const AQI_THRESHOLD = 100;
const MAX_HISTORY = 60;
const TICK_MS = 5000;
const ALERT_THROTTLE_MS = 30_000;

function Dashboard() {
  const [history, setHistory] = useState<Reading[]>([]);
  const [notifGranted, setNotifGranted] = useState(false);
  const lastAlertRef = useRef(0);
  const sensorRef = useRef<ReturnType<typeof createSensor> | null>(null);

  // Lazily create sensor on the client to keep SSR pure.
  if (sensorRef.current === null) {
    sensorRef.current = createSensor();
  }

  useEffect(() => {
    const sensor = sensorRef.current!;
    const tick = () => setHistory((h) => [...h, sensor.next()].slice(-MAX_HISTORY));
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setNotifGranted(Notification.permission === "granted");
    }
  }, []);

  const latest = history[history.length - 1];

  useEffect(() => {
    if (!latest || latest.aqi <= AQI_THRESHOLD) return;
    const now = Date.now();
    if (now - lastAlertRef.current < ALERT_THROTTLE_MS) return;
    lastAlertRef.current = now;
    if (notifGranted && typeof Notification !== "undefined") {
      new Notification("⚠️ Unhealthy Air Quality", {
        body: `AQI is ${latest.aqi}. Consider limiting outdoor activity.`,
      });
    }
  }, [latest, notifGranted]);

  const requestNotif = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const res = await Notification.requestPermission();
    setNotifGranted(res === "granted");
  }, []);

  const accent: MetricAccent = useMemo(() => {
    if (!latest) return "default";
    if (latest.status === "Good") return "good";
    if (latest.status === "Moderate") return "moderate";
    return "unhealthy";
  }, [latest]);

  if (!latest) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Initializing sensors…</p>
      </div>
    );
  }

  const unhealthy = latest.aqi > AQI_THRESHOLD;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Wind className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Air Quality Monitor</h1>
              <p className="text-xs text-muted-foreground">Real-time IoT sensor dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--good)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--good)]" />
              </span>
              Live · updates every 5s
            </span>
            <button
              type="button"
              onClick={requestNotif}
              aria-label={notifGranted ? "Browser alerts enabled" : "Enable browser alerts"}
              aria-pressed={notifGranted}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              {notifGranted ? (
                <Bell className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <BellOff className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {notifGranted ? "Alerts on" : "Enable alerts"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {unhealthy && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-3 rounded-xl border border-[var(--unhealthy)]/40 bg-[var(--unhealthy)]/10 p-4"
          >
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--unhealthy)]"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-[var(--unhealthy)]">Unhealthy air detected</p>
              <p className="text-sm text-muted-foreground">
                AQI is {latest.aqi}, above the safe threshold of {AQI_THRESHOLD}. Limit outdoor
                exposure and consider wearing a mask.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AqiGauge aqi={latest.aqi} status={latest.status} />
          </div>
          <MetricCard
            label="Gas (MQ135)"
            value={latest.gas}
            unit="ppm"
            icon={Flame}
            accent={accent}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="PM2.5" value={latest.pm25} unit="µg/m³" icon={Activity} />
          <MetricCard label="PM10" value={latest.pm10} unit="µg/m³" icon={Gauge} />
          <MetricCard label="Temperature" value={latest.temperature} unit="°C" icon={Thermometer} />
          <MetricCard label="Humidity" value={latest.humidity} unit="%" icon={Droplets} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section
            aria-labelledby="aqi-trend-heading"
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <h2 id="aqi-trend-heading" className="mb-3 text-sm font-semibold">
              AQI Trend
            </h2>
            <div className="h-64">
              <AqiTrend history={history} />
            </div>
          </section>
          <section
            aria-labelledby="climate-trend-heading"
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <h2 id="climate-trend-heading" className="mb-3 text-sm font-semibold">
              Temperature & Humidity
            </h2>
            <div className="h-64">
              <ClimateTrend history={history} />
            </div>
          </section>
        </div>

        <section aria-labelledby="history-heading">
          <h2 id="history-heading" className="mb-3 text-sm font-semibold">
            Historical Readings
          </h2>
          <HistoryTable history={history} />
        </section>

        <footer className="pt-4 pb-8 text-center text-xs text-muted-foreground">
          Simulated sensor data · Threshold AQI &gt; {AQI_THRESHOLD} triggers alerts
        </footer>
      </main>
    </div>
  );
}
