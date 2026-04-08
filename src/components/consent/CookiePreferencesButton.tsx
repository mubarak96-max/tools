"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className="text-slate-700 transition-colors hover:text-primary"
    >
      Cookie settings
    </button>
  );
}
