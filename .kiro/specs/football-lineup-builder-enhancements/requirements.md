# Requirements Document

## Introduction

This document specifies the requirements for enhancements to the Football Lineup Builder application. The enhancements add mobile layout optimization, drag-and-drop player positioning, toggle-able header options, field style customization, player card enhancements (cards/goals/images), jersey representation mode, and substitution display. All features maintain the existing client-side architecture using Zustand for state management.

## Glossary

- **System**: The Football Lineup Builder application
- **Pitch**: The visual representation of the football field
- **Player_Slot**: A position on the pitch where a player can be placed
- **Formation**: The tactical arrangement of players (5v5 through 11v11)
- **Header**: Optional section above the pitch displaying team information
- **Field_Style**: Visual pattern applied to the pitch background
- **Jersey_Mode**: Display mode showing players as jersey icons instead of circles
- **Custom_Position**: User-defined player position overriding formation defaults
- **Extended_Player_Data**: Player information including cards, goals, images, and substitutes
- **Store**: Zustand state management store for lineup data

## Requirements

### Requirement 1: Mobile Layout Optimization

**User Story:** As a mobile user, I want a compact pitch view with bottom tab navigation, so that I can efficiently use the lineup builder on my phone.

#### Acceptance Criteria

1. WHEN the viewport width is less than 768px, THE System SHALL render the pitch at approximately 60% of screen height
2. WHEN on mobile, THE System SHALL display bottom tab navigation with tabs for Formation, Players, Field, Background, and Header
3. WHEN the viewport width is 768px or greater, THE System SHALL render the pitch at full desktop dimensions
4. THE System SHALL maintain a 2:3 aspect ratio (width:height) for the pitch across all viewport sizes
5. WHEN on mobile, THE System SHALL scale player slots and UI elements by 0.8x for compact display

### Requirement 2: Lineup Type Selection

**User Story:** As a user, I want to select different lineup types from 5v5 to 11v11, so that I can create lineups for various game formats.

#### Acceptance Criteria

1. THE System SHALL provide a lineup type selector with options for 5v5, 6v6, 7v7, 8v8, 9v9, 10v10, and 11v11
2. WHEN a user selects a lineup type, THE System SHALL update the available formations for that type
3. WHEN a lineup type changes, THE System SHALL preserve player data for positions that exist in both the old and new formations

### Requirement 3: Formation Selection with Visual Grid

**User Story:** As a user, I want to select formations using a visual grid selector, so that I can quickly understand and choose tactical arrangements.

#### Acceptance Criteria

1. THE System SHALL display formation options as visual grid representations
2. WHEN a user selects a formation, THE System SHALL update the pitch to show the new player positions
3. WHEN a formation changes, THE System SHALL reset custom positions for slots that no longer exist
4. WHEN a formation changes, THE System SHALL preserve custom positions for slots that exist in both formations

### Requirement 4: Undo and Redo Functionality

**User Story:** As a user, I want undo and redo buttons, so that I can easily revert or reapply changes to my lineup.

#### Acceptance Criteria

1. THE System SHALL provide an undo button that reverts the most recent state change
2. THE System SHALL provide a redo button that reapplies a previously undone change
3. WHEN no undo history exists, THE System SHALL disable the undo button
4. WHEN no redo history exists, THE System SHALL disable the redo button
5. WHEN a new change is made after undo, THE System SHALL clear the redo history

### Requirement 5: Drag-and-Drop Player Positioning

**User Story:** As a user, I want to drag player slots to custom positions on the pitch, so that I can create tactical variations beyond standard formations.

#### Acceptance Criteria

1. WHEN a user drags a Player_Slot and drops it on the Pitch, THE System SHALL update that player's position to the drop coordinates
2. WHEN calculating custom positions, THE System SHALL convert screen coordinates to percentage values relative to pitch dimensions
3. WHEN a custom position is set, THE System SHALL clamp x coordinates to the range [5, 95] percent
4. WHEN a custom position is set, THE System SHALL clamp y coordinates to the range [5, 95] percent
5. WHEN a user drops a player outside the pitch bounds, THE System SHALL revert the player to their previous position
6. THE System SHALL store custom positions with an isCustom flag set to true
7. WHEN a user calls reset positions, THE System SHALL clear all custom positions and return players to formation defaults

