# Carousel Builder Bugfixes Design

## Overview

This design addresses five critical bugs in the Free Social Media Carousel Builder that impact core workflows: drag operations, asset search, export functionality, data persistence, and font rendering. The fixes implement proper cancellation mechanisms, race condition prevention, comprehensive error handling, graceful storage degradation, and font loading synchronization.

**Affected Files:**
- `src/app/utility/free-social-media-carousel-builder/components/CarouselBuilderApp.tsx` (primary)
- `src/app/utility/free-social-media-carousel-builder/lib/builder.ts` (font loading utilities)

**Fix Strategy:**
- Add keyboard event listeners for drag cancellation
- Implement AbortController for asset search request management
- Wrap export operations in try-catch with user feedback
- Add localStorage availability detection and quota error handling
- Implement font loading state tracking with Promise.allSettled

## Glossary

- **Bug_Condition (C)**: The condition that triggers each specific bug
- **Property (P)**: The desired behavior when the bug condition is met
- **Preservation**: Existing functionality that must remain unchanged
- **dragStateRef**: React ref storing current drag operation state (slideId, elementId, offsets, scale, beforeDrag state)
- **AbortController**: Web API for canceling fetch requests
- **QuotaExceededError**: DOMException thrown when localStorage quota is exceeded
- **FOUT**: Flash of Unstyled Text - visual artifact when fonts load after initial render
- **restoreUploadedFonts**: Function in builder.ts that loads custom fonts from localStorage

## Bug Details

### Bug 1: Missing Escape Key Handler for Drag Operations

#### Bug Condition

The bug manifests when a user initiates a drag operation on a slide element and presses the Escape key. The `dragStateRef` contains active drag state but no keyboard event listener exists to detect the Escape key and cancel the operation.

**Formal Specification:**
```
FUNCTION isBugCondition_DragEscape(input)
  INPUT: input of type KeyboardEvent
  OUTPUT: boolean
  
  RETURN input.key === "Escape"
         AND dragStateRef.current !== null
         AND dragStateRef.current.isDragging === true
END FUNCTION
```

#### Examples

- User drags a title element, presses Escape → element stays in dragged position instead of reverting
- User drags an image element, presses Escape → drag continues until pointer up
- User accidentally starts drag, presses Escape → no way to cancel, must complete the drag
- User drags element off-canvas, presses Escape → element remains off-canvas

### Bug 2: Asset Search Race Conditions

#### Bug Condition

The bug manifests when a user initiates multiple asset searches in rapid succession or switches between asset sources (Unsplash, Pexels, Giphy) before previous requests complete. Multiple concurrent fetch requests execute without cancellation, and the last completed request (not the last initiated request) determines the displayed results.

**Formal Specification:**
```
FUNCTION isBugCondition_AssetRace(state)
  INPUT: state containing assetQuery, assetSource, pendingRequests
  OUTPUT: boolean
  
  RETURN pendingRequests.length > 1
         OR (pendingRequests.length > 0 AND state.assetQuery !== pendingRequests[0].query)
         OR (pendingRequests.length > 0 AND state.assetSource !== pendingRequests[0].source)
END FUNCTION
```

#### Examples

- User types "business" → types "marketing" before first search completes → sees "business" results
- User selects Unsplash → switches to Pexels → switches to Giphy → sees Unsplash results
- User searches "strategy" → searches "leadership" → first request is slower → sees "strategy" results
- User rapidly changes search query → loading state never clears → UI stuck in loading state

### Bug 3: Export Functions Missing Error Boundaries

#### Bug Condition

The bug manifests when export operations (PNG, JPG, PDF, ZIP) fail due to image conversion errors, memory constraints, or browser restrictions. The `toJpeg`, `toPng`, or `jsPDF` operations throw errors that are not caught, causing the application to crash and leaving the `exporting` state stuck.

**Formal Specification:**
```
FUNCTION isBugCondition_ExportError(operation)
  INPUT: operation of type ExportOperation
  OUTPUT: boolean
  
  RETURN operation.type IN ["png", "jpg", "pdf", "zip"]
         AND (operation.imageConversionFails 
              OR operation.memoryExceeded
              OR operation.browserBlocked
              OR operation.timeout)
         AND NOT operation.hasErrorHandler
END FUNCTION
```

#### Examples

