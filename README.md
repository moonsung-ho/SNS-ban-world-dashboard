# SNS 금지법 전 세계 추진 현황 대시보드

청소년 소셜미디어 이용 규제의 국가별 추진 현황을 지도·연표·비교표로 보여주는 인터랙티브 대시보드입니다.
빌드 도구 없이 정적 파일만으로 동작하며, 운영 환경에서는 **구글 시트로 데이터를 관리**합니다.

---

## 실행

지도 데이터를 `fetch` 로 읽기 때문에 `file://` 로 열면 동작하지 않습니다. 반드시 서버로 띄우세요.

```bash
./serve.sh
```

기본 포트는 8080입니다. `./serve.sh 3000` 처럼 포트를 지정할 수 있습니다.

정적 호스팅(GitHub Pages, Netlify, Vercel, S3 등)에는 이 폴더를 통째로 올리면 됩니다. 서버 코드가 필요 없습니다.

---

## 구성

| 경로 | 내용 |
|---|---|
| `index.html` | 화면 구조 (헤더 · 탭 6개 · 국가 팝업) |
| `css/style.css` | 스타일 및 라이트/다크 테마 토큰 |
| `js/config.js` | **설정 파일 — 배포 시 여기만 수정** |
| `js/sample-data.js` | 예시 데이터 (개발용) |
| `js/data.js` | 구글 시트 로더 및 정규화 |
| `js/charts.js` | 차트 (D3) |
| `js/tab-*.js` | 탭별 화면 |
| `js/modal.js` | 국가 상세 팝업 |
| `embed.html` | 기사 임베드 코드 생성기 (미리보기 포함) |
| `embed-resizer.js` | 기사 페이지에 넣는 높이 자동 조절 스크립트 |
| `js/embed.js` | 임베드 모드 동작 |
| `js/share.js` | SNS 공유 버튼 |
| `js/sources.js` | 푸터 '출처 보기' 팝업 |
| `sheets/*.csv` | 구글 시트에 그대로 넣을 수 있는 데이터 템플릿 |
| `assets/logo.svg` | 토끼풀 로고 (교체 시 아래 참고) |
| `data/world-110m.json` | 세계지도 (ISO alpha-3 코드가 주입된 TopoJSON) |
| `vendor/` | d3, topojson-client (로컬 번들 — 외부 CDN 의존 없음) |
| `tools/` | 로컬 서버, 로고 삽입, 지도 재생성, CSV 내보내기 스크립트 |

---

## 구글 시트로 데이터 관리하기

### 1. 시트 만들기

1. 구글 시트 새 문서를 만듭니다.
2. 하단 워크시트 탭을 아래 11개 이름으로 만듭니다. **이름이 정확히 일치해야 합니다.**

   `countries` · `timeline` · `bypass` · `efficacy_usage` · `efficacy_cards` ·
   `korea_stats` · `korea_bills` · `korea_usage` · `korea_polls` · `sources` · `meta`

3. 각 탭에서 **파일 › 가져오기 › 업로드**로 `sheets/` 폴더의 같은 이름 CSV를 넣고
   **현재 시트 바꾸기**를 선택합니다. 예시 데이터가 그대로 들어갑니다.

   > 브라우저에서 `tools/dump-sheets.html` 을 열면 CSV를 다시 내려받을 수 있습니다.

### 2. 공개 설정

**공유 › 일반 액세스 › 링크가 있는 모든 사용자 — 뷰어** 로 바꿉니다.
비공개 상태면 대시보드가 읽지 못합니다.

### 3. 연결

주소창에서 문서 ID를 복사합니다.

```
https://docs.google.com/spreadsheets/d/  ←여기가 문서 ID→  /edit
```

`js/config.js` 를 수정합니다.

```js
dataSource: 'sheets',              // 'sample' → 'sheets'
sheetId: '복사한_문서_ID',
```

저장하고 새로고침하면 헤더 배지가 **실시간 데이터**로 바뀝니다.
시트를 수정하면 최대 `cacheMinutes`(기본 10분) 뒤에 반영됩니다.
**즉시 확인하려면 주소 뒤에 `?refresh=1` 을 붙이세요** — 캐시를 무시하고 새로 읽습니다.
개발 중에는 `cacheMinutes: 0` 으로 두어도 됩니다.

> 탭에 엉뚱한 표를 넣으면 화면이 조용히 비어 보일 수 있습니다.
> 그럴 때는 브라우저 콘솔에 어느 탭에 어떤 열이 들어왔는지 경고가 찍히니 확인하세요.

