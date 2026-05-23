
// Wealth Quadrant Online modular app.js
// Adapted from wealth-quadrant_15.html while preserving Supabase/auth/storage modules.

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let appMounted = false;

const WQ_ONLINE_HTML = "\n\n<!-- TOPBAR -->\n<div class=\"topbar\">\n  <div class=\"brand\">\n    <div class=\"brand-mark\">\n      <svg viewBox=\"0 0 14 14\" fill=\"none\"><rect x=\"1\" y=\"1\" width=\"5\" height=\"5\" rx=\"1\" fill=\"white\"/><rect x=\"8\" y=\"1\" width=\"5\" height=\"5\" rx=\"1\" fill=\"white\" opacity=\".6\"/><rect x=\"1\" y=\"8\" width=\"5\" height=\"5\" rx=\"1\" fill=\"white\" opacity=\".6\"/><rect x=\"8\" y=\"8\" width=\"5\" height=\"5\" rx=\"1\" fill=\"white\" opacity=\".3\"/></svg>\n    </div>\n    <div>\n      <span class=\"brand-name\">Wealth Quadrant</span>\n      <span class=\"brand-sub\">Online</span>\n    </div>\n  </div>\n  <div class=\"pill-nav\">\n    <button class=\"pill-btn active\" id=\"tab-entry\" onclick=\"showPage('entry')\">Data Entry</button>\n    <button class=\"pill-btn\" id=\"tab-analysis\" onclick=\"showPage('analysis')\">Analysis</button>\n  </div>\n</div>\n\n<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n     PAGE: DATA ENTRY\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n<div class=\"page active\" id=\"page-entry\">\n\n  <!-- Sidebar -->\n  <aside class=\"sidebar\">\n    <div class=\"prog-wrap\">\n      <div class=\"prog-top\"><span>Progress</span><span id=\"prog-pct\">0%</span></div>\n      <div class=\"prog-track\"><div class=\"prog-fill\" id=\"prog-bar\"></div></div>\n    </div>\n    <div style=\"height:1px;background:var(--border);margin:.5rem 0\"></div>\n    <div class=\"sb-label\">Segments</div>\n    <a class=\"sb-item active\" onclick=\"goSeg(1)\" href=\"#\"><span class=\"sb-dot d1\"></span><div><div>Inflow</div><div style=\"font-size:11px;color:var(--text3)\">Salary &amp; Income</div></div></a>\n    <a class=\"sb-item\" onclick=\"goSeg(2)\" href=\"#\"><span class=\"sb-dot d2\"></span><div><div>Outflow</div><div style=\"font-size:11px;color:var(--text3)\">Expenses &amp; Commitments</div></div></a>\n    <a class=\"sb-item\" onclick=\"goSeg(3)\" href=\"#\"><span class=\"sb-dot d3\"></span><div><div>Assets</div><div style=\"font-size:11px;color:var(--text3)\">Holdings &amp; Investments</div></div></a>\n    <a class=\"sb-item\" onclick=\"goSeg(4)\" href=\"#\"><span class=\"sb-dot d4\"></span><div><div>Liabilities</div><div style=\"font-size:11px;color:var(--text3)\">Debts &amp; Obligations</div></div></a>\n    <div style=\"height:1px;background:var(--border);margin:.75rem 0\"></div>\n\n    <!-- Seg 1 Summary -->\n    <div class=\"seg-sum on\" id=\"ss-1\">\n      <div class=\"ss-head\" style=\"background:#1a6b47\">Segment 1 \u2014 Inflow</div>\n      <div class=\"ss-body\">\n        <div class=\"ss-row\"><span>Basic Salary</span><span class=\"ss-v\" id=\"ss1-salary\">RM 0</span></div>\n        <div class=\"ss-row\"><span>Allowances</span><span class=\"ss-v\" id=\"ss1-allow\">RM 0</span></div>\n        <div class=\"ss-row\"><span>Passive Income</span><span class=\"ss-v\" id=\"ss1-passive\">RM 0</span></div>\n        <div class=\"ss-row\"><span>Side Income</span><span class=\"ss-v\" id=\"ss1-side\">RM 0</span></div>\n        <div class=\"ss-div\"></div>\n        <div class=\"ss-row\"><span>Gross Inflow</span><span class=\"ss-v ss-b\" id=\"ss1-gross\">RM 0</span></div>\n        <div class=\"ss-row neg\"><span>EPF</span><span class=\"ss-v\" id=\"ss1-epf\">RM 0</span></div>\n        <div class=\"ss-row neg\"><span>EIS</span><span class=\"ss-v\" id=\"ss1-eis\">RM 0</span></div>\n        <div class=\"ss-row neg\"><span>SOCSO</span><span class=\"ss-v\" id=\"ss1-socso\">RM 0</span></div>\n        <div class=\"ss-row neg\"><span>Zakat</span><span class=\"ss-v\" id=\"ss1-zakat\">RM 0</span></div>\n        <div class=\"ss-row neg\"><span>Other Ded.</span><span class=\"ss-v\" id=\"ss1-othded\">RM 0</span></div>\n        <div class=\"ss-div\"></div>\n        <div class=\"ss-tot\"><span>Net Income</span><span class=\"ss-v ss-b positive\" id=\"ss1-net\">RM 0</span></div>\n      </div>\n    </div>\n\n    <!-- Seg 2 Summary -->\n    <div class=\"seg-sum\" id=\"ss-2\">\n      <div class=\"ss-head\" style=\"background:#8b2020\">Segment 2 \u2014 Outflow</div>\n      <div class=\"ss-body\">\n        <div class=\"ss-row\"><span>Mortgage</span><span class=\"ss-v\" id=\"ss2-mtg\">RM 0</span></div>\n        <div class=\"ss-row\"><span>Non-Mortgage</span><span class=\"ss-v\" id=\"ss2-non\">RM 0</span></div>\n        <div class=\"ss-row\"><span>Fixed Expenses</span><span class=\"ss-v\" id=\"ss2-fix\">RM 0</span></div>\n        <div class=\"ss-row\"><span>Variable Expenses</span><span class=\"ss-v\" id=\"ss2-var\">RM 0</span></div>\n        <div class=\"ss-row\"><span>Savings / Invest</span><span class=\"ss-v\" id=\"ss2-sav\">RM 0</span></div>\n        <div class=\"ss-row\"><span>Takaful</span><span class=\"ss-v\" id=\"ss2-tak\">RM 0</span></div>\n        <div class=\"ss-div\"></div>\n        <div class=\"ss-tot\"><span>Total Outflow</span><span class=\"ss-v ss-b negative\" id=\"ss2-tot\">RM 0</span></div>\n        <div class=\"ss-tot\" style=\"margin-top:4px\"><span>Net Cashflow</span><span class=\"ss-v ss-b\" id=\"ss2-cf\">RM 0</span></div>\n      </div>\n    </div>\n\n    <!-- Seg 3 Summary -->\n    <div class=\"seg-sum\" id=\"ss-3\">\n      <div class=\"ss-head\" style=\"background:#1a4a6b\">Segment 3 \u2014 Assets</div>\n      <div class=\"ss-body\">\n        <div class=\"ss-row\"><span>Cash &amp; Equiv.</span><span class=\"ss-v\" id=\"ss3-cash\">RM 0</span></div>\n        <div class=\"ss-row\"><span>Investments</span><span class=\"ss-v\" id=\"ss3-inv\">RM 0</span></div>\n        <div class=\"ss-row\"><span>Property</span><span class=\"ss-v\" id=\"ss3-prop\">RM 0</span></div>\n        <div class=\"ss-row\"><span>Retirement</span><span class=\"ss-v\" id=\"ss3-ret\">RM 0</span></div>\n        <div class=\"ss-div\"></div>\n        <div class=\"ss-tot\"><span>Total Assets</span><span class=\"ss-v ss-b neutral\" id=\"ss3-tot\">RM 0</span></div>\n      </div>\n    </div>\n\n    <!-- Seg 4 Summary -->\n    <div class=\"seg-sum\" id=\"ss-4\">\n      <div class=\"ss-head\" style=\"background:#b85c00\">Segment 4 \u2014 Liabilities</div>\n      <div class=\"ss-body\">\n        <div id=\"ss4-rows\"><div class=\"ss-row\" style=\"color:var(--text3);font-style:italic\"><span>No liabilities added</span></div></div>\n        <div class=\"ss-div\"></div>\n        <div class=\"ss-tot\"><span>Total Liabilities</span><span class=\"ss-v ss-b negative\" id=\"ss4-tot\">RM 0</span></div>\n        <div class=\"ss-tot\" style=\"margin-top:4px\"><span>Net Worth</span><span class=\"ss-v ss-b\" id=\"ss4-nw\">RM 0</span></div>\n      </div>\n    </div>\n  </aside>\n\n  <!-- Main entry area -->\n  <div class=\"main-area\">\n\n    <!-- SEG 1 -->\n    <div class=\"segment active\" id=\"seg-1\">\n      <div class=\"seg-hdr\">\n        <div><div class=\"seg-tag t1\">Segment 1</div><div class=\"seg-title\">Inflow</div><div class=\"seg-desc\">Income sources and statutory deductions</div></div>\n        <div style=\"display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end\">\n          <div class=\"seg-tot-box\"><div class=\"tot-label\">Gross Inflow</div><div class=\"tot-val positive\" id=\"seg1-tot\">RM 0.00</div></div>\n          <button class=\"btn-reset-seg\" onclick=\"resetSeg(1)\">\u21ba Reset All</button>\n        </div>\n      </div>\n      <div class=\"card\">\n        <div class=\"ch\" onclick=\"toggleCard(this)\">\n          <div class=\"ch-left\"><div class=\"ci ci1\">\ud83d\udcbc</div><div><div class=\"ch-title\">Main Salary</div><div class=\"ch-sub\">Primary employment income</div></div></div>\n          <div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-salary\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetSalary(event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div>\n        </div>\n        <div class=\"cb\">\n          <div class=\"f-static\"><div><div class=\"f-label\">Monthly Basic Salary</div><div class=\"f-sub\">Gross before deductions</div></div><div class=\"pfx-wrap\"><span class=\"pfx\">RM</span><input class=\"inp pl\" type=\"number\" placeholder=\"0.00\" id=\"salary-basic\" oninput=\"recalc()\" min=\"0\" step=\"0.01\"></div></div>\n          <div class=\"f-static\"><div><div class=\"f-label\">Annual Bonus</div><div class=\"f-sub\">Monthly equivalent</div></div><div class=\"pfx-wrap\"><span class=\"pfx\">RM</span><input class=\"inp pl\" type=\"number\" placeholder=\"0.00\" id=\"salary-bonus\" oninput=\"recalc()\" min=\"0\" step=\"0.01\"></div></div>\n        </div>\n      </div>\n      <div class=\"card\">\n        <div class=\"ch\" onclick=\"toggleCard(this)\">\n          <div class=\"ch-left\"><div class=\"ci ci1\">\ud83d\udccb</div><div><div class=\"ch-title\">Allowances</div><div class=\"ch-sub\">Transport, meal, housing &amp; others</div></div></div>\n          <div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-allow\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('allow',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div>\n        </div>\n        <div class=\"cb\"><div class=\"exp-rows\" id=\"rows-allow\"></div><button class=\"btn-add\" onclick=\"addRow('allow',event)\">+ Add allowance</button></div>\n      </div>\n      <div class=\"card\">\n        <div class=\"ch\" onclick=\"toggleCard(this)\">\n          <div class=\"ch-left\"><div class=\"ci ci1\">\ud83d\udcc8</div><div><div class=\"ch-title\">Passive Income</div><div class=\"ch-sub\">Dividends, rental, interest</div></div></div>\n          <div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-passive\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('passive',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div>\n        </div>\n        <div class=\"cb\"><div class=\"exp-rows\" id=\"rows-passive\"></div><button class=\"btn-add\" onclick=\"addRow('passive',event)\">+ Add passive income</button></div>\n      </div>\n      <div class=\"card\">\n        <div class=\"ch\" onclick=\"toggleCard(this)\">\n          <div class=\"ch-left\"><div class=\"ci ci1\">\ud83d\udca1</div><div><div class=\"ch-title\">Side Income</div><div class=\"ch-sub\">Freelance, part-time, gig</div></div></div>\n          <div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-side\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('side',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div>\n        </div>\n        <div class=\"cb\"><div class=\"exp-rows\" id=\"rows-side\"></div><button class=\"btn-add\" onclick=\"addRow('side',event)\">+ Add side income</button></div>\n      </div>\n      <div class=\"ded-section\">\n        <div class=\"ded-lbl\">\u2696 Statutory Deductions</div>\n        <div class=\"card\">\n          <div class=\"ch open\" style=\"cursor:default;background:#fdf8f8\">\n            <div class=\"ch-left\"><div class=\"ci ci-r\">\u2696\ufe0f</div><div><div class=\"ch-title\">EPF / EIS / SOCSO / Zakat</div><div class=\"ch-sub\">Mandatory &amp; voluntary deductions</div></div></div>\n            <div class=\"ch-right\"><span class=\"ch-sum negative\" id=\"sum-ded\">\u2212 RM 0</span><button class=\"btn-reset-data\" onclick=\"resetDeductions(event)\">\u21ba Reset</button></div>\n          </div>\n          <div class=\"cb open\" style=\"background:#fdf8f8\">\n            <div class=\"f-static\"><div><div class=\"f-label\">EPF (Employee Provident Fund)</div><div class=\"f-sub\">Typically 11% of basic salary</div></div><div class=\"pfx-wrap\"><span class=\"pfx\">RM</span><input class=\"inp pl\" type=\"number\" placeholder=\"0.00\" id=\"ded-epf\" oninput=\"recalc()\" min=\"0\" step=\"0.01\"></div></div>\n            <div class=\"f-static\"><div><div class=\"f-label\">EIS (Employment Insurance System)</div><div class=\"f-sub\">0.2% of salary, capped</div></div><div class=\"pfx-wrap\"><span class=\"pfx\">RM</span><input class=\"inp pl\" type=\"number\" placeholder=\"0.00\" id=\"ded-eis\" oninput=\"recalc()\" min=\"0\" step=\"0.01\"></div></div>\n            <div class=\"f-static\"><div><div class=\"f-label\">SOCSO</div><div class=\"f-sub\">Social security contribution</div></div><div class=\"pfx-wrap\"><span class=\"pfx\">RM</span><input class=\"inp pl\" type=\"number\" placeholder=\"0.00\" id=\"ded-socso\" oninput=\"recalc()\" min=\"0\" step=\"0.01\"></div></div>\n            <div class=\"f-static\"><div><div class=\"f-label\">Zakat</div><div class=\"f-sub\">Islamic tithe (if applicable)</div></div><div class=\"pfx-wrap\"><span class=\"pfx\">RM</span><input class=\"inp pl\" type=\"number\" placeholder=\"0.00\" id=\"ded-zakat\" oninput=\"recalc()\" min=\"0\" step=\"0.01\"></div></div>\n            <div style=\"margin-top:10px\"><div style=\"font-size:11px;color:var(--text3);margin-bottom:6px;font-weight:500\">Other Deductions</div><div class=\"exp-rows\" id=\"rows-ded\"></div><button class=\"btn-add\" onclick=\"addRow('ded',event)\">+ Add other deduction</button></div>\n          </div>\n        </div>\n      </div>\n      <div class=\"seg-nav\"><div></div><button class=\"btn-nav btn-pri\" onclick=\"goSeg(2)\">Next: Outflow \u2192</button></div>\n    </div>\n\n    <!-- SEG 2 -->\n    <div class=\"segment\" id=\"seg-2\">\n      <div class=\"seg-hdr\">\n        <div><div class=\"seg-tag t2\">Segment 2</div><div class=\"seg-title\">Outflow</div><div class=\"seg-desc\">Monthly commitments, expenses &amp; savings</div></div>\n        <div style=\"display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end\">\n          <div class=\"seg-tot-box\"><div class=\"tot-label\">Total Outflow</div><div class=\"tot-val negative\" id=\"seg2-tot\">RM 0.00</div></div>\n          <button class=\"btn-reset-seg\" onclick=\"resetSeg(2)\">\u21ba Reset All</button>\n        </div>\n      </div>\n      <div class=\"card\"><div class=\"ch\" onclick=\"toggleCard(this)\"><div class=\"ch-left\"><div class=\"ci ci2\">\ud83c\udfe0</div><div><div class=\"ch-title\">Commitment \u2014 Mortgage</div><div class=\"ch-sub\">Home loans, property financing</div></div></div><div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-mtg\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('mtg',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div></div><div class=\"cb\"><div class=\"exp-rows\" id=\"rows-mtg\"></div><button class=\"btn-add\" onclick=\"addRow('mtg',event)\">+ Add mortgage</button></div></div>\n      <div class=\"card\"><div class=\"ch\" onclick=\"toggleCard(this)\"><div class=\"ch-left\"><div class=\"ci ci2\">\ud83d\ude97</div><div><div class=\"ch-title\">Commitment \u2014 Non-Mortgage</div><div class=\"ch-sub\">Car loans, personal loans, PTPTN</div></div></div><div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-non\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('non',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div></div><div class=\"cb\"><div class=\"exp-rows\" id=\"rows-non\"></div><button class=\"btn-add\" onclick=\"addRow('non',event)\">+ Add commitment</button></div></div>\n      <div class=\"card\"><div class=\"ch\" onclick=\"toggleCard(this)\"><div class=\"ch-left\"><div class=\"ci ci2\">\ud83d\udccc</div><div><div class=\"ch-title\">Fixed Expenses</div><div class=\"ch-sub\">Utilities, subscriptions, recurring bills</div></div></div><div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-fix\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('fix',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div></div><div class=\"cb\"><div class=\"exp-rows\" id=\"rows-fix\"></div><button class=\"btn-add\" onclick=\"addRow('fix',event)\">+ Add fixed expense</button></div></div>\n      <div class=\"card\"><div class=\"ch\" onclick=\"toggleCard(this)\"><div class=\"ch-left\"><div class=\"ci ci2\">\ud83d\uded2</div><div><div class=\"ch-title\">Variable Expenses</div><div class=\"ch-sub\">Groceries, dining, entertainment</div></div></div><div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-var\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('var',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div></div><div class=\"cb\"><div class=\"exp-rows\" id=\"rows-var\"></div><button class=\"btn-add\" onclick=\"addRow('var',event)\">+ Add variable expense</button></div></div>\n      <div class=\"card\"><div class=\"ch\" onclick=\"toggleCard(this)\"><div class=\"ch-left\"><div class=\"ci ci2\">\ud83d\udcb0</div><div><div class=\"ch-title\">Saving / Investment</div><div class=\"ch-sub\">ASB, unit trust, stocks, tabung</div></div></div><div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-sav\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('sav',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div></div><div class=\"cb\"><div class=\"exp-rows\" id=\"rows-sav\"></div><button class=\"btn-add\" onclick=\"addRow('sav',event)\">+ Add saving / investment</button></div></div>\n      <div class=\"card\"><div class=\"ch\" onclick=\"toggleCard(this)\"><div class=\"ch-left\"><div class=\"ci ci2\">\ud83d\udee1\ufe0f</div><div><div class=\"ch-title\">Protection / Takaful</div><div class=\"ch-sub\">Life, medical, family takaful</div></div></div><div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-tak\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('tak',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div></div><div class=\"cb\"><div class=\"exp-rows\" id=\"rows-tak\"></div><button class=\"btn-add\" onclick=\"addRow('tak',event)\">+ Add protection</button></div></div>\n      <div class=\"seg-nav\"><button class=\"btn-nav\" onclick=\"goSeg(1)\">\u2190 Back</button><button class=\"btn-nav btn-pri\" onclick=\"goSeg(3)\">Next: Assets \u2192</button></div>\n    </div>\n\n    <!-- SEG 3 -->\n    <div class=\"segment\" id=\"seg-3\">\n      <div class=\"seg-hdr\">\n        <div><div class=\"seg-tag t3\">Segment 3</div><div class=\"seg-title\">Assets</div><div class=\"seg-desc\">What you own \u2014 current market value</div></div>\n        <div style=\"display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end\">\n          <div class=\"seg-tot-box\"><div class=\"tot-label\">Total Assets</div><div class=\"tot-val neutral\" id=\"seg3-tot\">RM 0.00</div></div>\n          <button class=\"btn-reset-seg\" onclick=\"resetSeg(3)\">\u21ba Reset All</button>\n        </div>\n      </div>\n      <div class=\"card\"><div class=\"ch\" onclick=\"toggleCard(this)\"><div class=\"ch-left\"><div class=\"ci ci3\">\ud83c\udfe6</div><div><div class=\"ch-title\">Cash &amp; Cash Equivalents</div><div class=\"ch-sub\">Bank accounts, fixed deposits, tabung</div></div></div><div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-cash\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('cash',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div></div><div class=\"cb\"><div class=\"exp-rows\" id=\"rows-cash\"></div><button class=\"btn-add\" onclick=\"addRow('cash',event)\">+ Add cash / account</button></div></div>\n      <div class=\"card\"><div class=\"ch\" onclick=\"toggleCard(this)\"><div class=\"ch-left\"><div class=\"ci ci3\">\ud83d\udcca</div><div><div class=\"ch-title\">Investment</div><div class=\"ch-sub\">Stocks, unit trust, crypto, bonds</div></div></div><div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-inv\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('inv',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div></div><div class=\"cb\"><div class=\"exp-rows\" id=\"rows-inv\"></div><button class=\"btn-add\" onclick=\"addRow('inv',event)\">+ Add investment</button></div></div>\n      <div class=\"card\"><div class=\"ch\" onclick=\"toggleCard(this)\"><div class=\"ch-left\"><div class=\"ci ci3\">\ud83c\udfe1</div><div><div class=\"ch-title\">Property &amp; Holdings</div><div class=\"ch-sub\">Real estate, vehicles, business</div></div></div><div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-prop\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('prop',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div></div><div class=\"cb\"><div class=\"exp-rows\" id=\"rows-prop\"></div><button class=\"btn-add\" onclick=\"addRow('prop',event)\">+ Add property / holding</button></div></div>\n      <div class=\"card\"><div class=\"ch\" onclick=\"toggleCard(this)\"><div class=\"ch-left\"><div class=\"ci ci3\">\ud83c\udf05</div><div><div class=\"ch-title\">Retirement</div><div class=\"ch-sub\">EPF balance, PRS, KWSP</div></div></div><div class=\"ch-right\"><span class=\"ch-sum\" id=\"sum-ret\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('ret',event)\">\u21ba Reset</button><svg class=\"chev\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg></div></div><div class=\"cb\"><div class=\"exp-rows\" id=\"rows-ret\"></div><button class=\"btn-add\" onclick=\"addRow('ret',event)\">+ Add retirement fund</button></div></div>\n      <div class=\"seg-nav\"><button class=\"btn-nav\" onclick=\"goSeg(2)\">\u2190 Back</button><button class=\"btn-nav btn-pri\" onclick=\"goSeg(4)\">Next: Liabilities \u2192</button></div>\n    </div>\n\n    <!-- SEG 4 -->\n    <div class=\"segment\" id=\"seg-4\">\n      <div class=\"seg-hdr\">\n        <div><div class=\"seg-tag t4\">Segment 4</div><div class=\"seg-title\">Liabilities</div><div class=\"seg-desc\">Outstanding debts and obligations</div></div>\n        <div style=\"display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end\">\n          <div class=\"seg-tot-box\"><div class=\"tot-label\">Total Liabilities</div><div class=\"tot-val negative\" id=\"seg4-tot\">RM 0.00</div></div>\n          <button class=\"btn-reset-seg\" onclick=\"resetSeg(4)\">\u21ba Reset All</button>\n        </div>\n      </div>\n      <div class=\"card\">\n        <div class=\"ch open\" style=\"cursor:default\">\n          <div class=\"ch-left\"><div class=\"ci ci-g\">\ud83d\udcdd</div><div><div class=\"ch-title\">All Liabilities</div><div class=\"ch-sub\">Add each outstanding debt or obligation</div></div></div>\n          <div class=\"ch-right\"><span class=\"ch-sum negative\" id=\"sum-liab\">RM 0</span><button class=\"btn-reset-data\" onclick=\"resetRows('liab',event)\">\u21ba Reset</button></div>\n        </div>\n        <div class=\"cb open\">\n          <div style=\"display:grid;grid-template-columns:130px 1fr 150px 30px;gap:6px;margin-bottom:6px\">\n            <div style=\"font-size:11px;color:var(--text3);padding:0 4px\">Category</div>\n            <div style=\"font-size:11px;color:var(--text3);padding:0 4px\">Description</div>\n            <div style=\"font-size:11px;color:var(--text3);padding:0 4px;text-align:right\">Outstanding (RM)</div>\n            <div></div>\n          </div>\n          <div class=\"exp-rows\" id=\"rows-liab\"></div>\n          <button class=\"btn-add\" onclick=\"addLiabRow(event)\">+ Add liability</button>\n        </div>\n      </div>\n      <div class=\"seg-nav\"><button class=\"btn-nav\" onclick=\"goSeg(3)\">\u2190 Back</button><button class=\"btn-nav btn-pri\" onclick=\"showPage('analysis')\">View Analysis \u2192</button></div>\n    </div>\n\n  </div><!-- /main-area -->\n</div><!-- /page-entry -->\n\n<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n     PAGE: ANALYSIS\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n<div class=\"page\" id=\"page-analysis\">\n  <div class=\"main-area\" style=\"padding:2rem;flex:1\">\n\n    <div class=\"empty-state\" id=\"a-empty\">\n      <div style=\"font-size:36px;margin-bottom:14px\">\ud83d\udcca</div>\n      <div style=\"font-size:15px;font-weight:500;color:var(--text);margin-bottom:6px\">No data yet</div>\n      <div style=\"font-size:13px;margin-bottom:16px\">Fill in your financial details to see your analysis</div>\n      <a onclick=\"showPage('entry')\">Go to Data Entry \u2192</a>\n    </div>\n\n    <div id=\"a-content\" style=\"display:none\">\n      <div class=\"a-header\">\n        <div class=\"a-header-left\">\n          <div class=\"a-title\">Financial Analysis</div>\n          <div class=\"a-sub\" id=\"a-date\"></div>\n        </div>\n        <button class=\"btn-pdf\" id=\"btn-pdf\" onclick=\"printAsPDF()\">\n          <svg viewBox=\"0 0 14 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\"><rect x=\"2\" y=\"4\" width=\"10\" height=\"7\" rx=\"1\" stroke=\"white\" stroke-width=\"1.3\"/><path d=\"M4 4V2.5A.5.5 0 014.5 2h5a.5.5 0 01.5.5V4\" stroke=\"white\" stroke-width=\"1.3\"/><path d=\"M4 10h6M4 7.5h6\" stroke=\"white\" stroke-width=\"1.1\" stroke-linecap=\"round\"/></svg>\n          Print as PDF\n        </button>\n      </div>\n\n      <!-- PDF loading overlay -->\n      <div class=\"pdf-overlay\" id=\"pdf-overlay\">\n        <div class=\"pdf-box\">\n          <div class=\"pdf-spinner\"></div>\n          <p id=\"pdf-status\">Preparing your report\u2026</p>\n        </div>\n      </div>\n\n      <!-- \u2460 FINANCIAL OVERVIEW (quadrant + KPIs merged) -->\n      <div class=\"grp-block\">\n        <div class=\"grp-label\" style=\"margin-top:0\">Financial Overview</div>\n\n        <div class=\"quad-grid\" style=\"margin-bottom:1.5rem\">\n          <div class=\"quad-card\" onclick=\"goToSegment(1)\" title=\"Go to Inflow Data Entry\"><div class=\"q-head qg\">Inflow <span class=\"q-hint\">tap to edit \u2192</span></div><div class=\"q-body\">\n            <div class=\"q-row\"><span>Basic Salary</span><span class=\"q-val\" id=\"aq-sal\">RM 0</span></div>\n            <div class=\"q-row\"><span>Allowances</span><span class=\"q-val\" id=\"aq-all\">RM 0</span></div>\n            <div class=\"q-row\"><span>Passive</span><span class=\"q-val\" id=\"aq-pas\">RM 0</span></div>\n            <div class=\"q-row\"><span>Side Income</span><span class=\"q-val\" id=\"aq-sid\">RM 0</span></div>\n            <div class=\"q-div\"></div>\n            <div class=\"q-row\" style=\"color:var(--red)\"><span>Deductions</span><span class=\"q-val negative\" id=\"aq-ded\">RM 0</span></div>\n            <div class=\"q-div\"></div>\n            <div class=\"q-foot\"><span style=\"color:#1a6b47\">Net Income</span><span class=\"q-fv positive\" id=\"aq-net\">RM 0</span></div>\n          </div></div>\n          <div class=\"quad-card\" onclick=\"goToSegment(2)\" title=\"Go to Outflow Data Entry\"><div class=\"q-head qr\">Outflow <span class=\"q-hint\">tap to edit \u2192</span></div><div class=\"q-body\">\n            <div class=\"q-row\"><span>Mortgage</span><span class=\"q-val\" id=\"aq-mtg\">RM 0</span></div>\n            <div class=\"q-row\"><span>Non-Mortgage</span><span class=\"q-val\" id=\"aq-non\">RM 0</span></div>\n            <div class=\"q-row\"><span>Fixed Exp.</span><span class=\"q-val\" id=\"aq-fix\">RM 0</span></div>\n            <div class=\"q-row\"><span>Variable Exp.</span><span class=\"q-val\" id=\"aq-var\">RM 0</span></div>\n            <div class=\"q-row\"><span>Savings/Invest</span><span class=\"q-val\" id=\"aq-sav\">RM 0</span></div>\n            <div class=\"q-row\"><span>Takaful</span><span class=\"q-val\" id=\"aq-tak\">RM 0</span></div>\n            <div class=\"q-div\"></div>\n            <div class=\"q-foot\"><span style=\"color:#8b2020\">Total Outflow</span><span class=\"q-fv negative\" id=\"aq-out\">RM 0</span></div>\n          </div></div>\n          <div class=\"quad-card\" onclick=\"goToSegment(3)\" title=\"Go to Assets Data Entry\"><div class=\"q-head qb\">Assets <span class=\"q-hint\">tap to edit \u2192</span></div><div class=\"q-body\">\n            <div class=\"q-row\"><span>Cash &amp; Equiv.</span><span class=\"q-val\" id=\"aq-csh\">RM 0</span></div>\n            <div class=\"q-row\"><span>Investments</span><span class=\"q-val\" id=\"aq-inv\">RM 0</span></div>\n            <div class=\"q-row\"><span>Property</span><span class=\"q-val\" id=\"aq-prp\">RM 0</span></div>\n            <div class=\"q-row\"><span>Retirement (EPF)</span><span class=\"q-val\" id=\"aq-ret\">RM 0</span></div>\n            <div class=\"q-div\"></div>\n            <div class=\"q-foot\"><span style=\"color:#1a4a6b\">Total Assets</span><span class=\"q-fv neutral\" id=\"aq-ast\">RM 0</span></div>\n          </div></div>\n          <div class=\"quad-card\" onclick=\"goToSegment(4)\" title=\"Go to Liabilities Data Entry\"><div class=\"q-head qo\">Liabilities <span class=\"q-hint\">tap to edit \u2192</span></div><div class=\"q-body\">\n            <div id=\"aq-liab-rows\"><div class=\"q-row\" style=\"color:var(--text3);font-style:italic\"><span>None recorded</span></div></div>\n            <div class=\"q-div\"></div>\n            <div class=\"q-foot\"><span style=\"color:#b85c00\">Total Liabilities</span><span class=\"q-fv negative\" id=\"aq-lib\">RM 0</span></div>\n          </div></div>\n        </div>\n\n        <!-- KPI strip (was Figurative Summary) -->\n        <div class=\"kpi-grid\">\n          <div class=\"kpi\"><div class=\"kpi-lbl\">GROSS INCOME</div><div class=\"kpi-val neutral\" id=\"kpi-gross\">RM 0</div><div class=\"kpi-sub\">Before deductions</div></div>\n          <div class=\"kpi\"><div class=\"kpi-lbl\">NET INCOME</div><div class=\"kpi-val positive\" id=\"kpi-net\">RM 0</div><div class=\"kpi-sub\">After deductions</div></div>\n          <div class=\"kpi\"><div class=\"kpi-lbl\">TOTAL OUTFLOW</div><div class=\"kpi-val negative\" id=\"kpi-out\">RM 0</div><div class=\"kpi-sub\">Monthly expenses</div></div>\n          <div class=\"kpi\"><div class=\"kpi-lbl\" id=\"kpi-cf-lbl\">NET CASHFLOW</div><div class=\"kpi-val\" id=\"kpi-sur\">RM 0</div><div class=\"kpi-sub\" id=\"kpi-cf-sub\">Net Income \u2212 Total Outflow</div></div>\n        </div>\n      </div>\n\n      <!-- \u2461 BUDGET BREAKDOWN (no Amount, no Status; with pie chart) -->\n      <div class=\"grp-block\">\n        <div class=\"grp-label\">Budget Breakdown</div>\n        <div class=\"two-col\" style=\"margin-bottom:0;align-items:start\">\n          <div>\n            <div class=\"grp-sub\" style=\"margin-top:0\">Outflow by Category</div>\n            <div class=\"a-card\" style=\"margin-bottom:1rem\">\n              <table class=\"bk-table\">\n                <thead><tr><th>Category</th><th style=\"text-align:right\">% of Net Income</th></tr></thead>\n                <tbody id=\"bk-body\"></tbody>\n              </table>\n            </div>\n            <div class=\"grp-sub\">Income Allocation</div>\n            <div class=\"a-card\" style=\"margin-bottom:0\"><div id=\"alloc-bars\"></div></div>\n          </div>\n          <div>\n            <div class=\"grp-sub\" style=\"margin-top:0\">Outflow Breakdown</div>\n            <div class=\"a-card\" style=\"margin-bottom:0\">\n              <div class=\"chart-wrap\" style=\"height:300px\"><canvas id=\"chart-donut\"></canvas></div>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- \u2462 NET WORTH DETAIL -->\n      <div class=\"grp-block\">\n        <div class=\"grp-label\">Net Worth Detail</div>\n        <div class=\"nw-duo-grid\">\n          <div class=\"nw-card\">\n            <div class=\"nw-card-lbl\">Net Worth <span class=\"nw-epf-tag with-epf\">with EPF</span></div>\n            <div class=\"nw-card-fml\">Assets \u2212 Liabilities</div>\n            <div class=\"nw-card-val\" id=\"nw-with\">RM 0</div>\n          </div>\n          <div class=\"nw-card\">\n            <div class=\"nw-card-lbl\">Net Worth <span class=\"nw-epf-tag no-epf\">without EPF</span></div>\n            <div class=\"nw-card-fml\">(Assets \u2212 Retirement) \u2212 Liabilities</div>\n            <div class=\"nw-card-val\" id=\"nw-without\">RM 0</div>\n          </div>\n        </div>\n        <div class=\"two-col\" style=\"margin-top:1.25rem\">\n          <div>\n            <div style=\"font-size:11px;color:var(--text3);margin-bottom:8px;font-weight:500;letter-spacing:.05em\">ASSETS BREAKDOWN</div>\n            <div class=\"bar-list\" id=\"asset-bars\"></div>\n          </div>\n          <div>\n            <div style=\"font-size:11px;color:var(--text3);margin-bottom:8px;font-weight:500;letter-spacing:.05em\">LIABILITIES BREAKDOWN</div>\n            <div id=\"liab-detail\"></div>\n          </div>\n        </div>\n      </div>\n\n      <!-- \u2463 FINANCIAL HEALTH -->\n      <div class=\"grp-block\" id=\"section-financial-health\">\n        <div class=\"grp-label\">Financial Health</div>\n        <div class=\"fh-grid\" id=\"fh-grid\"></div>\n\n        <!-- Investment Ratio \u2014 manual input row -->\n        <div class=\"fh-grid\" style=\"margin-top:1px;border-top:none\">\n          <div class=\"fh-row\" style=\"border-radius:0 0 var(--rl) var(--rl)\">\n            <div>\n              <div class=\"fh-name\">Investment Ratio</div>\n              <div class=\"fh-fml\">(Manually entered figure) \u00f7 Net Worth</div>\n              <div class=\"fh-bench\">Benchmark \u2265 15%</div>\n              <div style=\"margin-top:8px;display:flex;align-items:center;gap:8px\">\n                <div class=\"pfx-wrap\" style=\"width:200px\"><span class=\"pfx\">RM</span><input class=\"inp pl\" type=\"number\" placeholder=\"Enter investment figure\" id=\"inv-ratio-input\" oninput=\"updateInvRatio()\" min=\"0\" step=\"0.01\" style=\"width:200px;height:32px;font-size:12px\"></div>\n              </div>\n              <div class=\"commentary-wrap\" style=\"margin-top:10px\">\n                <div class=\"commentary-lbl\">Commentary <span class=\"commentary-char\" id=\"cc-inv-ratio\">0 / 300</span></div>\n                <textarea class=\"commentary-box\" id=\"cb-inv-ratio\" maxlength=\"300\" placeholder=\"Add your notes or observations for Investment Ratio\u2026\" oninput=\"saveCommentary('inv-ratio',this)\" rows=\"2\"></textarea>\n              </div>\n            </div>\n            <div class=\"fh-right\">\n              <div class=\"fh-val\" id=\"inv-ratio-val\">\u2014</div>\n              <span class=\"h-tag\" id=\"inv-ratio-tag\" style=\"margin-top:3px\"></span>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- \u2464 ACTION PLAN -->\n      <div class=\"grp-block\" id=\"section-action-plan\">\n        <div class=\"grp-label\">Action Plan</div>\n        <div style=\"font-size:13px;color:var(--text2);margin-bottom:10px\">Record your financial goals, next steps, and commitments based on the analysis above.</div>\n        <div class=\"commentary-wrap\">\n          <div class=\"commentary-lbl\">Your Action Plan <span class=\"commentary-char\" id=\"cc-action-plan\">0 / 2000</span></div>\n          <textarea class=\"commentary-box\" id=\"cb-action-plan\" maxlength=\"2000\" placeholder=\"e.g. Reduce variable expenses by 15%&#10;Increase savings rate to 20%&#10;Clear car loan within 24 months&#10;Build 6-month emergency fund\u2026\" oninput=\"saveCommentary('action-plan',this)\" rows=\"8\" style=\"min-height:160px\"></textarea>\n          <div class=\"commentary-print\" id=\"cp-action-plan\"></div>\n        </div>\n      </div>\n\n    </div><!-- /a-content -->\n  </div>\n</div><!-- /page-analysis -->\n\n";

