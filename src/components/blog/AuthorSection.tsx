import React from "react";
import Link from "next/link";

interface AuthorSectionProps {
  className?: string;
  showBio?: boolean;
  variant?: "light" | "dark";
}

export function AuthorSection({
  className = "",
  showBio = false,
  variant = "light"
}: AuthorSectionProps) {
  const isDark = variant === "dark";

  return (
    <div className={`flex items-center gap-4 ${className}`}>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Link
            href="https://www.linkedin.com/in/mubarak-mutesa-43a21095/"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-bold hover:underline underline-offset-4 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Mubarak
          </Link>
          <span className="text-slate-500">•</span>
          <Link
            href="https://www.linkedin.com/in/mubarak-mutesa-43a21095/"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all hover:scale-105 active:scale-95 ${isDark
                ? "text-blue-400 hover:text-blue-300 bg-blue-500/10"
                : "text-blue-600 hover:text-blue-700 bg-blue-50"
              }`}
          >
            LinkedIn
          </Link>
        </div>
        {showBio ? (
          <p className={`text-sm leading-relaxed max-w-md ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Developer and Digital Marketer.
          </p>
        ) : (
          <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>Developer and Digital Marketer</span>
        )}
      </div>
    </div>
  );
}

export default AuthorSection;
