"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import {
  CONSENT_CHANGE_EVENT,
  CONSENT_OPEN_EVENT,
  CONSENT_STORAGE_KEY,
  type ConsentChoice,
} from "@/lib/consent";

function readConsentChoice() {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

function subscribeToConsentStore(onStoreChange: () => void) {
  function handleConsentChange() {
    onStoreChange();
  }

  function handleStorageChange(event: StorageEvent) {
    if (event.key === CONSENT_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export default function CookieConsentBanner() {
  const consentChoice = useSyncExternalStore(
    subscribeToConsentStore,
    readConsentChoice,
    () => "uninitialized" as const,
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleOpenPreferences() {
      setIsOpen(true);
    }

    window.addEventListener(CONSENT_OPEN_EVENT, handleOpenPreferences);

    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, handleOpenPreferences);
    };
  }, []);

  function persistConsent(choice: ConsentChoice) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: choice }));
  }

  const isVisible = consentChoice !== "uninitialized" && (consentChoice === null || isOpen);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-3xl rounded-[1.5rem] border border-border bg-card p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)] sm:bottom-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Privacy choices
          </p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">Cookies, analytics, and ads</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We use Google services to measure traffic and show ads. We only load those scripts after
            you accept. You can read the details in our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          {consentChoice ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Current choice: <span className="font-semibold text-foreground">{consentChoice}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => persistConsent("accepted")}
            className="rounded-[0.9rem] bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Accept Google services
          </button>
          <button
            type="button"
            onClick={() => persistConsent("declined")}
            className="rounded-[0.9rem] border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