- User exports 20-slide carousel as ZIP → runs out of memory → app crashes
- User exports slide with large image → html-to-image fails → app crashes, exporting state stuck
- User exports PDF → browser blocks download → no feedback, button remains disabled
- User exports PNG → network error loading external image → uncaught promise rejection

### Bug 4: LocalStorage Quota Exceeded Handling

#### Bug Condition

The bug manifests when `localStorage.setItem` is called and the storage quota is exceeded (typically 5-10MB) or when localStorage is unavailable (private browsing, disabled by user/policy). The operation throws a `QuotaExceededError` or `SecurityError` that is not caught, causing the app to crash on every state change.

**Formal Specification:**
```
FUNCTION isBugCondition_StorageQuota(operation)
  INPUT: operation of type StorageOperation
  OUTPUT: boolean
  
  RETURN operation.method === "setItem"
         AND (operation.quotaExceeded 
              OR operation.storageUnavailable
              OR operation.securityError)
         AND NOT operation.hasErrorHandler
END FUNCTION
```

#### Examples

- User creates 50-slide carousel with many images → localStorage quota exceeded → app crashes
- User opens app in private browsing → localStorage unavailable → app crashes on first edit
- User's browser has localStorage disabled → app crashes immediately after hydration
- User makes small edit → localStorage full → change silently lost, no warning

### Bug 5: Font Loading Race Conditions

#### Bug Condition

The bug manifests when the app hydrates from localStorage with custom uploaded fonts. The `restoreUploadedFonts` function loads fonts asynchronously using `FontFace` API, but the UI renders immediately without waiting for fonts to load, causing FOUT (Flash of Unstyled Text). Additionally, when exporting slides, the export may complete before fonts finish loading, resulting in exported images with fallback fonts.

**Formal Specification:**
```
FUNCTION isBugCondition_FontLoading(state)
  INPUT: state containing uploadedFonts, renderingSlides, exporting
  OUTPUT: boolean
  
  RETURN state.uploadedFonts.length > 0
         AND state.fontsLoading === true
         AND (state.renderingSlides === true OR state.exporting !== "")
         AND NOT state.waitingForFonts
END FUNCTION
```

#### Examples

- User opens app with custom fonts → slides render with fallback fonts → fonts load → text reflows (FOUT)
- User exports carousel immediately after opening → exported images use fallback fonts
- User uploads font → font fails to load → text invisible or uses wrong font
- User has slow network → fonts take 5 seconds to load → prolonged FOUT

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Successful drag operations that complete with pointer up must continue to update element positions and record history
- Successful asset searches must continue to display results with thumbnails and source attribution
- Successful export operations must continue to generate high-quality images at correct resolution
- LocalStorage persistence must continue to work when storage is available and has sufficient space
- Standard fonts (Inter, Syne, DM Sans, etc.) must continue to render immediately without delays

**Scope:**
All inputs that do NOT involve the specific bug conditions should be completely unaffected by these fixes. This includes:
- Completed drag operations (pointer up without Escape key)
- Single asset searches without rapid changes
- Export operations that succeed without errors
- LocalStorage operations when quota is available
- Rendering with standard fonts that don't require loading

## Hypothesized Root Cause

Based on the bug descriptions and code analysis, the most likely issues are:

### 1. **Missing Keyboard Event Listener**
   - No global keyboard event listener attached to detect Escape key during drag operations
   - `dragStateRef` tracks drag state but no mechanism to cancel based on keyboard input
   - Drag cancellation only occurs on pointer up, not on Escape key

### 2. **No Request Cancellation Mechanism**
   - Asset search functions don't use AbortController to cancel previous requests
   - Multiple concurrent fetch requests execute simultaneously
   - No request ID or timestamp to validate result freshness
   - State updates from stale requests overwrite current state

### 3. **Unprotected Async Operations**
   - Export functions (`toJpeg`, `toPng`, `jsPDF.save`) are not wrapped in try-catch blocks
   - Promise rejections from html-to-image library are not caught
   - `setExporting` state is not reset in error scenarios
   - No user feedback mechanism for export failures

### 4. **No Storage Error Handling**
   - `localStorage.setItem` calls in useEffect are not wrapped in try-catch
   - No detection of localStorage availability before attempting operations
   - No fallback to in-memory state when storage is unavailable
   - No user notification when storage operations fail

### 5. **Asynchronous Font Loading Without Synchronization**
   - `restoreUploadedFonts` loads fonts asynchronously but doesn't return a Promise
   - UI renders immediately after setting state, before fonts are ready
   - Export operations don't wait for font loading to complete
   - No font loading state tracking or timeout mechanism

