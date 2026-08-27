/* ============================================================
   SNS 공유
   ------------------------------------------------------------
   대시보드 전체 또는 특정 국가의 링크를 공유합니다.
   공유 주소에서는 임베드용 파라미터를 모두 걷어내
   항상 정식 대시보드 주소가 나가도록 합니다.
   ============================================================ */
window.SHARE = (function () {
  const U = window.U;

  const ICONS = {
    x: '<path d="M18.9 2H22l-7.6 8.7L23.3 22h-6.9l-5.4-7-6.2 7H1.7l8.1-9.3L1 2h7.1l4.9 6.4L18.9 2Z' +
       'm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z"/>',
    facebook: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.8 3.8-3.8 1.1 0 2.2.2 2.2.2' +
              'v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z"/>',
    link: '<path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" ' +
          'd="M10.3 13.7a4.2 4.2 0 0 0 6 0l3-3a4.2 4.2 0 1 0-6-6l-1.5 1.5M13.7 10.3a4.2 4.2 0 0 0-6 0l-3 3' +
          'a4.2 4.2 0 1 0 6 6l1.5-1.5"/>',
    check: '<path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" ' +
           'stroke-linejoin="round" d="m5 12.5 4.5 4.5L19 7"/>',
    share: '<path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" ' +
           'stroke-linejoin="round" d="M12 3v12M8.2 6.8 12 3l3.8 3.8M5 13.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5.5"/>'
  };

  function svg(name) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">${ICONS[name]}</svg>`;
  }

  /* 공유용 정식 주소 — 임베드 파라미터를 걷어냅니다. */
  function canonical(opts) {
    const u = new URL(location.href);
    u.search = '';
    u.hash = '';
    if (opts && opts.country) u.searchParams.set('country', opts.country);
    else if (opts && opts.tab) u.hash = opts.tab;
    return u.toString();
  }

  function targets(url, text) {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(text);
    return [
      { key:'x',        label:'X에 공유',        icon:'x',
        href:`https://x.com/intent/post?text=${t}&url=${u}` },
      { key:'facebook', label:'페이스북에 공유',  icon:'facebook',
        href:`https://www.facebook.com/sharer/sharer.php?u=${u}` }
    ];
  }

  async function copy(url) {
    try { await navigator.clipboard.writeText(url); return true; }
    catch (e) {
      const ta = U.h('textarea', { style: { position:'fixed', left:'-9999px' } });
      ta.value = url; document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) {}
      ta.remove();
      return ok;
    }
  }

  /* host 안에 공유 버튼들을 그립니다.
     opts: { country, tab, text, title, label } */
  function build(host, opts) {
    if (!host) return;
    U.clear(host);
    opts = opts || {};
    const url = canonical(opts);
    const text = opts.text || document.title;

    if (opts.label !== false) {
      host.appendChild(U.h('span', { class: 'share-label' }, opts.label || '공유'));
    }

    // 버튼은 하나의 묶음으로 붙여서 표시합니다.
    const group = U.h('div', { class: 'share-group' });
    host.appendChild(group);

    targets(url, text).forEach(t => {
      group.appendChild(U.h('a', {
        class: 'share-btn', href: t.href, target: '_blank', rel: 'noopener noreferrer',
        title: t.label, 'aria-label': t.label, html: svg(t.icon)
      }));
    });

    // 링크 복사
    const copyBtn = U.h('button', {
      class: 'share-btn', type: 'button', title: '링크 복사', 'aria-label': '링크 복사',
      html: svg('link'),
      onclick: async () => {
        const ok = await copy(url);
        if (!ok) return;
        copyBtn.innerHTML = svg('check');
        copyBtn.classList.add('is-done');
        copyBtn.title = '복사했습니다';
        setTimeout(() => {
          copyBtn.innerHTML = svg('link');
          copyBtn.classList.remove('is-done');
          copyBtn.title = '링크 복사';
        }, 1700);
      }
    });
    group.appendChild(copyBtn);

    // 기기 공유 시트 — 카카오톡·메시지 등은 이쪽으로 처리됩니다(모바일·HTTPS에서만 제공)
    if (navigator.share) {
      group.appendChild(U.h('button', {
        class: 'share-btn', type: 'button', title: '다른 앱으로 공유', 'aria-label': '다른 앱으로 공유',
        html: svg('share'),
        onclick: () => navigator.share({ title: opts.title || text, text: text, url: url }).catch(() => {})
      }));
    }
    return url;
  }

  return { build, canonical, copy };
})();
