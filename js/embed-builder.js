/* ============================================================
   임베드 코드 만들기 (embed.html)
   ============================================================ */
(function () {
  const U = window.U;
  const TABS = [
    { key: 'map',      label: '세계 지도',        h: 780 },
    { key: 'timeline', label: '확산 연표',        h: 900 },
    { key: 'table',    label: '항목 비교표',      h: 760 },
    { key: 'age',      label: '연령별 분포',      h: 860 },
    { key: 'efficacy', label: '실효성',           h: 900 },
    { key: 'korea',    label: '대한민국 추진 현황', h: 1400 }
  ];

  const el = id => document.getElementById(id);
  const state = { view: 'all', tab: 'map', tabs: ['map', 'korea'], country: 'AUS',
                  theme: '', autoH: true, fixedH: 720, credit: true, base: '', width: 0 };

  /* 기본 배포 주소 = 지금 페이지가 있는 폴더 */
  const defaultBase = location.origin + location.pathname.replace(/[^/]*$/, '');

  /* ── 입력 구성 ── */
  function fillTabs() {
    const sel = el('tabSel');
    TABS.forEach(t => sel.appendChild(U.h('option', { value: t.key }, t.label)));
    sel.value = state.tab;

    const box = el('tabsChecks');
    TABS.forEach(t => {
      box.appendChild(U.h('label', { class: 'check' }, [
        U.h('input', { type: 'checkbox', value: t.key, checked: state.tabs.includes(t.key) }),
        U.h('span', {}, t.label)
      ]));
    });
    box.addEventListener('change', () => {
      state.tabs = Array.from(box.querySelectorAll('input:checked')).map(i => i.value);
      if (!state.tabs.length) state.tabs = ['map'];
      Array.from(box.querySelectorAll('input')).forEach(i => { i.checked = state.tabs.includes(i.value); });
      update();
    });
  }

  function fillCountries(data) {
    const sel = el('countrySel');
    const order = Object.fromEntries(window.STATUS.map((s, i) => [s.key, i]));
    data.countries.slice()
      .sort((a, b) => (order[a.status] - order[b.status]) || a.name.localeCompare(b.name, 'ko'))
      .forEach(c => sel.appendChild(U.h('option', { value: c.iso3 },
        `${c.name} — ${U.statusLabel(c.status)}`)));
    sel.value = state.country;
  }

  function fillWidthChips() {
    const box = el('widthChips');
    [['데스크톱', 0], ['태블릿', 768], ['모바일', 375]].forEach(([label, w]) => {
      box.appendChild(U.h('button', {
        class: 'chip' + (state.width === w ? ' is-on' : ''), type: 'button',
        onclick: () => {
          state.width = w;
          Array.from(box.children).forEach((c, i) =>
            c.classList.toggle('is-on', [0, 768, 375][i] === w));
          el('device').style.maxWidth = w ? w + 'px' : 'none';
        }
      }, label));
    });
  }

  /* ── 주소·코드 생성 ── */
  function base() { return (state.base || defaultBase).replace(/\/?$/, '/'); }

  function params() {
    const p = new URLSearchParams();
    p.set('embed', '1');
    if (state.view === 'tab') p.set('tab', state.tab);
    if (state.view === 'some') p.set('tabs', state.tabs.join(','));
    if (state.view === 'country') p.set('country', state.country);
    if (state.theme) p.set('theme', state.theme);
    if (!state.credit) p.set('credit', '0');
    return p.toString();
  }

  function src() { return base() + 'index.html?' + params(); }

  function suggestedHeight() {
    if (state.view === 'country') return 720;
    if (state.view === 'tab') return (TABS.find(t => t.key === state.tab) || {}).h || 780;
    if (state.view === 'some') return Math.max.apply(null,
      state.tabs.map(k => (TABS.find(t => t.key === k) || {}).h || 780));
    return 820;
  }

  function title() {
    if (state.view === 'country') {
      const o = el('countrySel').selectedOptions[0];
      return (o ? o.textContent.split(' — ')[0] : '') + ' SNS 규제 현황 — 토끼풀';
    }
    if (state.view === 'tab') {
      return (TABS.find(t => t.key === state.tab) || {}).label + ' — SNS 금지법 전 세계 추진 현황';
    }
    return 'SNS 금지법 전 세계 추진 현황 — 토끼풀';
  }

  function snippet() {
    const h = state.autoH ? suggestedHeight() : state.fixedH;
    const attrs = [
      'src="' + src() + '"',
      'title="' + title() + '"',
      'height="' + h + '"',
      'loading="lazy" scrolling="no"',
      'style="width:100%;border:0;display:block"'
    ];
    if (state.autoH) attrs.push('data-tokipul-embed');
    let out = '<iframe\n  ' + attrs.join('\n  ') + '></iframe>';
    if (state.autoH) {
      out += '\n<script src="' + base() + 'embed-resizer.js" async><' + '/script>';
    }
    return out;
  }

  /* ── 갱신 ── */
  function update() {
    el('tabRow').hidden     = state.view !== 'tab';
    el('tabsRow').hidden    = state.view !== 'some';
    el('countryRow').hidden = state.view !== 'country';
    el('fixedHRow').hidden  = state.autoH;
    el('autoHint').textContent = state.autoH
      ? '자동 조절 스크립트를 한 번만 넣으면 페이지 안의 모든 임베드에 적용됩니다.'
      : '스크립트 없이 고정 높이로 표시합니다. 내용이 잘리지 않도록 넉넉하게 잡으세요.';

    el('snippet').value = snippet();
    el('urlBar').textContent = src();

    const f = el('preview');
    if (f.getAttribute('src') !== src()) f.setAttribute('src', src());
    if (!state.autoH) { f.setAttribute('height', state.fixedH); f.style.height = state.fixedH + 'px'; }
  }

  /* ── 이벤트 ── */
  function bind() {
    el('viewRadios').addEventListener('change', e => {
      if (e.target.name !== 'view') return;
      state.view = e.target.value; update();
    });
    el('tabSel').addEventListener('change', e => { state.tab = e.target.value; update(); });
    el('countrySel').addEventListener('change', e => { state.country = e.target.value; update(); });
    el('themeSel').addEventListener('change', e => { state.theme = e.target.value; update(); });
    el('autoH').addEventListener('change', e => { state.autoH = e.target.checked; update(); });
    el('fixedH').addEventListener('input', e => { state.fixedH = Math.max(240, +e.target.value || 720); update(); });
    el('creditChk').addEventListener('change', e => { state.credit = e.target.checked; update(); });
    el('baseUrl').addEventListener('input', U.debounce(e => { state.base = e.target.value.trim(); update(); }, 250));
    el('baseUrl').placeholder = defaultBase;

    el('copyBtn').addEventListener('click', async () => {
      const ta = el('snippet');
      try { await navigator.clipboard.writeText(ta.value); }
      catch (err) { ta.removeAttribute('readonly'); ta.select(); document.execCommand('copy'); ta.setAttribute('readonly', ''); }
      const msg = el('copiedMsg');
      msg.classList.add('show'); setTimeout(() => msg.classList.remove('show'), 1600);
    });
    el('openBtn').addEventListener('click', () => window.open(src(), '_blank', 'noopener'));
  }

  /* ── 시작 ── */
  (function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('snsban:theme'); } catch (e) {}
    document.documentElement.setAttribute('data-theme', saved || 'auto');
  })();

  /* 대시보드에서 "임베드하기"로 들어오면 보고 있던 탭을 미리 골라 둡니다. */
  (function fromParam() {
    const from = new URLSearchParams(location.search).get('from');
    if (!from || !TABS.some(t => t.key === from)) return;
    state.view = 'tab';
    state.tab = from;
    const r = document.querySelector('input[name="view"][value="tab"]');
    if (r) r.checked = true;
  })();

  fillTabs();
  fillWidthChips();
  bind();
  update();

  window.DATA.load().then(data => { fillCountries(data); update(); });
})();
