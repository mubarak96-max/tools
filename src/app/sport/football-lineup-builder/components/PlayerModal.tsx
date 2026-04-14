"use client"

import { useState, useEffect } from "react"
import { X, Upload } from "lucide-react"
import type { ExtendedPlayerData } from "../types"
import { validateImageFile, resizeImage } from "../utils/imageUtils"

interface PlayerModalProps {
    positionId: string
    positionLabel: string
    player: ExtendedPlayerData | null
    onSave: (data: ExtendedPlayerData) => void
    onClear: (positionId: string) => void
    onClose: () => void
}

export default function PlayerModal({
    positionId,
    positionLabel,
    player,
    onSave,
    onClear,
    onClose,
}: PlayerModalProps) {
    const [name, setName] = useState(player?.name || "")
    const [jersey, setJersey] = useState(player?.jersey || "")
    const [jerseyError, setJerseyError] = useState("")
    const [cardType, setCardType] = useState<"none" | "yellow" | "red" | "double-yellow">(
        player?.cardType || "none"
    )
    const [goalCount, setGoalCount] = useState(player?.goalCount?.toString() || "0")
    const [imageUrl, setImageUrl] = useState<string | null>(player?.imageUrl || null)
    const [substituteName, setSubstituteName] = useState(player?.substituteName || "")
    const [imageError, setImageError] = useState("")

    // Validate jersey number
    useEffect(() => {
        if (jersey === "") {
            setJerseyError("")
            return
        }

        const num = parseInt(jersey, 10)
        if (isNaN(num)) {
            setJerseyError("Jersey must be a number")
        } else if (num < 1 || num > 99) {
            setJerseyError("Jersey must be between 1 and 99")
        } else {
            setJerseyError("")
        }
    }, [jersey])

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }

        window.addEventListener("keydown", handleEscape)
        return () => window.removeEventListener("keydown", handleEscape)
    }, [onClose])

    const handleSave = () => {
        // Only save if jersey is valid or empty
        if (jersey !== "" && jerseyError) {
            return
        }

        // Clamp goal count to valid range
        const parsedGoalCount = parseInt(goalCount, 10)
        const clampedGoalCount = isNaN(parsedGoalCount)
            ? 0
            : Math.max(0, Math.min(10, parsedGoalCount))

        onSave({
            name,
            jersey,
            cardType,
            goalCount: clampedGoalCount,
            imageUrl,
            substituteName,
        })
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setImageError("")

        // Validate file
        if (!validateImageFile(file)) {
            setImageError("Invalid image file. Please upload an image under 2MB.")
            return
        }

        // Resize and convert to data URL
        try {
            const dataUrl = await resizeImage(file)
            if (dataUrl) {
                setImageUrl(dataUrl)
            } else {
                setImageError("Failed to process image. Please try another file.")
            }
        } catch (err) {
            setImageError("Failed to upload image. Please try again.")
        }
    }

    const handleGoalCountChange = (value: string) => {
        // Allow empty string or numbers
        if (value === "" || /^\d+$/.test(value)) {
            setGoalCount(value)
        }
    }

    const handleClear = () => {
        onClear(positionId)
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Edit {positionLabel}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* Player Name */}
                    <div>
                        <label
                            htmlFor="player-name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Player Name
                        </label>
                        <input
                            id="player-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value.slice(0, 25))}
                            maxLength={25}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter player name"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {name.length}/25 characters
                        </p>
                    </div>

                    {/* Jersey Number */}
                    <div>
                        <label
                            htmlFor="jersey-number"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Jersey Number
                        </label>
                        <input
                            id="jersey-number"
                            type="text"
                            value={jersey}
                            onChange={(e) => setJersey(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${jerseyError
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                                }`}
                            placeholder="1-99"
                        />
                        {jerseyError && (
                            <p className="text-xs text-red-600 mt-1">{jerseyError}</p>
                        )}
                    </div>

                    {/* Card Type Selector */}
                    <div>
                        <label
                            htmlFor="card-type"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Card Type
                        </label>
                        <select
                            id="card-type"
                            value={cardType}
                            onChange={(e) =>
                                setCardType(
                                    e.target.value as "none" | "yellow" | "red" | "double-yellow"
                                )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="none">None</option>
                            <option value="yellow">Yellow Card</option>
                            <option value="red">Red Card</option>
                            <option value="double-yellow">Double Yellow</option>
                        </select>
                    </div>

                    {/* Goal Count */}
                    <div>
                        <label
                            htmlFor="goal-count"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Goal Count (0-10)
                        </label>
                        <input
                            id="goal-count"
                            type="text"
                            value={goalCount}
                            onChange={(e) => handleGoalCountChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter a number between 0 and 10
                        </p>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Player Image
                        </label>
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="image-upload"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                <Upload size={16} />
                                <span className="text-sm">Upload Image</span>
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            {imageUrl && (
                                <div className="flex items-center gap-2">
                                    <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-300">
                                        <img
                                            src={imageUrl}
                                            alt="Player preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl(null)}
                                        className="text-xs text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                        {imageError && (
                            <p className="text-xs text-red-600 mt-1">{imageError}</p>
                        )}
                        {!imageUrl && !imageError && (
                            <p className="text-xs text-gray-500 mt-1">
                                Max 2MB, will be resized to 200x200px
                            </p>
                        )}
                    </div>

                    {/* Substitute Name */}
                    <div>
                        <label
                            htmlFor="substitute-name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Substitute Name
                        </label>
                        <input
                            id="substitute-name"
                            type="text"
                            value={substituteName}
                            onChange={(e) => setSubstituteName(e.target.value.slice(0, 25))}
                            maxLength={25}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter substitute name"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {substituteName.length}/25 characters
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!!jerseyError && jersey !== ""}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    )
}
