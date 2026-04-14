# Requirements Document

## Introduction

The Football Lineup Builder is a fully client-side interactive tool at `/sport/football-lineup-builder` that lets users compose, customise, and export football (soccer) team lineups. Users select a formation from 12 supported options, assign player names and jersey numbers to position slots on a visual pitch, customise team name and kit colours, and download the result as a PNG image. There is no backend — all state is managed client-side via a Zustand store, and image export is handled in-browser via `html-to-image`.

## Glossary

- **LineupBuilder**: The root client component (`FootballLineupBuilder`) that orchestrates the entire tool
- **PitchCanvas**: The SVG-based component that renders the football pitch and all player slots
- **PlayerSlot**: A single interactive position marker on the pitch
- **PlayerModal**: The modal dialog used to enter or edit a player's name and jersey number
- **FormationSelector**: The UI control for choosing a formation
- **TeamCustomizer**: The UI control for setting team name and kit colours
- **ExportButton**: The UI control that triggers PNG export of the pitch
- **Store**: The Zustand store (`lineupStore`) that is the single source of truth for all lineup state
- **Formation**: A named tactical arrangement of 11 players with defined position coordinates
- **FormationId**: A string identifier for a formation (e.g. `"4-3-3"`)
- **PositionSlot**: A single position within a formation, with a unique id, label, and (x, y) coordinates
- **PlayerData**: The name and jersey number associated with a position slot
- **ExportUtil**: The `export.ts` utility that wraps `html-to-image` to produce a PNG download

---

## Requirements

### Requirement 1: Formation Selection

**User Story:** As a user, I want to select from a set of standard football formations, so that I can build a lineup that matches my tactical approach.

#### Acceptance Criteria

1. THE FormationSelector SHALL provide exactly 12 selectable formations: 4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 5-3-2, 4-1-4-1, 3-4-3, 5-4-1, 4-4-1-1, 3-4-2-1, 4-5-1, and 4-2-2-2
2. WHEN a formation is selected, THE PitchCanvas SHALL render exactly 11 player slots on the pitch
3. WHEN a formation is selected, THE PitchCanvas SHALL render exactly one slot with the label "GK"
4. WHEN a formation is selected, THE Store SHALL assign a unique id to every position slot within that formation
5. WHEN a formation is selected, THE Store SHALL position all slots within coordinate bounds where x ∈ [5, 95] and y ∈ [5, 95]

---

### Requirement 2: Player Data Entry

**User Story:** As a user, I want to assign a name and jersey number to each position on the pitch, so that I can represent my chosen players in the lineup.

#### Acceptance Criteria

1. WHEN a user clicks a player slot, THE LineupBuilder SHALL open the PlayerModal for that position
2. WHEN the PlayerModal is open, THE PlayerModal SHALL accept a player name of at most 25 characters
3. WHEN the PlayerModal is open, THE PlayerModal SHALL accept a jersey number that is either empty or an integer in the range [1, 99]
4. WHEN a user saves player data in the PlayerModal, THE Store SHALL store the player name and jersey number keyed by that position's id
5. WHEN a user clears a player slot, THE Store SHALL remove the player data for that position without modifying any other slot's data
6. WHEN the PlayerModal is open, THE PlayerModal SHALL close when the user clicks the backdrop or presses the Escape key

---

### Requirement 3: Formation Change Behaviour

**User Story:** As a user, I want to switch formations during lineup building, so that I can explore different tactical setups.

#### Acceptance Criteria

1. WHEN a user selects a different formation, THE Store SHALL clear all player data, resulting in an empty players record
2. WHEN a user attempts to change the formation, THE FormationSelector SHALL display a warning that all player data will be cleared before the change takes effect

---

### Requirement 4: Team Customisation

**User Story:** As a user, I want to set my team name and kit colours, so that the exported lineup image represents my team's identity.

#### Acceptance Criteria

1. WHEN a user enters a team name, THE Store SHALL store a team name of at most 30 characters
2. WHEN a user selects a primary colour, THE PitchCanvas SHALL render all player slot circles filled with that colour
3. WHEN a user selects a secondary colour, THE PitchCanvas SHALL render all player slot circle borders in that colour
4. THE TeamCustomizer SHALL provide preset colour swatches for common kit colours in addition to a free colour picker

---

### Requirement 5: PNG Export

**User Story:** As a user, I want to download my completed lineup as a PNG image, so that I can share it with others.

#### Acceptance Criteria

1. WHEN the user clicks the export button, THE ExportButton SHALL capture the pitch DOM node as a PNG at 2× pixel ratio and trigger a browser file download
2. WHEN exporting, THE ExportUtil SHALL derive the download filename from the team name, sanitised for use in a filename, appended with `"-lineup.png"`
3. IF the pitch DOM node is not mounted when export is triggered, THEN THE ExportButton SHALL display an error message to the user
4. IF the html-to-image library fails during export, THEN THE ExportButton SHALL display an error message to the user

---

### Requirement 6: Responsive Layout

**User Story:** As a user, I want to use the lineup builder on both desktop and mobile devices, so that I can build lineups wherever I am.

#### Acceptance Criteria

1. WHILE the viewport is at desktop width, THE LineupBuilder SHALL render a two-column layout with the pitch on the left and controls on the right
2. WHILE the viewport is at mobile width, THE LineupBuilder SHALL render a single-column stacked layout with the pitch above the controls

---

### Requirement 7: Input Validation

**User Story:** As a user, I want invalid inputs to be handled gracefully, so that the lineup data remains consistent and the tool does not break.

#### Acceptance Criteria

1. WHEN a jersey number input is non-numeric or out of range, THE PlayerModal SHALL sanitise the value by clamping it to [1, 99] or clearing it, and SHALL display an inline validation message
2. THE Store SHALL ensure that for any stored PlayerData, the jersey value is either an empty string or a string representation of an integer in [1, 99]
3. THE ExportUtil validateJersey function SHALL be idempotent: applying it twice to any input SHALL produce the same result as applying it once
4. WHEN slot screen coordinates are computed, THE PitchCanvas SHALL produce a screenX equal to (slot.x / 100) × pitchWidth and a screenY equal to (slot.y / 100) × pitchHeight for any valid slot and positive pitch dimensions
