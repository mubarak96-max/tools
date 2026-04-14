import fs from "fs";
import path from "path";
import type { ToolPagePath } from "./types";

export const KNOWN_CATEGORIES = [
    "finance",
    "health",
    "real-estate",
    "construction",
    "text",
    "utility",
    "image",
    "pdf",
    "ai",
    "sport",
] as const;

export type KnownCategory = (typeof KNOWN_CATEGORIES)[number];

export function discoverToolPages(category?: string): ToolPagePath[] {
    const categories = category ? [category] : KNOWN_CATEGORIES;
    const results: ToolPagePath[] = [];
    const appDir = path.resolve(process.cwd(), "src/app");

    for (const cat of categories) {
        const catDir = path.join(appDir, cat);
        if (!fs.existsSync(catDir)) continue;

        let entries: fs.Dirent[];
        try {
            entries = fs.readdirSync(catDir, { withFileTypes: true });
        } catch {
            continue;
        }

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;
            // Exclude dynamic route segments
            if (entry.name.startsWith("[")) continue;

            const toolDir = path.join(catDir, entry.name);
            const pageFile = path.join(toolDir, "page.tsx");
            const componentsDir = path.join(toolDir, "components");

            if (!fs.existsSync(pageFile)) continue;
            if (!fs.existsSync(componentsDir)) continue;

            results.push({
                category: cat,
                toolSlug: entry.name,
                pagePath: path.relative(process.cwd(), pageFile).replace(/\\/g, "/"),
            });
        }
    }

    return results;
}