function ensureAsset(tag, attrs) {
  const selector = Object.entries(attrs).map(([k,v]) => `[${k}="${v}"]`).join('');
  if (document.querySelector(tag + selector)) return;
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k,v));
  document.head.appendChild(el);
}

function mountOnlineApp() {
  if (appMounted) return;
  ensureAsset('link', { href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap', rel: 'stylesheet' });
  ensureAsset('script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js' });
  ensureAsset('script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js' });

  const shell = document.getElementById('appShell');
  ['copyModal','toast','importFileInput'].forEach(id => document.getElementById(id)?.remove());
  shell.querySelector('.app-header')?.remove();
  shell.querySelector('#page-tracker')?.remove();
  shell.querySelector('#page-analytics')?.remove();
  shell.insertAdjacentHTML('beforeend', WQ_ONLINE_HTML);
  injectPeriodControls();
  appMounted = true;
}

function injectPeriodControls() {
  const topbar = document.querySelector('.topbar');
  if (!topbar || document.getElementById('periodControls')) return;
  const ctrl = document.createElement('div');
  ctrl.id = 'periodControls';
  ctrl.className = 'period-controls';
  ctrl.innerHTML = `<button class="period-btn" onclick="changePeriod(-1)">‹</button><select id="periodMonth" onchange="setPeriod()">${MONTHS.map((m,i)=>`<option value="${i}">${m}</option>`).join('')}</select><input id="periodYear" type="number" min="2000" max="2100" onchange="setPeriod()"><button class="period-btn" onclick="changePeriod(1)">›</button>`;
  topbar.insertBefore(ctrl, topbar.querySelector('.pill-nav'));
  syncPeriodControls();
}

