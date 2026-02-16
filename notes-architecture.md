# Notes Architecture et Qualité de Code

Ce que j'ai pu anaylser comme étant les éléments à améliorer dans le projet, classés par ordre de priorité. Ces points sont basés sur les meilleures pratiques Angular et les principes de développement logiciel.

## 1. HttpClient utilisé directement dans les composants

Le service `HttpClient` est utilisé directement dans les composants (`HomeComponent` et `CountryComponent`) pour faire des appels HTTP. 

## 2. Code dupliqué et "Hardcoded"

L'url de l'api olympic.json est présent dans 2 fichiers, il faut donc le centraliser dans un service ou une constante partagée.

Le calcul du nombre total de médailles/athlètes est fait dans chaque composant. Cette logique métier doit être dans le Service ou des méthodes utilitaires partagées.

## 3. Absence de Typage Strict

Il n'y a aucune interface ou type défini pour les données récupérées de l'API. Tout est typé `any`, ce qui rend le code plus fragile et sujet à des erreurs de runtime.

## 4. Code à nettoyer (Clean Code)

Il y a plusieurs `console.log` dans le code qui sont probablement là pour le débogage. Ils doivent être supprimés pour éviter de polluer la console en production.

## 5. Pas d'analyse de data

## 6. Leak de memoire

Chart & subscribe

## 7. Semantique HTML

## 5. Plan d'action
1. **Créer les interfaces** (`Olympic`, `Participation`) pour remplacer tous les `any`.
2. **Créer `OlympicService`** et y déplacer les appels `http.get`.
3. **Supprimer les `console.log`**.
