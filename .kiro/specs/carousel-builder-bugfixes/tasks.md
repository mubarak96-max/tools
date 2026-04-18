# Implementation Plan

## Bug 1: Missing Escape Key Handler for Drag Operations

- [x] 1.1 Write bug condition exploration test
  - **Property 1: Bug Condition** - Escape Key Does Not Cancel Drag
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing case: drag any element, press Escape key
  - Test that pressing Escape during drag does NOT cancel the operation (from Bug Condition in design)
  - The test assertions should match the Expected Behavior Properties from design: drag should be cancelled, element should revert to original position
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1_

- [x] 1.2 Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Successful Drag Operations
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for successful drag operations (pointer up without Escape)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Test that completed drags update element positions, record history, and increment edit counter
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2_

- [ ] 1.3 Fix for Escape key drag cancellation

  - [x] 1.3.1 Implement the fix
    - Add useEffect hook to attach global keyboard event listener
    - Listen for keydown event with key === "Escape"
    - Check if dragStateRef.current !== null && dragStateRef.current.isDragging
    - If true, restore element position from dragStateRef.current.beforeDrag
    - Clear dragStateRef.current = null
    - Clean up event listener on unmount
    - _Bug_Condition: isBugCondition_DragEscape(input) where input.key === "Escape" AND dragStateRef.current !== null AND dragStateRef.current.isDragging === true_
    - _Expected_Behavior: dragCancelled(result) AND elementRestored(result) from design_
    - _Preservation: Successful drag operations that complete with pointer up must continue to update element positions and record history_
    - _Requirements: 1.1, 2.1, 2.2, 3.1, 3.2_

  - [ ] 1.3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Escape Key Cancels Drag
    - **IMPORTANT**: Re-run the SAME test from task 1.1 - do NOT write a new test
    - The test from task 1.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2_

  - [ ] 1.3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Successful Drag Operations
    - **IMPORTANT**: Re-run the SAME tests from task 1.2 - do NOT write new tests
    - Run preservation property tests from step 1.2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 1.4 Checkpoint - Ensure all Bug 1 tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Bug 2: Asset Search Race Conditions

- [ ] 2.1 Write bug condition exploration test
  - **Property 1: Bug Condition** - Asset Search Race Conditions
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: initiate multiple searches rapidly, switch sources before completion
  - Test that multiple concurrent requests execute and stale results may display (from Bug Condition in design)
  - The test assertions should match the Expected Behavior Properties from design: previous requests should be aborted, only current results should display
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (e.g., "searching 'business' then 'marketing' displays 'business' results")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 2.2 Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Successful Asset Searches
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for single asset searches without rapid changes
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Test that successful searches display results with thumbnails, labels, and source attribution
  - Test that clicking asset results adds them to the current slide
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.3, 3.4, 3.5_

