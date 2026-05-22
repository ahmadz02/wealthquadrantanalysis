window.WQStorage = (() => {
  let activeUserId = null;
  let cache = {};

  function storageKey(y, m, rev=0){
    return rev === 0 ? `pft_${y}_${m}` : `pft_${y}_${m}_r${rev}`;
  }
  function scopedKey(y, m, rev=0){
    return `${activeUserId}/${storageKey(y,m,rev)}.json`;
  }

  async function setActiveUser(userId){
    activeUserId = userId;
    cache = {};
    if (!userId) return;
    const { data, error } = await WQSupabase
      .from('wealth_month_data')
      .select('year, month, revision, data')
      .eq('user_id', userId);
    if (error) throw error;
    (data || []).forEach(row => {
      const rev = row.revision ?? 0;
      cache[storageKey(row.year, row.month, rev)] = row.data;
    });
  }

  function getMonthData(y, m, rev=0, defaultFactory){
    const key = storageKey(y, m, rev);
    return cache[key] ? JSON.parse(JSON.stringify(cache[key])) : (defaultFactory ? defaultFactory() : null);
  }

  async function saveMonthData(y, m, rev=0, d){
    if (!activeUserId) return;
    const key = storageKey(y, m, rev);
    cache[key] = JSON.parse(JSON.stringify(d));
    const payload = {
      user_id: activeUserId, year: y, month: m, revision: rev, data: d,
      storage_path: scopedKey(y, m, rev),
      updated_at: new Date().toISOString()
    };
    const { error } = await WQSupabase.from('wealth_month_data')
      .upsert(payload, { onConflict: 'user_id,year,month,revision' });
    if (error) console.error('Supabase save failed:', error);

    await WQSupabase.storage
      .from(window.WQ_CONFIG.STORAGE_BUCKET)
      .upload(scopedKey(y,m,rev), new Blob([JSON.stringify(d,null,2)], { type:'application/json' }), { upsert:true });
  }

  async function removeMonthData(y, m, rev=0){
    if (!activeUserId) return;
    delete cache[storageKey(y, m, rev)];
    await WQSupabase.from('wealth_month_data').delete()
      .eq('user_id', activeUserId).eq('year', y).eq('month', m).eq('revision', rev);
    await WQSupabase.storage.from(window.WQ_CONFIG.STORAGE_BUCKET).remove([scopedKey(y,m,rev)]);
  }

  function exportCache(){ return Object.fromEntries(Object.entries(cache).map(([k,v]) => [k, v])); }

  async function importCache(data){
    let count = 0;
    for (const [k,v] of Object.entries(data)) {
      const matchRev  = /^pft_(\d{4})_(\d{1,2})_r(\d)$/.exec(k);
      const matchOrig = /^pft_(\d{4})_(\d{1,2})$/.exec(k);
      if (matchRev) {
        await saveMonthData(Number(matchRev[1]), Number(matchRev[2]), Number(matchRev[3]), v);
        count++;
      } else if (matchOrig) {
        await saveMonthData(Number(matchOrig[1]), Number(matchOrig[2]), 0, v);
        count++;
      }
    }
    return count;
  }

  return { setActiveUser, storageKey, getMonthData, saveMonthData, removeMonthData, exportCache, importCache };
})();
