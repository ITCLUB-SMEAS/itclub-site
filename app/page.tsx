"use client";

import { useEffect, useRef, useState } from "react";

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

export default function Home() {
  const targetTimestampRef = useRef(Date.now() + 45 * DAY);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetTimestampRef.current)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTimestampRef.current));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isComplete = timeLeft.total <= 0;

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

        {isComplete ? (
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
