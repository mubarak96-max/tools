# Requirements Document

## Introduction

The DNS Checker is a utility tool that allows users to look up DNS records for any domain directly from the browser. It is accessible at `/utility/dns-checker` within the existing Next.js platform. The tool provides a client-side React component for input and display, a server-side API route for DNS resolution using Node.js's built-in `dns/promises` module, and a pure-logic library for domain validation and record normalization.

## Glossary

- **DnsChecker**: The client-side React component (`DnsChecker.tsx`) that manages all UI state and user interaction for the DNS lookup tool.
- **API_Route**: The server-side Next.js route handler at `/api/dns-lookup` that performs DNS resolution.
- **Validator**: The pure function `isValidDomain` in `src/lib/tools/dns.ts` that checks whether a string is a syntactically valid domain name.
- **Normalizer**: The pure function `normalizeDomain` in `src/lib/tools/dns.ts` that strips protocol prefixes and normalizes casing.
- **RecordNormalizer**: The pure function `normalizeRecords` in `src/lib/tools/dns.ts` that converts raw Node.js `dns/promises` output into human-readable strings.
- **DnsRecordType**: One of the ten supported DNS record types: A, AAAA, MX, CNAME, TXT, NS, SOA, PTR, SRV, CAA.
- **DnsRecordResult**: A structured object containing a `DnsRecordType`, an array of normalized record strings, and an optional user-friendly error message.
- **DnsLookupResponse**: The top-level API response object containing the normalized domain and an array of `DnsRecordResult` entries.
- **SUPPORTED_RECORD_TYPES**: The constant array of all ten valid `DnsRecordType` values exported from `src/lib/tools/dns.ts`.

---

## Requirements

### Requirement 1: Domain Input Validation

**User Story:** As a user, I want the tool to validate my domain input before making a lookup, so that I receive immediate feedback on malformed input without waiting for a network request.

#### Acceptance Criteria

1. WHEN a user submits a domain string that matches the pattern `/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/` after normalization, THE Validator SHALL return `true`.
2. WHEN a user submits a domain string that is empty, contains spaces, is an IP address, or exceeds 253 characters after normalization, THE Validator SHALL return `false`.
3. WHEN a user submits a domain string prefixed with `http://`, `https://`, or `www.`, THE Normalizer SHALL strip those prefixes before validation.
4. THE Normalizer SHALL convert the domain to lowercase and remove any trailing slash.
5. WHEN a user submits an invalid domain and clicks the lookup button, THE DnsChecker SHALL display an inline validation error message and SHALL NOT call the API_Route.

---

### Requirement 2: Record Type Selection

**User Story:** As a user, I want to select which DNS record types to query, so that I can focus on the information relevant to my investigation.

#### Acceptance Criteria

1. THE DnsChecker SHALL present toggle controls for each of the following record types: A, AAAA, MX, CNAME, TXT, NS, SOA, PTR, SRV, CAA.
2. WHEN a user selects one or more record types and submits a lookup, THE DnsChecker SHALL include exactly those selected record types in the `recordTypes` field of the API_Route request body.
3. WHEN the API_Route receives a request with an empty or entirely unsupported `recordTypes` array, THE API_Route SHALL default to querying record types A, AAAA, MX, CNAME, TXT, and NS.
4. THE API_Route SHALL filter the incoming `recordTypes` array against SUPPORTED_RECORD_TYPES and SHALL ignore any values not present in that allowlist.

---

### Requirement 3: DNS Resolution

**User Story:** As a user, I want the tool to resolve all selected DNS record types for my domain, so that I can see complete DNS information in a single request.

#### Acceptance Criteria

