/* ============================================================
   탭 6 — 대한민국 추진 현황
   ============================================================ */
window.TAB_KOREA = (function () {
  const U = window.U;
  let state = null;

  function render(data) {
    state = data;
    renderStats();
    renderBills();
    drawUsage();
    renderPolls();
  }

  function renderStats() {
    const box = U.clear(U.$('#koreaStats'));
    (state.korea.stats || []).forEach(s => {
      box.appendChild(U.h('div', { class: 'stat', style: { '--stat-c': U.cssVar(s.color || '--accent') } }, [
        U.h('div', { class: 'stat-num', html: U.esc(s.value) + (s.unit ? `<small>${U.esc(s.unit)}</small>` : '') }),
        U.h('div', { class: 'stat-label' }, s.label)
      ]));
    });
  }

  function renderBills() {
    const box = U.clear(U.$('#koreaBills'));
    const steps = state.korea.steps;
    const bills = (state.korea.bills || []).slice().sort((a, b) => (b.step - a.step) || String(b.date).localeCompare(String(a.date)));
    if (!bills.length) { box.appendChild(U.h('div', { class: 'empty' }, '등록된 법안이 없습니다.')); return; }

    bills.forEach(b => {
      const el = U.h('div', { class: 'bill' });
      el.appendChild(U.h('div', { class: 'bill-top' }, [
        U.h('span', { class: 'bill-name' }, b.name),
        b.age ? U.h('span', { class: 'badge', 'data-status': 'bill' }, b.age) : null,
        U.h('span', { class: 'bill-meta' },
          [b.proposer, b.party, b.date ? U.fmtDate(b.date) + ' 발의' : ''].filter(Boolean).join(' · '))
      ]));
      if (b.summary) el.appendChild(U.h('div', { class: 'bill-sum' }, b.summary));

      const stepBox = U.h('div', { class: 'bill-steps' });
      steps.forEach((name, i) => {
        const idx = i + 1;
        const cls = idx < b.step ? 'done' : (idx === b.step ? 'current' : '');
        stepBox.appendChild(U.h('div', { class: 'bill-step ' + cls }, [
          U.h('div', { class: 'bar' }), U.h('div', {}, name)
        ]));
      });
      el.appendChild(stepBox);
      // 좁은 화면에서는 단계 이름이 들어갈 자리가 없어 현재 단계만 글로 알려 줍니다.
      const cur = steps[Math.min(steps.length, Math.max(1, b.step)) - 1];
      el.appendChild(U.h('span', { class: 'bill-current' },
        `현재 ${cur} (${Math.min(b.step, steps.length)}/${steps.length}단계)`));

      if (b.url) {
        el.appendChild(U.h('div', { style: { marginTop: '9px', fontSize: '12px' } },
          U.h('a', { href: b.url, target: '_blank', rel: 'noopener noreferrer' }, '의안 원문 보기 ↗')));
      }
      box.appendChild(el);
    });
  }

  function drawUsage() { window.CHARTS.koreaUsage(U.$('#koreaUsageChart'), state.korea.usage || []); }

  function renderPolls() {
    const box = U.clear(U.$('#koreaPolls'));
    (state.korea.polls || []).forEach(p => {
      const total = Math.max(1, p.pro + p.con + p.neu);
      const seg = (cls, v, label) => v <= 0 ? null : U.h('div', {
        class: 'poll-seg ' + cls, style: { flexBasis: (v / total * 100) + '%' },
        title: `${label} ${v}%`
      }, v >= 8 ? v + '%' : '');
      box.appendChild(U.h('div', { class: 'poll' }, [
        U.h('div', { class: 'poll-q' }, p.question),
        U.h('div', { class: 'poll-meta' }, [p.org, p.date].filter(Boolean).join(' · ')),
        U.h('div', { class: 'poll-bar' }, [seg('pro', p.pro, '찬성'), seg('con', p.con, '반대'), seg('neu', p.neu, '유보')]),
        U.h('div', { class: 'poll-legend' }, [
          U.h('span', {}, `찬성 ${p.pro}%`), U.h('span', {}, `반대 ${p.con}%`), U.h('span', {}, `유보 ${p.neu}%`)
        ])
      ]));
    });
    if (!box.children.length) box.appendChild(U.h('div', { class: 'empty' }, '등록된 조사가 없습니다.'));
  }

  function resize() { if (state) drawUsage(); }
  return { render, resize };
})();
