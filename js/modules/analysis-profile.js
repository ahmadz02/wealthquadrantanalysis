/* Wealth Quadrant Analyzer - Analysis Profile Module
   Injects Basic Personal Data and Financial Objectives into the Analysis page before Financial Overview.
*/
window.WQAnalysisProfile = (() => {
  function R(id) { return document.getElementById(id); }
  function esc(v) {
    return String(v ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
  function fmtRM(v) {
    const n = parseFloat(v) || 0;
    return 'RM ' + Math.abs(n).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function profile() {
    return window.WQPersonalData?.getProfile?.() || {};
  }

  function objectives() {
    return window.WQObjectives?.getObjectives?.() || { short: [], medium: [], long: [] };
  }

  function renderPersonalInfo(profileData = profile()) {
    const spouse = profileData.spouse || {};
    const children = profileData.children || [];
    return `
      <div class="grp-block" id="analysis-personal-info">
        <div class="grp-label">Basic Personal Data</div>
        <div class="quad-grid" style="margin-bottom:0">
          <div class="quad-card" style="cursor:default">
            <div class="q-head qg">Main Client</div>
            <div class="q-body">
              ${infoRow('Name', profileData.full_name)}
              ${infoRow('IC Number', profileData.ic_number)}
              ${infoRow('Current Age', profileData.current_age)}
              ${infoRow('Phone Number', profileData.phone)}
              ${infoRow('Email', profileData.email)}
              ${infoRow('Profession', profileData.profession)}
            </div>
          </div>
          <div class="quad-card" style="cursor:default">
            <div class="q-head qb">Address & Family</div>
            <div class="q-body">
              ${infoRow('Home Address', profileData.home_address)}
              <div class="q-div"></div>
              ${profileData.spouse_enabled ? `
                <div class="q-row"><span style="font-weight:500;color:var(--text)">Spouse Info</span><span></span></div>
                ${infoRow('Name', spouse.name)}
                ${infoRow('Phone', spouse.phone)}
                ${infoRow('Profession', spouse.profession)}
              ` : '<div class="q-row" style="color:var(--text3);font-style:italic"><span>No spouse info added</span><span></span></div>'}
              <div class="q-div"></div>
              ${profileData.children_enabled && children.length ? `
                <div class="q-row"><span style="font-weight:500;color:var(--text)">Children Info</span><span>${children.length}</span></div>
                ${children.map(c => infoRow(c.name || 'Child', c.age ? `${c.age} years old` : '')).join('')}
              ` : '<div class="q-row" style="color:var(--text3);font-style:italic"><span>No child info added</span><span></span></div>'}
            </div>
          </div>
        </div>
      </div>`;
  }

  function infoRow(label, value) {
    return `<div class="q-row"><span>${esc(label)}</span><span class="q-val" style="text-align:right;max-width:58%;white-space:normal">${esc(value || '—')}</span></div>`;
  }

  function renderObjectives(objData = objectives()) {
    return `
      <div class="grp-block" id="analysis-objectives">
        <div class="grp-label">List of Financial Objectives</div>
        ${objectiveTable('Short Term Objective', 'Less than 3 years', objData.short || [])}
        ${objectiveTable('Medium Term Objective', '3 to 7 years', objData.medium || [])}
        ${objectiveTable('Long Term Objective', 'More than 7 years', objData.long || [])}
      </div>`;
  }

  function objectiveTable(title, desc, rows) {
    return `
      <div class="grp-sub">${esc(title)} <span style="font-weight:400;color:var(--text3)">(${esc(desc)})</span></div>
      <div class="a-card" style="margin-bottom:1rem;padding:1rem">
        <table class="bk-table">
          <thead>
            <tr>
              <th style="width:44px">No</th>
              <th>Objective</th>
              <th style="text-align:right">Amount Expected</th>
              <th style="text-align:right">Due Expected</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${esc(r.objective || '—')}</td>
                <td style="text-align:right;font-family:'DM Mono',monospace">${fmtRM(r.amount_expected)}</td>
                <td style="text-align:right;font-family:'DM Mono',monospace">${esc(r.due_expected || '—')}</td>
              </tr>`).join('') : `
              <tr><td colspan="4" style="color:var(--text3);font-style:italic">No objectives added</td></tr>`}
          </tbody>
        </table>
      </div>`;
  }

  function renderReportIntro() {
    return renderPersonalInfo() + renderObjectives();
  }

  function injectIntoAnalysis() {
    const content = R('a-content');
    if (!content) return;
    R('analysis-personal-info')?.remove();
    R('analysis-objectives')?.remove();

    const header = content.querySelector('.a-header');
    const html = renderReportIntro();
    if (header) header.insertAdjacentHTML('afterend', html);
    else content.insertAdjacentHTML('afterbegin', html);
  }

  return {
    renderPersonalInfo,
    renderObjectives,
    renderReportIntro,
    injectIntoAnalysis
  };
})();
