# Implementation Plan: Football Lineup Builder

## Overview

Fully client-side Next.js tool at `/sport/football-lineup-builder`. Implements a Zustand store, static formation data, SVG pitch canvas, player slot editing, team customisation, and PNG export via `html-to-image`. No backend required.

## Tasks

- [x] 1. Scaffold directory structure, types, and formation data
  - Create `src/app/sport/football-lineup-builder/` with `page.tsx`, `components/`, `store/`, `data/`, and `utils/` subdirectories
  - Define all shared TypeScript types (`FormationId`, `PositionSlot`, `Formation`, `PlayerData`, `LineupState`) in `src/app/sport/football-lineup-builder/types.ts`
  - Implement `src/app/sport/football-lineup-builder/data/formations.ts` with all 12 formations (`FORMATIONS` record and `FORMATION_IDS` array), each with exactly 11 slots, one GK, unique ids, and coordinates in [5, 95]
  - Add `fast-check` as a devDependency (`npm install --save-dev fast-check`)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 1.1 Write property tests for formation data integrity
    - **Property 1: Formation always has exactly 11 slots** — for every `FormationId`, `FORMATIONS[f].slots.length === 11`
    - **Validates: Requirement 1.2**
    - **Property 2: Every formation has exactly one goalkeeper** — exactly one slot per formation has `label === "GK"`
    - **Validates: Requirement 1.3**
    - **Property 3: All slot ids are unique within a formation** — no duplicate `id` values within any formation's slots
    - **Validates: Requirement 1.4**
    - **Property 4: Slot coordinates are within valid bounds** — every slot's `x` and `y` are in `[5, 95]`
    - **Validates: Requirement 1.5**

- [x] 2. Implement `validateJersey` utility and `export.ts`
  - Create `src/app/sport/football-lineup-builder/utils/export.ts`
  - Implement `validateJersey(input: string): string` — returns `""` for empty/non-numeric input, otherwise clamps to `[1, 99]` and returns as string
  - Implement `sanitizeFilename(teamName: string): string` — strips characters unsafe for filenames, falls back to `"lineup"` for empty result
  - Implement `exportLineupAsPng(ref, teamName)` — calls `html-to-image` at `pixelRatio: 2`, derives filename via `sanitizeFilename(teamName) + "-lineup.png"`, triggers anchor download; throws descriptive `Error` if `ref.current` is null or library fails
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 7.1, 7.3_

  - [ ]* 2.1 Write property test for `validateJersey` idempotency
    - **Property 8: validateJersey is idempotent** — `validateJersey(validateJersey(x)) === validateJersey(x)` for any string `x`
    - **Validates: Requirement 7.3**

  - [ ]* 2.2 Write property test for export filename derivation
    - **Property 10: Export filename is derived from team name** — for any non-empty `teamName`, the filename contains a sanitised version of `teamName` and ends with `"-lineup.png"`
    - **Validates: Requirement 5.2**

- [x] 3. Implement `lineupStore`
  - Create `src/app/sport/football-lineup-builder/store/lineupStore.ts` as a Zustand store
  - Implement all state fields: `formation`, `players`, `teamName`, `primaryColor`, `secondaryColor`, `activePositionId`
  - Implement `setFormation` — sets formation, clears `players` to `{}`, sets `activePositionId` to `null`; no-op if same formation
  - Implement `updatePlayer` — sanitises name (trim, max 25 chars) and jersey via `validateJersey`, stores result, sets `activePositionId` to `null`
  - Implement `clearPlayer` — removes only the keyed entry from `players`, leaves all other state unchanged
  - Implement `setTeamName` — stores name clamped to 30 characters
  - Implement `setPrimaryColor`, `setSecondaryColor`, `openModal`, `closeModal`
  - _Requirements: 1.4, 2.4, 2.5, 3.1, 4.1, 7.2_

  - [ ]* 3.1 Write property test for formation change resetting player data
    - **Property 5: Formation change resets all player data** — for any store state with non-empty `players`, calling `setFormation(id)` results in `store.players === {}`
    - **Validates: Requirement 3.1**

  - [ ]* 3.2 Write property test for player name length bound
    - **Property 6: Player name length is bounded** — after any `updatePlayer` call, `store.players[positionId].name.length <= 25`
    - **Validates: Requirement 2.2**

  - [ ]* 3.3 Write property test for jersey validity invariant
    - **Property 7: Jersey number is always valid or empty** — for any `PlayerData` in `store.players`, `jersey === ""` or `Number(jersey)` is an integer in `[1, 99]`
    - **Validates: Requirements 2.3, 7.2**

  - [ ]* 3.4 Write property test for player update round-trip
    - **Property 11: Player update round-trip** — calling `updatePlayer(positionId, d)` stores the sanitised equivalent of `d` at `store.players[positionId]`
    - **Validates: Requirement 2.4**

  - [ ]* 3.5 Write property test for clear player isolation
    - **Property 12: Clear player does not affect other slots** — calling `clearPlayer(positionId)` removes only that entry and leaves all other entries unchanged
    - **Validates: Requirement 2.5**

  - [ ]* 3.6 Write property test for team name length bound
    - **Property 13: Team name length is bounded** — after any `setTeamName` call, `store.teamName.length <= 30`
    - **Validates: Requirement 4.1**

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement `PlayerSlot` and `PlayerModal` components
  - Create `src/app/sport/football-lineup-builder/components/PlayerSlot.tsx`
    - Renders a circle (primary colour fill, secondary colour border) with jersey number inside and player name below
    - Positions itself absolutely using `left: {x}%` / `top: {y}%` CSS
    - Calls `onClick(positionId)` on click/tap
  - Create `src/app/sport/football-lineup-builder/components/PlayerModal.tsx`
    - Controlled inputs for player name (max 25 chars) and jersey number (1–99)
    - Inline validation message when jersey is out of range or non-numeric
    - Save button calls `onSave`, Clear button calls `onClear(positionId)`, closes on backdrop click or Escape key
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 7.1_

