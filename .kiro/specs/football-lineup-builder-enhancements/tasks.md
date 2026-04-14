# Implementation Plan: Football Lineup Builder Enhancements

## Overview

This implementation plan enhances the existing Football Lineup Builder with seven major feature areas: mobile layout optimization, drag-and-drop player positioning, toggle-able header section, field style customization, player card enhancements (cards/goals/images), jersey representation mode, and substitution display. The implementation follows an incremental approach, building on existing components and adding new functionality step by step.

## Tasks

- [x] 1. Extend type definitions with new data models
  - Add ExtendedPlayerData interface with cardType, goalCount, imageUrl, substituteName fields
  - Add HeaderConfig interface with visible, teamName, subtitle, logoUrl fields
  - Add FieldStyle type with six pattern options
  - Add JerseyConfig interface with displayMode, style, and color fields
  - Add PlayerPosition interface for custom drag-and-drop positions
  - Add DisplayMode and JerseyStyle types
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 6.4, 6.5, 7.1, 12.1, 12.2, 12.3, 12.4, 5.6_

- [x] 2. Create utility functions for new features
  - [x] 2.1 Create dragUtils.ts with position calculation functions
    - Implement calculatePercentagePosition to convert screen coordinates to percentage
    - Implement clampPosition to enforce [5, 95] bounds
    - Implement isWithinPitchBounds to validate drop coordinates
    - _Requirements: 5.2, 5.3, 5.4, 5.5_
  
  - [x] 2.2 Create patternUtils.ts with SVG pattern generation
    - Implement generateFieldPattern function for all six field styles
    - Generate horizontal stripe pattern (10% stripe height)
    - Generate vertical stripe pattern (10% stripe width)
    - Generate checkered pattern (10x10% squares)
    - Generate diagonal stripe pattern (45-degree angle)
    - Generate rings pattern (15% spacing)
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_
  
  - [x] 2.3 Create imageUtils.ts with image upload and validation
    - Implement validateImageFile to check file type and size (max 2MB)
    - Implement resizeImage to resize images to max 200×200px
    - Implement readFileAsDataURL to convert File to data URL
    - _Requirements: 6.6, 6.7, 10.2, 10.3, 10.4, 10.5, 10.7_

- [x] 3. Enhance lineupStore with new state and actions
  - Add headerConfig state field with default values
  - Add fieldStyle state field (default "none")
  - Add jerseyConfig state field with default values
  - Add customPositions state field (empty object)
  - Add draggingPlayerId state field (null)
  - Implement setHeaderConfig action with validation
  - Implement setFieldStyle action
  - Implement setJerseyConfig action with hex color validation
  - Implement updatePlayerPosition action with clamping
  - Implement resetCustomPositions action
  - Implement setDraggingPlayer action
  - Implement updateExtendedPlayer action replacing updatePlayer
  - Update existing updatePlayer to handle ExtendedPlayerData
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 5.1, 5.7, 17.1, 17.2, 17.4, 14.6_

- [x] 4. Checkpoint - Verify store and utilities
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create HeaderSection component
  - Create HeaderSection.tsx with HeaderSectionProps interface
  - Render team name with 30-character limit
  - Render subtitle with 50-character limit
  - Render logo image with error handling and placeholder
  - Return null when visible is false
  - Implement responsive sizing for mobile vs desktop
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.8_

- [x] 6. Create FieldStyleSelector component
  - Create FieldStyleSelector.tsx with FieldStyleSelectorProps interface
  - Display visual previews for all six field styles
  - Highlight currently selected style
  - Call onChange when user selects a style
  - Use grid layout for style options
  - _Requirements: 7.1_

- [x] 7. Create JerseyCustomizer component
  - Create JerseyCustomizer.tsx with JerseyCustomizerProps interface
  - Add toggle for circle vs jersey display mode
  - Add jersey style selector (plain, vertical-stripes, horizontal-stripes)
  - Add color picker for jersey primary color
  - Add color picker for jersey secondary color
  - Add color picker for jersey text color
  - Display visual preview of jersey with current settings
  - _Requirements: 11.1, 12.1, 12.2, 12.3, 12.4, 12.8_

