/* Wealth Quadrant Analyzer - Financial Objectives Module
   Creates short, medium and long term objectives using the same UI classes/styles.
*/
window.WQObjectives = (() => {
  const LS_KEY = 'wq_financial_objectives';
  const MAX_ROWS = 5;
  let activeUserId = null;

  const GROUPS = [
    { key: 'short', title: 'Short Term Objective', desc: 'Less than 3 years', tag: 't1', icon: '🎯' },
    { key: 'medium', title: 'Medium Term Objective', desc: '3 to 7 years', tag: 't2', icon: '📌' },
    { key: 'long', title: 'Long Term Objective', desc: 'More than 7 years', tag: 't3', icon: '🏁' }
  ];

  function R(id) { return document.getElementById(id); }
  function esc(v) {
    return String(v ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
  function getCurrentUserId() {
    return activeUserId || window.WQStorage?.getActiveUserId?.() || window.WQAuth?.getUserId?.() || null;
  }

  function localKey(userId = getCurrentUserId()) {
    return window.WQStorage?.getScopedLocalKey?.(LS_KEY, userId) || `${LS_KEY}:${userId || 'anonymous'}`;
  }

  function renderSection() {
    return `
      <div class="grp-block" id="personal-objectives-block">
        <div class="grp-label">Financial Objectives</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:1rem">
          Add financial goals by time horizon. Each category supports up to 5 objectives.
        </div>
        ${GROUPS.map(g => renderGroup(g)).join('')}
      </div>`;
  }

  function renderGroup(g) {
    return `
      <div class="card" id="obj-card-${g.key}">
        <div class="ch" onclick="WQObjectives.toggleCard(this)">
          <div class="ch-left">
            <div class="ci ${g.key === 'short' ? 'ci1' : g.key === 'medium' ? 'ci2' : 'ci3'}">${g.icon}</div>
            <div>
              <div class="ch-title">${g.title}</div>
              <div class="ch-sub">${g.desc} · Maximum ${MAX_ROWS} objectives</div>
            </div>
          </div>
          <div class="ch-right">
            <span class="ch-sum" id="obj-sum-${g.key}">0 / ${MAX_ROWS}</span>
            <svg class="chev" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>
        <div class="cb">
          <div style="display:grid;grid-template-columns:40px 1fr 160px 150px 30px;gap:6px;margin-bottom:6px">
            <div style="font-size:11px;color:var(--text3);padding:0 4px">No</div>
            <div style="font-size:11px;color:var(--text3);padding:0 4px">Objective</div>
            <div style="font-size:11px;color:var(--text3);padding:0 4px;text-align:right">Amount Expected</div>
            <div style="font-size:11px;color:var(--text3);padding:0 4px">Due Expected</div>
            <div></div>
          </div>
          <div class="exp-rows" id="obj-rows-${g.key}"></div>
          <button class="btn-add" onclick="WQObjectives.addObjectiveRow('${g.key}', event)">+ Add ${g.title.toLowerCase()}</button>
        </div>
      </div>`;
  }

  function mountIntoPersonalPage() {
    const page = R('page-personal')?.querySelector('.main-area');
    if (!page || R('personal-objectives-block')) return;
    const nav = page.querySelector('.seg-nav');
    nav?.insertAdjacentHTML('beforebegin', renderSection());
  }

  function toggleCard(h) {
    const b = h.nextElementSibling;
    const c = h.querySelector('.chev');
    const o = b.classList.contains('open');
    b.classList.toggle('open', !o);
    h.classList.toggle('open', !o);
    c?.classList.toggle('open', !o);
  }

  function addObjectiveRow(group, e, rowData = {}) {
    e?.stopPropagation?.();
    const wrap = R(`obj-rows-${group}`);
    if (!wrap) return;
    const count = wrap.querySelectorAll('.obj-row').length;
    if (count >= MAX_ROWS) {
      alert(`Maximum ${MAX_ROWS} objectives allowed for this category.`);
      return;
    }
    const row = document.createElement('div');
    row.className = 'obj-row exp-row';
    row.style.gridTemplateColumns = '40px 1fr 160px 150px 30px';
    row.dataset.group = group;
    row.innerHTML = `
      <input class="inp obj-no" type="text" value="${count + 1}" readonly style="text-align:center;padding-left:0">
      <input class="inp-t obj-text" type="text" placeholder="Objective" value="${esc(rowData.objective)}" oninput="WQObjectives.handleInput()">
      <div class="pfx-wrap"><span class="pfx">RM</span><input class="inp pl obj-amount" type="number" min="0" step="0.01" placeholder="0.00" value="${esc(rowData.amount_expected)}" oninput="WQObjectives.handleInput()"></div>
      <input class="inp-t obj-due" type="text" placeholder="MM/YYYY" value="${esc(rowData.due_expected)}" oninput="WQObjectives.handleInput()">
      <button class="btn-rm" onclick="WQObjectives.removeObjectiveRow(this, '${group}')">×</button>`;
    wrap.appendChild(row);
    renumber(group);
    handleInput();
  }

  function removeObjectiveRow(btn, group) {
    btn.closest('.obj-row')?.remove();
    renumber(group);
    handleInput();
  }

  function renumber(group) {
    const rows = Array.from(R(`obj-rows-${group}`)?.querySelectorAll('.obj-row') || []);
    rows.forEach((row, i) => { const no = row.querySelector('.obj-no'); if (no) no.value = i + 1; });
    const sum = R(`obj-sum-${group}`);
    if (sum) sum.textContent = `${rows.length} / ${MAX_ROWS}`;
  }

  function collectGroup(group) {
    return Array.from(R(`obj-rows-${group}`)?.querySelectorAll('.obj-row') || [])
      .map((row, index) => ({
        no: index + 1,
        category: group,
        objective: row.querySelector('.obj-text')?.value.trim() || '',
        amount_expected: parseFloat(row.querySelector('.obj-amount')?.value) || 0,
        due_expected: row.querySelector('.obj-due')?.value.trim() || ''
      }))
      .filter(r => r.objective || r.amount_expected || r.due_expected);
  }

  function collectData() {
    return {
      short: collectGroup('short'),
      medium: collectGroup('medium'),
      long: collectGroup('long')
    };
  }

  function loadDataIntoForm(data = {}) {
    GROUPS.forEach(g => {
      const wrap = R(`obj-rows-${g.key}`);
      if (wrap) wrap.innerHTML = '';
      (data[g.key] || []).slice(0, MAX_ROWS).forEach(row => addObjectiveRow(g.key, null, row));
      renumber(g.key);
    });
  }

  async function saveObjectives(data = collectData()) {
    const userId = getCurrentUserId();
    try { localStorage.setItem(localKey(userId), JSON.stringify(data)); } catch (e) {}
    if (!window.WQSupabase || !userId) return data;

    const rows = Object.values(data).flat().map(r => ({
      user_id: userId,
      category: r.category,
      objective: r.objective,
      amount_expected: r.amount_expected || 0,
      due_expected: r.due_expected,
      sort_order: r.no,
      updated_at: new Date().toISOString()
    }));

    const del = await WQSupabase.from('financial_objectives').delete().eq('user_id', userId);
    if (del.error) {
      console.warn('Objective delete failed; using local fallback:', del.error.message);
      return data;
    }
    if (rows.length) {
      const ins = await WQSupabase.from('financial_objectives').insert(rows);
      if (ins.error) console.warn('Objective save fallback only:', ins.error.message);
    }
    return data;
  }

  async function loadObjectives(userId) {
    activeUserId = userId || getCurrentUserId();
    let data = null;

    if (window.WQSupabase && activeUserId) {
      const { data: rows, error } = await WQSupabase
        .from('financial_objectives')
        .select('*')
        .eq('user_id', activeUserId)
        .order('category')
        .order('sort_order');
      if (!error && rows) {
        data = { short: [], medium: [], long: [] };
        rows.forEach(r => {
          const key = ['short', 'medium', 'long'].includes(r.category) ? r.category : 'short';
          data[key].push({
            no: r.sort_order,
            category: key,
            objective: r.objective || '',
            amount_expected: r.amount_expected || 0,
            due_expected: r.due_expected || ''
          });
        });
      }
    }

    if (!data) {
      try { data = JSON.parse(localStorage.getItem(localKey(activeUserId)) || 'null'); } catch (e) {}
    }
    loadDataIntoForm(data || { short: [], medium: [], long: [] });
    return collectData();
  }

  let saveTimer = null;
  function handleInput() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveObjectives().catch(console.warn), 350);
  }

  function getObjectives() {
    return collectData();
  }

  return {
    renderSection,
    mountIntoPersonalPage,
    toggleCard,
    addObjectiveRow,
    removeObjectiveRow,
    collectData,
    loadDataIntoForm,
    saveObjectives,
    loadObjectives,
    handleInput,
    getObjectives
  };
})();
