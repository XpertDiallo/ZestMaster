# Données et référentiels

## Source initiale

Les référentiels de départ sont structurés à partir du manuel Master d'Azentio OneInsurance, puis adaptés à ZEST en français pour la zone CIMA.

Les données incluses sont génériques. Elles servent à démarrer l'application et doivent être validées ou remplacées par les données officielles de chaque compagnie et de chaque pays.

## Domaines

| Domaine | Objet |
| --- | --- |
| Socle CIMA | Pays, devises, calendriers, paramètres communs |
| Organisation | Compagnies, agences, rôles, listes de surveillance |
| Produits | Produits, garanties, taxes, frais, tarifs, documents |
| Finance | Plan comptable, sous-comptes, règles d'écritures |
| Sinistres | Evénements, réserves, prestataires, autorisations |
| Réassurance | Traités proportionnels et non proportionnels |
| Gouvernance | Workflows, seuils, SLA |

## Produits initialisés

### Automobile mono-véhicule

Code :

```text
AUTO-MONO
```

Produit témoin pour les premiers écrans Zest User.

### Automobile flotte entreprise

Code :

```text
AUTO-FLOTTE
```

Produit destiné aux entreprises avec plusieurs véhicules.

### Risques d'entreprises multirisque

Code :

```text
RDE-MULTI
```

Produit de départ pour l'assurance des risques d'entreprises.

## Statuts

| Statut | Usage |
| --- | --- |
| Brouillon | Enregistrement en préparation |
| À valider | Enregistrement prêt pour contrôle |
| Approuvé | Enregistrement validé |

## Champs système

Tous les référentiels partagent ces champs :

| Champ | Description |
| --- | --- |
| `id` | Identifiant technique |
| `status` | Statut fonctionnel |
| `effectiveFrom` | Date de début de validité |
| `effectiveTo` | Date de fin de validité |
| `notes` | Notes administratives |

## Règles de prudence

Les éléments suivants doivent être confirmés avant usage réel :

- taxes par pays ;
- frais accessoires ;
- commissions ;
- barèmes automobile ;
- franchises ;
- plafonds ;
- traités de réassurance ;
- plan comptable ;
- modèles de documents réglementaires ;
- workflows de délégation.

## Préparation pour Zest User

Zest User consommera prioritairement :

- `produits` ;
- `garanties` ;
- `taxes-frais` ;
- `matrices-tarifaires` ;
- `modeles-documents` ;
- `workflows` ;
- `regles-comptables` ;
- `traites-proportionnels` ;
- `traites-non-proportionnels`.
