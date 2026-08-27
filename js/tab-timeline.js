/* ============================================================
   탭 2 — 확산 연표
   ============================================================ */
window.TAB_TIMELINE = (function () {
  const U = window.U;
  let state = null;
  const off = new Set();

  function render(data) {
    state = data;
    renderFilters();
    renderList();
  }

  function renderFilters() {
    const box = U.clear(U.$('#timelineFilters'));
    window.EVENT_KINDS.forEach(k => {
      const n = state.timeline.filter(e => e.kind === k.key).length;
      if (!n) return;
      box.appendChild(U.h('button', {
        class: 'chip' + (off.has(k.key) ? '' : ' is-on'), type: 'button',
        onclick: () => { off.has(k.key) ? off.delete(k.key) : off.add(k.key); renderFilters(); renderList(); }
      }, `${k.label} ${n}`));
    });
  }

  function renderList() {
    const box = U.clear(U.$('#timelineList'));
    const byIso = new Map(state.countries.map(c => [c.iso3, c]));
    const items = state.timeline.filter(e => !off.has(e.kind)).slice().reverse();
    if (!items.length) { box.appendChild(U.h('div', { class: 'empty' }, '표시할 항목이 없습니다.')); return; }

    let curYear = null, group = null;
    items.forEach(e => {
      const y = U.year(e.date);
      if (y !== curYear) {
        curYear = y;
        const n = items.filter(x => U.year(x.date) === y).length;
        box.appendChild(U.h('div', { class: 'tl-year' }, [
          U.h('span', {}, y + '년'),
          U.h('span', { class: 'tl-year-n' }, `${n}건`)
        ]));
        group = U.h('div', { class: 'tl-items' });
        box.appendChild(group);
      }
      const k = U.kindInfo(e.kind);
      const c = byIso.get(e.iso3);
      const btn = U.h('button', {
        class: 'tl-item', type: 'button',
        style: { '--tl-c': U.cssVar(k.varName) },
        onclick: () => { if (c) window.MODAL.open(c, state); },
        title: c ? `${c.name} 상세 보기` : ''
      }, [
        U.h('div', { class: 'tl-head' }, [
          U.h('span', { class: 'tl-date' }, e.date),
          U.h('span', { class: 'tl-kind', style: { background: U.cssVar(k.varName), color: U.inkFor(U.cssVar(k.varName)) } }, k.label),
          U.h('span', { class: 'tl-country' }, e.country || (c ? c.name : '')),
          U.h('span', { class: 'tl-title' }, e.title)
        ]),
        e.desc ? U.h('div', { class: 'tl-desc' }, e.desc) : null
      ]);
      if (!c) btn.style.cursor = 'default';
      group.appendChild(btn);
    });
  }

  return { render, resize() {} };
})();