## Correctness Properties

Property 1: Bug Condition - Escape Key Cancels Drag Operations

_For any_ keyboard input where the Escape key is pressed and a drag operation is active (dragStateRef.current !== null and isDragging === true), the fixed code SHALL cancel the drag operation, restore the element to its position before the drag started (using beforeDrag state), clear the dragStateRef, and allow the user to continue editing.

**Validates: Requirements 2.1, 2.2**

Property 2: Bug Condition - Asset Search Request Cancellation

_For any_ asset search where a new search is initiated while a previous search is pending, the fixed code SHALL abort the previous fetch request using AbortController, ignore results from aborted requests, and only display results from the most recent search matching the current query and source.

**Validates: Requirements 2.3, 2.4, 2.5**

Property 3: Bug Condition - Export Error Handling

_For any_ export operation that fails due to errors (image conversion, memory, timeout), the fixed code SHALL catch the error, display a user-friendly error message describing the failure, reset the exporting state to allow retry, and log the error for debugging.

**Validates: Requirements 2.6, 2.7, 2.8**

Property 4: Bug Condition - LocalStorage Quota Management

_For any_ localStorage operation that fails due to quota exceeded or unavailability, the fixed code SHALL catch the error (QuotaExceededError, SecurityError), notify the user with a warning banner, continue operating with in-memory state only, and preserve the current session data without crashing.

**Validates: Requirements 2.9, 2.10, 2.11**

Property 5: Bug Condition - Font Loading Synchronization

_For any_ rendering or export operation when custom fonts are loading, the fixed code SHALL track font loading state, wait for fonts to load (or timeout after 3 seconds), render slides only after fonts are ready, fall back to system fonts if loading fails, and ensure exported images contain the correct fonts.

**Validates: Requirements 2.12, 2.13, 2.14**

Property 6: Preservation - Successful Drag Operations

_For any_ drag operation that completes successfully with pointer up (without Escape key), the fixed code SHALL produce exactly the same behavior as the original code, updating element positions, recording history, and incrementing the edit counter.

**Validates: Requirements 3.1, 3.2**

Property 7: Preservation - Successful Asset Searches

_For any_ asset search that completes without rapid changes or source switching, the fixed code SHALL produce exactly the same behavior as the original code, displaying results with thumbnails, labels, and source attribution.

**Validates: Requirements 3.3, 3.4, 3.5**

Property 8: Preservation - Successful Export Operations

_For any_ export operation that succeeds without errors, the fixed code SHALL produce exactly the same behavior as the original code, generating high-quality images at correct resolution and incrementing the export counter.

**Validates: Requirements 3.6, 3.7, 3.8**

Property 9: Preservation - LocalStorage Persistence

_For any_ localStorage operation when storage is available and has sufficient space, the fixed code SHALL produce exactly the same behavior as the original code, persisting the complete builder state and restoring it on hydration.

**Validates: Requirements 3.9, 3.10**

Property 10: Preservation - Standard Font Rendering

_For any_ rendering operation using standard fonts (Inter, Syne, DM Sans, etc.), the fixed code SHALL produce exactly the same behavior as the original code, rendering text immediately without loading delays.

**Validates: Requirements 3.11, 3.12, 3.13**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `src/app/utility/free-social-media-carousel-builder/components/CarouselBuilderApp.tsx`

**Function**: `CarouselBuilderApp` (main component)

**Specific Changes**:

#### 1. **Add Escape Key Handler for Drag Cancellation**
   - Add `useEffect` hook to attach global keyboard event listener
   - Listen for `keydown` event with `key === "Escape"`
   - Check if `dragStateRef.current !== null && dragStateRef.current.isDragging`
   - If true, restore element position from `dragStateRef.current.beforeDrag`
   - Clear `dragStateRef.current = null`
   - Clean up event listener on unmount

```typescript
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && dragStateRef.current?.isDragging) {
      // Cancel drag: restore previous state
      setEditor({ ...editor, present: dragStateRef.current.beforeDrag });
      dragStateRef.current = null;
    }
  };
  
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [editor]);
```

