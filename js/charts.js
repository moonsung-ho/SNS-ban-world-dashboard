/* ============================================================
   차트 모음 (D3)
   ============================================================ */
window.CHARTS = (function () {
  const U = window.U;

  function prep(svgEl, height, pad) {
    const box = svgEl.parentNode;
    const w = Math.max(280, box.clientWidth || 640);
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${w} ${height}`).attr('width', w).attr('height', height)
       .attr('preserveAspectRatio', 'xMinYMin meet');
    return { svg, w, h: height, m: Object.assign({ t: 16, r: 16, b: 28, l: 40 }, pad || {}) };
  }

  function yGrid(g, y, x0, x1, ticks) {
    g.append('g').selectAll('line').data(y.ticks(ticks || 4)).join('line')
      .attr('class', 'grid-line').attr('x1', x0).attr('x2', x1)
      .attr('y1', d => y(d)).attr('y2', d => y(d));
    g.append('g').selectAll('text').data(y.ticks(ticks || 4)).join('text')
      .attr('class', 'tick-text').attr('x', x0 - 8).attr('y', d => y(d))
      .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
      .text(d => d);
  }

  /* ── 연령 기준별 국가 묶기 (연령 탭) ──────────────────── */
  function ageBuckets(countries) {
    const order = [13, 14, 15, 16, 18];
    const list = order.map(a => ({ key: String(a), label: a + '세', age: a, items: [] }));
    const other = { key: 'na', label: '기준 없음', age: null, items: [] };
    countries.forEach(c => {
      if (c.status === 'none') { return; }
      const b = list.find(x => x.age === c.age);
      (b || other).items.push(c);
    });
    const out = list.filter(b => b.items.length);
    if (other.items.length) out.push(other);
    return out.length ? out : list;
  }

  /* ── 1. 국가별 우회율 가로 막대 (실효성 탭) ───────────── */
  function bypassBars(svgEl, rows, onClick) {
    const rowH = 30, H = Math.max(120, rows.length * rowH + 40);
    const { svg, w, h, m } = prep(svgEl, H, { t: 12, r: 46, b: 26, l: 92 });
    if (!rows.length) { svg.append('text').attr('x', 14).attr('y', 28).attr('class', 'tick-text').text('시행 중인 국가의 자료가 없습니다.'); return; }

    const x = d3.scaleLinear().domain([0, Math.max(60, d3.max(rows, r => r.value) + 8)]).range([m.l, w - m.r]);
    const y = d3.scaleBand().domain(rows.map(r => r.iso3)).range([m.t, h - m.b]).padding(.3);
    const g = svg.append('g');

    g.selectAll('line.gl').data(x.ticks(5)).join('line')
      .attr('class', 'grid-line').attr('y1', m.t - 4).attr('y2', h - m.b)
      .attr('x1', d => x(d)).attr('x2', d => x(d));
    g.selectAll('text.gt').data(x.ticks(5)).join('text')
      .attr('class', 'tick-text').attr('y', h - m.b + 15).attr('x', d => x(d))
      .attr('text-anchor', 'middle').text(d => d + '%');

    g.selectAll('rect').data(rows).join('rect')
      .attr('x', x(0)).attr('y', r => y(r.iso3))
      .attr('width', r => Math.max(2, x(r.value) - x(0))).attr('height', y.bandwidth())
      .attr('rx', 3).attr('fill', U.cssVar('--st-enforced'))
      .style('cursor', onClick ? 'pointer' : null)
      .on('click', (ev, r) => onClick && onClick(r))
      .append('title').text(r => `${r.name} · ${r.value}% (${r.label})`);

    g.selectAll('text.lab').data(rows).join('text')
      .attr('class', 'tick-text-strong').attr('x', m.l - 9)
      .attr('y', r => y(r.iso3) + y.bandwidth() / 2)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'middle').text(r => r.name);
    g.selectAll('text.val').data(rows).join('text')
      .attr('class', 'bar-value').attr('x', r => x(r.value) + 7)
      .attr('y', r => y(r.iso3) + y.bandwidth() / 2)
      .attr('dominant-baseline', 'middle').text(r => r.value + '%');
  }

  /* ── 2. 시행 전후 이용률 (덤벨) ───────────────────────── */
  function dumbbell(svgEl, rows, onClick) {
    const rowH = 34, H = Math.max(140, rows.length * rowH + 48);
    const { svg, w, h, m } = prep(svgEl, H, { t: 24, r: 40, b: 26, l: 92 });
    if (!rows.length) { svg.append('text').attr('x', 14).attr('y', 28).attr('class', 'tick-text').text('자료가 없습니다.'); return; }

    const x = d3.scaleLinear().domain([0, 100]).range([m.l, w - m.r]);
    const y = d3.scaleBand().domain(rows.map(r => r.iso3)).range([m.t, h - m.b]).padding(.35);
    const g = svg.append('g');
    const cBefore = U.cssVar('--text-3'), cAfter = U.cssVar('--st-enforced');

    g.selectAll('line.gl').data(x.ticks(5)).join('line')
      .attr('class', 'grid-line').attr('y1', m.t - 6).attr('y2', h - m.b)
      .attr('x1', d => x(d)).attr('x2', d => x(d));
    g.selectAll('text.gt').data(x.ticks(5)).join('text')
      .attr('class', 'tick-text').attr('y', h - m.b + 15).attr('x', d => x(d))
      .attr('text-anchor', 'middle').text(d => d + '%');

    const row = g.selectAll('g.row').data(rows).join('g')
      .attr('transform', r => `translate(0,${y(r.iso3) + y.bandwidth() / 2})`)
      .style('cursor', onClick ? 'pointer' : null)
      .on('click', (ev, r) => onClick && onClick(r));
    row.append('line')
      .attr('x1', r => x(r.after)).attr('x2', r => x(r.before))
      .attr('stroke', U.cssVar('--border-strong')).attr('stroke-width', 2.5).attr('stroke-linecap', 'round');
    row.append('circle').attr('cx', r => x(r.before)).attr('r', 5).attr('fill', cBefore);
    row.append('circle').attr('cx', r => x(r.after)).attr('r', 5.5).attr('fill', cAfter);
    row.append('text').attr('class', 'tick-text-strong').attr('x', m.l - 9)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'middle').text(r => r.name);
    row.append('text').attr('class', 'bar-value')
      .attr('x', r => x(Math.min(r.after, r.before)) - 9).attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle').attr('fill', cAfter)
      .text(r => (r.after - r.before > 0 ? '+' : '') + (r.after - r.before) + 'p');
    row.append('title').text(r => `${r.name}(${r.group}) · 시행 전 ${r.before}% → 시행 후 ${r.after}%`);

    // 상단 범례
    const lg = svg.append('g').attr('transform', `translate(${m.l},${12})`);
    lg.append('circle').attr('cx', 0).attr('r', 4.5).attr('fill', cBefore);
    lg.append('text').attr('x', 9).attr('dominant-baseline', 'middle').attr('class', 'tick-text').text('시행 전');
    lg.append('circle').attr('cx', 66).attr('r', 4.5).attr('fill', cAfter);
    lg.append('text').attr('x', 75).attr('dominant-baseline', 'middle').attr('class', 'tick-text').text('시행 후');
  }

  /* ── 3. 대한민국 연령대별 이용률 ──────────────────────── */
  function koreaUsage(svgEl, rows) {
    const rowH = 30, H = Math.max(140, rows.length * rowH + 34);
    const { svg, w, h, m } = prep(svgEl, H, { t: 10, r: 44, b: 24, l: 78 });
    if (!rows.length) return;
    const x = d3.scaleLinear().domain([0, 100]).range([m.l, w - m.r]);
    const y = d3.scaleBand().domain(rows.map(r => r.group)).range([m.t, h - m.b]).padding(.28);
    const g = svg.append('g');
    /* 규제 대상 연령대를 강조합니다.
       시트에 highlight 열이 있으면 그 값을 쓰고, 없으면 "20대·30대" 같은 성인 표기가
       아닌 항목(초4, 중1, 고3, 13~15세 …)을 청소년으로 봅니다. */
    const isYouth = r => (r.highlight !== null && r.highlight !== undefined)
      ? !!r.highlight
      : !/^\s*\d+\s*대/.test(r.group || '');

    g.selectAll('line.gl').data(x.ticks(5)).join('line')
      .attr('class', 'grid-line').attr('y1', m.t - 4).attr('y2', h - m.b)
      .attr('x1', d => x(d)).attr('x2', d => x(d));
    g.selectAll('text.gt').data(x.ticks(5)).join('text')
      .attr('class', 'tick-text').attr('y', h - m.b + 14).attr('x', d => x(d))
      .attr('text-anchor', 'middle').text(d => d + '%');

    g.selectAll('rect').data(rows).join('rect')
      .attr('x', x(0)).attr('y', r => y(r.group)).attr('height', y.bandwidth())
      .attr('width', r => Math.max(2, x(r.value) - x(0))).attr('rx', 3)
      .attr('fill', r => isYouth(r) ? U.cssVar('--st-enforced') : U.cssVar('--surface-3'));
    g.selectAll('text.lab').data(rows).join('text')
      .attr('class', 'tick-text-strong').attr('x', m.l - 9)
      .attr('y', r => y(r.group) + y.bandwidth() / 2)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'middle').text(r => r.group);
    g.selectAll('text.val').data(rows).join('text')
      .attr('class', 'bar-value').attr('x', r => x(r.value) + 7)
      .attr('y', r => y(r.group) + y.bandwidth() / 2)
      .attr('dominant-baseline', 'middle').text(r => r.value + '%');
  }

  /* ── 4. 우회율 시계열 (국가 팝업 내부) ────────────────── */
  function bypassSpark(svgEl, series) {
    const H = 132;
    const { svg, w, h, m } = prep(svgEl, H, { t: 16, r: 34, b: 26, l: 30 });
    if (!series || series.length < 2) return;

    const x = d3.scalePoint().domain(series.map(d => d.label)).range([m.l, w - m.r]).padding(.02);
    const maxV = d3.max(series, d => d.value);
    const y = d3.scaleLinear().domain([0, Math.max(50, Math.ceil(maxV / 10) * 10 + 5)]).range([h - m.b, m.t]);
    const g = svg.append('g');

    g.selectAll('line.gl').data(y.ticks(3)).join('line')
      .attr('class', 'grid-line').attr('x1', m.l).attr('x2', w - m.r)
      .attr('y1', d => y(d)).attr('y2', d => y(d));
    g.selectAll('text.gt').data(y.ticks(3)).join('text')
      .attr('class', 'tick-text').attr('x', m.l - 7).attr('y', d => y(d))
      .attr('text-anchor', 'end').attr('dominant-baseline', 'middle').text(d => d + '%');

    g.append('path').datum(series).attr('class', 'bypass-area')
      .attr('d', d3.area().curve(d3.curveMonotoneX).x(d => x(d.label)).y0(y(0)).y1(d => y(d.value)));
    g.append('path').datum(series).attr('class', 'bypass-line')
      .attr('d', d3.line().curve(d3.curveMonotoneX).x(d => x(d.label)).y(d => y(d.value)));
    g.selectAll('circle').data(series).join('circle')
      .attr('class', 'bypass-dot').attr('cx', d => x(d.label)).attr('cy', d => y(d.value)).attr('r', 3.2)
      .append('title').text(d => `${d.label} · ${d.value}%`);

    const last = series[series.length - 1];
    g.append('text').attr('x', x(last.label) + 8).attr('y', y(last.value))
      .attr('dominant-baseline', 'middle').attr('fill', U.cssVar('--st-enforced'))
      .attr('font-size', 13).attr('font-weight', 700).text(last.value + '%');

    const every = Math.max(1, Math.ceil(series.length / Math.max(3, Math.floor(w / 78))));
    g.selectAll('text.xt').data(series.filter((d, i) => i % every === 0 || i === series.length - 1)).join('text')
      .attr('class', 'tick-text').attr('x', d => x(d.label)).attr('y', h - m.b + 15)
      .attr('text-anchor', 'middle').text(d => U.fmtMonth(d.label));
  }

  return { ageBuckets, bypassBars, dumbbell, koreaUsage, bypassSpark };
})();
