export type Reading = {
  timestamp: number;
  aqi: number;
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  gas: number;
  status: "Good" | "Moderate" | "Unhealthy";
};

export function aqiStatus(aqi: number): Reading["status"] {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  return "Unhealthy";
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

// Random walk simulator so values feel like sensor readings
let state = {
  aqi: 60,
  pm25: 20,
  pm10: 35,
  temperature: 26,
  humidity: 55,
  gas: 280,
};

const drift = (v: number, amt: number) => v + (Math.random() - 0.5) * amt;

export function nextReading(): Reading {
  state = {
    aqi: clamp(drift(state.aqi, 18), 10, 220),
    pm25: clamp(drift(state.pm25, 8), 2, 180),
    pm10: clamp(drift(state.pm10, 10), 5, 250),
    temperature: clamp(drift(state.temperature, 1.2), 15, 40),
    humidity: clamp(drift(state.humidity, 4), 20, 95),
    gas: clamp(drift(state.gas, 40), 100, 900),
  };
  const aqi = Math.round(state.aqi);
  return {
    timestamp: Date.now(),
    aqi,
    pm25: +state.pm25.toFixed(1),
    pm10: +state.pm10.toFixed(1),
    temperature: +state.temperature.toFixed(1),
    humidity: Math.round(state.humidity),
    gas: Math.round(state.gas),
    status: aqiStatus(aqi),
  };
}
