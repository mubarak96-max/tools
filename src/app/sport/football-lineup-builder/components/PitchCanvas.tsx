"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { FORMATIONS } from "../data/formations"
import { useLineupStore } from "../store/lineupStore"
import { generateFieldPattern } from "../utils/patternUtils"
import { isWithinPitchBounds } from "../utils/dragUtils"
import PlayerSlot from "./PlayerSlot"
import HeaderSection from "./HeaderSection"

interface PitchCanvasProps {
    forwardedRef?: React.RefObject<HTMLDivElement | null>
}

export default function PitchCanvas({ forwardedRef }: PitchCanvasProps) {
    const formation = useLineupStore((s) => s.formation)
    const players = useLineupStore((s) => s.players)
    const primaryColor = useLineupStore((s) => s.primaryColor)
    const secondaryColor = useLineupStore((s) => s.secondaryColor)
    const teamName = useLineupStore((s) => s.teamName)
    const openModal = useLineupStore((s) => s.openModal)
    const customPositions = useLineupStore((s) => s.customPositions)
    const fieldStyle = useLineupStore((s) => s.fieldStyle)
    const headerConfig = useLineupStore((s) => s.headerConfig)
    const setDraggingPlayer = useLineupStore((s) => s.setDraggingPlayer)
    const updatePlayerPosition = useLineupStore((s) => s.updatePlayerPosition)

    const currentFormation = FORMATIONS[formation]

    // Responsive sizing state
    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    )

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Calculate pitch dimensions based on viewport
    const isMobile = viewportWidth < 768
    const scale = isMobile ? 0.8 : 1.0

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const positionId = e.dataTransfer.getData("positionId")
        if (!positionId) return

        const rect = e.currentTarget.getBoundingClientRect()
        const dropX = e.clientX - rect.left
        const dropY = e.clientY - rect.top

        // Validate drop is within pitch bounds
        if (!isWithinPitchBounds(dropX, dropY, rect.width, rect.height)) {
            setDraggingPlayer(null)
            return
        }

        // Convert to percentage
        const percentX = (dropX / rect.width) * 100
        const percentY = (dropY / rect.height) * 100

        updatePlayerPosition(positionId, percentX, percentY)
        setDraggingPlayer(null)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    // Generate field pattern
    const fieldPattern = generateFieldPattern(fieldStyle)

    return (
        <div className="w-full">
            {/* Header Section */}
            <HeaderSection
                teamName={headerConfig.teamName}
                subtitle={headerConfig.subtitle}
                logoUrl={headerConfig.logoUrl}
                visible={headerConfig.visible}
            />

            {/* Pitch Container */}
            <div
                ref={forwardedRef}
                className="relative w-full aspect-[2/3] bg-[#1a7a3c] rounded-lg overflow-hidden"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {/* SVG Pitch with Field Pattern */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 600"
                    preserveAspectRatio="none"
                >
                    <defs>
                        {fieldPattern && (
                            <pattern
                                id="field-pattern"
                                patternUnits="userSpaceOnUse"
                                width="100"
                                height="100"
                            >
                                {fieldPattern}
                            </pattern>
                        )}
                    </defs>

                    {/* Field background with pattern or solid color */}
                    <rect
                        x="0"
                        y="0"
                        width="400"
                        height="600"
                        fill={fieldPattern ? "url(#field-pattern)" : "#1a7a3c"}
                    />

                    {/* Outer boundary */}
                    <rect
                        x="10"
                        y="10"
                        width="380"
                        height="580"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    />

                    {/* Halfway line */}
                    <line
                        x1="10"
                        y1="300"
                        x2="390"
                        y2="300"
                        stroke="white"
                        strokeWidth="2"
                    />

                    {/* Centre circle */}
                    <circle
                        cx="200"
                        cy="300"
                        r="50"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    />
                    <circle cx="200" cy="300" r="3" fill="white" />

                    {/* Top penalty area */}
                    <rect
                        x="110"
                        y="10"
                        width="180"
                        height="90"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    />

                    {/* Top goal area */}
                    <rect
                        x="160"
                        y="10"
                        width="80"
                        height="35"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    />

                    {/* Bottom penalty area */}
                    <rect
                        x="110"
                        y="500"
                        width="180"
                        height="90"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    />

                    {/* Bottom goal area */}
                    <rect
                        x="160"
                        y="555"
                        width="80"
                        height="35"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    />
                </svg>

                {/* Team name label */}
                {teamName && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                        <h2
                            className="text-white font-bold text-xl px-4 py-2 rounded shadow-lg"
                            style={{
                                backgroundColor: primaryColor,
                                borderColor: secondaryColor,
                                borderWidth: "2px",
                            }}
                        >
                            {teamName}
                        </h2>
                    </div>
                )}

                {/* Player slots */}
                {currentFormation.slots.map((slot) => {
                    const customPos = customPositions[slot.id]
                    const x = customPos?.x ?? slot.x
                    const y = customPos?.y ?? slot.y

                    return (
                        <PlayerSlot
                            key={slot.id}
                            positionId={slot.id}
                            label={slot.label}
                            x={x}
                            y={y}
                            player={players[slot.id] ?? null}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            displayMode="circle"
                            jerseyStyle="plain"
                            jerseyPrimaryColor="#e63946"
                            jerseySecondaryColor="#ffffff"
                            jerseyTextColor="#ffffff"
                            draggable={true}
                            onClick={openModal}
                            onDragStart={setDraggingPlayer}
                            onDragEnd={() => setDraggingPlayer(null)}
                        />
                    )
                })}
            </div>
        </div>
    )
}
