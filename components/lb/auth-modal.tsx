"use client"

import { useState } from "react"
import { Phone, ShieldCheck, User, X } from "lucide-react"
import { Seal } from "@/components/lb/seal"

export function AuthModal({
  onClose,
  onComplete,
}: {
  onClose: () => void
  onComplete: (nickname: string) => void
}) {
  const [nickname, setNickname] = useState("")
  const [phone, setPhone] = useState("")
  const [step, setStep] = useState<"identity" | "verify">("identity")
  const [code, setCode] = useState("")

  function handleIdentity(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim() || phone.trim().length < 6) return
    setStep("verify")
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (code.trim().length < 4) return
    onComplete(nickname.trim())
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-wood/70 backdrop-blur-sm"
      />

      <div className="animate-seal-in parchment wood-frame relative z-10 w-full max-w-sm overflow-hidden rounded-2xl p-6 text-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-wood text-accent ring-1 ring-accent/60"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex justify-center">
          <Seal className="h-14 w-14" />
        </div>

        <h2 className="mt-4 text-balance font-heading text-xl font-bold leading-snug text-primary">
          {step === "identity"
            ? "Pour continuer votre quête, créez votre identité d'aventurier"
            : "Confirmez votre sceau"}
        </h2>

        {step === "identity" ? (
          <form onSubmit={handleIdentity} className="mt-6 flex flex-col gap-3 text-left">
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 font-heading text-[11px] uppercase tracking-widest text-muted-foreground">
                <User className="h-3.5 w-3.5" /> Nom d'aventurier
              </span>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ex. Le Griot Errant"
                className="w-full rounded-lg border border-wood/40 bg-background/70 px-3 py-2.5 font-serif text-foreground outline-none ring-accent/50 placeholder:text-muted-foreground/70 focus:ring-2"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 font-heading text-[11px] uppercase tracking-widest text-muted-foreground">
                <Phone className="h-3.5 w-3.5" /> Téléphone
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="+221 ..."
                className="w-full rounded-lg border border-wood/40 bg-background/70 px-3 py-2.5 font-serif text-foreground outline-none ring-accent/50 placeholder:text-muted-foreground/70 focus:ring-2"
                required
              />
            </label>
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-wood py-3 font-heading text-sm font-bold uppercase tracking-widest text-accent ring-2 ring-accent/70 transition-transform active:scale-[0.98]"
            >
              Recevoir le code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="mt-6 flex flex-col gap-3 text-left">
            <p className="font-serif text-sm italic text-muted-foreground">
              Un code à 4 chiffres a été envoyé au {phone}. Saisissez-le pour
              sceller votre identité.
            </p>
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 font-heading text-[11px] uppercase tracking-widest text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Code de vérification
              </span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                placeholder="0000"
                className="w-full rounded-lg border border-wood/40 bg-background/70 px-3 py-2.5 text-center font-heading text-2xl tracking-[0.5em] text-foreground outline-none ring-accent/50 focus:ring-2"
                required
              />
            </label>
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-wood py-3 font-heading text-sm font-bold uppercase tracking-widest text-accent ring-2 ring-accent/70 transition-transform active:scale-[0.98]"
            >
              Sceller mon identité
            </button>
          </form>
        )}

        <p className="mt-4 font-serif text-xs italic text-muted-foreground">
          Vos informations restent gravées dans le journal de l'expédition.
        </p>
      </div>
    </div>
  )
}
