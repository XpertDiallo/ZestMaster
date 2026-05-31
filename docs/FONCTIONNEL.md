# Documentation fonctionnelle

## Vision

ZEST Master administre les paramètres qui seront consommés par Zest User. Il joue le rôle de référentiel central pour une solution d'assurance IARD en français, adaptée aux besoins de la zone CIMA.

La version actuelle couvre le socle de paramétrage inspiré d'Azentio OneInsurance :

- référentiels Master ;
- statuts de validation ;
- approbation ;
- clone ;
- import et export ;
- historique ;
- segmentation par domaines métier.

## Domaines fonctionnels

### Socle CIMA

Ce domaine regroupe les paramètres transverses :

- pays CIMA ;
- régions UEMOA et CEMAC ;
- devises XOF et XAF ;
- calendriers ;
- paramètres communs.

### Organisation

Ce domaine configure les acteurs internes et externes :

- compagnies d'assurance ;
- agences et points de vente ;
- rôles et utilisateurs ;
- listes de surveillance.

### Produits

Ce domaine prépare les produits qui seront utilisés par Zest User :

- Automobile mono-véhicule ;
- Automobile flotte ;
- Risques d'entreprises multirisque ;
- garanties ;
- taxes, frais et commissions ;
- matrices tarifaires ;
- modèles de documents.

### Finance

Ce domaine prépare la génération d'écritures :

- plan comptable ;
- liens sous-comptes ;
- règles d'écritures.

### Sinistres

Ce domaine prépare la gestion des dossiers sinistres :

- événements catastrophiques ;
- paramétrage des réserves ;
- prestataires salvage et recours ;
- autorisations sinistres.

### Réassurance

Ce domaine prépare les règles de cession :

- traités proportionnels ;
- traités non proportionnels ;
- cessions ;
- commissions de réassurance ;
- priorités et portées XOL.

### Gouvernance

Ce domaine structure les validations :

- workflows ;
- rôles responsables ;
- seuils ;
- SLA.

## Cycle de vie d'un enregistrement

Un enregistrement peut avoir trois statuts :

- `Brouillon` : paramètre en préparation ;
- `À valider` : paramètre prêt pour contrôle ;
- `Approuvé` : paramètre validé et exploitable.

Lorsqu'un enregistrement approuvé est modifié, il repasse en `À valider`. Ce comportement reprend l'esprit du Master Azentio, où les référentiels validés doivent repasser par un contrôle après modification.

## Actions disponibles

- Nouveau : crée un enregistrement dans le référentiel actif.
- Modifier : ouvre le formulaire de détail.
- Supprimer : retire l'enregistrement.
- Approuver : passe la sélection au statut `Approuvé`.
- Cloner : crée une copie en `Brouillon`.
- Historique : affiche les actions locales enregistrées.
- Exporter : génère un fichier CSV du référentiel filtré.
- Importer : ajoute des enregistrements depuis un fichier JSON.

## Limites de la version MVP

- Pas encore d'authentification.
- Pas encore de base de données serveur.
- Pas encore d'API.
- Pas encore de calcul tarifaire réel.
- Les taux, plafonds et règles CIMA sont des paramètres génériques à confirmer avec les textes et barèmes officiels de chaque pays.
