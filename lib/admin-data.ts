"use client"

import type { Fragment } from "./game-data"
import type { ThemeId } from "./theme-config"

/* ═══════════════════════════════════════════
   COMPETITION
   ═══════════════════════════════════════════ */

export type CompetitionStatus = "brouillon" | "active" | "terminée" | "archivée"

export type Competition = {
  id: number
  title: string
  themeId: ThemeId
  location: string
  date: string
  startDate?: string
  startTime?: string
  endDate?: string
  endTime?: string
  status: CompetitionStatus
  totalFragments: number
  fragments: Fragment[]
  reward: string
  cover: string
  treasureLockedImage: string
  treasureUnlockedImage: string
  participantsCount: number
  completedCount: number
  createdAt: string
  sponsorName?: string
}

export const competitions: Competition[] = [
  {
    id: 1,
    title: "L'Héritage de Ndiadiane",
    themeId: "culture",
    location: "Saint-Louis, Sénégal",
    date: "15 Juillet 2026",
    status: "active",
    totalFragments: 6,
    fragments: [
      { id: 1, index: "1/6", title: "Le Baobab des Anciens", place: "Village de Ndoumbélane", story: "C'est sous cet arbre centenaire que les anciens se réunissaient.", clue: "Cherchez la branche orientée vers le couchant.", media: "audio", reward: "Fiole de parfum d'ambre", status: "completed", x: 100, y: 60 },
      { id: 2, index: "2/6", title: "La Traversée du Fleuve", place: "Rive du Saloum", story: "Les pirogues de guerre traversaient ce bras de mer.", clue: "Près de l'embarcadère en bois flotté.", media: "image", reward: "", status: "completed", x: 240, y: 110 },
      { id: 3, index: "3/6", title: "Le Marché aux Épices", place: "Cité de Kaolack", story: "Un carrefour de senteurs et de couleurs.", clue: "Derrière l'étal du vendeur de piment rouge.", media: "video", reward: "Sachet de gingembre rare", status: "completed", x: 80, y: 180 },
      { id: 4, index: "4/6", title: "Le Fort de l'Île", place: "Île de Gorée", story: "Les canons rouillés protègent encore l'entrée.", clue: "Dans l'embrasure de la canonnière faisant face à l'est.", media: "image", reward: "Boussole en laiton gravé", status: "active", x: 300, y: 240 },
      { id: 5, index: "5/6", title: "Le Puits Sacré", place: "Palais Royal de Diourbel", story: "Une eau claire et mystérieuse.", clue: "Sur la margelle nord, sous la mousse sauvage.", media: "audio", reward: "Aucune", status: "locked", x: 140, y: 310 },
      { id: 6, index: "6/6", title: "La Couronne Perdue", place: "Ruines de Saint-Louis", story: "L'insigne du pouvoir suprême, caché lors de la grande invasion.", clue: "Dans la clé de voûte de la grande arche.", media: "image", reward: "Couronne sacrée (Badge Or)", status: "locked", x: 220, y: 380 },
    ],
    reward: "Couronne sacrée (Badge Or)",
    cover: "/images/event-fort.png",
    treasureLockedImage: "/images/treasure_locked.jpg",
    treasureUnlockedImage: "/images/treasure_unlocked.jpg",
    participantsCount: 128,
    completedCount: 12,
    createdAt: "2026-06-01",
  },
  {
    id: 2,
    title: "Le Trésor de Ndar",
    themeId: "histoire",
    location: "Saint-Louis, Sénégal",
    date: "28 Juillet 2026",
    status: "brouillon",
    totalFragments: 5,
    fragments: [
      { id: 1, index: "1/5", title: "Les Quais du Fleuve", place: "Quai Roume", story: "Les marchands amarraient ici leurs pirogues chargées d'or.", clue: "Sous le troisième anneau de fonte.", media: "image", reward: "Pièce coloniale", status: "active", x: 120, y: 80 },
      { id: 2, index: "2/5", title: "La Maison des Signares", place: "Île de Ndar", story: "Les signares gouvernaient le commerce du fleuve.", clue: "Derrière le volet bleu à l'étage.", media: "audio", reward: "Éventail en ivoire", status: "locked", x: 260, y: 140 },
      { id: 3, index: "3/5", title: "Le Pont Faidherbe", place: "Pont Faidherbe", story: "Un colosse de métal reliant deux mondes.", clue: "Sur la sixième travée, face au courant.", media: "image", reward: "", status: "locked", x: 90, y: 220 },
      { id: 4, index: "4/5", title: "Le Cimetière Marin", place: "Cimetière de Guet Ndar", story: "Les pêcheurs y reposent face à l'océan.", clue: "La tombe ornée d'une ancre dorée.", media: "video", reward: "Coquillage sacré", status: "locked", x: 280, y: 300 },
      { id: 5, index: "5/5", title: "Le Phare des Mamelles", place: "Phare de Ndar", story: "La lumière qui guidait les navires.", clue: "Au sommet, gravé dans le cuivre du mécanisme.", media: "image", reward: "Longue-vue d'explorateur", status: "locked", x: 180, y: 380 },
    ],
    reward: "Longue-vue d'explorateur",
    cover: "/images/event-river.png",
    treasureLockedImage: "/images/treasure_locked.jpg",
    treasureUnlockedImage: "/images/clue-artifact.png",
    participantsCount: 0,
    completedCount: 0,
    createdAt: "2026-06-20",
  },
  {
    id: 3,
    title: "Marathon des Dunes de Lompoul",
    themeId: "sport",
    location: "Désert de Lompoul",
    date: "19 Juillet 2026",
    status: "active",
    totalFragments: 4,
    fragments: [
      { id: 1, index: "1/4", title: "Le Camp de Base", place: "Entrée du désert", story: "Les dunes s'étendent à perte de vue.", clue: "Sous le drapeau rouge au sommet de la première dune.", media: "image", reward: "Bandana du désert", status: "completed", x: 150, y: 70 },
      { id: 2, index: "2/4", title: "L'Oasis Cachée", place: "Oasis de Lompoul", story: "Un point d'eau secret au cœur du sable.", clue: "Près du palmier isolé, à l'ombre de midi.", media: "audio", reward: "", status: "active", x: 220, y: 160 },
      { id: 3, index: "3/4", title: "La Piste des Chameaux", place: "Piste caravanière", story: "Les caravanes empruntaient cette route millénaire.", clue: "Au pied du rocher en forme de lion.", media: "image", reward: "Gourde de nomade", status: "locked", x: 100, y: 250 },
      { id: 4, index: "4/4", title: "Le Sommet Doré", place: "Grande Dune", story: "Le point culminant offre une vue sur l'océan.", clue: "Le cairn de pierres au sommet.", media: "video", reward: "Trophée des Sables", status: "locked", x: 260, y: 340 },
    ],
    reward: "Trophée des Sables",
    cover: "/images/event-baobab.png",
    treasureLockedImage: "/images/treasure_locked.jpg",
    treasureUnlockedImage: "/images/treasure_unlocked_sport.jpg",
    participantsCount: 64,
    completedCount: 5,
    createdAt: "2026-05-15",
  },
  {
    id: 4,
    title: "La Piste du Thiéboudienne Royal",
    themeId: "gastronomie",
    location: "Saint-Louis",
    date: "18 Juillet 2026",
    status: "terminée",
    totalFragments: 4,
    fragments: [
      { id: 1, index: "1/4", title: "Le Marché Central", place: "Marché Sor", story: "Les épices se négocient à la criée.", clue: "L'étal aux pyramides de tomates.", media: "image", reward: "Sachet de Yéet", status: "completed", x: 130, y: 90 },
      { id: 2, index: "2/4", title: "La Cuisine de Mame Coumba", place: "Guet Ndar", story: "La meilleure cuisinière du quartier.", clue: "Le mortier en bois devant la porte bleue.", media: "audio", reward: "", status: "completed", x: 240, y: 170 },
      { id: 3, index: "3/4", title: "Le Four à Pain", place: "Boulangerie artisanale", story: "Le pain doré cuit au feu de bois.", clue: "La marque sur la troisième brique.", media: "video", reward: "Recette secrète", status: "completed", x: 100, y: 260 },
      { id: 4, index: "4/4", title: "Le Festin Final", place: "Terrasse du Fleuve", story: "Un thiéboudienne royal face au coucher de soleil.", clue: "La table avec la nappe brodée.", media: "image", reward: "Marmite d'Or", status: "completed", x: 280, y: 350 },
    ],
    reward: "Marmite d'Or",
    cover: "/images/event-fort.png",
    treasureLockedImage: "/images/treasure_locked.jpg",
    treasureUnlockedImage: "/images/event-river.png",
    participantsCount: 45,
    completedCount: 32,
    createdAt: "2026-04-10",
  },
  {
    id: 5,
    title: "Exploration de la Réserve de Bandia",
    themeId: "nature",
    location: "Sindia, Sénégal",
    date: "24 Juillet 2026",
    status: "brouillon",
    totalFragments: 5,
    fragments: [
      { id: 1, index: "1/5", title: "L'Entrée de la Réserve", place: "Portail Bandia", story: "La savane sénégalaise s'ouvre devant vous.", clue: "Le panneau sculpté en bois d'ébène.", media: "image", reward: "Badge Éco-Garde", status: "active", x: 160, y: 60 },
      { id: 2, index: "2/5", title: "Le Baobab Millénaire", place: "Clairière sacrée", story: "Un arbre de 800 ans, gardien de la forêt.", clue: "La cavité dans le tronc, face au nord.", media: "audio", reward: "", status: "locked", x: 240, y: 140 },
      { id: 3, index: "3/5", title: "Le Point d'Eau", place: "Mare aux hippos", story: "Les animaux s'y retrouvent au crépuscule.", clue: "Le rocher plat au bord de l'eau.", media: "video", reward: "Jumelles de brousse", status: "locked", x: 80, y: 220 },
      { id: 4, index: "4/5", title: "La Grotte des Chauves-Souris", place: "Colline latéritique", story: "Un réseau souterrain habité.", clue: "L'inscription à l'entrée de la grotte.", media: "image", reward: "", status: "locked", x: 300, y: 300 },
      { id: 5, index: "5/5", title: "Le Belvédère", place: "Sommet de la réserve", story: "Vue panoramique sur toute la réserve.", clue: "La pierre gravée sur la plateforme.", media: "image", reward: "Fleur de Fromager", status: "locked", x: 180, y: 380 },
    ],
    reward: "Fleur de Fromager",
    cover: "/images/event-baobab.png",
    treasureLockedImage: "/images/treasure_locked.jpg",
    treasureUnlockedImage: "/images/event-baobab.png",
    participantsCount: 0,
    completedCount: 0,
    createdAt: "2026-06-28",
  },
]

