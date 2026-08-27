/* ============================================================
   탭 3 — 항목 비교표
   ============================================================ */
window.TAB_TABLE = (function () {
  const U = window.U;
  let state = null, sortKey = 'status', sortDir = 1;
  let q = '', fContinent = '', fStatus = '';

  const STATUS_ORDER = Object.fromEntries(window.STATUS.map((s, i) => [s.key, i]));

  const COLS = [
    { key:'name',           label:'국가',            cls:'c-name', get:c => c.name },
    { key:'continent',      label:'대륙',            cls:'c-nowrap', get:c => c.continent },
    { key:'status',         label:'추진 상황',        cls:'c-nowrap', get:c => U.statusLabel(c.status), sort:c => STATUS_ORDER[c.status] },
    { key:'age',            label:'연령 기준',        cls:'c-num',  get:c => c.age ? c.age + '세' : '—', sort:c => c.age === null ? 999 : c.age },
    { key:'scope',          label:'대상 서비스',      cls:'',       get:c => c.scope.length ? c.scope.slice(0, 4).join(', ') + (c.scope.length > 4 ? ` 외 ${c.scope.length - 4}` : '') : '—', sort:c => c.scope.length },
    { key:'responsibility', label:'책임 주체',        cls:'',       get:c => c.responsibility || '—' },
    { key:'enforcement',    label:'집행 수단',        cls:'',       get:c => c.enforcement || '—' },
    { key:'usageRate',      label:'이용률',           cls:'c-num',  get:c => c.usageRate !== null ? c.usageRate + '%' : '—', sort:c => c.usageRate === null ? -1 : c.usageRate },
    { key:'effectiveDate',  label:'시행일',           cls:'c-num',  get:c => c.effectiveDate || '—' },
    { key:'updated',        label:'최종 확인',        cls:'c-num',  get:c => c.updated || '—' }
  ];

  function render(data) {
    state = data;
    fillSelects();
    renderHead();
    renderBody();
  }

  function fillSelects() {
    const cs = U.$('#tableContinent');
    if (!cs.options.length) {
      const conts = Array.from(new Set(state.countries.map(c => c.continent))).sort((a, b) => a.localeCompare(b, 'ko'));
      cs.appendChild(U.h('option', { value: '' }, '대륙 전체'));
      conts.forEach(c => cs.appendChild(U.h('option', { value: c }, c)));
      const ss = U.$('#tableStatus');
      ss.appendChild(U.h('option', { value: '' }, '추진 상황 전체'));
      window.STATUS.forEach(s => ss.appendChild(U.h('option', { value: s.key }, s.label)));
    }
  }

  function renderHead() {
    const thead = U.clear(U.$('#cmpTable thead'));
    const tr = U.h('tr');
    COLS.forEach(col => {
      tr.appendChild(U.h('th', {
        onclick: () => { if (sortKey === col.key) sortDir *= -1; else { sortKey = col.key; sortDir = 1; } renderHead(); renderBody(); },
        title: '정렬'
      }, [
        col.label,
        sortKey === col.key ? U.h('span', { class: 'sort-ind' }, sortDir > 0 ? '▲' : '▼') : null
      ]));
    });
    thead.appendChild(tr);
  }

  function rows() {
    const nq = U.normalize(q);
    return state.countries.filter(c => {
      if (fContinent && c.continent !== fContinent) return false;
      if (fStatus && c.status !== fStatus) return false;
      if (!nq) return true;
      return [c.name, c.nameEn, c.iso3, c.ageRule, c.responsibility, c.enforcement, c.scope.join(' ')]
        .some(v => U.normalize(v).includes(nq));
    }).sort((a, b) => {
      const col = COLS.find(c => c.key === sortKey) || COLS[0];
      const f = col.sort || (c => col.get(c));
      const va = f(a), vb = f(b);
      const r = typeof va === 'number' && typeof vb === 'number'
        ? va - vb : String(va).localeCompare(String(vb), 'ko');
      return r * sortDir || a.name.localeCompare(b.name, 'ko');
    });
  }

  function renderBody() {
    const tbody = U.clear(U.$('#cmpTable tbody'));
    const list = rows();
    list.forEach(c => {
      const tr = U.h('tr', { onclick: () => window.MODAL.open(c, state) });
      COLS.forEach(col => {
        const td = U.h('td', { class: col.cls });
        if (col.key === 'name') {
          td.appendChild(U.h('span', { class: 'side-dot mini-flag', style: {
            background: U.statusColor(c.status), display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px' } }));
          td.appendChild(document.createTextNode(c.name));
        } else if (col.key === 'status') {
          td.appendChild(U.h('span', { class: 'badge', 'data-status': c.status }, U.statusLabel(c.status)));
        } else {
          td.appendChild(U.h('span', { class: 'cell-wrap' }, col.get(c)));
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    if (!list.length) {
      tbody.appendChild(U.h('tr', {}, U.h('td', { colspan: COLS.length, class: 'empty' }, '조건에 맞는 국가가 없습니다.')));
    }
    U.$('#tableFoot').textContent =
      `${list.length}개국 표시 (전체 ${state.countries.length}개국) · 최종 확인 일자는 각 항목의 자료를 마지막으로 검증한 날짜입니다.`;
  }

  function exportCSV() {
    const header = ['국가','영문명','ISO','대륙','추진 상황','연령 기준','구체적 규제','대상 서비스','대상 서비스 설명','책임 주체','집행 수단','이용률(%)','이용률 대상','시행일','최종 확인','출처'];
    const body = rows().map(c => [
      c.name, c.nameEn, c.iso3, c.continent, U.statusLabel(c.status),
      c.age || '', c.ageRule, c.scope.join('; '), c.scopeNote,
      c.responsibility, c.enforcement, c.usageRate ?? '', c.usageGroup,
      c.effectiveDate, c.updated, c.sources.map(s => `${s.title} | ${s.publisher} | ${s.url}`).join(' ;; ')
    ]);
    U.downloadCSV('sns-규제-현황.csv', [header].concat(body));
  }

  U.$('#tableSearch').addEventListener('input', U.debounce(e => { q = e.target.value; renderBody(); }, 150));
  U.$('#tableContinent').addEventListener('change', e => { fContinent = e.target.value; renderBody(); });
  U.$('#tableStatus').addEventListener('change', e => { fStatus = e.target.value; renderBody(); });
  U.$('#csvExport').addEventListener('click', exportCSV);

  return { render, resize() {} };
})();
