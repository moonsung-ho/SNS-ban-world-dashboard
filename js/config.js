/* ============================================================
   설정 파일 — 배포 시 이 파일만 수정하면 됩니다.
   ============================================================ */
window.APP_CONFIG = {

  /* ── 데이터 소스 ─────────────────────────────────────────
     'sample' : js/sample-data.js 의 예시 데이터를 사용 (개발용)
     'sheets' : 아래 구글 시트에서 실시간으로 읽어옴 (운영용)
     ──────────────────────────────────────────────────────── */
  dataSource: 'sample',

  /* 구글 시트 문서 ID
     https://docs.google.com/spreadsheets/d/ ★여기★ /edit
     시트는 "웹에 게시" 또는 "링크가 있는 모든 사용자 — 뷰어"로 공개해야 합니다. */
  sheetId: 'YOUR_GOOGLE_SHEET_ID_HERE',

  /* 워크시트(탭) 이름 — 구글 시트 하단 탭 이름과 정확히 일치해야 합니다.
     시트별 열 구성은 README.md 와 sheets/*.csv 템플릿을 참고하세요. */
  sheets: {
    countries:      'countries',        // 국가별 규제 현황 (지도·비교표·연령분포·팝업)
    timeline:       'timeline',         // 확산 연표
    bypass:         'bypass',           // 시행 국가의 우회 이용 비율 시계열
    efficacyUsage:  'efficacy_usage',   // 실효성 — 시행 전후 이용률
    efficacyCards:  'efficacy_cards',   // 실효성 — 집행 실적·쟁점 카드
    koreaStats:     'korea_stats',      // 대한민국 — 상단 숫자
    koreaBills:     'korea_bills',      // 대한민국 — 발의 법안
    koreaUsage:     'korea_usage',      // 대한민국 — 연령대별 이용률
    koreaPolls:     'korea_polls',      // 대한민국 — 여론조사
    koreaIssues:    'korea_issues',     // 대한민국 — 주요 쟁점
    meta:           'meta'              // 디스클레이머·최종 갱신일 등 (key/value)
  },

  /* [선택] 시트 이름 대신 "웹에 게시"로 만든 CSV 주소를 직접 지정할 수도 있습니다.
     지정하면 sheetId 보다 우선합니다. 키는 위 sheets 의 값(시트 이름)과 같아야 합니다.
  csvUrls: {
    countries: 'https://docs.google.com/spreadsheets/d/e/…/pub?gid=0&single=true&output=csv',
    …
  },
  */

  /* 시트 응답 캐시 시간(분). 0 이면 캐시하지 않음 */
  cacheMinutes: 10,

  /* 시트 로드 실패 시 예시 데이터로 자동 대체할지 여부 */
  fallbackToSample: true,

  /* 지도·연령 분포에서 항상 강조할 기준 국가(ISO alpha-3).
     빈 문자열('')로 두면 강조하지 않습니다. */
  homeIso: 'KOR',

  /* 기준 국가 이름표를 점에서 얼마나 떨어뜨릴지 [가로, 세로].
     지도 폭 1022px 기준값이며 화면 크기에 맞춰 비례 조정됩니다.
     가로 값이 음수면 왼쪽, 양수면 오른쪽에 붙습니다.
     기본값은 대한민국 기준으로 이웃 나라를 피해 남동쪽 바다에 놓이도록 잡았습니다. */
  homeLabelOffset: [22, 34],

  /* 지도 재생(확산 애니메이션) 한 칸당 시간(밀리초) */
  playIntervalMs: 220,

  /* 헤더의 "토끼풀 바로가기" 버튼이 가리킬 주소.
     빈 문자열('')로 두면 버튼이 표시되지 않습니다. */
  homeUrl: 'https://tokipul.net',

  /* 지도 파일 (ISO alpha-3 코드가 properties.iso3 에 주입되어 있음) */
  worldTopoJson: 'data/world-110m.json',

  /* 투영 방식: 'naturalEarth1' | 'equalEarth' | 'mercator' */
  projection: 'naturalEarth1',

  /* 지도 면적을 이 값으로 나눈 넓이보다 작은 국가는 점 마커로 보강 표시.
     값을 키우면 더 많은 나라가 점으로 표시됩니다. */
  smallCountryDivisor: 4500
};

/* ── 110m 세계지도에 폴리곤이 없는 소국의 좌표 [경도, 위도] ──
   시트의 countries 에 lon/lat 열을 채우면 그 값이 우선합니다. */
window.MICRO_CENTROIDS = {
  SGP:[103.82,1.35],  MLT:[14.44,35.9],   LUX:[6.13,49.61],  BHR:[50.58,26.07],
  AND:[1.52,42.51],   MCO:[7.42,43.74],   LIE:[9.55,47.17],  SMR:[12.46,43.94],
  MUS:[57.55,-20.35], MDV:[73.51,4.18],   BRB:[-59.54,13.19],SYC:[55.49,-4.68],
  HKG:[114.17,22.32], MAC:[113.55,22.2],  BHS:[-77.4,25.03], CPV:[-23.6,15.12],
  ISL:[-19.02,64.96], QAT:[51.18,25.35],  KWT:[47.48,29.31], LBN:[35.86,33.85],
  ISR:[34.85,31.05],  PSE:[35.23,31.95],  BRN:[114.73,4.54], TLS:[125.73,-8.87],
  FJI:[178.07,-17.71],TTO:[-61.22,10.69], JAM:[-77.3,18.11], PRI:[-66.59,18.22]
};

/* ── 추진 단계 정의 (순서형: 위 → 아래로 진행 정도가 커짐) ── */
window.STATUS = [
  { key:'enforced', label:'시행 중',        short:'시행',   varName:'--st-enforced', desc:'법률이 발효되어 실제로 집행되고 있음' },
  { key:'passed',   label:'법 통과·시행 대기', short:'통과',   varName:'--st-passed',   desc:'입법은 완료되었으나 시행일이 도래하지 않았거나 유예 중' },
  { key:'bill',     label:'입법 추진 중',     short:'추진',   varName:'--st-bill',     desc:'법안이 발의·심사 중이거나 정부가 공식 입법을 예고' },
  { key:'debate',   label:'논의·검토 단계',   short:'논의',   varName:'--st-debate',   desc:'정부·의회 차원의 검토, 권고, 공론화가 진행 중' },
  { key:'none',     label:'규제 없음',        short:'없음',   varName:'--st-none',     desc:'연령 기반 SNS 이용 제한 논의가 확인되지 않음' }
];

/* ── 연표 항목 유형 ── */
window.EVENT_KINDS = [
  { key:'enforce', label:'시행',   varName:'--st-enforced' },
  { key:'pass',    label:'통과',   varName:'--st-passed' },
  { key:'bill',    label:'발의',   varName:'--st-bill' },
  { key:'debate',  label:'논의',   varName:'--st-debate' },
  { key:'block',   label:'제동',   varName:'--st-none' }
];
