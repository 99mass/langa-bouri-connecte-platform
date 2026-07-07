import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatCardProps = {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; label: string }
  className?: string
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: StatCardProps) {
  const trendIsPositive = trend && trend.value >= 0

  return (
    <div
      className={cn(
        'modern-card bg-card/95 backdrop-blur-sm border border-border/80 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-amber-500/20 relative overflow-hidden group',
        className
      )}
    >
      {/* Curved background highlight */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

      {/* Header row: icon + trend badge */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-amber-500/30">
          {icon}
        </div>

        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
              trendIsPositive
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
            )}
          >
            {trendIsPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.value > 0 ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p className="font-heading text-2xl font-black text-primary leading-none tracking-tight">
          {value}
        </p>

        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-2 leading-none">
          {title}
        </p>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-muted-foreground/80 mt-2 font-serif italic">{subtitle}</p>
        )}

        {/* Trend label */}
        {trend && (
          <p className="text-[10px] text-muted-foreground/60 mt-1 font-sans">{trend.label}</p>
        )}
      </div>
    </div>
  )
}
