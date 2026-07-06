/**
 * Langa Bouri — Campaign Theme Configuration
 *
 * Each theme targets a different domain (culture, sport, nature, history…).
 * Only a handful of design tokens change; the rest of the design system
 * remains consistent so the brand identity is preserved.
 */

export type ThemeId = "culture" | "sport" | "nature" | "histoire" | "science" | "gastronomie"

export type ThemeConfig = {
  id: ThemeId
  label: string
  /** Lucide icon name used by the ThemeIcon helper */
  iconName: "landmark" | "trophy" | "tree-pine" | "scroll" | "atom" | "utensils-crossed"
  description: string
  /** Override CSS custom properties applied to :root */
  cssVars: {
    "--accent": string
    "--accent-foreground": string
    "--gold": string
    "--gold-foreground": string
    "--wood": string
    "--ember": string
    "--quest": string
    "--primary": string
    "--primary-foreground": string
  }
  /** Tailwind class added to <body> for theme-specific overrides */
  bodyClass: string
  /** Decorative keywords shown on map/cards */
  decorKeywords: string[]
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  culture: {
    id: "culture",
    label: "Culture & Patrimoine",
    iconName: "landmark",
    description: "Masques, tambours, griots — l'héritage sénégalais",
    cssVars: {
      "--accent":            "oklch(0.68 0.16 60)",
      "--accent-foreground": "oklch(0.12 0.03 48)",
      "--gold":              "oklch(0.72 0.15 72)",
      "--gold-foreground":   "oklch(0.14 0.03 48)",
      "--wood":              "oklch(0.26 0.04 48)",
      "--ember":             "oklch(0.58 0.20 35)",
      "--quest":             "oklch(0.56 0.12 195)",
      "--primary":           "oklch(0.22 0.03 48)",
      "--primary-foreground":"oklch(0.97 0.005 80)",
    },
    bodyClass: "theme-culture",
    decorKeywords: ["Griot", "Baobab", "Cauri", "Masque", "Kora"],
  },
  sport: {
    id: "sport",
    label: "Sport & Performance",
    iconName: "trophy",
    description: "Terrain, chronomètre, trophées — la compétition est reine",
    cssVars: {
      "--accent":            "oklch(0.65 0.18 145)",
      "--accent-foreground": "oklch(0.97 0.01 145)",
      "--gold":              "oklch(0.72 0.18 140)",
      "--gold-foreground":   "oklch(0.15 0.02 145)",
      "--wood":              "oklch(0.22 0.05 145)",
      "--ember":             "oklch(0.55 0.22 18)",
      "--quest":             "oklch(0.60 0.14 230)",
      "--primary":           "oklch(0.16 0.04 145)",
      "--primary-foreground":"oklch(0.96 0.01 145)",
    },
    bodyClass: "theme-sport",
    decorKeywords: ["Sprint", "Stade", "Chrono", "Trophée", "Arbitre"],
  },
  nature: {
    id: "nature",
    label: "Nature & Aventure",
    iconName: "tree-pine",
    description: "Forêts, rivières, faune — la terre sénégalaise en plein air",
    cssVars: {
      "--accent":            "oklch(0.62 0.14 155)",
      "--accent-foreground": "oklch(0.97 0.01 155)",
      "--gold":              "oklch(0.70 0.13 100)",
      "--gold-foreground":   "oklch(0.20 0.04 100)",
      "--wood":              "oklch(0.24 0.06 120)",
      "--ember":             "oklch(0.52 0.15 55)",
      "--quest":             "oklch(0.56 0.12 200)",
      "--primary":           "oklch(0.18 0.05 130)",
      "--primary-foreground":"oklch(0.96 0.02 120)",
    },
    bodyClass: "theme-nature",
    decorKeywords: ["Savane", "Mangrove", "Saloum", "Faune", "Sentier"],
  },
  histoire: {
    id: "histoire",
    label: "Histoire & Civilisations",
    iconName: "scroll",
    description: "Forts, caravelles, cartes anciennes — les empires d'antan",
    cssVars: {
      "--accent":            "oklch(0.55 0.14 28)",
      "--accent-foreground": "oklch(0.96 0.02 82)",
      "--gold":              "oklch(0.68 0.10 70)",
      "--gold-foreground":   "oklch(0.22 0.04 52)",
      "--wood":              "oklch(0.22 0.05 38)",
      "--ember":             "oklch(0.48 0.18 22)",
      "--quest":             "oklch(0.50 0.12 190)",
      "--primary":           "oklch(0.20 0.04 35)",
      "--primary-foreground":"oklch(0.94 0.03 80)",
    },
    bodyClass: "theme-histoire",
    decorKeywords: ["Fort", "Caravelle", "Sceau", "Parchemin", "Château"],
  },
  science: {
    id: "science",
    label: "Science & Technologie",
    iconName: "atom",
    description: "Découvertes, énigmes logiques, innovation africaine",
    cssVars: {
      "--accent":            "oklch(0.60 0.18 240)",
      "--accent-foreground": "oklch(0.97 0.01 240)",
      "--gold":              "oklch(0.65 0.15 230)",
      "--gold-foreground":   "oklch(0.15 0.03 240)",
      "--wood":              "oklch(0.18 0.05 240)",
      "--ember":             "oklch(0.55 0.20 300)",
      "--quest":             "oklch(0.62 0.16 180)",
      "--primary":           "oklch(0.14 0.05 245)",
      "--primary-foreground":"oklch(0.97 0.01 240)",
    },
    bodyClass: "theme-science",
    decorKeywords: ["Laboratoire", "Code", "Étoiles", "Algorithme", "ADN"],
  },
  gastronomie: {
    id: "gastronomie",
    label: "Gastronomie & Saveurs",
    iconName: "utensils-crossed",
    description: "Thiéboudienne, mafé, bissap — la cuisine comme carte au trésor",
    cssVars: {
      "--accent":            "oklch(0.65 0.19 42)",
      "--accent-foreground": "oklch(0.15 0.05 42)",
      "--gold":              "oklch(0.72 0.17 55)",
      "--gold-foreground":   "oklch(0.18 0.04 52)",
      "--wood":              "oklch(0.26 0.06 30)",
      "--ember":             "oklch(0.58 0.22 28)",
      "--quest":             "oklch(0.58 0.12 165)",
      "--primary":           "oklch(0.20 0.06 30)",
      "--primary-foreground":"oklch(0.96 0.02 80)",
    },
    bodyClass: "theme-gastronomie",
    decorKeywords: ["Épices", "Thiébou", "Marché", "Saveur", "Recette"],
  },
}

export const DEFAULT_THEME: ThemeId = "culture"
