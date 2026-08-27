/* ============================================================
   출처 보기 — 푸터 버튼으로 열리는 참고 자료 목록
   ------------------------------------------------------------
   · sources 시트에 모아 둔 전체 참고 자료
   · countries 시트의 국가별 출처를 국가 단위로 묶은 목록
   ============================================================ */
window.SOURCES = (function () {
  const U = window.U;

  function linkRow(i, item) {
    const inner = U.h('span');
    if (item.url) {
      inner.appendChild(U.h('a', { href: item.url, target: '_blank', rel: 'noopener noreferrer' },
        item.title || item.url));
    } else {
      inner.appendChild(document.createTextNode(item.title || ''));
    }
    if (item.publisher) {
      inner.appendChild(U.h('span', { style: { color: 'var(--text-3)' } }, ` — ${item.publisher}`));
    }
    return U.h('div', { class: 'm-source' }, [
      U.h('span', { class: 'm-src-n' }, `[${i}]`), inner
    ]);
  }

  function build(state) {
    const box = U.h('div');

    box.appendChild(U.h('div', { class: 'm-head' }, [
      U.h('div', { class: 'm-title' }, U.h('span', { class: 'm-name' }, '출처')),
      U.h('div', { class: 'm-sub' },
        '이 대시보드를 만들며 참고한 자료입니다. 국가별 세부 근거는 각 국가 상세 정보에서도 볼 수 있습니다.')
    ]));

    /* 전체 참고 자료 */
    const general = state.sources || [];
    if (general.length) {
      const list = U.h('div', { class: 'm-sources' });
      general.forEach((x, i) => list.appendChild(linkRow(i + 1, x)));
      box.appendChild(U.h('div', { class: 'm-field' }, [
        U.h('div', { class: 'm-label' }, `전체 참고 자료 · ${general.length}건`),
        U.h('div', { class: 'm-value' }, list)
      ]));
    }

    /* 국가별 출처 */
    const withSrc = state.countries
      .filter(c => c.sources && c.sources.length)
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    const total = withSrc.reduce((n, c) => n + c.sources.length, 0);

    if (withSrc.length) {
      const wrap = U.h('div', { class: 'src-countries' });
      withSrc.forEach(c => {
        const group = U.h('div', { class: 'src-country' });
        group.appendChild(U.h('button', {
          class: 'src-country-name', type: 'button',
          title: `${c.name} 상세 보기`,
          onclick: () => window.MODAL.open(c, state)
        }, [
          U.h('span', { class: 'side-dot', style: { background: U.statusColor(c.status) } }),
          c.name
        ]));
        const list = U.h('div', { class: 'm-sources' });
        c.sources.forEach((x, i) => list.appendChild(linkRow(i + 1, x)));
        group.appendChild(list);
        wrap.appendChild(group);
      });
      box.appendChild(U.h('div', { class: 'm-field' }, [
        U.h('div', { class: 'm-label' }, `국가별 출처 · ${withSrc.length}개국 ${total}건`),
        U.h('div', { class: 'm-value' }, wrap)
      ]));
    }

    if (!general.length && !withSrc.length) {
      box.appendChild(U.h('div', { class: 'empty' }, '등록된 출처가 없습니다.'));
    }
    return box;
  }

  function open(state) {
    if (!state) return;
    window.MODAL.openNode(build(state));
  }

  return { open, build };
})();
