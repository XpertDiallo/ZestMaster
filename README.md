# ZEST Master

ZEST Master est la première version web du module d'administration de ZEST, une plateforme d'assurance IARD en français pour la zone CIMA.

Cette version reprend les principes du module Master d'Azentio OneInsurance et les adapte sous forme de socle configurable pour deux familles de produits :

- Assurance Automobile
- Assurance des risques d'entreprises

L'objectif est de fournir les référentiels et règles qui alimenteront ensuite Zest User : produits, garanties, taxes, workflows, finance, sinistres et réassurance.

## Démarrage rapide

Ouvrir directement :

```text
index.html
```

Ou lancer un serveur local depuis ce dossier :

```bash
python -m http.server 5177 --bind 127.0.0.1
```

Puis ouvrir :

```text
http://127.0.0.1:5177/index.html
```

Les modifications sont conservées dans le stockage local du navigateur.

## Fonctionnalités

- Tableau de bord de configuration.
- Navigation par domaines Master.
- Référentiels génériques CIMA.
- Création, modification et suppression d'enregistrements.
- Statuts `Brouillon`, `À valider`, `Approuvé`.
- Approbation en masse.
- Clone d'enregistrement.
- Historique local des actions.
- Export CSV.
- Import JSON.
- Persistance locale via `localStorage`.

## Référentiels inclus

- Socle CIMA : pays, devises, calendriers, paramètres communs.
- Organisation : compagnies, agences, rôles, utilisateurs, listes de surveillance.
- Produits : automobile, risques d'entreprises, garanties, taxes, frais, matrices tarifaires, modèles de documents.
- Finance : plan comptable, liens sous-comptes, règles d'écritures.
- Sinistres : événements catastrophiques, réserves, salvage/recours, autorisations.
- Réassurance : traités proportionnels et non proportionnels.
- Gouvernance : workflows et approbations.

## Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── assets/
│   └── logo-zest.svg
├── data/
│   └── seed.js
└── docs/
    ├── ARCHITECTURE.md
    ├── DONNEES.md
    ├── FONCTIONNEL.md
    └── ROADMAP.md
```

## Documentation

- [Documentation fonctionnelle](docs/FONCTIONNEL.md)
- [Architecture technique](docs/ARCHITECTURE.md)
- [Données et référentiels](docs/DONNEES.md)
- [Roadmap](docs/ROADMAP.md)

## Statut

Version statique MVP. Elle est volontairement sans backend pour permettre de valider rapidement le périmètre Master avant la connexion à une base de données, à une authentification et aux futurs écrans Zest User.
