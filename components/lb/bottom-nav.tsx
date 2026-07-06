"use client"

import { Map as MapIcon, ScrollText, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"

export type Tab = "map" | "challenges" | "ranking" | "profile"

const items: { id: Tab; label: string; icon: typeof MapIcon }[] = [
  { id: "map",        label: "Carte",      icon: MapIcon    },
  { id: "challenges", label: "Défis",      icon: ScrollText },
  { id: "ranking",    label: "Classement", icon: Trophy     },
  { id: "profile",    label: "Profil",     icon: User       },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab
  onChange: (tab: Tab) => void
}) {
  return (
    <nav
      aria-label="Navigation principale"
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <ul className="modern-card flex items-center justify-around !rounded-2xl px-2 py-2 shadow-[0_-4px_24px_-6px_rgba(0,0,0,0.1)]">
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <li key={item.id} className="flex-1">
              <button
                type="button"
                id={`nav-${item.id}`}
                onClick={() => onChange(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex w-full flex-col items-center gap-1 rounded-xl py-1.5 transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
                )}
              >
                {/* Active pill */}
                {isActive && (
                  <span
                    aria-hidden
                    className="animate-nav-pill absolute inset-x-1 inset-y-0 rounded-xl ring-1"
                    style={{
                      background: "color-mix(in oklch, var(--accent) 8%, transparent)",
                      borderColor: "color-mix(in oklch, var(--accent) 15%, transparent)",
                    }}
                  />
                )}

                {/* Icon */}
                <span
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-250",
                    isActive ? "scale-110" : "scale-100",
                  )}
                  style={isActive ? {
                    background: "var(--accent)",
                    color: "var(--accent-foreground)",
                    boxShadow: "0 2px 8px color-mix(in oklch, var(--accent) 30%, transparent)",
                  } : undefined}
                >
                  <item.icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.75} />
                </span>

                <span
                  className={cn(
                    "relative font-sans text-[10px] font-bold uppercase tracking-wider transition-colors",
                    isActive ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
