# Architecture du Projet Olympic Games

## 1. Arborescence des Dossiers

L'application suit une structure modulaire standard Angular pour le dossier `src/app` :

```
src/app/
├── components/          # Composants réutilisables (UI pure)
│   └── header/          # En-tête dynamique (Titre + KPIs)
├── models/              # Interfaces TypeScript (Olympic, Participation, KPI)
├── pages/               # Pages principales (Vues routées)
│   ├── home/            # Tableau de bord principal
│   ├── country/         # Vue détaillée par pays
│   └── not-found/       # Page 404
├── services/            # Logique métier et gestion d'état
│   ├── data.service.ts  # Accès aux données et calculs métier
│   └── olympic.service.ts # Gestion de l'état de l'UI (Header)
├── app-routing.module.ts # Configuration des routes
└── app.module.ts        # Module racine
```

> **Note**: Les modèles de données (`Olympic`, `Participation`) sont définis pour garantir un typage strict dans toute l'application.

## 2. Rôles des Composants

### Pages

Ces composants sont liés aux routes et orchestrent l'affichage.

- **HomeComponent** (`/`) :
  - Affiche le graphique principal (Pie Chart).
  - Récupère les données via `DataService`.
  - Met à jour le titre et les KPIs globaux via `OlympicService`.
  - Gère la navigation vers les pages de détail.

- **CountryComponent** (`/country/:id`) :
  - Affiche les détails d'un pays spécifique (Line Chart).
  - Récupère les données filtrées via `DataService`.
  - Met à jour le titre (Nom du pays) et les KPIs spécifiques (Total athlètes, médailles) via `OlympicService`.
  - Gère le bouton "Retour".

- **NotFoundComponent** (`**`) :
  - Affiche un message d'erreur lorsque la route n'existe pas.

### Composants UI

- **HeaderComponent** :
  - Composant partagé affiché au-dessus du `router-outlet`.
  - N'a **aucune logique métier**.
  - S'abonne à `OlympicService` pour afficher dynamiquement :
    - Le titre de la page courante.
    - Les indicateurs clés (Number of JOs, Total Medals, etc.).

## 3. Services et Gestion des Données

L'architecture sépare clairement la **logique de données** de la **logique d'affichage**.

### `DataService`

Ce service est la source de vérité pour les données "froides" (provenant de l'API/Fichier).

- **Rôle** : Récupérer, mettre en cache, filtrer et transformer les données.
- **Méthodes clés** :
  - `getOlympicData()` : Retourne la liste complète des données (Observable).
  - `getOlympicsByCountry(id)` : Retourne les données d'un pays spécifique.
  - `calculateTotalMedals(olympics)`, `calculateTotalAthletes(olympics)` : Méthodes utilitaires pour les calculs.

### `OlympicService`

Ce service gère l'état volatil de l'interface utilisateur.

- **Rôle** : Servir de pont entre les pages (`Home`, `Country`) et le Header. Il évite de devoir passer des données complexe via des chaînes d'événements.
- **Fonctionnement** : Utilise des `BehaviorSubject` pour stocker le titre et les KPIs actuels.
- **Flow** :
  1. `HomeComponent` se charge → appelle `olympicService.updateHeaderData(...)`.
  2. `HeaderComponent` détecte le changement via une souscription et met à jour l'affichage.

## 4. Préparation à une future API Back-end

Cette architecture a été conçue pour faciliter la transition d'un fichier JSON local vers une véritable API REST :

1.  **Abstraction via les Services** :
    Les composants ne savent pas d'où viennent les données. Ils s'abonnent à des `Observable` fournis par `DataService`.
    _Modification future_ : Il suffira de changer l'URL dans `DataService` (`this.http.get('api/v1/olympics')`) sans toucher à une seule ligne de code dans les composants.

2.  **Typage Strict (Interfaces)** :
    L'utilisation d'interfaces (`Olympic`, `Participation`) garantit que si la structure de l'API change, les erreurs de compilation nous avertiront immédiatement des endroits à adapter.

3.  **Gestion Asynchrone (RxJS)** :
    L'application gère déjà les flux de données asynchrones (Observables). L'ajout de latence réseau ou de gestion d'erreurs HTTP réelles (404, 500) s'intègrera naturellement dans les `pipe()` existants du service.