### Requirement 6: Header Configuration

**User Story:** As a user, I want to add a toggle-able header with team name, subtitle, and logo, so that I can brand my lineup exports.

#### Acceptance Criteria

1. THE System SHALL provide a toggle to show or hide the header section
2. WHEN the header is visible, THE System SHALL display it above the pitch
3. WHEN the header is hidden, THE System SHALL not render the header section
4. THE System SHALL accept a team name input with a maximum length of 30 characters
5. THE System SHALL accept a subtitle input with a maximum length of 50 characters
6. THE System SHALL accept a logo image upload with a maximum file size of 2MB
7. WHEN a logo image is uploaded, THE System SHALL resize it to a maximum of 200x200 pixels
8. WHEN a logo image fails to load, THE System SHALL display a placeholder icon

### Requirement 7: Field Style Customization

**User Story:** As a user, I want to apply different visual patterns to the pitch, so that I can customize the appearance of my lineup.

#### Acceptance Criteria

1. THE System SHALL provide six field style options: none, horizontal stripes, vertical stripes, checkered, diagonal stripes, and rings
2. WHEN a user selects a field style, THE System SHALL apply the corresponding SVG pattern to the pitch background
3. WHEN the field style is "none", THE System SHALL display a solid green pitch
4. WHEN the field style is "horizontal", THE System SHALL display horizontal stripes with 10% stripe height
5. WHEN the field style is "vertical", THE System SHALL display vertical stripes with 10% stripe width
6. WHEN the field style is "checkered", THE System SHALL display a checkered pattern with 10x10% squares
7. WHEN the field style is "diagonal", THE System SHALL display diagonal stripes at 45-degree angles
8. WHEN the field style is "rings", THE System SHALL display concentric circles with 15% spacing

### Requirement 8: Player Card Display

**User Story:** As a user, I want to assign yellow cards, red cards, or double-yellow cards to players, so that I can track disciplinary information.

#### Acceptance Criteria

1. THE System SHALL provide a card type selector with options: none, yellow, red, and double-yellow
2. WHEN a player has a yellow card, THE System SHALL display a yellow card icon above the player slot
3. WHEN a player has a red card, THE System SHALL display a red card icon above the player slot
4. WHEN a player has a double-yellow card, THE System SHALL display two yellow card icons above the player slot
5. WHEN a player has no card, THE System SHALL not display any card icons

### Requirement 9: Player Goal Count Display

**User Story:** As a user, I want to assign goal counts to players, so that I can track scoring information in my lineup.

#### Acceptance Criteria

1. THE System SHALL provide a goal count input accepting values from 0 to 10
2. WHEN a player has a goal count greater than 0, THE System SHALL display that many ball icons below the player slot
3. WHEN a user enters a goal count less than 0, THE System SHALL clamp the value to 0
4. WHEN a user enters a goal count greater than 10, THE System SHALL clamp the value to 10
5. WHEN a player has a goal count of 0, THE System SHALL not display any ball icons

### Requirement 10: Player Image Upload

**User Story:** As a user, I want to upload custom images for players, so that I can personalize the lineup with player photos.

#### Acceptance Criteria

1. THE System SHALL provide an image upload button in the player modal
2. THE System SHALL accept image files with a maximum size of 2MB
3. WHEN a user uploads a non-image file, THE System SHALL reject the upload and display an error message
4. WHEN a user uploads an image larger than 2MB, THE System SHALL reject the upload and display an error message
5. WHEN an image is uploaded, THE System SHALL resize it to a maximum of 200x200 pixels
6. WHEN a player has an uploaded image in circle display mode, THE System SHALL display the image instead of the jersey number
7. WHEN a player has an uploaded image, THE System SHALL store it as a data URL

### Requirement 11: Jersey Display Mode

**User Story:** As a user, I want to toggle between circle and jersey display modes, so that I can choose my preferred visual style.

#### Acceptance Criteria

1. THE System SHALL provide a toggle to switch between circle and jersey display modes
2. WHEN jersey mode is enabled, THE System SHALL render all player slots as jersey icons
3. WHEN circle mode is enabled, THE System SHALL render all player slots as circles
4. WHEN in jersey mode, THE System SHALL display the position label or custom jersey number on the jersey

### Requirement 12: Jersey Style Customization