- [ ] 2.3 Fix for asset search race conditions

  - [ ] 2.3.1 Implement the fix
    - Add useRef<AbortController | null> to track current search request
    - Before each fetch, abort previous controller: abortControllerRef.current?.abort()
    - Create new AbortController for each search
    - Pass signal to fetch options
    - Catch AbortError and ignore (don't set error state)
    - Validate results match current query/source before setting state
    - _Bug_Condition: isBugCondition_AssetRace(state) where pendingRequests.length > 1 OR query/source mismatch_
    - _Expected_Behavior: previousRequestAborted(result) AND correctResultsDisplayed(result) from design_
    - _Preservation: Successful asset searches must continue to display results with thumbnails and source attribution_
    - _Requirements: 2.1, 2.2, 2.3, 2.3, 2.4, 2.5, 3.3, 3.4, 3.5_

  - [ ] 2.3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Asset Search Request Cancellation
    - **IMPORTANT**: Re-run the SAME test from task 2.1 - do NOT write a new test
    - The test from task 2.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 2.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.3, 2.4, 2.5_

  - [ ] 2.3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Successful Asset Searches
    - **IMPORTANT**: Re-run the SAME tests from task 2.2 - do NOT write new tests
    - Run preservation property tests from step 2.2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 2.4 Checkpoint - Ensure all Bug 2 tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Bug 3: Export Functions Missing Error Boundaries

- [ ] 3.1 Write bug condition exploration test
  - **Property 1: Bug Condition** - Export Functions Crash Without Error Handling
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: mock html-to-image to throw error, attempt export
  - Test that export operations throw uncaught errors and leave exporting state stuck (from Bug Condition in design)
  - The test assertions should match the Expected Behavior Properties from design: errors should be caught, user should be notified, state should reset
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (e.g., "export with image conversion error crashes app")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 3.2 Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Successful Export Operations
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for successful export operations
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Test that successful exports generate high-quality images at correct resolution
  - Test that exports increment the export counter in analytics
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.6, 3.7, 3.8_

- [ ] 3.3 Fix for export error handling

  - [ ] 3.3.1 Implement the fix
    - Wrap all export operations (PNG, JPG, PDF, ZIP) in try-catch blocks
    - Catch errors from toJpeg, toPng, jsPDF.save, JSZip.generateAsync
    - Set user-friendly error messages based on error type (memory, timeout, conversion)
    - Always reset setExporting("") in finally block
    - Add error state: const [exportError, setExportError] = useState("")
    - Display error message in UI with retry button
    - _Bug_Condition: isBugCondition_ExportError(operation) where operation fails AND NOT operation.hasErrorHandler_
    - _Expected_Behavior: errorCaught(result) AND userNotified(result) AND stateReset(result) from design_
    - _Preservation: Successful export operations must continue to generate high-quality images at correct resolution_
    - _Requirements: 3.1, 3.2, 3.3, 2.6, 2.7, 2.8, 3.6, 3.7, 3.8_

  - [ ] 3.3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Export Error Handling
    - **IMPORTANT**: Re-run the SAME test from task 3.1 - do NOT write a new test
    - The test from task 3.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 3.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.6, 2.7, 2.8_

  - [ ] 3.3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Successful Export Operations
    - **IMPORTANT**: Re-run the SAME tests from task 3.2 - do NOT write new tests
    - Run preservation property tests from step 3.2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 3.4 Checkpoint - Ensure all Bug 3 tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Bug 4: LocalStorage Quota Exceeded Handling

- [ ] 4.1 Write bug condition exploration test
  - **Property 1: Bug Condition** - LocalStorage Quota Exceeded Crashes App
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: mock localStorage.setItem to throw QuotaExceededError
  - Test that localStorage quota errors throw uncaught exceptions and crash the app (from Bug Condition in design)
  - The test assertions should match the Expected Behavior Properties from design: errors should be caught, user should be warned, app should continue
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (e.g., "QuotaExceededError crashes app on state change")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 4.2 Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - LocalStorage Persistence
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code when localStorage is available and has sufficient space
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Test that state persists to localStorage correctly
  - Test that state restores from localStorage on hydration
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.9, 3.10_

- [ ] 4.3 Fix for localStorage quota handling

  - [ ] 4.3.1 Implement the fix
    - Wrap localStorage.setItem in try-catch
    - Detect localStorage availability on mount
    - Add state: const [storageAvailable, setStorageAvailable] = useState(true)
    - Add state: const [storageWarning, setStorageWarning] = useState("")
    - Show warning banner when storage is unavailable or quota exceeded
    - Continue operating with in-memory state only
    - Add helper function to safely write to localStorage
    - _Bug_Condition: isBugCondition_StorageQuota(operation) where operation.quotaExceeded OR operation.storageUnavailable_
    - _Expected_Behavior: errorCaught(result) AND appContinues(result) AND userWarned(result) from design_
    - _Preservation: LocalStorage persistence must continue to work when storage is available and has sufficient space_
    - _Requirements: 4.1, 4.2, 4.3, 2.9, 2.10, 2.11, 3.9, 3.10_

  - [ ] 4.3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - LocalStorage Quota Management
    - **IMPORTANT**: Re-run the SAME test from task 4.1 - do NOT write a new test
    - The test from task 4.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 4.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.9, 2.10, 2.11_

  - [ ] 4.3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - LocalStorage Persistence
    - **IMPORTANT**: Re-run the SAME tests from task 4.2 - do NOT write new tests
    - Run preservation property tests from step 4.2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4.4 Checkpoint - Ensure all Bug 4 tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Bug 5: Font Loading Race Conditions

- [ ] 5.1 Write bug condition exploration test
  - **Property 1: Bug Condition** - Font Loading Race Conditions Cause FOUT
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: hydrate with custom fonts, render immediately
  - Test that custom fonts load asynchronously while UI renders immediately causing FOUT (from Bug Condition in design)
  - The test assertions should match the Expected Behavior Properties from design: fonts should load before rendering, or timeout should expire
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (e.g., "slides render with fallback fonts, then reflow when custom fonts load")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 5.2 Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Standard Font Rendering
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for standard fonts (Inter, Syne, DM Sans, etc.)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Test that standard fonts render immediately without loading delays
  - Test that font family changes update all slide elements correctly
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.11, 3.12, 3.13_

- [ ] 5.3 Fix for font loading synchronization

  - [ ] 5.3.1 Implement the fix in CarouselBuilderApp.tsx
    - Add state: const [fontsLoading, setFontsLoading] = useState(false)
    - Add state: const [fontsReady, setFontsReady] = useState(false)
    - Modify hydration useEffect to track font loading
    - Wait for fonts before rendering (or timeout after 3 seconds)
    - Wait for fonts before exporting
    - Show loading indicator while fonts load
    - Use Promise.race with Promise.allSettled and timeout
    - _Bug_Condition: isBugCondition_FontLoading(state) where uploadedFonts.length > 0 AND fontsLoading === true AND rendering/exporting_
    - _Expected_Behavior: fontsLoaded(result) OR timeoutExpired(result) AND noFOUT(result) from design_
    - _Preservation: Standard fonts must continue to render immediately without loading delays_
    - _Requirements: 5.1, 5.2, 5.3, 2.12, 2.13, 2.14, 3.11, 3.12, 3.13_

  - [ ] 5.3.2 Modify restoreUploadedFonts in builder.ts to return Promise
    - Change function signature to return Promise<void>
    - Use Promise.allSettled to load all fonts
    - Return the promise so caller can await completion
    - Add timeout mechanism (handled in caller)
    - _Requirements: 2.12, 2.13, 2.14_

  - [ ] 5.3.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Font Loading Synchronization
    - **IMPORTANT**: Re-run the SAME test from task 5.1 - do NOT write a new test
    - The test from task 5.1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 5.1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.12, 2.13, 2.14_

  - [ ] 5.3.4 Verify preservation tests still pass
    - **Property 2: Preservation** - Standard Font Rendering
    - **IMPORTANT**: Re-run the SAME tests from task 5.2 - do NOT write new tests
    - Run preservation property tests from step 5.2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 5.4 Checkpoint - Ensure all Bug 5 tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Final Validation

- [ ] 6.1 Run complete test suite
  - Run all bug condition exploration tests (should all pass)
  - Run all preservation property tests (should all pass)
  - Run integration tests for end-to-end workflows
  - Verify no regressions in existing functionality

- [ ] 6.2 Manual testing
  - Test drag operations with Escape key cancellation
  - Test rapid asset searches and source switching
  - Test export operations with error scenarios
  - Test localStorage quota handling in private browsing
  - Test custom font loading and export

- [ ] 6.3 Final checkpoint
  - Ensure all tests pass
  - Verify all 5 bugs are fixed
  - Confirm no regressions introduced
  - Ask the user if questions arise or if ready to deploy
