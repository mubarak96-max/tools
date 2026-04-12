"use client";

import { useState } from "react";
import { Check, Copy, Globe, Loader2, Search } from "lucide-react";

import {
    SUPPORTED_RECORD_TYPES,
    isValidDomain,
    normalizeDomain,
    type DnsLookupResponse,
    type DnsRecordResult,
    type DnsRecordType,
} from "@/lib/tools/dns";

const DEFAULT_TYPES = new Set<DnsRecordType>(["A", "AAAA", "MX", "CNAME", "TXT", "NS"]);

function RecordSection({ result }: { result: DnsRecordResult }) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        const text = result.records.join("\n");
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <article className="tool-frame p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-semibold tracking-tight text-foreground">{result.type}</h3>
                {!result.error && result.records.length > 0 && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 rounded-[1rem] border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                    >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                )}
            </div>
            {result.error ? (
                <p className="mt-3 text-sm text-muted-foreground">{result.error}</p>
            ) : (
                <ul className="mt-3 space-y-1">
                    {result.records.map((record, i) => (
                        <li key={i} className="rounded-[0.75rem] bg-background px-3 py-2 font-mono text-xs leading-5 text-foreground">
                            {record}
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
}

export default function DnsChecker() {
    const [domain, setDomain] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<Set<DnsRecordType>>(new Set(DEFAULT_TYPES));
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [response, setResponse] = useState<DnsLookupResponse | null>(null);
    const [clientError, setClientError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    function toggleType(type: DnsRecordType) {
        setSelectedTypes((prev) => {
            const next = new Set(prev);
            if (next.has(type)) {
                next.delete(type);
            } else {
                next.add(type);
            }
            return next;
        });
    }

    async function handleLookup() {
        const normalized = normalizeDomain(domain);
        if (!isValidDomain(normalized)) {
            setClientError("Enter a valid domain name.");
            return;
        }
        setStatus("loading");
        setClientError(null);
        setServerError(null);
        setResponse(null);

        try {
            const res = await fetch("/api/dns-lookup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain: normalized, recordTypes: [...selectedTypes] }),
            });
            const data = await res.json();
            if (!res.ok) {
                setStatus("error");
                setServerError(data.error ?? "An unexpected error occurred.");
            } else {
                setStatus("success");
                setResponse(data as DnsLookupResponse);
            }
        } catch {
            setStatus("error");
            setServerError("Failed to reach the server. Please try again.");
        }
    }

    return (
        <div className="space-y-6">
            {/* Input card */}
            <section className="tool-frame p-4 sm:p-6">
                <div className="space-y-4">
                    {/* Domain input */}
                    <div className="space-y-2">
                        <label htmlFor="dns-domain" className="block text-sm font-medium text-muted-foreground">
                            Domain name
                        </label>
                        <div className="relative">
                            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                id="dns-domain"
                                type="text"
                                value={domain}
                                onChange={(e) => {
                                    setDomain(e.target.value);
                                    setClientError(null);
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                                placeholder="example.com"
                                spellCheck={false}
                                autoCapitalize="none"
                                autoCorrect="off"
                                className="w-full rounded-[1rem] border border-border bg-background py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        {clientError && (
                            <p className="text-xs text-red-600">{clientError}</p>
                        )}
                    </div>

                    {/* Record type toggles */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Record types</p>
                        <div className="flex flex-wrap gap-2">
                            {SUPPORTED_RECORD_TYPES.map((type) => {
                                const active = selectedTypes.has(type);
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleType(type)}
                                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${active
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Lookup button */}
                    <button
                        type="button"
                        onClick={handleLookup}
                        disabled={status === "loading"}
                        className="flex items-center gap-2 rounded-[1rem] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {status === "loading" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                        {status === "loading" ? "Looking up…" : "Look up"}
                    </button>
                </div>
            </section>

            {/* Server error */}
            {status === "error" && serverError && (
                <div className="rounded-[1rem] border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700">
                    {serverError}
                </div>
            )}

            {/* Results */}
            {status === "success" && response && (
                <section className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Results for <span className="font-medium text-foreground">{response.domain}</span>
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {response.results.map((result) => (
                            <RecordSection key={result.type} result={result} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
