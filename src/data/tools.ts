import { LucideIcon, Code2, Zap, Lock, FileJson, Database, Binary, Eye, Palette, Image, Shield, TrendingUp, Ruler, Activity } from 'lucide-react';

/**
 * Discipline Groups for Tool Organization
 */
export type Discipline = 
  | "Computer Science" 
  | "Electrical & Embedded" 
  | "Mechanical & Aerospace" 
  | "Medical Sciences"
  | "Finance & Economics"
  | "Creative & Design"
  | "General Utilities";

/**
 * Tool Structure with Icon Reference
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  discipline: Discipline;
  href: string;
  icon: LucideIcon;
}

/**
 * Discipline Hub Structure
 */
export interface DisciplineHub {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
}

/**
 * All Available Tools Organized by Discipline
 */
export const tools: Tool[] = [
  // ==================== COMPUTER SCIENCE ====================
  {
    id: "jwt-inspector",
    name: "JWT Inspector",
    description: "Decode, verify, and inspect JSON Web Tokens with full payload analysis.",
    discipline: "Computer Science",
    href: "/engineering/jwt-inspector",
    icon: Lock,
  },
  {
    id: "json-markdown",
    name: "JSON ⇄ Markdown",
    description: "Convert JSON payloads into formatted Markdown tables and back again.",
    discipline: "Computer Science",
    href: "/engineering/json-markdown",
    icon: FileJson,
  },
  {
    id: "csv-to-json",
    name: "CSV to JSON",
    description: "Transform raw comma-separated spreadsheet data into structured JSON arrays.",
    discipline: "Computer Science",
    href: "/engineering/csv-to-json",
    icon: Database,
  },
  {
    id: "base-converter",
    name: "Base Converter",
    description: "Convert between decimal, hexadecimal, binary, and octal number systems.",
    discipline: "Computer Science",
    href: "/engineering/base-converter",
    icon: Binary,
  },

  // ==================== ELECTRICAL & EMBEDDED ====================
  {
    id: "bitwise-calculator",
    name: "Bitwise Calculator",
    description: "Perform bitwise operations (AND, OR, XOR, NOT) with visual bit displays.",
    discipline: "Electrical & Embedded",
    href: "/engineering/bitwise",
    icon: Zap,
  },
  {
    id: "logic-simulator",
    name: "Logic Simulator",
    description: "Simulate digital logic gates and circuits with truth tables.",
    discipline: "Electrical & Embedded",
    href: "/engineering/logic-simulator",
    icon: Code2,
  },
  {
    id: "resistor-decoder",
    name: "Resistor Decoder",
    description: "Decode 4-band resistor color codes to find resistance values in ohms.",
    discipline: "Electrical & Embedded",
    href: "/engineering/ece/resistor-decoder",
    icon: Zap,
  },

  // ==================== MECHANICAL & AEROSPACE ====================
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between imperial, metric, and SI units for engineering calculations.",
    discipline: "Mechanical & Aerospace",
    href: "/engineering/mechanical/unit-converter",
    icon: Ruler,
  },
  {
    id: "thermal-calc",
    name: "Thermal Calculator",
    description: "Calculate heat transfer, thermal resistance, and temperature conversions.",
    discipline: "Mechanical & Aerospace",
    href: "/engineering/thermal-calc",
    icon: Palette,
  },

  // ==================== GENERAL UTILITIES ====================
  {
    id: "image-converter",
    name: "Image Converter",
    description: "Convert between PNG, JPG, WebP formats and resize images with precision.",
    discipline: "General Utilities",
    href: "/utilities/image-converter",
    icon: Image,
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate cryptographically secure passwords with customizable complexity.",
    discipline: "General Utilities",
    href: "/utilities/password-generator",
    icon: Shield,
  },
  {
    id: "data-anonymizer",
    name: "Data Anonymizer",
    description: "Anonymize PII and sensitive data while maintaining data structure integrity.",
    discipline: "General Utilities",
    href: "/utilities/data-anonymizer",
    icon: Eye,
  },

  // ==================== MEDICAL SCIENCES ====================
  {
    id: "visual-acuity-converter",
    name: "Visual Acuity Converter",
    description: "Convert Snellen fractions to LogMAR values for ophthalmic research and clinical assessment.",
    discipline: "Medical Sciences",
    href: "/medical/visual-acuity",
    icon: Activity,
  },

  // ==================== FINANCE & ECONOMICS ====================
  {
    id: "roi-calculator",
    name: "ROI Calculator",
    description: "Calculate return on investment percentage from initial investment and final value.",
    discipline: "Finance & Economics",
    href: "/finance/roi-calculator",
    icon: TrendingUp,
  },

  // ==================== CREATIVE & DESIGN ====================
  {
    id: "color-converter",
    name: "HEX / RGB Color Converter",
    description: "Convert between HEX codes and RGB values with live color preview.",
    discipline: "Creative & Design",
    href: "/creative/color-converter",
    icon: Palette,
  },
];

/**
 * Discipline Hubs for Landing Page
 */
export const disciplineHubs: DisciplineHub[] = [
  {
    id: "engineering",
    name: "Engineering & Systems",
    slug: "engineering",
    description: "Developer tools, hardware utilities, and data converters for engineering disciplines including computer science, electrical systems, and mechanical engineering.",
    icon: Code2,
  },
  {
    id: "medical",
    name: "Medical Sciences",
    slug: "medical",
    description: "Clinical calculators, dose converters, and diagnostic tools for healthcare professionals and researchers.",
    icon: Shield,
  },
  {
    id: "finance",
    name: "Finance & Economics",
    slug: "finance",
    description: "Financial calculators, currency converters, and economic analysis tools for professionals.",
    icon: Zap,
  },
  {
    id: "creative",
    name: "Creative & Design",
    slug: "creative",
    description: "Image processing, color tools, and asset converters for creative professionals.",
    icon: Palette,
  },
  {
    id: "utilities",
    name: "General Utilities",
    slug: "utilities",
    description: "Everyday tools: password generators, data formatters, and text utilities for general use.",
    icon: FileJson,
  },
];

/**
 * Helper: Get Tools by Discipline
 */
export function getToolsByDiscipline(discipline: Discipline): Tool[] {
  return tools.filter((tool) => tool.discipline === discipline);
}

/**
 * Helper: Get All Disciplines with Tools
 */
export function getDisciplinesWithTools(): Array<{
  name: Discipline;
  tools: Tool[];
}> {
  const disciplineSet = new Set(tools.map((t) => t.discipline));
  return Array.from(disciplineSet).map((discipline) => ({
    name: discipline,
    tools: getToolsByDiscipline(discipline),
  }));
}