function syncPeriodControls() {
  const m = document.getElementById('periodMonth'), y = document.getElementById('periodYear');
  if (m) m.value = String(currentMonth);
  if (y) y.value = String(currentYear);
}

function defaultOnlineData() { return {
  salary:0, bonus:0, allow:[], passive:[], side:[], epf:0, eis:0, socso:0, zakat:0, othDed:[],
  mtg:[], non:[], fix:[], vari:[], sav:[], tak:[], cash:[], inv:[], prop:[], ret:[], liab:[]
}; }

function noteKey(key) { return `wq-note-${currentYear}-${currentMonth}-${key}`; }

function clearDynamicRows() {
  ['allow','passive','side','ded','mtg','non','fix','vari','sav','tak','cash','inv','prop','ret','liab'].forEach(k => { const el = document.getElementById('rows-'+k); if (el) el.innerHTML = ''; });
  ['salary-basic','salary-bonus','ded-epf','ded-eis','ded-socso','ded-zakat'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

async function loadCurrentPeriod() {
  mountOnlineApp();
  syncPeriodControls();
  clearDynamicRows();
  const d = await WQStorage.getMonthData(currentYear, currentMonth, defaultOnlineData);
  loadDataIntoForm(d || defaultOnlineData());
  recalc();
}

function changePeriod(delta) {
  currentMonth += delta;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  loadCurrentPeriod();
}

function setPeriod() {
  currentMonth = parseInt(document.getElementById('periodMonth').value, 10) || 0;
  currentYear = parseInt(document.getElementById('periodYear').value, 10) || new Date().getFullYear();
  loadCurrentPeriod();
}


/* ── HELPERS ── */
const R = id => document.getElementById(id);
const setText = (id, v) => { const e = R(id); if(e) e.textContent = v; };
const fmtRM = v => 'RM ' + Math.abs(v).toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2});
const getVal = id => parseFloat(R(id)?.value)||0;
const sumRows = id => { let s=0; R(id)?.querySelectorAll('.row-amt').forEach(i=>s+=parseFloat(i.value)||0); return s; };
const sumArr = a => (a||[]).reduce((s,r)=>s+(r.amount||0),0);

