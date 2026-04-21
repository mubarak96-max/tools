// DNS record types supported by this tool
export type DnsRecordType =
    | "A"
    | "AAAA"
    | "MX"
    | "CNAME"
    | "TXT"
    | "NS"
    | "SOA"
    | "PTR"
    | "SRV"
    | "CAA";

export const SUPPORTED_RECORD_TYPES: readonly DnsRecordType[] = [
    "A",
    "AAAA",
    "MX",
    "CNAME",
    "TXT",
    "NS",
    "SOA",
    "PTR",
    "SRV",
    "CAA",
] as const;

export interface DnsRecordResult {
    type: DnsRecordType;
    records: string[];
    error?: string;
}

export interface DnsLookupResponse {
    domain: string;
    results: DnsRecordResult[];
}

// Regex per spec: valid DNS label pattern
const DOMAIN_REGEX =
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

/**
 * Strips protocol (http://, https://), www. prefix, lowercases, and removes trailing slash.
 * Idempotent: applying twice yields the same result as once.
 */
export function normalizeDomain(input: string): string {
    let s = input.trim();
    // Strip protocol
    s = s.replace(/^https?:\/\//i, "");
    // Strip www.
    s = s.replace(/^www\./i, "");
    // Remove trailing slash
    s = s.replace(/\/+$/, "");
    // Lowercase
    s = s.toLowerCase();
    return s;
}

/**
 * Returns true iff the input (after normalization) is a syntactically valid domain name.
 */
export function isValidDomain(input: string): boolean {
    const stripped = normalizeDomain(input);
    if (stripped === "" || stripped.length > 253) return false;
    return DOMAIN_REGEX.test(stripped);
}

/**
 * Converts raw Node.js dns/promises output into an array of human-readable strings.
 * Returns [] for null/undefined input.
 */
export function normalizeRecords(type: DnsRecordType, raw: unknown): string[] {
    if (raw == null) return [];

    switch (type) {
        case "A":
        case "AAAA":
        case "NS":
        case "CNAME":
        case "PTR":
            return raw as string[];

        case "MX": {
            const mx = raw as { exchange: string; priority: number }[];
            return mx
                .slice()
                .sort((a, b) => a.priority - b.priority)
                .map((r) => `${r.priority} ${r.exchange}`);
        }

        case "TXT": {
            const txt = raw as string[][];
            return txt.map((chunks) => chunks.join(""));
        }

        case "SOA": {
            const soa = raw as {
                nsname: string;
                hostmaster: string;
                serial: number;
                refresh: number;
                retry: number;
                expire: number;
                minttl: number;
            };
            return [
                `nsname: ${soa.nsname}`,
                `hostmaster: ${soa.hostmaster}`,
                `serial: ${soa.serial}`,
                `refresh: ${soa.refresh}`,
                `retry: ${soa.retry}`,
                `expire: ${soa.expire}`,
                `minttl: ${soa.minttl}`,
            ];
        }

        case "SRV": {
            const srv = raw as {
                priority: number;
                weight: number;
                port: number;
                name: string;
            }[];
            return srv.map((r) => `${r.priority} ${r.weight} ${r.port} ${r.name}`);
        }

        case "CAA": {
            const caa = raw as {
                critical: number;
                issue?: string;
                issuewild?: string;
                iodef?: string;
            }[];
            return caa.map(
                (r) => `${r.critical} ${r.issue ?? r.issuewild ?? r.iodef}`
            );
        }

        default:
            return (raw as unknown[]).map((r) => String(r));
    }
}

/**
 * Maps a Node.js dns/promises error to a user-friendly message.
 */
export function classifyDnsError(error: unknown): string {
    const code = (error as { code?: string })?.code;
    if (code === "ENOTFOUND" || code === "ENODATA" || code === "ESERVFAIL") {
        return "No records found";
    }
    if (code === "ETIMEOUT") {
        return "Lookup timed out";
    }
    return "Lookup failed";
}
