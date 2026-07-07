# Langa Bouri Connecté — Contrat d'API et Guide du Développeur Backend

Ce document sert de spécification technique et de contrat d'API entre le frontend Next.js et le futur backend. Il détaille, page par page, les endpoints attendus, les méthodes HTTP, les formats des requêtes/réponses, ainsi que les schémas de données associés pour toutes les fonctionnalités (Administration, Landing Page et Espace Joueur).

---

## 📋 Table des Matières
1. [Schémas Globaux de Base de Données](#1-schémas-globaux-de-base-de-données)
2. [Portail d'Administration (`/admin`)](#2-portail-dadministration-admin)
   - [Authentification Gateway](#authentification-gateway)
   - [Dashboard Statistiques & KPIs](#dashboard-statistiques--kpis)
   - [CRUD Gestion des Compétitions](#crud-gestion-des-compétitions)
   - [CRUD Partenaires & Boîte de Réception](#crud-partenaires--boîte-de-réception)
   - [CRUD Configuration des Catégories (Thèmes)](#crud-configuration-des-catégories-thèmes)
   - [CRUD Campagnes de Sponsoring & Publicités](#crud-campagnes-de-sponsoring--publicités)
3. [Landing Page & Interface Joueur (`/play`)](#3-landing-page--interface-joueur-play)
   - [Soumission de Partenariat](#soumission-de-partenariat)
   - [Chargement Dynamique des Événements et Thèmes](#chargement-dynamique-des-événements-et-thèmes)
   - [Vérification du Scan QR](#vérification-du-scan-qr)
   - [Sauvegarde du Chrono & Classement](#sauvegarde-du-chrono--classement)

---

## 1. Schémas Globaux de Base de Données

Les structures de données ci-dessous représentent le format JSON exact renvoyé par les API et attendu par le client Next.js.

### A. Catégorie / Thème (`ThemeConfig`)
```typescript
export type ThemeId = 'culture' | 'sport' | 'nature' | 'histoire' | 'science' | 'gastronomie' | string;

export interface ThemeConfig {
  id: ThemeId;                 // Clé unique primaire (ex: "culture")
  label: string;               // Nom affiché (ex: "Culture & Patrimoine")
  iconName: string;            // Icône Lucide correspondante (ex: "Landmark")
  description: string;         // Description éditable du domaine
  cssVars: {
    "--accent": string;        // Hex de couleur primaire (ex: "#d97706")
    "--gold": string;          // Hex de couleur secondaire (ex: "#fbbf24")
    "--ember": string;         // Hex de couleur d'emphase (ex: "#f59e0b")
    "--quest": string;         // Hex de couleur sombre textuelle (ex: "#78350f")
  };
  bodyClass: string;           // Classe CSS globale associée (ex: "theme-culture")
  decorKeywords: string[];     // Liste des mots-clés d'ambiance (ex: ["tradition", "patrimoine"])
}
```

### B. Compétition (`Competition`)
```typescript
export type CompetitionStatus = 'brouillon' | 'active' | 'terminée' | 'archivée';

export interface Competition {
  id: number;                          // Identifiant unique
  title: string;                       // Titre de la quête
  themeId: ThemeId;                    // Référence ID du Thème
  location: string;                    // Lieu (ex: "Saint-Louis, Sénégal")
  startDate: string;                   // Date de début (Format: YYYY-MM-DD)
  startTime: string;                   // Heure de début (Format: HH:MM)
  endDate: string;                     // Date de fin (Format: YYYY-MM-DD)
  endTime: string;                     // Heure de fin (Format: HH:MM)
  date: string;                        // Libellé de période généré (ex: "Du 15 Juillet à 08:00 au 20 Juillet à 18:00")
  status: CompetitionStatus;           // État actuel de publication
  totalFragments: number;              // Nombre total de défis de la chaîne
  reward: string;                      // Nom du prix final
  cover: string;                       // Image de couverture (URL ou string Base64)
  treasureLockedImage: string;         // Visuel du coffre fermé (URL ou string Base64)
  treasureUnlockedImage: string;       // Visuel du coffre ouvert (URL ou string Base64)
  participantsCount: number;           // Nombre de joueurs inscrits
  completedCount: number;              // Nombre de joueurs ayant terminé
  createdAt: string;                   // Date de création
  sponsorName?: string;                // Nom du sponsor associé (optionnel, choisi parmi les partenaires)
  fragments: Fragment[];               // Liste ordonnée des énigmes/défis
}
```

### C. Défi / Énigme (`Fragment`)
```typescript
export interface Fragment {
  id: number;
  index: string;                       // Indice d'étape (ex: "1/6")
  title: string;                       // Titre de l'étape
  place: string;                       // Point d'intérêt
  story: string;                       // Texte d'introduction/narration
  clue: string;                        // Indice pour trouver le point suivant
  media: 'image' | 'audio' | 'video';  // Format du média d'indice
  mediaUrl?: string;                   // Média associé (URL ou string Base64)
  reward?: string;                     // Prix d'étape (optionnel, vide si aucun)
  status: 'active' | 'locked' | 'completed'; // État de complétion individuel
  x: number;                           // Coordonnée X de positionnement sur la carte (en px)
  y: number;                           // Coordonnée Y de positionnement sur la carte (en px)
}
```

### D. Partenaire / Demande (`Partenaire`)
```typescript
export type PartenaireType = 'sponsor' | 'media' | 'institutionnel' | 'technique';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface Partenaire {
  id: number;
  org: string;                         // Nom de l'entreprise/marque
  name: string;                        // Nom du contact principal
  email: string;                       // Email de contact
  phone: string;                       // Téléphone
  website: string;                     // Lien externe
  type: PartenaireType;                // Catégorie de partenariat
  logo?: string;                       // Image du logo (URL ou string Base64)
  description: string;                 // Message ou biographie
  isActive: boolean;                   // Statut d'activation
  createdAt: string;
  status?: RequestStatus;              // Statut dans l'inbox des demandes (optionnel)
}
```

### E. Campagne de Sponsoring (`SponsoringCampaign`)
```typescript
export type AdFormat = 'text-image' | 'image' | 'video';
export type AdDisplayMode = 'banner' | 'fullscreen';

export interface ScreenAdConfig {
  enabled: boolean;                    // Activer les pubs sur cet écran
  format: AdFormat;                    // Format publicitaire souhaité
  displayMode: AdDisplayMode;          // Affichage (Bandeau sup. ou Interstitiel plein écran)
}

export interface SponsoringCampaign {
  id: string | number;
  sponsorName: string;                 // Référence de nom partenaire
  websiteUrl: string;                  // Lien de destination du CTA publicitaire
  mediaType: 'image' | 'video';        // Type de ressource média principal
  mediaUrl?: string;                   // Image ou vidéo publicitaire (Base64 stockée en base)
  isActive: boolean;                   // Est la campagne de sponsoring globale active
  skipDuration: number;                // Temps requis avant de pouvoir fermer la pub plein écran (en sec.)
  landing: ScreenAdConfig;             // Configuration d'affichage sur la Landing Page
  map: ScreenAdConfig;                 // Configuration d'affichage sur la Carte de jeu
  profile: ScreenAdConfig;             // Configuration d'affichage sur le Profil Joueur
}
```

---

## 2. Portail d'Administration (`/admin`)

### Authentification Gateway
Écran de contrôle d'accès pour protéger les routes administratives.
* **Endpoint** : `POST /api/auth/admin/login`
* **Requête** (JSON) :
  ```json
  {
    "username": "admin",
    "password": "admin-secure-password"
  }
  ```
* **Réponse** (JSON - Succès `200 OK`) :
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "username": "admin",
      "role": "administrator"
    }
  }
  ```

---

### Dashboard Statistiques & KPIs
Vue d'ensemble et rapports analytiques visualisés par graphiques interactifs.
* **Endpoint** : `GET /api/admin/stats`
* **Réponse** (JSON - Succès `200 OK`) :
  ```json
  {
    "kpis": {
      "totalCompetitions": 12,
      "activeCompetitions": 2,
      "totalParticipants": 248,
      "avgCompletion": 78,
      "activePartenaires": 5,
      "totalPartenaires": 8
    },
    "activityCurve": [
      { "month": "Janv", "registrants": 40, "completions": 24 },
      { "month": "Févr", "registrants": 65, "completions": 45 },
      { "month": "Mars", "registrants": 90, "completions": 70 },
      { "month": "Avril", "registrants": 120, "completions": 85 },
      { "month": "Mai", "registrants": 180, "completions": 110 },
      { "month": "Juin", "registrants": 248, "completions": 178 }
    ],
    "themeDistribution": [
      { "name": "Culture", "value": 4 },
      { "name": "Sport", "value": 2 },
      { "name": "Nature", "value": 3 },
      { "name": "Histoire", "value": 1 },
      { "name": "Science", "value": 1 },
      { "name": "Gastronomie", "value": 1 }
    ],
    "recentCompetitions": [
      {
        "id": 1,
        "title": "L'Héritage de Ndiadiane",
        "themeId": "culture",
        "status": "active",
        "participantsCount": 128
      }
    ]
  }
  ```

---

### CRUD Gestion des Compétitions
* **Lister les compétitions** : `GET /api/competitions`
* **Créer une compétition** : `POST /api/competitions`
* **Modifier une compétition** : `PUT /api/competitions/:id`
* **Supprimer une compétition** : `DELETE /api/competitions/:id`
* **Requête Payload (`POST`/`PUT`)** :
  Doit correspondre exactement à l'interface `Competition` définie en [1.B](#b-compétition-competition). Les fichiers d'images de couverture et médias d'énigmes peuvent être envoyés sous forme de chaînes de caractères Base64 ou gérés via un format de données multipart (`FormData`).

---

### CRUD Partenaires & Boîte de Réception
* **Lister les partenaires actifs et demandes** : `GET /api/partners`
  * **Réponse attendue** :
    ```json
    {
      "activePartners": [ /* Liste de Partenaire avec isActive: true */ ],
      "receivedRequests": [ /* Demandes avec status: 'pending' | 'approved' | 'rejected' */ ]
    }
    ```
* **Ajouter un partenaire manuellement** : `POST /api/partners`
* **Modifier un partenaire** : `PUT /api/partners/:id`
* **Supprimer un partenaire** : `DELETE /api/partners/:id`
* **Approuver une demande de partenariat** : `POST /api/partners/requests/:id/approve`
  * **Action backend** : Passe le statut de la demande à `approved`, et crée automatiquement un partenaire actif associé avec `isActive: true`.
* **Rejeter une demande** : `POST /api/partners/requests/:id/reject`
  * **Action backend** : Passe le statut de la demande à `rejected`.

---

### CRUD Configuration des Catégories (Thèmes)
* **Lister les catégories** : `GET /api/categories`
* **Créer une catégorie** : `POST /api/categories`
* **Modifier une catégorie** : `PUT /api/categories/:id`
* **Supprimer une catégorie** : `DELETE /api/categories/:id`
* **Requête Payload (`POST`/`PUT`)** :
  Doit correspondre exactement à l'interface `ThemeConfig` définie en [1.A](#a-catégorie--thème-themeconfig).

---

### CRUD Campagnes de Sponsoring & Publicités
* **Lister les campagnes publicitaires** : `GET /api/sponsoring`
* **Créer une campagne** : `POST /api/sponsoring`
* **Modifier une campagne** : `PUT /api/sponsoring/:id`
* **Supprimer une campagne** : `DELETE /api/sponsoring/:id`
* **Activer une campagne comme unique** : `POST /api/sponsoring/:id/activate`
  * **Action backend** : Définit `isActive: true` pour cette campagne, et bascule toutes les autres campagnes sur `isActive: false` (sélection exclusive).
* **Requête Payload (`POST`/`PUT`)** :
  Doit correspondre exactement à l'interface `SponsoringCampaign` définie en [1.E](#e-campagne-de-sponsoring-sponsoringcampaign). Les gros fichiers publicitaires (vidéos de démonstration ou images plein écran) doivent être stockés de manière optimale côté serveur.

---

## 3. Landing Page & Interface Joueur (`/play`)

### Soumission de Partenariat
Formulaire d'application public accessible depuis le modal de la Landing Page.
* **Endpoint** : `POST /api/partners/apply`
* **Requête** (JSON) :
  ```json
  {
    "org": "Entreprise XYZ",
    "name": "Seydou Diop",
    "email": "seydou@xyz.sn",
    "phone": "+221 77 987 65 43",
    "website": "https://xyz.sn",
    "type": "sponsor",
    "description": "Nous aimerions sponsoriser le prochain événement..."
  }
  ```
* **Réponse** (JSON) :
  ```json
  {
    "success": true,
    "message": "Votre demande a été envoyée avec succès et est en cours d'examen."
  }
  ```

---

### Chargement Dynamique des Événements et Thèmes
Le frontend Next.js récupère les configurations de thèmes et les compétitions actives pour alimenter dynamiquement la Landing Page et l'écran de progression des joueurs.
* **Récupérer les thèmes et les couleurs** : `GET /api/public/themes`
  * Renvoyer la liste complète des `ThemeConfig`.
* **Récupérer les événements actifs** : `GET /api/public/events/active`
  * Renvoyer la liste des compétitions dont le statut est `active` ou `brouillon` pour l'affichage de l'Expédition en Cours et du Calendrier des Événements à Venir.
* **Récupérer la campagne de sponsoring active** : `GET /api/public/sponsoring/active`
  * Renvoyer la configuration complète de la campagne de sponsoring active (`isActive: true`) afin d'appliquer dynamiquement les bannières publicitaires et interstitiels vidéo.

---

### Vérification du Scan QR
À chaque scan de code QR sur le terrain, l'application valide l'étape en cours et renvoie les détails de l'indice suivant.
* **Endpoint** : `POST /api/player/verify-scan`
* **Requête** (JSON) :
  ```json
  {
    "competitionId": 1,
    "fragmentId": 123,
    "playerToken": "session-player-token",
    "answer": "Margelle nord" // Optionnel, requis si une question anti-triche est active
  }
  ```
* **Réponse** (JSON - Validation Réussie) :
  ```json
  {
    "success": true,
    "unlockedNext": true,
    "nextFragment": {
      "id": 124,
      "index": "2/6",
      "title": "La Traversée du Fleuve",
      "place": "Rive du Saloum",
      "story": "Bravo ! Vous avez résolu l'énigme du Baobab...",
      "clue": "Cherchez près de l'embarcadère en bois flotté...",
      "media": "image",
      "mediaUrl": "/images/river-clue.png"
    }
  }
  ```

---

### Sauvegarde du Chrono & Classement
Une fois les 6 fragments validés, le chrono du joueur est gelé et sauvegardé.
* **Endpoint** : `POST /api/player/save-record`
* **Requête** (JSON) :
  ```json
  {
    "competitionId": 1,
    "nickname": "Gorgui_99",
    "elapsedSeconds": 3450 // Temps total écoulé de la quête
  }
  ```
* **Réponse** (JSON) :
  ```json
  {
    "success": true,
    "rank": 3,               // Position dans le classement en temps réel
    "totalCompetitors": 128,
    "badgeAwarded": "Couronne sacrée (Badge Or)"
  }
  ```
