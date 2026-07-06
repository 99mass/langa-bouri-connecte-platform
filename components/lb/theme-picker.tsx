"use client"

import { useState } from "react"
import { Check, ChevronDown, Palette, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { THEMES, type ThemeId } from "@/lib/theme-config"
import { useTheme } from "@/lib/theme-context"
import { ThemeIcon } from "@/components/lb/theme-icon"

const themeList = Object.values(THEMES)

export function ThemePicker() {
  const { themeId, setTheme, theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<ThemeId | null>(null)

  const displayTheme = preview ? THEMES[preview] : theme

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        id="theme-picker-trigger"
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-card/80 px-3 py-1.5 font-sans text-xs font-semibold text-primary ring-1 ring-border/60 hover:ring-accent/60 transition-all hover:bg-card shadow-sm"
        aria-label="Changer le thème de campagne"
      >
        <Palette className="h-3.5 w-3.5 text-accent" />
        <ThemeIcon iconName={theme.iconName} className="h-3.5 w-3.5 text-accent" />
        <span className="uppercase tracking-wider">{theme.label.split(" ")[0]}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {/* ── Modal overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Choisir le thème de la campagne"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => { setOpen(false); setPreview(null) }}
          />

          {/* Sheet */}
          <div className="relative z-10 w-full max-w-md animate-unfurl">
            <div className="modern-card !rounded-b-none !rounded-t-2xl px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">

              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-base font-bold text-primary">Thème de la campagne</h2>
                  <p className="font-sans text-xs text-muted-foreground">Les couleurs et éléments s'adaptent automatiquement</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setOpen(false); setPreview(null) }}
                  className="rounded-full p-1.5 text-muted-foreground hover:text-primary hover:bg-muted/60 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Preview banner */}
              <div className="mb-4 flex items-center gap-3 modern-card !rounded-xl px-4 py-3 !shadow-none !border-accent/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `color-mix(in oklch, ${displayTheme.cssVars["--accent"]} 15%, transparent)` }}>
                  <ThemeIcon iconName={displayTheme.iconName} className="h-5 w-5" style={{ color: displayTheme.cssVars["--accent"] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-bold text-primary">{displayTheme.label}</p>
                  <p className="font-sans text-xs text-muted-foreground truncate">{displayTheme.description}</p>
                </div>
              </div>

              {/* Theme grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {themeList.map((t) => {
                  const isSelected = themeId === t.id
                  const isPreviewed = preview === t.id
                  return (
                    <button
                      key={t.id}
                      id={`theme-option-${t.id}`}
                      type="button"
                      onMouseEnter={() => setPreview(t.id)}
                      onMouseLeave={() => setPreview(null)}
                      onFocus={() => setPreview(t.id)}
                      onBlur={() => setPreview(null)}
                      onClick={() => { setTheme(t.id); setPreview(null); setOpen(false) }}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ring-1",
                        isSelected
                          ? "bg-accent/5 ring-accent/40 shadow-sm"
                          : isPreviewed
                          ? "bg-muted/50 ring-border/60"
                          : "bg-card ring-border/30 hover:ring-border/60"
                      )}
                      aria-pressed={isSelected}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `color-mix(in oklch, ${t.cssVars["--accent"]} 12%, transparent)` }}>
                        <ThemeIcon iconName={t.iconName} className="h-4 w-4" style={{ color: t.cssVars["--accent"] }} strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-xs font-semibold text-primary leading-tight">{t.label.split(" ")[0]}</p>
                        <p className="font-sans text-[10px] text-muted-foreground truncate">{t.label.split(" ").slice(1).join(" ")}</p>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
                    </button>
                  )
                })}
              </div>

              {/* Accent swatches */}
              <div className="flex items-center gap-2">
                <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Aperçu :</span>
                <div className="flex gap-1.5">
                  {themeList.map((t) => (
                    <button key={t.id} type="button"
                      onClick={() => { setTheme(t.id); setOpen(false) }}
                      title={t.label}
                      className={cn("h-5 w-5 rounded-full ring-1 transition-transform hover:scale-125",
                        themeId === t.id && "ring-2 scale-125"
                      )}
                      style={{ background: t.cssVars["--accent"] }}
                      aria-label={`Thème ${t.label}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
