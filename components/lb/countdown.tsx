"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

function useCountdown(target: number) {
  const [remaining, setRemaining] = useState(target - Date.now())
  useEffect(() => {
    const id = setInterval(() => setRemaining(target - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  const clamped = Math.max(0, remaining)
  const days = Math.floor(clamped / 86400000)
  const hours = Math.floor((clamped % 86400000) / 3600000)
  const minutes = Math.floor((clamped % 3600000) / 60000)
  const seconds = Math.floor((clamped % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="gold-frame flex h-12 w-12 items-center justify-center rounded-md bg-wood font-heading text-xl font-bold text-accent tabular-nums sm:h-14 sm:w-14 sm:text-2xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 font-heading text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function Countdown({
  className,
  offsetMs = 3 * 86400000 + 7 * 3600000 + 42 * 60000,
}: {
  className?: string
  offsetMs?: number
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(false) // Trigger client check
    setMounted(true)
  }, [])

  // fixed target relative to first mount to keep it stable across renders
  const [target] = useState(() => Date.now() + offsetMs)
  const { days, hours, minutes, seconds } = useCountdown(target)

  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
        <Unit value={0} label="Jours" />
        <span className="font-heading text-2xl text-accent/70">:</span>
        <Unit value={0} label="Heures" />
        <span className="font-heading text-2xl text-accent/70">:</span>
        <Unit value={0} label="Min" />
        <span className="font-heading text-2xl text-accent/70">:</span>
        <Unit value={0} label="Sec" />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      <Unit value={days} label="Jours" />
      <span className="font-heading text-2xl text-accent/70">:</span>
      <Unit value={hours} label="Heures" />
      <span className="font-heading text-2xl text-accent/70">:</span>
      <Unit value={minutes} label="Min" />
      <span className="font-heading text-2xl text-accent/70">:</span>
      <Unit value={seconds} label="Sec" />
    </div>
  )
}
