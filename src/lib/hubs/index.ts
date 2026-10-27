import { aiHub } from "./ai";
import { constructionHub } from "./construction";
import { designHub } from "./design";
import { financeHub } from "./finance";
import { healthHub } from "./health";
import { imageHub } from "./image";
import { marketingHub } from "./marketing";
import { realEstateHub } from "./real-estate";
import { seoHub } from "./seo";
import { textHub } from "./text";
import { utilityHub } from "./utility";
import type { HubContent } from "./types";

export const ALL_HUBS: HubContent[] = [
  financeHub,
  realEstateHub,
  textHub,
  seoHub,
  marketingHub,
  designHub,
  imageHub,
  utilityHub,
  healthHub,
  constructionHub,
  aiHub,
];