시트를 읽지 못하면 자동으로 예시 데이터로 되돌아가고 배지에 **시트 연결 실패**가 표시됩니다
(`fallbackToSample: false` 로 끄면 오류 화면을 보여줍니다).

---

## 시트 열 구성

열 제목은 **영문 키** 또는 **한글 이름** 둘 다 인식합니다(`iso3` = `국가코드`, `status` = `추진 상황` 등).
열 순서는 상관없고, 빈 열은 비워 두면 됩니다.

### `countries` — 국가별 현황 (지도·비교표·연령 분포·팝업의 원본)

| 열 | 설명 |
|---|---|
| `iso3` | ISO 3166-1 alpha-3 국가코드. 지도와 연결하는 키 **(필수)** |
| `name` / `name_en` | 국가명(한글) / 영문명 |
| `continent` | 대륙. 팝업의 국가명 아래와 비교표·매트릭스에 사용 |
| `status` | `enforced` 시행 중 · `passed` 법 통과·시행 대기 · `bill` 입법 추진 중 · `debate` 논의·검토 · `none` 규제 없음<br>한글(`시행`, `통과`, `추진`, `논의`, `없음`)로 적어도 됩니다 |
| `status_note` | 추진 상황에 대한 한 줄 설명 |
| `summary` | **요약** — 팝업 맨 위에 리드로 표시되는 2~3문장. 항목을 읽기 전에 그림이 잡히도록 씁니다 |
| `age` | 최소 연령 기준(숫자만). 기준이 없으면 비워 둠 |
| `age_rule` | 구체적인 규제 내용 |
| `scope` | 대상 서비스. 세미콜론(`;`)으로 구분 — `Instagram; TikTok; YouTube` |
| `scope_note` | 대상 범위에 대한 부연(제외 대상 등) |
| `responsibility` | 책임 주체 |
| `enforcement` | 집행 수단 (감독기관·제재) |
| `usage_rate` | 현재 이용률(%). 숫자만 |
| `usage_group` / `usage_note` | 이용률의 대상 연령대 / 조사 출처 설명 |
| `effective_date` | 시행일 (`2025-12-10`). 미정이면 `미정` 등 자유 입력 |
| `updated` | **최종 확인 일자** (`2026-08-18`) |
| `lon` / `lat` | (선택) 지도에 폴리곤이 없는 소국의 좌표. 비워 두면 내장 좌표표를 사용 |
| `sources` | 출처. 한 줄에 하나씩, `제목 \| 발행처 \| URL` 형식.<br>셀 안 줄바꿈은 `Alt(Option)+Enter` |

### `timeline` — 확산 연표

| 열 | 설명 |
|---|---|
| `date` | `2025-12-10` 형식 |
| `iso3` | 국가코드. 채우면 항목 클릭 시 해당 국가 팝업이 열림. 국제기구 등은 비워 둠 |
| `country` | 표시할 이름 |
| `kind` | `enforce` 시행 · `pass` 통과 · `bill` 발의 · `debate` 논의 · `block` 제동 |
| `title` / `desc` | 제목 / 설명 |

`kind` 는 연표 항목의 색과 유형 필터에 쓰이며, **지도의 확산 재생**을 되돌리는 근거이기도 합니다.

지도 아래 재생 버튼을 누르면 첫 사건이 있는 달부터 현재까지 한 달씩 넘기며 색이 번지는 과정을 보여 줍니다.
각 시점의 국가 상태는 그때까지 쌓인 연표 사건 중 가장 앞선 단계로 계산합니다
(`enforce` > `pass` > `bill` > `debate`, `block` 은 `bill` 단계로 되돌림).
**연표에 사건이 없는 국가는 현재 상태 그대로 배경에 깔립니다.** 재생을 제대로 보여 주려면
주요 국가의 발의·통과·시행 시점을 `timeline` 시트에 채워 두세요.

### `bypass` — 우회 비율 (시행 중인 국가의 팝업 그래프 + 실효성 탭)

| 열 | 설명 |
|---|---|
| `iso3` | 국가코드 |
| `label` | 시점 (`2026-07`). 문자열 정렬 순서대로 그려지므로 `YYYY-MM` 을 권장 |
| `value` | 비율(%) 숫자만 |
| `metric` / `note` | 지표 이름 / 주석. **국가별 첫 행에만** 적으면 됩니다 |

> 그래프는 `countries` 의 `status` 가 `enforced` 인 국가의 팝업에만 나타납니다.
> 시점이 2개 이상 있어야 그려집니다.

### `efficacy_usage` — 시행 전후 이용률
`iso3`, `name`, `group`(대상 연령대), `before`, `after` — 숫자는 % 값.

