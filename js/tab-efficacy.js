/* ============================================================
   탭 5 — 실효성
   ============================================================ */
window.TAB_EFFICACY = (function () {
  const U = window.U;
  let state = null;

  function bypassRows() {
    const byIso = new Map(state.countries.map(c => [c.iso3, c]));
    return Object.entries(state.bypass || {}).map(([iso, o]) => {
      const c = byIso.get(iso);
      if (!c || c.status !== 'enforced') return null;   // 실제 시행 중인 국가만
      const last = o.series[o.series.length - 1];
      return { iso3: iso, name: c.name, value: last.value, label: last.label, country: c };
    }).filter(Boolean).sort((a, b) => b.value - a.value);
  }

  function dumbbellRows() {
    const byIso = new Map(state.countries.map(c => [c.iso3, c]));
    return (state.efficacy.dumbbell || []).map(d => Object.assign({}, d, { country: byIso.get(d.iso3) }))
      .sort((a, b) => (a.after - a.before) - (b.after - b.before));
  }

  function render(data) {
    state = data;
    draw();
    renderCards();
  }

  function draw() {
    window.CHARTS.bypassBars(U.$('#bypassChart'), bypassRows(),
      r => r.country && window.MODAL.open(r.country, state));
    window.CHARTS.dumbbell(U.$('#dumbbellChart'), dumbbellRows(),
      r => r.country && window.MODAL.open(r.country, state));
  }

  function renderCards() {
    const box = U.clear(U.$('#efficacyCards'));
    (state.efficacy.cards || []).forEach(c => {
      box.appendChild(U.h('div', { class: 'kv-card' }, [
        U.h('h4', {}, c.title),
        c.big ? U.h('div', { class: 'kv-big', html: U.esc(c.big) + (c.unit ? ` <small>${U.esc(c.unit)}</small>` : '') }) : null,
        U.h('p', { style: { marginTop: c.big ? '7px' : '0' } }, c.body),
        c.meta ? U.h('div', { class: 'kv-meta' }, c.meta) : null
      ]));
    });
  }

  function resize() { if (state) draw(); }
  return { render, resize };
})();
