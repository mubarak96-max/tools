"use client";

import { useEffect, useState, useRef } from "react";

type TimerMode = "work" | "shortBreak" | "longBreak";

const MODE_TIMES: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState<number>(MODE_TIMES.work);
  const [isActive, setIsActive] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      // Play a simple notification sound natively
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 1);
      
      // Auto-switch modes logically
      if (mode === "work") switchMode("shortBreak");
      else switchMode("work");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate progress for the circular ring
  const totalTime = MODE_TIMES[mode];
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="space-y-6">
      <section className="tool-frame p-6 sm:p-10 flex flex-col items-center justify-center min-h-[500px]">
        
        {/* Top Controls */}
        <div className="flex w-full max-w-md items-center rounded-full border border-border bg-muted/30 p-1.5 mb-10">
          <button
            onClick={() => switchMode("work")}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${
              mode === "work" ? "bg-red-500 text-white shadow-md shadow-red-500/20" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Work (25m)
          </button>
          <button
            onClick={() => switchMode("shortBreak")}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${
              mode === "shortBreak" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Break (5m)
          </button>
          <button
            onClick={() => switchMode("longBreak")}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${
              mode === "longBreak" ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Long (15m)
          </button>
        </div>

        {/* Circular Timer Display */}
        <div className="relative flex items-center justify-center w-64 h-64 mb-10">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-border"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={(2 * Math.PI * 120) * (1 - progressPercent / 100)}
              className={`transition-all duration-1000 ease-linear ${
                mode === "work" ? "text-red-500" : mode === "shortBreak" ? "text-emerald-500" : "text-blue-500"
              }`}
            />
          </svg>
          <div className="absolute text-6xl font-bold tracking-tighter text-foreground tabular-nums">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-4 w-full max-w-sm">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-4 px-8 rounded-full text-lg font-bold tracking-wide uppercase transition-all shadow-lg hover:-translate-y-1 ${
              isActive 
                ? "bg-muted text-muted-foreground hover:bg-muted/80 shadow-none border border-border" 
                : mode === "work"
                  ? "bg-red-500 text-white shadow-red-500/30"
                  : mode === "shortBreak"
                    ? "bg-emerald-500 text-white shadow-emerald-500/30"
                    : "bg-blue-500 text-white shadow-blue-500/30"
            }`}
          >
            {isActive ? "Pause" : "Start Focus"}
          </button>
          
          <button
            onClick={resetTimer}
            className="flex-none p-4 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Reset Timer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>

      </section>

      {/* Info Boxes */}
      <div className="grid sm:grid-cols-3 gap-6">
        <article className="rounded-[1.5rem] border border-border bg-background p-6">
           <h3 className="text-base font-semibold text-foreground">1. Work Session</h3>
           <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Focus intensely on a single task without any distractions for exactly 25 minutes. Do not check your phone.</p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-6">
           <h3 className="text-base font-semibold text-foreground">2. Short Break</h3>
           <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Take a 5-minute breather. Stand up, stretch, grab some water, and rest your eyes from the screen.</p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-6">
           <h3 className="text-base font-semibold text-foreground">3. Long Break</h3>
           <p className="mt-2 text-sm text-muted-foreground leading-relaxed">After completing 4 full work sessions, reward yourself with a restorative 15-minute break away from your desk.</p>
        </article>
      </div>
    </div>
  );
}
