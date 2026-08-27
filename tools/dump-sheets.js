/* 예시 데이터를 구글 시트용 CSV 로 변환합니다. tools/dump-sheets.html 에서 실행하세요. */
(function () {
  const D = window.SAMPLE_DATA;
  const q = v => { const s = String(v === null || v === undefined ? '' : v);
                   return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const toCSV = (header, rows) => [header].concat(rows).map(r => r.map(q).join(',')).join('\n');
  const srcStr = ss => (ss || []).map(s => [s.title, s.publisher, s.url].filter(Boolean).join(' | ')).join('\n');

  const SHEETS = {
    countries: toCSV(
      ['iso3','name','name_en','continent','status','status_note','summary','age','age_rule','scope','scope_note',
       'responsibility','enforcement','usage_rate','usage_group','usage_note','effective_date','updated','lon','lat','sources'],
      D.countries.map(c => [c.iso3, c.name, c.nameEn, c.continent, c.status, c.statusNote, c.summary || '', c.age ?? '',
        c.ageRule, (c.scope || []).join('; '), c.scopeNote, c.responsibility, c.enforcement,
        c.usageRate ?? '', c.usageGroup, c.usageNote, c.effectiveDate, c.updated, '', '', srcStr(c.sources)])),

    timeline: toCSV(['date','iso3','country','kind','title','desc'],
      D.timeline.map(e => [e.date, e.iso3, e.country, e.kind, e.title, e.desc])),

    bypass: toCSV(['iso3','label','value','metric','note'],
      Object.entries(D.bypass).flatMap(([iso, o]) =>
        o.series.map((p, i) => [iso, p.label, p.value, i === 0 ? o.metric : '', i === 0 ? o.note : '']))),

    efficacy_usage: toCSV(['iso3','name','group','before','after'],
      D.efficacy.dumbbell.map(d => [d.iso3, d.name, d.group, d.before, d.after])),

    efficacy_cards: toCSV(['title','big','unit','body','meta'],
      D.efficacy.cards.map(c => [c.title, c.big, c.unit, c.body, c.meta])),

    korea_stats: toCSV(['label','value','unit','color'],
      D.korea.stats.map(s => [s.label, s.value, s.unit, s.color])),

    korea_bills: toCSV(['name','proposer','party','date','age','step','summary','url'],
      D.korea.bills.map(b => [b.name, b.proposer, b.party, b.date, b.age, b.step, b.summary, b.url])),

    korea_usage: toCSV(['group','value'], D.korea.usage.map(u => [u.group, u.value])),

    korea_polls: toCSV(['question','org','date','pro','con','neu'],
      D.korea.polls.map(p => [p.question, p.org, p.date, p.pro, p.con, p.neu])),

    meta: toCSV(['key','value'], [
      ['updated', D.meta.updated],
      ['title', D.meta.title],
      ['ai_note', D.meta.aiNote],
      ['korea_steps', (D.korea.steps || ['발의','소위 심사','상임위 의결','법사위','본회의','공포']).join('; ')]
    ])
  };

  window.SHEET_CSV = SHEETS;   // 콘솔/자동화에서 접근용

  const out = document.getElementById('out');
  if (!out) return;
  Object.entries(SHEETS).forEach(([name, csv]) => {
    const rows = csv.split('\n').length - 1;
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const div = document.createElement('div');
    div.className = 'row';
    div.innerHTML = `<span class="nm">${name}.csv</span><span class="ct">${rows}행</span>`;
    const a = document.createElement('a');
    a.className = 'dl'; a.href = url; a.download = name + '.csv'; a.textContent = '내려받기';
    div.appendChild(a); out.appendChild(div);
  });
})();
