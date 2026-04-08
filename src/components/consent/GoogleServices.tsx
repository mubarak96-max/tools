"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

import {
  ADSENSE_CLIENT_ID,
  CONSENT_CHANGE_EVENT,
  CONSENT_STORAGE_KEY,
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

export default function GoogleServices() {
  const consentChoice = useSyncExternalStore(
    subscribeToConsentStore,
    readConsentChoice,
    () => "uninitialized" as const,
  );

  if (consentChoice !== "accepted") {
    return null;
  }

  return (
    <>
      <Script
        id="google-adsense"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />

      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      ) : null}
    </>
  );
}
