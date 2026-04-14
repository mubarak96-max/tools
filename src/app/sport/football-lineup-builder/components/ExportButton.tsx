"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { exportLineupAsPng } from "../utils/export"
import type React from "react"

interface ExportButtonProps {
    pitchRef: React.RefObject<HTMLDivElement | null>
    teamName: string
}

export default function ExportButton({ pitchRef, teamName }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleExport = async () => {
        setIsExporting(true)
        setError(null)

        try {
            await exportLineupAsPng(pitchRef, teamName)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Export failed")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="space-y-2">
            <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isExporting ? (
                    <>
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span>Exporting...</span>
                    </>
                ) : (
                    <>
                        <Download className="h-4 w-4" />
                        <span>Download PNG</span>
                    </>
                )}
            </button>

            {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
                    {error}
                </p>
            )}
        </div>
    )
}
