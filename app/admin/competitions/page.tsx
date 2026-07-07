'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { competitions as initialCompetitions } from '@/lib/admin-data'
import type { Competition, CompetitionStatus } from '@/lib/admin-data'
import { THEMES } from '@/lib/theme-config'
import type { ThemeId } from '@/lib/theme-config'
import CompetitionForm from '@/components/admin/competition-form'

const STATUS_COLORS: Record<CompetitionStatus, string> = {
  brouillon: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  terminée: 'bg-blue-100 text-blue-700',
  archivée: 'bg-gray-100 text-gray-500',
}

const THEME_IDS: ThemeId[] = ['culture', 'sport', 'nature', 'histoire', 'science', 'gastronomie']
const STATUS_OPTIONS: CompetitionStatus[] = ['brouillon', 'active', 'terminée', 'archivée']

const selectClass =
  'rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/50'

export default function AdminCompetitionsPage() {
  const [list, setList] = useState<Competition[]>(initialCompetitions)
  const [editing, setEditing] = useState<Competition | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [statusFilter, setStatusFilter] = useState<CompetitionStatus | 'all'>('all')
  const [themeFilter, setThemeFilter] = useState<ThemeId | 'all'>('all')

  /* ── Filtering ── */
  const filtered = list.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (themeFilter !== 'all' && c.themeId !== themeFilter) return false
    return true
  })

  /* ── Handlers ── */
  function handleEdit(comp: Competition) {
    setEditing(comp)
    setShowForm(true)
  }

  function handleDelete(comp: Competition) {
    if (window.confirm(`Supprimer « ${comp.title} » ? Cette action est irréversible.`)) {
      setList((prev) => prev.filter((c) => c.id !== comp.id))
    }
  }

  function handleAdd() {
    setEditing(null)
    setShowForm(true)
  }

  function handleSave(data: Competition) {
    if (editing) {
      setList((prev) => prev.map((c) => (c.id === editing.id ? data : c)))
    } else {
      setList((prev) => [...prev, data])
    }
    setShowForm(false)
    setEditing(null)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Gestion des Compétitions
        </h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CompetitionStatus | 'all')}
          className={selectClass}
        >
          <option value="all">Tous les statuts</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value as ThemeId | 'all')}
          className={selectClass}
        >
          <option value="all">Toutes les catégories</option>
          {THEME_IDS.map((id) => (
            <option key={id} value={id}>
              {THEMES[id].label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              Aucune compétition trouvée
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Essayez de modifier vos filtres ou ajoutez une nouvelle compétition.
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold">Titre</th>
                <th className="text-left px-4 py-3 font-semibold">Catégorie</th>
                <th className="text-left px-4 py-3 font-semibold">Statut</th>
                <th className="text-center px-4 py-3 font-semibold">Défis</th>
                <th className="text-center px-4 py-3 font-semibold">Participants</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-primary">{c.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {THEMES[c.themeId].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-block text-xs font-semibold uppercase px-2.5 py-1 rounded-full',
                        STATUS_COLORS[c.status]
                      )}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-primary tabular-nums">{c.totalFragments}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-primary tabular-nums">
                      {c.participantsCount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {c.date}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(c)}
                        className="rounded-lg p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="rounded-lg p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ── */}
      {showForm && (
        <CompetitionForm
          competition={editing ?? undefined}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
