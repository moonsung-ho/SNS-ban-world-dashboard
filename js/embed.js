/* ============================================================
   임베드 모드
   ------------------------------------------------------------
   기사 페이지의 <iframe> 안에서 동작하도록 화면을 조정하고,
   부모 창에 높이를 알려 자동으로 크기가 맞춰지게 합니다.

   주소 파라미터
     embed=1               임베드 모드 (머리말·바닥글 제거)
     tab=map               한 개 탭만 표시 (탭 막대 숨김)
     tabs=map,korea        지정한 탭만 표시
     country=AUS           단일 국가 카드만 표시 (embed=1 과 함께 써야 함.
                           country 만 있으면 일반 대시보드에서 해당 국가 팝업이 열립니다)
     theme=light|dark      테마 고정 (기본은 방문자 설정 따름)
     credit=0              하단 출처 막대 숨김
   ============================================================ */
window.EMBED = (function () {
  const P = new URLSearchParams(location.search);
  const TAB_KEYS = ['map', 'timeline', 'table', 'age', 'efficacy', 'korea'];

  const list = v => String(v || '').split(',').map(s => s.trim()).filter(Boolean);
  const inIframe = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

  const cfg = {
    on:      P.get('embed') === '1' || P.has('tab') || P.has('tabs'),
    tab:     TAB_KEYS.includes(P.get('tab')) ? P.get('tab') : null,
    tabs:    list(P.get('tabs')).filter(t => TAB_KEYS.includes(t)),
    country: (P.get('country') || '').toUpperCase().trim() || null,
    theme:   ['light', 'dark'].includes(P.get('theme')) ? P.get('theme') : null,
    credit:  P.get('credit') !== '0',
    inIframe: inIframe
  };

  /* 화면 깜빡임을 막기 위해 첫 페인트 전에 속성을 붙입니다. */
  if (cfg.on) {
    document.documentElement.setAttribute('data-embed', '');
    if (cfg.country) document.documentElement.setAttribute('data-embed-view', 'country');
  }
  if (cfg.theme) document.documentElement.setAttribute('data-theme', cfg.theme);

  /* ── 표시할 탭 결정 ── */
  function visibleTabs() {
    if (cfg.country) return [];
    if (cfg.tab) return [cfg.tab];
    if (cfg.tabs.length) return cfg.tabs;
    return TAB_KEYS;
  }

  /* ── 부모 창에 높이 알리기 ── */
  let lastH = 0, raf = 0;

  /* documentElement.scrollHeight 는 iframe 뷰포트 높이 아래로 내려가지 않아
     탭을 바꿔 내용이 짧아져도 줄어들지 않습니다.
     그래서 실제 내용의 가장 아래 지점을 직접 잽니다. */
  function contentHeight() {
    const body = document.body;
    if (!body) return 0;
    let bottom = 0;
    for (let i = 0; i < body.children.length; i++) {
      const n = body.children[i];
      if (n.hidden || n.tagName === 'SCRIPT' || n.tagName === 'LINK' || n.tagName === 'STYLE') continue;
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.position === 'fixed') continue;
      const r = n.getBoundingClientRect();
      if (r.height === 0) continue;
      bottom = Math.max(bottom, r.bottom + window.scrollY + parseFloat(cs.marginBottom || 0));
    }
    const pad = parseFloat(getComputedStyle(body).paddingBottom || 0);
    return Math.ceil(bottom + pad);
  }

  function postHeight(force) {
    if (!cfg.inIframe) return;
    const h = contentHeight();
    if (h < 40) return;
    if (!force && Math.abs(h - lastH) < 2) return;
    lastH = h;
    try {
      parent.postMessage({ tokipul: 'height', height: h, path: location.pathname + location.search }, '*');
    } catch (e) {}
  }
  function scheduleHeight() {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; postHeight(false); });
  }

  function watchHeight() {
    if (!cfg.inIframe) return;
    postHeight(true);
    window.addEventListener('load', () => postHeight(true));
    window.addEventListener('resize', scheduleHeight);
    if (window.ResizeObserver) new ResizeObserver(scheduleHeight).observe(document.documentElement);
    new MutationObserver(scheduleHeight).observe(document.documentElement,
      { childList: true, subtree: true, attributes: true });
    // 애니메이션·차트 렌더 뒤를 대비한 보정
    [120, 400, 1200, 2500].forEach(ms => setTimeout(() => postHeight(true), ms));
  }

  /* ── 부모가 알려주는 "지금 보이는 영역" ──
     기사 페이지가 길면 iframe 전체가 화면에 다 보이지 않습니다.
     부모 스크립트가 보이는 구간을 알려주면 팝업을 그 안에 띄웁니다. */
  let viewport = null;
  /* 부모에게 "지금 보이는 구간을 알려 달라"고 요청합니다.
     스크롤 이벤트를 놓치는 환경에서도 팝업이 제자리에 열리도록 하는 안전장치입니다. */
  function requestViewport() {
    if (!cfg.inIframe) return;
    try { parent.postMessage({ tokipul: 'ready' }, '*'); } catch (e) {}
  }
  function placeOverlay() {
    const b = document.getElementById('modalBackdrop');
    if (!b) return;
    if (!viewport) { b.style.top = ''; b.style.height = ''; b.style.bottom = ''; return; }
    b.style.top = Math.max(0, viewport.top) + 'px';
    b.style.height = Math.max(240, viewport.height) + 'px';
    b.style.bottom = 'auto';
  }
  function listenViewport() {
    if (!cfg.inIframe) return;
    window.addEventListener('message', e => {
      if (e.source !== parent) return;
      const d = e.data;
      if (!d || d.tokipul !== 'viewport') return;
      viewport = { top: +d.top || 0, height: +d.height || 0 };
      if (!document.getElementById('modalBackdrop').hidden) placeOverlay();
    });
    requestViewport();
  }

  /* ── 하단 출처 막대 ── */
  function creditBar(data) {
    const U = window.U;
    const full = location.origin + location.pathname.replace(/[^/]*$/, 'index.html');
    const bar = U.h('div', { class: 'embed-credit' }, [
      U.h('div', { class: 'embed-credit-main' }, [
        U.h('a', { class: 'embed-credit-brand', href: full, target: '_blank', rel: 'noopener' },
          'SNS 금지법 전 세계 추진 현황 · 토끼풀'),
        U.h('a', { class: 'embed-credit-link', href: full, target: '_blank', rel: 'noopener' },
          '전체 대시보드 보기 ↗')
      ]),
      data && data.meta && data.meta.updated
        ? U.h('div', { class: 'embed-credit-note' }, `최종 갱신 ${U.fmtDate(data.meta.updated)}`)
        : null,
      data && data.meta && data.meta.aiNote
        ? U.h('div', { class: 'embed-credit-note embed-credit-ai', html: data.meta.aiNote })
        : null
    ]);
    return bar;
  }

  /* ── 단일 국가 카드 ── */
  function renderCountryCard(data) {
    const U = window.U;
    const main = U.clear(U.$('#main'));
    const c = data.countries.find(x => x.iso3 === cfg.country);
    if (!c) {
      main.appendChild(U.h('div', { class: 'card' },
        U.h('div', { class: 'empty' }, `'${cfg.country}' 국가를 찾을 수 없습니다.`)));
      return;
    }
    const card = U.h('div', { class: 'card embed-country' });
    const body = U.h('div', { class: 'modal-body' });
    card.appendChild(body);
    main.appendChild(card);
    const spark = window.MODAL.build(body, c, data);
    if (spark) spark();
    document.title = `${c.name} — SNS 규제 현황 · 토끼풀`;
  }

  /* ── 앱에서 호출하는 진입점 ── */
  function apply(data) {
    if (!cfg.on) return;
    const U = window.U;

    // 탭 막대 정리
    const show = visibleTabs();
    U.$$('.tab').forEach(b => { if (!show.includes(b.dataset.tab)) b.remove(); });
    if (show.length <= 1) U.$('.tabs').hidden = true;

    if (cfg.country) {
      U.$('.tabs').hidden = true;
      renderCountryCard(data);
    }

    if (cfg.credit) {
      const bar = creditBar(data);
      (U.$('#main') || document.body).appendChild(bar);
    }
    watchHeight();
    listenViewport();
  }

  return Object.assign(cfg, { apply, visibleTabs, placeOverlay, requestViewport,
                              postHeight: () => postHeight(true), TAB_KEYS });
})();
