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

export const toolsData: Tool[] = [
  // Hardware & Systems (For CSE/ECE)
  { id: "hex-ascii", name: "Hex/Binary/ASCII Converter", description: "Convert between low-level data formats.", category: "Hardware & Systems", href: "/tools/hex-ascii" },
  { id: "epoch", name: "Epoch Converter", description: "Convert Unix timestamps to human-readable dates.", category: "Hardware & Systems", href: "/tools/epoch" },
  { id: "cron", name: "Cron Generator", description: "Create and understand cron expressions.", category: "Hardware & Systems", href: "/tools/cron" },
  
  // Common Dev
  { id: "json-prettifier", name: "JSON Prettifier", description: "Format, validate, and inspect JSON payloads.", category: "Common Dev", href: "/tools/json-prettifier" },
  { id: "jwt", name: "JWT Inspector", description: "Decode and inspect JWT tokens.", category: "Common Dev", href: "/tools/jwt" },
  { id: "regex", name: "Regex Tester", description: "Build and test regular expressions.", category: "Common Dev", href: "/tools/regex" },
  { id: "uuid", name: "UUID Generator", description: "Generate secure randomized UUIDs.", category: "Common Dev", href: "/tools/uuid" },

  // Media & Assets
  { id: "image-converter", name: "Image Converter", description: "Convert PNG to JPG and resize images.", category: "Media & Assets", href: "/tools/image-converter" },
  { id: "svg-optimizer", name: "SVG Optimizer", description: "Compress and clean up SVG files.", category: "Media & Assets", href: "/tools/svg-optimizer" },
  { id: "color-converter", name: "Color Converter", description: "Translate HEX codes to RGB and HSL.", category: "Media & Assets", href: "/tools/color-converter" },

  // Data & Text
  { id: "base64", name: "Base64 Encoder", description: "Encode and decode text on the fly.", category: "Data & Text", href: "/tools/base64" },
  { id: "markdown", name: "Markdown Previewer", description: "Render Markdown live into HTML.", category: "Data & Text", href: "/tools/markdown" },
  { id: "diff", name: "Diff Checker", description: "Compare two strings or files for differences.", category: "Data & Text", href: "/tools/diff" }
];

export const categories: Category[] = ["Common Dev", "Hardware & Systems", "Media & Assets", "Data & Text"];