1. WHEN the API_Route receives a valid domain and record types, THE API_Route SHALL resolve all requested record types in parallel using `Promise.allSettled`.
2. WHEN a DNS lookup for a record type succeeds, THE API_Route SHALL include a `DnsRecordResult` with the normalized records and no `error` field for that type.
3. WHEN a DNS lookup for a record type fails with error code `ENOTFOUND`, `ENODATA`, or `ESERVFAIL`, THE API_Route SHALL include a `DnsRecordResult` with `error: "No records found"` and an empty `records` array for that type.
4. WHEN a DNS lookup for a record type fails with error code `ETIMEOUT`, THE API_Route SHALL include a `DnsRecordResult` with `error: "Lookup timed out"` and an empty `records` array for that type.
5. WHEN a DNS lookup for a record type fails with any other error, THE API_Route SHALL include a `DnsRecordResult` with `error: "Lookup failed"` and an empty `records` array for that type.
6. WHEN one or more record type lookups fail, THE API_Route SHALL still return `DnsRecordResult` entries for all other requested record types that succeeded.
7. THE API_Route SHALL return HTTP status 200 for all DNS resolution outcomes, including partial or total lookup failures.

---

### Requirement 4: API Input Validation

**User Story:** As a system operator, I want the API route to validate its inputs server-side, so that malformed or malicious requests are rejected before reaching the DNS resolver.

#### Acceptance Criteria

1. WHEN the API_Route receives a request body with a missing or non-string `domain` field, THE API_Route SHALL return HTTP 400 with `{ "error": "A domain name is required." }`.
2. WHEN the API_Route receives a request body with a `domain` value that fails validation after normalization, THE API_Route SHALL return HTTP 400 with `{ "error": "Enter a valid domain name." }`.
3. THE API_Route SHALL validate the `domain` field server-side using the Validator, independent of any client-side validation already performed.
4. THE API_Route SHALL filter the `recordTypes` field against SUPPORTED_RECORD_TYPES before passing values to the DNS resolver.

---

### Requirement 5: Record Normalization

**User Story:** As a user, I want DNS records displayed in a consistent, human-readable format, so that I can interpret results without knowledge of raw Node.js DNS output structures.

#### Acceptance Criteria

1. WHEN the RecordNormalizer processes A, AAAA, NS, CNAME, or PTR records, THE RecordNormalizer SHALL return the raw string array unchanged.
2. WHEN the RecordNormalizer processes MX records, THE RecordNormalizer SHALL return strings in the format `"<priority> <exchange>"` sorted by priority ascending.
3. WHEN the RecordNormalizer processes TXT records, THE RecordNormalizer SHALL join each inner chunk array into a single string per record.
4. WHEN the RecordNormalizer processes a SOA record, THE RecordNormalizer SHALL return exactly 7 labeled strings: `nsname`, `hostmaster`, `serial`, `refresh`, `retry`, `expire`, and `minttl`.
5. WHEN the RecordNormalizer processes SRV records, THE RecordNormalizer SHALL return strings in the format `"<priority> <weight> <port> <name>"`.
6. WHEN the RecordNormalizer processes CAA records, THE RecordNormalizer SHALL return strings in the format `"<critical> <tag-value>"`.
7. THE Normalizer SHALL be idempotent: applying it twice to any input SHALL produce the same result as applying it once.
8. IF the RecordNormalizer receives a null or undefined `raw` value, THEN THE RecordNormalizer SHALL return an empty array without throwing.

---

### Requirement 6: Results Display

**User Story:** As a user, I want to see DNS lookup results clearly organized by record type, so that I can quickly find and copy the information I need.

#### Acceptance Criteria

1. WHEN the API_Route returns a successful `DnsLookupResponse`, THE DnsChecker SHALL render the results grouped by `DnsRecordType`, with one section per requested type.
2. WHEN a `DnsRecordResult` contains an `error` field, THE DnsChecker SHALL display an empty-state indicator and the error message for that record type section.
3. WHEN results are displayed, THE DnsChecker SHALL provide a copy-to-clipboard button for each record type section that copies all records for that type as plain text.
4. WHILE a lookup is in progress, THE DnsChecker SHALL display a loading indicator and SHALL disable the lookup button.
5. WHEN the API_Route returns an error response, THE DnsChecker SHALL display the server error message and SHALL NOT render a results section.
