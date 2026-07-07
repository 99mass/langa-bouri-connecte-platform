'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/admin/sidebar'
import { Menu, Lock, ArrowLeft, Eye, EyeOff, ShieldCheck, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null) // null for initial loading check
  
  // Login form states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Verify auth on mount
  useEffect(() => {
    const authed = localStorage.getItem('lb_admin_connected') === 'true'
    setIsAuthed(authed)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate authenticating
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('lb_admin_connected', 'true')
        setIsAuthed(true)
      } else {
        setError('Identifiants administrateur incorrects.')
      }
      setLoading(false)
    }, 600)
  }

  const handleLogout = () => {
    localStorage.removeItem('lb_admin_connected')
    setIsAuthed(false)
  }

  // Loading state
  if (isAuthed === null) {
    return (
      <div className="min-h-screen bg-[#131110] flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
          <span className="mt-4 font-sans text-xs text-amber-500/60 uppercase tracking-widest">Chargement...</span>
        </div>
      </div>
    )
  }

  // Not authenticated: Render the gorgeous premium login screen
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#131110] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Curved glowing ambient shapes */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md animate-scale-up relative z-10">
          {/* Logo / Badge */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/35 flex items-center justify-center shadow-lg shadow-amber-500/5 mb-4 animate-float">
              <Lock className="w-7 h-7 text-amber-400" />
            </div>
            <h1 className="font-heading text-2xl font-black uppercase tracking-widest text-amber-400">
              Sanctuaire Admin
            </h1>
            <p className="font-sans text-xs text-white/50 mt-1.5 uppercase tracking-wide">
              Langa Bouri Connecté
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-zinc-950/80 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider text-amber-400">
              Accès Protégé
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">
                  Identifiant
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-4 pr-10 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm py-3 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            {/* Helper credentials banner */}
            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <span className="text-[10px] text-white/40 font-sans">
                Identifiants démo : <code className="bg-white/5 px-1.5 py-0.5 rounded text-amber-300">admin</code> / <code className="bg-white/5 px-1.5 py-0.5 rounded text-amber-300">admin</code>
              </span>
            </div>
          </div>

          {/* Return link */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour au site public
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Content area — pushed right on desktop */}
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen">
        {/* Header bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-6 h-14 bg-card/85 backdrop-blur-md border-b border-border">
          {/* Left: hamburger (mobile) + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-1 rounded-lg hover:bg-muted text-muted-foreground"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="font-heading text-sm font-black uppercase tracking-widest text-primary">
              Portail Admin
            </h1>
          </div>

          {/* Right: user controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/15 text-accent text-xs font-bold select-none border border-accent/20">
              AD
            </div>
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 flex-1 bg-transparent max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
