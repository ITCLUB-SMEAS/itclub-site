"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const MILLISECOND = 1000;
const MINUTE = 60 * MILLISECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const calculateTimeLeft = (target: number): TimeLeft => {
  const difference = target - Date.now();
  if (difference <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / DAY);
  const hours = Math.floor((difference % DAY) / HOUR);
  const minutes = Math.floor((difference % HOUR) / MINUTE);
  const seconds = Math.floor((difference % MINUTE) / MILLISECOND);

  return { total: difference, days, hours, minutes, seconds };
};

const formatTwoDigits = (value: number) => value.toString().padStart(2, "0");
const STORAGE_KEY = "comingSoonTargetTimestamp";

export default function Home() {
  const [targetTimestamp, setTargetTimestamp] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    let storedValue: number | null = null;
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? Number.parseInt(raw, 10) : NaN;
      if (Number.isFinite(parsed)) {
        storedValue = parsed;
      }
    }

    const now = Date.now();
    const effectiveTimestamp =
      storedValue && storedValue > now ? storedValue : now + 45 * DAY;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, effectiveTimestamp.toString());
    }

    setTargetTimestamp(effectiveTimestamp);
    setTimeLeft(calculateTimeLeft(effectiveTimestamp));
  }, []);

  useEffect(() => {
    if (!targetTimestamp) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTimestamp));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const isComplete = timeLeft ? timeLeft.total <= 0 : false;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-sans text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.35),transparent_55%)]" />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-12 px-6 py-16 text-center">
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
            Coming Soon
          </span>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Sesuatu yang istimewa akan hadir dalam 45 hari
          </h1>
          <p className="mx-auto max-w-xl text-sm text-slate-300 sm:text-base">
            Kami sedang menyiapkan pengalaman baru untukmu. Simpan tanggalnya dan
            kembali lagi untuk mengetahui kabar terbarunya.
          </p>
        </div>

        {!timeLeft ? (
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            {["Hari", "Jam", "Menit", "Detik"].map((label) => (
              <TimeCard key={label} value="--" label={label} />
            ))}
          </div>
        ) : isComplete ? (
          <div className="w-full rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur">
            <p className="text-lg font-medium text-white">
              Waktunya tiba — situs kami sudah siap!
            </p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            <TimeCard value={timeLeft.days.toString()} label="Hari" />
            <TimeCard value={formatTwoDigits(timeLeft.hours)} label="Jam" />
            <TimeCard value={formatTwoDigits(timeLeft.minutes)} label="Menit" />
            <TimeCard value={formatTwoDigits(timeLeft.seconds)} label="Detik" />
          </div>
        )}

        <div className="mx-auto max-w-md space-y-3 text-sm text-slate-400">
          <p>
            Ingin jadi yang pertama tahu? Pantau terus situs ini atau ikuti kanal
            media sosial kami untuk pembaruan terbaru.
          </p>
          <p>Terima kasih sudah bersabar menunggu!</p>
        </div>
      </main>
    </div>
  );
}

type TimeCardProps = {
  value: string;
  label: string;
};

const TimeCard = ({ value, label }: TimeCardProps) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
      <div className="text-4xl font-semibold sm:text-5xl">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-300">
        {label}
      </div>
    </div>
  );
};
