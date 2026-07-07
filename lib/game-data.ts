"use client"

export type Game = {
  title: string
  event: string
  player: string
  totalFragments: number
  treasureLockedImage: string
  treasureUnlockedImage: string
}

export const GAME: Game = {
  title: "Langa Bouri Connecté",
  event: "L'Héritage de Ndiadiane",
  player: "Explorateur Anonyme",
  totalFragments: 6,
  treasureLockedImage: "/images/treasure_locked.jpg",
  treasureUnlockedImage: "/images/treasure_unlocked.jpg",
}

export type Fragment = {
  id: number
  index: string
  title: string
  place: string
  story: string
  clue: string
  media: "image" | "audio" | "video"
  mediaUrl?: string
  reward: string
  status: "completed" | "active" | "locked"
  x: number
  y: number
}

export const fragments: Fragment[] = [
  {
    id: 1,
    index: "1/6",
    title: "Le Baobab des Anciens",
    place: "Village de Ndoumbélane",
    story: "C'est sous cet arbre centenaire que les anciens se réunissaient pour sceller les alliances et raconter les contes initiatiques.",
    clue: "Cherchez la branche orientée vers le couchant, là où le soleil touche la terre à l'équinoxe.",
    media: "audio",
    reward: "Fiole de parfum d'ambre",
    status: "active",
    x: 100,
    y: 60,
  },
  {
    id: 2,
    index: "2/6",
    title: "La Traversée du Fleuve",
    place: "Rive du Saloum",
    story: "Les pirogues de guerre traversaient ce bras de mer pour ravitailler le fort en cas de siège secret.",
    clue: "Près de l'embarcadère en bois flotté, sous la troisième lanterne de cuivre.",
    media: "image",
    reward: "",
    status: "locked",
    x: 240,
    y: 110,
  },
  {
    id: 3,
    index: "3/6",
    title: "Le Marché aux Épices",
    place: "Cité de Kaolack",
    story: "Un carrefour de senteurs et de couleurs où les marchands de tout le continent s'échangeaient de l'or contre des secrets parfumés.",
    clue: "Derrière l'étal du vendeur de piment rouge, contre le mar de briques crues.",
    media: "video",
    reward: "Sachet de gingembre rare",
    status: "locked",
    x: 80,
    y: 180,
  },
  {
    id: 4,
    index: "4/6",
    title: "Le Fort de l'Île",
    place: "Île de Gorée",
    story: "Les canons rouillés protègent encore l'entrée de la forteresse construite par les navigateurs d'autrefois.",
    clue: "Dans l'embrasure de la canonnière faisant face à l'est, gravé dans la pierre volcanique.",
    media: "image",
    reward: "Boussole en laiton gravé",
    status: "locked",
    x: 300,
    y: 240,
  },
  {
    id: 5,
    index: "5/6",
    title: "Le Puits Sacré",
    place: "Palais Royal de Diourbel",
    story: "Une eau claire et mystérieuse qui, dit-on, donnait la sagesse à ceux qui savaient y lire le reflet des étoiles.",
    clue: "Sur la margelle nord, sous la mousse sauvage qui cache le symbole de la royauté.",
    media: "audio",
    reward: "Aucune",
    status: "locked",
    x: 140,
    y: 310,
  },
  {
    id: 6,
    index: "6/6",
    title: "La Couronne Perdue",
    place: "Ruines de Saint-Louis",
    story: "L'insigne du pouvoir suprême, caché lors de la grande invasion pour ne jamais tomber entre les mains ennemies.",
    clue: "Dans la clé de voûte de la grande arche de briques rouges, à l'entrée de la crypte.",
    media: "image",
    reward: "Couronne sacrée (Badge Or)",
    status: "locked",
    x: 220,
    y: 380,
  },
]

export type UpcomingEvent = {
  id: number
  title: string
  location: string
  date: string
  reward: string
  cover: string
}

