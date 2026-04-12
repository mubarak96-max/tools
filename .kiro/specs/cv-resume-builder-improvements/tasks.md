# Tasks: CV Resume Builder Improvements

## Implementation Plan

---

### Phase 1: Data Model Updates

- [x] 1.1 Add `github` and `twitter` fields to `ResumePersonalDetails` interface and update `createEmptyResumeDocument` and `createSampleResumeDocument` factory functions
- [x] 1.2 Add `isCurrent: boolean` field to `ResumeEducation` interface and update `createEmptyEducation` factory function
- [x] 1.3 Add `startDate` and `endDate` fields to `ResumeProject` interface and update `createEmptyProject` factory function
- [x] 1.4 Add `fontFamily: FontFamily` type and field to `ResumeBuilderSettings`; add `sectionOrder: SectionKey[]` type and field to `ResumeBuilderSettings`; update `createEmptyResumeDocument` defaults
- [x] 1.5 Export `computeSummaryHint(summary: string): string` pure utility function from `cv-resume-builder.ts`
- [x] 1.6 Update `formatResumeRange` to accept and use `isCurrent` for education entries (already works for experience; ensure education call sites pass the flag)

---

### Phase 2: Quick Wins

- [-] 2.1 Build `ConfirmDialog` component and wire it to "Start blank" and "Load sample" buttons (Requirements 1.1–1.5)
- [-] 2.2 Add `break-inside: avoid` CSS to `<li>` elements and `<article>` entry blocks in `ResumePreview` for all three templates (Requirement 2.1–2.3)
- [-] 2.3 Add "Currently enrolled" checkbox to the Education editor section; disable end date input when `isCurrent` is true; update preview to show "Present" (Requirement 3.2–3.4)
- [-] 2.4 Add GitHub and Twitter/X input fields to the Personal Details editor section; render them in the preview contact section (Requirement 4.2–4.3)
- [-] 2.5 Build `CollapsibleSection` component and wrap each editor section with it (Requirement 5.1–5.4)
- [-] 2.6 Build `ColorPickerSwatch` component replacing the current swatch row; add native `<input type="color">` alongside presets (Requirement 6.1–6.4)

---

### Phase 3: Core UX Improvements

- [-] 3.1 Build `SkillsChipInput` component; replace the skills textarea with it; keep `resume.skills` array in sync (Requirements 7.1–7.7)
- [-] 3.2 Make the preview panel independently scrollable on `xl` breakpoint using sticky positioning and `overflow-y: auto` with a fixed max-height (Requirement 8.1–8.3)
- [-] 3.3 Add real-time character/sentence count hint below the summary textarea using `computeSummaryHint` (Requirements 9.1–9.5)
- [-] 3.4 Add font family selector (Inter / Georgia / Mono) to the Template & Style section; apply selected font to the preview via inline style (Requirements 10.1–10.5)

---

### Phase 4: Advanced Features

- [-] 4.1 Implement undo/redo state (`past`/`future` stacks, cap at 50); replace `updateResume` calls with `updateResumeWithUndo`; wire Ctrl+Z / Ctrl+Y keyboard shortcuts (Requirements 13.1–13.6)
- [-] 4.2 Build `DraggableList` component using HTML5 drag-and-drop; integrate into Work Experience, Education, Projects, Certifications, Languages, and Custom Sections editors (Requirements 11.1–11.5)
- [-] 4.3 Add `sectionOrder` drag-and-drop list to the Template & Style editor; update `ResumePreview` to render sections in `sectionOrder` order; handle missing `sectionOrder` in `parseImportedResumeDocument` (Requirements 12.1–12.6)
- [-] 4.4 Add `startDate` and `endDate` month inputs to the Projects editor; render dates in the preview (Requirement 14.1–14.4)
- [ ] 4.5 Build `AtsTipsPanel` component with collapsible state persisted to localStorage; render it in the editor area with `print:hidden` (Requirements 15.1–15.4)

---

### Phase 5: Tests

- [ ] 5.1 Unit tests for `computeSummaryHint`: empty string, single sentence, multi-sentence, edge punctuation
- [ ] 5.2 Unit tests for `addSkill`/`removeSkill` logic: deduplication, trimming, empty string rejection
- [ ] 5.3 Unit tests for `reorderCollectionItem`: boundary indices, same-index no-op
- [ ] 5.4 Unit tests for `undo`/`redo`: stack push/pop, empty stack no-op, cap at 50
- [ ] 5.5 PBT: for any sequence of N `updateResumeWithUndo` calls followed by N `undo` calls, resume equals initial state
- [ ] 5.6 PBT: for any valid `reorderCollectionItem(key, from, to)`, result array is a permutation of the original
- [ ] 5.7 PBT: `computeSummaryHint` always returns a non-empty string for any string input
