/* ============================================================
   탭 1 — 세계 지도
   ============================================================ */
window.TAB_MAP = (function () {
  const U = window.U;
  let state = null, features = null, byIso = null;
  let svg, gRoot, gLand, gDots, gLabels, zoom, pathGen, projection, dotR = 4.5;

  /* 확산 재생 */
  const HOME = () => (window.APP_CONFIG.homeIso || '').toUpperCase();
  let months = [], eventsByIso = null, frameIdx = -1, playTimer = null;
  const off = new Set();          // 범례에서 꺼둔 상태값
  let query = '';

  /* 자료가 없는 나라도 한글로 보여 주기 위한 이름표.
     브라우저 내장 Intl.DisplayNames 를 쓰고, 지원하지 않으면 영문명을 그대로 씁니다. */
  const regionNames = (function () {
    try { return new Intl.DisplayNames(['ko'], { type: 'region' }); }
    catch (e) { return null; }
  })();
  const NAME_FIX = { 'CYP-N':'북키프로스', 'SOL':'소말릴란드', 'XKX':'코소보' };
  const nameCache = new Map();

  function koName(props) {
    const c = byIso && byIso.get(props.iso3);
    if (c) return c.name;                       // 데이터에 있는 나라는 시트의 한글명 사용
    const key = props.iso3 || props.name;
    if (nameCache.has(key)) return nameCache.get(key);
    let out = NAME_FIX[props.iso3] || '';
    if (!out && regionNames && props.iso2) {
      try {
        const v = regionNames.of(props.iso2);
        if (v && v !== props.iso2) out = v;
      } catch (e) {}
    }
    if (!out) out = props.name || '—';
    nameCache.set(key, out);
    return out;
  }

  async function loadWorld() {
    if (features) return features;
    const res = await fetch(window.APP_CONFIG.worldTopoJson);
    if (!res.ok) throw new Error('지도 파일을 불러오지 못했습니다.');
    const topo = await res.json();
    const fc = topojson.feature(topo, topo.objects.countries);
    features = fc.features.filter(f => f.properties.iso3 !== 'ATA'); // 남극 제외
    return features;
  }

  /* ── 확산 재생: 연표를 시점별 상태로 되돌립니다 ── */
  const KIND_LEVEL = { debate: 1, bill: 2, pass: 3, enforce: 4 };
  const LEVEL_STATUS = { 0: 'none', 1: 'debate', 2: 'bill', 3: 'passed', 4: 'enforced' };

  function buildTimeline() {
    eventsByIso = new Map();
    (state.timeline || []).forEach(e => {
      if (!e.iso3 || !byIso.has(e.iso3)) return;
      if (!eventsByIso.has(e.iso3)) eventsByIso.set(e.iso3, []);
      eventsByIso.get(e.iso3).push(e);
    });
    eventsByIso.forEach(list => list.sort((a, b) => a.date.localeCompare(b.date)));

    const dates = (state.timeline || []).map(e => e.date).filter(Boolean).sort();
    months = [];
    if (!dates.length) return;
    const start = dates[0].slice(0, 7);
    const now = new Date();
    const end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    let [y, m] = start.split('-').map(Number);
    while (true) {
      const label = `${y}-${String(m).padStart(2, '0')}`;
      months.push(label);
      if (label >= end || months.length > 400) break;
      m += 1; if (m > 12) { m = 1; y += 1; }
    }
  }

  /* 해당 시점의 상태 — 연표에 기록이 없는 나라는 현재 상태를 그대로 씁니다. */
  function statusAtFrame(iso, idx) {
    if (idx < 0 || idx >= months.length - 1) return (byIso.get(iso) || {}).status;
    const list = eventsByIso.get(iso);
    if (!list) return (byIso.get(iso) || {}).status;   // 시점 기록 없음 → 배경으로 고정
    const cut = months[idx] + '-32';                   // 그 달 말일까지 포함
    let lv = 0;
    for (const e of list) {
      if (e.date > cut) break;
      if (e.kind === 'block') lv = Math.min(lv, KIND_LEVEL.bill);
      else lv = Math.max(lv, KIND_LEVEL[e.kind] || 0);
    }
    return LEVEL_STATUS[lv];
  }

  function applyFrame(idx) {
    frameIdx = idx;
    const last = idx >= months.length - 1;

    if (gLand) {
      gLand.selectAll('path').attr('fill', f => {
        const iso = f.properties.iso3;
        if (!byIso.has(iso)) return U.cssVar('--st-nodata');
        return U.statusColor(statusAtFrame(iso, idx));
      });
      gDots.selectAll('circle').attr('fill', d => U.statusColor(statusAtFrame(d.iso3, idx)));
    }

    const label = U.$('#mapTimeLabel'), count = U.$('#mapTimeCount');
    if (label) label.textContent = last ? '현재' : U.fmtDate(months[idx]);
    if (count) {
      let enf = 0, passed = 0;
      state.countries.forEach(c => {
        const st = statusAtFrame(c.iso3, idx);
        if (st === 'enforced') enf++;
        if (st === 'enforced' || st === 'passed') passed++;
      });
      count.textContent = `시행 ${enf}개국 · 법 제정 ${passed}개국`;
    }
    const slider = U.$('#mapTime');
    if (slider && +slider.value !== idx) slider.value = idx;
  }

  function play() {
    if (!months.length) return;
    stop();
    if (frameIdx >= months.length - 1) frameIdx = -1;   // 끝났으면 처음부터
    U.$('#mapPlayer').classList.add('is-playing');
    playTimer = setInterval(() => {
      if (frameIdx >= months.length - 1) { stop(); return; }
      applyFrame(frameIdx + 1);
    }, window.APP_CONFIG.playIntervalMs || 260);
  }
  function stop() {
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
    const el = U.$('#mapPlayer');
    if (el) el.classList.remove('is-playing');
  }

  function setupPlayer() {
    buildTimeline();
    const box = U.$('#mapPlayer');
    if (!box) return;
    if (months.length < 3) { box.hidden = true; return; }
    box.hidden = false;

    // 재생 기능이 있다는 걸 카드 설명에서 알려 줍니다.
    const sub = U.$('#mapSub');
    if (sub) {
      const from = (months[0] || '').slice(0, 4);
      sub.textContent = '국가를 클릭하면 상세 정보가 열립니다. 면적이 작은 국가는 점으로 표시됩니다. ' +
        `지도 아래 재생 버튼을 누르면 ${from}년부터 지금까지 규제가 번져 온 과정을 볼 수 있습니다.`;
    }

    const slider = U.$('#mapTime');
    slider.max = String(months.length - 1);
    slider.value = String(months.length - 1);
    applyFrame(months.length - 1);
  }

  function render(data) {
    state = data;
    byIso = new Map(state.countries.map(c => [c.iso3, c]));
    renderStats();
    renderLegend();
    renderList();
    setupPlayer();
    loadWorld().then(drawMap).catch(err => {
      const el = U.$('#mapLoading');
      if (el) { el.hidden = false; el.textContent = '지도를 불러오지 못했습니다: ' + err.message; }
    });
  }

  /* ── 상단 요약 숫자 ── */
  function renderStats() {
    const box = U.clear(U.$('#mapStats'));
    const counts = Object.fromEntries(window.STATUS.map(s =>
      [s.key, state.countries.filter(c => c.status === s.key).length]));
    window.STATUS.forEach(s => {
      box.appendChild(U.h('div', { class: 'stat', style: { '--stat-c': U.cssVar(s.varName) } }, [
        U.h('div', { class: 'stat-num', html: `${counts[s.key]}<small>개국</small>` }),
        U.h('div', { class: 'stat-label' }, s.label)
      ]));
    });
  }

  /* ── 범례(겸 필터) ── */
  function renderLegend() {
    const box = U.clear(U.$('#mapLegend'));
    window.STATUS.forEach(s => {
      const n = state.countries.filter(c => c.status === s.key).length;
      const item = U.h('button', {
        class: 'legend-item' + (off.has(s.key) ? ' is-off' : ''),
        type: 'button', title: s.desc,
        onclick: () => { off.has(s.key) ? off.delete(s.key) : off.add(s.key); renderLegend(); applyFilter(); renderList(); }
      }, [
        U.h('span', { class: 'legend-swatch', style: { background: U.cssVar(s.varName) } }),
        U.h('span', {}, s.label),
        U.h('span', { class: 'legend-count' }, String(n))
      ]);
      box.appendChild(item);
    });
    box.appendChild(U.h('span', {
      class: 'legend-item', style: { cursor: 'default', opacity: '.75' }
    }, [
      U.h('span', { class: 'legend-swatch', style: { background: U.cssVar('--st-nodata') } }),
      U.h('span', {}, '자료 없음')
    ]));
  }

  /* ── 지도 ── */
  function drawMap() {
    const wrap = U.$('#mapWrap');
    const W = Math.max(300, wrap.clientWidth);
    // 세계지도(남극 제외)의 가로세로비에 맞춰 높이를 잡습니다.
    // 억지로 최소 높이를 주면 지도 위아래에 빈 공간만 생깁니다.
    const H = Math.round(Math.min(620, Math.max(165, W * 0.53)));

    svg = d3.select('#worldMap');
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H);

    const projName = window.APP_CONFIG.projection || 'naturalEarth1';
    projection = (d3[projName] ? d3[projName]() : d3.geoNaturalEarth1())
      .fitExtent([[6, 6], [W - 6, H - 6]], { type: 'FeatureCollection', features });
    pathGen = d3.geoPath(projection);

    gRoot = svg.append('g');
    gLand = gRoot.append('g');
    gDots = gRoot.append('g');
    gLabels = null;

    gLand.selectAll('path').data(features).join('path')
      .attr('d', pathGen)
      .attr('class', f => 'country' + (byIso.has(f.properties.iso3) ? ' clickable' : ''))
      .attr('data-iso', f => f.properties.iso3)
      .attr('fill', f => fillFor(f.properties.iso3))
      .on('click', (ev, f) => { const c = byIso.get(f.properties.iso3); if (c) window.MODAL.open(c, state); })
      .on('mousemove', (ev, f) => showTip(ev, f.properties))
      .on('mouseleave', hideTip);

    // 면적이 작아 클릭하기 어렵거나 지도에 폴리곤이 없는 국가는 점으로 보강
    const limit = (W * H) / (window.APP_CONFIG.smallCountryDivisor || 4500);
    const drawn = new Set(features.map(f => f.properties.iso3));
    const dots = [];
    features.forEach(f => {
      const iso = f.properties.iso3;
      if (!byIso.has(iso) || pathGen.area(f) >= limit) return;
      const p = pathGen.centroid(f);
      if (isFinite(p[0]) && isFinite(p[1]))
        dots.push({ iso3: iso, iso2: f.properties.iso2, name: f.properties.name, xy: p });
    });
    state.countries.forEach(c => {
      if (drawn.has(c.iso3)) return;                       // 이미 폴리곤이 있으면 건너뜀
      const ll = (c.lon !== null && c.lon !== undefined && c.lat !== null && c.lat !== undefined)
        ? [c.lon, c.lat] : (window.MICRO_CENTROIDS || {})[c.iso3];
      if (!ll) return;
      const p = projection(ll);
      if (p && isFinite(p[0]) && isFinite(p[1])) dots.push({ iso3: c.iso3, xy: p, orphan: true });
    });

    dotR = Math.max(4, Math.min(5.2, W / 220));
    gDots.selectAll('circle').data(dots, d => d.iso3).join('circle')
      .attr('class', 'dot-marker')
      .attr('data-iso', d => d.iso3)
      .attr('cx', d => d.xy[0]).attr('cy', d => d.xy[1])
      .attr('r', dotR)
      .attr('fill', d => fillFor(d.iso3))
      .on('click', (ev, d) => { const c = byIso.get(d.iso3); if (c) window.MODAL.open(c, state); })
      .on('mousemove', (ev, d) => showTip(ev, { iso3: d.iso3, iso2: d.iso2, name: d.name }))
      .on('mouseleave', hideTip);

    zoom = d3.zoom().scaleExtent([1, 9])
      .translateExtent([[0, 0], [W, H]]).extent([[0, 0], [W, H]])
      .on('zoom', ev => {
        gRoot.attr('transform', ev.transform);
        gLand.attr('stroke-width', 0.4 / ev.transform.k);
        gDots.selectAll('circle').attr('r', dotR / Math.sqrt(ev.transform.k));
        if (gLabels) {
          gLabels.selectAll('text')
            .style('font-size', (12 / ev.transform.k) + 'px')
            .style('stroke-width', (3.4 / ev.transform.k) + 'px');
          gLabels.selectAll('line').style('stroke-width', (1.2 / ev.transform.k) + 'px');
        }
      });
    svg.call(zoom);

    drawHomeLabel();
    U.$('#mapLoading').hidden = true;
    if (frameIdx >= 0 && frameIdx < months.length - 1) applyFrame(frameIdx);
    applyFilter();
  }

  /* 기준 국가(기본값 대한민국) 상시 강조 */
  function drawHomeLabel() {
    const home = HOME();
    if (!home) return;
    gLand.selectAll('path').classed('is-home', f => f.properties.iso3 === home);
    gDots.selectAll('circle').classed('is-home', d => d.iso3 === home);

    const c = byIso.get(home);
    const feature = features.find(f => f.properties.iso3 === home);
    const dot = gDots.selectAll('circle').data().find(d => d.iso3 === home);
    const xy = dot ? dot.xy : (feature ? pathGen.centroid(feature) : null);
    if (!xy || !isFinite(xy[0])) return;

    const off = window.APP_CONFIG.homeLabelOffset || [22, 34];
    const k = (svg.node().viewBox.baseVal.width || 1022) / 1022;   // 지도 폭에 비례
    const lx = xy[0] + off[0] * k, ly = xy[1] + off[1] * k;

    gLabels = gRoot.append('g');
    // 이름표가 이웃 나라를 덮지 않도록 살짝 떨어뜨리고 연결선으로 잇습니다.
    gLabels.append('line')
      .attr('class', 'home-leader')
      .attr('x1', xy[0]).attr('y1', xy[1]).attr('x2', lx).attr('y2', ly);
    gLabels.append('text')
      .attr('class', 'home-label')
      .attr('x', lx + (off[0] < 0 ? -3 : 3)).attr('y', ly)
      .attr('text-anchor', off[0] < 0 ? 'end' : 'start')
      .attr('dominant-baseline', 'middle')
      .text(c ? c.name : home);
  }

  function fillFor(iso) {
    const c = byIso.get(iso);
    return c ? U.statusColor(c.status) : U.cssVar('--st-nodata');
  }

  function applyFilter() {
    if (!gLand) return;
    const q = U.normalize(query);
    const hit = c => {
      if (off.has(c.status)) return false;
      if (!q) return true;
      return U.normalize(c.name).includes(q) || U.normalize(c.nameEn).includes(q) || U.normalize(c.iso3).includes(q);
    };
    gLand.selectAll('path').classed('is-dim', f => {
      const c = byIso.get(f.properties.iso3);
      return c ? !hit(c) : (off.size > 0 || !!q);
    });
    gDots.selectAll('circle').attr('opacity', d => {
      const c = byIso.get(d.iso3);
      return c && hit(c) ? 1 : 0.22;
    });
  }

  /* ── 툴팁 ── */
  function showTip(ev, props) {
    const tip = U.$('#mapTooltip');
    const c = byIso.get(props.iso3);
    U.clear(tip);
    tip.appendChild(U.h('div', { class: 'tt-name' }, koName(props)));
    if (c) {
      tip.appendChild(U.h('div', { class: 'tt-row' }, [
        U.h('b', {}, U.statusLabel(c.status)),
        U.h('span', {}, c.age ? `· ${c.age}세 기준` : '')
      ]));
    } else {
      tip.appendChild(U.h('div', { class: 'tt-row' }, '등록된 자료 없음'));
    }
    tip.hidden = false;
    const wrap = U.$('#mapWrap').getBoundingClientRect();
    const x = ev.clientX - wrap.left, y = ev.clientY - wrap.top;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = Math.min(Math.max(6, x + 14), wrap.width - tw - 6) + 'px';
    tip.style.top  = Math.max(6, y - th - 12) + 'px';
  }
  function hideTip() { U.$('#mapTooltip').hidden = true; }

  /* ── 사이드 국가 목록 ── */
  function renderList() {
    const box = U.clear(U.$('#countryList'));
    const q = U.normalize(query);
    let total = 0;
    window.STATUS.forEach(s => {
      if (off.has(s.key)) return;
      const items = state.countries
        .filter(c => c.status === s.key)
        .filter(c => !q || U.normalize(c.name).includes(q) || U.normalize(c.nameEn).includes(q) || U.normalize(c.iso3).includes(q))
        .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      if (!items.length) return;
      total += items.length;
      box.appendChild(U.h('div', { class: 'side-group' }, `${s.label} · ${items.length}`));
      items.forEach(c => {
        box.appendChild(U.h('button', {
          class: 'side-item', type: 'button',
          onclick: () => window.MODAL.open(c, state),
          onmouseenter: () => highlight(c.iso3, true),
          onmouseleave: () => highlight(c.iso3, false)
        }, [
          U.h('span', { class: 'side-dot', style: { background: U.statusColor(c.status) } }),
          U.h('span', { class: 'side-name' }, c.name),
          U.h('span', { class: 'side-age' }, c.age ? c.age + '세' : '')
        ]));
      });
    });
    if (!total) box.appendChild(U.h('div', { class: 'empty' }, '조건에 맞는 국가가 없습니다.'));
  }

  function highlight(iso, on) {
    if (!gLand) return;
    gLand.selectAll(`path[data-iso="${iso}"]`).attr('stroke', on ? U.cssVar('--text') : null)
      .attr('stroke-width', on ? 1.4 : null);
    gDots.selectAll(`circle[data-iso="${iso}"]`).attr('r', on ? dotR * 1.6 : dotR);
  }

  /* ── 조작 ── */
  function bind() {
    U.$('#countrySearch').addEventListener('input', U.debounce(e => {
      query = e.target.value; applyFilter(); renderList();
    }, 140));
    U.$('#mapZoomIn').addEventListener('click', () => svg && svg.transition().duration(220).call(zoom.scaleBy, 1.6));
    U.$('#mapZoomOut').addEventListener('click', () => svg && svg.transition().duration(220).call(zoom.scaleBy, 1 / 1.6));
    U.$('#mapPlay').addEventListener('click', () => { playTimer ? stop() : play(); });
    U.$('#mapTime').addEventListener('input', e => { stop(); applyFrame(+e.target.value); });
    U.$('#mapReset').addEventListener('click', () => {
      if (svg) svg.transition().duration(280).call(zoom.transform, d3.zoomIdentity);
      off.clear(); query = ''; U.$('#countrySearch').value = '';
      stop();
      if (months.length) applyFrame(months.length - 1);
      renderLegend(); applyFilter(); renderList();
    });
  }
  bind();

  function resize() { stop(); if (features && state) drawMap(); }

  return { render, resize };
})();
