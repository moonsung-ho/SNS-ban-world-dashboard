/* ============================================================
   탭 4 — 연령별 분포
   연령 기준별로 국가를 쌓아 보여 줍니다.
   ============================================================ */
window.TAB_AGE = (function () {
  const U = window.U;
  let state = null;

  function render(data) {
    state = data;
    renderStack();
    renderLegend();
  }

  function renderStack() {
    const host = U.clear(U.$('#ageStack'));
    const buckets = window.CHARTS.ageBuckets(state.countries);
    host.style.setProperty('--age-cols', buckets.length);

    // 추진 단계가 앞선 나라가 아래에 깔리도록 정렬 (칼럼은 아래에서 위로 쌓임)
    const rank = Object.fromEntries(window.STATUS.map((s, i) => [s.key, i]));

    buckets.forEach(b => {
      const col = U.h('div', { class: 'age-col' });
      col.appendChild(U.h('div', { class: 'age-col-count' }, `${b.items.length}개국`));

      const blocks = U.h('div', { class: 'age-col-blocks' });
      b.items.slice()
        .sort((x, y) => (rank[x.status] - rank[y.status]) || x.name.localeCompare(y.name, 'ko'))
        .forEach(c => {
          const bg = U.statusColor(c.status);
          const isHome = c.iso3 === (window.APP_CONFIG.homeIso || '').toUpperCase();
          blocks.appendChild(U.h('button', {
            class: 'age-block' + (isHome ? ' is-home' : ''), type: 'button',
            style: { background: bg, color: U.inkFor(bg) },
            title: `${c.name} · ${U.statusLabel(c.status)}${c.age ? ` · ${c.age}세 기준` : ''}`,
            onclick: () => window.MODAL.open(c, state)
          }, c.name));
        });
      col.appendChild(blocks);
      col.appendChild(U.h('div', { class: 'age-col-label' }, b.label));
      host.appendChild(col);
    });

    if (!buckets.length) host.appendChild(U.h('div', { class: 'empty' }, '표시할 국가가 없습니다.'));
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

  function resize() { if (state) renderStack(); }
  return { render, resize };
})();
