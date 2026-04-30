// GPA Calculator Library
// Supports: Unweighted (4.0), Weighted (5.0), Letter grade, Percentage
// Grade scales: US standard, plus common variants
//
// ─────────────────────────────────────────────────────────────────
//
// UNWEIGHTED GPA SCALE (4.0):
//   A+  = 4.0   A  = 4.0   A- = 3.7
//   B+  = 3.3   B  = 3.0   B- = 2.7
//   C+  = 2.3   C  = 2.0   C- = 1.7
//   D+  = 1.3   D  = 1.0   D- = 0.7
//   F   = 0.0
//
// WEIGHTED GPA SCALE (adds bonus for course difficulty):
//   Honors:           +0.5 per grade point
//   AP / IB / Dual:  +1.0 per grade point
//   Regular:          no bonus
//
// PERCENTAGE TO LETTER GRADE (US standard):
//   97-100 = A+    93-96 = A    90-92 = A-
//   87-89  = B+    83-86 = B    80-82 = B-
//   77-79  = C+    73-76 = C    70-72 = C-
//   67-69  = D+    63-66 = D    60-62 = D-
//   0-59   = F
//
// GPA TO PERCENTAGE (approximate reverse conversion):
//   4.0 = 97-100%   3.7 = 93-96%   3.3 = 90-92%
//   3.0 = 87-89%    2.7 = 83-86%   2.3 = 80-82%
//   2.0 = 77-79%    1.7 = 73-76%   1.3 = 70-72%
//   1.0 = 67-69%    0.7 = 63-66%   0.0 = below 60%
//
// ─────────────────────────────────────────────────────────────────

export type LetterGrade =
  | "A+" | "A" | "A-"
  | "B+" | "B" | "B-"
  | "C+" | "C" | "C-"
  | "D+" | "D" | "D-"
  | "F";

export type CourseLevel = "regular" | "honors" | "ap_ib";

export interface GradePoint {
  letter: LetterGrade;
  unweighted: number;
  weighted: {
    regular: number;
    honors: number;
    ap_ib: number;
  };
  percentageRange: string;
  midPct: number; // midpoint percentage for conversions
}

export const GRADE_SCALE: GradePoint[] = [
  { letter: "A+", unweighted: 4.0, weighted: { regular: 4.0, honors: 4.5, ap_ib: 5.0 }, percentageRange: "97–100%", midPct: 98.5 },
  { letter: "A",  unweighted: 4.0, weighted: { regular: 4.0, honors: 4.5, ap_ib: 5.0 }, percentageRange: "93–96%",  midPct: 94.5 },
  { letter: "A-", unweighted: 3.7, weighted: { regular: 3.7, honors: 4.2, ap_ib: 4.7 }, percentageRange: "90–92%",  midPct: 91.0 },
  { letter: "B+", unweighted: 3.3, weighted: { regular: 3.3, honors: 3.8, ap_ib: 4.3 }, percentageRange: "87–89%",  midPct: 88.0 },
  { letter: "B",  unweighted: 3.0, weighted: { regular: 3.0, honors: 3.5, ap_ib: 4.0 }, percentageRange: "83–86%",  midPct: 84.5 },
  { letter: "B-", unweighted: 2.7, weighted: { regular: 2.7, honors: 3.2, ap_ib: 3.7 }, percentageRange: "80–82%",  midPct: 81.0 },
  { letter: "C+", unweighted: 2.3, weighted: { regular: 2.3, honors: 2.8, ap_ib: 3.3 }, percentageRange: "77–79%",  midPct: 78.0 },
  { letter: "C",  unweighted: 2.0, weighted: { regular: 2.0, honors: 2.5, ap_ib: 3.0 }, percentageRange: "73–76%",  midPct: 74.5 },
  { letter: "C-", unweighted: 1.7, weighted: { regular: 1.7, honors: 2.2, ap_ib: 2.7 }, percentageRange: "70–72%",  midPct: 71.0 },
  { letter: "D+", unweighted: 1.3, weighted: { regular: 1.3, honors: 1.8, ap_ib: 2.3 }, percentageRange: "67–69%",  midPct: 68.0 },
  { letter: "D",  unweighted: 1.0, weighted: { regular: 1.0, honors: 1.5, ap_ib: 2.0 }, percentageRange: "63–66%",  midPct: 64.5 },
  { letter: "D-", unweighted: 0.7, weighted: { regular: 0.7, honors: 1.2, ap_ib: 1.7 }, percentageRange: "60–62%",  midPct: 61.0 },
  { letter: "F",  unweighted: 0.0, weighted: { regular: 0.0, honors: 0.0, ap_ib: 0.0 }, percentageRange: "0–59%",   midPct: 30.0 },
];

export const LETTER_GRADES: LetterGrade[] = [
  "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"
];

// ── Conversions ────────────────────────────────────────────────────

export function letterToGradePoint(letter: LetterGrade): GradePoint {
  return GRADE_SCALE.find(g => g.letter === letter)!;
}

export function percentageToLetter(pct: number): LetterGrade {
  if (pct >= 97)      return "A+";
  if (pct >= 93)      return "A";
  if (pct >= 90)      return "A-";
  if (pct >= 87)      return "B+";
  if (pct >= 83)      return "B";
  if (pct >= 80)      return "B-";
  if (pct >= 77)      return "C+";
  if (pct >= 73)      return "C";
  if (pct >= 70)      return "C-";
  if (pct >= 67)      return "D+";
  if (pct >= 63)      return "D";
  if (pct >= 60)      return "D-";
  return "F";
}

