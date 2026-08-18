export type CategoryType = 'All' | 'Outerwear' | 'Tailoring' | 'Knitwear' | 'Footwear' | 'Accessories' | 'Custom';

export type SupportedLocale = 'en' | 'fr' | 'it' | 'ja' | 'es';

export interface AssetItem {
  id: string;
  title: string;
  category: CategoryType;
  imageUrl: string;
  tags: string[];
  colorPalette: string[]; // e.g. ["#2C302E", "#4A4E4D", "#0E1111"]
  fabric?: string;
  sku?: string;
}

export type SpreadLayoutType =
  | 'cover-spread'
  | 'single-hero'
  | 'editorial-duo'
  | 'triptych-grid'
  | 'catalogue-quad'
  | 'quote-accent';

export interface Hotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  sku?: string;
  url?: string;
}

export interface ImageSlot {
  slotId: string;
  assetId: string | null;
  customCaption?: string;
  zoom?: number; // scale 1 to 2
  objectPosition?: string; // e.g. "center center", "top center"
  hotspots?: Hotspot[];
}

export interface SpreadPage {
  id: string;
  pageNumber: number;
  layout: SpreadLayoutType;
  title: string;
  subtitle: string;
  lookNumber: string;
  quote?: string;
  notes?: string;
  bgColor: string; // e.g. "#FFFFFF", "#FAF9F5", "#121212", "#EFECE6"
  textColor?: string; // e.g. "#111111", "#F5F5F5"
  slots: ImageSlot[];
}

export type ThemePreset = 'minimal-light' | 'high-fashion-dark' | 'warm-atelier' | 'architectural-mono';

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  color: string;
  activeSpreadIndex: number;
}

export interface LookbookProject {
  id: string;
  title: string;
  season: string;
  brand: string;
  designer: string;
  year: string;
  locale: SupportedLocale;
  themePreset: ThemePreset;
  spreads: SpreadPage[];
  assets: AssetItem[];
  collaborators?: Collaborator[];
}

export interface CommerceProduct {
  sku: string;
  title: string;
  category: CategoryType;
  imageUrl: string;
  fabric: string;
  tags: string[];
}
