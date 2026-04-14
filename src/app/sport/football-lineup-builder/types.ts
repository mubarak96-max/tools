export type FormationId =
    | "4-3-3"
    | "4-4-2"
    | "4-2-3-1"
    | "3-5-2"
    | "5-3-2"
    | "4-1-4-1"
    | "3-4-3"
    | "5-4-1"
    | "4-4-1-1"
    | "3-4-2-1"
    | "4-5-1"
    | "4-2-2-2"

export interface PositionSlot {
    id: string
    label: string
    fullLabel: string
    x: number
    y: number
}

export interface Formation {
    id: FormationId
    label: string
    slots: PositionSlot[]
}

export interface PlayerData {
    name: string
    jersey: string
}

export interface LineupState {
    formation: FormationId
    players: Record<string, PlayerData>
    teamName: string
    primaryColor: string
    secondaryColor: string
    activePositionId: string | null
}

// Extended player data with cards, goals, images, and substitutes
export interface ExtendedPlayerData extends PlayerData {
    cardType: "none" | "yellow" | "red" | "double-yellow"
    goalCount: number // 0-10
    imageUrl: string | null
    substituteName: string // max 25 chars
}

// Header configuration for team branding
export interface HeaderConfig {
    visible: boolean
    teamName: string // max 30 chars
    subtitle: string // max 50 chars
    logoUrl: string | null
}

// Field style patterns
export type FieldStyle = "none" | "horizontal" | "vertical" | "checkered" | "diagonal" | "rings"

// Display mode for player slots
export type DisplayMode = "circle" | "jersey"

// Jersey style patterns
export type JerseyStyle = "plain" | "vertical-stripes" | "horizontal-stripes"

// Jersey configuration
export interface JerseyConfig {
    displayMode: DisplayMode
    style: JerseyStyle
    primaryColor: string // hex color
    secondaryColor: string // hex color
    textColor: string // hex color
}

// Custom player position with drag-and-drop
export interface PlayerPosition {
    positionId: string
    x: number // 0-100 percentage
    y: number // 0-100 percentage
    isCustom: boolean
}
