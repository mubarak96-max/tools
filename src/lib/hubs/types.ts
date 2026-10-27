export type HubFaq = {
  question: string;
  answer: string;
};

export type HubGroup = {
  heading: string;
  intro: string;
  hrefs: string[];
};

export type HubLink = {
  title: string;
  href: string;
};

export type HubContent = {
  path: string;
  label: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  notice?: string;
  intro: string[];
  groups: HubGroup[];
  methodology: {
    heading: string;
    points: Array<{ title: string; body: string }>;
  };
  guides?: HubLink[];
  faqs: HubFaq[];
};
