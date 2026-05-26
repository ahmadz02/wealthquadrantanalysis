window.WQStorage = (() => {
  let activeUserId = null;
  let cache = {};

  function storageKey(y,m){ return `pft_${y}_${m}`; }
  function scopedKey(y,m){ return `${activeUserId}/${storageKey(y,m)}.json`; }
  function localMonthKey(y,m){ return `wq:${activeUserId || 'anonymous'}:month:${y}:${m}`; }

  function clone(v){ return JSON.parse(JSON.stringify(v || {})); }

  function readLocalMonth(y,m){
    try {
      if (!activeUserId) return null;
      const raw = localStorage.getItem(localMonthKey(y,m));
      return raw ? JSON.parse(raw) : null;
    } catch(e){
      console.warn('Local month read failed', e);
      return null;
    }
  }

  function writeLocalMonth(y,m,d){
    try {
      if (!activeUserId) return;
      localStorage.setItem(localMonthKey(y,m), JSON.stringify(d || {}));
    } catch(e){
      console.warn('Local month save failed', e);
    }
  }

  async function setActiveUser(userId){
    activeUserId = userId;
    cache = {};
    if (!userId) return;
    try {
      const { data, error } = await WQSupabase
        .from('wealth_month_data')
        .select('year, month, data')
        .eq('user_id', userId);
      if (error) throw error;
      (data || []).forEach(row => {
        cache[storageKey(row.year,row.month)] = row.data || {};
        writeLocalMonth(row.year,row.month,row.data || {});
      });
    } catch(error) {
      console.warn('Supabase month data load failed; using local fallback only.', error);
    }
  }

  function getMonthData(y,m, defaultFactory){
    const key = storageKey(y,m);
    if (cache[key]) return clone(cache[key]);
    const local = readLocalMonth(y,m);
    if (local) {
      cache[key] = clone(local);
      return clone(local);
    }
    return defaultFactory ? defaultFactory() : {};
  }

  async function saveMonthData(y,m,d){
    if (!activeUserId) return;
    const key = storageKey(y,m);
    const data = clone(d);

    // Synchronous local fallback first, so data survives logout/navigation even if network save is slow.
    cache[key] = data;
    writeLocalMonth(y,m,data);

    const payload = { user_id: activeUserId, year: y, month: m, data, storage_path: scopedKey(y,m), updated_at: new Date().toISOString() };
    try {
      const { error } = await WQSupabase.from('wealth_month_data').upsert(payload, { onConflict: 'user_id,year,month' });
      if (error) throw error;
    } catch(error) {
      console.error('Supabase save failed; data kept in user-scoped local fallback.', error);
    }

    try {
      await WQSupabase.storage
        .from(window.WQ_CONFIG.STORAGE_BUCKET)
        .upload(scopedKey(y,m), new Blob([JSON.stringify(data,null,2)], { type:'application/json' }), { upsert:true });
    } catch(error) {
      console.warn('Supabase storage copy failed; database/local fallback remains source of truth.', error);
    }
  }

  async function removeMonthData(y,m){
    if (!activeUserId) return;
    delete cache[storageKey(y,m)];
    try { localStorage.removeItem(localMonthKey(y,m)); } catch(e){}
    await WQSupabase.from('wealth_month_data').delete().eq('user_id', activeUserId).eq('year', y).eq('month', m);
    await WQSupabase.storage.from(window.WQ_CONFIG.STORAGE_BUCKET).remove([scopedKey(y,m)]);
  }

  function exportCache(){ return Object.fromEntries(Object.entries(cache).map(([k,v]) => [k, v])); }

  function getActiveUserId(){ return activeUserId; }

  function getScopedLocalKey(key, userId){
    const uid = userId || activeUserId || window.WQAuth?.getUserId?.() || 'anonymous';
    return `wq:${uid}:${key}`;
  }

  function injectScopedStorageIntoHtml(html, moduleId){
    const uid = activeUserId || window.WQAuth?.getUserId?.() || 'anonymous';
    const scope = `wq:${uid}:planning-suite:${moduleId || 'module'}:`;
    const shim = `<script>
(function(){
  var __wqScope = ${JSON.stringify(scope)};
  function scopedKey(key){ key = String(key || ''); return key.indexOf(__wqScope) === 0 ? key : __wqScope + key; }
  var setItem = Storage.prototype.setItem;
  var getItem = Storage.prototype.getItem;
  var removeItem = Storage.prototype.removeItem;
  Storage.prototype.setItem = function(key, value){ return setItem.call(this, scopedKey(key), value); };
  Storage.prototype.getItem = function(key){ return getItem.call(this, scopedKey(key)); };
  Storage.prototype.removeItem = function(key){ return removeItem.call(this, scopedKey(key)); };
})();
<\/script>`;
    if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, m => m + shim);
    return shim + html;
  }

  async function importCache(data){
    let count = 0;
    for (const [k,v] of Object.entries(data)) {
      const match = /^pft_(\d{4})_(\d{1,2})$/.exec(k);
      if (!match) continue;
      await saveMonthData(Number(match[1]), Number(match[2]), v);
      count++;
    }
    return count;
  }

  return { setActiveUser, getActiveUserId, getScopedLocalKey, injectScopedStorageIntoHtml, storageKey, getMonthData, saveMonthData, removeMonthData, exportCache, importCache };
})();
