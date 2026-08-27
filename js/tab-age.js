/* ============================================================
   탭 4 — 연령별 분포
   넓은 화면: 연령 기준별로 국가를 쌓은 칼럼
   좁은 화면: 연령 기준별 묶음 목록
   ============================================================ */
window.TAB_AGE = (function () {
  const U = window.U;
  const NARROW = 700;
  let state = null, lastNarrow = null;

  const isNarrow = () => window.innerWidth <= NARROW;

  function render(data) {
    state = data;
    lastNarrow = isNarrow();
    renderBlocks();
    renderLegend();
  }

  /* 추진 단계가 앞선 나라가 먼저(칼럼에서는 아래에) 오도록 정렬 */
  function sortedItems(items) {
    const rank = Object.fromEntries(window.STATUS.map((s, i) => [s.key, i]));
    return items.slice().sort((x, y) =>
      (rank[x.status] - rank[y.status]) || x.name.localeCompare(y.name, 'ko'));
  }

  function block(c) {
    const isHome = c.iso3 === (window.APP_CONFIG.homeIso || '').toUpperCase();
    const bg = U.statusColor(c.status);
    return U.h('button', {
      class: 'age-block' + (isHome ? ' is-home' : ''), type: 'button',
      style: { background: bg, color: U.inkFor(bg) },
      title: `${c.name} · ${U.statusLabel(c.status)}${c.age ? ` · ${c.age}세 기준` : ''}`,
      onclick: () => window.MODAL.open(c, state)
    }, c.name);
  }

  function renderBlocks() {
    const host = U.clear(U.$('#ageStack'));
    const buckets = window.CHARTS.ageBuckets(state.countries);

    if (!buckets.length) {
      host.appendChild(U.h('div', { class: 'empty' }, '표시할 국가가 없습니다.'));
      return;
    }

    /* 좁은 화면 — 세로로 흐르는 묶음 목록 */
    if (isNarrow()) {
      host.className = 'age-rows';
      host.style.removeProperty('--age-cols');
      buckets.forEach(b => {
        const row = U.h('div', { class: 'age-row' }, [
          U.h('h3', { class: 'age-row-head' }, [
            U.h('span', {}, b.label),
            U.h('span', {}, `${b.items.length}개국`)
          ])
        ]);
        const wrap = U.h('div', { class: 'age-row-blocks' });
        sortedItems(b.items).forEach(c => wrap.appendChild(block(c)));
        row.appendChild(wrap);
        host.appendChild(row);
      });
      return;
    }

    /* 넓은 화면 — 아래에서 위로 쌓는 칼럼 */
    host.className = 'age-stack';
    host.style.setProperty('--age-cols', buckets.length);
    buckets.forEach(b => {
      const col = U.h('div', { class: 'age-col' }, [
        U.h('div', { class: 'age-col-count' }, `${b.items.length}개국`)
      ]);
      const blocks = U.h('div', { class: 'age-col-blocks' });
      sortedItems(b.items).forEach(c => blocks.appendChild(block(c)));
      col.appendChild(blocks);
      col.appendChild(U.h('div', { class: 'age-col-label' }, b.label));
      host.appendChild(col);
    });
  }

  function renderLegend() {
    const box = U.clear(U.$('#ageLegend'));
    window.STATUS.filter(s => s.key !== 'none').forEach(s => {
      const n = state.countries.filter(c => c.status === s.key).length;
      box.appendChild(U.h('span', { class: 'legend-item', style: { cursor: 'default' }, title: s.desc }, [
        U.h('span', { class: 'legend-swatch', style: { background: U.cssVar(s.varName) } }),
        U.h('span', {}, s.label),
        U.h('span', { class: 'legend-count' }, String(n))
      ]));
    });
    box.appendChild(U.h('span', { class: 'legend-count', style: { alignSelf: 'center', marginLeft: '4px' } },
      '규제 없음으로 분류된 국가는 제외'));
  }

  function resize() {
    if (!state) return;
    const n = isNarrow();
    if (n !== lastNarrow) { lastNarrow = n; renderBlocks(); }
  }

  return { render, resize };
})();
