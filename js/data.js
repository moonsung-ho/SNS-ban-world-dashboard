/* ============================================================
   데이터 로더
   ------------------------------------------------------------
   dataSource 가 'sheets' 이면 구글 시트(gviz JSON 또는 게시된 CSV)에서
   읽어와 예시 데이터와 동일한 구조로 정규화합니다.
   ============================================================ */
window.DATA = (function () {
  const CFG = window.APP_CONFIG;

  /* ── 시트 응답 파서 ─────────────────────────────────────── */

  // gviz JSON 응답 → [{열이름: 값}]
  function parseGviz(text) {
    const s = text.indexOf('{');
    const e = text.lastIndexOf('}');
    if (s < 0 || e < 0) throw new Error('시트 응답 형식이 올바르지 않습니다.');
    const json = JSON.parse(text.slice(s, e + 1));
    if (json.status === 'error') {
      throw new Error((json.errors || []).map(x => x.detailed_message || x.message).join(' / ') || '시트 조회 오류');
    }
    const table = json.table || {};
    const cols = (table.cols || []).map((c, i) => headerKey(c.label || c.id || ('col' + i)));
    // 라벨이 비어 있으면 첫 행을 머리글로 사용
    let rows = table.rows || [];
    if (cols.every(c => /^col\d+$|^[a-z]$/.test(c)) && rows.length) {
      const first = rows[0].c || [];
      first.forEach((cell, i) => { cols[i] = headerKey(cell && cell.v); });
      rows = rows.slice(1);
    }
    return rows.map(r => {
      const o = {};
      (r.c || []).forEach((cell, i) => {
        if (!cols[i]) return;
        let v = cell ? (cell.f !== undefined && cell.f !== null ? cell.f : cell.v) : '';
        if (v instanceof Date) v = v.toISOString().slice(0, 10);
        o[cols[i]] = v === null || v === undefined ? '' : String(v).trim();
      });
      return o;
    }).filter(o => Object.values(o).some(v => v !== ''));
  }

  // CSV → [{열이름: 값}]
  function parseCSV(text) {
    const rows = [];
    let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (c !== '\r') cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    if (!rows.length) return [];
    const cols = rows[0].map(headerKey);
    return rows.slice(1).map(r => {
      const o = {};
      cols.forEach((k, i) => { if (k) o[k] = (r[i] || '').trim(); });
      return o;
    }).filter(o => Object.values(o).some(v => v !== ''));
  }

  // 사람이 읽는 열 제목 → 코드에서 쓰는 키
  const HEADER_ALIAS = {
    '국가코드':'iso3', 'iso':'iso3', 'iso3':'iso3', 'code':'iso3',
    '국가명':'name', '국가':'name', 'name':'name',
    '영문명':'name_en', 'name_en':'name_en',
    '대륙':'continent', 'continent':'continent',
    '추진상황':'status', '상태':'status', 'status':'status',
    '추진상황설명':'status_note', 'status_note':'status_note',
    '요약':'summary', 'summary':'summary',
    '연령기준':'age', 'age':'age',
    '구체적규제':'age_rule', '규제내용':'age_rule', 'age_rule':'age_rule',
    '대상서비스':'scope', 'scope':'scope',
    '대상서비스설명':'scope_note', 'scope_note':'scope_note',
    '책임주체':'responsibility', 'responsibility':'responsibility',
    '집행수단':'enforcement', 'enforcement':'enforcement',
    '이용률':'usage_rate', 'usage_rate':'usage_rate',
    '이용률대상':'usage_group', 'usage_group':'usage_group',
    '이용률설명':'usage_note', 'usage_note':'usage_note',
    '시행일':'effective_date', 'effective_date':'effective_date',
    '최종확인':'updated', '최종확인일자':'updated', 'updated':'updated',
    '경도':'lon', 'lon':'lon', 'longitude':'lon',
    '위도':'lat', 'lat':'lat', 'latitude':'lat',
    '출처':'sources', 'sources':'sources'
  };
  function headerKey(raw) {
    const s = String(raw === null || raw === undefined ? '' : raw).trim();
    if (!s) return '';
    const compact = s.toLowerCase().replace(/\s+/g, '').replace(/[()·・]/g, '');
    return HEADER_ALIAS[compact] || compact.replace(/[^a-z0-9가-힣_]/g, '_');
  }

  /* ── 네트워크 ───────────────────────────────────────────── */
  function sheetUrl(sheetName) {
    if (CFG.csvUrls && CFG.csvUrls[sheetName]) return { url: CFG.csvUrls[sheetName], kind: 'csv' };
    const id = encodeURIComponent(CFG.sheetId);
    return {
      url: `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(sheetName)}`,
      kind: 'gviz'
    };
  }

  function cacheGet(key) {
    if (!CFG.cacheMinutes) return null;
    try {
      const raw = localStorage.getItem('snsban:' + key);
      if (!raw) return null;
      const o = JSON.parse(raw);
      if (Date.now() - o.t > CFG.cacheMinutes * 60000) return null;
      return o.v;
    } catch (e) { return null; }
  }
  function cacheSet(key, v) {
    if (!CFG.cacheMinutes) return;
    try { localStorage.setItem('snsban:' + key, JSON.stringify({ t: Date.now(), v })); } catch (e) {}
  }

  async function fetchSheet(sheetName) {
    const cached = cacheGet(sheetName);
    if (cached) return cached;
    const { url, kind } = sheetUrl(sheetName);
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) throw new Error(`시트 "${sheetName}" 을(를) 불러오지 못했습니다 (HTTP ${res.status}).`);
    const text = await res.text();
    const rows = kind === 'csv' ? parseCSV(text) : parseGviz(text);
    cacheSet(sheetName, rows);
    return rows;
  }

  /* ── 정규화 ─────────────────────────────────────────────── */
  const splitList = s => String(s || '').split(/[;\n|]/).map(x => x.trim()).filter(Boolean);

  function parseSources(s) {
    if (!s) return [];
    return String(s).split(/\n|;;/).map(x => x.trim()).filter(Boolean).map(line => {
      const parts = line.split('|').map(p => p.trim());
      const url = parts.find(p => /^https?:\/\//i.test(p)) || '';
      const rest = parts.filter(p => p !== url);
      return { title: rest[0] || url || '출처', publisher: rest[1] || '', url };
    });
  }

  function normCountries(rows) {
    return rows.map(r => ({
      iso3: String(r.iso3 || '').toUpperCase().trim(),
      name: r.name || r.iso3 || '',
      nameEn: r.name_en || '',
      continent: r.continent || '기타',
      status: normStatus(r.status),
      statusNote: r.status_note || '',
      summary: r.summary || '',
      age: window.U.num(r.age),
      ageRule: r.age_rule || '',
      scope: splitList(r.scope),
      scopeNote: r.scope_note || '',
      responsibility: r.responsibility || '',
      enforcement: r.enforcement || '',
      usageRate: window.U.num(r.usage_rate),
      usageGroup: r.usage_group || '',
      usageNote: r.usage_note || '',
      effectiveDate: r.effective_date || '',
      updated: r.updated || '',
      lon: window.U.num(r.lon ?? r['경도']),
      lat: window.U.num(r.lat ?? r['위도']),
      sources: parseSources(r.sources)
    })).filter(c => c.iso3);
  }

  const STATUS_ALIAS = {
    '시행':'enforced', '시행중':'enforced', 'enforced':'enforced', 'in_force':'enforced',
    '통과':'passed', '법통과':'passed', '시행대기':'passed', 'passed':'passed',
    '추진':'bill', '입법추진':'bill', '발의':'bill', 'bill':'bill', 'proposed':'bill',
    '논의':'debate', '검토':'debate', 'debate':'debate',
    '없음':'none', '규제없음':'none', 'none':'none'
  };
  function normStatus(v) {
    const k = String(v || '').toLowerCase().replace(/[\s·中\-]/g, '');
    return STATUS_ALIAS[k] || (window.STATUS.some(s => s.key === v) ? v : 'none');
  }

  const KIND_ALIAS = { '시행':'enforce', 'enforce':'enforce', '통과':'pass', 'pass':'pass',
                       '발의':'bill', 'bill':'bill', '논의':'debate', 'debate':'debate',
                       '제동':'block', 'block':'block' };

  function normTimeline(rows) {
    return rows.map(r => ({
      date: r.date || r['날짜'] || '',
      iso3: String(r.iso3 || '').toUpperCase().trim(),
      country: r.country || r['국가'] || '',
      kind: KIND_ALIAS[String(r.kind || r['유형'] || '').trim()] || 'debate',
      title: r.title || r['제목'] || '',
      desc: r.desc || r['설명'] || ''
    })).filter(e => e.date).sort((a, b) => a.date.localeCompare(b.date));
  }

  function normBypass(rows) {
    const out = {};
    rows.forEach(r => {
      const iso = String(r.iso3 || '').toUpperCase().trim();
      const v = window.U.num(r.value ?? r['비율']);
      if (!iso || v === null) return;
      if (!out[iso]) out[iso] = { metric: r.metric || r['지표'] || '우회 이용 비율', note: r.note || r['비고'] || '', series: [] };
      if (r.metric && !out[iso].metric) out[iso].metric = r.metric;
      if (r.note && !out[iso].note) out[iso].note = r.note;
      out[iso].series.push({ label: String(r.label || r['시점'] || ''), value: v });
    });
    Object.values(out).forEach(o => o.series.sort((a, b) => String(a.label).localeCompare(String(b.label))));
    return out;
  }

  function normDumbbell(rows) {
    return rows.map(r => ({
      iso3: String(r.iso3 || '').toUpperCase().trim(),
      name: r.name || r['국가'] || r.iso3,
      group: r.group || r['대상'] || '',
      before: window.U.num(r.before ?? r['시행전']),
      after: window.U.num(r.after ?? r['시행후'])
    })).filter(d => d.before !== null && d.after !== null);
  }

  const pickText = (r, keys) => { for (const k of keys) if (r[k]) return r[k]; return ''; };

  function normCards(rows) {
    return rows.map(r => ({
      title: pickText(r, ['title', '제목']),
      big:   pickText(r, ['big', '수치']),
      unit:  pickText(r, ['unit', '단위']),
      body:  pickText(r, ['body', '내용']),
      meta:  pickText(r, ['meta', '비고'])
    })).filter(c => c.title || c.body);
  }

  function normKorea(bills, usage, polls, stats, meta) {
    return {
      stats: stats.map(r => ({
        label: pickText(r, ['label', '항목']),
        value: pickText(r, ['value', '값']),
        unit:  pickText(r, ['unit', '단위']),
        color: r.color || '--accent'
      })).filter(s => s.label),
      steps: splitList(meta.korea_steps) .length ? splitList(meta.korea_steps)
             : ['발의', '소위 심사', '상임위 의결', '법사위', '본회의', '공포'],
      bills: bills.map(r => ({
        name: pickText(r, ['name', '법안명']),
        proposer: pickText(r, ['proposer', '대표발의']),
        party: pickText(r, ['party', '정당']),
        date: pickText(r, ['date', '발의일']),
        age: pickText(r, ['age', '연령기준']),
        step: window.U.num(r.step ?? r['단계']) || 1,
        summary: pickText(r, ['summary', '요지']),
        url: r.url || ''
      })).filter(b => b.name),
      usage: usage.map(r => ({
        group: pickText(r, ['group', '연령대']),
        value: window.U.num(r.value ?? r['이용률'])
      })).filter(u => u.group && u.value !== null),
      polls: polls.map(r => ({
        question: pickText(r, ['question', '문항']),
        org: pickText(r, ['org', '대상']),
        date: pickText(r, ['date', '시점']),
        pro: window.U.num(r.pro ?? r['찬성']) || 0,
        con: window.U.num(r.con ?? r['반대']) || 0,
        neu: window.U.num(r.neu ?? r['유보']) || 0
      })).filter(p => p.question)
    };
  }

  function normMeta(rows) {
    const o = {};
    rows.forEach(r => {
      const k = (r.key || r['항목'] || '').trim();
      if (k) o[headerKey(k)] = r.value || r['값'] || '';
    });
    return o;
  }

  /* ── 진입점 ─────────────────────────────────────────────── */
  async function loadFromSheets() {
    const S = CFG.sheets;
    const names = ['countries','timeline','bypass','efficacyUsage','efficacyCards',
                   'koreaStats','koreaBills','koreaUsage','koreaPolls','meta'];
    const results = await Promise.all(names.map(n => fetchSheet(S[n])));
    const r = Object.fromEntries(names.map((n, i) => [n, results[i]]));
    const meta = normMeta(r.meta);

    return {
      source: 'sheets',
      meta: {
        updated: meta.updated || '',
        title: meta.title || 'SNS 금지법 전 세계 추진 현황',
        aiNote: meta.ai_note || window.SAMPLE_DATA.meta.aiNote
      },
      countries: normCountries(r.countries),
      timeline: normTimeline(r.timeline),
      bypass: normBypass(r.bypass),
      efficacy: {
        dumbbell: normDumbbell(r.efficacyUsage),
        cards: normCards(r.efficacyCards)
      },
      korea: normKorea(r.koreaBills, r.koreaUsage, r.koreaPolls, r.koreaStats, meta)
    };
  }

  function loadSample() {
    const d = JSON.parse(JSON.stringify(window.SAMPLE_DATA));
    d.source = 'sample';
    d.korea.steps = d.korea.steps || ['발의','소위 심사','상임위 의결','법사위','본회의','공포'];
    return d;
  }

  async function load() {
    if (CFG.dataSource !== 'sheets') return loadSample();
    try {
      const d = await loadFromSheets();
      if (!d.countries.length) throw new Error('countries 시트에서 읽어온 행이 없습니다.');
      return d;
    } catch (err) {
      console.error('[구글 시트 로드 실패]', err);
      if (!CFG.fallbackToSample) throw err;
      const d = loadSample();
      d.source = 'sample-fallback';
      d.loadError = err.message || String(err);
      return d;
    }
  }

  return { load, parseCSV, parseGviz };
})();
