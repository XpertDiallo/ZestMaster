# Roadmap

## Version actuelle

Application web statique de paramétrage Master :

- référentiels CIMA génériques ;
- CRUD ;
- approbation ;
- clone ;
- historique local ;
- import JSON ;
- export CSV.

## Prochaine étape courte

Créer le premier flux Zest User Automobile :

1. sélection du produit `AUTO-MONO` ;
2. création d'un devis ;
3. saisie client et véhicule ;
4. sélection des garanties ;
5. calcul de prime à partir des matrices ;
6. génération d'une police témoin.

## Backend cible

Mettre en place :

- API ;
- base de données ;
- authentification ;
- rôles ;
- permissions ;
- audit serveur ;
- journalisation des validations ;
- stockage centralisé des documents.

## Paramétrage métier à compléter

### Automobile

- catégories de véhicules ;
- usages ;
- puissances ;
- zones ;
- barèmes RC ;
- garanties facultatives ;
- règles flotte ;
- règles d'avenants ;
- attestations.

### Risques d'entreprises

- typologies d'activités ;
- classification NACE ou équivalent local ;
- capitaux ;
- surfaces ;
- chiffre d'affaires ;
- garanties incendie, dégâts des eaux, vol, RC exploitation ;
- exclusions ;
- franchises ;
- inspection de risque.

### Finance

- plan comptable définitif ;
- journaux ;
- schémas d'écritures ;
- taxes réelles par pays ;
- lettrage ;
- rapprochement.

### Sinistres

- réserves par garantie ;
- pouvoirs de règlement ;
- documents obligatoires ;
- recours ;
- salvage ;
- clôture et réouverture.

### Réassurance

- partenaires ;
- traités ;
- bordereaux ;
- cessions ;
- commissions ;
- XOL ;
- facultative.

## Déploiement futur

Options possibles :

- GitHub Pages pour la version statique ;
- Netlify ou Vercel pour une version frontend ;
- backend Node, Python ou autre stack selon le choix projet ;
- base PostgreSQL pour les référentiels validés.
