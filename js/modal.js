/* ============================================================
   국가 상세 팝업
   ============================================================ */
window.MODAL = (function () {
  const U = window.U;
  const backdrop = U.$('#modalBackdrop');
  const bodyEl   = U.$('#modalBody');
  const modalEl  = U.$('#modal');
  let lastFocus = null, pendingSpark = null;

  function field(label, valueNode, opts) {
    const wrap = U.h('div', { class: 'm-field' });
    wrap.appendChild(U.h('div', { class: 'm-label' }, label));
    if (typeof valueNode === 'string') {
      wrap.appendChild(U.h('div', { class: 'm-value' + ((opts && opts.muted) ? ' muted' : '') }, valueNode));
    } else if (valueNode) {
      wrap.appendChild(valueNode);
    }
    return wrap;
  }

  /* 국가 상세 내용을 임의의 컨테이너에 그립니다.
     팝업과 임베드용 단일 국가 카드가 이 함수를 공유합니다.
     반환값은 "컨테이너가 화면에 보인 뒤" 호출해야 하는 차트 그리기 함수(없으면 null). */
  function build(target, country, ctx) {
    if (!country || !target) return null;
    let spark = null;
    const bodyEl = target;
    const st = U.statusInfo(country.status);
    const color = U.statusColor(country.status);
    U.clear(bodyEl);

    /* 머리말 — 나라 이름 + 대륙 */
    const head = U.h('div', { class: 'm-head' });
    head.appendChild(U.h('div', { class: 'm-title' }, [
      U.h('span', { class: 'm-name' }, country.name),
      U.h('span', { class: 'badge', 'data-status': country.status }, st.label)
    ]));
    const subBits = [country.continent, country.nameEn, country.iso3].filter(Boolean);
    head.appendChild(U.h('div', { class: 'm-sub', html:
      subBits.map(U.esc).join('<span class="m-dot">·</span>') }));

    if (window.SHARE) {
      const shareBox = U.h('div', { class: 'm-share' });
      head.appendChild(shareBox);
      const single = window.innerWidth <= 760;
      (single ? window.SHARE.buildSingle : window.SHARE.build)(shareBox, {
        country: country.iso3,
        label: '이 국가 공유',
        title: `${country.name} — SNS 규제 현황`,
        text: `${country.name}의 청소년 SNS 규제 현황 — ${st.label}${country.age ? ` · ${country.age}세 기준` : ''}`
      });
    }
    bodyEl.appendChild(head);

    /* 요약 — 항목을 읽기 전에 그림이 잡히도록 앞에 둡니다 */
    if (country.summary) {
      bodyEl.appendChild(U.h('p', { class: 'm-summary' }, country.summary));
    }

    /* 추진 상황 */
    const bar = U.h('div', { class: 'm-status-bar' }, [
      U.h('span', { class: 'm-status-swatch', style: { background: color } }),
      U.h('div', { class: 'm-status-txt' }, [
        U.h('div', { class: 'm-status-lab' }, '추진 상황'),
        U.h('div', { class: 'm-status-val' }, st.label +
          (country.effectiveDate && country.effectiveDate !== '해당 없음'
            ? `  ·  시행일 ${U.fmtDate(country.effectiveDate) === '—' ? country.effectiveDate : U.fmtDate(country.effectiveDate)}` : '')),
        country.statusNote ? U.h('div', { class: 'm-status-note' }, country.statusNote) : null
      ])
    ]);
    bodyEl.appendChild(bar);

    /* 연령 기준 및 구체적인 규제 */
    const ageLabel = country.age ? `${country.age}세` : '기준 없음';
    const ageBox = U.h('div', { class: 'm-value' }, [
      U.h('span', { style: { fontWeight: '700' } }, ageLabel),
      country.ageRule ? U.h('div', { style: { marginTop: '5px' } }, country.ageRule) : null
    ]);
    bodyEl.appendChild(field('연령 기준 및 구체적인 규제', ageBox));

    /* 대상 서비스 범위 */
    const scopeBox = U.h('div', { class: 'm-value' + (country.scope.length ? '' : ' muted') });
    if (country.scope.length) {
      const tags = U.h('div', { class: 'm-tags' });
      country.scope.forEach(s => tags.appendChild(U.h('span', { class: 'm-tag' }, s)));
      scopeBox.appendChild(tags);
    } else {
      scopeBox.appendChild(document.createTextNode('해당 없음'));
    }
    if (country.scopeNote) scopeBox.appendChild(U.h('div', { style: { marginTop: '7px' } }, country.scopeNote));
    bodyEl.appendChild(field('대상 서비스 범위', scopeBox));

    /* 책임 주체 / 집행 수단 */
    bodyEl.appendChild(field('책임 주체', country.responsibility || '자료 없음', { muted: !country.responsibility }));
    bodyEl.appendChild(field('집행 수단', country.enforcement || '자료 없음', { muted: !country.enforcement }));

    /* 현재 이용률 — 시행 중인 국가는 시행 전후를 나란히 비교 */
    const dd = (ctx && ctx.efficacy && ctx.efficacy.dumbbell)
      ? ctx.efficacy.dumbbell.find(d => d.iso3 === country.iso3) : null;
    const hasCompare = country.status === 'enforced' && dd &&
      dd.before !== null && dd.after !== null;

    if (hasCompare) {
      const delta = dd.after - dd.before;
      const max = Math.max(dd.before, dd.after, 1);
      const bar = (label, value, cls) => U.h('div', { class: 'm-compare-row' }, [
        U.h('span', { class: 'm-compare-lab' }, label),
        U.h('span', { class: 'm-compare-track' },
          U.h('span', { class: 'm-compare-fill ' + cls,
                        style: { width: Math.max(2, value / max * 100) + '%' } })),
        U.h('span', { class: 'm-compare-val' }, value + '%')
      ]);
      const box = U.h('div', { class: 'm-value' }, [
        U.h('div', { class: 'm-compare' }, [
          bar('시행 전', dd.before, 'is-before'),
          bar('시행 후', dd.after, 'is-after'),
          U.h('div', { class: 'm-compare-delta' }, [
            U.h('span', { class: 'm-compare-delta-num' + (delta < 0 ? ' is-down' : ' is-up') },
              (delta > 0 ? '+' : '−') + Math.abs(delta) + '%p'),
            U.h('span', {}, [dd.group, country.usageNote].filter(Boolean).join(' · '))
          ])
        ])
      ]);
      bodyEl.appendChild(field('시행 전후 이용률', box));
    } else if (country.usageRate !== null && country.usageRate !== undefined) {
      const usage = U.h('div', { class: 'm-value' }, [
        U.h('div', { class: 'm-usage' }, [
          U.h('span', { class: 'm-usage-num', html: `${country.usageRate}<small>%</small>` }),
          U.h('span', { class: 'm-usage-bar' }, U.h('span', {
            class: 'm-usage-fill', style: { width: Math.max(0, Math.min(100, country.usageRate)) + '%' } }))
        ]),
        U.h('div', { style: { marginTop: '6px', fontSize: '13px', color: 'var(--text-3)' } },
          [country.usageGroup, country.usageNote].filter(Boolean).join(' · '))
      ]);
      bodyEl.appendChild(field('현재 이용률', usage));
    } else {
      bodyEl.appendChild(field('현재 이용률', '자료 없음', { muted: true }));
    }

    /* 우회 비율 그래프 — 실제 시행 중인 국가에만 표시 */
    const by = ctx && ctx.bypass ? ctx.bypass[country.iso3] : null;
    if (country.status === 'enforced' && by && by.series && by.series.length > 1) {
      const box = U.h('div', { class: 'm-bypass' });
      const latest = by.series[by.series.length - 1];
      box.appendChild(U.h('div', { class: 'm-bypass-head' }, [
        U.h('span', { class: 'm-bypass-title' }, by.metric || '규제 우회 이용 비율'),
        U.h('span', { class: 'm-bypass-latest' },
          `최근 ${U.fmtDate(latest.label)} 기준 ${latest.value}%`)
      ]));
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      box.appendChild(svg);
      if (by.note) box.appendChild(U.h('div', { class: 'm-bypass-note' }, by.note));
      bodyEl.appendChild(field('규제 우회 비율 추이', box));
      spark = () => window.CHARTS.bypassSpark(svg, by.series);
    }

    /* 최종 확인 일자 */
    bodyEl.appendChild(field('최종 확인 일자',
      country.updated ? U.fmtDate(country.updated) : '자료 없음', { muted: !country.updated }));

    /* 출처 */
    const srcBox = U.h('div', { class: 'm-value' + (country.sources.length ? '' : ' muted') });
    if (country.sources.length) {
      const list = U.h('div', { class: 'm-sources' });
      country.sources.forEach((s, i) => {
        const line = U.h('div', { class: 'm-source' }, U.h('span', { class: 'm-src-n' }, `[${i + 1}]`));
        const inner = U.h('span');
        if (s.url) inner.appendChild(U.h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, s.title || s.url));
        else inner.appendChild(document.createTextNode(s.title || ''));
        if (s.publisher) inner.appendChild(U.h('span', { style: { color: 'var(--text-3)' } }, ` — ${s.publisher}`));
        line.appendChild(inner);
        list.appendChild(line);
      });
      srcBox.appendChild(list);
    } else {
      srcBox.appendChild(document.createTextNode('등록된 출처가 없습니다.'));
    }
    bodyEl.appendChild(field('출처', srcBox));
    return spark;
  }

  function open(country, ctx) {
    if (!country) return;
    lastFocus = document.activeElement;
    pendingSpark = build(bodyEl, country, ctx);
    backdrop.hidden = false;
    if (window.EMBED && window.EMBED.on) {
      window.EMBED.placeOverlay();      // 가지고 있는 값으로 먼저 배치하고
      window.EMBED.requestViewport();   // 최신 값을 받아 다시 맞춥니다
    }
    document.body.style.overflow = 'hidden';
    modalEl.scrollTop = 0;
    // 팝업이 보인 뒤라야 컨테이너 폭이 확정되므로 이 시점에 차트를 그림
    if (pendingSpark) { pendingSpark(); pendingSpark = null; }
    U.$('#modalClose').focus();
  }

  /* 국가 상세가 아닌 임의의 내용을 같은 팝업 틀에 띄웁니다. */
  function openNode(node) {
    if (!node) return;
    lastFocus = document.activeElement;
    pendingSpark = null;
    U.clear(bodyEl);
    bodyEl.appendChild(node);
    backdrop.hidden = false;
    if (window.EMBED && window.EMBED.on) {
      window.EMBED.placeOverlay();
      window.EMBED.requestViewport();
    }
    document.body.style.overflow = 'hidden';
    modalEl.scrollTop = 0;
    U.$('#modalClose').focus();
  }

  function close() {
    backdrop.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  U.$('#modalClose').addEventListener('click', close);
  backdrop.addEventListener('mousedown', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  return { open, openNode, close, build };
})();