### `efficacy_cards` — 집행 실적과 쟁점 카드
`title`, `big`(큰 숫자), `unit`(단위), `body`(본문), `meta`(기준 시점 등).

### `korea_stats` — 대한민국 탭 상단 숫자
`label`, `value`, `unit`, `color`.
`color` 는 CSS 변수명: `--st-enforced` `--st-passed` `--st-bill` `--st-debate` `--accent`.

### `korea_bills` — 발의 법안
`name`, `proposer`, `party`, `date`, `age`, `step`, `summary`, `url`.
`step` 은 진행 단계 번호(1부터). 단계 이름은 `meta` 시트의 `korea_steps` 로 바꿉니다.

### `sources` — 참고 자료 목록 (푸터 '출처 보기')

열은 **두 개**뿐입니다.

| 열 | 설명 |
|---|---|
| `title` | 자료 제목 |
| `url` | 주소 |

국가별 출처(`countries` 시트의 `sources` 열)와 **별개**입니다.
개별 국가에 매기 애매한 자료 — 국제기구 보고서, 통계 원자료, 배경 기사 등 — 를 여기에 한꺼번에 넣으면
푸터 **'출처 보기'** 팝업의 "전체 참고 자료"에 나열됩니다.
같은 팝업 아래쪽에는 `countries` 시트의 국가별 출처가 국가 단위로 묶여 함께 표시됩니다.

> 이 시트는 **없어도 됩니다.** 탭을 만들지 않으면 국가별 출처만 표시되고 나머지는 그대로 동작합니다.

### `korea_usage` / `korea_polls`
- `korea_usage`: `group`(연령대), `value`(%)
- `korea_polls`: `question`, `org`, `date`, `pro`, `con`, `neu` (합이 100이 아니어도 비율로 환산)

### `meta` — 문서 전역 설정 (`key` / `value` 두 열)

| key | 설명 |
|---|---|
| `updated` | 최종 갱신일. 하단 푸터에 표시 |
| `title` | 문서 제목 |
| `ai_note` | AI 활용 고지 문구. `<a href>` 링크 포함 가능 |
| `korea_steps` | 법안 진행 단계 이름. 세미콜론 구분 |

---

## 기사에 임베드하기

### 가장 빠른 방법

브라우저에서 **`embed.html`** 을 열면 넣을 형태를 고르고 붙여넣을 코드를 바로 받을 수 있습니다.
미리보기로 실제 모습과 높이도 확인됩니다.

### 코드 형태

```html
<iframe
  src="https://example.com/sns-dashboard/index.html?embed=1&tab=map"
  title="SNS 금지법 전 세계 추진 현황 — 토끼풀"
  height="820" loading="lazy" scrolling="no"
  style="width:100%;border:0;display:block"
  data-tokipul-embed></iframe>
<script src="https://example.com/sns-dashboard/embed-resizer.js" async></script>
```

`embed-resizer.js` 는 **페이지당 한 번만** 넣으면 그 안의 모든 임베드에 적용됩니다.
스크립트를 넣지 않으면 `height` 속성값으로 고정됩니다.

### 주소 파라미터

| 파라미터 | 값 | 설명 |
|---|---|---|
| `embed` | `1` | 임베드 모드 — 머리말·바닥글을 없애고 여백을 줄입니다 |
| `tab` | `map` `timeline` `table` `age` `efficacy` `korea` | 탭 하나만 표시(탭 막대 숨김) |
| `tabs` | `map,korea` | 고른 탭만 표시 |
| `country` | `AUS` | 국가 하나의 상세 카드만 표시 (**`embed=1` 과 함께** 써야 합니다) |
| `theme` | `light` `dark` | 테마 고정. 기본은 독자의 시스템 설정을 따름 |
| `credit` | `0` | 하단 출처·디스클레이머 막대 숨김 |

예시

```
index.html?embed=1                        전체 대시보드
index.html?embed=1&tab=map                지도만
index.html?embed=1&tabs=map,korea         지도 + 대한민국
index.html?embed=1&country=AUS            호주 상세 카드만
index.html?embed=1&tab=efficacy&theme=dark 실효성 탭, 어둡게 고정
```

> `embed=1` 없이 `index.html?country=AUS` 만 쓰면 임베드가 아니라
> **일반 대시보드에서 호주 팝업이 열린 상태**로 시작합니다. 공유 링크가 이 형태입니다.

### 동작 방식