**User Story:** As a user, I want to customize jersey styles and colors, so that I can match my team's actual kit.

#### Acceptance Criteria

1. THE System SHALL provide three jersey style options: plain with colored shoulders, vertical stripes, and horizontal stripes
2. THE System SHALL provide a primary color picker for the jersey body
3. THE System SHALL provide a secondary color picker for jersey accents (shoulders or stripes)
4. THE System SHALL provide a text color picker for jersey numbers/labels
5. WHEN the jersey style is "plain", THE System SHALL render a solid body with colored shoulders
6. WHEN the jersey style is "vertical-stripes", THE System SHALL render 5 vertical stripes alternating primary and secondary colors
7. WHEN the jersey style is "horizontal-stripes", THE System SHALL render 3 horizontal stripes alternating primary and secondary colors
8. THE System SHALL validate that all color inputs are valid hex color codes

### Requirement 13: Substitution Display

**User Story:** As a user, I want to add substitute names to players, so that I can show replacement options in my lineup.

#### Acceptance Criteria

1. THE System SHALL provide a substitute name input field in the player modal
2. THE System SHALL accept substitute names with a maximum length of 25 characters
3. WHEN a player has a substitute name, THE System SHALL display it below the main player name
4. WHEN a player has no substitute name, THE System SHALL not display any substitute text

### Requirement 14: Extended Player Data Validation

**User Story:** As a developer, I want all player data to be validated, so that the system maintains data integrity.

#### Acceptance Criteria

1. THE System SHALL enforce that player names have a maximum length of 25 characters
2. THE System SHALL enforce that jersey numbers are either empty or integers in the range [1, 99]
3. THE System SHALL enforce that card types are one of: none, yellow, red, or double-yellow
4. THE System SHALL enforce that goal counts are integers in the range [0, 10]
5. THE System SHALL enforce that substitute names have a maximum length of 25 characters
6. WHEN invalid data is provided, THE System SHALL sanitize it to meet validation rules before storing

### Requirement 15: Export Functionality Preservation

**User Story:** As a user, I want to export my enhanced lineup as an image, so that I can share it with others.

#### Acceptance Criteria

1. THE System SHALL maintain the existing export functionality using html-to-image
2. WHEN exporting with header enabled, THE System SHALL include the header in the exported image
3. WHEN exporting with custom field styles, THE System SHALL include the field pattern in the exported image
4. WHEN exporting with player images, THE System SHALL include all player images in the exported image
5. WHEN exporting in jersey mode, THE System SHALL render players as jerseys in the exported image
6. WHEN an image fails to render during export, THE System SHALL proceed with a placeholder and display a warning

### Requirement 16: State Persistence

**User Story:** As a user, I want my lineup configuration to be saved, so that I can return to it later.

#### Acceptance Criteria

1. THE System SHALL persist all extended player data to the Zustand store
2. THE System SHALL persist header configuration to the Zustand store
3. THE System SHALL persist field style selection to the Zustand store
4. THE System SHALL persist jersey configuration to the Zustand store
5. THE System SHALL persist custom player positions to the Zustand store
6. WHEN the store is updated, THE System SHALL trigger re-renders of affected components

### Requirement 17: Drag State Management

**User Story:** As a developer, I want consistent drag state management, so that the UI remains predictable during drag operations.

#### Acceptance Criteria

1. WHEN a user starts dragging a player, THE System SHALL set draggingPlayerId to that player's position ID
2. WHEN a user completes a drag operation, THE System SHALL set draggingPlayerId to null
3. WHEN draggingPlayerId is not null, THE System SHALL apply visual feedback to exactly one player slot
4. WHEN a user cancels a drag operation, THE System SHALL set draggingPlayerId to null

### Requirement 18: Performance Optimization

**User Story:** As a user, I want smooth drag-and-drop interactions, so that the lineup builder feels responsive.

#### Acceptance Criteria

1. WHEN dragging a player, THE System SHALL use CSS transforms for visual updates
2. WHEN dragging a player, THE System SHALL only update the store on drop completion
3. WHEN rendering field patterns, THE System SHALL use SVG patterns for GPU acceleration
4. WHEN rendering jerseys, THE System SHALL cache jersey SVG components to avoid unnecessary re-renders
5. WHEN exporting, THE System SHALL ensure all images are loaded before calling html-to-image
