# Olympic Games Dashboard

Ce projet éducatif est une application web développée avec [Angular](https://angular.io/) qui permet de visualiser sous forme de graphiques les données de participation des pays aux Jeux Olympiques.

## Table des matières

- [Olympic Games Dashboard](#olympic-games-dashboard)
  - [Table des matières](#table-des-matières)
  - [Fonctionnalités](#fonctionnalités)
  - [Technologies utilisées](#technologies-utilisées)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Scripts disponibles](#scripts-disponibles)
  - [Architecture du projet](#architecture-du-projet)
    - [Détail des dossiers clés](#détail-des-dossiers-clés)
  - [Données et Mock](#données-et-mock)
  - [Limites du projet](#limites-du-projet)

## Fonctionnalités

- **Tableau de bord (Accueil) :** Présentation globale des données olympiques avec des indicateurs clés (KPIs) et des graphiques.
- **Page de détail (Pays) :** Visualisation détaillée des participations pour un pays sélectionné.
- **Gestion des erreurs :** Page 404 en cas de route inexistante ou de données introuvables.
- **Responsive Design :** L'interface s'adapte aux différentes tailles d'écran (téléphone, tablette, desktop).

## Technologies utilisées

Ce projet s'appuie sur une stack technique moderne :

- **Angular CLI** version 18.0.6
- **TypeScript** pour la logique typée.
- **SCSS** pour la gestion des styles.
- **RxJS** pour la gestion des flux de données asynchrones.
- **Chart.js** pour la visualisation des données.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version LTS recommandée, ex: v18+ ou v20+)
- [NPM](https://www.npmjs.com/) (généralement inclus avec Node.js)
- Angular CLI (optionnel, mais recommandé) : `npm install -g @angular/cli`

## Installation

1. **Cloner le dépôt :**

   ```bash
   git clone <votre-url-du-repo>
   cd <repertoire-du-projet>
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

## Scripts disponibles

| Commande        | Description                                                                                                                                              |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm start`     | Lance le serveur de développement. Ouvrez votre navigateur sur `http://localhost:4200/`. L'application se recharge automatiquement lors des changements. |
| `npm run build` | Compile l'application pour la production dans le dossier `dist/`.                                                                                        |
| `npm run watch` | Compile l'application en mode développement et observe les changements.                                                                                  |
| `npm test`      | Exécute les tests unitaires via [Karma](https://karma-runner.github.io).                                                                                 |

## Architecture du projet

L'architecture suit les bonnes pratiques Angular en séparant clairement les responsabilités :

```
src/app/
├── components/      # Composants réutilisables (ex: Header)
├── models/          # Interfaces TypeScript définissant la structure des données (Olympic, Participation, Kpi)
├── pages/           # Composants de type "Page" (routage)
│   ├── home/        # Page d'accueil
│   ├── country/     # Page de détail d'un pays
│   └── not-found/   # Page d'erreur 404
├── services/        # Services pour la gestion des données (HTTP calls, observables)
└── app.module.ts    # Module principal
```

### Détail des dossiers clés

- **`services/olympic`** : Contient la logique métier, notamment `OlympicService`. Ce service est responsable de la récupération des données via des Observables RxJS pour garantir une gestion fluide de l'asynchronicité.
- **`pages/`** : Ces composants sont liés aux routes définies dans `app-routing.module.ts`. Ils orchestrent l'affichage en appelant les services et en passant les données aux composants de présentation.

## Données et Mock

L'application ne possède pas de backend réel pour ce prototype. Les données sont simulées via un fichier JSON statique.

- **Source :** `src/assets/mock/olympic.json`
- **Chargement :** Les données sont chargées via une requête HTTP interne simulée dans le service principal.

## Limites du projet

- **Données statiques :** Les données étant issues d'un fichier JSON local, aucune modification (CRUD) n'est persistée.
- **Pas d'authentification :** L'application est accessible publiquement sans connexion.
- **Backend :** L'absence de véritable API Backend limite les fonctionnalités temps réel ou dynamiques complexes.
- **Tests :** Les tests unitaires et d'intégration ne sont pas encore implémentés, ce qui peut affecter la maintenabilité à long terme.
