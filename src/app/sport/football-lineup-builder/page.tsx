import type { Metadata } from "next"
import FootballLineupBuilder from "./components/FootballLineupBuilder"

export const metadata: Metadata = {
    title: "Football Lineup Builder | Create Custom Team Formations",
    description:
        "Build and customize football team lineups with our interactive tool. Choose from 12 formations, assign players, customize team colors, and export as PNG.",
}

export default function FootballLineupBuilderPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Football Lineup Builder
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Create professional football team lineups. Select a formation,
                        assign players, customize your team colors, and download your
                        lineup as a PNG image.
                    </p>
                </header>

                <FootballLineupBuilder />
            </div>
        </main>
    )
}
