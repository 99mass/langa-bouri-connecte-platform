"use client"

import { Crown, Flag, Medal } from "lucide-react"
import { cn } from "@/lib/utils"
import { leaderboard, type Player } from "@/lib/game-data"

const medalColor = ["text-accent", "text-muted-foreground", "text-ember"]

function Champion({ player, place }: { player: Player; place: 0 | 1 | 2 }) {
  const heights = ["h-28", "h-20", "h-16"]
  const order = ["order-2", "order-1", "order-3"]
  return (
    <div className={cn("flex flex-1 flex-col items-center", order[place])}>
      <div className="relative">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-wood font-heading text-lg font-bold text-accent ring-2 ring-accent/70">
          {player.initials}
        </span>
        {place === 0 && (
          <Crown className="absolute -top-4 left-1/2 h-6 w-6 -translate-x-1/2 text-accent" />
        )}
      </div>
      <p className="mt-2 max-w-[6rem] truncate text-center font-heading text-sm font-bold text-primary">
        {player.name}
      </p>
      <p className="font-serif text-xs italic text-muted-foreground tabular-nums">
        {player.time}
      </p>
      <div
        className={cn(
          "mt-2 flex w-full items-start justify-center rounded-t-lg bg-wood pt-2 wood-frame",
          heights[place],
        )}
      >
        <span className="font-heading text-2xl font-black text-accent">
          {player.rank}
        </span>
      </div>
    </div>
  )
}

export function Ranking() {
  const [first, second, third, ...rest] = leaderboard
  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-4">
      <header className="mb-5 text-center">
        <h1 className="ink-title font-heading text-2xl font-black text-primary">
          Le Panthéon des Explorateurs
        </h1>
        <p className="font-serif text-sm italic text-muted-foreground">
          Classement du tournoi « L'Héritage de Ndiadiane »
        </p>
      </header>

      {/* Champions podium */}
      <section className="parchment wood-frame mb-5 flex items-end gap-2 rounded-xl px-4 pb-0 pt-8">
        <Champion player={second} place={1} />
        <Champion player={first} place={0} />
        <Champion player={third} place={2} />
      </section>

      {/* Remaining list */}
      <ul className="flex flex-col gap-2">
        {rest.map((p) => (
          <li
            key={p.rank}
            className="parchment gold-frame flex items-center gap-3 rounded-lg px-4 py-3"
          >
            <span className="w-6 text-center font-heading text-lg font-bold text-primary">
              {p.rank}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-wood font-heading text-sm font-bold text-accent ring-1 ring-accent/50">
              {p.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-bold text-primary">
                {p.name}
              </p>
              <p className="flex items-center gap-1 font-serif text-xs text-muted-foreground">
                <Flag className="h-3 w-3" /> {p.fragments} fragments
              </p>
            </div>
            <span className="font-serif text-sm italic text-muted-foreground tabular-nums">
              {p.time}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center font-serif text-xs italic text-muted-foreground">
        <Medal className={cn("h-4 w-4", medalColor[0])} />
        Terminez la quête pour rejoindre le classement
      </p>
    </div>
  )
}
