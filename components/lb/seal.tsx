import { Compass } from "lucide-react"
import { cn } from "@/lib/utils"

export function Seal({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-wood text-accent",
        "shadow-[inset_0_0_10px_rgba(0,0,0,0.45)] ring-2 ring-accent/70",
        className,
      )}
    >
      <span className="absolute inset-1 rounded-full border border-accent/40 border-dashed" />
      <Compass className="h-1/2 w-1/2" strokeWidth={1.5} />
    </span>
  )
}
