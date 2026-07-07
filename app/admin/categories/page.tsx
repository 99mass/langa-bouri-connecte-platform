'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, CheckCircle, Plus } from 'lucide-react'
import { THEMES } from '@/lib/theme-config'
import type { ThemeId, ThemeConfig } from '@/lib/theme-config'
import CategoryCard from '@/components/admin/category-card'
import CategoryForm from '@/components/admin/category-form'

export default function CategoriesPage() {
  const [themesList, setThemesList] = useState<ThemeConfig[]>([])
  const [showToast, setShowToast] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ThemeConfig | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)

  // Load from localStorage or seed initial data
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lb_themes")
      if (stored) {
        setThemesList(JSON.parse(stored))
      } else {
        const initial = Object.values(THEMES)
        localStorage.setItem("lb_themes", JSON.stringify(initial))
        setThemesList(initial)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleUpdateDescription = useCallback(
    (id: ThemeId, desc: string) => {
      setThemesList((prev) =>
        prev.map((t) => (t.id === id ? { ...t, description: desc } : t))
      )
    },
    []
  )

  const handleUpdateKeywords = useCallback(
    (id: ThemeId, keywords: string[]) => {
      setThemesList((prev) =>
        prev.map((t) => (t.id === id ? { ...t, decorKeywords: keywords } : t))
      )
    },
    []
  )

  function handleDelete(id: ThemeId) {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action ne pourra pas être annulée.")) {
      setThemesList((prev) => prev.filter((t) => t.id !== id))
    }
  }

  function handleSaveForm(data: ThemeConfig) {
    setThemesList((prev) => {
      const idx = prev.findIndex((t) => t.id === data.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = data
        return next
      }
      return [...prev, data]
    })
    setShowForm(false)
    setEditingCategory(undefined)
  }

  function handlePersist() {
    try {
      localStorage.setItem("lb_themes", JSON.stringify(themesList))
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    } catch (e) {
      console.error("Failed to persist categories configuration", e)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Configuration des Catégories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Personnalisez les thèmes, les codes couleur et les mots-clés décoratifs
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingCategory(undefined)
            setShowForm(true)
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity cursor-pointer animate-fade-in"
        >
          <Plus className="h-4 w-4" />
          Ajouter une catégorie
        </button>
      </div>

      {/* Grid */}
      {themesList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-border">
          <div className="text-5xl mb-4">🎨</div>
          <p className="font-heading font-bold text-primary">Aucune catégorie configurée</p>
          <p className="text-sm text-muted-foreground mt-1">
            Ajoutez une nouvelle catégorie thématique pour commencer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themesList.map((config) => (
            <CategoryCard
              key={config.id}
              config={config}
              onUpdateDescription={handleUpdateDescription}
              onUpdateKeywords={handleUpdateKeywords}
              onEdit={(c) => {
                setEditingCategory(c)
                setShowForm(true)
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Save button */}
      {themesList.length > 0 && (
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            onClick={handlePersist}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Save className="h-4 w-4" />
            Sauvegarder les modifications
          </button>
        </div>
      )}

      {/* Category CRUD Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSaveForm}
          onClose={() => {
            setShowForm(false)
            setEditingCategory(undefined)
          }}
          existingIds={themesList.map(t => t.id)}
        />
      )}

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
