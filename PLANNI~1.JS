(function () {
  let activeModuleId = 'risk-takaful';

  function qs(id) { return document.getElementById(id); }
  function getModules() { return window.WQPlanningSuiteModules || []; }

  function isSuperAdmin() {
    return window.WQAuth?.getRole?.() === 'superadmin';
  }

  function renderBlockedState() {
    const tabBar = qs('planningSuiteTabs');
    const container = qs('planningSuiteModule');
    const title = qs('planningSuiteTitle');
    const sub = qs('planningSuiteSub');
    if (tabBar) tabBar.innerHTML = '';
    if (title) title.textContent = 'Planning Suite';
    if (sub) sub.textContent = 'SuperAdmin access required';
    if (container) {
      container.innerHTML = `
        <div class="planning-suite-access-denied">
          <div class="planning-suite-eyebrow">Restricted Page</div>
          <div class="planning-suite-title">SuperAdmin only</div>
          <p>Planning Suite is only accessible and editable by SuperAdmin users.</p>
        </div>
      `;
    }
  }

  function renderTabs() {
    if (!isSuperAdmin()) return renderBlockedState();
    const modules = getModules();
    const tabBar = qs('planningSuiteTabs');
    if (!tabBar) return;
    if (!modules.length) {
      tabBar.innerHTML = '<div class="planning-suite-load-error">Planning Suite modules could not be loaded.</div>';
      return;
    }
    tabBar.innerHTML = modules.map(mod => `
      <button type="button" class="planning-suite-tab ${mod.id === activeModuleId ? 'active' : ''}" data-module-id="${mod.id}">
        ${mod.title}
      </button>
    `).join('');
    tabBar.querySelectorAll('[data-module-id]').forEach(btn => {
      btn.addEventListener('click', () => selectModule(btn.dataset.moduleId));
    });
  }



  function enhanceModuleFrame(frame) {
    if (!frame || frame.dataset.printEnhanced === '1') return;
    const frameTitle = (frame.getAttribute('title') || '').toLowerCase();
    if (frameTitle.includes('education') || frameTitle.includes('investment')) return;
    frame.dataset.printEnhanced = '1';

    function injectPrintButtons() {
      try {
        const doc = frame.contentDocument || frame.contentWindow?.document;
        if (!doc || !doc.body) return;

        if (!doc.getElementById('wq-planning-suite-print-style')) {
          const style = doc.createElement('style');
          style.id = 'wq-planning-suite-print-style';
          style.textContent = `
            .wq-print-pdf-row {
              display: flex;
              justify-content: flex-start;
              margin-top: 8px;
            }
            .wq-print-pdf-btn {
              border: 1px solid var(--border, #e2dfd8);
              background: var(--surface2, #f2f0eb);
              color: var(--text, #1a1916);
              border-radius: var(--r, 6px);
              padding: 7px 12px;
              font-family: 'DM Sans', sans-serif;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
            }
            .wq-print-pdf-btn:hover {
              border-color: var(--text, #1a1916);
              background: var(--surface, #fff);
            }
            @media print {
              .wq-print-pdf-row { display: none !important; }
            }
          `;
          doc.head.appendChild(style);
        }

        const blocks = Array.from(doc.querySelectorAll('.commentary-block'));
        if (blocks.length) {
          blocks.forEach((block, index) => {
            if (block.querySelector('.wq-print-pdf-row')) return;
            const row = doc.createElement('div');
            row.className = 'wq-print-pdf-row';
            const btn = doc.createElement('button');
            btn.type = 'button';
            btn.className = 'wq-print-pdf-btn';
            btn.textContent = 'Print As PDF';
            btn.addEventListener('click', () => {
              frame.contentWindow?.focus?.();
              frame.contentWindow?.print?.();
            });
            row.appendChild(btn);
            block.appendChild(row);
          });
        } else if (!doc.getElementById('wq-print-pdf-fallback')) {
          const row = doc.createElement('div');
          row.id = 'wq-print-pdf-fallback';
          row.className = 'wq-print-pdf-row';
          row.style.margin = '16px 0 0 0';
          const btn = doc.createElement('button');
          btn.type = 'button';
          btn.className = 'wq-print-pdf-btn';
          btn.textContent = 'Print As PDF';
          btn.addEventListener('click', () => {
            frame.contentWindow?.focus?.();
            frame.contentWindow?.print?.();
          });
          row.appendChild(btn);
          doc.body.appendChild(row);
        }
      } catch (err) {
        console.warn('Unable to add Planning Suite print button:', err);
      }
    }

    frame.addEventListener('load', injectPrintButtons);
    setTimeout(injectPrintButtons, 100);
  }

  function selectModule(moduleId) {
    if (!isSuperAdmin()) return renderBlockedState();
    const modules = getModules();
    if (!modules.length) return renderTabs();
    const selected = modules.find(mod => mod.id === moduleId) || modules[0];
    activeModuleId = selected.id;
    renderTabs();
    const title = qs('planningSuiteTitle');
    const sub = qs('planningSuiteSub');
    if (title) title.textContent = selected.title;
    if (sub) sub.textContent = 'Selected module';
    const container = qs('planningSuiteModule');
    if (!container) return;
    try {
      selected.render(container);
      container.querySelectorAll('iframe.planning-suite-frame').forEach(enhanceModuleFrame);
    } catch (err) {
      console.error('Planning Suite module render failed:', err);
      container.innerHTML = '<div class="planning-suite-access-denied"><div class="planning-suite-title">Module failed to load</div><p>Please check the browser console for details.</p></div>';
    }
    try { sessionStorage.setItem('planningSuiteActiveModule', activeModuleId); } catch (_) {}
  }

  function init() {
    if (!isSuperAdmin()) return renderBlockedState();
    try { activeModuleId = sessionStorage.getItem('planningSuiteActiveModule') || activeModuleId; } catch (_) {}
    renderTabs();
    selectModule(activeModuleId);
  }

  window.WQPlanningSuite = { init, selectModule, get modules() { return getModules(); } };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