- [x] 6. Implement `PitchCanvas` component
  - Create `src/app/sport/football-lineup-builder/components/PitchCanvas.tsx`
  - Render a fixed-aspect-ratio (`2/3`) container with SVG pitch markings (centre circle, penalty areas, halfway line)
  - Read `formation`, `players`, `primaryColor`, `secondaryColor`, `teamName` from `lineupStore`
  - Map each `PositionSlot` to absolute screen position using `screenX = (slot.x / 100) * pitchWidth` and `screenY = (slot.y / 100) * pitchHeight`
  - Render team name label at the top of the pitch
  - Render a `PlayerSlot` for each slot, passing player data and `openModal` as click handler
  - Accept `forwardedRef` prop and attach it to the outer container div for export capture
  - _Requirements: 1.2, 1.3, 2.1, 4.2, 4.3, 7.4_

  - [ ]* 6.1 Write property test for screen position proportionality
    - **Property 9: Screen position is proportional to pitch dimensions** — `getSlotScreenPosition(s, w, h).screenX === (s.x / 100) * w` and `.screenY === (s.y / 100) * h` for any valid slot and positive dimensions
    - **Validates: Requirement 7.4**

- [x] 7. Implement `FormationSelector`, `TeamCustomizer`, and `ExportButton` components
  - Create `src/app/sport/football-lineup-builder/components/FormationSelector.tsx`
    - Renders a `<select>` listing all 12 `FORMATION_IDS`
    - Shows an inline warning "Changing formation will clear all player data" before calling `onChange`
    - _Requirements: 1.1, 3.1, 3.2_
  - Create `src/app/sport/football-lineup-builder/components/TeamCustomizer.tsx`
    - Text input for team name (max 30 chars)
    - `<input type="color">` pickers for primary and secondary colours
    - Preset colour swatches for common kit colours (at least 6 swatches)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - Create `src/app/sport/football-lineup-builder/components/ExportButton.tsx`
    - Calls `exportLineupAsPng(pitchRef, teamName)` on click
    - Shows loading state (spinner/disabled) during export
    - Displays inline error message on failure
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 8. Implement `FootballLineupBuilder` root component and `page.tsx`
  - Create `src/app/sport/football-lineup-builder/components/FootballLineupBuilder.tsx`
    - `"use client"` directive
    - Owns `pitchRef` (`useRef<HTMLDivElement>`) and passes it to `PitchCanvas` and `ExportButton`
    - Reads `activePositionId` from store; renders `PlayerModal` when non-null
    - Two-column layout on desktop (`md:grid-cols-2`), single-column stacked on mobile
    - Pitch on left, controls (`FormationSelector`, `TeamCustomizer`, `ExportButton`) on right
    - _Requirements: 2.1, 6.1, 6.2_
  - Create `src/app/sport/football-lineup-builder/page.tsx` as a server component
    - Exports `metadata` with appropriate `title` and `description`
    - Renders `<FootballLineupBuilder />` as the sole child
    - _Requirements: 6.1, 6.2_

- [x] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests use `fast-check` and validate universal correctness properties defined in the design
- Unit tests validate specific examples and edge cases
- The pitch uses CSS absolute positioning (not canvas/WebGL) for accessibility and simplicity
