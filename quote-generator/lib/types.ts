export interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    full: string;
    raw: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
  width: number;
  height: number;
}

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
}

export interface StyleOptions {
  overlayOpacity: number;
  overlayColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  textAlign: "left" | "center" | "right";
  textPosition: "top" | "center" | "bottom";
  showAuthor: boolean;
  quoteStyle: "minimal" | "boxed" | "underline" | "serif-large";
}

export type Tab = "unsplash" | "custom";
export type QuoteTab = "search" | "custom";
