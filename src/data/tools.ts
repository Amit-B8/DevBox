export type Category =
  | "Common Dev"
  | "Hardware & Systems"
  | "Media & Assets"
  | "Data & Text";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  href: string;
}

export const categories: Category[] = [
  "Common Dev",
  "Hardware & Systems",
  "Media & Assets",
  "Data & Text",
];