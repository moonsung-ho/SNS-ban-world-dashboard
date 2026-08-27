#!/usr/bin/env python3
"""assets/logo.svg 를 index.html 헤더에 인라인으로 삽입합니다.

로고 파일을 교체한 뒤 아래 명령을 실행하면 헤더가 갱신됩니다.
    python3 tools/embed-logo.py

색은 currentColor 로 치환되므로 라이트/다크 모드에서 자동으로 대비됩니다.
"""
import re, pathlib, sys

root = pathlib.Path(__file__).resolve().parent.parent
svg_path = root / 'assets' / 'logo.svg'
html_path = root / 'index.html'

svg = svg_path.read_text(encoding='utf-8')

# XML 선언 / 주석 제거
svg = re.sub(r'<\?xml.*?\?>', '', svg, flags=re.S)
svg = re.sub(r'<!--.*?-->', '', svg, flags=re.S)

m = re.search(r'<svg\b(.*?)>(.*)</svg>', svg, flags=re.S)
if not m:
    sys.exit('logo.svg 에서 <svg> 요소를 찾지 못했습니다.')
attrs, body = m.group(1), m.group(2)

vb = re.search(r'viewBox="([^"]+)"', attrs)
view_box = vb.group(1) if vb else '0 0 100 100'

# <style> 블록과 class 참조를 없애고 전부 currentColor 로 통일
body = re.sub(r'<style.*?</style>', '', body, flags=re.S)
body = re.sub(r'<defs>\s*</defs>', '', body, flags=re.S)
body = re.sub(r'\sclass="[^"]*"', '', body)
body = re.sub(r'\s(fill|stroke)="(?!none)[^"]*"', r' \1="currentColor"', body)
body = re.sub(r'\s+id="[^"]*"', '', body)
body = re.sub(r'\n\s*\n', '\n', body).strip()

inline = (
    f'<svg class="brand-logo" viewBox="{view_box}" fill="currentColor" '
    f'role="img" aria-label="토끼풀" focusable="false">\n{body}\n</svg>'
)

html = html_path.read_text(encoding='utf-8')
new_html, n = re.subn(
    r'(<!-- logo:start -->)(.*?)(<!-- logo:end -->)',
    lambda _m: _m.group(1) + '\n        ' + inline + '\n        ' + _m.group(3),
    html, flags=re.S)
if not n:
    sys.exit('index.html 에서 <!-- logo:start --> / <!-- logo:end --> 마커를 찾지 못했습니다.')

html_path.write_text(new_html, encoding='utf-8')
print(f'삽입 완료 · viewBox={view_box} · {len(inline)} bytes')
