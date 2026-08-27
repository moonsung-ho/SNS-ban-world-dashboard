/* ============================================================
   공통 유틸리티
   ============================================================ */
window.U = (function () {

  /* --- DOM --- */
  function h(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k === 'text') n.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') Object.assign(n.style, v);
      else n.setAttribute(k, v);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(c) : c);
    });
    return n;
  }
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); return node; }

  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* --- 색 (CSS 사용자 정의 속성에서 읽어 테마 전환에 대응) --- */
  const _colorCache = new Map();
  function cssVar(name) {
    if (_colorCache.has(name)) return _colorCache.get(name);
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    _colorCache.set(name, v);
    return v;
  }
  function flushColorCache() { _colorCache.clear(); }

  const statusMap = () => Object.fromEntries(window.STATUS.map(s => [s.key, s]));
  function statusInfo(key) { return statusMap()[key] || window.STATUS[window.STATUS.length - 1]; }
  function statusColor(key) {
    const s = statusMap()[key];
    return s ? cssVar(s.varName) : cssVar('--st-nodata');
  }
  function statusLabel(key) { const s = statusMap()[key]; return s ? s.label : '자료 없음'; }

  function kindInfo(key) {
    return (window.EVENT_KINDS || []).find(k => k.key === key) || { key:'debate', label:'기타', varName:'--st-none' };
  }

  /* --- 날짜 --- */
  function fmtDate(s) {
    if (!s) return '—';
    const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(String(s).trim());
    if (!m) return String(s);
    return m[3] ? `${m[1]}. ${+m[2]}. ${+m[3]}.` : `${m[1]}. ${+m[2]}.`;
  }
  function fmtMonth(s) {
    const m = /^(\d{4})-(\d{2})/.exec(String(s || '').trim());
    return m ? `${m[1].slice(2)}.${m[2]}` : String(s || '');
  }
  function year(s) { const m = /^(\d{4})/.exec(String(s || '')); return m ? m[1] : '기타'; }

  /* --- 기타 --- */
  function debounce(fn, ms) {
    let t; return function () { clearTimeout(t); const a = arguments, s = this; t = setTimeout(() => fn.apply(s, a), ms || 180); };
  }
  function num(v) {
    if (v === null || v === undefined || v === '') return null;
    const n = parseFloat(String(v).replace(/[^\d.\-]/g, ''));
    return isNaN(n) ? null : n;
  }
  function normalize(s) { return String(s || '').toLowerCase().replace(/\s+/g, ''); }

  /* 배경색 위에서 대비가 더 좋은 글자색을 고릅니다(WCAG 상대휘도 기준). */
  const INK_DARK = '#1A1210';
  function srgbLum(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }
  function inkFor(hex) {
    const L = srgbLum(hex);
    if (L === null) return 'var(--text)';
    const onDark  = (L + 0.05) / (srgbLum(INK_DARK) + 0.05);
    const onWhite = 1.05 / (L + 0.05);
    return onDark >= onWhite ? INK_DARK : '#FFFFFF';
  }

  function csvEscape(v) {
    const s = String(v === null || v === undefined ? '' : v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function downloadCSV(filename, rows) {
    const body = rows.map(r => r.map(csvEscape).join(',')).join('\n');
    const blob = new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' });
    const a = h('a', { href: URL.createObjectURL(blob), download: filename });
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 200);
  }

  return { h, $, $$, clear, esc, cssVar, flushColorCache, statusInfo, statusColor, statusLabel,
           kindInfo, fmtDate, fmtMonth, year, debounce, num, normalize, inkFor, downloadCSV };
})();
