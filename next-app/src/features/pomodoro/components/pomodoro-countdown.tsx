"use client";

import { useEffect, useState } from "react";

function formatCountdown(seconds: number) {
  const absolute = Math.abs(seconds);
  const minutes = Math.floor(absolute / 60);
  const remainderSeconds = absolute % 60;
  const label = `${String(minutes).padStart(2, "0")}:${String(
    remainderSeconds
  ).padStart(2, "0")}`;

  return seconds >= 0 ? label : `+${label}`;
}

export function PomodoroCountdown({
  startedAt,
  durationMinutes
}: {
  startedAt: string;
  durationMinutes: number;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const startedAtMs = new Date(startedAt).getTime();
  const targetAtMs = startedAtMs + durationMinutes * 60 * 1000;
  const remainingSeconds = Math.round((targetAtMs - now) / 1000);
  const overtime = remainingSeconds < 0;

  return (
    <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
        {overtime ? "Qua gio" : "Con lai"}
      </div>
      <div className="mt-3 text-5xl font-black">
        {formatCountdown(remainingSeconds)}
      </div>
    </div>
  );
}