#### 2. **Implement AbortController for Asset Search**
   - Add `useRef<AbortController | null>` to track current search request
   - Before each fetch, abort previous controller: `abortControllerRef.current?.abort()`
   - Create new AbortController for each search
   - Pass `signal` to fetch options
   - Catch `AbortError` and ignore (don't set error state)
   - Validate results match current query/source before setting state

```typescript
const abortControllerRef = useRef<AbortController | null>(null);

const searchAssets = useCallback(async (query: string, source: AssetSource) => {
  // Abort previous request
  abortControllerRef.current?.abort();
  abortControllerRef.current = new AbortController();
  
  setAssetLoading(true);
  setAssetError("");
  
  try {
    const response = await fetch(`/api/assets?q=${query}&source=${source}`, {
      signal: abortControllerRef.current.signal
    });
    
    // Validate results are still relevant
    if (query !== assetQuery || source !== assetSource) {
      return; // Ignore stale results
    }
    
    const data = await response.json();
    setAssetResults(data);
  } catch (error) {
    if (error.name === "AbortError") {
      return; // Ignore aborted requests
    }
    setAssetError("Failed to load assets");
  } finally {
    setAssetLoading(false);
  }
}, [assetQuery, assetSource]);
```

#### 3. **Add Error Boundaries to Export Functions**
   - Wrap all export operations in try-catch blocks
   - Catch errors from `toJpeg`, `toPng`, `jsPDF.save`, `JSZip.generateAsync`
   - Set user-friendly error messages based on error type
   - Always reset `setExporting("")` in finally block
   - Add error state: `const [exportError, setExportError] = useState("")`
   - Display error message in UI with retry button

```typescript
const exportAsPNG = useCallback(async () => {
  setExporting("png");
  setExportError("");
  
  try {
    const promises = present.slides.map(async (slide) => {
      const node = hiddenStageRefs.current[slide.id];
      if (!node) throw new Error(`Slide ${slide.id} not found`);
      
      const dataUrl = await toPng(node, {
        quality: 1.0,
        pixelRatio: 2,
      });
      
      return { slideId: slide.id, dataUrl };
    });
    
    const results = await Promise.all(promises);
    
    // Download logic...
  } catch (error) {
    console.error("Export failed:", error);
    
    if (error.message?.includes("memory")) {
      setExportError("Export failed: Not enough memory. Try reducing slide count or image sizes.");
    } else if (error.message?.includes("timeout")) {
      setExportError("Export timed out. Please try again.");
    } else {
      setExportError("Export failed. Please try again or contact support.");
    }
  } finally {
    setExporting("");
  }
}, [present.slides]);
```

#### 4. **Add LocalStorage Quota Error Handling**
   - Wrap `localStorage.setItem` in try-catch
   - Detect localStorage availability on mount
   - Add state: `const [storageAvailable, setStorageAvailable] = useState(true)`
   - Show warning banner when storage is unavailable
   - Continue operating with in-memory state only
   - Add helper function to safely write to localStorage

```typescript
const [storageAvailable, setStorageAvailable] = useState(true);
const [storageWarning, setStorageWarning] = useState("");

// Check localStorage availability on mount
useEffect(() => {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    setStorageAvailable(true);
  } catch {
    setStorageAvailable(false);
    setStorageWarning("Storage unavailable. Changes will not be saved between sessions.");
  }
}, []);

// Safe localStorage write
useEffect(() => {
  if (!hydrated || !storageAvailable) return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(present));
    setStorageWarning(""); // Clear any previous warnings
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      setStorageWarning("Storage quota exceeded. Changes will not be saved. Try exporting your work.");
      setStorageAvailable(false);
    } else {
      setStorageWarning("Failed to save changes. Storage may be unavailable.");
    }
  }
}, [hydrated, present, storageAvailable]);
```

#### 5. **Implement Font Loading State Tracking**
   - Add state: `const [fontsLoading, setFontsLoading] = useState(false)`
   - Add state: `const [fontsReady, setFontsReady] = useState(false)`
   - Modify hydration useEffect to track font loading
   - Wait for fonts before rendering (or timeout after 3 seconds)
   - Wait for fonts before exporting
   - Show loading indicator while fonts load

```typescript
const [fontsLoading, setFontsLoading] = useState(false);
const [fontsReady, setFontsReady] = useState(false);

useEffect(() => {
  const loadState = async () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BuilderState;
        parsed.analytics = {
          edits: parsed.analytics?.edits || 0,
          exports: parsed.analytics?.exports || 0,
          aiRuns: parsed.analytics?.aiRuns || 0,
          assetSearches: parsed.analytics?.assetSearches || 0,
          versions: parsed.analytics?.versions || 0,
          sessions: (parsed.analytics?.sessions || 0) + 1,
        };
        
        // Load fonts if present
        if (parsed.brandKit.uploadedFonts?.length > 0) {
          setFontsLoading(true);
          
          const fontPromises = parsed.brandKit.uploadedFonts.map(async (font) => {
            try {
              const fontFace = new FontFace(font.family, `url(${font.source})`);
              await fontFace.load();
              document.fonts.add(fontFace);
            } catch (error) {
              console.warn(`Failed to load font ${font.family}:`, error);
            }
          });
          
          // Wait for all fonts with 3 second timeout
          await Promise.race([
            Promise.allSettled(fontPromises),
            new Promise(resolve => setTimeout(resolve, 3000))
          ]);
          
          setFontsLoading(false);
          setFontsReady(true);
        } else {
          setFontsReady(true);
        }
        
        setEditor({ past: [], present: parsed, future: [] });
      }
    } catch {
      setEditor({ past: [], present: createDefaultBuilderState(), future: [] });
      setFontsReady(true);
    } finally {
      setHydrated(true);
    }
  };
  
  loadState();
}, []);

// Wait for fonts before exporting
const exportAsPNG = useCallback(async () => {
  if (fontsLoading) {
    setExportError("Please wait for fonts to finish loading...");
    return;
  }
  
  // ... rest of export logic
}, [fontsLoading, present.slides]);
```

**File**: `src/app/utility/free-social-media-carousel-builder/lib/builder.ts`

**Function**: `restoreUploadedFonts`

**Specific Changes**:

#### 6. **Make restoreUploadedFonts Return Promise**
   - Change function signature to return `Promise<void>`
   - Use `Promise.allSettled` to load all fonts
   - Return the promise so caller can await completion
   - Add timeout mechanism (handled in caller)

```typescript
export async function restoreUploadedFonts(fonts: UploadedFont[]): Promise<void> {
  const fontPromises = fonts.map(async (font) => {
    try {
      const fontFace = new FontFace(font.family, `url(${font.source})`);
      await fontFace.load();
      document.fonts.add(fontFace);
    } catch (error) {
      console.warn(`Failed to load font ${font.family}:`, error);
      throw error; // Re-throw so Promise.allSettled captures it
    }
  });
  
  await Promise.allSettled(fontPromises);
}
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate each bug on unfixed code, then verify the fixes work correctly and preserve existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fixes. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate each bug condition and assert that the expected failures occur on the UNFIXED code.

**Test Cases**:

1. **Drag Escape Test**: Simulate drag operation, fire Escape key event, assert element position does not revert (will fail on unfixed code)
2. **Asset Race Test**: Initiate multiple searches rapidly, assert wrong results display (will fail on unfixed code)
3. **Export Error Test**: Mock html-to-image to throw error, assert app crashes (will fail on unfixed code)
4. **Storage Quota Test**: Mock localStorage.setItem to throw QuotaExceededError, assert app crashes (will fail on unfixed code)
5. **Font Loading Test**: Load state with custom fonts, assert FOUT occurs (will fail on unfixed code)

**Expected Counterexamples**:
- Escape key during drag does not cancel operation
- Stale asset search results overwrite current results
- Export errors crash the app and leave exporting state stuck
- LocalStorage quota errors crash the app
- Custom fonts cause FOUT and export with wrong fonts

### Fix Checking

**Goal**: Verify that for all inputs where each bug condition holds, the fixed code produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition_DragEscape(input) DO
  result := handleKeyDown_fixed(input)
  ASSERT dragCancelled(result) AND elementRestored(result)
END FOR

FOR ALL state WHERE isBugCondition_AssetRace(state) DO
  result := searchAssets_fixed(state)
  ASSERT previousRequestAborted(result) AND correctResultsDisplayed(result)
END FOR

FOR ALL operation WHERE isBugCondition_ExportError(operation) DO
  result := exportFunction_fixed(operation)
  ASSERT errorCaught(result) AND userNotified(result) AND stateReset(result)
END FOR

FOR ALL operation WHERE isBugCondition_StorageQuota(operation) DO
  result := saveToStorage_fixed(operation)
  ASSERT errorCaught(result) AND appContinues(result) AND userWarned(result)
END FOR

FOR ALL state WHERE isBugCondition_FontLoading(state) DO
  result := renderSlides_fixed(state)
  ASSERT fontsLoaded(result) OR timeoutExpired(result) AND noFOUT(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug conditions do NOT hold, the fixed code produces the same result as the original code.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition_DragEscape(input) DO
  ASSERT handleDrag_original(input) = handleDrag_fixed(input)
END FOR

FOR ALL state WHERE NOT isBugCondition_AssetRace(state) DO
  ASSERT searchAssets_original(state) = searchAssets_fixed(state)
END FOR

FOR ALL operation WHERE NOT isBugCondition_ExportError(operation) DO
  ASSERT exportFunction_original(operation) = exportFunction_fixed(operation)
END FOR

FOR ALL operation WHERE NOT isBugCondition_StorageQuota(operation) DO
  ASSERT saveToStorage_original(operation) = saveToStorage_fixed(operation)
END FOR

FOR ALL state WHERE NOT isBugCondition_FontLoading(state) DO
  ASSERT renderSlides_original(state) = renderSlides_fixed(state)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for successful operations, then write property-based tests capturing that behavior.

**Test Cases**:

1. **Successful Drag Preservation**: Observe that completed drags work correctly on unfixed code, then write test to verify this continues after fix
2. **Single Search Preservation**: Observe that single searches work correctly on unfixed code, then write test to verify this continues after fix
3. **Successful Export Preservation**: Observe that successful exports work correctly on unfixed code, then write test to verify this continues after fix
4. **Available Storage Preservation**: Observe that storage works when available on unfixed code, then write test to verify this continues after fix
5. **Standard Font Preservation**: Observe that standard fonts render immediately on unfixed code, then write test to verify this continues after fix

### Unit Tests

**Drag Cancellation:**
- Test Escape key cancels active drag operation
- Test Escape key does nothing when no drag is active
- Test element position reverts to beforeDrag state
- Test dragStateRef is cleared after cancellation

**Asset Search:**
- Test AbortController aborts previous request when new search starts
- Test stale results are ignored when query changes
- Test stale results are ignored when source changes
- Test AbortError is caught and doesn't set error state
- Test loading state clears correctly after abort

**Export Error Handling:**
- Test export catches image conversion errors
- Test export catches memory errors
- Test export catches timeout errors
- Test exporting state resets after error
- Test error messages are user-friendly
- Test retry works after error

**LocalStorage:**
- Test QuotaExceededError is caught
- Test SecurityError is caught (private browsing)
- Test warning banner displays when storage unavailable
- Test app continues operating with in-memory state
- Test storage availability detection on mount

**Font Loading:**
- Test font loading state tracks correctly
- Test fonts load before rendering
- Test 3-second timeout prevents indefinite waiting
- Test fallback to system fonts on load failure
- Test export waits for fonts to load

### Property-Based Tests

**Drag Operations:**
- Generate random drag scenarios (different elements, positions, scales)
- Verify Escape key always cancels and restores position
- Verify completed drags (without Escape) always update position

**Asset Searches:**
- Generate random search sequences (queries, sources, timing)
- Verify results always match current query and source
- Verify no race conditions occur regardless of timing

**Export Operations:**
- Generate random carousel configurations (slide counts, image sizes)
- Verify successful exports always produce correct output
- Verify failed exports always catch errors and reset state

**Storage Operations:**
- Generate random state sizes and storage conditions
- Verify app never crashes regardless of storage availability
- Verify data persists when storage is available

**Font Rendering:**
- Generate random font configurations (standard, custom, mixed)
- Verify no FOUT occurs with custom fonts
- Verify standard fonts always render immediately

### Integration Tests

**End-to-End Drag Workflow:**
- Start drag, press Escape, verify element reverts, continue editing
- Start drag, complete drag, verify position updates, undo, verify history works

**End-to-End Asset Search Workflow:**
- Search Unsplash, switch to Pexels, verify Pexels results display
- Type query rapidly, verify only latest results display
- Search, add asset to slide, verify asset appears correctly

**End-to-End Export Workflow:**
- Create carousel, export PNG, verify success
- Create large carousel, export ZIP, handle memory error gracefully
- Export immediately after opening, verify fonts load first

**End-to-End Storage Workflow:**
- Create carousel, verify saves to localStorage
- Fill storage quota, verify warning displays, continue editing
- Open in private browsing, verify warning displays, app works

**End-to-End Font Workflow:**
- Upload custom font, verify loads before rendering
- Export with custom font, verify font appears in export
- Custom font fails to load, verify fallback works
