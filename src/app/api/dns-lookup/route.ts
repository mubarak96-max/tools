import dns from "dns/promises";
import { NextRequest, NextResponse } from "next/server";

import {
    classifyDnsError,
    DnsLookupResponse,
    DnsRecordResult,
    DnsRecordType,
    isValidDomain,
    normalizeDomain,
    normalizeRecords,
    SUPPORTED_RECORD_TYPES,
} from "@/lib/tools/dns";

export const runtime = "nodejs";

const DEFAULT_RECORD_TYPES: DnsRecordType[] = ["A", "AAAA", "MX", "CNAME", "TXT", "NS"];

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => ({}));

    if (!body.domain || typeof body.domain !== "string") {
        return NextResponse.json({ error: "A domain name is required." }, { status: 400 });
    }

    const normalized = normalizeDomain(body.domain);

    if (!isValidDomain(normalized)) {
        return NextResponse.json({ error: "Enter a valid domain name." }, { status: 400 });
    }

    const requested: unknown[] = Array.isArray(body.recordTypes) ? body.recordTypes : [];
    const types: DnsRecordType[] = requested.filter((t): t is DnsRecordType =>
        (SUPPORTED_RECORD_TYPES as readonly unknown[]).includes(t)
    );
    const resolveTypes = types.length > 0 ? types : DEFAULT_RECORD_TYPES;

    const settlements = await Promise.allSettled(
        resolveTypes.map((type) => dns.resolve(normalized, type).then((raw) => normalizeRecords(type, raw)))
    );

    const results: DnsRecordResult[] = resolveTypes.map((type, i) => {
        const settlement = settlements[i];
        if (settlement.status === "fulfilled") {
            return { type, records: settlement.value };
        }
        return { type, records: [], error: classifyDnsError(settlement.reason) };
    });

    const response: DnsLookupResponse = { domain: normalized, results };
    return NextResponse.json(response);
}