- **높이 자동 조절** — 임베드가 내용 높이를 부모 페이지에 알리고, `embed-resizer.js` 가 iframe 높이를 맞춥니다. 탭을 바꾸면 높이도 따라 바뀝니다.
- **팝업 위치** — 기사가 길어 iframe이 화면에 다 보이지 않을 때, 부모 페이지가 "지금 보이는 구간"을 알려 주어 국가 팝업이 항상 독자 눈앞에 열립니다. 이 동작에도 `embed-resizer.js` 가 필요합니다.
- **출처 표시** — 임베드 하단에 디스클레이머와 전체 대시보드 링크가 자동으로 붙습니다(`credit=0` 으로 끌 수 있음).

### 확인해 둘 것

- 대시보드를 올린 서버가 **다른 도메인에서의 iframe 삽입을 막지 않아야** 합니다.
  `X-Frame-Options: DENY/SAMEORIGIN` 이나 `Content-Security-Policy: frame-ancestors` 헤더가 걸려 있으면 기사 페이지에서 보이지 않습니다.
- 기사 CMS가 `<script>` 를 지우는 경우에는 자동 높이 대신 고정 높이를 쓰세요
  (`embed.html` 에서 "내용에 맞게 자동 조절" 체크를 해제).
- `tools/article-test.html` 을 열면 실제 기사 페이지에 넣은 모습으로 동작을 시험해 볼 수 있습니다.

---

## SNS 공유

푸터 오른쪽과 국가 팝업 안에 공유 버튼이 있습니다.

| 버튼 | 동작 |
|---|---|
| X | `x.com/intent/post` 로 글 작성 창을 엽니다 |
| 페이스북 | `facebook.com/sharer` 공유 창을 엽니다 |
| 링크 복사 | 클립보드에 주소를 복사합니다 |
| 다른 앱으로 공유 | 기기의 공유 시트를 엽니다 — 카카오톡·메시지·라인 등이 여기로 처리됩니다 |

- **다른 앱으로 공유** 버튼은 `navigator.share` 를 지원하는 환경에서만 나타납니다.
  대체로 모바일 브라우저이며, **HTTPS(또는 localhost)** 여야 합니다. 데스크톱에서는 보이지 않습니다.
- 공유되는 주소에서는 임베드 파라미터(`embed`, `tab`, `theme` 등)가 모두 제거되어
  항상 정식 대시보드 주소가 나갑니다.
- 푸터 버튼은 **지금 보고 있는 탭**(`#korea` 등), 팝업 버튼은 **그 국가**(`?country=AUS`)를 가리킵니다.
- 카카오톡 전용 버튼(카카오 JavaScript SDK)이나 스레드 버튼이 필요하면
  `js/share.js` 의 `targets()` 에 항목을 추가하면 됩니다.

---

## 자주 하는 수정

**로고 교체** — `assets/logo.svg` 를 바꾼 뒤:

```bash
python3 tools/embed-logo.py
```

색상은 자동으로 `currentColor` 로 치환되어 라이트/다크 모드에 모두 대응합니다.
파비콘은 `assets/favicon.jpeg` 입니다.

**색·브랜드 컬러** — `css/style.css` 상단의 `:root` 토큰. `--accent` 가 토끼풀 그린입니다.
추진 단계 색은 `--st-enforced` → `--st-none` 순서형 램프이며, 다크 모드 값도 함께 수정해야 합니다.

**지도 투영·소국 표시** — `js/config.js` 의 `projection`(`naturalEarth1` / `equalEarth` / `mercator`)과
`smallCountryDivisor`(값을 키우면 점으로 표시되는 나라가 늘어남).

**기준 국가 강조** — `js/config.js` 의 `homeIso`(기본 `'KOR'`). 지도에서는 테두리와 이름표로,
연령별 분포에서는 블록 외곽선으로 항상 강조됩니다. `''` 로 두면 강조하지 않습니다.

**확산 재생 속도** — `js/config.js` 의 `playIntervalMs`(기본 220밀리초, 한 달당).

**추진 단계 구분 추가·변경** — `js/config.js` 의 `window.STATUS` 배열과 `css/style.css` 의 대응 토큰.

**캐시 무효화** — 파일을 고친 뒤 사용자 브라우저에 반영되지 않으면
`index.html` 의 `?v=1` 을 `?v=2` 로 올리세요.

---

## 참고

- 예시 데이터는 공개 자료를 바탕으로 구성했지만 **검증되지 않은 참고용**입니다.
  운영 전에 각 항목의 출처와 `updated`(최종 확인 일자)를 반드시 갱신하세요.
- 외부 CDN에 의존하지 않으므로 인터넷 없이도(구글 시트 연동 제외) 동작합니다.
