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
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Reading } from "@/lib/sensor";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const fmt = (t: number) =>
  new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export function AqiTrend({ history }: { history: Reading[] }) {
  const data = {
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
  };
  return <Line data={data} options={chartOpts("AQI over time")} />;
}

export function ClimateTrend({ history }: { history: Reading[] }) {
  const data = {
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
  };
  return <Line data={data} options={chartOpts("Temperature & Humidity")} />;
}

function chartOpts(title: string) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: true, position: "bottom" as const, labels: { boxWidth: 12 } },
      title: { display: false, text: title },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 6, autoSkip: true } },
      y: { grid: { color: "rgba(0,0,0,0.05)" }, beginAtZero: false },
    },
  };
}
