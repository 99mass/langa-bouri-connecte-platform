"use client"

import { useState } from "react"
import {
  X,
  Send,
  CheckCircle2,
  ChevronDown,
  User,
  Mail,
  Phone,
  Building2,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

const interestOptions = [
  "Organiser un événement",
  "Devenir partenaire / sponsor",
  "Demande d'information",
  "Proposition commerciale",
  "Autre",
]

export function ContactModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    org: "",
    interest: "",
    message: "",
  })

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const canSubmit =
    form.name.trim() && form.email.trim() && form.interest && form.message.trim()

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Contacter l'agence">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg animate-unfurl">
        <div className="modern-card overflow-hidden !rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#1a1714] to-[#252018] px-6 py-6">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-[40px]" />
            </div>
            <div className="relative flex items-start justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-white">Contactez-nous</h2>
                <p className="mt-1 font-sans text-sm text-white/50">
                  Promouvez vos produits avec Langa Bouri Connecté
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {sent ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-heading text-lg font-bold text-primary">Message envoyé !</h3>
              <p className="max-w-xs font-sans text-sm text-muted-foreground leading-relaxed">
                Notre équipe vous recontactera dans les 24 heures. Merci de votre intérêt pour Langa Bouri Connecté.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 rounded-full bg-primary px-6 py-2.5 font-sans text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Fermer
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form
              onSubmit={(e) => {
                e.preventDefault()
                try {
                  const existing = JSON.parse(localStorage.getItem("lb_partner_requests") || "[]")
                  const newRequest = {
                    id: Date.now(),
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    org: form.org,
                    interest: form.interest,
                    message: form.message,
                    status: "pending",
                    createdAt: new Date().toISOString()
                  }
                  localStorage.setItem("lb_partner_requests", JSON.stringify([newRequest, ...existing]))
                } catch (err) {
                  console.error("Failed to save partnership request", err)
                }
                setSent(true)
              }}
              className="flex flex-col gap-4 px-6 py-6"
            >
              {/* Name & Email row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-xs font-medium text-muted-foreground">Nom complet *</span>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                    <User className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Votre nom"
                      className="w-full bg-transparent font-sans text-sm text-primary outline-none placeholder:text-muted-foreground/40"
                      required
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-xs font-medium text-muted-foreground">Email *</span>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                    <Mail className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="email@exemple.com"
                      className="w-full bg-transparent font-sans text-sm text-primary outline-none placeholder:text-muted-foreground/40"
                      required
                    />
                  </div>
                </label>
              </div>

              {/* Phone & Org row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-xs font-medium text-muted-foreground">Téléphone</span>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                    <Phone className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+221 7X XXX XX XX"
                      className="w-full bg-transparent font-sans text-sm text-primary outline-none placeholder:text-muted-foreground/40"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-xs font-medium text-muted-foreground">Organisation</span>
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                    <Building2 className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                    <input
                      type="text"
                      value={form.org}
                      onChange={set("org")}
                      placeholder="Entreprise / Association"
                      className="w-full bg-transparent font-sans text-sm text-primary outline-none placeholder:text-muted-foreground/40"
                    />
                  </div>
                </label>
              </div>

              {/* Interest */}
              <label className="flex flex-col gap-1.5">
                <span className="font-sans text-xs font-medium text-muted-foreground">Type de demande *</span>
                <div className="relative">
                  <select
                    value={form.interest}
                    onChange={set("interest")}
                    required
                    className={cn(
                      "w-full appearance-none rounded-xl border border-border bg-muted/30 px-3 py-2.5 pr-10 font-sans text-sm text-primary outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20",
                      !form.interest && "text-muted-foreground/40"
                    )}
                  >
                    <option value="" disabled>Sélectionnez une option</option>
                    {interestOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                </div>
              </label>

              {/* Message */}
              <label className="flex flex-col gap-1.5">
                <span className="font-sans text-xs font-medium text-muted-foreground">Message *</span>
                <div className="flex gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                  <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground/60 shrink-0" />
                  <textarea
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Décrivez votre projet ou votre demande..."
                    rows={4}
                    className="w-full resize-none bg-transparent font-sans text-sm text-primary outline-none placeholder:text-muted-foreground/40"
                    required
                  />
                </div>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  "mt-2 flex items-center justify-center gap-2 rounded-xl py-3 font-sans text-sm font-semibold transition-all",
                  canSubmit
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Send className="h-4 w-4" />
                Envoyer le message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
