/* ============================================================
   토끼풀 대시보드 임베드 — 부모 페이지용 자동 높이 조절 스크립트
   ------------------------------------------------------------
   기사 페이지에 아래처럼 넣으면 iframe 높이가 내용에 맞게 조절됩니다.

     <iframe src="https://…/index.html?embed=1&tab=map"
             data-tokipul-embed title="SNS 금지법 전 세계 추진 현황"
             style="width:100%;border:0;display:block" height="720"
             loading="lazy" scrolling="no"></iframe>
     <script src="https://…/embed-resizer.js" async><\/script>

   스크립트를 넣지 않으면 height 속성값이 그대로 쓰입니다.
   ============================================================ */
(function () {
  if (window.__tokipulEmbedResizer) return;
  window.__tokipulEmbedResizer = true;

  var MIN = 220, MAX = 20000;

  function frames() {
    var out = [], all = document.querySelectorAll('iframe');
    for (var i = 0; i < all.length; i++) {
      var f = all[i];
      if (f.hasAttribute('data-tokipul-embed') ||
          /[?&](embed=1|tab=|tabs=|country=)/.test(f.getAttribute('src') || '')) out.push(f);
    }
    return out;
  }

  function apply(win, h) {
    if (!(h > MIN) || h > MAX) return;
    var list = frames();
    for (var i = 0; i < list.length; i++) {
      if (list[i].contentWindow === win) {
        list[i].style.height = Math.round(h) + 'px';
        list[i].setAttribute('height', Math.round(h));
        return;
      }
    }
  }

  /* 기사 페이지가 길면 iframe 전체가 화면에 보이지 않습니다.
     지금 보이는 구간을 알려 주면 임베드가 팝업을 그 안에 띄웁니다. */
  function sendViewport(only) {
    var list = frames(), vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < list.length; i++) {
      var f = list[i];
      if (only && f.contentWindow !== only) continue;
      var r = f.getBoundingClientRect();
      var top = Math.max(0, -r.top);
      var height = Math.max(0, Math.min(vh, r.bottom) - Math.max(0, r.top));
      if (!f.contentWindow) continue;
      try {
        f.contentWindow.postMessage({ tokipul: 'viewport', top: top, height: height }, '*');
      } catch (err) {}
    }
  }

  var tick = 0;
  function scheduleViewport() {
    if (tick) return;
    tick = 1;
    var run = function () { tick = 0; sendViewport(); };
    // rAF 를 window 에서 떼어내 호출하면 브라우저가 거부하므로 분기해서 호출합니다.
    if (window.requestAnimationFrame) window.requestAnimationFrame(run);
    else setTimeout(run, 16);
  }

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || !d.tokipul) return;
    if (d.tokipul === 'height') { apply(e.source, d.height); scheduleViewport(); }
    else if (d.tokipul === 'ready') sendViewport(e.source);
  }, false);

  window.addEventListener('scroll', scheduleViewport, { passive: true });
  window.addEventListener('resize', scheduleViewport, { passive: true });

  // 스크롤바가 생기지 않도록 기본값을 맞춰 둡니다.
  function prep() {
    var list = frames();
    for (var i = 0; i < list.length; i++) {
      var f = list[i];
      f.setAttribute('scrolling', 'no');
      f.style.width = f.style.width || '100%';
      f.style.border = f.style.border || '0';
      f.style.display = f.style.display || 'block';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prep);
  else prep();
})();
