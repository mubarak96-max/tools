# Requirements: CV Resume Builder Improvements

## Overview

Improve the existing free CV/resume builder with 15 targeted enhancements across three tiers: quick wins, core UX improvements, and advanced features.

---

## Requirement 1: Confirmation Dialogs for Destructive Actions

**User Story**: As a user, I want a confirmation prompt before "Start blank" or "Load sample" replaces my current resume, so I don't accidentally lose my work.

### Acceptance Criteria

1.1 Clicking "Start blank" opens a confirmation dialog before clearing the resume.
1.2 Clicking "Load sample" opens a confirmation dialog before replacing the resume.
1.3 Clicking "Cancel" in the dialog leaves the resume unchanged.
1.4 Clicking "Confirm" in the dialog performs the destructive action.
1.5 Pressing Escape or clicking outside the dialog cancels the action.

---

## Requirement 2: Page-Break CSS Fix for Bullet Lists

**User Story**: As a user printing my resume to PDF, I want bullet list items to stay together on a page so entries don't split awkwardly across page breaks.

### Acceptance Criteria

2.1 Each `<li>` element inside the resume preview has `page-break-inside: avoid` (or `break-inside: avoid`) applied.
2.2 Each `<article>` entry block (work experience, education, project) has `break-inside: avoid` applied.
2.3 The fix applies to all three templates (Classic, Split, Compact).

---

## Requirement 3: isCurrent Field for Education Entries

**User Story**: As a user currently enrolled in a program, I want to mark an education entry as ongoing so the end date shows "Present" instead of a blank.

### Acceptance Criteria

3.1 `ResumeEducation` has an `isCurrent: boolean` field (default `false`).
3.2 The education editor shows a "Currently enrolled" checkbox.
3.3 When `isCurrent` is `true`, the end date input is disabled.
3.4 The preview renders "Present" as the end date when `isCurrent` is `true`.
3.5 `createEmptyEducation()` returns `isCurrent: false`.

---

## Requirement 4: GitHub and Twitter/X Fields in Personal Details

**User Story**: As a developer or public figure, I want to include my GitHub and Twitter/X profile links in my resume's contact section.

### Acceptance Criteria

4.1 `ResumePersonalDetails` has `github: string` and `twitter: string` fields (default empty string).
4.2 The personal details editor shows "GitHub" and "Twitter / X" input fields.
4.3 Non-empty `github` and `twitter` values appear in the preview's contact section.
4.4 `createEmptyResumeDocument()` and `createSampleResumeDocument()` include these fields.

---

## Requirement 5: Section Collapse/Expand in the Editor

**User Story**: As a user with a long resume, I want to collapse editor sections I'm not currently editing to reduce scrolling.

### Acceptance Criteria

5.1 Each editor section (Personal Details, Summary, Work Experience, Education, Skills & Languages, Projects & Certifications, Custom Sections) has a collapse/expand toggle in its header.
5.2 Clicking the toggle hides or shows the section body with a smooth transition.
5.3 All sections are expanded by default.
5.4 A collapsed section header shows the section title and an entry count badge where applicable.

---

## Requirement 6: Custom Color Picker for Accent Color

**User Story**: As a user, I want to pick any accent color for my resume, not just the six preset swatches.

### Acceptance Criteria

6.1 A native `<input type="color">` is rendered alongside the preset swatches.
6.2 Selecting a color from the picker updates `settings.accentColor`.
6.3 Selecting a preset swatch still works as before.
6.4 The active color (preset or custom) is visually highlighted.

---

## Requirement 7: Skills Tag-Input Chip UI

**User Story**: As a user, I want to add skills as individual chips by typing and pressing Enter or comma, and remove them with ×, instead of editing a plain textarea.

### Acceptance Criteria

7.1 The skills textarea is replaced by a chip/tag input component.
7.2 Pressing Enter or comma commits the current input as a new skill chip.
7.3 Clicking × on a chip removes that skill.
7.4 Pressing Backspace on an empty input removes the last skill chip.
7.5 Duplicate skills (case-insensitive) are not added.
7.6 Leading/trailing whitespace is trimmed from each skill before adding.
7.7 The underlying `resume.skills` array is kept in sync with the chip UI.

---

## Requirement 8: Independent Preview Scrolling

**User Story**: As a user on a large screen, I want the preview panel to scroll independently from the editor so I can always see the preview while editing.

### Acceptance Criteria

8.1 On `xl` breakpoint and above, the preview panel is sticky and scrolls independently within a fixed-height container.
8.2 The editor panel scrolls normally without affecting the preview scroll position.
8.3 On smaller screens (below `xl`), the preview appears below the editor and scrolls with the page as before.

