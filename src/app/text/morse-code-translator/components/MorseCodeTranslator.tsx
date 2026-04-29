"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { normalizeMorseInput, translateMorse, type MorseMode } from "@/lib/tools/morse-code";

const DEFAULT_TEXT_EXAMPLE = "SOS";
const DEFAULT_MORSE_EXAMPLE = "... --- ...";
const DEFAULT_MODE: MorseMode = "text-to-morse";
const DEFAULT_WPM = 18;
const DEFAULT_FREQUENCY = 650;

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

const buttonClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const modes: Array<{ value: MorseMode; label: string; hint: string }> = [
  { value: "text-to-morse", label: "Text to Morse", hint: "Letters are separated by spaces, words by /" },
  { value: "morse-to-text", label: "Morse to Text", hint: "Use spaces between letters and / between words" },
];

const textExamples = [
  { label: "SOS", value: "SOS" },
  { label: "HELLO", value: "HELLO" },
  { label: "I LOVE YOU", value: "I LOVE YOU" },
  { label: "123", value: "123" },
  { label: "WORLD", value: "WORLD" },
];

const morseExamples = [
  { label: "SOS", value: "... --- ..." },
  { label: "HELLO", value: ".... . .-.. .-.. ---" },
  { label: "CQ", value: "-.-. --.-" },
  { label: "WORLD", value: ".-- --- .-. .-.. -.." },
  { label: "123", value: ".---- ..--- ...--" },
];

