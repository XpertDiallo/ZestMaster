# Architecture technique

## Type d'application

ZEST Master est actuellement une application web statique sans dépendance externe.

Elle fonctionne avec :

- HTML ;
- CSS ;
- JavaScript navigateur ;
- stockage local du navigateur.

Cette approche permet de valider rapidement les écrans et le modèle de paramétrage avant de brancher un backend.

## Fichiers principaux

### `index.html`

Définit la structure de l'interface :

- barre latérale ;
- tableau de bord ;
- vue référentiel ;
- modales de création, modification et historique ;
- chargement des scripts.

### `styles.css`

Définit le design :

- identité visuelle ZEST ;
- mise en page responsive ;
- navigation ;
- tableaux ;
- formulaires ;
- badges de statut ;
- modales.

### `app.js`

Contient le moteur applicatif :

- chargement des données ;
- persistance dans `localStorage` ;
- rendu du tableau de bord ;
- rendu des référentiels ;
- filtres ;
- CRUD ;
- approbation ;
- clone ;
- historique ;
- import JSON ;
- export CSV.

### `data/seed.js`

Contient la configuration initiale :

- métadonnées ;
- domaines ;
- tables ;
- champs ;
- enregistrements de démarrage.

### `assets/logo-zest.svg`

Logo utilisé dans l'interface.

## Modèle de données

Le fichier `seed.js` expose `window.ZEST_MASTER_SEED`.

Chaque table contient :

- `id` : identifiant technique ;
- `domain` : domaine fonctionnel ;
- `label` : libellé affiché ;
- `mark` : code court de navigation ;
- `description` : description fonctionnelle ;
- `fields` : définition des champs ;
- `records` : enregistrements initiaux.

Chaque enregistrement contient aussi des champs système :

- `id` ;
- `status` ;
- `effectiveFrom` ;
- `effectiveTo` ;
- `notes`.

## Persistance

La clé de stockage local est définie dans :

```js
seed.meta.storageKey
```

Par défaut :

```text
zest-master-cima-v1
```

Les données modifiées restent dans le navigateur de l'utilisateur. Le bouton `Réinitialiser` supprime ces données locales et recharge le seed initial.

## Import JSON

L'import accepte :

```json
[
  {
    "code": "EXEMPLE",
    "status": "Brouillon"
  }
]
```

ou :

```json
{
  "records": [
    {
      "code": "EXEMPLE",
      "status": "Brouillon"
    }
  ]
}
```

Les enregistrements sans `id` reçoivent un identifiant généré.

## Evolution cible

La version backend pourra reprendre le même modèle logique :

- API REST ou GraphQL ;
- base relationnelle ;
- authentification ;
- rôles et permissions ;
- audit serveur ;
- versioning des référentiels ;
- publication contrôlée vers Zest User.
