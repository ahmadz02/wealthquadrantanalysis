/* Wealth Quadrant Analyzer - Personal Data Module
   Uses existing design tokens/classes from styles.css: card, ch, cb, inp, inp-t, btn-add, etc.
   Load after storage.js and before app.js integration code that calls WQPersonalData.renderPage().
*/
window.WQPersonalData = (() => {
  const LS_KEY = 'wq_personal_profile';
  let activeUserId = null;
  let currentProfile = defaultProfile();

  function R(id) { return document.getElementById(id); }
  function esc(v) {
    return String(v ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  async function getSupabaseUserId() {
  const {
    data: { user },
    error
  } = await WQSupabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error('No Supabase Auth user found. Please login again.');

  return user.id;
}

  function localKey(userId = getCurrentUserId()) {
  const period = window.getCurrentPeriod?.() || {};
  const year = period.year;
  const month = period.month;

  return window.WQStorage?.getScopedLocalKey?.(
    `${LS_KEY}-${year}-${month}`,
    userId
  ) || `${LS_KEY}:${userId || 'anonymous'}:${year}-${month}`;
}

  function defaultProfile() {
    return {
      full_name: '',
      ic_number: '',
      current_age: '',
      phone: '',
      profession: '',
      home_address: '',
      email: '',
      spouse_enabled: false,
      spouse: {
        name: '',
        ic_number: '',
        current_age: '',
        phone: '',
        profession: ''
      },
      children_enabled: false,
      children: []
    };
  }

  function renderPage() {
    return `
      <div class="page" id="page-personal">
        <div class="main-area" style="padding:2rem;flex:1">
          <div class="seg-hdr">
            <div>
              <div class="seg-tag t1">Personal Data</div>
              <div class="seg-title">Personal Information</div>
              <div class="seg-desc">Basic client profile, family information and supporting details</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end">
              <div class="seg-tot-box">
                <div class="tot-label">Profile Status</div>
                <div class="tot-val neutral" id="pd-status">Incomplete</div>
              </div>
              <button class="btn-nav btn-pri" type="button" onclick="WQPersonalData.saveProfile()
              .then(()=>{this.textContent='Saved';setTimeout(()=>this.textContent='Save data',1200)})
              .catch(err=>{this.textContent='Save failed';alert(err.message);setTimeout(()=>this.textContent='Save data',1200)})">
              Save data </button>
                        
              </div>
          </div>

          <div class="card">
            <div class="ch open" style="cursor:default">
              <div class="ch-left">
                <div class="ci ci1">👤</div>
                <div>
                  <div class="ch-title">Basic Information</div>
                  <div class="ch-sub">Main personal details for the report</div>
                </div>
              </div>
            </div>
            <div class="cb open">
              <div class="f-static"><div><div class="f-label">Name</div><div class="f-sub">Full name as per IC</div></div><input class="inp-t" id="pd-name" type="text" placeholder="Full name" oninput="WQPersonalData.handleInput()"></div>
              <div class="f-static"><div><div class="f-label">IC Number</div><div class="f-sub">Identification number</div></div><input class="inp-t" id="pd-ic" type="text" placeholder="IC number" oninput="WQPersonalData.handleInput()"></div>
              <div class="f-static"><div><div class="f-label">Current Age</div><div class="f-sub">Age in years</div></div><input class="inp age-input" id="pd-age" type="number" min="0" placeholder="0" oninput="WQPersonalData.handleInput()"></div>
              <div class="f-static"><div><div class="f-label">Phone Number</div><div class="f-sub">Main contact number</div></div><input class="inp-t" id="pd-phone" type="text" placeholder="Phone number" oninput="WQPersonalData.handleInput()"></div>
              <div class="f-static"><div><div class="f-label">Email</div><div class="f-sub">Used in PDF basic info</div></div><input class="inp-t" id="pd-email" type="email" placeholder="Email address" oninput="WQPersonalData.handleInput()"></div>
              <div class="f-static"><div><div class="f-label">Profession</div><div class="f-sub">Occupation or business</div></div><input class="inp-t" id="pd-profession" type="text" placeholder="Profession" oninput="WQPersonalData.handleInput()"></div>
              <div style="padding:8px 0">
                <div class="f-label" style="margin-bottom:4px">Home Address</div>
                <div class="f-sub" style="margin-bottom:6px">Residential address</div>
                <textarea class="commentary-box" id="pd-address" maxlength="500" rows="3" placeholder="Home address" oninput="WQPersonalData.handleInput()"></textarea>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="ch" onclick="WQPersonalData.toggleCard(this)">
              <div class="ch-left">
                <div class="ci ci3">💍</div>
                <div>
                  <div class="ch-title">Spouse Info</div>
                  <div class="ch-sub">Optional spouse details</div>
                </div>
              </div>
              <div class="ch-right">
                <label style="font-size:12px;color:var(--text2);display:flex;align-items:center;gap:6px" onclick="event.stopPropagation()">
                  <input type="checkbox" id="pd-spouse-enabled" onchange="WQPersonalData.toggleSpouse()"> Add Spouse Info
                </label>
                <svg class="chev" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </div>
            </div>
            <div class="cb" id="pd-spouse-section">
              <div class="f-static"><div><div class="f-label">Name</div><div class="f-sub">Spouse full name</div></div><input class="inp-t" id="pd-spouse-name" type="text" placeholder="Spouse name" oninput="WQPersonalData.handleInput()"></div>
              <div class="f-static"><div><div class="f-label">IC Number</div><div class="f-sub">Spouse identification number</div></div><input class="inp-t" id="pd-spouse-ic" type="text" placeholder="IC number" oninput="WQPersonalData.handleInput()"></div>
              <div class="f-static"><div><div class="f-label">Current Age</div><div class="f-sub">Age in years</div></div><input class="inp age-input" id="pd-spouse-age" type="number" min="0" placeholder="0" oninput="WQPersonalData.handleInput()"></div>
              <div class="f-static"><div><div class="f-label">Phone Number</div><div class="f-sub">Contact number</div></div><input class="inp-t" id="pd-spouse-phone" type="text" placeholder="Phone number" oninput="WQPersonalData.handleInput()"></div>
              <div class="f-static"><div><div class="f-label">Profession</div><div class="f-sub">Occupation or business</div></div><input class="inp-t" id="pd-spouse-profession" type="text" placeholder="Profession" oninput="WQPersonalData.handleInput()"></div>
            </div>
          </div>

          <div class="card">
            <div class="ch" onclick="WQPersonalData.toggleCard(this)">
              <div class="ch-left">
                <div class="ci ci2">👨‍👩‍👧</div>
                <div>
                  <div class="ch-title">Child's Info</div>
                  <div class="ch-sub">Optional expandable children list</div>
                </div>
              </div>
              <div class="ch-right">
                <label style="font-size:12px;color:var(--text2);display:flex;align-items:center;gap:6px" onclick="event.stopPropagation()">
                  <input type="checkbox" id="pd-children-enabled" onchange="WQPersonalData.toggleChildren()"> Add Child's Info
                </label>
                <svg class="chev" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </div>
            </div>
            <div class="cb" id="pd-children-section">
              <div style="display:grid;grid-template-columns:1fr 120px 30px;gap:6px;margin-bottom:6px">
                <div style="font-size:11px;color:var(--text3);padding:0 4px">Name</div>
                <div style="font-size:11px;color:var(--text3);padding:0 4px;text-align:right">Age</div>
                <div></div>
              </div>
              <div class="exp-rows" id="pd-children-rows"></div>
              <button class="btn-add" onclick="WQPersonalData.addChildRow(event)">+ Add child</button>
            </div>
          </div>

          <div class="seg-nav">
            <div></div>
            <button class="btn-nav btn-pri" onclick="showPage('entry')">Next: Data Entry →</button>
          </div>
        </div>
      </div>`;
  }

  function toggleCard(h) {
    const b = h.nextElementSibling;
    const c = h.querySelector('.chev');
    const o = b.classList.contains('open');
    b.classList.toggle('open', !o);
    h.classList.toggle('open', !o);
    c?.classList.toggle('open', !o);
  }

  function toggleSpouse() {
    const enabled = !!R('pd-spouse-enabled')?.checked;
    const section = R('pd-spouse-section');
    const header = section?.previousElementSibling;
    section?.classList.toggle('open', enabled);
    header?.classList.toggle('open', enabled);
    header?.querySelector('.chev')?.classList.toggle('open', enabled);
    handleInput();
  }

  function toggleChildren() {
    const enabled = !!R('pd-children-enabled')?.checked;
    const section = R('pd-children-section');
    const header = section?.previousElementSibling;
    section?.classList.toggle('open', enabled);
    header?.classList.toggle('open', enabled);
    header?.querySelector('.chev')?.classList.toggle('open', enabled);
    if (enabled && R('pd-children-rows')?.children.length === 0) addChildRow();
    handleInput();
  }

  function addChildRow(e, child = {}) {
    e?.stopPropagation?.();
    const wrap = R('pd-children-rows');
    if (!wrap) return;
    const row = document.createElement('div');
    row.className = 'exp-row';
    row.style.gridTemplateColumns = '1fr 120px 30px';
    row.innerHTML = `
      <input class="inp-t child-name" type="text" placeholder="Child name" value="${esc(child.name)}" oninput="WQPersonalData.handleInput()">
      <input class="inp child-age" type="number" min="0" placeholder="0" value="${esc(child.age)}" oninput="WQPersonalData.handleInput()">
      <button class="btn-rm" onclick="this.closest('.exp-row').remove();WQPersonalData.handleInput()">×</button>`;
    wrap.appendChild(row);
  }

  function collectData() {
    return {
      full_name: R('pd-name')?.value.trim() || '',
      ic_number: R('pd-ic')?.value.trim() || '',
      current_age: R('pd-age')?.value || '',
      phone: R('pd-phone')?.value.trim() || '',
      email: R('pd-email')?.value.trim() || '',
      profession: R('pd-profession')?.value.trim() || '',
      home_address: R('pd-address')?.value.trim() || '',
      spouse_enabled: !!R('pd-spouse-enabled')?.checked,
      spouse: {
        name: R('pd-spouse-name')?.value.trim() || '',
        ic_number: R('pd-spouse-ic')?.value.trim() || '',
        current_age: R('pd-spouse-age')?.value || '',
        phone: R('pd-spouse-phone')?.value.trim() || '',
        profession: R('pd-spouse-profession')?.value.trim() || ''
      },
      children_enabled: !!R('pd-children-enabled')?.checked,
      children: Array.from(R('pd-children-rows')?.querySelectorAll('.exp-row') || []).map(row => ({
        name: row.querySelector('.child-name')?.value.trim() || '',
        age: row.querySelector('.child-age')?.value || ''
      })).filter(c => c.name || c.age)
    };
  }

  function loadDataIntoForm(data = defaultProfile()) {
    currentProfile = { ...defaultProfile(), ...data, spouse: { ...defaultProfile().spouse, ...(data.spouse || {}) } };
    if (R('pd-name')) R('pd-name').value = currentProfile.full_name || '';
    if (R('pd-ic')) R('pd-ic').value = currentProfile.ic_number || '';
    if (R('pd-age')) R('pd-age').value = currentProfile.current_age || '';
    if (R('pd-phone')) R('pd-phone').value = currentProfile.phone || '';
    if (R('pd-email')) R('pd-email').value = currentProfile.email || '';
    if (R('pd-profession')) R('pd-profession').value = currentProfile.profession || '';
    if (R('pd-address')) R('pd-address').value = currentProfile.home_address || '';

    if (R('pd-spouse-enabled')) R('pd-spouse-enabled').checked = !!currentProfile.spouse_enabled;
    if (R('pd-spouse-name')) R('pd-spouse-name').value = currentProfile.spouse.name || '';
    if (R('pd-spouse-ic')) R('pd-spouse-ic').value = currentProfile.spouse.ic_number || '';
    if (R('pd-spouse-age')) R('pd-spouse-age').value = currentProfile.spouse.current_age || '';
    if (R('pd-spouse-phone')) R('pd-spouse-phone').value = currentProfile.spouse.phone || '';
    if (R('pd-spouse-profession')) R('pd-spouse-profession').value = currentProfile.spouse.profession || '';
    toggleSpouse();

    if (R('pd-children-enabled')) R('pd-children-enabled').checked = !!currentProfile.children_enabled;
    const rows = R('pd-children-rows');
    if (rows) rows.innerHTML = '';
    (currentProfile.children || []).forEach(child => addChildRow(null, child));
    toggleChildren();
    updateStatus();
  }

  function updateStatus() {
    const d = collectData();
    const required = [d.full_name, d.ic_number, d.current_age, d.phone, d.profession, d.home_address];
    const complete = required.filter(Boolean).length;
    const status = R('pd-status');
    if (!status) return;
    if (complete >= required.length) {
      status.textContent = 'Complete';
      status.className = 'tot-val positive';
    } else if (complete > 0) {
      status.textContent = 'Partial';
      status.className = 'tot-val warning';
    } else {
      status.textContent = 'Incomplete';
      status.className = 'tot-val neutral';
    }
  }

  async function saveProfile(data = collectData()) {
  currentProfile = data;
  const userId = await getSupabaseUserId();

  if (!window.WQSupabase) {
    throw new Error('Supabase client not loaded.');
  }

  if (!userId) {
    throw new Error('No active user. Please login first.');
  }

const period = window.getCurrentPeriod?.() || {};
const year = period.year;
const month = period.month;

  const payload = {
    user_id: userId,
    year,
    month,
    full_name: data.full_name,
    ic_number: data.ic_number,
    current_age: data.current_age ? Number(data.current_age) : null,
    phone: data.phone,
    email: data.email,
    profession: data.profession,
    home_address: data.home_address,
    spouse_enabled: data.spouse_enabled,
    spouse_data: data.spouse,
    children_enabled: data.children_enabled,
    children_data: data.children,
    updated_at: new Date().toISOString()
  };

  const { error } = await WQSupabase
    .from('personal_profiles')
    .upsert(payload, { onConflict: 'user_id,year,month' })

  if (error) {
    console.error('Supabase personal profile save failed:', error);
    throw error;
  }

  // Optional cache only after Supabase success
  try {
    localStorage.setItem(localKey(userId), JSON.stringify(data));
  } catch (e) {}

  return data;
}

  async function loadProfile(userId) {
    activeUserId = userId || getCurrentUserId();
    let data = null;

    if (window.WQSupabase && activeUserId) {
      const { data: row, error } = await WQSupabase.from('personal_profiles').select('*').eq('user_id', activeUserId).maybeSingle();
      if (!error && row) {
        data = {
          full_name: row.full_name || '',
          ic_number: row.ic_number || '',
          current_age: row.current_age || '',
          phone: row.phone || '',
          email: row.email || '',
          profession: row.profession || '',
          home_address: row.home_address || '',
          spouse_enabled: !!row.spouse_enabled,
          spouse: row.spouse_data || defaultProfile().spouse,
          children_enabled: !!row.children_enabled,
          children: row.children_data || []
        };
      }
    }

    if (!data) {
      try { data = JSON.parse(localStorage.getItem(localKey(activeUserId)) || 'null'); } catch (e) {}
    }

    loadDataIntoForm(data || defaultProfile());
    return currentProfile;
  }

  let saveTimer = null;
  function handleInput() {
    updateStatus();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveProfile().catch(console.warn), 350);
  }

  function getProfile() {
    return collectData();
  }

  return {
    renderPage,
    toggleCard,
    toggleSpouse,
    toggleChildren,
    addChildRow,
    collectData,
    loadDataIntoForm,
    loadProfile,
    saveProfile,
    handleInput,
    getProfile
  };
})();
