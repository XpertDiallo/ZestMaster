(() => {
  'use strict';

  const seed = window.ZEST_MASTER_SEED;
  const statuses = ['Brouillon', 'À valider', 'Approuvé'];
  const systemFields = [
    { key: 'status', label: 'Statut', type: 'select', options: statuses, required: true },
    { key: 'effectiveFrom', label: 'Valide du', type: 'date' },
    { key: 'effectiveTo', label: 'Valide au', type: 'date' },
    { key: 'notes', label: 'Notes', type: 'textarea' }
  ];

  const $ = (selector) => document.querySelector(selector);
  const ui = {
    domainNav: $('#domainNav'), dashboardButton: $('[data-dashboard]'), dashboardView: $('#dashboardView'), tableView: $('#tableView'),
    pageTitle: $('#pageTitle'), storageStatus: $('#storageStatus'), metricsGrid: $('#metricsGrid'), domainSummary: $('#domainSummary'), pendingList: $('#pendingList'),
    tableDomain: $('#tableDomain'), tableTitle: $('#tableTitle'), tableDescription: $('#tableDescription'), recordsHead: $('#recordsHead'), recordsBody: $('#recordsBody'),
    recordPreview: $('#recordPreview'), searchInput: $('#searchInput'), statusFilter: $('#statusFilter'), recordDialog: $('#recordDialog'), recordForm: $('#recordForm'),
    dialogMode: $('#dialogMode'), dialogTitle: $('#dialogTitle'), formFields: $('#formFields'), deleteRecordBtn: $('#deleteRecordBtn'), historyDialog: $('#historyDialog'),
    historyTitle: $('#historyTitle'), historyContent: $('#historyContent'), toast: $('#toast')
  };

  const tables = Object.fromEntries(seed.tables.map((table) => [table.id, table]));
  const domains = Object.fromEntries(seed.domains.map((domain) => [domain.id, domain]));
  const clone = (value) => JSON.parse(JSON.stringify(value));
  let currentTableId = null;
  let editingId = null;
  let selected = new Set();
  let state = loadState();

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(seed.meta.storageKey));
      if (saved && saved.recordsByTable && saved.history) return saved;
    } catch (error) {
      console.warn('Stockage local ZEST illisible.', error);
    }
    return {
      recordsByTable: Object.fromEntries(seed.tables.map((table) => [table.id, clone(table.records || [])])),
      history: []
    };
  }

  function saveState() {
    localStorage.setItem(seed.meta.storageKey, JSON.stringify(state));
    ui.storageStatus.textContent = 'Sauvegardé localement';
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  }

  function formatValue(value) {
    if (value === true) return 'Oui';
    if (value === false) return 'Non';
    if (value === undefined || value === null || value === '') return '-';
    return String(value);
  }

  function normalize(value) {
    return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function statusClass(status) {
    if (status === 'Approuvé') return 'approved';
    if (status === 'À valider') return 'review';
    return 'draft';
  }

  function primaryLabel(table, record) {
    const key = ['code', 'reference', 'compte', 'nom', 'libelle', 'raisonSociale', 'pays', 'description'].find((item) => record[item]);
    return key ? String(record[key]) : String(record[table.fields[0]?.key] || record.id);
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function allRecords() {
    return seed.tables.flatMap((table) => (state.recordsByTable[table.id] || []).map((record) => ({ table, record })));
  }

  function buildNavigation() {
    ui.domainNav.innerHTML = seed.domains.map((domain) => {
      const links = seed.tables.filter((table) => table.domain === domain.id).map((table) => `
        <button class='nav-item' type='button' data-table-id='${table.id}'>
          <span class='nav-mark'>${escapeHtml(table.mark)}</span>
          <span>${escapeHtml(table.label)}</span>
        </button>`).join('');
      return `<div class='domain-group'><div class='domain-title'>${escapeHtml(domain.label)}</div>${links}</div>`;
    }).join('');
  }

  function setActiveNav() {
    document.querySelectorAll('.nav-item').forEach((button) => button.classList.remove('active'));
    const active = currentTableId ? document.querySelector(`[data-table-id='${currentTableId}']`) : ui.dashboardButton;
    active?.classList.add('active');
  }

  function renderDashboard() {
    currentTableId = null;
    selected.clear();
    setActiveNav();
    ui.pageTitle.textContent = 'Vue d\'ensemble ZEST Master';
    ui.dashboardView.classList.remove('hidden');
    ui.tableView.classList.add('hidden');

    const records = allRecords();
    const approved = records.filter((item) => item.record.status === 'Approuvé').length;
    const pending = records.length - approved;
    const countryCount = (state.recordsByTable['pays-cima'] || []).filter((record) => record.actif).length;
    ui.metricsGrid.innerHTML = [
      metric('Référentiels', seed.tables.length, 'Tables génériques prêtes à paramétrer'),
      metric('Enregistrements', records.length, 'Données de démarrage ZEST'),
      metric('À valider', pending, 'Brouillons ou validations ouvertes'),
      metric('Approuvés', approved, `${countryCount} pays actifs dans le socle`)
    ].join('');

    ui.domainSummary.innerHTML = seed.domains.map((domain) => {
      const domainTables = seed.tables.filter((table) => table.domain === domain.id);
      const count = domainTables.reduce((total, table) => total + (state.recordsByTable[table.id] || []).length, 0);
      return `<article class='domain-tile'><button type='button' data-open-domain='${domainTables[0]?.id || ''}'>${escapeHtml(domain.label)}</button><p>${count} enregistrements dans ${domainTables.length} référentiel(s).</p><p>${escapeHtml(domain.description)}</p></article>`;
    }).join('');

    ui.domainSummary.querySelectorAll('[data-open-domain]').forEach((button) => button.addEventListener('click', () => openTable(button.dataset.openDomain)));
    const pendingItems = records.filter((item) => item.record.status !== 'Approuvé').slice(0, 8);
    ui.pendingList.innerHTML = pendingItems.length ? pendingItems.map((item) => `<article class='pending-item'><span class='status-badge ${statusClass(item.record.status)}'>${escapeHtml(item.record.status)}</span><strong>${escapeHtml(primaryLabel(item.table, item.record))}</strong><p>${escapeHtml(item.table.label)}</p></article>`).join('') : `<p class='empty-state'>Aucun enregistrement en attente.</p>`;
  }

  function metric(label, value, note) {
    return `<article class='metric'><span>${escapeHtml(label)}</span><strong>${value}</strong><p>${escapeHtml(note)}</p></article>`;
  }

  function openTable(tableId) {
    if (!tables[tableId]) return;
    currentTableId = tableId;
    selected.clear();
    ui.searchInput.value = '';
    ui.statusFilter.value = 'all';
    setActiveNav();
    ui.dashboardView.classList.add('hidden');
    ui.tableView.classList.remove('hidden');
    const table = tables[tableId];
    ui.pageTitle.textContent = table.label;
    ui.tableDomain.textContent = domains[table.domain]?.label || 'Référentiel';
    ui.tableTitle.textContent = table.label;
    ui.tableDescription.textContent = table.description;
    renderRows();
  }

  function filteredRecords() {
    const query = normalize(ui.searchInput.value);
    const status = ui.statusFilter.value;
    return (state.recordsByTable[currentTableId] || []).filter((record) => {
      const okStatus = status === 'all' || record.status === status;
      const okQuery = !query || normalize(Object.values(record).join(' ')).includes(query);
      return okStatus && okQuery;
    });
  }

  function renderRows() {
    const table = tables[currentTableId];
    const records = filteredRecords();
    const columns = table.fields.slice(0, 5);
    ui.recordsHead.innerHTML = `<tr><th class='checkbox-cell'>Choix</th><th>Statut</th>${columns.map((field) => `<th>${escapeHtml(field.label)}</th>`).join('')}<th class='actions-cell'>Actions</th></tr>`;
    ui.recordsBody.innerHTML = records.length ? records.map((record) => {
      const isSelected = selected.has(record.id);
      return `<tr data-record-id='${record.id}' class='${isSelected ? 'selected' : ''}'>
        <td class='checkbox-cell'><input type='checkbox' data-select-record='${record.id}' ${isSelected ? 'checked' : ''}></td>
        <td><span class='status-badge ${statusClass(record.status)}'>${escapeHtml(record.status)}</span></td>
        ${columns.map((field) => `<td title='${escapeHtml(formatValue(record[field.key]))}'>${escapeHtml(formatValue(record[field.key]))}</td>`).join('')}
        <td class='actions-cell'><div class='row-actions'><button class='small-icon' type='button' data-edit-record='${record.id}' title='Modifier'>✎</button><button class='small-icon' type='button' data-history-record='${record.id}' title='Historique'>◷</button></div></td>
      </tr>`;
    }).join('') : `<tr><td colspan='${columns.length + 3}' class='empty-state'>Aucun enregistrement ne correspond au filtre.</td></tr>`;
    renderPreview();
  }

  function selectedRecord() {
    const id = Array.from(selected)[0];
    return id ? (state.recordsByTable[currentTableId] || []).find((record) => record.id === id) : null;
  }

  function renderPreview() {
    const table = tables[currentTableId];
    const record = selectedRecord();
    if (!record) {
      ui.recordPreview.innerHTML = `<p class='eyebrow'>Sélection</p><h3>Aucun enregistrement</h3><p>Sélectionnez une ligne pour consulter ou modifier son détail.</p>`;
      return;
    }
    const rows = [...table.fields, ...systemFields].slice(0, 10).map((field) => `<div><span>${escapeHtml(field.label)}</span><strong>${escapeHtml(formatValue(record[field.key]))}</strong></div>`).join('');
    ui.recordPreview.innerHTML = `<p class='eyebrow'>Sélection</p><h3>${escapeHtml(primaryLabel(table, record))}</h3><span class='status-badge ${statusClass(record.status)}'>${escapeHtml(record.status)}</span><div class='preview-list'>${rows}</div>`;
  }

  function emptyRecord(table) {
    const record = { id: makeId(table.id), status: 'Brouillon', effectiveFrom: today(), effectiveTo: '', notes: '' };
    table.fields.forEach((field) => record[field.key] = field.type === 'checkbox' ? false : field.type === 'select' ? field.options?.[0] || '' : '');
    return record;
  }

  function openRecordDialog(record) {
    const table = tables[currentTableId];
    editingId = record?.id || null;
    const data = record ? clone(record) : emptyRecord(table);
    ui.dialogMode.textContent = record ? 'Modification' : 'Création';
    ui.dialogTitle.textContent = record ? primaryLabel(table, record) : `Nouvel enregistrement - ${table.label}`;
    ui.deleteRecordBtn.classList.toggle('hidden', !record);
    ui.formFields.innerHTML = [...table.fields, ...systemFields].map((field) => renderField(field, data[field.key])).join('');
    ui.recordDialog.showModal();
  }

  function renderField(field, value) {
    const label = `<label for='${field.key}'>${escapeHtml(field.label)} ${field.required ? `<span class='required'>*</span>` : ''}</label>`;
    if (field.type === 'select') return `<div class='form-field'>${label}<select id='${field.key}' name='${field.key}' ${field.required ? 'required' : ''}>${(field.options || []).map((option) => `<option value='${escapeHtml(option)}' ${option === value ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}</select></div>`;
    if (field.type === 'textarea') return `<div class='form-field full'>${label}<textarea id='${field.key}' name='${field.key}'>${escapeHtml(value || '')}</textarea></div>`;
    if (field.type === 'checkbox') return `<div class='form-field checkbox-field'><input id='${field.key}' name='${field.key}' type='checkbox' ${value ? 'checked' : ''}>${label}</div>`;
    return `<div class='form-field'>${label}<input id='${field.key}' name='${field.key}' type='${field.type || 'text'}' value='${escapeHtml(value || '')}' ${field.required ? 'required' : ''}></div>`;
  }

  function saveRecord(event) {
    event.preventDefault();
    const table = tables[currentTableId];
    const fields = [...table.fields, ...systemFields];
    const form = new FormData(ui.recordForm);
    const records = state.recordsByTable[currentTableId];
    const prior = editingId ? records.find((record) => record.id === editingId) : null;
    const next = prior ? clone(prior) : { id: makeId(table.id) };
    fields.forEach((field) => {
      if (field.type === 'checkbox') next[field.key] = form.has(field.key);
      else if (field.type === 'number') next[field.key] = form.get(field.key) === '' ? '' : Number(form.get(field.key));
      else next[field.key] = form.get(field.key) || '';
    });
    if (prior && prior.status === 'Approuvé' && next.status === 'Approuvé') next.status = 'À valider';
    if (prior) records[records.findIndex((record) => record.id === editingId)] = next;
    else records.push(next);
    logHistory(prior ? 'Modification' : 'Création', next);
    saveState();
    selected = new Set([next.id]);
    ui.recordDialog.close();
    renderRows();
    toast(prior ? 'Enregistrement mis à jour.' : 'Enregistrement créé.');
  }

  function deleteRecord() {
    const record = selectedRecord() || (state.recordsByTable[currentTableId] || []).find((item) => item.id === editingId);
    if (!record || !confirm(`Supprimer ${primaryLabel(tables[currentTableId], record)} ?`)) return;
    state.recordsByTable[currentTableId] = state.recordsByTable[currentTableId].filter((item) => item.id !== record.id);
    logHistory('Suppression', record);
    saveState();
    selected.clear();
    ui.recordDialog.close();
    renderRows();
    toast('Enregistrement supprimé.');
  }

  function logHistory(action, record) {
    state.history.push({ id: makeId('hist'), tableId: currentTableId, recordId: record.id, action, at: new Date().toISOString(), user: 'Administrateur ZEST', snapshot: clone(record) });
  }

  function approveSelected() {
    const ids = selected.size ? Array.from(selected) : filteredRecords().slice(0, 1).map((record) => record.id);
    if (!ids.length) return toast('Sélectionnez au moins un enregistrement.');
    state.recordsByTable[currentTableId].forEach((record) => { if (ids.includes(record.id)) { record.status = 'Approuvé'; logHistory('Approbation', record); } });
    saveState();
    renderRows();
    toast('Sélection approuvée.');
  }

  function cloneSelected() {
    const source = selectedRecord() || filteredRecords()[0];
    if (!source) return toast('Aucun enregistrement à cloner.');
    const copy = { ...clone(source), id: makeId(currentTableId), status: 'Brouillon', effectiveFrom: today(), notes: `Copie de ${primaryLabel(tables[currentTableId], source)}` };
    state.recordsByTable[currentTableId].push(copy);
    logHistory('Clone', copy);
    saveState();
    selected = new Set([copy.id]);
    renderRows();
    toast('Enregistrement cloné.');
  }

  function openHistory() {
    const record = selectedRecord();
    const entries = state.history.filter((entry) => entry.tableId === currentTableId && (!record || entry.recordId === record.id)).reverse();
    ui.historyTitle.textContent = record ? `Historique - ${primaryLabel(tables[currentTableId], record)}` : `Historique - ${tables[currentTableId].label}`;
    ui.historyContent.innerHTML = entries.length ? entries.map((entry) => `<article class='history-entry'><strong>${escapeHtml(entry.action)}</strong><time>${new Date(entry.at).toLocaleString('fr-FR')} par ${escapeHtml(entry.user)}</time><pre>${escapeHtml(JSON.stringify(entry.snapshot, null, 2))}</pre></article>`).join('') : `<p class='empty-state'>Aucun historique pour cette sélection.</p>`;
    ui.historyDialog.showModal();
  }

  function exportCsv() {
    const table = tables[currentTableId];
    const fields = [...table.fields, ...systemFields];
    const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const lines = [fields.map((field) => csvCell(field.label)).join(';'), ...filteredRecords().map((record) => fields.map((field) => csvCell(formatValue(record[field.key]))).join(';'))];
    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${currentTableId}-${today()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function importJson(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const payload = JSON.parse(reader.result);
      const records = Array.isArray(payload) ? payload : payload.records;
      records.forEach((record) => state.recordsByTable[currentTableId].push({ ...record, id: record.id || makeId(currentTableId), status: record.status || 'Brouillon' }));
      saveState();
      renderRows();
      toast('Import terminé.');
    };
    reader.readAsText(file);
  }

  function resetData() {
    if (!confirm('Réinitialiser ZEST Master avec les données de démarrage ?')) return;
    localStorage.removeItem(seed.meta.storageKey);
    state = loadState();
    currentTableId ? openTable(currentTableId) : renderDashboard();
  }

  function toast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add('visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => ui.toast.classList.remove('visible'), 2500);
  }

  buildNavigation();
  renderDashboard();
  ui.dashboardButton.addEventListener('click', renderDashboard);
  ui.domainNav.addEventListener('click', (event) => { const button = event.target.closest('[data-table-id]'); if (button) openTable(button.dataset.tableId); });
  $('#openProductsBtn').addEventListener('click', () => openTable('produits'));
  $('#newRecordBtn').addEventListener('click', () => openRecordDialog());
  $('#approveBtn').addEventListener('click', approveSelected);
  $('#cloneBtn').addEventListener('click', cloneSelected);
  $('#historyBtn').addEventListener('click', openHistory);
  $('#exportBtn').addEventListener('click', exportCsv);
  $('#resetDataBtn').addEventListener('click', resetData);
  $('#importInput').addEventListener('change', importJson);
  ui.searchInput.addEventListener('input', renderRows);
  ui.statusFilter.addEventListener('change', renderRows);
  ui.recordForm.addEventListener('submit', saveRecord);
  ui.deleteRecordBtn.addEventListener('click', deleteRecord);
  document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => ui.recordDialog.close()));
  document.querySelectorAll('[data-close-history]').forEach((button) => button.addEventListener('click', () => ui.historyDialog.close()));
  ui.recordsBody.addEventListener('click', (event) => {
    const checkbox = event.target.closest('[data-select-record]');
    const edit = event.target.closest('[data-edit-record]');
    const history = event.target.closest('[data-history-record]');
    const row = event.target.closest('[data-record-id]');
    if (checkbox) { checkbox.checked ? selected.add(checkbox.dataset.selectRecord) : selected.delete(checkbox.dataset.selectRecord); renderRows(); return; }
    if (edit) return openRecordDialog((state.recordsByTable[currentTableId] || []).find((record) => record.id === edit.dataset.editRecord));
    if (history) { selected = new Set([history.dataset.historyRecord]); renderRows(); return openHistory(); }
    if (row) { selected = new Set([row.dataset.recordId]); renderRows(); }
  });
})();
