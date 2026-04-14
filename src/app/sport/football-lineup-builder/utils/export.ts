import { toPng } from "html-to-image"
import type React from "react"

export function validateJersey(input: string): string {
    if (!input || input.trim() === "") return ""
    const num = Number(input)
    if (!Number.isFinite(num) || input.trim() === "") return ""
    const int = Math.round(num)
    if (isNaN(int)) return ""
    const clamped = Math.min(99, Math.max(1, int))
    return String(clamped)
}

export function sanitizeFilename(teamName: string): string {
    const sanitized = teamName.replace(/[^a-zA-Z0-9_\-. ]/g, "").trim()
    return sanitized || "lineup"
}

async function waitForImagesToLoad(element: HTMLElement): Promise<void> {
    const images = element.querySelectorAll("img")
    const imagePromises = Array.from(images).map((img) => {
        if (img.complete) {
            return Promise.resolve()
        }
        return new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => {
                console.warn("Image failed to load:", img.src)
                resolve() // Continue even if image fails
            }
            // Timeout after 5 seconds
            setTimeout(() => {
                console.warn("Image load timeout:", img.src)
                resolve()
            }, 5000)
        })
    })
    await Promise.all(imagePromises)
}

export async function exportLineupAsPng(
    ref: React.RefObject<HTMLDivElement | null>,
    teamName: string
): Promise<void> {
    if (!ref.current) {
        throw new Error("Cannot export: pitch element is not mounted")
    }

    // Wait for all images to load before exporting
    try {
        await waitForImagesToLoad(ref.current)
    } catch (err) {
        console.warn("Some images failed to load, continuing with export")
    }

    const filename = sanitizeFilename(teamName) + "-lineup.png"
    let dataUrl: string
    try {
        dataUrl = await toPng(ref.current, { pixelRatio: 2 })
    } catch (err) {
        throw new Error(
            `Failed to generate PNG: ${err instanceof Error ? err.message : String(err)}`
        )
    }
    const anchor = document.createElement("a")
    anchor.href = dataUrl
    anchor.download = filename
    anchor.click()
}