- [x] 8. Enhance PlayerSlot component with extended features
  - [x] 8.1 Add drag-and-drop functionality
    - Add draggable attribute and drag event handlers
    - Implement onDragStart to set draggingPlayerId
    - Implement onDragEnd to clear dragging state
    - Add visual feedback when dragging
    - Use custom position coordinates if available
    - _Requirements: 5.1, 17.1, 17.2, 17.3, 17.4, 18.1_
  
  - [x] 8.2 Add card display functionality
    - Render yellow card icon when cardType is "yellow"
    - Render red card icon when cardType is "red"
    - Render two yellow card icons when cardType is "double-yellow"
    - Position card icons above player slot
    - Use lucide-react icons
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 8.3 Add goal count display
    - Render ball icons below player slot based on goalCount
    - Display exactly goalCount number of ball icons (0-10)
    - Use lucide-react icons
    - _Requirements: 9.1, 9.2, 9.5_
  
  - [x] 8.4 Add player image display
    - Display player image instead of jersey number when imageUrl is provided
    - Handle image loading and error states
    - Apply circular clipping in circle mode
    - _Requirements: 10.6, 10.7_
  
  - [x] 8.5 Add substitute name display
    - Render substitute name below main player name when provided
    - Apply 25-character limit
    - Style differently from main name
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [x] 8.6 Add jersey rendering mode
    - Implement jersey SVG rendering based on jerseyConfig
    - Render plain jersey with colored shoulders
    - Render vertical-stripes jersey (5 stripes)
    - Render horizontal-stripes jersey (3 stripes)
    - Display position label or jersey number on jersey
    - Apply jersey colors from jerseyConfig
    - Toggle between circle and jersey based on displayMode
    - _Requirements: 11.2, 11.3, 11.4, 12.5, 12.6, 12.7_

- [x] 9. Checkpoint - Verify PlayerSlot enhancements
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Enhance PlayerModal component with extended fields
  - Add card type selector dropdown (none, yellow, red, double-yellow)
  - Add goal count input with number validation (0-10)
  - Add goal count clamping for invalid inputs
  - Add image upload button with file input
  - Add image preview display
  - Add substitute name input with 25-character limit
  - Update validation to handle all ExtendedPlayerData fields
  - Update onSave to pass ExtendedPlayerData
  - Integrate imageUtils for upload handling
  - _Requirements: 8.1, 9.1, 9.3, 9.4, 10.1, 10.2, 10.3, 10.4, 10.5, 13.1, 13.2, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [-] 11. Enhance PitchCanvas component with new features
  - [x] 11.1 Add field pattern rendering
    - Import patternUtils and generate SVG patterns
    - Add SVG defs section with pattern definitions
    - Apply selected field pattern to pitch background
    - Maintain solid green background when style is "none"
    - _Requirements: 7.2, 7.3, 18.3_
  
  - [x] 11.2 Add drag-and-drop handling
    - Implement onDragOver to allow drops
    - Implement onDrop to handle player drops
    - Calculate drop coordinates relative to pitch dimensions
    - Call updatePlayerPosition with percentage coordinates
    - Validate drop is within pitch bounds
    - _Requirements: 5.1, 5.2, 5.5, 18.2_
  
  - [x] 11.3 Add responsive sizing
    - Implement calculatePitchDimensions based on viewport width
    - Apply compact layout for mobile (<768px)
    - Apply full layout for desktop (≥768px)
    - Maintain 2:3 aspect ratio across all viewports
    - Scale player slots by 0.8x on mobile
    - _Requirements: 1.1, 1.3, 1.4, 1.5_
  
  - [x] 11.4 Integrate HeaderSection component
    - Render HeaderSection above pitch when visible
    - Pass headerConfig props from store
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 12. Update FootballLineupBuilder main component
  - [x] 12.1 Add mobile bottom tab navigation
    - Create tab navigation for mobile viewports (<768px)
    - Add tabs: Formation, Players, Field, Background, Header
    - Show/hide tab content based on active tab
    - Use desktop sidebar layout for ≥768px viewports
    - _Requirements: 1.2_
  
  - [x] 12.2 Integrate new UI components
    - Add FieldStyleSelector to Field tab
    - Add JerseyCustomizer to Players tab
    - Add HeaderSection controls to Header tab
    - Wire up all onChange handlers to store actions
    - _Requirements: 7.1, 11.1, 12.1, 6.1_
  
  - [x] 12.3 Add reset positions button
    - Add button to reset all custom player positions
    - Call resetCustomPositions action on click
    - _Requirements: 5.7_
  
  - [x] 12.4 Update export functionality
    - Ensure header is included in export when visible
    - Ensure field patterns are included in export
    - Ensure player images are loaded before export
    - Ensure jersey rendering is included in export
    - Add image loading wait logic
    - Handle export errors gracefully
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 18.5_

- [x] 13. Final checkpoint - Integration and testing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks build incrementally on existing components
- Each task references specific requirements for traceability
- Checkpoints ensure validation at key milestones
- No new dependencies required (all existing: zustand, html-to-image, lucide-react, tailwindcss)
- Mobile-first responsive design throughout
- All user inputs are validated and sanitized
- Drag-and-drop uses native HTML5 APIs for performance