---

## Requirement 9: Character Count Hint for Summary Field

**User Story**: As a user, I want to see a character count and sentence count hint below the summary field so I know if my summary is an appropriate length.

### Acceptance Criteria

9.1 Below the summary textarea, a hint line shows the current sentence count and character count.
9.2 The hint format is: `"{N} sentences / {M} chars — recruiters prefer 3–5 sentences"`.
9.3 The hint updates in real time as the user types.
9.4 When the summary is empty, the hint shows `"0 sentences / 0 chars — recruiters prefer 3–5 sentences"`.
9.5 Sentence count is computed by splitting on `.`, `!`, or `?` followed by whitespace or end-of-string, filtering empty segments.

---

## Requirement 10: Font Family Options

**User Story**: As a user, I want to choose a font family for my resume preview so I can match my personal style.

### Acceptance Criteria

10.1 `ResumeBuilderSettings` has a `fontFamily: FontFamily` field where `FontFamily = "inter" | "georgia" | "mono"`.
10.2 The Template & Style editor shows three font family options: Inter (sans-serif), Georgia (serif), Mono.
10.3 The selected font family is applied to the resume preview via inline `fontFamily` CSS.
10.4 The default font family is `"inter"`.
10.5 `createEmptyResumeDocument()` returns `fontFamily: "inter"`.

---

## Requirement 11: Drag-and-Drop Reordering for Entries

**User Story**: As a user, I want to drag and drop entries within a section (e.g. work experience jobs) to reorder them without using Up/Down buttons.

### Acceptance Criteria

11.1 Each entry within Work Experience, Education, Projects, Certifications, Languages, and Custom Sections has a drag handle.
11.2 Dragging an entry and dropping it on another position reorders the entries in that section.
11.3 The reorder is reflected immediately in both the editor and the preview.
11.4 The reorder is pushed to the undo stack.
11.5 The existing Up/Down buttons remain as a fallback.

---

## Requirement 12: Section Reordering

**User Story**: As a user, I want to reorder entire resume sections (e.g. move Education above Work Experience) to customise the layout.

### Acceptance Criteria

12.1 `ResumeBuilderSettings` has a `sectionOrder: SectionKey[]` field listing the ordered section identifiers.
12.2 The Template & Style editor shows a draggable list of section names.
12.3 Dragging a section name to a new position updates `settings.sectionOrder`.
12.4 The preview renders sections in the order defined by `sectionOrder`.
12.5 `createEmptyResumeDocument()` returns a default `sectionOrder` covering all sections.
12.6 When loading an older saved resume without `sectionOrder`, the default order is applied.

---

## Requirement 13: Undo/Redo Support

**User Story**: As a user, I want to undo and redo resume edits with Ctrl+Z / Ctrl+Y so I can recover from mistakes.

### Acceptance Criteria

13.1 Pressing Ctrl+Z (or Cmd+Z on Mac) undoes the last resume edit.
13.2 Pressing Ctrl+Y (or Cmd+Shift+Z on Mac) redoes the last undone edit.
13.3 The undo history is capped at 50 snapshots; older snapshots are dropped.
13.4 Any new edit after an undo clears the redo stack.
13.5 Undo/redo state is not persisted to localStorage (session-only).
13.6 Undo/redo is not available when the respective stack is empty (no error thrown).

---

## Requirement 14: Project Start/End Dates

**User Story**: As a user, I want to add start and end dates to my project entries so recruiters can see when I worked on them.

### Acceptance Criteria

14.1 `ResumeProject` has `startDate: string` and `endDate: string` fields (default empty string).
14.2 The project editor shows "Start date" and "End date" month inputs.
14.3 Non-empty dates are rendered in the preview alongside the project name.
14.4 `createEmptyProject()` returns `startDate: ""` and `endDate: ""`.

---

## Requirement 15: ATS Tips Panel

**User Story**: As a user, I want access to a collapsible ATS tips panel so I can improve my resume's compatibility with applicant tracking systems.

### Acceptance Criteria

15.1 An ATS Tips panel is rendered in the editor area (below the toolbar or as a sidebar).
15.2 The panel is collapsible; its open/closed state persists in localStorage.
15.3 The panel contains at least the following tips:
  - Use action verbs to start each bullet point
  - Quantify achievements with numbers and percentages
  - Avoid tables, columns, and text boxes for ATS compatibility
  - Match keywords from the job description
  - Keep formatting simple — no headers/footers, no images in text flow
  - Use standard section headings (Experience, Education, Skills)
15.4 The panel is visible only in the editor view (hidden on print).
