export type FragmentStatus = "completed" | "active" | "locked"

export type Fragment = {
  id: number
  index: string
  title: string
  place: string
  status: FragmentStatus
  /** position on the illustrated map in % */
  x: number
  y: number
  story: string
  clue: string
  media: "image" | "audio" | "video"
  reward: string
}

export const GAME = {
  title: "Langa Bouri Connecté",
  subtitle:
    "Une chasse au trésor traditionnelle transformée en aventure numérique",
  event: "L'Héritage de Ndiadiane",
  totalFragments: 6,
  foundFragments: 3,
  player: "Explorateur Anonyme",
}

export const fragments: Fragment[] = [
  {
    id: 1,
    index: "1/6",
    title: "Le Baobab des Anciens",
    place: "Village de Ndoumbélane",
    status: "completed",
    x: 22,
    y: 30,
    story:
      "Sous l'arbre à palabres, les griots gardent la première parole de la quête.",
    clue: "Là où l'ombre est la plus vieille, la racine désigne le nord.",
    media: "image",
    reward: "Perle d'or ancienne",
  },
  {
    id: 2,
    index: "2/6",
    title: "La Traversée du Fleuve",
    place: "Rive du Saloum",
    status: "completed",
    x: 44,
    y: 52,
    story:
      "Le pêcheur connaît le gué secret que seuls les initiés empruntent.",
    clue: "Compte les pirogues amarrées : leur nombre ouvre le second sceau.",
    media: "audio",
    reward: "Cauri gravé",
  },
  {
    id: 3,
    index: "3/6",
    title: "Le Marché aux Épices",
    place: "Cité de Kaolack",
    status: "completed",
    x: 63,
    y: 34,
    story:
      "Dans la poussière du marché, une odeur de menthe cache une inscription.",
    clue: "Le marchand au turban bleu récite un proverbe : retiens le dernier mot.",
    media: "image",
    reward: "Fiole de parfum d'ambre",
  },
  {
    id: 4,
    index: "4/6",
    title: "Le Fort de l'Île",
    place: "Île de Gorée",
    status: "active",
    x: 78,
    y: 62,
    story:
      "Les murs de pierre ont vu passer les navigateurs. Une énigme y sommeille depuis 1802.",
    clue: "Face au phare, la pierre descellée révèle un chiffre romain. Traduis-le.",
    media: "video",
    reward: "Fragment de carte originelle",
  },
  {
    id: 5,
    index: "5/6",
    title: "La Colline Sacrée",
    place: "Massif de Bandia",
    status: "locked",
    x: 35,
    y: 74,
    story: "Un sentier oublié mène au sommet où le vent murmure des noms.",
    clue: "Résous d'abord l'énigme du Fort pour déverrouiller ce lieu.",
    media: "image",
    reward: "Amulette de bronze",
  },
  {
    id: 6,
    index: "6/6",
    title: "Le Trésor de Langa Bouri",
    place: "Grotte de la Falaise",
    status: "locked",
    x: 84,
    y: 20,
    story: "Le coffre final, gardé par la légende, attend l'aventurier digne.",
    clue: "Réunis les cinq fragments pour tracer le chemin vers le trésor.",
    media: "image",
    reward: "Le Trésor de Langa Bouri",
  },
]

export type Player = {
  rank: number
  name: string
  initials: string
  time: string
  fragments: number
}

export const leaderboard: Player[] = [
  { rank: 1, name: "Aïssatou D.", initials: "AD", time: "02:14:07", fragments: 6 },
  { rank: 2, name: "Mamadou S.", initials: "MS", time: "02:31:42", fragments: 6 },
  { rank: 3, name: "Fatou N.", initials: "FN", time: "02:47:19", fragments: 6 },
  { rank: 4, name: "Ousmane B.", initials: "OB", time: "03:02:55", fragments: 5 },
  { rank: 5, name: "Khadija T.", initials: "KT", time: "03:18:30", fragments: 5 },
  { rank: 6, name: "Ibrahima F.", initials: "IF", time: "03:40:11", fragments: 4 },
  { rank: 7, name: "Awa C.", initials: "AC", time: "04:05:48", fragments: 4 },
  { rank: 8, name: "Cheikh L.", initials: "CL", time: "04:22:03", fragments: 3 },
]

export type UpcomingEvent = {
  id: number
  title: string
  location: string
  date: string
  difficulty: "Facile" | "Intermédiaire" | "Expert"
  reward: string
  cover: string
}

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: 1,
    title: "Les Gardiens du Baobab",
    location: "Sine-Saloum",
    date: "12 Juillet 2026",
    difficulty: "Facile",
    reward: "Médaille de l'Explorateur",
    cover: "/images/event-baobab.png",
  },
  {
    id: 2,
    title: "La Route des Pirogues",
    location: "Delta du Saloum",
    date: "26 Juillet 2026",
    difficulty: "Intermédiaire",
    reward: "Cauris d'Or + 500 pts",
    cover: "/images/event-river.png",
  },
  {
    id: 3,
    title: "Le Secret du Fort",
    location: "Île de Gorée",
    date: "9 Août 2026",
    difficulty: "Expert",
    reward: "Carte au trésor originale",
    cover: "/images/event-fort.png",
  },
]

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
