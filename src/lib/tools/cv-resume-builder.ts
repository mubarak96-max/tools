export const CV_RESUME_BUILDER_STORAGE_KEY = "findmytool.free-cv-resume-builder.v1";

export type ResumeTemplate = "classic" | "split" | "compact";

export interface ResumePersonalDetails {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedIn: string;
  photoDataUrl: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bulletsText: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  qualification: string;
  location: string;
  startDate: string;
  endDate: string;
  notesText: string;
}

export interface ResumeLanguage {
  id: string;
  name: string;
  level: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  link: string;
  summary: string;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeCustomSection {
  id: string;
  title: string;
  itemsText: string;
}

export interface ResumeBuilderSettings {
  template: ResumeTemplate;
  accentColor: string;
  fontScale: number;
  showPhoto: boolean;
  showSummary: boolean;
  showSkills: boolean;
  showLanguages: boolean;
  showProjects: boolean;
  showCertifications: boolean;
  showCustomSections: boolean;
}

export interface ResumeDocument {
  personalDetails: ResumePersonalDetails;
  summary: string;
  workExperience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  languages: ResumeLanguage[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  customSections: ResumeCustomSection[];
  settings: ResumeBuilderSettings;
  updatedAt: string;
}

let sequence = 0;

export function createResumeId(prefix: string) {
  sequence += 1;
  return `${prefix}-${Date.now()}-${sequence}`;
}

export function createEmptyExperience(): ResumeExperience {
  return {
    id: createResumeId("exp"),
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    bulletsText: "",
  };
}

export function createEmptyEducation(): ResumeEducation {
  return {
    id: createResumeId("edu"),
    institution: "",
    qualification: "",
    location: "",
    startDate: "",
    endDate: "",
    notesText: "",
  };
}

export function createEmptyLanguage(): ResumeLanguage {
  return {
    id: createResumeId("lang"),
    name: "",
    level: "",
  };
}

export function createEmptyProject(): ResumeProject {
  return {
    id: createResumeId("proj"),
    name: "",
    link: "",
    summary: "",
  };
}

export function createEmptyCertification(): ResumeCertification {
  return {
    id: createResumeId("cert"),
    name: "",
    issuer: "",
    year: "",
  };
}

export function createEmptyCustomSection(): ResumeCustomSection {
  return {
    id: createResumeId("custom"),
    title: "",
    itemsText: "",
  };
}

export function createEmptyResumeDocument(): ResumeDocument {
  return {
    personalDetails: {
      fullName: "",
      role: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedIn: "",
      photoDataUrl: "",
    },
    summary: "",
    workExperience: [createEmptyExperience()],
    education: [createEmptyEducation()],
    skills: [],
    languages: [createEmptyLanguage()],
    projects: [createEmptyProject()],
    certifications: [createEmptyCertification()],
    customSections: [],
    settings: {
      template: "classic",
      accentColor: "#2563EB",
      fontScale: 100,
      showPhoto: true,
      showSummary: true,
      showSkills: true,
      showLanguages: true,
      showProjects: true,
      showCertifications: true,
      showCustomSections: true,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function createSampleResumeDocument(): ResumeDocument {
  return {
    personalDetails: {
      fullName: "Avery Morgan",
      role: "Senior Product Designer",
      email: "avery.morgan@example.com",
      phone: "+1 (555) 203-4401",
      location: "Austin, Texas",
      website: "averymorgan.design",
      linkedIn: "linkedin.com/in/averymorgan",
      photoDataUrl: "",
    },
    summary:
      "Product designer with 7+ years of experience shaping B2B SaaS flows, simplifying complex onboarding journeys, and partnering closely with product and engineering teams to ship measurable improvements.",
    workExperience: [
      {
        id: createResumeId("exp"),
        company: "Northstar Cloud",
        role: "Senior Product Designer",
        location: "Austin, TX",
        startDate: "2022-02",
        endDate: "",
        isCurrent: true,
        bulletsText:
          "Led redesign of onboarding flow across web and mobile, reducing time-to-value by 31%.\nBuilt a reusable design system with engineering that cut UI delivery time across six product squads.\nRan customer interviews and usability tests to prioritize roadmap decisions with clear evidence.",
      },
      {
        id: createResumeId("exp"),
        company: "Brightline Studio",
        role: "Product Designer",
        location: "Remote",
        startDate: "2019-01",
        endDate: "2022-01",
        isCurrent: false,
        bulletsText:
          "Designed conversion-focused landing pages and self-serve flows for startup clients.\nCreated wireframes, prototypes, and interaction specs for responsive product launches.\nCollaborated with developers to improve design QA and accessibility standards.",
      },
    ],
    education: [
      {
        id: createResumeId("edu"),
        institution: "University of Washington",
        qualification: "B.A. in Interaction Design",
        location: "Seattle, WA",
        startDate: "2013-09",
        endDate: "2017-06",
        notesText: "Graduated with honors. Focus on human-centered design and digital product systems.",
      },
    ],
    skills: [
      "Product strategy",
      "UX research",
      "Wireframing",
      "Figma",
      "Design systems",
      "Prototyping",
      "Accessibility",
      "Stakeholder workshops",
    ],
    languages: [
      {
        id: createResumeId("lang"),
        name: "English",
        level: "Native",
      },
      {
        id: createResumeId("lang"),
        name: "Spanish",
        level: "Professional working proficiency",
      },
    ],
    projects: [
      {
        id: createResumeId("proj"),
        name: "Design System Rollout",
        link: "https://portfolio.example.com/design-system",
        summary:
          "Planned and launched a multi-team component system that standardized UI patterns across three core products.",
      },
    ],
    certifications: [
      {
        id: createResumeId("cert"),
        name: "Google UX Design Certificate",
        issuer: "Google",
        year: "2021",
      },
    ],
    customSections: [
      {
        id: createResumeId("custom"),
        title: "Highlights",
        itemsText:
          "Speaker at local product design meetups.\nMentored junior designers and interns.\nBuilt portfolio case studies with quantified business outcomes.",
      },
    ],
    settings: {
      template: "classic",
      accentColor: "#2563EB",
      fontScale: 100,
      showPhoto: true,
      showSummary: true,
      showSkills: true,
      showLanguages: true,
      showProjects: true,
      showCertifications: true,
      showCustomSections: true,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function splitSkills(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatResumeMonth(value: string) {
  if (!value) {
    return "";
  }

  const [year, month] = value.split("-");
  if (!year || !month) {
    return value;
  }

  const monthIndex = Number(month) - 1;
  const date = new Date(Number(year), monthIndex, 1);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatResumeRange(startDate: string, endDate: string, isCurrent = false) {
  const start = formatResumeMonth(startDate) || "Start date";
  const end = isCurrent ? "Present" : formatResumeMonth(endDate) || "End date";
  return `${start} - ${end}`;
}

export const CV_RESUME_TEMPLATE_OPTIONS: Array<{
  value: ResumeTemplate;
  label: string;
  description: string;
}> = [
  {
    value: "classic",
    label: "Classic",
    description: "Single-column layout focused on ATS readability.",
  },
  {
    value: "split",
    label: "Split",
    description: "Sidebar layout with contact details, skills, and languages separated.",
  },
  {
    value: "compact",
    label: "Compact",
    description: "Dense modern layout that fits more content on one page.",
  },
];

export const CV_RESUME_ACCENT_COLORS = [
  "#2563EB",
  "#0F766E",
  "#7C3AED",
  "#C2410C",
  "#BE123C",
  "#1F2937",
];