/* ═══════════════════════════════════════════
   PARTENAIRE
   ═══════════════════════════════════════════ */

export type PartenaireType = 'sponsor' | 'media' | 'institutionnel' | 'technique'
export type Partenaire = {
  id: number
  name: string // Contact Name
  org?: string // Company / Brand Name
  logo: string
  website: string
  type: PartenaireType
  description: string
  email?: string
  phone?: string
  isActive: boolean
  createdAt: string
}

export const partenaires: Partenaire[] = [
  {
    id: 1,
    name: "Orange Sénégal",
    logo: "🟠",
    website: "https://www.orange.sn",
    type: "sponsor",
    description: "Partenaire télécom principal. Fournit la connectivité mobile et le sponsoring des événements sportifs.",
    isActive: true,
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    name: "Ministère de la Culture",
    logo: "🏛️",
    website: "https://culture.gouv.sn",
    type: "institutionnel",
    description: "Soutien institutionnel pour les événements culturels et patrimoniaux.",
    isActive: true,
    createdAt: "2026-02-01",
  },
  {
    id: 3,
    name: "RTS (Radiodiffusion Télévision du Sénégal)",
    logo: "📺",
    website: "https://rts.sn",
    type: "media",
    description: "Couverture médiatique des grandes compétitions et diffusion en direct.",
    isActive: true,
    createdAt: "2026-02-20",
  },
  {
    id: 4,
    name: "Sonatel",
    logo: "📡",
    website: "https://www.sonatel.sn",
    type: "technique",
    description: "Infrastructure réseau et support technique pour le scanning QR en zones rurales.",
    isActive: true,
    createdAt: "2026-03-05",
  },
  {
    id: 5,
    name: "Air Sénégal",
    logo: "✈️",
    website: "https://www.airsenegal.com",
    type: "sponsor",
    description: "Partenaire transport. Offre des billets d'avion comme récompenses premium.",
    isActive: false,
    createdAt: "2026-03-18",
  },
  {
    id: 6,
    name: "SAPCO (Société d'Aménagement de la Petite Côte)",
    logo: "🏖️",
    website: "https://www.sapco.sn",
    type: "institutionnel",
    description: "Facilite l'accès aux sites touristiques pour les compétitions nature et aventure.",
    isActive: true,
    createdAt: "2026-04-02",
  },
]

/* ═══════════════════════════════════════════
   ADMIN STATS (derived helpers)
   ═══════════════════════════════════════════ */

export function getAdminStats() {
  const totalCompetitions = competitions.length
  const activeCompetitions = competitions.filter((c) => c.status === "active").length
  const totalParticipants = competitions.reduce((sum, c) => sum + c.participantsCount, 0)
  const totalCompleted = competitions.reduce((sum, c) => sum + c.completedCount, 0)
  const avgCompletion = totalParticipants > 0 ? Math.round((totalCompleted / totalParticipants) * 100) : 0
  const activePartenaires = partenaires.filter((p) => p.isActive).length

  const byTheme: Record<string, number> = {}
  for (const c of competitions) {
    byTheme[c.themeId] = (byTheme[c.themeId] || 0) + 1
  }

  return {
    totalCompetitions,
    activeCompetitions,
    totalParticipants,
    totalCompleted,
    avgCompletion,
    activePartenaires,
    totalPartenaires: partenaires.length,
    byTheme,
  }
}
