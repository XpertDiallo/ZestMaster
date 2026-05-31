window.ZEST_MASTER_SEED = (() => {
  const field = (key, label, type = 'text', options = [], required = false) => ({ key, label, type, options, required });
  const record = (id, status, data) => ({ id, status, effectiveFrom: '2026-01-01', effectiveTo: '', notes: data.notes || 'Paramètre générique à valider selon le pays et la compagnie.', ...data });
  const common = [field('code', 'Code', 'text', [], true), field('libelle', 'Libellé', 'text', [], true), field('module', 'Module', 'select', ['Souscription', 'Sinistres', 'Finance', 'Réassurance', 'Master', 'Transverse'])];

  const domains = [
    { id: 'socle', label: 'Socle CIMA', description: 'Pays, devises, calendriers et paramètres transverses.' },
    { id: 'parties', label: 'Organisation', description: 'Compagnies, agences, rôles, utilisateurs et tiers surveillés.' },
    { id: 'produits', label: 'Produits', description: 'Produits, garanties, taxes, frais, tarifs et documents.' },
    { id: 'finance', label: 'Finance', description: 'Plan comptable, sous-comptes et règles d\'écritures.' },
    { id: 'sinistres', label: 'Sinistres', description: 'Événements, réserves, prestataires de recours et pouvoirs.' },
    { id: 'reassurance', label: 'Réassurance', description: 'Traités proportionnels, non proportionnels et paramètres RI.' },
    { id: 'gouvernance', label: 'Gouvernance', description: 'Workflows, seuils d\'approbation et audit fonctionnel.' }
  ];

  const tables = [
    {
      id: 'pays-cima', domain: 'socle', label: 'Pays CIMA', mark: 'PC', description: 'Référentiel des pays de déploiement avec devise, fiscalité et activation commerciale.',
      fields: [field('code', 'Code pays', 'text', [], true), field('pays', 'Pays', 'text', [], true), field('region', 'Région', 'select', ['UEMOA', 'CEMAC'], true), field('devise', 'Devise', 'select', ['XOF', 'XAF'], true), field('tauxTaxeAssurance', 'Taxe assurance par défaut (%)', 'number'), field('actif', 'Actif', 'checkbox')],
      records: [record('pc-ci', 'Approuvé', { code: 'CI', pays: 'Côte d\'Ivoire', region: 'UEMOA', devise: 'XOF', tauxTaxeAssurance: 14, actif: true, notes: 'Pays pilote pour automobile.' }), record('pc-sn', 'À valider', { code: 'SN', pays: 'Sénégal', region: 'UEMOA', devise: 'XOF', tauxTaxeAssurance: 14, actif: true })]
    },
    {
      id: 'devises-calendriers', domain: 'socle', label: 'Devises et calendriers', mark: 'DC', description: 'Paramètres monétaires, précision d\'arrondi et calendriers de gestion.',
      fields: [field('code', 'Code', 'text', [], true), field('type', 'Type', 'select', ['Devise', 'Calendrier'], true), field('libelle', 'Libellé', 'text', [], true), field('symbole', 'Symbole'), field('precision', 'Précision', 'number'), field('joursOuvres', 'Jours ouvrés')],
      records: [record('dc-xof', 'Approuvé', { code: 'XOF', type: 'Devise', libelle: 'Franc CFA BCEAO', symbole: 'F CFA', precision: 0 }), record('dc-cal-ci', 'Brouillon', { code: 'CAL-CI-2026', type: 'Calendrier', libelle: 'Calendrier Côte d\'Ivoire', joursOuvres: 'Lundi-Vendredi' })]
    },
    {
      id: 'parametres-communs', domain: 'socle', label: 'Paramètres communs', mark: 'PA', description: 'Clés de configuration transverses utilisées par Zest User.', fields: [...common, field('valeur', 'Valeur'), field('niveau', 'Niveau', 'select', ['Global', 'Pays', 'Produit', 'Agence']), field('modifiableAgence', 'Modifiable agence', 'checkbox')],
      records: [record('pa-prefix', 'Approuvé', { code: 'POLICE_PREFIX', libelle: 'Préfixe des numéros de police', module: 'Souscription', valeur: 'ZST', niveau: 'Pays' }), record('pa-ri-auto', 'À valider', { code: 'RI_AUTO_ALLOC', libelle: 'Allocation RI automatique', module: 'Réassurance', valeur: 'true', niveau: 'Produit' })]
    },
    {
      id: 'compagnies', domain: 'parties', label: 'Compagnies d\'assurance', mark: 'CO', description: 'Entités porteuses du risque, agréments, pays et branches autorisées.',
      fields: [field('code', 'Code compagnie', 'text', [], true), field('raisonSociale', 'Raison sociale', 'text', [], true), field('pays', 'Pays', 'text', [], true), field('agrement', 'N° agrément'), field('branches', 'Branches'), field('contactFinance', 'Contact finance')],
      records: [record('co-zest-ci', 'À valider', { code: 'ZEST-CI', raisonSociale: 'ZEST Assurances Côte d\'Ivoire', pays: 'Côte d\'Ivoire', agrement: 'AGR-CI-0001', branches: 'Automobile, Risques d\'entreprises' }), record('co-zest-groupe', 'Brouillon', { code: 'ZEST-GRP', raisonSociale: 'ZEST Holding Assurance', pays: 'Zone CIMA', branches: 'Administration groupe' })]
    },
    {
      id: 'agences', domain: 'parties', label: 'Agences et points de vente', mark: 'AG', description: 'Réseau de distribution, rattachement pays et capacité opérationnelle.', fields: [field('code', 'Code agence', 'text', [], true), field('nom', 'Nom', 'text', [], true), field('pays', 'Pays'), field('ville', 'Ville'), field('canal', 'Canal', 'select', ['Siège', 'Agence', 'Courtier', 'Digital']), field('plafondEmission', 'Plafond émission', 'number')],
      records: [record('ag-abj', 'Approuvé', { code: 'ABJ-PLT', nom: 'Agence Abidjan Plateau', pays: 'Côte d\'Ivoire', ville: 'Abidjan', canal: 'Agence', plafondEmission: 5000000 }), record('ag-dkr', 'Brouillon', { code: 'DKR-CTR', nom: 'Agence Dakar Centre', pays: 'Sénégal', ville: 'Dakar', canal: 'Agence', plafondEmission: 3000000 })]
    },
    {
      id: 'roles-utilisateurs', domain: 'parties', label: 'Rôles et utilisateurs', mark: 'RU', description: 'Profils applicatifs, pouvoirs et rattachement aux modules Zest User.', fields: [field('code', 'Code', 'text', [], true), field('type', 'Type', 'select', ['Rôle', 'Utilisateur'], true), field('libelle', 'Libellé', 'text', [], true), field('modulePrincipal', 'Module principal', 'select', ['Souscription', 'Sinistres', 'Finance', 'Réassurance', 'Administration']), field('pays', 'Pays'), field('plafondValidation', 'Plafond validation', 'number')],
      records: [record('ru-admin', 'Approuvé', { code: 'ADMIN-MASTER', type: 'Rôle', libelle: 'Administrateur Zest Master', modulePrincipal: 'Administration', pays: 'Zone CIMA' }), record('ru-superviseur', 'À valider', { code: 'SUP-UW', type: 'Rôle', libelle: 'Superviseur souscription', modulePrincipal: 'Souscription', pays: 'Côte d\'Ivoire', plafondValidation: 10000000 })]
    },
    {
      id: 'listes-surveillance', domain: 'parties', label: 'Listes de surveillance', mark: 'LS', description: 'Clients ou tiers en liste grise, noire ou sanctionnée.', fields: [field('reference', 'Référence', 'text', [], true), field('nom', 'Nom ou raison sociale', 'text', [], true), field('typeListe', 'Type de liste', 'select', ['Liste grise', 'Liste noire', 'Sanction']), field('motif', 'Motif', 'textarea'), field('pays', 'Pays'), field('blocageEmission', 'Bloquer émission', 'checkbox')],
      records: [record('ls-demo', 'Brouillon', { reference: 'LS-0001', nom: 'Client de démonstration surveillé', typeListe: 'Liste grise', motif: 'Contrôle documentaire renforcé.', pays: 'Côte d\'Ivoire', blocageEmission: false }), record('ls-demo-2', 'À valider', { reference: 'LS-0002', nom: 'Tiers à contrôler', typeListe: 'Liste noire', motif: 'Blocage émission.', pays: 'Zone CIMA', blocageEmission: true })]
    },
    {
      id: 'produits', domain: 'produits', label: 'Produits d\'assurance', mark: 'PR', description: 'Produits commercialisés par pays, branche, segment et devise.', fields: [field('code', 'Code produit', 'text', [], true), field('nom', 'Nom produit', 'text', [], true), field('branche', 'Branche', 'select', ['Automobile', 'Risques d\'entreprises'], true), field('segment', 'Segment', 'select', ['Particulier', 'Entreprise', 'Flotte', 'PME', 'Grand compte']), field('pays', 'Pays'), field('devise', 'Devise', 'select', ['XOF', 'XAF'])],
      records: [record('pr-auto-mono', 'Approuvé', { code: 'AUTO-MONO', nom: 'Automobile mono-véhicule', branche: 'Automobile', segment: 'Particulier', pays: 'Zone CIMA', devise: 'XOF' }), record('pr-rde', 'Brouillon', { code: 'RDE-MULTI', nom: 'Risques d\'entreprises multirisque', branche: 'Risques d\'entreprises', segment: 'Entreprise', pays: 'Zone CIMA', devise: 'XOF' })]
    },
    {
      id: 'garanties', domain: 'produits', label: 'Garanties', mark: 'GA', description: 'Garanties obligatoires, optionnelles, plafonds, franchises et base de prime.', fields: [field('code', 'Code garantie', 'text', [], true), field('produit', 'Produit', 'text', [], true), field('nom', 'Nom garantie', 'text', [], true), field('nature', 'Nature', 'select', ['Obligatoire', 'Optionnelle']), field('basePrime', 'Base prime', 'select', ['Forfait', 'Capital', 'Puissance', 'Chiffre d\'affaires', 'Surface']), field('franchiseDefaut', 'Franchise défaut')],
      records: [record('ga-rc-auto', 'Approuvé', { code: 'RC-AUTO', produit: 'AUTO-MONO', nom: 'Responsabilité civile automobile', nature: 'Obligatoire', basePrime: 'Puissance', franchiseDefaut: '0' }), record('ga-inc-rde', 'Brouillon', { code: 'INC-RDE', produit: 'RDE-MULTI', nom: 'Incendie et explosions', nature: 'Obligatoire', basePrime: 'Capital' })]
    },
    {
      id: 'taxes-frais', domain: 'produits', label: 'Taxes, frais et commissions', mark: 'TF', description: 'Taux et frais applicables par pays, produit et transaction.', fields: [field('code', 'Code', 'text', [], true), field('pays', 'Pays'), field('produit', 'Produit'), field('nature', 'Nature', 'select', ['Taxe', 'Frais', 'Commission', 'Accessoire']), field('taux', 'Taux (%)', 'number'), field('montantFixe', 'Montant fixe', 'number')],
      records: [record('tf-taxe-auto', 'À valider', { code: 'TAXE-CI-AUTO', pays: 'Côte d\'Ivoire', produit: 'AUTO-MONO', nature: 'Taxe', taux: 14, montantFixe: 0 }), record('tf-accessoire', 'Brouillon', { code: 'ACC-AUTO', pays: 'Zone CIMA', produit: 'AUTO-MONO', nature: 'Accessoire', montantFixe: 2000 })]
    },
    {
      id: 'matrices-tarifaires', domain: 'produits', label: 'Matrices tarifaires', mark: 'MT', description: 'Barèmes génériques par produit, segment, critère et coefficient.', fields: [field('code', 'Code matrice', 'text', [], true), field('produit', 'Produit'), field('critere', 'Critère', 'select', ['Puissance', 'Valeur assurée', 'Usage', 'Chiffre d\'affaires', 'Zone']), field('borneMin', 'Borne min', 'number'), field('borneMax', 'Borne max', 'number'), field('coefficient', 'Coefficient', 'number')],
      records: [record('mt-auto-puiss', 'Approuvé', { code: 'AUTO-PUI-01', produit: 'AUTO-MONO', critere: 'Puissance', borneMin: 1, borneMax: 7, coefficient: 1 }), record('mt-rde-ca', 'Brouillon', { code: 'RDE-CA-01', produit: 'RDE-MULTI', critere: 'Chiffre d\'affaires', borneMin: 0, borneMax: 50000000, coefficient: 0.85 })]
    },
    {
      id: 'modeles-documents', domain: 'produits', label: 'Modèles de documents', mark: 'MD', description: 'Documents produits par Zest User.', fields: [field('code', 'Code modèle', 'text', [], true), field('module', 'Module', 'select', ['Souscription', 'Sinistres', 'Finance', 'Réassurance']), field('produit', 'Produit'), field('typeDocument', 'Type document', 'select', ['Devis', 'Police', 'Attestation', 'Quittance', 'Avis', 'Bordereau', 'Courrier']), field('langue', 'Langue', 'select', ['Français']), field('obligatoire', 'Obligatoire', 'checkbox')],
      records: [record('md-att-auto', 'À valider', { code: 'DOC-ATT-AUTO', module: 'Souscription', produit: 'AUTO-MONO', typeDocument: 'Attestation', langue: 'Français', obligatoire: true }), record('md-quittance', 'Brouillon', { code: 'DOC-QUIT', module: 'Finance', produit: 'Tous', typeDocument: 'Quittance', langue: 'Français', obligatoire: true })]
    },
    {
      id: 'comptes-comptables', domain: 'finance', label: 'Plan comptable', mark: 'PCO', description: 'Comptes principaux utilisés pour les écritures.', fields: [field('compte', 'Compte', 'text', [], true), field('libelle', 'Libellé'), field('classe', 'Classe'), field('nature', 'Nature', 'select', ['Actif', 'Passif', 'Produit', 'Charge', 'Tiers']), field('module', 'Module', 'select', ['Souscription', 'Sinistres', 'Finance', 'Réassurance']), field('lettrage', 'Lettrage requis', 'checkbox')],
      records: [record('pc-prime-auto', 'Approuvé', { compte: '701100', libelle: 'Primes émises automobile', classe: '7', nature: 'Produit', module: 'Souscription' }), record('pc-sinistre', 'Brouillon', { compte: '601500', libelle: 'Charges de sinistres', classe: '6', nature: 'Charge', module: 'Sinistres' })]
    },
    {
      id: 'liens-sous-comptes', domain: 'finance', label: 'Liens sous-comptes', mark: 'SC', description: 'Rattache les tiers aux comptes principaux.', fields: [field('reference', 'Référence', 'text', [], true), field('categorieEntite', 'Catégorie entité', 'select', ['Client', 'Agence', 'Courtier', 'Réassureur', 'Prestataire', 'Employé']), field('entite', 'Entité'), field('sousCompte', 'Sous-compte'), field('comptePrincipal', 'Compte principal'), field('multiCompte', 'Multi-compte autorisé', 'checkbox')],
      records: [record('sc-ag-abj', 'Approuvé', { reference: 'SC-AG-ABJ', categorieEntite: 'Agence', entite: 'ABJ-PLT', sousCompte: '411-ABJ-PLT', comptePrincipal: '411000', multiCompte: true }), record('sc-ri-demo', 'Brouillon', { reference: 'SC-RI-001', categorieEntite: 'Réassureur', entite: 'Pool RI Démo', sousCompte: '467-RI-001', comptePrincipal: '467000', multiCompte: true })]
    },
    {
      id: 'regles-comptables', domain: 'finance', label: 'Règles d\'écritures', mark: 'EC', description: 'Génération automatique des écritures par événement métier.', fields: [field('code', 'Code règle', 'text', [], true), field('evenement', 'Événement', 'select', ['Émission police', 'Encaissement', 'Annulation', 'Ouverture sinistre', 'Règlement sinistre', 'Cession RI']), field('debit', 'Compte débit'), field('credit', 'Compte crédit'), field('baseMontant', 'Base montant', 'select', ['Prime nette', 'Prime TTC', 'Taxe', 'Commission', 'Indemnité', 'Part RI']), field('journal', 'Journal')],
      records: [record('ec-emission-auto', 'À valider', { code: 'ECR-EMI-AUTO', evenement: 'Émission police', debit: '411000', credit: '701100', baseMontant: 'Prime nette', journal: 'UW' }), record('ec-taxe-auto', 'Brouillon', { code: 'ECR-TAXE-AUTO', evenement: 'Émission police', debit: '411000', credit: '445700', baseMontant: 'Taxe', journal: 'UW' })]
    },
    {
      id: 'evenements-catastrophiques', domain: 'sinistres', label: 'Événements catastrophiques', mark: 'EV', description: 'Référentiel des événements majeurs.', fields: [field('code', 'Code événement', 'text', [], true), field('description', 'Description'), field('typeEvenement', 'Type', 'select', ['Inondation', 'Incendie', 'Émeute', 'Tempête', 'Accident majeur', 'Autre']), field('localisation', 'Localisation'), field('dateSurvenance', 'Date survenance', 'date'), field('ouvert', 'Ouvert', 'checkbox')],
      records: [record('ev-demo', 'Brouillon', { code: 'CAT-2026-001', description: 'Événement de démonstration', typeEvenement: 'Inondation', localisation: 'Abidjan', dateSurvenance: '2026-04-15', ouvert: true }), record('ev-inc', 'À valider', { code: 'CAT-2026-002', description: 'Incendie majeur', typeEvenement: 'Incendie', localisation: 'Dakar', ouvert: true })]
    },
    {
      id: 'parametrage-reserves', domain: 'sinistres', label: 'Paramétrage réserves', mark: 'RS', description: 'Réserves initiales et règles d\'ajustement.', fields: [field('code', 'Code réserve', 'text', [], true), field('produit', 'Produit'), field('garantie', 'Garantie'), field('gravite', 'Gravité', 'select', ['Faible', 'Moyenne', 'Élevée', 'Corporel grave']), field('montantInitial', 'Montant initial', 'number'), field('validationRequise', 'Validation requise', 'checkbox')],
      records: [record('rs-auto-rc', 'À valider', { code: 'RS-AUTO-RC', produit: 'AUTO-MONO', garantie: 'RC-AUTO', gravite: 'Moyenne', montantInitial: 250000, validationRequise: true }), record('rs-rde-inc', 'Brouillon', { code: 'RS-RDE-INC', produit: 'RDE-MULTI', garantie: 'INC-RDE', gravite: 'Élevée', montantInitial: 2000000, validationRequise: true })]
    },
    {
      id: 'prestataires-recours', domain: 'sinistres', label: 'Prestataires salvage et recours', mark: 'SR', description: 'Prestataires de récupération, expertise et recours.', fields: [field('code', 'Code prestataire', 'text', [], true), field('nom', 'Nom'), field('typePrestataire', 'Type', 'select', ['Expert', 'Garage', 'Récupérateur', 'Avocat', 'Médecin conseil']), field('pays', 'Pays'), field('modePaiement', 'Mode paiement', 'select', ['Virement', 'Chèque', 'Mobile money']), field('plafondCredit', 'Plafond crédit', 'number')],
      records: [record('sr-expert', 'Brouillon', { code: 'EXP-001', nom: 'Expertise Auto Démo', typePrestataire: 'Expert', pays: 'Côte d\'Ivoire', modePaiement: 'Virement', plafondCredit: 1000000 }), record('sr-garage', 'À valider', { code: 'GAR-001', nom: 'Garage Partenaire Démo', typePrestataire: 'Garage', pays: 'Sénégal', modePaiement: 'Virement', plafondCredit: 500000 })]
    },
    {
      id: 'autorisations-sinistres', domain: 'sinistres', label: 'Autorisations sinistres', mark: 'AS', description: 'Pouvoirs de validation des réserves et règlements.', fields: [field('code', 'Code autorisation', 'text', [], true), field('role', 'Rôle'), field('action', 'Action', 'select', ['Ouvrir', 'Réserver', 'Réviser réserve', 'Régler', 'Clôturer', 'Rouvrir']), field('produit', 'Produit'), field('plafond', 'Plafond', 'number'), field('doubleValidation', 'Double validation', 'checkbox')],
      records: [record('as-auto', 'À valider', { code: 'AUTH-REG-AUTO', role: 'Gestionnaire sinistres', action: 'Régler', produit: 'AUTO-MONO', plafond: 1000000, doubleValidation: false }), record('as-rde', 'Brouillon', { code: 'AUTH-REG-RDE', role: 'Responsable sinistres', action: 'Régler', produit: 'RDE-MULTI', plafond: 10000000, doubleValidation: true })]
    },
    {
      id: 'traites-proportionnels', domain: 'reassurance', label: 'Traités proportionnels', mark: 'TP', description: 'Quote-part, excédent de plein, commissions et limites.', fields: [field('code', 'Code traité', 'text', [], true), field('nom', 'Nom'), field('produit', 'Produit'), field('typeTraite', 'Type', 'select', ['Quote-part', 'Excédent de plein']), field('cession', 'Cession (%)', 'number'), field('commissionRi', 'Commission RI (%)', 'number')],
      records: [record('tp-auto', 'Brouillon', { code: 'RI-AUTO-QP', nom: 'Quote-part automobile générique', produit: 'AUTO-MONO', typeTraite: 'Quote-part', cession: 30, commissionRi: 20 }), record('tp-rde', 'À valider', { code: 'RI-RDE-EP', nom: 'Excédent risques entreprises', produit: 'RDE-MULTI', typeTraite: 'Excédent de plein', cession: 40, commissionRi: 18 })]
    },
    {
      id: 'traites-non-proportionnels', domain: 'reassurance', label: 'Traités non proportionnels', mark: 'TN', description: 'Excédent de sinistre, priorité, portée et reconstitutions.', fields: [field('code', 'Code traité', 'text', [], true), field('nom', 'Nom'), field('produit', 'Produit'), field('priorite', 'Priorité', 'number'), field('portee', 'Portée', 'number'), field('reconstitutions', 'Reconstitutions', 'number')],
      records: [record('tn-rde-cat', 'Brouillon', { code: 'XOL-RDE-CAT', nom: 'XOL catastrophe risques entreprises', produit: 'RDE-MULTI', priorite: 50000000, portee: 500000000, reconstitutions: 1 }), record('tn-auto', 'À valider', { code: 'XOL-AUTO', nom: 'XOL automobile corporel', produit: 'AUTO-MONO', priorite: 20000000, portee: 200000000, reconstitutions: 1 })]
    },
    {
      id: 'workflows', domain: 'gouvernance', label: 'Workflows et approbations', mark: 'WF', description: 'Étapes, rôles responsables, SLA et seuils par module.', fields: [field('code', 'Code workflow', 'text', [], true), field('module', 'Module', 'select', ['Souscription', 'Sinistres', 'Finance', 'Réassurance', 'Master']), field('etape', 'Étape'), field('roleResponsable', 'Rôle responsable'), field('seuil', 'Seuil', 'number'), field('slaHeures', 'SLA heures', 'number')],
      records: [record('wf-master', 'Approuvé', { code: 'WF-MASTER-APP', module: 'Master', etape: 'Approbation référentiel', roleResponsable: 'ADMIN-MASTER', seuil: 0, slaHeures: 24 }), record('wf-uw', 'À valider', { code: 'WF-UW-REF', module: 'Souscription', etape: 'Referral souscription', roleResponsable: 'SUP-UW', seuil: 5000000, slaHeures: 8 })]
    },
    {
      id: 'audit-parametres', domain: 'gouvernance', label: 'Audit des paramètres', mark: 'AU', description: 'Registre des contrôles et revues périodiques des référentiels.', fields: [field('code', 'Code audit', 'text', [], true), field('referentiel', 'Référentiel'), field('frequence', 'Fréquence', 'select', ['Mensuelle', 'Trimestrielle', 'Semestrielle', 'Annuelle']), field('responsable', 'Responsable'), field('dernierControle', 'Dernier contrôle', 'date'), field('ecartOuvert', 'Écart ouvert', 'checkbox')],
      records: [record('au-produits', 'Brouillon', { code: 'AUD-PROD', referentiel: 'Produits', frequence: 'Trimestrielle', responsable: 'ADMIN-MASTER', dernierControle: '2026-05-01', ecartOuvert: false }), record('au-finance', 'À valider', { code: 'AUD-FIN', referentiel: 'Finance', frequence: 'Mensuelle', responsable: 'Responsable finance', dernierControle: '2026-05-15', ecartOuvert: true })]
    }
  ];

  return {
    meta: { name: 'ZEST Master', version: '0.1.0', locale: 'fr-CI', storageKey: 'zest-master-cima-v1', source: 'Socle Master inspiré d\'Azentio OneInsurance et adapté à ZEST pour la zone CIMA.' },
    domains,
    tables
  };
})();
