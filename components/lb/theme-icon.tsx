"use client"

import {
  Landmark,
  Trophy,
  TreePine,
  Scroll,
  Atom,
  UtensilsCrossed,
  type LucideProps,
} from "lucide-react"
import type { ThemeConfig } from "@/lib/theme-config"

const iconMap: Record<ThemeConfig["iconName"], React.ComponentType<LucideProps>> = {
  "landmark":          Landmark,
  "trophy":            Trophy,
  "tree-pine":         TreePine,
  "scroll":            Scroll,
  "atom":              Atom,
  "utensils-crossed":  UtensilsCrossed,
}

export function ThemeIcon({
  iconName,
  ...props
}: { iconName: ThemeConfig["iconName"] } & LucideProps) {
  const Icon = iconMap[iconName]
  return <Icon {...props} />
}
