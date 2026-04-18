# Bugfix Requirements Document

## Introduction

The Free Social Media Carousel Builder is a production tool for creating social media carousels with AI drafting, template editing, asset search, and multi-format export capabilities. This bugfix addresses five critical issues that cause poor user experience, potential data loss, and application instability:

1. **Missing Escape Key Handler for Drag Operations** - Users cannot cancel drag operations once started
2. **Asset Search Race Conditions** - Concurrent searches display wrong results and cause loading state bugs
3. **Export Functions Missing Error Boundaries** - Export failures crash the app without user feedback
4. **LocalStorage Quota Exceeded Handling** - App crashes in private browsing or when storage is full
5. **Font Loading Race Conditions** - Fonts load asynchronously causing flash of unstyled text (FOUT)

These bugs affect core workflows including element positioning, asset discovery, export operations, data persistence, and visual rendering.

## Bug Analysis

### Current Behavior (Defect)

#### 1. Drag Operation Cancellation

1.1 WHEN a user starts dragging an element and presses the Escape key THEN the system does not cancel the drag operation and the element remains in drag mode

1.2 WHEN a user starts dragging an element and clicks outside the canvas THEN the drag continues until pointer up event fires

#### 2. Asset Search Race Conditions

2.1 WHEN a user initiates a new asset search while a previous search is still pending THEN both requests complete and the results from the first request may overwrite the results from the second request

2.2 WHEN a user switches asset sources (Unsplash → Pexels → Giphy) rapidly THEN multiple concurrent requests execute and display results from the wrong source

2.3 WHEN a user changes the search query before the previous search completes THEN stale results display for the old query

#### 3. Export Error Handling

3.1 WHEN an export operation (PNG, JPG, PDF, ZIP) fails due to image conversion errors THEN the system does not catch the error and the app crashes

3.2 WHEN an export operation fails due to memory constraints with large carousels THEN the exporting state remains stuck and the user cannot retry

3.3 WHEN an export operation times out or the browser blocks the download THEN no user feedback is provided about the failure

#### 4. LocalStorage Quota Management

4.1 WHEN localStorage.setItem is called and the storage quota is exceeded THEN the system throws an uncaught QuotaExceededError and the app crashes

4.2 WHEN a user opens the app in private browsing mode where localStorage is unavailable THEN the system throws an uncaught error on every state change

4.3 WHEN localStorage is full and the user makes edits THEN changes are silently lost without user notification

#### 5. Font Loading Timing

5.1 WHEN the app hydrates from localStorage with uploaded custom fonts THEN the fonts are loaded asynchronously but the UI renders immediately causing FOUT (Flash of Unstyled Text)

5.2 WHEN custom fonts fail to load due to network errors or invalid font files THEN the system does not fall back to default fonts and text may be invisible

5.3 WHEN the user exports slides before custom fonts finish loading THEN the exported images contain fallback fonts instead of the intended custom fonts

### Expected Behavior (Correct)

#### 1. Drag Operation Cancellation

2.1 WHEN a user starts dragging an element and presses the Escape key THEN the system SHALL cancel the drag operation, restore the element to its original position, and clear the drag state

2.2 WHEN a user starts dragging an element and the pointer leaves the window boundary THEN the system SHALL complete the drag at the last valid position within the canvas

#### 2. Asset Search Race Conditions

2.3 WHEN a user initiates a new asset search while a previous search is still pending THEN the system SHALL abort the previous request using AbortController

2.4 WHEN a user switches asset sources rapidly THEN the system SHALL cancel all pending requests and only display results from the most recent source selection

2.5 WHEN a user changes the search query before the previous search completes THEN the system SHALL ignore stale results and only display results matching the current query

#### 3. Export Error Handling

2.6 WHEN an export operation fails due to image conversion errors THEN the system SHALL catch the error, display a user-friendly error message, and reset the exporting state

2.7 WHEN an export operation fails due to memory constraints THEN the system SHALL catch the error, suggest reducing carousel size or slide count, and allow the user to retry

2.8 WHEN an export operation times out THEN the system SHALL provide feedback about the timeout and offer to retry the operation

#### 4. LocalStorage Quota Management

2.9 WHEN localStorage.setItem is called and the storage quota is exceeded THEN the system SHALL catch the QuotaExceededError, notify the user, and continue operating with in-memory state only

2.10 WHEN a user opens the app in private browsing mode where localStorage is unavailable THEN the system SHALL detect the unavailability, show a warning banner, and operate in memory-only mode

2.11 WHEN localStorage operations fail THEN the system SHALL gracefully degrade to in-memory state management without losing the current session data

#### 5. Font Loading Timing

2.12 WHEN the app hydrates from localStorage with uploaded custom fonts THEN the system SHALL track font loading state and only render slides after fonts are loaded or a timeout expires

2.13 WHEN custom fonts fail to load THEN the system SHALL fall back to the closest available system font and log a warning

2.14 WHEN the user exports slides THEN the system SHALL wait for all custom fonts to finish loading before generating the export images

### Unchanged Behavior (Regression Prevention)

#### 3. Drag Operations

3.1 WHEN a user successfully completes a drag operation by releasing the pointer THEN the system SHALL CONTINUE TO update the element position, record the change in history, and increment the edit counter

3.2 WHEN a user drags an element within the canvas boundaries THEN the system SHALL CONTINUE TO constrain the element position to stay within the canvas safe zone

#### 4. Asset Search

3.3 WHEN a user performs a successful asset search THEN the system SHALL CONTINUE TO display results in the correct format with thumbnails, labels, and source attribution

3.4 WHEN a user clicks an asset result THEN the system SHALL CONTINUE TO add the asset as an image element to the current slide

3.5 WHEN a user uploads a custom asset THEN the system SHALL CONTINUE TO process the upload and add it to the current slide

#### 5. Export Operations

3.6 WHEN a user successfully exports slides as PNG, JPG, PDF, or ZIP THEN the system SHALL CONTINUE TO generate high-quality images at the correct resolution

3.7 WHEN a user exports a carousel THEN the system SHALL CONTINUE TO increment the export counter in analytics

3.8 WHEN multiple slides are exported THEN the system SHALL CONTINUE TO process them in order and include all visible elements

#### 6. LocalStorage Persistence

3.9 WHEN localStorage is available and has sufficient space THEN the system SHALL CONTINUE TO persist the complete builder state including slides, brand kit, versions, comments, and analytics

3.10 WHEN the app hydrates from localStorage THEN the system SHALL CONTINUE TO restore the previous session state including the current slide selection

#### 7. Font Rendering

3.11 WHEN standard fonts (Inter, Syne, DM Sans, etc.) are used THEN the system SHALL CONTINUE TO render text immediately without loading delays

3.12 WHEN a user changes font families in the brand kit THEN the system SHALL CONTINUE TO update all slide elements to use the new fonts

3.13 WHEN a user views slides in the thumbnail panel THEN the system SHALL CONTINUE TO render text with the correct fonts at the scaled size