function getInitialState() {
  if (typeof window === "undefined") {
    return {
      mode: DEFAULT_MODE,
      text: DEFAULT_TEXT_EXAMPLE,
      wpm: DEFAULT_WPM,
      frequency: DEFAULT_FREQUENCY,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const nextMode = params.get("mode");
  const nextInput = params.get("input");
  const nextWpm = Number(params.get("wpm"));
  const nextFrequency = Number(params.get("frequency"));
  const mode = nextMode === "text-to-morse" || nextMode === "morse-to-text" ? nextMode : DEFAULT_MODE;

  return {
    mode,
    text:
      typeof nextInput === "string" && nextInput.length > 0
        ? nextInput
        : mode === "morse-to-text"
          ? DEFAULT_MORSE_EXAMPLE
          : DEFAULT_TEXT_EXAMPLE,
    wpm: Number.isFinite(nextWpm) && nextWpm >= 5 && nextWpm <= 40 ? nextWpm : DEFAULT_WPM,
    frequency:
      Number.isFinite(nextFrequency) && nextFrequency >= 350 && nextFrequency <= 1100
        ? nextFrequency
        : DEFAULT_FREQUENCY,
  };
}

function getShareUrl(mode: MorseMode, input: string, wpm: number, frequency: number) {
  const params = new URLSearchParams();
  params.set("mode", mode);
  params.set("input", input);
  params.set("wpm", String(wpm));
  params.set("frequency", String(frequency));
  return params.toString();
}

function getPlayableMorseSequence(text: string, mode: MorseMode, translatedOutput: string) {
  if (mode === "text-to-morse") {
    return translatedOutput.trim();
  }

  return normalizeMorseInput(text);
}

function scheduleMorsePlayback(
  context: AudioContext,
  sequence: string,
  frequency: number,
  wpm: number,
  cleanupNodes: OscillatorNode[],
) {
  const dotDuration = 1.2 / wpm;
  let cursor = context.currentTime + 0.05;

  const words = sequence
    .trim()
    .split("/")
    .map((word) => word.trim())
    .filter(Boolean);

  for (let wordIndex = 0; wordIndex < words.length; wordIndex += 1) {
    const letters = words[wordIndex].split(/\s+/).filter(Boolean);

    for (let letterIndex = 0; letterIndex < letters.length; letterIndex += 1) {
      const letter = letters[letterIndex];

      for (let symbolIndex = 0; symbolIndex < letter.length; symbolIndex += 1) {
        const symbol = letter[symbolIndex];
        if (symbol !== "." && symbol !== "-") {
          continue;
        }

        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        const duration = symbol === "." ? dotDuration : dotDuration * 3;

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(0.0001, cursor);
        gainNode.gain.linearRampToValueAtTime(0.16, cursor + 0.01);
        gainNode.gain.setValueAtTime(0.16, cursor + Math.max(duration - 0.015, 0.01));
        gainNode.gain.linearRampToValueAtTime(0.0001, cursor + duration);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        oscillator.start(cursor);
        oscillator.stop(cursor + duration);
        cleanupNodes.push(oscillator);

        cursor += duration;

        if (symbolIndex < letter.length - 1) {
          cursor += dotDuration;
        }
      }

      if (letterIndex < letters.length - 1) {
        cursor += dotDuration * 3;
      }
    }

    if (wordIndex < words.length - 1) {
      cursor += dotDuration * 7;
    }
  }

  return Math.max(cursor - context.currentTime, 0);
}

export default function MorseCodeTranslator() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const playbackTimeoutRef = useRef<number | null>(null);

  const initialState = useMemo(() => getInitialState(), []);
  const [text, setText] = useState(initialState.text);
  const [mode, setMode] = useState<MorseMode>(initialState.mode);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [shareState, setShareState] = useState<"idle" | "copied" | "error">("idle");
  const [playbackState, setPlaybackState] = useState<"idle" | "playing" | "error">("idle");
  const [wpm, setWpm] = useState(initialState.wpm);
  const [frequency, setFrequency] = useState(initialState.frequency);

  const result = useMemo(() => translateMorse(text, mode), [mode, text]);
  const activeExamples = mode === "text-to-morse" ? textExamples : morseExamples;
  const playableSequence = getPlayableMorseSequence(text, mode, result.output);
  const hasPlayableSequence = /[.-]/.test(playableSequence);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const query = getShareUrl(mode, text, wpm, frequency);
    const nextUrl = `${window.location.pathname}?${query}`;
    window.history.replaceState(null, "", nextUrl);
  }, [frequency, mode, text, wpm]);

  useEffect(() => {
    return () => {
      if (playbackTimeoutRef.current) {
        window.clearTimeout(playbackTimeoutRef.current);
      }

      oscillatorsRef.current.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch { }
      });
      oscillatorsRef.current = [];

      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  function resetTransientStates() {
    setCopyState("idle");
    setShareState("idle");
  }

  function stopPlayback() {
    if (playbackTimeoutRef.current) {
      window.clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }

    oscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch { }
    });
    oscillatorsRef.current = [];
    setPlaybackState("idle");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.output);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }

  async function handleShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 1800);
    } catch {
      setShareState("error");
      window.setTimeout(() => setShareState("idle"), 1800);
    }
  }

  function handleDownload() {
    const blob = new Blob([result.output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const extension = mode === "text-to-morse" ? "morse.txt" : "text.txt";

    anchor.href = url;
    anchor.download = `morse-code-translator-output.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    setText("");
    resetTransientStates();
    stopPlayback();
  }

  function handleLoadExample(value: string) {
    setText(value);
    resetTransientStates();
    stopPlayback();
  }

  function handleSwapDirection() {
    const nextMode: MorseMode = mode === "text-to-morse" ? "morse-to-text" : "text-to-morse";
    const nextInput = result.output || (nextMode === "text-to-morse" ? DEFAULT_TEXT_EXAMPLE : DEFAULT_MORSE_EXAMPLE);

    setMode(nextMode);
    setText(nextInput);
    resetTransientStates();
    stopPlayback();
  }

  async function handlePlayback() {
    if (!hasPlayableSequence || typeof window === "undefined") {
      return;
    }

    if (playbackState === "playing") {
      stopPlayback();
      return;
    }

    try {
      const AudioContextCtor = window.AudioContext;
      if (!AudioContextCtor) {
        setPlaybackState("error");
        window.setTimeout(() => setPlaybackState("idle"), 1800);
        return;
      }

      const context = audioContextRef.current ?? new AudioContextCtor();
      audioContextRef.current = context;

      if (context.state === "suspended") {
        await context.resume();
      }

      stopPlayback();
      setPlaybackState("playing");

      const duration = scheduleMorsePlayback(
        context,
        playableSequence,
        frequency,
        wpm,
        oscillatorsRef.current,
      );

      playbackTimeoutRef.current = window.setTimeout(() => {
        oscillatorsRef.current = [];
        setPlaybackState("idle");
      }, Math.ceil(duration * 1000) + 120);
    } catch {
      stopPlayback();
      setPlaybackState("error");
      window.setTimeout(() => setPlaybackState("idle"), 1800);
    }
  }

  const modeHelpText =
    mode === "text-to-morse"
      ? "Paste plain text, names, numbers, or short phrases here. The translator encodes each supported character into standard International Morse."
      : "Paste Morse code using spaces between letters and a slash between words, for example ... --- ... / .... . .-.. .-.. ---.";

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="grid gap-3 md:grid-cols-2">
              {modes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setMode(item.value);
                    setText(item.value === "text-to-morse" ? DEFAULT_TEXT_EXAMPLE : DEFAULT_MORSE_EXAMPLE);
                    resetTransientStates();
                    stopPlayback();
                  }}
                  className={`rounded-[1rem] border px-4 py-4 text-left transition-colors ${mode === item.value
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/20"
                    }`}
                >
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{item.hint}</div>
                </button>
              ))}
            </div>

          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                {mode === "text-to-morse" ? "Input text" : "Input Morse code"}
              </span>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={
                  mode === "text-to-morse"
                    ? "Type text to convert into Morse code."
                    : "Paste Morse code using spaces between letters and / between words."
                }
                className={textareaClass}
              />
              <p className="text-xs leading-5 text-muted-foreground">{modeHelpText}</p>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                {mode === "text-to-morse" ? "Morse output" : "Text output"}
              </span>
              <textarea
                value={result.output}
                readOnly
                className={`${textareaClass} bg-card`}
                placeholder="Translated output appears here."
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Use the share link button to save this exact mode, input, WPM, and tone frequency in the URL.
              </p>
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleCopy} className={buttonClass}>
                {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy result"}
              </button>
              <button type="button" onClick={handleShareLink} className={buttonClass}>
                {shareState === "copied" ? "Link copied" : shareState === "error" ? "Share failed" : "Copy share link"}
              </button>
              <button type="button" onClick={handleDownload} className={buttonClass}>
                Download output
              </button>
              <button type="button" onClick={handleSwapDirection} className={buttonClass}>
                Swap direction
              </button>
              <button
                type="button"
                onClick={handlePlayback}
                disabled={!hasPlayableSequence}
                className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {playbackState === "playing"
                  ? "Stop audio"
                  : playbackState === "error"
                    ? "Audio failed"
                    : "Play Morse audio"}
              </button>
              <button type="button" onClick={handleClear} className={buttonClass}>
                Clear
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Popular examples
              </span>
              {activeExamples.map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => handleLoadExample(example.value)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Morse audio controls</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Hear the current Morse sequence directly in the browser. This is useful for learning timing, checking
                  SOS patterns, and comparing written symbols to real beep spacing.
                </p>
              </div>
              <div className="rounded-[1rem] border border-primary/15 bg-primary-soft px-4 py-3 text-sm text-primary-soft-foreground">
                {hasPlayableSequence
                  ? `Ready to play ${playableSequence.split(/\s+/).filter(Boolean).length} Morse units.`
                  : "Enter or generate Morse code to enable audio playback."}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Speed: {wpm} WPM</span>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={wpm}
                  onChange={(event) => setWpm(Number(event.target.value))}
                  className="w-full accent-primary"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Tone: {frequency} Hz</span>
                <input
                  type="range"
                  min={350}
                  max={1100}
                  step={10}
                  value={frequency}
                  onChange={(event) => setFrequency(Number(event.target.value))}
                  className="w-full accent-primary"
                />
              </label>
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Translation stats
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Morse snapshot</h2>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Input characters</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.inputCharacters}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Output characters</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.outputCharacters}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Translated units</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.translatedUnits}</p>
            </div>

            <div className="rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Unsupported items</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{result.unsupportedCount}</p>
            </div>
          </div>



          <div className="rounded-[1rem] border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Playback source</p>
            <p className="mt-2 break-words font-mono text-sm leading-6 text-foreground">
              {playableSequence || "No Morse sequence available yet."}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
