"use client"

import { Image as ImageIcon } from "lucide-react"
import { useState } from "react"

interface HeaderSectionProps {
    teamName: string
    subtitle: string
    logoUrl: string | null
    visible: boolean
}

export default function HeaderSection({
    teamName,
    subtitle,
    logoUrl,
    visible,
}: HeaderSectionProps) {
    const [logoError, setLogoError] = useState(false)

    if (!visible) {
        return null
    }

    const showPlaceholder = !logoUrl || logoError

    return (
        <div className="w-full bg-white border-b-2 border-gray-300 py-3 px-4 md:py-4 md:px-6">
            <div className="flex items-center gap-3 md:gap-4">
                {/* Logo or placeholder */}
                <div className="flex-shrink-0">
                    {showPlaceholder ? (
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                        </div>
                    ) : (
                        <img
                            src={logoUrl}
                            alt="Team logo"
                            className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                            onError={() => setLogoError(true)}
                        />
                    )}
                </div>

                {/* Team name and subtitle */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                        {teamName}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 truncate">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    )
}
