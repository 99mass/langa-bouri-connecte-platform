'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Crown,
  LayoutDashboard,
  Trophy,
  Handshake,
  Palette,
  ArrowLeft,
  X,
  Megaphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SidebarProps = {
  isOpen: boolean
  onToggle: () => void
}

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Compétitions', href: '/admin/competitions', icon: Trophy },
  { label: 'Partenaires', href: '/admin/partenaires', icon: Handshake },
  { label: 'Catégories', href: '/admin/categories', icon: Palette },
  { label: 'Sponsoring', href: '/admin/sponsoring', icon: Megaphone },
]

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#131110] text-white">
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-6 py-8 border-b border-white/5 relative overflow-hidden">
        {/* Glow behind logo */}
        <div className="absolute top-[-30px] left-[-30px] w-24 h-24 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-md shadow-amber-500/5 relative z-10">
          <Crown className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex flex-col relative z-10">
          <span className="font-heading text-base font-black tracking-widest text-amber-400 leading-none">
            LB ADMIN
          </span>
          <span className="text-[9px] font-sans text-white/40 uppercase tracking-widest mt-1">
            Expédition
          </span>
        </div>

        {/* Close button on mobile */}
        <button
          onClick={onToggle}
          className="ml-auto md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          aria-label="Fermer le menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (isOpen) onToggle()
              }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-300 relative group',
                active
                  ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/10 scale-[1.02]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className={cn("w-4.5 h-4.5 shrink-0 transition-transform duration-300 group-hover:scale-110", active ? "text-black" : "text-amber-500/80")} />
              <span className="tracking-wide">{item.label}</span>
              {active && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black/70 animate-ping" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <Link
          href="/play"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl text-xs font-semibold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Retour au site public
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-[260px] flex-col border-r border-white/5 shadow-2xl">
        {sidebarContent}
      </aside>

      {/* ── Mobile overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col shadow-2xl transition-transform duration-300 ease-out md:hidden border-r border-white/5',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
