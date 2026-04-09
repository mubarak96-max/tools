"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getQueueDelay, MAX_INPUT_LENGTH, QUEUE_MESSAGES } from "@/lib/tools/humanizer";
import type { HumanizerStatus } from "@/types/tools";

const textareaClass =
  "min-h-[14rem] w-full rounded-[1.25rem] border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary";

export default function AIHumanizer() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [status, setStatus] = useState<HumanizerStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [queueMessage, setQueueMessage] = useState(QUEUE_MESSAGES[0]);
  const [queueProgress, setQueueProgress] = useState(0);

  const messageIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const charsRemaining = MAX_INPUT_LENGTH - inputText.length;
  const isOverLimit = inputText.length > MAX_INPUT_LENGTH;
  const isEmpty = inputText.trim().length === 0;
  const isProcessing = status === "queued" || status === "processing";

  const stopQueueSimulation = useCallback(() => {
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current);
      messageIntervalRef.current = null;
    }

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopQueueSimulation();
      abortRef.current?.abort();
    };
  }, [stopQueueSimulation]);

  const startQueueSimulation = useCallback((delayMs: number) => {
    setQueueProgress(0);
    setQueueMessage(QUEUE_MESSAGES[0]);
    let messageIndex = 0;
    const messageStep = Math.max(900, Math.floor(delayMs / QUEUE_MESSAGES.length));
    const tickMs = 100;
    const totalTicks = delayMs / tickMs;
    let tick = 0;

    messageIntervalRef.current = setInterval(() => {
      messageIndex = Math.min(messageIndex + 1, QUEUE_MESSAGES.length - 1);
      setQueueMessage(QUEUE_MESSAGES[messageIndex]);
    }, messageStep);

    progressIntervalRef.current = setInterval(() => {
      tick += 1;
      const raw = tick / totalTicks;
      const eased = 1 - Math.pow(1 - raw, 2);
      setQueueProgress(Math.min(eased * 92, 92));
    }, tickMs);
  }, []);

  async function handleHumanize() {
    if (isEmpty || isOverLimit || isProcessing) {
      return;
    }

    setStatus("queued");
    setOutputText("");
    setErrorMsg("");
    setCopied(false);

    const delay = getQueueDelay();
    startQueueSimulation(delay);
    await new Promise((resolve) => window.setTimeout(resolve, delay));

    stopQueueSimulation();
    setStatus("processing");
    setQueueMessage("Processing...");
    setQueueProgress(96);

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
        signal: abortRef.current.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setQueueProgress(100);
      setOutputText(data.humanized);
      setStatus("done");
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setErrorMsg(error instanceof Error ? error.message : "An unexpected error occurred.");
      setQueueProgress(0);
      setStatus("error");
    }
  }

  async function handleCopy() {
    if (!outputText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function handleReset() {
    abortRef.current?.abort();
    stopQueueSimulation();
    setStatus("idle");
    setInputText("");
    setOutputText("");
    setErrorMsg("");
    setCopied(false);
    setQueueMessage(QUEUE_MESSAGES[0]);
    setQueueProgress(0);
  }

  return (
    <section className="tool-frame p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
        <div className="space-y-5">
          <label className="block space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">Paste AI-generated text</span>
              <span
                className={[
                  "text-xs font-semibold uppercase tracking-[0.16em]",
                  isOverLimit ? "text-danger" : charsRemaining <= 40 ? "text-warning-soft-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                {inputText.length} / {MAX_INPUT_LENGTH}
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              maxLength={MAX_INPUT_LENGTH}
              placeholder="Paste AI-generated text here. Keep it under 300 characters for the fastest rewrite."
              rows={7}
              disabled={isProcessing}
              className={textareaClass}
              spellCheck={false}
            />
          </label>

          <p className="text-sm leading-6 text-muted-foreground">
            Works on text from ChatGPT, Claude, Gemini, Copilot, and other AI writing tools.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleHumanize}
              disabled={isEmpty || isOverLimit || isProcessing}
              className="inline-flex items-center justify-center rounded-[1rem] bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "queued" ? "Queued..." : status === "processing" ? "Humanizing..." : "Humanize text"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-[1rem] border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              Reset
            </button>
          </div>

          {(status === "queued" || status === "processing") && (
            <div className="rounded-[1.25rem] border border-border bg-background p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-foreground">{queueMessage}</p>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {Math.round(queueProgress)}%
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground transition-[width] duration-300"
                  style={{ width: `${queueProgress}%` }}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                The queue is intentional. It slows abuse, keeps costs predictable, and makes the output feel like a real rewrite pass.
              </p>
            </div>
          )}

          {errorMsg ? (
            <div className="rounded-[1.25rem] border border-danger/30 bg-danger-soft p-4 text-sm leading-6 text-danger-soft-foreground">
              {errorMsg}
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 rounded-[1.5rem] border border-border bg-background p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Output
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">Humanized version</h2>
          </div>

          <div className="min-h-[16rem] rounded-[1rem] border border-border bg-card p-4 text-sm leading-7 text-foreground">
            {outputText ? (
              <p className="whitespace-pre-wrap">{outputText}</p>
            ) : (
              <p className="text-muted-foreground">
                Your rewritten text will appear here after the queue and API pass complete.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputText}
              className="inline-flex items-center justify-center rounded-[0.9rem] border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copied" : "Copy output"}
            </button>
          </div>

        </aside>
      </div>
    </section>
  );
}


