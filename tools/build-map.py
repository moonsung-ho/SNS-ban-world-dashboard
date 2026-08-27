#!/usr/bin/env python3
"""data/world-110m.json 재생성 스크립트.

world-atlas 원본 TopoJSON 은 숫자 국가코드만 가지고 있어서,
각 지형에 ISO alpha-3/alpha-2 코드(properties.iso3 / iso2)를 주입해 두었습니다.
지도를 다른 해상도로 바꾸고 싶을 때만 실행하면 됩니다.

    curl -sSL -o data/world-110m.json \
      https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json
    python3 tools/build-map.py
"""
import json, pathlib, sys

root = pathlib.Path(__file__).resolve().parent.parent
atlas_path = root / 'data' / 'world-110m.json'
codes_path = root / 'tools' / 'iso-codes.json'   # i18n-iso-countries 의 codes.json

atlas = json.loads(atlas_path.read_text(encoding='utf-8'))
codes = json.loads(codes_path.read_text(encoding='utf-8'))
num2a3 = {c[2].lstrip('0') or '0': c[1] for c in codes}
num2a2 = {c[2].lstrip('0') or '0': c[0] for c in codes}
a3to2 = {c[1]: c[0] for c in codes}
name_fb = {'Kosovo': 'XKX', 'N. Cyprus': 'CYP-N', 'Somaliland': 'SOL',
           'Fr. S. Antarctic Lands': 'ATF'}

missing = []
for g in atlas['objects']['countries']['geometries']:
    name = g['properties']['name']
    nid = str(g.get('id', '')).lstrip('0') or '0'
    a3 = num2a3.get(nid) or name_fb.get(name)
    if not a3:
        missing.append((g.get('id'), name))
    g['properties']['iso3'] = a3 or ''
    # 브라우저의 Intl.DisplayNames 로 한글 국가명을 뽑기 위해 알파-2 도 함께 넣습니다.
    g['properties']['iso2'] = a3to2.get(a3 or '', '') or num2a2.get(nid, '')

atlas_path.write_text(json.dumps(atlas, separators=(',', ':')), encoding='utf-8')
print(f'주입 완료 · 매칭 실패 {len(missing)}건', missing or '')
