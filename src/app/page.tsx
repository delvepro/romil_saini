"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type MediaItem = {
  src: string;
  type: "image" | "video";
};

const mediaItems: MediaItem[] = [
  { src: "/media/Snapchat-1364163286.jpg", type: "image" },
  { src: "/media/Snapchat-1611842586.jpg", type: "image" },
  { src: "/media/Snapchat-214408470.jpg", type: "image" },
  { src: "/media/Snapchat-214975705.jpg", type: "image" },
  { src: "/media/Snapchat-275751804.jpg", type: "image" },
  { src: "/media/Snapchat-532917110.jpg", type: "image" },
  { src: "/media/Snapchat-848168237.jpg", type: "image" },
  { src: "/media/Snapchat-819415499.mp4", type: "video" },
];

const BIRTHDAY_TARGET_MS = new Date(2026, 3, 24, 0, 0, 0).getTime();

function getCountdown(timerEndAt: number) {
  const now = new Date().getTime();
  const distance = timerEndAt - now;

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isDone: true };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / 1000 / 60) % 60),
    seconds: Math.floor((distance / 1000) % 60),
    isDone: false,
  };
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [transitionStage, setTransitionStage] = useState<"in" | "out">("in");
  const [isAnimating, setIsAnimating] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [partyAnswer, setPartyAnswer] = useState<"no" | "yes" | null>(null);
  const [restartButtonOffset, setRestartButtonOffset] = useState({ x: 0, y: 0 });
  const [timerEndAt, setTimerEndAt] = useState(BIRTHDAY_TARGET_MS);
  const [countdown, setCountdown] = useState(() => getCountdown(BIRTHDAY_TARGET_MS));
  const imageMemories = mediaItems.filter((item) => item.type === "image");
  const videoMemories = mediaItems.filter((item) => item.type === "video");
  const isPartyApproved = partyAnswer === "yes";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(timerEndAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [timerEndAt]);

  useEffect(() => {
    if (step !== 5 || isPartyApproved) {
      setRestartButtonOffset({ x: 0, y: 0 });
      return;
    }

    const moveButton = () => {
      const isMobileViewport = window.innerWidth < 640;
      setRestartButtonOffset({
        x: isMobileViewport
          ? Math.floor(Math.random() * 120) - 60
          : Math.floor(Math.random() * 220) - 110,
        y: isMobileViewport
          ? Math.floor(Math.random() * 24) - 12
          : Math.floor(Math.random() * 34) - 17,
      });
    };

    moveButton();
    const intervalId = window.setInterval(moveButton, 700);
    return () => window.clearInterval(intervalId);
  }, [step, isPartyApproved]);

  const changeStep = (targetStep: number) => {
    if (isAnimating || targetStep === step || targetStep < 0 || targetStep > 5) {
      return;
    }

    setIsAnimating(true);
    setTransitionStage("out");

    window.setTimeout(() => {
      setStep(targetStep);
      setTransitionStage("in");
      setBurstKey((value) => value + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(() => setIsAnimating(false), 330);
    }, 260);
  };

  const nextStep = () => changeStep(step + 1);
  const prevStep = () => changeStep(step - 1);
  const resetTimer = () => {
    const endAt = BIRTHDAY_TARGET_MS;
    setTimerEndAt(endAt);
    setCountdown(getCountdown(endAt));
  };

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-3 py-6 text-slate-100 sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 h-[420px] bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.28),transparent_42%),radial-gradient(circle_at_75%_10%,rgba(45,212,191,0.22),transparent_40%),radial-gradient(circle_at_55%_85%,rgba(132,204,22,0.22),transparent_45%)] blur-3xl" />

      <header className="supports-backdrop-filter:bg-white/10 sticky top-2 z-30 mb-4 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 shadow-[0_14px_45px_rgba(2,6,23,0.45)] backdrop-blur-2xl sm:top-4 sm:mb-6 sm:px-5 sm:py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={item}
                className={`h-2 w-6 rounded-full border transition-all duration-300 sm:w-12 ${
                  step >= index
                    ? "border-emerald-200/70 bg-linear-to-r from-emerald-300 to-teal-300 shadow-[0_0_20px_rgba(16,185,129,0.58)]"
                    : "border-white/20 bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/8 p-4 shadow-[0_18px_70px_rgba(2,6,23,0.5)] backdrop-blur-2xl sm:rounded-[28px] sm:p-10">
        <div className="pointer-events-none absolute -left-16 top-8 h-44 w-44 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-teal-500/25 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.03)_35%,rgba(255,255,255,0.02)_100%)] opacity-50" />
        <div
          key={step}
          className={`relative ${transitionStage === "in" ? "step-enter" : "step-leave"}`}
        >
          <div key={burstKey} className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, index) => (
              <span
                key={index}
                className="next-burst absolute text-xl sm:text-2xl"
                style={{
                  left: `${12 + index * 11}%`,
                  top: `${20 + (index % 3) * 18}%`,
                  animationDelay: `${index * 0.03}s`,
                }}
              >
                ✨
              </span>
            ))}
          </div>
          {step === 0 && (
            <div className="slide-in text-center">
              <h1 className="bg-linear-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-2xl font-extrabold text-transparent drop-shadow-[0_0_22px_rgba(16,185,129,0.32)] sm:text-5xl">
                Pehle Cake Cut Karein
              </h1>
              <p className="mt-2 text-sm text-slate-200/90 sm:text-base">
                Countdown to 24-04-2026 starts now.
              </p>
              <div className="mt-6 text-7xl sm:text-9xl" style={{ animation: "float 3.2s ease-in-out infinite" }}>
                🎂
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:mx-auto sm:max-w-2xl sm:grid-cols-4">
                {[
                  { label: "Days", value: countdown.days },
                  { label: "Hours", value: countdown.hours },
                  { label: "Minutes", value: countdown.minutes },
                  { label: "Seconds", value: countdown.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="motion-card motion-up rounded-2xl border border-white/25 bg-white/9 px-3 py-3 text-center shadow-[0_12px_30px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(16,185,129,0.25)] sm:px-4 sm:py-4"
                  >
                    <p className="text-xl font-bold sm:text-3xl">{item.value}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200/80">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              {countdown.isDone && (
                <p className="mt-4 text-sm font-semibold text-emerald-300">
                  Time up! Click Next for the next surprise.
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="slide-in grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div className="motion-card motion-left rounded-2xl border border-white/25 bg-white/11 p-5 text-slate-100 shadow-[0_16px_40px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200/45">
                <h2 className="mt-2 text-2xl font-bold">About Your Cuteness</h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-200/90 sm:text-base">
                  Pehli baat to ye ki tumhari smile ka level bilkul premium hai, full
                  heart-melting, aur tumhari vibe aisi hai ki boring se boring din bhi
                  highlight reel ban jata hai. Tum jab room me aati ho to energy
                  automatically upgrade ho jati hai, aur tumhari hasi ka timing itna
                  perfect hota hai ki stand-up comedians bhi notes lene lag jaayein.
                  Sach me, tum cute bhi ho, classy bhi ho, aur funny bhi itni ho ki
                  mood ka low battery percent seedha 100 pe chala jata hai. Lekin ab
                  thoda sach ka dose bhi: itni over-cute mat hua karo, warna logon ko
                  lagta hai tum innocent ho, jabki tum secretly full-time nautanki CEO
                  ho. Aur haan, tumhari "main bilkul serious hoon" wali shakal dekh ke
                  to sabse zyada hasi aati hai, kyunki 5 second baad tum khud hi
                  hasne lagti ho. Matlab officially tum sweet ho, par thodi si drama
                  queen, thodi si meme machine, aur full-time happiness supplier bhi.
                </p>
              </div>
              <div className="motion-card motion-right overflow-hidden rounded-2xl border border-emerald-200/35 bg-white/7 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.5)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
                <Image
                  src="/media/Snapchat-848168237.jpg"
                  alt="Beauty portrait"
                  width={550}
                  height={700}
                  className="h-full max-h-[360px] w-full rounded-xl object-contain transition duration-500 hover:scale-[1.02] sm:max-h-[420px]"
                  priority
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="slide-in">
            <h2 className="bg-linear-to-r from-white to-emerald-100 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
              Some Cute Images
            </h2>
            <p className="mt-2 text-sm text-slate-200/90 sm:text-base">
              Har photo mein tum aur bhi zyada pretty lagti ho.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {imageMemories.slice(0, 6).map((item) => (
                <div
                  key={item.src}
                  className="motion-card motion-up rounded-2xl border border-white/25 bg-white/8 p-2 shadow-[0_14px_35px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200/45 hover:shadow-[0_20px_45px_rgba(16,185,129,0.25)]"
                >
                  <Image
                    src={item.src}
                    alt="Romil memory"
                    width={600}
                    height={800}
                    className="h-60 w-full rounded-xl object-contain transition duration-500 hover:scale-[1.03] sm:h-72"
                  />
                </div>
              ))}
            </div>
            </div>
          )}

          {step === 3 && (
            <div className="slide-in text-center">
            <h2 className="bg-linear-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              Our Future
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-200/90 sm:text-lg">
              Future mein aur bhi zyada smiles, more trips, more late-night
              talks, more dreams, and endless memories with you. I want every
              coming birthday to be even more special than this one.
            </p>
            <div className="motion-card motion-up mt-8 rounded-2xl border border-white/25 bg-white/10 p-5 text-left shadow-[0_16px_40px_rgba(15,23,42,0.42)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
              <p className="text-sm leading-relaxed text-slate-100">
                Best future wishes:
                <br />- Career mein hamesha growth mile.
                <br />- Har goal easily achieve ho.
                <br />- Health, happiness aur success always saath rahe.
              </p>
            </div>
            </div>
          )}

          {step === 4 && (
            <div className="slide-in relative">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 18 }).map((_, index) => (
                <span
                  key={index}
                  className="absolute text-3xl"
                  style={{
                    left: `${(index % 6) * 18}%`,
                    top: `${(index % 3) * 18}%`,
                    animation: `popperFall ${2.5 + (index % 4) * 0.35}s linear infinite`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  🎉
                </span>
              ))}
            </div>
            <h2 className="bg-linear-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-center text-3xl font-extrabold text-transparent drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] sm:text-5xl">
              Happy Birthday Romil Saini
            </h2>
            <p className="mt-3 text-center text-sm text-slate-100/90 sm:text-base">
              Party poppers on, birthday mode on.
            </p>
            <div className="motion-card motion-up relative mx-auto mt-7 w-full max-w-4xl overflow-hidden rounded-3xl border border-emerald-200/45 bg-white/10 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.5)] backdrop-blur-2xl sm:p-6">
              <div className="pointer-events-none absolute -left-8 top-0 h-36 w-36 rounded-full bg-emerald-400/30 blur-3xl" />
              <div className="pointer-events-none absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-teal-400/30 blur-3xl" />
              <div className="relative rounded-2xl border border-white/30 bg-white/8 px-5 py-14 text-center sm:px-8 sm:py-20">
                <h3 className="bg-linear-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-3xl font-extrabold text-transparent drop-shadow-[0_0_20px_rgba(16,185,129,0.35)] sm:text-6xl">
                  Happy Birthday
                </h3>
                <p className="mt-3 text-lg font-semibold text-emerald-100 sm:text-2xl">
                  Romil Saini
                </p>
              </div>
            </div>
            </div>
          )}

          {step === 5 && (
            <div className="slide-in text-center">
              <div
                className="motion-card motion-up mx-auto mt-2 w-fit rounded-3xl border border-emerald-300/50 bg-emerald-500/18 px-6 py-5 shadow-[0_10px_30px_rgba(16,185,129,0.25)] backdrop-blur-xl"
                style={{ animation: "float 2.6s ease-in-out infinite" }}
              >
                <div className="text-7xl sm:text-8xl">😡🏏</div>
              </div>
              <div className="motion-card motion-up mx-auto mt-6 max-w-2xl rounded-2xl border border-white/25 bg-white/11 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.44)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
                <p className="mt-3 text-xl font-bold leading-relaxed text-slate-100 sm:text-2xl">
                  Bhaag kaha rhi h... party deke jana pdega!
                </p>
              </div>
              <div className="motion-card motion-up mx-auto mt-6 flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-white/20 bg-white/8 p-3 shadow-[0_14px_36px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:flex-row sm:p-4">
                <button
                  type="button"
                  onClick={() => setPartyAnswer("no")}
                  className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition-all duration-300 sm:px-4 sm:text-sm ${
                    partyAnswer === "no"
                      ? "border-emerald-200/60 bg-emerald-500/30 text-emerald-50 shadow-[0_8px_24px_rgba(16,185,129,0.3)]"
                      : "border-white/25 bg-white/10 text-slate-100 hover:bg-white/20"
                  }`}
                >
                  party nhi dugi
                </button>
                <button
                  type="button"
                  onClick={() => setPartyAnswer("yes")}
                  className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition-all duration-300 sm:px-4 sm:text-sm ${
                    isPartyApproved
                      ? "border-emerald-200/70 bg-emerald-500/30 text-emerald-50 shadow-[0_8px_24px_rgba(16,185,129,0.3)]"
                      : "border-white/25 bg-white/10 text-slate-100 hover:bg-white/20"
                  }`}
                >
                  haa party de dugi
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 0 || isAnimating}
            className="rounded-full border border-white/30 bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100 shadow-[0_8px_25px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-[0_14px_28px_rgba(96,165,250,0.22)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Back
          </button>
          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={isAnimating}
              className="rounded-full border border-emerald-200/55 bg-linear-to-r from-emerald-500/55 to-teal-500/55 px-6 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-50 shadow-[0_10px_30px_rgba(16,185,129,0.38)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(16,185,129,0.52)] disabled:opacity-60"
            >
              Next
            </button>
          ) : (
            <div className="relative ml-auto h-11 min-w-[190px] overflow-hidden sm:overflow-visible">
              <button
                type="button"
                onClick={() => {
                  if (!isPartyApproved) {
                    return;
                  }
                  setStep(0);
                  setPartyAnswer(null);
                  resetTimer();
                }}
                disabled={!isPartyApproved}
                style={{
                  transform: `translate(${restartButtonOffset.x}px, ${restartButtonOffset.y}px)`,
                }}
                className={`absolute right-0 rounded-full border px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-50 shadow-[0_10px_30px_rgba(16,185,129,0.38)] backdrop-blur-xl transition-all duration-300 sm:text-xs sm:tracking-[0.16em] ${
                  isPartyApproved
                    ? "border-emerald-200/55 bg-linear-to-r from-emerald-500/55 to-teal-500/55 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(16,185,129,0.52)]"
                    : "pointer-events-none border-white/25 bg-white/10 text-slate-300/90"
                }`}
              >
                Restart Surprise
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