export function gpaToPercentage(gpa: number): string {
  if (gpa >= 4.0)  return "97–100%";
  if (gpa >= 3.9)  return "93–96%";
  if (gpa >= 3.7)  return "90–92%";
  if (gpa >= 3.5)  return "87–89%";
  if (gpa >= 3.0)  return "83–86%";
  if (gpa >= 2.7)  return "80–82%";
  if (gpa >= 2.3)  return "77–79%";
  if (gpa >= 2.0)  return "73–76%";
  if (gpa >= 1.7)  return "70–72%";
  if (gpa >= 1.3)  return "67–69%";
  if (gpa >= 1.0)  return "63–66%";
  if (gpa >= 0.7)  return "60–62%";
  return "Below 60%";
}

export function gpa4ToGpa5(gpa4: number): number {
  // Approximate — weighted scale
  return Math.min(5.0, gpa4 * 1.25);
}

// ── Course / semester row ─────────────────────────────────────────

export interface CourseRow {
  id: string;
  name: string;
  grade: LetterGrade | "";
  credits: number;          // credit hours (e.g. 1, 0.5, 3, 4)
  level: CourseLevel;
  percentage?: number;      // optional — if entered instead of letter grade
}

// ── Semester ──────────────────────────────────────────────────────

export interface Semester {
  id: string;
  name: string;             // e.g. "9th Grade - Fall"
  courses: CourseRow[];
}

// ── Calculation result ────────────────────────────────────────────

export interface GpaResult {
  unweightedGpa: number;
  weightedGpa: number;
  totalCredits: number;
  totalGradePoints: number;  // unweighted
  totalWeightedPoints: number;
  courseCount: number;
  percentageEquivalent: string;
  letterEquivalent: LetterGrade | "";
  // Per-grade distribution
  gradeDistribution: Record<LetterGrade, number>;
}

export interface SemesterGpaResult extends GpaResult {
  semesterId: string;
  semesterName: string;
}

export interface CumulativeGpaResult {
  semesterResults: SemesterGpaResult[];
  cumulative: GpaResult;
}

// ── Core GPA calculation ──────────────────────────────────────────

export function calcGpa(courses: CourseRow[]): GpaResult {
  const validCourses = courses.filter(c => c.grade !== "");

  let totalCredits         = 0;
  let totalGradePoints     = 0;
  let totalWeightedPoints  = 0;
  const distribution: Record<LetterGrade, number> = {} as any;
  LETTER_GRADES.forEach(l => (distribution[l] = 0));

  for (const course of validCourses) {
    const gp = letterToGradePoint(course.grade as LetterGrade);
    totalCredits         += course.credits;
    totalGradePoints     += gp.unweighted * course.credits;
    totalWeightedPoints  += gp.weighted[course.level] * course.credits;
    distribution[course.grade as LetterGrade]++;
  }

  const unweightedGpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  const weightedGpa   = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
  const letter = unweightedGpa > 0
    ? percentageToLetter(unweightedGpa >= 4.0 ? 97 : unweightedGpa * 25) as LetterGrade | ""
    : "";

  return {
    unweightedGpa:   Math.round(unweightedGpa * 1000) / 1000,
    weightedGpa:     Math.round(weightedGpa * 1000) / 1000,
    totalCredits,
    totalGradePoints:      Math.round(totalGradePoints * 100) / 100,
    totalWeightedPoints:   Math.round(totalWeightedPoints * 100) / 100,
    courseCount:     validCourses.length,
    percentageEquivalent: gpaToPercentage(unweightedGpa),
    letterEquivalent: letter,
    gradeDistribution: distribution,
  };
}

export function calcCumulativeGpa(semesters: Semester[]): CumulativeGpaResult {
  const semesterResults: SemesterGpaResult[] = semesters.map(sem => ({
    semesterId:   sem.id,
    semesterName: sem.name,
    ...calcGpa(sem.courses),
  }));

  const allCourses = semesters.flatMap(s => s.courses);
  const cumulative = calcGpa(allCourses);

  return { semesterResults, cumulative };
}

// ── GPA Scale reference ───────────────────────────────────────────

export function getGpaColour(gpa: number): string {
  if (gpa >= 3.7) return "emerald";
  if (gpa >= 3.0) return "green";
  if (gpa >= 2.3) return "yellow";
  if (gpa >= 1.7) return "orange";
  if (gpa >= 1.0) return "red";
  return "stone";
}

// What GPA do I need? (target calculator)
export function calcRequiredGpa(
  currentGpa: number,
  currentCredits: number,
  targetGpa: number,
  remainingCredits: number,
): number {
  // target = (currentGpa * currentCredits + requiredGpa * remaining) / total
  // requiredGpa = (target * total - currentGpa * currentCredits) / remaining
  if (remainingCredits <= 0) return 0;
  const total    = currentCredits + remainingCredits;
  const required = (targetGpa * total - currentGpa * currentCredits) / remainingCredits;
  return Math.round(required * 100) / 100;
}

// Standard ID generator
export const newId = () => Math.random().toString(36).slice(2, 9);
