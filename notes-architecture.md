# Notes Architecture et Qualité de Code

Ce que j'ai pu anaylser comme étant les éléments à améliorer dans le projet, classés par ordre de priorité. Ces points sont basés sur les meilleures pratiques Angular et les principes de développement logiciel.

## 1. HttpClient utilisait directement dans les composants

Le service `HttpClient` utilisait directement dans les composants (`HomeComponent` et `CountryComponent`) pour faire des appels HTTP.

## 2. Code dupliqué et "Hardcoded"

L'url de l'api olympic.json est présent dans 2 fichiers, il faut donc le centraliser dans un service ou une constante partagée.

Le calcul du nombre total de médailles/athlètes est fait dans chaque composant. Cette logique métier doit être dans le Service ou des méthodes utilitaires partagées.

## 3. Absence de Typage Strict

Il n'y a aucune interface ou type défini pour les données récupérées de l'API. Tout est typé `any`, ce qui rend le code plus fragile et sujet à des erreurs de runtime.

## 4. Code à nettoyer (Clean Code)

Il y a plusieurs `console.log` dans le code qui sont probablement là pour le débogage. Ils doivent être supprimés pour éviter de polluer la console en production.

## 5. Pas d'analyse de data

Il n'y a aucune analyse ou transformation des données récupérées de l'API. Par exemple, on pourrait calculer le total des médailles et des athlètes directement dans le service pour éviter de dupliquer cette logique dans les composants.

## 6. Leak de memoire

Il n'y a pas de gestion des abonnements aux observables. Si les composants sont détruits, les abonnements ne sont pas nettoyés, ce qui peut entraîner des fuites de mémoire.

## 7. Semantique HTML

Certains éléments HTML ne sont pas utilisés de manière sémantique. Par exemple, les titres devraient être dans des balises `<h1>`, `<h2>`, etc., pour améliorer l'accessibilité et le SEO.

EX : Voir le lien suivant => [/src/app/pages/home/home.component.html](./src/app/pages/home/home.component.html) et remplacer les `<div>` par des balises plus appropriées.

## 8. Plan d'action

1. **Créer les interfaces** (`Olympic`, `Participation`) pour remplacer tous les `any`.
2. **Créer `OlympicService`** et y déplacer les appels `http.get`.
3. **Supprimer les `console.log`**.
4. **Ajouter des méthodes dans le service** pour calculer les totaux de médailles et d'athlètes.
5. **Mise à jour des routes** pour éviter les redondances et centraliser la logique de navigation.
6. **Utiliser des balises HTML sémantiques** pour structurer le contenu de manière plus claire et accessible.

---

# Nouvelle Architecture Proposée

```txt
.
├── README.md
├── angular.json
├── karma.conf.js
├── notes-architecture.md
├── package-lock.json
├── package.json
├── src
│   ├── app
│   │   ├── app-routing.module.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── components
│   │   │   └── header
│   │   │       ├── header.component.html
│   │   │       ├── header.component.scss
│   │   │       ├── header.component.spec.ts
│   │   │       └── header.component.ts
│   │   ├── models
│   │   │   ├── kpi.ts
│   │   │   ├── olympic.ts
│   │   │   └── participation.ts
│   │   ├── pages
│   │   │   ├── country
│   │   │   │   ├── country.component.html
│   │   │   │   ├── country.component.scss
│   │   │   │   ├── country.component.spec.ts
│   │   │   │   └── country.component.ts
│   │   │   ├── home
│   │   │   │   ├── home.component.html
│   │   │   │   ├── home.component.scss
│   │   │   │   ├── home.component.spec.ts
│   │   │   │   └── home.component.ts
│   │   │   └── not-found
│   │   │       ├── not-found.component.html
│   │   │       ├── not-found.component.scss
│   │   │       ├── not-found.component.spec.ts
│   │   │       └── not-found.component.ts
│   │   └── services
│   │       └── olympic.service.ts
│   ├── assets
│   │   ├── images
│   │   │   └── teleSport.png
│   │   └── mock
│   │       └── olympic.json
│   ├── environments
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.scss
│   └── test.ts
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

## Pourquoi ce choix d'architecture ?

Tout d'abord, je souhaite séparer clairement les différentes responsabilités au sein de l'application. En créant des dossiers distincts pour les composants, les services, les modèles et les pages, on facilite la navigation dans le projet et la maintenance du code.

## Composant

- `HeaderComponent` : Contiendra l'information de la page principale, et sera utilisé dans toutes les pages pour afficher le titre de la page courante (nom du pays, etc.).

## Pages

- `HomeComponent` : Page d'accueil avec un aperçu global.
- `CountryComponent` : Page listant tous les pays et leurs statistiques.
- `NotFoundComponent` : Page 404 pour les routes non définies.

Les pages utiliseront les composants pour afficher les données, mais ne contiendront pas de logique métier ou d'appels HTTP directs.

## Services

- `OlympicService` : Contiendra toute la logique de récupération des données depuis l'API et les méthodes de calcul (total médailles, total athlètes).

```ts
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class OlympicService {}
```

Voilà le singleton de service qu'il faut créer pour centraliser la logique métier et les appels HTTP.

## Modèles

- `Olympic` : Représentera un pays et ses participations.
- `Participation` : Représentera une participation à une édition des Jeux Olympiques.
