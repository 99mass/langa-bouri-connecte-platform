'use client'

import { useState, useEffect } from 'react'
import {
  Trophy,
  Users,
  TrendingUp,
  Handshake,
  Calendar,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import StatCard from '@/components/admin/stat-card'
import { getAdminStats, competitions } from '@/lib/admin-data'
import { THEMES } from '@/lib/theme-config'
import type { CompetitionStatus } from '@/lib/admin-data'

const statusColors: Record<CompetitionStatus, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/25',
  brouillon: 'bg-amber-500/10 text-amber-600 border border-amber-500/25',
  terminée: 'bg-blue-500/10 text-blue-600 border border-blue-500/25',
  archivée: 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/25',
}

const statusLabels: Record<CompetitionStatus, string> = {
  active: 'Active',
  brouillon: 'Brouillon',
  terminée: 'Terminée',
  archivée: 'Archivée',
}

// Activity data mock for line chart
const activityData = [
  { month: 'Jan', inscrits: 45, complets: 12 },
  { month: 'Fév', inscrits: 85, complets: 28 },
  { month: 'Mar', inscrits: 130, complets: 48 },
  { month: 'Avr', inscrits: 175, complets: 82 },
  { month: 'Mai', inscrits: 210, complets: 115 },
  { month: 'Juin', inscrits: 248, complets: 145 },
]

export default function AdminDashboardPage() {
  const stats = getAdminStats()
  const recentCompetitions = competitions.slice(-3).reverse()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration error with client-only chart render
  useEffect(() => {
    setMounted(true)
  }, [])

  // Map category data for PieChart
  const themePieData = Object.entries(stats.byTheme).map(([themeId, count]) => {
    const theme = THEMES[themeId as keyof typeof THEMES]
    return {
      name: theme?.label || themeId,
      value: count,
      color: themeId === 'culture' ? '#d97706' : 
             themeId === 'sport' ? '#10b981' : 
             themeId === 'nature' ? '#059669' : 
             themeId === 'histoire' ? '#b91c1c' : 
             themeId === 'science' ? '#2563eb' : '#ea580c'
    }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Page header ── */}
      <div className="relative pb-4 border-b border-border/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-primary uppercase tracking-wider ink-title">
            Tableau de Bord
          </h2>
          <p className="font-sans text-xs text-muted-foreground mt-1 uppercase tracking-wide">
            Vue d&apos;ensemble de la plateforme Langa Bouri Connecté
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full w-fit">
          <Calendar className="w-3.5 h-3.5" />
          Saison 2026
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Compétitions"
          value={stats.totalCompetitions}
          subtitle={`${stats.activeCompetitions} actives`}
          icon={<Trophy className="w-5 h-5 text-amber-500" />}
          trend={{ value: 12, label: "ce mois" }}
        />
        <StatCard
          title="Participants"
          value={stats.totalParticipants}
          subtitle="inscrits au total"
          icon={<Users className="w-5 h-5 text-amber-500" />}
          trend={{ value: 8, label: "nouveaux" }}
        />
        <StatCard
          title="Taux de complétion"
          value={`${stats.avgCompletion}%`}
          subtitle="moyenne par quête"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Partenaires"
          value={stats.activePartenaires}
          subtitle={`sur ${stats.totalPartenaires}`}
          icon={<Handshake className="w-5 h-5 text-blue-500" />}
        />
      </div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real Curve Area Chart for Activity */}
        <div className="lg:col-span-2 modern-card bg-card/95 backdrop-blur-sm border border-border/80 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
          
          <h3 className="font-heading text-xs font-bold text-primary mb-6 uppercase tracking-widest leading-none border-b border-border/60 pb-3">
            Activité Globale (Aventuriers)
          </h3>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorInscrits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorComplets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(0,0,0,0.4)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(0,0,0,0.4)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                      borderRadius: '16px', 
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                      fontFamily: 'var(--font-inter)'
                    }} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area 
                    type="monotone" 
                    name="Inscriptions" 
                    dataKey="inscrits" 
                    stroke="#d97706" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorInscrits)" 
                  />
                  <Area 
                    type="monotone" 
                    name="Défis Résolus" 
                    dataKey="complets" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorComplets)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-muted/40 rounded-2xl animate-pulse" />
            )}
          </div>
        </div>

        {/* Real Pie Chart for Category breakdown */}
        <div className="modern-card bg-card/95 backdrop-blur-sm border border-border/80 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
          
          <h3 className="font-heading text-xs font-bold text-primary mb-6 uppercase tracking-widest leading-none border-b border-border/60 pb-3">
            Répartition Thématique
          </h3>

          <div className="h-64 w-full flex flex-col items-center justify-center">
            {mounted ? (
              <div className="w-full h-full flex flex-col justify-between">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={themePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {themePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                          borderRadius: '16px', 
                          border: 'none',
                          color: '#fff',
                          fontSize: '11px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend for cleaner layout inside small card */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] text-muted-foreground font-semibold uppercase">
                  {themePieData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full w-full bg-muted/40 rounded-2xl animate-pulse" />
            )}
          </div>
        </div>

      </div>

      {/* ── Recent competitions table ── */}
      <div className="modern-card bg-card/95 backdrop-blur-sm border border-border/80 rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
        
        <h3 className="font-heading text-xs font-bold text-primary mb-6 uppercase tracking-widest leading-none border-b border-border/60 pb-3">
          Compétitions Récentes
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left pb-3 pr-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Titre
                </th>
                <th className="text-left pb-3 pr-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Thème
                </th>
                <th className="text-left pb-3 pr-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-right pb-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Participants
                </th>
              </tr>
            </thead>
            <tbody>
              {recentCompetitions.map((comp) => {
                const theme = THEMES[comp.themeId]
                return (
                  <tr
                    key={comp.id}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors"
                  >
                    <td className="py-3.5 pr-3 font-semibold text-primary">
                      {comp.title}
                    </td>
                    <td className="py-3.5 pr-3 text-xs text-muted-foreground">
                      {theme?.label ?? comp.themeId}
                    </td>
                    <td className="py-3.5 pr-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          statusColors[comp.status]
                        }`}
                      >
                        {statusLabels[comp.status]}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono text-xs text-primary font-bold">
                      {comp.participantsCount}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