export const upcomingEventsByTheme: Record<string, UpcomingEvent[]> = {
  culture: [
    {
      id: 1,
      title: "Les Rituels du Masque Diola",
      location: "Ziguinchor",
      date: "15 Juillet 2026",
      reward: "Médaille du Patrimoine",
      cover: "/images/event-baobab.png",
    },
    {
      id: 2,
      title: "La Nuit des Contes sous le Baobab",
      location: "Saly Portudal",
      date: "28 Juillet 2026",
      reward: "Cauris de Sagesse",
      cover: "/images/event-river.png",
    },
    {
      id: 3,
      title: "La Cérémonie du Thé Secret",
      location: "Saint-Louis",
      date: "12 Août 2026",
      reward: "Tasse de Ninki-Nanka",
      cover: "/images/event-fort.png",
    },
  ],
  sport: [
    {
      id: 1,
      title: "Marathon des Dunes de Lompoul",
      location: "Désert de Lompoul",
      date: "19 Juillet 2026",
      reward: "Trophée des Sables",
      cover: "/images/event-river.png",
    },
    {
      id: 2,
      title: "Le Grand Combat des Lutteurs",
      location: "Arène Nationale de Dakar",
      date: "2 Août 2026",
      reward: "Drapeau d'Honneur",
      cover: "/images/event-baobab.png",
    },
    {
      id: 3,
      title: "Raid Nautique des Pirogues",
      location: "Somone",
      date: "23 Août 2026",
      reward: "Pagaie de Bronze",
      cover: "/images/event-fort.png",
    },
  ],
  nature: [
    {
      id: 1,
      title: "Exploration de la Réserve de Bandia",
      location: "Sindia",
      date: "24 Juillet 2026",
      reward: "Badge de l'Éco-Garde",
      cover: "/images/event-baobab.png",
    },
    {
      id: 2,
      title: "Piste de la Forêt de Casamance",
      location: "Oussouye",
      date: "7 Août 2026",
      reward: "Fleur de Fromager",
      cover: "/images/event-river.png",
    },
    {
      id: 3,
      title: "Le Sanctuaire des Oiseaux",
      location: "Djoudj",
      date: "30 Août 2026",
      reward: "Plume de Pélican d'Or",
      cover: "/images/event-fort.png",
    },
  ],
  histoire: [
    {
      id: 1,
      title: "Sur les Traces du Fort d'Estrées",
      location: "Île de Gorée",
      date: "14 Juillet 2026",
      reward: "Clé du Fort Historique",
      cover: "/images/event-fort.png",
    },
    {
      id: 2,
      title: "La Route du Comptoir Fluvial",
      location: "Podor",
      date: "3 Août 2026",
      reward: "Parchemin d'Archives",
      cover: "/images/event-river.png",
    },
    {
      id: 3,
      title: "Le Secret des Tombes Royales",
      location: "Mbour",
      date: "29 Août 2026",
      reward: "Bague Sigillée en Cuivre",
      cover: "/images/event-baobab.png",
    },
  ],
  science: [
    {
      id: 1,
      title: "Le Hackathon du Réseau Solaire",
      location: "Diamniadio",
      date: "20 Juillet 2026",
      reward: "Puce d'Or Technologique",
      cover: "/images/event-river.png",
    },
    {
      id: 2,
      title: "La Route du Code Perdu",
      location: "Technopole de Dakar",
      date: "9 Août 2026",
      reward: "Badge du Cryptologue",
      cover: "/images/event-baobab.png",
    },
    {
      id: 3,
      title: "Le Défi de l'Énergie Verte",
      location: "Saint-Louis",
      date: "6 Septembre 2026",
      reward: "Diode de Platine",
      cover: "/images/event-fort.png",
    },
  ],
  gastronomie: [
    {
      id: 1,
      title: "La Piste du Thiéboudienne Royal",
      location: "Saint-Louis",
      date: "18 Juillet 2026",
      reward: "Marmite d'Or",
      cover: "/images/event-fort.png",
    },
    {
      id: 2,
      title: "Le Secret du Ndambé Parfait",
      location: "Rufisque",
      date: "16 Août 2026",
      reward: "Sachet d'Épices Secrètes",
      cover: "/images/event-baobab.png",
    },
    {
      id: 3,
      title: "La Route du Café Touba",
      location: "Touba",
      date: "13 Septembre 2026",
      reward: "Graine de Djar d'Or",
      cover: "/images/event-river.png",
    },
  ],
}

// Fallback list mapping to culture for legacy imports
export const upcomingEvents: UpcomingEvent[] = upcomingEventsByTheme.culture

export type Achievement = {
  title: string
  description: string
  unlocked: boolean
}

export const achievements: Achievement[] = [
  { title: "Premier Pas", description: "Premier fragment trouvé", unlocked: true },
  { title: "Traverseur", description: "Franchir le fleuve du Saloum", unlocked: true },
  { title: "Nez d'Ambre", description: "Résoudre l'énigme du marché", unlocked: true },
  { title: "Gardien de l'Île", description: "Percer le secret du Fort", unlocked: false },
  { title: "Maître Griot", description: "Terminer une chasse complète", unlocked: false },
  { title: "Légende Vivante", description: "Entrer dans le top 3", unlocked: false },
]

export type Player = {
  rank: number
  initials: string
  name: string
  fragments: number
  time: string
}

export const leaderboard: Player[] = [
  { rank: 1, initials: "KD", name: "Khadim Diop", fragments: 6, time: "01:21:40" },
  { rank: 2, initials: "FS", name: "Fatou Sow", fragments: 6, time: "01:28:15" },
  { rank: 3, initials: "AM", name: "Amadou Mbacké", fragments: 6, time: "01:34:50" },
  { rank: 4, initials: "BN", name: "Binta Ndiaye", fragments: 5, time: "01:45:12" },
  { rank: 5, initials: "OS", name: "Ousmane Sy", fragments: 4, time: "01:52:08" },
]
