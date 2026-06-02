import { memo, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Reading } from "@/lib/sensor";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const fmt = (t: number) =>
  new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

function chartOpts(title: string): ChartOptions<"line"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: true, position: "bottom", labels: { boxWidth: 12 } },
      title: { display: false, text: title },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 6, autoSkip: true } },
      y: { grid: { color: "rgba(0,0,0,0.05)" }, beginAtZero: false },
    },
  };
}

const AQI_OPTS = chartOpts("AQI over time");
const CLIMATE_OPTS = chartOpts("Temperature & Humidity");

export const AqiTrend = memo(function AqiTrend({ history }: { history: Reading[] }) {
  const data = useMemo<ChartData<"line">>(
    () => ({
      labels: history.map((r) => fmt(r.timestamp)),
      datasets: [
        {
          label: "AQI",
          data: history.map((r) => r.aqi),
          borderColor: "hsl(220 90% 56%)",
          backgroundColor: "hsla(220, 90%, 56%, 0.15)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    }),
    [history],
  );
  return <Line data={data} options={AQI_OPTS} aria-label="AQI trend chart" role="img" />;
});

export const ClimateTrend = memo(function ClimateTrend({ history }: { history: Reading[] }) {
  const data = useMemo<ChartData<"line">>(
    () => ({
      labels: history.map((r) => fmt(r.timestamp)),
      datasets: [
        {
          label: "Temperature (°C)",
          data: history.map((r) => r.temperature),
          borderColor: "hsl(15 90% 55%)",
          backgroundColor: "hsla(15, 90%, 55%, 0.1)",
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
          yAxisID: "y",
        },
        {
          label: "Humidity (%)",
          data: history.map((r) => r.humidity),
          borderColor: "hsl(195 85% 45%)",
          backgroundColor: "hsla(195, 85%, 45%, 0.1)",
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
          yAxisID: "y",
        },
      ],
    }),
    [history],
  );
  return (
    <Line data={data} options={CLIMATE_OPTS} aria-label="Temperature and humidity chart" role="img" />
  );
});
