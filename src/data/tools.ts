import { LucideIcon, Code2, Zap, Lock, FileJson, Database, Binary, Eye, Palette, Image, Shield, TrendingUp, Ruler, Activity, FileStack } from 'lucide-react';

/**
 * Discipline Groups for Tool Organization
 */
export type Discipline = 
  | "Computer Science" 
  | "Electrical & Embedded" 
  | "Mechanical & Aerospace" 
  | "Mathematics"
  | "Medical Sciences"
  | "Finance & Economics"
  | "Creative & Design"
  | "Research & Academic"
  | "General Utilities";

/**
 * Tool Structure with Icon Reference
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  discipline: Discipline;
  subcategory?: string;
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
    href: "/engineering/ece/logic-simulator",
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
    href: "/engineering/mechanical/thermal-calculator",
    icon: Palette,
  },

  // ==================== MATHEMATICS ====================
  {
    id: "basic-calculator",
    name: "Basic Calculator",
    description: "Perform quick arithmetic for everyday calculations and simple number work.",
    discipline: "Mathematics",
    href: "/mathematics/basic-calculator",
    icon: Binary,
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
    subcategory: "Ophthalmology & Optometry",
    href: "/medical/visual-acuity",
    icon: Activity,
  },
  {
    id: "iol-power-calculator",
    name: "IOL Power & Focal Length Calculator",
    description: "Estimate approximate lens power and focal length values for ophthalmology research workflows.",
    discipline: "Medical Sciences",
    subcategory: "Ophthalmology & Optometry",
    href: "/medical/iol-power",
    icon: Activity,
  },
  {
    id: "iv-drip-rate-calculator",
    name: "IV Drip Rate Calculator",
    description: "Calculate infusion rates in mL/hr and gtt/min for common nursing workflows.",
    discipline: "Medical Sciences",
    subcategory: "Nursing",
    href: "/medical/iv-drip-rate",
    icon: Activity,
  },
  {
    id: "bsa-calculator",
    name: "Body Surface Area Calculator",
    description: "Estimate BSA using the Mosteller formula for dosing and perioperative planning.",
    discipline: "Medical Sciences",
    subcategory: "Surgery",
    href: "/medical/bsa-calculator",
    icon: Activity,
  },

  // ==================== FINANCE & ECONOMICS ====================
  {
    id: "student-budget",
    name: "Student Budget Calculator",
    description: "Plan monthly income, rent, groceries, tuition, and savings to see what is left or spot a shortfall.",
    discipline: "Finance & Economics",
    href: "/finance/student-budget",
    icon: TrendingUp,
  },
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

  // ==================== RESEARCH & ACADEMIC ====================
  {
    id: "pdf-combiner",
    name: "PDF Combiner",
    description: "Combine up to 10 PDF documents into a single ordered file in your browser.",
    discipline: "Research & Academic",
    href: "/research/pdf-combiner",
    icon: FileStack,
  },
];

/**
 * Discipline Hubs for Landing Page
 */
export const disciplineHubs: DisciplineHub[] = [
  {
    id: "engineering",
    name: "Engineering Tools",
    slug: "engineering",
    description: "Hardware utilities, system converters, and data parsers for engineering disciplines.",
    icon: Code2,
  },
  {
    id: "mathematics",
    name: "Mathematics Tools",
    slug: "mathematics",
    description: "Arithmetic, calculus, and matrix tools for technical calculations and education.",
    icon: Binary,
  },
  {
    id: "medical",
    name: "Medical Tools",
    slug: "medical",
    description: "Clinical calculators, dose converters, and diagnostic utilities for healthcare professionals.",
    icon: Shield,
  },
  {
    id: "finance",
    name: "Finance Tools",
    slug: "finance",
    description: "ROI calculators, currency conversions, and economic analysis utilities.",
    icon: Zap,
  },
  {
    id: "creative",
    name: "Creative Tools",
    slug: "creative",
    description: "Image processing, color formatting, and asset converters for design professionals.",
    icon: Palette,
  },
  {
    id: "research",
    name: "Research & Academic Tools",
    slug: "research",
    description: "Citation generators, data aggregators, and document processing utilities for researchers.",
    icon: FileStack,
  },
  {
    id: "utilities",
    name: "Utilities Tools",
    slug: "utilities",
    description: "Everyday utilities, password generators, and secure data formatters.",
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

export function formatToolCount(count: number): string {
  return `${count} ${count === 1 ? 'tool' : 'tools'}`;
}
