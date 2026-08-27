/* ============================================================
   앱 부트스트랩 — 탭 전환, 테마, 데이터 주입
   ============================================================ */
(function () {
  const U = window.U;
  const TABS = {
    map:      window.TAB_MAP,
    timeline: window.TAB_TIMELINE,
    table:    window.TAB_TABLE,
    age:      window.TAB_AGE,
    efficacy: window.TAB_EFFICACY,
    korea:    window.TAB_KOREA
  };
  const rendered = new Set();
  let state = null, active = 'map';

  /* ── 테마 ── */
  function currentTheme() {
    const set = document.documentElement.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('snsban:theme', t); } catch (e) {}
    U.flushColorCache();
    rendered.clear();
    renderActive();
    if (window.EMBED && window.EMBED.on) window.EMBED.postHeight();
  }
  (function initTheme() {
    if (!document.documentElement.getAttribute('data-theme')) {
      document.documentElement.setAttribute('data-theme', 'auto');
    }
    U.$('#themeToggle').addEventListener('click', () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark'));
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const set = document.documentElement.getAttribute('data-theme');
      if (set !== 'light' && set !== 'dark') { U.flushColorCache(); rendered.clear(); renderActive(); }
    });
  })();

  /* ── 탭 ── */
  function activate(key) {
    active = key;
    U.$$('.tab').forEach(b => {
      const on = b.dataset.tab === key;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    U.$$('.panel').forEach(p => {
      const on = p.id === 'panel-' + key;
      p.classList.toggle('is-active', on);
      p.hidden = !on;
    });
    // 임베드에서는 iframe 주소를 그대로 유지합니다.
    if (!(window.EMBED && window.EMBED.on) && location.hash.slice(1) !== key) {
      history.replaceState(null, '', '#' + key);
    }
    // 임베드 생성기가 지금 보고 있는 탭을 미리 골라 두도록 전달
    const link = U.$('#embedLink');
    if (link) link.href = 'embed.html?from=' + key;
    updateShare(key);
    renderActive();
  }
  function renderActive() {
    if (!state) return;
    const t = TABS[active];
    if (!t) return;
    if (!rendered.has(active)) { t.render(state); rendered.add(active); }
    else if (t.resize) t.resize();
    // 임베드에서는 탭마다 내용 높이가 크게 달라지므로 부모에 다시 알립니다.
    if (window.EMBED && window.EMBED.on) {
      window.EMBED.postHeight();
      [60, 260, 700].forEach(ms => setTimeout(window.EMBED.postHeight, ms));
    }
  }
  U.$$('.tab').forEach(b => b.addEventListener('click', () => activate(b.dataset.tab)));
  U.$$('.tab').forEach((b, i, all) => b.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = all[(i + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length];
    n.focus(); activate(n.dataset.tab);
  }));

  /* ── 창 크기 ── */
  window.addEventListener('resize', U.debounce(() => {
    syncHeaderHeight();
    const t = TABS[active];
    if (state && t && t.resize && rendered.has(active)) t.resize();
  }, 200));

  /* ── 푸터 공유 버튼 ── */
  const TAB_LABEL = {
    map: '세계 지도', timeline: '확산 연표', table: '항목 비교표',
    age: '연령별 분포', efficacy: '실효성', korea: '대한민국 추진 현황'
  };
  function updateShare(key) {
    if (!window.SHARE || (window.EMBED && window.EMBED.on)) return;
    const base = (state && state.meta && state.meta.title) || 'SNS 금지법 전 세계 추진 현황';
    const opts = {
      tab: key, title: base,
      text: `${base}${TAB_LABEL[key] ? ` — ${TAB_LABEL[key]}` : ''} · 토끼풀`
    };
    // 넓은 화면은 묶음 버튼, 좁은 화면은 공유 버튼 하나 — 둘 다 헤더에 있습니다.
    // 둘 다 그려 두고 화면 크기에 따라 CSS 로 하나만 보여 줍니다.
    if (U.$('#headerShare')) window.SHARE.build(U.$('#headerShare'), opts);
    if (U.$('#headerShareOne')) window.SHARE.buildSingle(U.$('#headerShareOne'), opts);
  }

  /* ── 푸터 '출처 보기' ── */
  function setupSources() {
    const btn = U.$('#sourcesBtn');
    if (!btn) return;
    btn.addEventListener('click', () => window.SOURCES.open(state));
  }

  /* ── 헤더 높이를 탭 sticky 오프셋에 반영 ── */
  function syncHeaderHeight() {
    const h = U.$('.site-header');
    if (!h) return;
    document.documentElement.style.setProperty('--header-h', Math.round(h.offsetHeight) + 'px');
  }

  /* ── 토끼풀 홈 버튼 ── */
  function setupHomeLink() {
    const link = U.$('#homeLink');
    if (!link) return;
    const url = window.APP_CONFIG.homeUrl;
    if (!url) { link.remove(); return; }
    link.href = url;
  }

  /* ── 공유 링크(?country=XXX)로 들어오면 해당 국가 팝업을 엽니다 ── */
  function openSharedCountry() {
    if (window.EMBED && window.EMBED.on) return;
    const iso = (new URLSearchParams(location.search).get('country') || '').toUpperCase().trim();
    if (!iso) return;
    const c = state.countries.find(x => x.iso3 === iso);
    if (c) window.MODAL.open(c, state);
  }

  /* ── 헤더 표시 갱신 ── */
  function applyMeta(data) {
    if (data.source === 'sample-fallback') {
      console.warn('구글 시트를 불러오지 못해 예시 데이터로 표시합니다:', data.loadError);
    }
    if (data.meta && data.meta.aiNote && U.$('#aiNote')) U.$('#aiNote').innerHTML = data.meta.aiNote;
    U.$('#footerUpdated').textContent = data.meta && data.meta.updated
      ? `최종 갱신 ${U.fmtDate(data.meta.updated)}` : '';
    if (data.meta && data.meta.title) document.title = data.meta.title + ' · 토끼풀';
  }

  /* ── 시작 ── */
  window.DATA.load().then(data => {
    state = data;
    applyMeta(data);

    setupHomeLink();
    setupSources();
    syncHeaderHeight();

    const E = window.EMBED;
    if (E && E.on) {
      E.apply(data);
      if (E.country) return;             // 단일 국가 카드 — 탭 없음
    }
    const allowed = (E && E.on) ? E.visibleTabs() : Object.keys(TABS);
    const fromHash = location.hash.slice(1);
    activate(allowed.includes(fromHash) ? fromHash : allowed[0]);
    openSharedCountry();
  }).catch(err => {
    console.error(err);
    U.$('#main').innerHTML =
      '<div class="card"><div class="empty">데이터를 불러오지 못했습니다.<br>' +
      U.esc(err.message || String(err)) + '</div></div>';
  });

  window.addEventListener('hashchange', () => {
    const k = location.hash.slice(1);
    if (TABS[k] && k !== active) activate(k);
  });
})();
