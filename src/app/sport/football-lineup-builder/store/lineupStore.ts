import { create } from "zustand"
import type {
    FormationId,
    PlayerData,
    LineupState,
    ExtendedPlayerData,
    HeaderConfig,
    FieldStyle,
    JerseyConfig,
    PlayerPosition,
} from "../types"
import { validateJersey } from "../utils/export"
import { clampPosition } from "../utils/dragUtils"

interface LineupStore extends LineupState {
    // Existing state fields
    players: Record<string, ExtendedPlayerData>

    // New state fields
    headerConfig: HeaderConfig
    fieldStyle: FieldStyle
    jerseyConfig: JerseyConfig
    customPositions: Record<string, PlayerPosition>
    draggingPlayerId: string | null

    // Existing actions
    setFormation: (id: FormationId) => void
    updatePlayer: (positionId: string, data: ExtendedPlayerData) => void
    clearPlayer: (positionId: string) => void
    setTeamName: (name: string) => void
    setPrimaryColor: (color: string) => void
    setSecondaryColor: (color: string) => void
    openModal: (positionId: string) => void
    closeModal: () => void

    // New actions
    setHeaderConfig: (config: Partial<HeaderConfig>) => void
    setFieldStyle: (style: FieldStyle) => void
    setJerseyConfig: (config: Partial<JerseyConfig>) => void
    updatePlayerPosition: (positionId: string, x: number, y: number) => void
    resetCustomPositions: () => void
    setDraggingPlayer: (positionId: string | null) => void
}

export const useLineupStore = create<LineupStore>((set) => ({
    // State
    formation: "4-3-3",
    players: {},
    teamName: "",
    primaryColor: "#e63946",
    secondaryColor: "#ffffff",
    activePositionId: null,

    // New state fields
    headerConfig: {
        visible: false,
        teamName: "",
        subtitle: "",
        logoUrl: null,
    },
    fieldStyle: "none",
    jerseyConfig: {
        displayMode: "circle",
        style: "plain",
        primaryColor: "#e63946",
        secondaryColor: "#ffffff",
        textColor: "#000000",
    },
    customPositions: {},
    draggingPlayerId: null,

    // Actions
    setFormation: (id) =>
        set((state) => {
            if (state.formation === id) return state
            return {
                formation: id,
                activePositionId: null,
            }
        }),

    updatePlayer: (positionId, data) =>
        set((state) => {
            const sanitizedName = data.name.trim().slice(0, 25)
            const sanitizedJersey = validateJersey(data.jersey)
            const sanitizedSubstituteName = data.substituteName.trim().slice(0, 25)
            const clampedGoalCount = Math.max(0, Math.min(10, data.goalCount))

            return {
                players: {
                    ...state.players,
                    [positionId]: {
                        name: sanitizedName,
                        jersey: sanitizedJersey,
                        cardType: data.cardType,
                        goalCount: clampedGoalCount,
                        imageUrl: data.imageUrl,
                        substituteName: sanitizedSubstituteName,
                    },
                },
                activePositionId: null,
            }
        }),

    clearPlayer: (positionId) =>
        set((state) => {
            const { [positionId]: _, ...rest } = state.players
            return { players: rest }
        }),

    setTeamName: (name) =>
        set({
            teamName: name.slice(0, 30),
        }),

    setPrimaryColor: (color) =>
        set({
            primaryColor: color,
        }),

    setSecondaryColor: (color) =>
        set({
            secondaryColor: color,
        }),

    openModal: (positionId) =>
        set({
            activePositionId: positionId,
        }),

    closeModal: () =>
        set({
            activePositionId: null,
        }),

    // New actions
    setHeaderConfig: (config) =>
        set((state) => {
            const updatedConfig = { ...state.headerConfig }

            if (config.visible !== undefined) {
                updatedConfig.visible = config.visible
            }
            if (config.teamName !== undefined) {
                updatedConfig.teamName = config.teamName.slice(0, 30)
            }
            if (config.subtitle !== undefined) {
                updatedConfig.subtitle = config.subtitle.slice(0, 50)
            }
            if (config.logoUrl !== undefined) {
                updatedConfig.logoUrl = config.logoUrl
            }

            return { headerConfig: updatedConfig }
        }),

    setFieldStyle: (style) =>
        set({
            fieldStyle: style,
        }),

    setJerseyConfig: (config) =>
        set((state) => {
            const updatedConfig = { ...state.jerseyConfig }

            if (config.displayMode !== undefined) {
                updatedConfig.displayMode = config.displayMode
            }
            if (config.style !== undefined) {
                updatedConfig.style = config.style
            }
            if (config.primaryColor !== undefined) {
                updatedConfig.primaryColor = config.primaryColor
            }
            if (config.secondaryColor !== undefined) {
                updatedConfig.secondaryColor = config.secondaryColor
            }
            if (config.textColor !== undefined) {
                updatedConfig.textColor = config.textColor
            }

            return { jerseyConfig: updatedConfig }
        }),

    updatePlayerPosition: (positionId, x, y) =>
        set((state) => {
            const clamped = clampPosition(x, y)

            return {
                customPositions: {
                    ...state.customPositions,
                    [positionId]: {
                        positionId,
                        x: clamped.x,
                        y: clamped.y,
                        isCustom: true,
                    },
                },
            }
        }),

    resetCustomPositions: () =>
        set({
            customPositions: {},
        }),

    setDraggingPlayer: (positionId) =>
        set({
            draggingPlayerId: positionId,
        }),
}))