/* ── PAGE SWITCHING ── */
function showPage(p) {
  document.querySelectorAll('.page').forEach(e=>e.classList.remove('active'));
  document.querySelectorAll('.pill-btn').forEach(e=>e.classList.remove('active'));
  R('page-'+p).classList.add('active');
  R('tab-'+p).classList.add('active');
  if(p==='analysis') { renderAnalysis(); setTimeout(loadCommentaries, 50); }
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ── GOTO SEGMENT (from Analysis quadrant click) ── */
function goToSegment(n) {
  showPage('entry');
  // slight delay so the page transition completes before scrolling
  setTimeout(() => goSeg(n), 80);
}

/* ── SEGMENT NAV ── */
function goSeg(n) {
  document.querySelectorAll('.segment').forEach(e=>e.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(e=>e.classList.remove('active'));
  document.querySelectorAll('.seg-sum').forEach(e=>e.classList.remove('on'));
  R('seg-'+n).classList.add('active');
  document.querySelectorAll('.sb-item')[n-1].classList.add('active');
  R('ss-'+n)?.classList.add('on');
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ── CARD TOGGLE ── */
function toggleCard(h) {
  const b = h.nextElementSibling;
  const c = h.querySelector('.chev');
  const o = b.classList.contains('open');
  b.classList.toggle('open',!o); h.classList.toggle('open',!o); c?.classList.toggle('open',!o);
}

/* ── ADD ROW ── */
function addRow(g, e) {
  e?.stopPropagation();
  const c = R('rows-'+g);
  const row = document.createElement('div');
  row.className = 'exp-row';
  row.innerHTML = `<input class="inp-t" type="text" placeholder="Description"><div class="pfx-wrap"><span class="pfx">RM</span><input class="inp pl row-amt" type="number" placeholder="0.00" min="0" step="0.01" oninput="recalc()"></div><button class="btn-rm" onclick="this.closest('.exp-row').remove();recalc()">×</button>`;
  c.appendChild(row);
}
function addLiabRow(e) {
  e?.stopPropagation();
  const c = R('rows-liab');
  const cats = ['Mortgage','Car Loan','Personal Loan','PTPTN','Credit Card','Business Loan','Other'];
  const row = document.createElement('div');
  row.className = 'exp-row-4';
  row.innerHTML = `<select class="inp-t" style="font-size:12px">${cats.map(c=>`<option>${c}</option>`).join('')}</select><input class="inp-t" type="text" placeholder="Description"><div class="pfx-wrap"><span class="pfx">RM</span><input class="inp pl row-amt" type="number" placeholder="0.00" min="0" step="0.01" oninput="recalc()"></div><button class="btn-rm" onclick="this.closest('.exp-row-4').remove();recalc()">×</button>`;
  c.appendChild(row);
}

/* ── RESET FUNCTIONS ── */
function resetRows(group, e) {
  e?.stopPropagation();
  if(!confirm('Reset all data in this section?')) return;
  const el = R('rows-'+group);
  if(el) el.innerHTML='';
  recalc();
}
function resetSalary(e) {
  e?.stopPropagation();
  if(!confirm('Reset salary data?')) return;
  R('salary-basic').value=''; R('salary-bonus').value='';
  recalc();
}
function resetDeductions(e) {
  e?.stopPropagation();
  if(!confirm('Reset all deductions?')) return;
  ['ded-epf','ded-eis','ded-socso','ded-zakat'].forEach(id=>{ const el=R(id); if(el) el.value=''; });
  const rd=R('rows-ded'); if(rd) rd.innerHTML='';
  recalc();
}
function resetSeg(n) {
  const labels = {1:'all Inflow data',2:'all Outflow data',3:'all Asset data',4:'all Liability data'};
  if(!confirm('Reset '+labels[n]+'? This cannot be undone.')) return;
  if(n===1) {
    R('salary-basic').value=''; R('salary-bonus').value='';
    ['allow','passive','side'].forEach(g=>{ const el=R('rows-'+g); if(el) el.innerHTML=''; });
    ['ded-epf','ded-eis','ded-socso','ded-zakat'].forEach(id=>{ const el=R(id); if(el) el.value=''; });
    const rd=R('rows-ded'); if(rd) rd.innerHTML='';
  } else if(n===2) {
    ['mtg','non','fix','var','sav','tak'].forEach(g=>{ const el=R('rows-'+g); if(el) el.innerHTML=''; });
  } else if(n===3) {
    ['cash','inv','prop','ret'].forEach(g=>{ const el=R('rows-'+g); if(el) el.innerHTML=''; });
  } else if(n===4) {
    const el=R('rows-liab'); if(el) el.innerHTML='';
  }
  recalc();
}

/* ── COMMENTARY ── */
function saveCommentary(key, el) {
  const val = el.value;
  const cnt = R('cc-'+key);
  if(cnt) cnt.textContent = val.length+' / '+el.maxLength;
  try { localStorage.setItem(noteKey(key), val); } catch(e){}
}
function loadCommentaries() {
  document.querySelectorAll('textarea[id^="cb-"]').forEach(ta => {
    const key = ta.id.replace('cb-','');
    try {
      const saved = localStorage.getItem(noteKey(key));
      if(saved) {
        ta.value = saved;
        const cnt = R('cc-'+key);
        if(cnt) cnt.textContent = saved.length+' / '+ta.maxLength;
      }
    } catch(e){}
  });
}

/* ── PRINT AS PDF ── */
function printAsPDF() {
  document.querySelectorAll('textarea[id^="cb-"]').forEach(ta => {
    const key = ta.id.replace('cb-','');
    let printDiv = R('cp-'+key);
    if(!printDiv) {
      printDiv = document.createElement('div');
      printDiv.className = 'commentary-print';
      printDiv.id = 'cp-'+key;
      ta.parentNode.insertBefore(printDiv, ta.nextSibling);
    }
    printDiv.textContent = ta.value || '';
  });
  window.print();
}


function recalc() {
  const sal = getVal('salary-basic')+getVal('salary-bonus');
  const allow = sumRows('rows-allow'), passive = sumRows('rows-passive'), side = sumRows('rows-side');
  const gross = sal+allow+passive+side;
  const epf=getVal('ded-epf'), eis=getVal('ded-eis'), socso=getVal('ded-socso'), zakat=getVal('ded-zakat'), othDed=sumRows('rows-ded');
  const totalDed = epf+eis+socso+zakat+othDed;
  const netInc = gross - totalDed;

  const mtg=sumRows('rows-mtg'), non=sumRows('rows-non'), fix=sumRows('rows-fix'), vari=sumRows('rows-var'), sav=sumRows('rows-sav'), tak=sumRows('rows-tak');
  const totalOut = mtg+non+fix+vari+sav+tak;

  const cash=sumRows('rows-cash'), inv=sumRows('rows-inv'), prop=sumRows('rows-prop'), ret=sumRows('rows-ret');
  const totalAssets = cash+inv+prop+ret;
  const liab=sumRows('rows-liab');

  // card sums
  setText('sum-salary',fmtRM(sal)); setText('sum-allow',fmtRM(allow)); setText('sum-passive',fmtRM(passive)); setText('sum-side',fmtRM(side));
  setText('sum-ded','− '+fmtRM(totalDed)); setText('seg1-tot',fmtRM(gross));
  setText('sum-mtg',fmtRM(mtg)); setText('sum-non',fmtRM(non)); setText('sum-fix',fmtRM(fix)); setText('sum-var',fmtRM(vari)); setText('sum-sav',fmtRM(sav)); setText('sum-tak',fmtRM(tak));
  setText('seg2-tot',fmtRM(totalOut));
  setText('sum-cash',fmtRM(cash)); setText('sum-inv',fmtRM(inv)); setText('sum-prop',fmtRM(prop)); setText('sum-ret',fmtRM(ret));
  setText('seg3-tot',fmtRM(totalAssets));
  setText('sum-liab','− '+fmtRM(liab)); setText('seg4-tot',fmtRM(liab));

  // sidebar summaries
  setText('ss1-salary',fmtRM(sal)); setText('ss1-allow',fmtRM(allow)); setText('ss1-passive',fmtRM(passive)); setText('ss1-side',fmtRM(side));
  setText('ss1-gross',fmtRM(gross)); setText('ss1-epf',fmtRM(epf)); setText('ss1-eis',fmtRM(eis)); setText('ss1-socso',fmtRM(socso)); setText('ss1-zakat',fmtRM(zakat)); setText('ss1-othded',fmtRM(othDed));
  const s1n=R('ss1-net'); if(s1n){s1n.textContent=fmtRM(netInc);s1n.className='ss-v ss-b '+(netInc>=0?'positive':'negative');}

  setText('ss2-mtg',fmtRM(mtg)); setText('ss2-non',fmtRM(non)); setText('ss2-fix',fmtRM(fix)); setText('ss2-var',fmtRM(vari)); setText('ss2-sav',fmtRM(sav)); setText('ss2-tak',fmtRM(tak));
  setText('ss2-tot',fmtRM(totalOut));
  const cf=netInc-totalOut; const s2cf=R('ss2-cf'); if(s2cf){s2cf.textContent=fmtRM(cf);s2cf.className='ss-v ss-b '+(cf>=0?'positive':'negative');}

  setText('ss3-cash',fmtRM(cash)); setText('ss3-inv',fmtRM(inv)); setText('ss3-prop',fmtRM(prop)); setText('ss3-ret',fmtRM(ret)); setText('ss3-tot',fmtRM(totalAssets));

  const liabData = getRowData('rows-liab');
  const ss4 = R('ss4-rows');
  if(ss4) ss4.innerHTML = liabData.length===0
    ? '<div class="ss-row" style="color:var(--text3);font-style:italic"><span>No liabilities added</span></div>'
    : liabData.map(r=>`<div class="ss-row"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px">${r.desc||'Item'}</span><span class="ss-v">${fmtRM(r.amount)}</span></div>`).join('');
  setText('ss4-tot',fmtRM(liab));
  const nw=totalAssets-liab; const s4nw=R('ss4-nw'); if(s4nw){s4nw.textContent=fmtRM(nw);s4nw.className='ss-v ss-b '+(nw>=0?'positive':'negative');}

  // progress
  const fields=document.querySelectorAll('#page-entry .inp, #page-entry .inp-t');
  let filled=0; fields.forEach(f=>{if(f.value&&f.value.trim())filled++;});
  const pct=Math.min(100,Math.round(filled/Math.max(fields.length,1)*100));
  R('prog-bar').style.width=pct+'%'; R('prog-pct').textContent=pct+'%';

  saveData();
}

/* ── COLLECT / SAVE / LOAD ── */
function getRowData(id) {
  const el=R(id); if(!el) return [];
  return Array.from(el.querySelectorAll('.exp-row, .exp-row-4')).map(row=>{
    const texts=row.querySelectorAll('input[type=text],select');
    const amt=row.querySelector('.row-amt');
    return {desc:texts[texts.length-1]?.value||texts[0]?.value||'', amount:parseFloat(amt?.value)||0};
  });
}
function collectData() {
  return {
    salary:getVal('salary-basic'), bonus:getVal('salary-bonus'),
    allow:getRowData('rows-allow'), passive:getRowData('rows-passive'), side:getRowData('rows-side'),
    epf:getVal('ded-epf'), eis:getVal('ded-eis'), socso:getVal('ded-socso'), zakat:getVal('ded-zakat'), othDed:getRowData('rows-ded'),
    mtg:getRowData('rows-mtg'), non:getRowData('rows-non'), fix:getRowData('rows-fix'), vari:getRowData('rows-var'), sav:getRowData('rows-sav'), tak:getRowData('rows-tak'),
    cash:getRowData('rows-cash'), inv:getRowData('rows-inv'), prop:getRowData('rows-prop'), ret:getRowData('rows-ret'),
    liab:getRowData('rows-liab'),
  };
}
async function saveData() {
  if (!window.WQStorage) return;
  try { await WQStorage.saveMonthData(currentYear, currentMonth, collectData()); }
  catch(e){ console.error('Save failed', e); }
}
function loadRows(id, rows, isLiab) {
  if(!rows||!rows.length) return;
  rows.forEach(r=>{
    if(isLiab) addLiabRow(); else addRow(id.replace('rows-',''));
    const c=R(id), last=c.lastElementChild;
    const ti=last.querySelector('input[type=text]'), ai=last.querySelector('.row-amt');
    if(ti) ti.value=r.desc||''; if(ai) ai.value=r.amount||'';
  });
}

/* ── ANALYSIS RENDERER ── */
let donutChart;
let _netWorth = 0;

function updateInvRatio() {
  const iv = parseFloat(R('inv-ratio-input')?.value)||0;
  const ratio = _netWorth > 0 ? (iv / _netWorth * 100) : 0;
  const el = R('inv-ratio-val'), tag = R('inv-ratio-tag');
  if(el){ el.textContent = ratio.toFixed(2)+'%'; el.className='fh-val '+(ratio>=15?'positive':ratio>=8?'warning':'negative'); }
  if(tag){ tag.textContent = ratio>=15?'Good':ratio>=8?'Fair':'Below target'; tag.className='h-tag '+(ratio>=15?'tg':ratio>=8?'tw':'tb'); }
}

function renderAnalysis() {
  const data = collectData();
  const hasData = data.salary>0||sumArr(data.allow)>0||sumArr(data.passive)>0||sumArr(data.side)>0;
  R('a-empty').style.display = hasData?'none':'block';
  R('a-content').style.display = hasData?'block':'none';
  if(!hasData) return;

  R('a-date').textContent = 'Generated on '+new Date().toLocaleDateString('en-MY',{year:'numeric',month:'long',day:'numeric'});

  /* ── Core figures ── */
  const sal   = data.salary+data.bonus;
  const allow = sumArr(data.allow), passive=sumArr(data.passive), side=sumArr(data.side);
  const gross = sal+allow+passive+side;
  const totalDed = data.epf+data.eis+data.socso+data.zakat+sumArr(data.othDed);
  const netInc = gross-totalDed;
  const mtg=sumArr(data.mtg), non=sumArr(data.non), fix=sumArr(data.fix);
  const vari=sumArr(data.vari), sav=sumArr(data.sav), tak=sumArr(data.tak);
  const totalOut = mtg+non+fix+vari+sav+tak;
  const surplus  = netInc-totalOut;
  const netCF    = surplus;  // same thing
  const cash=sumArr(data.cash), inv=sumArr(data.inv), prop=sumArr(data.prop), ret=sumArr(data.ret);
  const totalAssets = cash+inv+prop+ret;
  const totalLiab   = sumArr(data.liab);
  const nwWith      = totalAssets - totalLiab;               // with EPF
  const nwWithout   = (totalAssets - ret) - totalLiab;      // without EPF
  _netWorth = nwWith;
  const expenses = totalOut;

  /* ── Quadrant ── */
  setText('aq-sal',fmtRM(sal)); setText('aq-all',fmtRM(allow)); setText('aq-pas',fmtRM(passive)); setText('aq-sid',fmtRM(side)); setText('aq-ded',fmtRM(totalDed));
  const aqn=R('aq-net'); if(aqn){aqn.textContent=fmtRM(netInc);aqn.className='q-fv '+(netInc>=0?'positive':'negative');}
  setText('aq-mtg',fmtRM(mtg)); setText('aq-non',fmtRM(non)); setText('aq-fix',fmtRM(fix)); setText('aq-var',fmtRM(vari)); setText('aq-sav',fmtRM(sav)); setText('aq-tak',fmtRM(tak)); setText('aq-out',fmtRM(totalOut));
  setText('aq-csh',fmtRM(cash)); setText('aq-inv',fmtRM(inv)); setText('aq-prp',fmtRM(prop)); setText('aq-ret',fmtRM(ret)); setText('aq-ast',fmtRM(totalAssets));
  const lr=R('aq-liab-rows'); if(lr) lr.innerHTML=(data.liab||[]).length===0
    ?'<div class="q-row" style="color:var(--text3);font-style:italic"><span>None recorded</span></div>'
    :data.liab.map(l=>`<div class="q-row"><span style="max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l.desc||'Item'}</span><span class="q-val">${fmtRM(l.amount)}</span></div>`).join('');
  setText('aq-lib',fmtRM(totalLiab));

  /* ── Figurative Summary KPIs ── */
  setText('kpi-gross',fmtRM(gross)); setText('kpi-net',fmtRM(netInc)); setText('kpi-out',fmtRM(totalOut));
  const ks=R('kpi-sur');
  const isSurplus = surplus >= 0;
  if(ks){
    ks.textContent = fmtRM(surplus);
    ks.className = 'kpi-val ' + (isSurplus ? 'surplus' : 'deficit');
  }
  setText('kpi-cf-lbl', isSurplus ? 'NET CASHFLOW — SURPLUS' : 'NET CASHFLOW — DEFICIT');
  setText('kpi-cf-sub', isSurplus ? 'Positive · Net Income − Total Outflow' : 'Negative · Net Income − Total Outflow');

  /* ── Budget Breakdown table (% only, no Amount, no Status) ── */
  const COLORS={mtg:'#378ADD',non:'#7F77DD',fix:'#1D9E75',vari:'#EF9F27',sav:'#2d9e6b',tak:'#D4537E'};
  const bkb=R('bk-body'); bkb.innerHTML='';
  [{cat:'Mortgage Commitment',v:mtg,c:COLORS.mtg},{cat:'Non-Mortgage Commitment',v:non,c:COLORS.non},
   {cat:'Fixed Expenses',v:fix,c:COLORS.fix},{cat:'Variable Expenses',v:vari,c:COLORS.vari},
   {cat:'Savings / Investment',v:sav,c:COLORS.sav},{cat:'Protection / Takaful',v:tak,c:COLORS.tak}].forEach(r=>{
    const p=netInc>0?(r.v/netInc*100):0;
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><span class="cat-badge"><span class="cat-dot" style="background:${r.c}"></span>${r.cat}</span></td><td style="text-align:right;font-family:'DM Mono',monospace;font-weight:500">${p.toFixed(1)}%</td>`;
    bkb.appendChild(tr);
  });
  const ttr=document.createElement('tr');
  ttr.innerHTML=`<td style="font-weight:500">Total Outflow</td><td style="text-align:right;font-weight:500;font-family:'DM Mono',monospace">${netInc>0?(totalOut/netInc*100).toFixed(1)+'%':'—'}</td>`;
  bkb.appendChild(ttr);

  /* ── Income Allocation bars ── */
  const ab=R('alloc-bars'); ab.innerHTML='';
  [{l:'Deductions',v:totalDed,c:'#D85A30'},{l:'Mortgage',v:mtg,c:COLORS.mtg},{l:'Non-Mortgage',v:non,c:COLORS.non},
   {l:'Fixed Exp.',v:fix,c:COLORS.fix},{l:'Variable Exp.',v:vari,c:COLORS.vari},
   {l:'Savings/Invest',v:sav,c:COLORS.sav},{l:'Takaful',v:tak,c:COLORS.tak},
   {l: isSurplus ? 'Surplus' : 'Deficit', v:Math.abs(surplus), c: isSurplus ? '#1a6b47' : '#8b2020'}].forEach(a=>{
    const p=gross>0?Math.min(a.v/gross*100,100):0;
    const d=document.createElement('div'); d.className='bar-item';
    d.innerHTML=`<div class="bar-item-top"><span class="bar-lbl">${a.l}</span><span class="bar-val" style="color:${a.c}">${p.toFixed(1)}%</span></div><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${a.c}"></div></div>`;
    ab.appendChild(d);
  });

  /* ── Net Worth Detail ── */
  const nwwEl=R('nw-with');
  if(nwwEl){nwwEl.textContent=fmtRM(nwWith);nwwEl.className='nw-card-val '+(nwWith>=0?'positive':'negative');}
  const nwwoEl=R('nw-without');
  if(nwwoEl){nwwoEl.textContent=fmtRM(nwWithout);nwwoEl.className='nw-card-val '+(nwWithout>=0?'positive':'negative');}

  const asb=R('asset-bars'); asb.innerHTML='';
  [{l:'Cash & Equiv.',v:cash,c:'#1D9E75'},{l:'Investments',v:inv,c:'#378ADD'},{l:'Property',v:prop,c:'#6b4e1a'},{l:'Retirement (EPF)',v:ret,c:'#7F77DD'}].forEach(a=>{
    const p=totalAssets>0?a.v/totalAssets*100:0;
    const d=document.createElement('div'); d.className='bar-item';
    d.innerHTML=`<div class="bar-item-top"><span class="bar-lbl">${a.l}</span><span class="bar-val" style="color:${a.c}">${fmtRM(a.v)}</span></div><div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${a.c}"></div></div>`;
    asb.appendChild(d);
  });

  const ld=R('liab-detail');
  if(!data.liab||data.liab.length===0){ld.innerHTML='<div style="font-size:13px;color:var(--text3);padding:8px 0">No liabilities recorded</div>';}
  else{
    const ul=document.createElement('div'); ul.className='bar-list';
    data.liab.forEach(l=>{const d=document.createElement('div');d.className='bar-item';
      d.innerHTML=`<div class="bar-item-top"><span class="bar-lbl">${l.desc||'Liability'}</span><span class="bar-val negative">${fmtRM(l.amount)}</span></div><div class="bar-track"><div class="bar-fill" style="width:${totalLiab>0?l.amount/totalLiab*100:0}%;background:#D85A30"></div></div>`;
      ul.appendChild(d);});
    ld.innerHTML=''; ld.appendChild(ul);
    const tot=document.createElement('div');
    tot.style.cssText='margin-top:12px;padding-top:10px;border-top:1px solid var(--border);display:flex;justify-content:space-between;font-size:13px;font-weight:500';
    tot.innerHTML=`<span>Total Liabilities</span><span class="negative" style="font-family:'DM Mono',monospace">${fmtRM(totalLiab)}</span>`;
    ld.appendChild(tot);
  }

  /* ── Financial Health rows ── */
  const f2 = v => isFinite(v)&&!isNaN(v)?v.toFixed(2):'0.00';
  const fhGrid=R('fh-grid'); fhGrid.innerHTML='';

  const savRatio     = netInc>0  ? (sav+Math.max(netCF,0))/netInc          : 0;
  const liqRatio     = expenses>0 ? cash/expenses                            : 0;
  const standbyLiq   = expenses>0 ? inv/expenses                             : 0;
  const debtRatio    = totalAssets>0 ? (totalLiab/totalAssets)*100           : 0;
  const dsr          = netInc>0  ? ((mtg+non)/netInc)*100                   : 0;
  const nonMtgDsr    = netInc>0  ? (non/netInc)*100                         : 0;
  const liqToNW      = nwWith>0  ? (cash/nwWith)*100                        : 0;
  const solvency     = totalAssets>0 ? (nwWith/totalAssets)*100             : 0;
  const wrWith       = expenses>0 ? nwWith/expenses                          : 0;
  const wrWithout    = expenses>0 ? nwWithout/expenses                       : 0;

  const fhRows=[
    {name:'Wealth Ratio (with EPF)',     fml:'Net Worth (with EPF) ÷ Expenses',              bench:'Higher is better',         val:wrWith,     fmt:v=>f2(v)+'×',  good:v=>v>=1,    warn:v=>v>=0.5},
    {name:'Wealth Ratio (without EPF)',  fml:'Net Worth (without EPF) ÷ Expenses',           bench:'Higher is better',         val:wrWithout,  fmt:v=>f2(v)+'×',  good:v=>v>=1,    warn:v=>v>=0.5},
    {name:'Liquidity Ratio',             fml:'Cash & Cash Equiv. ÷ Expenses',                bench:'Benchmark ≥ 3×',           val:liqRatio,   fmt:v=>f2(v)+'×',  good:v=>v>=3,    warn:v=>v>=1},
    {name:'Standby Liquidity Ratio',     fml:'Investments ÷ Expenses',                       bench:'Benchmark ≥ 3×',           val:standbyLiq, fmt:v=>f2(v)+'×',  good:v=>v>=3,    warn:v=>v>=1},
    {name:'Saving Ratio',                fml:'(Savings + Net Cashflow) ÷ Net Income',        bench:'Benchmark ≥ 3×',           val:savRatio,   fmt:v=>f2(v)+'×',  good:v=>v>=3,    warn:v=>v>=1},
    {name:'Debt Ratio',                  fml:'Total Liabilities ÷ Total Assets',             bench:'Healthy < 10%',            val:debtRatio,  fmt:v=>f2(v)+'%',  good:v=>v<10,    warn:v=>v<25},
    {name:'DSR (Debt-Service Ratio)',    fml:'(Mortgage + Non-Mortgage) ÷ Net Income',       bench:'Benchmark < 35%',          val:dsr,        fmt:v=>f2(v)+'%',  good:v=>v<35,    warn:v=>v<50},
    {name:'Non-Mortgage DSR',            fml:'Non-Mortgage Commitment ÷ Net Income',         bench:'Benchmark < 15%',          val:nonMtgDsr,  fmt:v=>f2(v)+'%',  good:v=>v<15,    warn:v=>v<25},
    {name:'Liquid Asset to Net Worth',   fml:'Cash & Cash Equiv. ÷ Net Worth (with EPF)',   bench:'Benchmark ≥ 15%',          val:liqToNW,    fmt:v=>f2(v)+'%',  good:v=>v>=15,   warn:v=>v>=8},
    {name:'Solvency Ratio',              fml:'Net Worth (with EPF) ÷ Total Assets',          bench:'Benchmark ≥ 15%',          val:solvency,   fmt:v=>f2(v)+'%',  good:v=>v>=15,   warn:v=>v>=8},
  ];

  fhRows.forEach((r,i)=>{
    const isGood=r.good(r.val), isWarn=!isGood&&r.warn(r.val);
    const cls=isGood?'tg':isWarn?'tw':'tb', tag=isGood?'Good':isWarn?'Fair':'Needs attention';
    const key = 'fh-'+i;
    const row=document.createElement('div'); row.className='fh-row';
    row.innerHTML=`<div><div class="fh-name">${r.name}</div><div class="fh-fml">${r.fml}</div><div class="fh-bench">${r.bench}</div><div class="commentary-wrap" style="margin-top:8px"><div class="commentary-lbl">Commentary <span class="commentary-char" id="cc-${key}">0 / 300</span></div><textarea class="commentary-box" id="cb-${key}" maxlength="300" placeholder="Add notes for ${r.name}…" oninput="saveCommentary('${key}',this)" rows="2"></textarea></div></div><div class="fh-right" style="align-self:flex-start;margin-top:4px"><div class="fh-val ${isGood?'positive':isWarn?'warning':'negative'}">${r.fmt(r.val)}</div><span class="h-tag ${cls}">${tag}</span></div>`;
    fhGrid.appendChild(row);
  });
  updateInvRatio();

  /* ── Outflow Breakdown donut (Budget Breakdown section) ── */
  const donutData=[{l:'Mortgage',v:mtg,c:COLORS.mtg},{l:'Non-Mortgage',v:non,c:COLORS.non},{l:'Fixed',v:fix,c:COLORS.fix},{l:'Variable',v:vari,c:COLORS.vari},{l:'Savings',v:sav,c:COLORS.sav},{l:'Takaful',v:tak,c:COLORS.tak}].filter(d=>d.v>0);
  if(donutChart) donutChart.destroy();
  donutChart = new Chart(R('chart-donut').getContext('2d'),{
    type:'doughnut',
    data:{labels:donutData.map(d=>d.l),datasets:[{data:donutData.map(d=>d.v),backgroundColor:donutData.map(d=>d.c),borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'58%',
      plugins:{legend:{position:'bottom',labels:{font:{size:11,family:'DM Sans'},boxWidth:10,padding:12}},
               tooltip:{callbacks:{label:ctx=>ctx.label+': '+fmtRM(ctx.raw)}}}}
  });

  /* ── Role-based section visibility ── */
  const isPremium = WQAuth.getRole() !== 'superadmin';
  const fhSec = document.getElementById('section-financial-health');
  const apSec = document.getElementById('section-action-plan');
  if (fhSec) fhSec.style.display = isPremium ? 'none' : '';
  if (apSec) apSec.style.display = isPremium ? 'none' : '';
}


/* ── PDF DOWNLOAD ── */
async function downloadPDF() {
  const btn = R('btn-pdf');
  const overlay = R('pdf-overlay');
  const status = R('pdf-status');

  btn.disabled = true;

  // Show overlay AFTER a short delay so it never gets captured
  const overlayTimer = setTimeout(() => {
    overlay.classList.add('show');
    status.textContent = 'Preparing report…';
  }, 50);

  try {
    const { jsPDF } = window.jspdf;
    const content = R('a-content');

    // Hide btn and overlay from capture
    btn.style.visibility = 'hidden';
    overlay.classList.remove('show');

    // Let browser settle
    await new Promise(r => setTimeout(r, 200));

    status.textContent = 'Capturing page…';
    overlay.classList.add('show');

    await new Promise(r => setTimeout(r, 100));

    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#f7f6f2',
      logging: false,
      ignoreElements: el => {
        // Skip the overlay, btn, and any fixed/sticky elements
        return el.id === 'pdf-overlay' ||
               el.id === 'btn-pdf' ||
               el.classList?.contains('pdf-overlay') ||
               el.classList?.contains('topbar') ||
               getComputedStyle(el).position === 'fixed';
      }
    });

    status.textContent = 'Building PDF…';
    await new Promise(r => setTimeout(r, 100));

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageW  = pdf.internal.pageSize.getWidth();
    const pageH  = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const usableW = pageW - margin * 2;

    // Scale: canvas is at 2× device pixels → divide by 2 for CSS pixels → convert to mm
    const mmPerPx  = usableW / (canvas.width / 2);
    const totalMM  = (canvas.height / 2) * mmPerPx;
    const sliceMMH = pageH - margin * 2 - 8; // usable height per page (leave room for header)
    const slicePxH = (sliceMMH / mmPerPx) * 2; // in canvas (2×) pixels

    const today = new Date().toLocaleDateString('en-MY', {year:'numeric',month:'long',day:'numeric'});
    let pageNum = 1;
    let srcY = 0;

    while (srcY < canvas.height) {
      if (pageNum > 1) pdf.addPage();

      const srcH = Math.min(slicePxH, canvas.height - srcY);
      const sliceActualMM = (srcH / 2) * mmPerPx;

      // Slice canvas
      const slice = document.createElement('canvas');
      slice.width  = canvas.width;
      slice.height = srcH;
      slice.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

      const sliceData = slice.toDataURL('image/jpeg', 0.95);

      // Header bar
      pdf.setFillColor(247, 246, 242);
      pdf.rect(0, 0, pageW, 9, 'F');
      pdf.setFontSize(7);
      pdf.setTextColor(120, 117, 112);
      pdf.text('Wealth Quadrant Online — Financial Analysis', margin, 6);
      pdf.text(`Page ${pageNum}`, pageW - margin, 6, { align: 'right' });

      // Content image
      pdf.addImage(sliceData, 'JPEG', margin, 10, usableW, sliceActualMM);

      // Footer on last page
      if (srcY + slicePxH >= canvas.height) {
        pdf.setFontSize(7);
        pdf.setTextColor(160, 157, 152);
        pdf.text(`Generated on ${today} · Wealth Quadrant Online`, margin, pageH - 4);
      }

      srcY += slicePxH;
      pageNum++;
    }

    const filename = `WealthQuadrant_${new Date().toISOString().slice(0,10)}.pdf`;
    pdf.save(filename);

    status.textContent = '✓ Download complete';
    await new Promise(r => setTimeout(r, 800));

  } catch(err) {
    console.error('PDF error:', err);
    status.textContent = 'Error — please try again.';
    await new Promise(r => setTimeout(r, 2000));
  } finally {
    clearTimeout(overlayTimer);
    btn.style.visibility = '';
    btn.disabled = false;
    overlay.classList.remove('show');
  }
}


function loadDataIntoForm(d) {
  try {
    if(!d) return;
    if(d.salary) R('salary-basic').value=d.salary;
    if(d.bonus)  R('salary-bonus').value=d.bonus;
    ['allow','passive','side'].forEach(k=>loadRows('rows-'+k,d[k]));
    if(d.epf)   R('ded-epf').value=d.epf;
    if(d.eis)   R('ded-eis').value=d.eis;
    if(d.socso) R('ded-socso').value=d.socso;
    if(d.zakat) R('ded-zakat').value=d.zakat;
    loadRows('rows-ded',d.othDed);
    ['mtg','non','fix','vari','sav','tak','cash','inv','prop','ret'].forEach(k=>loadRows('rows-'+k,d[k]));
    loadRows('rows-liab',d.liab,true);
    recalc();
  
  } catch(e){ console.error('Load form failed', e); }
}


window.WQApp = {
  initApp: function(){ loadCurrentPeriod(); },
  loadCurrentPeriod
};
