# Implementation Plan: DNS Checker

## Overview

Implement the DNS Checker tool as a Next.js page at `/utility/dns-checker`. The work is split into three layers: pure logic library (`src/lib/tools/dns.ts`), server-side API route (`/api/dns-lookup`), and client-side React component (`DnsChecker.tsx`).

## Tasks

- [-] 1. Create the DNS tool logic library
  - [x] 1.1 Create `src/lib/tools/dns.ts` with types and pure functions
    - Define `DnsRecordType` union type and `SUPPORTED_RECORD_TYPES` constant array
    - Define `DnsRecordResult` and `DnsLookupResponse` interfaces
    - Implement `normalizeDomain(input: string): string` — strips `http://`, `https://`, `www.`, lowercases, removes trailing slash
    - Implement `isValidDomain(input: string): boolean` — applies the DNS label regex after normalization, enforces 253-char max
    - Implement `normalizeRecords(type: DnsRecordType, raw: unknown): string[]` — handles all 10 record types per the design pseudocode; returns `[]` for null/undefined input
    - Implement `classifyDnsError(error: unknown): string` — maps ENOTFOUND/ENODATA/ESERVFAIL → "No records found", ETIMEOUT → "Lookup timed out", else → "Lookup failed"
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [ ] 1.2 Write property test for `normalizeDomain` idempotency
    - **Property 3: normalizeDomain is idempotent**
    - **Validates: Requirements 5.7**

  - [ ] 1.3 Write property test for `normalizeDomain` lowercase output
    - **Property 4: normalizeDomain produces lowercase output**
    - **Validates: Requirements 1.4**

  - [ ] 1.4 Write property test for normalization preserving validity
    - **Property 5: Normalization preserves validity**
    - **Validates: Requirements 1.3, 1.4**

  - [ ] 1.5 Write property test for valid domain acceptance
    - **Property 1: Valid domains are accepted by the Validator**
    - **Validates: Requirements 1.1**

  - [ ] 1.6 Write property test for invalid input rejection
    - **Property 2: Invalid inputs are rejected by the Validator**
    - **Validates: Requirements 1.2**

  - [ ] 1.7 Write property test for array-type record count preservation
    - **Property 6: Array-type record normalization preserves count**
    - **Validates: Requirements 5.1, 5.2, 5.5, 5.6**

  - [ ] 1.8 Write property test for SOA normalization returning exactly 7 fields
    - **Property 7: SOA normalization always returns exactly 7 fields**
    - **Validates: Requirements 5.4**

  - [ ] 1.9 Write property test for MX records sorted by priority ascending
    - **Property 8: MX records are sorted by priority ascending**
    - **Validates: Requirements 5.2**

- [x] 2. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [-] 3. Create the API route
  - [x] 3.1 Create `src/app/api/dns-lookup/route.ts`
    - Export `runtime = "nodejs"` to opt out of the Edge runtime
    - Implement `POST` handler: parse body, validate `domain` (return 400 with `"A domain name is required."` if missing/non-string), normalize, validate (return 400 with `"Enter a valid domain name."` if invalid)
    - Filter `recordTypes` against `SUPPORTED_RECORD_TYPES`; default to `["A","AAAA","MX","CNAME","TXT","NS"]` if result is empty
    - Resolve all types in parallel with `Promise.allSettled`, map settlements to `DnsRecordResult[]` using `normalizeRecords` and `classifyDnsError`
    - Return `200` with `DnsLookupResponse`; never return `500` for DNS resolution failures
    - _Requirements: 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3, 4.4_

  - [ ] 3.2 Write property test for all requested record types appearing in the API response
    - **Property 9: All requested record types appear in the API response**
    - Mock `dns/promises` to return realistic data; verify `results.length === requestedTypes.length` and each type is present
    - **Validates: Requirements 3.1, 3.6**

  - [ ] 3.3 Write property test for API never returning 500 for DNS resolution failures
    - **Property 10: API never returns 500 for DNS resolution failures**
    - Mock `dns/promises` to throw various error codes; verify HTTP status is always 200
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.7**

  - [ ] 3.4 Write property test for invalid domains being rejected with 400
    - **Property 11: Invalid domains are rejected by the API with 400**
    - **Validates: Requirements 4.2**

  - [ ] 3.5 Write property test for unsupported record types being filtered
    - **Property 12: Unsupported record types are filtered from API requests**
    - **Validates: Requirements 2.4, 4.4**

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create the page and client component
  - [x] 5.1 Create the page entry point `src/app/utility/dns-checker/page.tsx`
    - Add page metadata (title, description) following the existing tool page pattern
    - Render the `DnsChecker` component
    - _Requirements: 6.1_

  - [x] 5.2 Create `src/app/utility/dns-checker/components/DnsChecker.tsx`
    - Mark `"use client"`
    - Implement controlled domain input with inline validation error display; block API call and show error when domain is invalid
    - Render toggle buttons for all 10 record types (A, AAAA, MX, CNAME, TXT, NS, SOA, PTR, SRV, CAA); default selection is A, AAAA, MX, CNAME, TXT, NS
    - Implement `handleLookup`: normalize domain, validate client-side, POST to `/api/dns-lookup`, handle loading/success/error states
    - Disable the lookup button and show a loading indicator while `status === "loading"`
    - On success, render one section per `DnsRecordResult` grouped by type; show empty-state + error message when `result.error` is set
    - On API error response, display the server error message without rendering a results section
    - Add a copy-to-clipboard button per record type section that copies all records as plain text
    - _Requirements: 1.5, 2.1, 2.2, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests require `fast-check` — add it as a devDependency (`npm install -D fast-check`) before running them
- Each task references specific requirements for traceability
- The API route must export `runtime = "nodejs"` since `dns/promises` is not available in the Edge runtime
- `classifyDnsError` lives in `src/lib/tools/dns.ts` alongside the other pure functions so it can be unit-tested independently of the route handler
