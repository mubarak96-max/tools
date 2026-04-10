"use client";

import { useMemo, useState } from "react";

import { decodeJwt } from "@/lib/tools/jwt";

const textareaClass =
  "min-h-[12rem] w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none focus:ring-2 focus:ring-primary";

export default function JwtDecoder() {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature",
  );
  const result = useMemo(() => decodeJwt(token), [token]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <section className="tool-frame p-4 sm:p-6">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-muted-foreground">JWT token</span>
          <textarea value={token} onChange={(e) => setToken(e.target.value)} className={textareaClass} spellCheck={false} />
        </label>
        {!result.valid ? (
          <div className="mt-4 rounded-[1rem] border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700">
            {result.error}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            This tool decodes the header and payload locally in the browser. It does not validate the signature.
          </p>
        )}
      </section>

      <section className="space-y-6">
        <article className="tool-frame p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Header</h2>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(result.header)}
              className="rounded-[1rem] border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              Copy
            </button>
          </div>
          <pre className="mt-5 overflow-x-auto rounded-[1.25rem] border border-border bg-background p-4 text-sm leading-6 text-foreground">
            {result.header || "{}"}
          </pre>
        </article>

        <article className="tool-frame p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Payload</h2>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(result.payload)}
              className="rounded-[1rem] border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              Copy
            </button>
          </div>
          <pre className="mt-5 overflow-x-auto rounded-[1.25rem] border border-border bg-background p-4 text-sm leading-6 text-foreground">
            {result.payload || "{}"}
          </pre>
        </article>
      </section>
    </div>
  );
}
