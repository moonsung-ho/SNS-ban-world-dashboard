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

  /* 대비를 고려한 글자색 선택 */
  function inkFor(hex) {
    const c = String(hex || '').trim();
    const m = /^#?([0-9a-f]{6})$/i.exec(c);
    if (!m) return 'var(--text)';
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return L > 0.58 ? '#15181B' : '#FFFFFF';
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
