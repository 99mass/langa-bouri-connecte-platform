'use client'

import { useState, useCallback } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import { THEMES } from '@/lib/theme-config'
import type { ThemeId, ThemeConfig } from '@/lib/theme-config'
import CategoryCard from '@/components/admin/category-card'

function deepCloneThemes(): Record<ThemeId, ThemeConfig> {
  return JSON.parse(JSON.stringify(THEMES))
}

export default function CategoriesPage() {
  const [themes, setThemes] = useState<Record<ThemeId, ThemeConfig>>(deepCloneThemes)
  const [showToast, setShowToast] = useState(false)

  const handleUpdateDescription = useCallback(
    (id: ThemeId, desc: string) => {
      setThemes((prev) => ({
        ...prev,
        [id]: { ...prev[id], description: desc },
      }))
    },
    []
  )

  const handleUpdateKeywords = useCallback(
    (id: ThemeId, keywords: string[]) => {
      setThemes((prev) => ({
        ...prev,
        [id]: { ...prev[id], decorKeywords: keywords },
      }))
    },
    []
  )

  function handleSave() {
    // In a real app this would persist to a backend
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const themeEntries = Object.values(themes)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">
          Configuration des Catégories
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personnalisez les thèmes et domaines de compétition
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {themeEntries.map((config) => (
          <CategoryCard
            key={config.id}
            config={config}
            onUpdateDescription={handleUpdateDescription}
            onUpdateKeywords={handleUpdateKeywords}
          />
        ))}
      </div>

      {/* Save button */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity"
        >
          <Save className="h-4 w-4" />
          Sauvegarder les modifications
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
            <CheckCircle className="h-4 w-4" />
            Modifications sauvegardées avec succès
          </div>
        </div>
      )}
    </div>
  )
}
