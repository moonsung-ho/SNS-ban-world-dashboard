/* ============================================================
   예시(샘플) 데이터
   ------------------------------------------------------------
   운영 환경에서는 js/config.js 의 dataSource 를 'sheets' 로 바꾸면
   이 파일 대신 구글 시트의 내용을 읽어옵니다.
   이 파일의 구조 = 구글 시트의 열 구성입니다. (README.md 참고)
   ============================================================ */
window.SAMPLE_DATA = {

  meta: {
    updated: '2026-08-20',
    title: 'SNS 금지법 전 세계 추진 현황',
    aiNote: '이 사이트는 AI를 활용해 제작했습니다. AI의 산출물은 전부 <a href="https://n.tokipul.net/aiprinciple" target="_blank" rel="noopener">〈토끼풀신문 AI 활용 준칙〉</a>에 따라 사람이 직접 검토하고 확인했습니다.'
  },

  /* ── 국가별 현황 ───────────────────────────────────────── */
  countries: [
    {
      iso3:'AUS', name:'호주', nameEn:'Australia', continent:'오세아니아',
      status:'enforced', statusNote:'세계 최초의 전면적 연령 하한 규제. 2025년 12월 10일부터 집행.',
      summary:'세계에서 처음으로 예외 없는 연령 하한을 실제로 집행한 나라입니다. 부모가 동의해도 16세 미만은 계정을 가질 수 없고, 책임은 전적으로 플랫폼에 있습니다. 시행 8개월이 지난 지금 대상 연령대의 이용률은 크게 떨어졌지만, 상당수가 우회 수단으로 이용을 이어가고 있다는 점이 최대 쟁점입니다.',
      age:16, ageRule:'16세 미만은 대상 플랫폼의 계정을 보유할 수 없음. 부모가 동의하더라도 예외를 인정하지 않는 절대적 하한 방식.',
      scope:['Facebook','Instagram','TikTok','Snapchat','YouTube','X','Threads','Reddit','Kick','Twitch'],
      scopeNote:'주 목적이 온라인 사회적 상호작용인 서비스. 메시징 앱(WhatsApp·메신저), 온라인 게임, 교육·보건 서비스, YouTube Kids 는 제외.',
      responsibility:'플랫폼 사업자. 미성년자 본인과 보호자에게는 어떠한 벌칙도 부과하지 않음.',
      enforcement:'eSafety Commissioner 의 감독. "합리적 조치(reasonable steps)" 의무 위반 시 최대 4,950만 호주달러의 민사 벌금. 연령 추정 기술·정부 ID·부모 확인 중 선택 적용.',
      usageRate:96, usageGroup:'14–15세', usageNote:'시행 직전 조사 기준, 대상 연령대의 SNS 계정 보유율',
      effectiveDate:'2025-12-10',
      updated:'2026-08-18',
      sources:[
        {title:'Online Safety Amendment (Social Media Minimum Age) Act 2024', publisher:'Federal Register of Legislation', url:'https://www.legislation.gov.au/C2024A00119/asmade/text'},
        {title:'Social media age restrictions — 시행 안내', publisher:'eSafety Commissioner', url:'https://www.esafety.gov.au/'}
      ]
    },
    {
      iso3:'CHN', name:'중국', nameEn:'China', continent:'아시아',
      status:'enforced', statusNote:'금지가 아닌 "미성년자 모드" 강제 방식. 단말·앱스토어·앱 3계층에 동시 의무 부과.',
      summary:'금지가 아니라 "미성년자 모드"를 강제하는 방식입니다. 단말기·앱스토어·앱 세 계층에 동시에 의무를 지워, 18세 미만 이용자에게 연령대별 이용 시간 상한과 심야 차단을 자동으로 적용합니다. 서방 국가들의 논의와 달리 계정 보유 자체는 막지 않습니다.',
      age:18, ageRule:'18세 미만 전원에게 미성년자 모드 적용. 연령대별 1일 이용 시간 상한(8세 미만 40분, 8–15세 1시간, 16–17세 2시간)과 22시–6시 이용 차단.',
      scope:['위챗','더우인(틱톡)','웨이보','샤오홍수','콰이서우','QQ','빌리빌리'],
      scopeNote:'스마트폰 운영체제, 앱스토어, 개별 앱 모두에 의무가 부과됨.',
      responsibility:'단말 제조사 · 앱스토어 운영자 · 플랫폼 사업자의 3중 책임. 보호자는 모드 설정 권한 보유.',
      enforcement:'국가인터넷정보판공실(CAC) 감독. 시정명령·서비스 중지·앱 배포 정지·과징금.',
      usageRate:97, usageGroup:'미성년자', usageNote:'미성년자 인터넷 이용률(중국인터넷네트워크정보센터 조사)',
      effectiveDate:'2024-11-01',
      updated:'2026-07-30',
      sources:[
        {title:'移动互联网未成年人模式建设指南', publisher:'国家互联网信息办公室', url:'https://www.cac.gov.cn/'}
      ]
    },
    {
      iso3:'VNM', name:'베트남', nameEn:'Viet Nam', continent:'아시아',
      status:'enforced', statusNote:'실명 인증을 축으로 한 규제. 16세 미만은 독립 계정을 가질 수 없음.',
      summary:'실명 인증을 축으로 삼은 규제입니다. 모든 이용자가 휴대전화나 신분번호로 본인을 확인해야 하고, 16세 미만은 독립된 계정을 가질 수 없어 보호자 명의로만 등록됩니다. 국내외 사업자를 가리지 않고 적용되는 점이 특징입니다.',
      age:16, ageRule:'모든 이용자는 휴대전화번호 또는 신분번호로 실명 인증해야 하며, 16세 미만은 보호자 명의로 계정을 등록하고 보호자가 이용 내역을 관리.',
      scope:['Facebook','TikTok','YouTube','Zalo','국내외 모든 SNS'],
      scopeNote:'베트남에서 서비스하는 국내외 모든 소셜네트워크. 온라인 게임은 별도로 1회 60분·1일 180분 제한.',
      responsibility:'플랫폼 사업자(국외 사업자 포함) 및 통신사업자.',
      enforcement:'정보통신부(MIC) 감독. 미이행 시 서비스 차단·접속 제한 및 행정 벌금.',
      usageRate:89, usageGroup:'13–17세', usageNote:'시행 전 청소년 SNS 이용률 추정',
      effectiveDate:'2024-12-25',
      updated:'2026-06-12',
      sources:[
        {title:'Nghị định 147/2024/NĐ-CP', publisher:'Chính phủ Việt Nam', url:'https://chinhphu.vn/'}
      ]
    },
    {
      iso3:'GBR', name:'영국', nameEn:'United Kingdom', continent:'유럽',
      status:'enforced', statusNote:'연령 하한 금지가 아니라 "고신뢰 연령 확인" 의무. 별도의 16세 미만 금지법은 검토 단계.',
      summary:'연령 하한을 두는 대신 "고신뢰 연령 확인"을 의무화한 사례입니다. SNS 계정 개설 자체를 막지는 않고, 유해 콘텐츠에 미성년자가 닿지 못하게 하는 데 초점을 맞췄습니다. 시행 직후 VPN 다운로드가 급증하면서 연령 확인의 실효성 논쟁이 본격화됐습니다.',
      age:18, ageRule:'포르노·자해·자살 등 유해 콘텐츠를 제공하는 서비스는 18세 미만 접근을 차단하기 위한 고신뢰 연령 확인(HEAA)을 의무 적용. SNS 계정 개설 자체는 통상 13세 이상.',
      scope:['Instagram','TikTok','X','Reddit','성인 콘텐츠 사이트','검색 서비스'],
      scopeNote:'영국 이용자에게 서비스하는 모든 이용자 대상 서비스 및 검색 서비스.',
      responsibility:'플랫폼 사업자. 고위 경영진 개인 책임 조항 포함.',
      enforcement:'Ofcom 감독. 전 세계 매출의 10% 또는 1,800만 파운드 중 큰 금액을 과징금으로 부과, 중대 위반 시 접속 차단 명령.',
      usageRate:93, usageGroup:'12–15세', usageNote:'Ofcom 아동 미디어 이용 조사',
      effectiveDate:'2025-07-25',
      updated:'2026-08-05',
      sources:[
        {title:'Online Safety Act 2023', publisher:'legislation.gov.uk', url:'https://www.legislation.gov.uk/ukpga/2023/50/contents'},
        {title:'Protection of Children Codes of Practice', publisher:'Ofcom', url:'https://www.ofcom.org.uk/online-safety/'}
      ]
    },
    {
      iso3:'BRA', name:'브라질', nameEn:'Brazil', continent:'남아메리카',
      status:'enforced', statusNote:'"디지털 아동청소년법(ECA Digital)" 시행. 남미 최초의 포괄 규제.',
      summary:'남미에서 처음으로 포괄 규제를 시행한 나라입니다. 16세 미만 계정을 보호자 계정과 연동하도록 하고, 생년월일 자기 신고만으로는 연령 확인을 인정하지 않습니다. 플랫폼뿐 아니라 앱스토어에도 의무를 지운 점이 다른 나라와 다릅니다.',
      age:16, ageRule:'16세 미만 이용자의 계정은 보호자 계정과 연동해야 하며, 모든 플랫폼은 신뢰할 수 있는 방식으로 연령을 확인해야 함. 자체 신고식 생년월일 입력만으로는 불충분.',
      scope:['Instagram','TikTok','YouTube','Roblox','온라인 게임','앱스토어'],
      scopeNote:'미성년자가 접근 가능한 모든 디지털 서비스와 앱스토어.',
      responsibility:'플랫폼 사업자 및 앱스토어. 브라질 내 법적 대리인 지정 의무.',
      enforcement:'ANPD(국가데이터보호원) 감독. 매출의 최대 10%, 건당 최대 5,000만 헤알 과징금, 반복 위반 시 서비스 정지.',
      usageRate:91, usageGroup:'13–17세', usageNote:'시행 전 청소년 SNS 이용률',
      effectiveDate:'2026-03-17',
      updated:'2026-08-14',
      sources:[
        {title:'Lei nº 15.211/2025 (ECA Digital)', publisher:'Planalto', url:'https://www.planalto.gov.br/'}
      ]
    },
    {
      iso3:'IDN', name:'인도네시아', nameEn:'Indonesia', continent:'아시아',
      status:'enforced', statusNote:'PP 17/2025 시행 중이나 2년의 전환기(2027년 3월까지) 적용.',
      summary:'연령을 단계로 나눠 차등 규제하는 방식을 택했습니다. 13세 미만·13~15세·16~17세에 각각 다른 수준의 동의 요건을 적용합니다. 다만 2년의 전환기를 두어 실제 집행은 아직 느슨한 편이고, 그만큼 우회율도 높게 나타납니다.',
      age:16, ageRule:'연령 단계별 차등: 13세 미만은 부모 동의 하에 제한적 이용, 13–15세는 부모 동의 필요, 16–17세는 위험도가 높은 서비스에 한해 동의 필요.',
      scope:['Instagram','TikTok','Facebook','YouTube','온라인 게임'],
      scopeNote:'미성년자가 이용할 수 있는 모든 전자시스템 사업자.',
      responsibility:'플랫폼 사업자. 연령 확인 및 위험 평가 의무.',
      enforcement:'통신디지털부(Komdigi) 감독. 경고·행정 벌금·서비스 접속 차단 단계적 제재.',
      usageRate:87, usageGroup:'13–17세', usageNote:'인도네시아 인터넷서비스제공자협회 조사',
      effectiveDate:'2025-03-28',
      updated:'2026-05-22',
      sources:[
        {title:'Peraturan Pemerintah No. 17 Tahun 2025', publisher:'Kementerian Komdigi', url:'https://www.komdigi.go.id/'}
      ]
    },

    {
      iso3:'DNK', name:'덴마크', nameEn:'Denmark', continent:'유럽',
      status:'passed', statusNote:'2025년 11월 여야 합의를 거쳐 법률 제정. 시행 준비 중.',
      summary:'유럽에서 가장 먼저 법제화까지 간 나라입니다. 15세 미만을 원칙적으로 막되 보호자가 명시적으로 동의하면 13세부터 허용하는 이중 구조를 택해, 호주식 절대 금지와 프랑스식 동의제의 중간에 서 있습니다. 국가 전자신분증을 연령 확인 표준으로 삼는 점도 특징입니다.',
      age:15, ageRule:'15세 미만 계정 개설 금지. 다만 보호자가 명시적으로 동의하는 경우 13세부터 예외적으로 허용하는 이중 구조.',
      scope:['TikTok','Snapchat','Instagram','YouTube'],
      scopeNote:'알고리즘 추천 기반 소셜미디어를 우선 대상으로 하며, 구체적 목록은 시행령으로 지정.',
      responsibility:'플랫폼 사업자. 국가 전자신분증(MitID) 연계 연령 확인을 표준으로 채택.',
      enforcement:'디지털청 감독. 과징금 및 시정명령. EU 기술규제 통보 절차 통과 필요.',
      usageRate:94, usageGroup:'13–15세', usageNote:'덴마크 통계청 아동 미디어 이용 조사',
      effectiveDate:'2026-09-01',
      updated:'2026-08-10',
      sources:[
        {title:'Aftale om aldersgrænse på sociale medier', publisher:'Regeringen', url:'https://www.regeringen.dk/'}
      ]
    },
    {
      iso3:'MYS', name:'말레이시아', nameEn:'Malaysia', continent:'아시아',
      status:'enforced', statusNote:'2026년 1월 1일부터 16세 미만 신규 계정 개설 금지 시행.',
      summary:'라이선스 제도를 지렛대로 삼았습니다. 소셜미디어 사업 허가 조건으로 16세 미만 신규 계정 금지와 eKYC 연령 확인을 부과해, 별도 입법 없이 빠르게 시행에 들어갔습니다. 기존 계정 정리는 단계적으로 진행 중입니다.',
      age:16, ageRule:'16세 미만은 신규 계정 개설 불가. 기존 계정은 단계적으로 정리하며, 플랫폼은 eKYC 방식의 연령 확인을 적용해야 함.',
      scope:['Facebook','Instagram','TikTok','X','Telegram'],
      scopeNote:'말레이시아 통신멀티미디어위원회(MCMC) 라이선스를 받은 소셜미디어 서비스.',
      responsibility:'플랫폼 사업자. 라이선스 조건으로 의무 부과.',
      enforcement:'MCMC 감독. 라이선스 정지·취소, 벌금 및 서비스 차단.',
      usageRate:88, usageGroup:'13–17세', usageNote:'시행 전 조사 기준',
      effectiveDate:'2026-01-01',
      updated:'2026-08-02',
      sources:[
        {title:'Social media licensing framework', publisher:'MCMC', url:'https://www.mcmc.gov.my/'}
      ]
    },
    {
      iso3:'FRA', name:'프랑스', nameEn:'France', continent:'유럽',
      status:'passed', statusNote:'2023년 법률이 제정되었으나 EU 통보 절차 문제로 사실상 미시행. 15세 미만 전면 금지로 강화하는 논의가 진행 중.',
      summary:'2023년에 법을 만들고도 3년째 시행하지 못하고 있는 사례입니다. EU 회원국은 기술 규제를 도입하기 전 집행위원회에 통보해야 하는데 그 절차가 끝나지 않았습니다. 국내법만으로는 규제를 시작할 수 없다는 점을 보여 주는 대표적 사례로 인용됩니다.',
      age:15, ageRule:'15세 미만은 보호자 동의 없이 계정을 개설할 수 없으며, 플랫폼은 연령과 보호자 동의를 확인할 기술적 수단을 갖추어야 함.',
      scope:['Instagram','TikTok','Snapchat','YouTube'],
      scopeNote:'디지털 플랫폼 전반. 세부 목록은 시행령 미비로 확정되지 않음.',
      responsibility:'플랫폼 사업자.',
      enforcement:'ARCOM 감독. 전 세계 매출의 최대 1% 과징금. 다만 EU 집행위 통보 절차 미완료로 집행이 보류된 상태.',
      usageRate:92, usageGroup:'11–14세', usageNote:'ARCOM/Médiamétrie 조사',
      effectiveDate:'미정',
      updated:'2026-07-18',
      sources:[
        {title:'LOI n° 2023-566 visant à instaurer une majorité numérique', publisher:'Légifrance', url:'https://www.legifrance.gouv.fr/'}
      ]
    },
    {
      iso3:'NZL', name:'뉴질랜드', nameEn:'New Zealand', continent:'오세아니아',
      status:'passed', statusNote:'호주 모델을 참고한 법안이 의회를 통과, 시행 준비 단계.',
      summary:'호주 모델을 거의 그대로 참고해 16세 미만 금지 법안을 통과시켰습니다. 이웃 나라의 시행 경험을 지켜본 뒤 움직였다는 점에서, 호주 사례가 실제로 다른 나라의 입법을 끌어당겼음을 보여 줍니다.',
      age:16, ageRule:'16세 미만 계정 개설 금지. 플랫폼에 연령 확인 의무 부과.',
      scope:['Facebook','Instagram','TikTok','Snapchat','X'],
      scopeNote:'주 목적이 사회적 상호작용인 플랫폼. 메시징·게임 제외.',
      responsibility:'플랫폼 사업자.',
      enforcement:'내무부 산하 규제기관 감독. 과징금 및 시정명령.',
      usageRate:90, usageGroup:'13–15세', usageNote:'Netsafe 조사 추정',
      effectiveDate:'2026-12-01',
      updated:'2026-08-08',
      sources:[
        {title:'Social Media (Age-Restricted Users) Bill', publisher:'New Zealand Parliament', url:'https://www.parliament.nz/'}
      ]
    },

    {
      iso3:'USA', name:'미국', nameEn:'United States', continent:'북아메리카',
      status:'bill', statusNote:'연방 차원의 통일 규제는 없음. 여러 주가 개별 법률을 제정했으나 상당수가 위헌 소송으로 집행이 정지됨.',
      summary:'연방 차원의 통일 규제가 없고 주별로 제각각입니다. 여러 주가 법을 만들었지만 표현의 자유를 이유로 상당수가 법원에서 집행이 정지됐습니다. 규제 자체보다 "어디까지가 위헌인가"가 핵심 쟁점이 된 나라입니다.',
      age:14, ageRule:'주별로 상이. 플로리다는 14세 미만 금지·14–15세 보호자 동의, 유타·텍사스·아칸소는 미성년자 계정에 보호자 동의를 요구. 연방 KOSA는 상원 통과 후 하원 계류.',
      scope:['Instagram','TikTok','Snapchat','YouTube','X'],
      scopeNote:'주법마다 대상 정의가 다름. 표현의 자유(수정헌법 제1조) 쟁점으로 범위가 축소되는 경향.',
      responsibility:'플랫폼 사업자. 일부 주법은 앱스토어에 연령 확인 의무를 부과.',
      enforcement:'주 법무장관의 집행 및 민사소송. NetChoice 등 업계 단체의 가처분 신청으로 다수 주에서 집행 정지.',
      usageRate:95, usageGroup:'13–17세', usageNote:'Pew Research Center 청소년 조사',
      effectiveDate:'주별 상이',
      updated:'2026-08-16',
      sources:[
        {title:'HB 3 — Online Protections for Minors', publisher:'Florida Senate', url:'https://www.flsenate.gov/'},
        {title:'Kids Online Safety Act (S.1409)', publisher:'Congress.gov', url:'https://www.congress.gov/'}
      ]
    },
    {
      iso3:'ESP', name:'스페인', nameEn:'Spain', continent:'유럽',
      status:'bill', statusNote:'미성년자 디지털 환경 보호법안이 의회 심의 중.',
      summary:'계정 개설 최소 연령을 14세에서 16세로 올리고 국가 연령 확인 시스템 도입을 의무화하는 법안이 하원 심의 중입니다. EU 차원의 공동 기준 논의와 보조를 맞추는 모양새입니다.',
      age:16, ageRule:'계정 개설 최소 연령을 14세에서 16세로 상향하고, 연령 확인 시스템(Cartera Digital) 도입을 의무화하는 내용.',
      scope:['Instagram','TikTok','YouTube','성인 콘텐츠 사이트'],
      scopeNote:'소셜미디어 및 성인 콘텐츠 서비스.',
      responsibility:'플랫폼 사업자.',
      enforcement:'AEPD(데이터보호청) 및 신설 디지털 규제기관. 과징금 체계 설계 중.',
      usageRate:89, usageGroup:'12–15세', usageNote:'INE 조사',
      effectiveDate:'미정',
      updated:'2026-07-25',
      sources:[
        {title:'Proyecto de Ley de protección de menores en entornos digitales', publisher:'Congreso de los Diputados', url:'https://www.congreso.es/'}
      ]
    },
    {
      iso3:'NOR', name:'노르웨이', nameEn:'Norway', continent:'유럽',
      status:'bill', statusNote:'정부가 15세 연령 하한 법제화를 공식 예고, 법안 제출 단계.',
      summary:'개인정보 처리 동의가 가능한 연령을 13세에서 15세로 올려 사실상의 연령 하한을 만드는 방식입니다. 새 규제를 신설하기보다 기존 개인정보법의 나이 기준을 조정하는 접근이라는 점이 다릅니다.',
      age:15, ageRule:'현행 13세인 개인정보 처리 동의 연령을 15세로 상향하고, 절대적 하한선으로 운영하는 방안.',
      scope:['TikTok','Snapchat','Instagram'],
      scopeNote:'구체적 목록은 법안 확정 시 결정.',
      responsibility:'플랫폼 사업자.',
      enforcement:'Datatilsynet(데이터보호청) 감독. 연령 확인 국가 표준 개발 중.',
      usageRate:91, usageGroup:'13–14세', usageNote:'Medietilsynet 아동·미디어 조사',
      effectiveDate:'미정',
      updated:'2026-06-30',
      sources:[
        {title:'Aldersgrense for sosiale medier', publisher:'Regjeringen.no', url:'https://www.regjeringen.no/'}
      ]
    },
    {
      iso3:'IND', name:'인도', nameEn:'India', continent:'아시아',
      status:'bill', statusNote:'DPDP 규칙 공표. 18개월의 이행 유예 기간 중.',
      summary:'SNS를 겨냥한 별도 법이 아니라 개인정보보호 일반법으로 접근합니다. 18세 미만 전원을 "아동"으로 보고 검증 가능한 보호자 동의를 요구하며, 아동 대상 맞춤형 광고와 행동 추적을 금지합니다. 적용 대상이 가장 넓은 편입니다.',
      age:18, ageRule:'18세 미만은 "아동"으로 분류되어 개인정보 처리에 검증 가능한 보호자 동의가 필수. 아동 대상 맞춤형 광고와 행동 추적 금지.',
      scope:['Instagram','WhatsApp','YouTube','모든 데이터 처리 사업자'],
      scopeNote:'개인정보를 처리하는 모든 사업자에 적용되는 일반법 방식.',
      responsibility:'데이터 처리 사업자(Data Fiduciary).',
      enforcement:'데이터보호위원회. 최대 250억 루피 과징금.',
      usageRate:83, usageGroup:'13–17세', usageNote:'IAMAI 조사 추정',
      effectiveDate:'2027-05-14',
      updated:'2026-07-11',
      sources:[
        {title:'Digital Personal Data Protection Rules, 2025', publisher:'MeitY', url:'https://www.meity.gov.in/'}
      ]
    },
    {
      iso3:'SGP', name:'싱가포르', nameEn:'Singapore', continent:'아시아',
      status:'bill', statusNote:'총리가 16세 미만 계정 제한 방침을 발표, 구체적 제도 설계 중.',
      summary:'총리가 직접 16세 미만 계정 제한 방침을 밝히면서 논의가 시작됐습니다. 연령 확인 기술이 실제로 작동하는지를 먼저 검증한 뒤 제도를 확정하겠다는 신중한 순서를 택하고 있습니다.',
      age:16, ageRule:'16세 미만의 SNS 계정 보유를 제한하는 방향. 연령 확인 기술의 실효성 검증 후 확정 예정.',
      scope:['Instagram','TikTok','Facebook','Snapchat'],
      scopeNote:'지정 소셜미디어 서비스.',
      responsibility:'플랫폼 사업자.',
      enforcement:'IMDA 감독. 온라인안전법 체계 내에서 지시·과징금.',
      usageRate:92, usageGroup:'13–15세', usageNote:'IMDA 조사 추정',
      effectiveDate:'미정',
      updated:'2026-08-01',
      sources:[
        {title:'Online Safety (Relief and Accountability) 관련 발표', publisher:'IMDA', url:'https://www.imda.gov.sg/'}
      ]
    },
    {
      iso3:'KOR', name:'대한민국', nameEn:'Republic of Korea', continent:'아시아',
      status:'bill', statusNote:'복수의 법안이 국회에 발의되어 있으나 소관 상임위 심사 단계에 머물러 있음.',
      summary:'복수의 법안이 국회에 올라와 있지만 연령 기준도, 규제 방식도 아직 하나로 모이지 않았습니다. 16세 미만 이용 제한, 14세 미만 보호자 동의, 심야 시간 차단 등 서로 다른 접근이 병존합니다. 여론조사에서 성인과 청소년의 찬반이 정반대로 나타나는 점이 특히 어려운 대목입니다.',
      age:16, ageRule:'발의안별로 상이. 16세 미만 이용 제한, 14세 미만 계정 개설 시 보호자 동의, 심야 시간 이용 제한 등 서로 다른 방식이 병존.',
      scope:['인스타그램','틱톡','유튜브','카카오톡 오픈채팅'],
      scopeNote:'법안별로 "정보통신서비스 제공자" 또는 "부가통신사업자"로 정의가 다름.',
      responsibility:'플랫폼 사업자. 일부 법안은 보호자 확인 의무를 병행.',
      enforcement:'방송통신위원회 및 개인정보보호위원회 감독안이 병존. 과징금 수준 미확정.',
      usageRate:82, usageGroup:'초4–고3', usageNote:'스마트폰 과의존 실태조사 기준 SNS 주 1회 이상 이용률',
      effectiveDate:'미정',
      updated:'2026-08-20',
      sources:[
        {title:'정보통신망 이용촉진 및 정보보호 등에 관한 법률 일부개정법률안', publisher:'국회 의안정보시스템', url:'https://likms.assembly.go.kr/bill/main.do'}
      ]
    },
    {
      iso3:'TUR', name:'튀르키예', nameEn:'Türkiye', continent:'아시아',
      status:'bill', statusNote:'정부가 16세 미만 이용 제한 법안을 예고.',
      summary:'16세 미만 이용 제한 법안을 정부가 예고했습니다. 기존에 갖춰 둔 접속 차단·대역폭 제한 수단을 그대로 집행에 쓸 수 있다는 점에서 다른 나라와 성격이 다릅니다.',
      age:16, ageRule:'16세 미만의 SNS 계정 개설을 제한하고 국가 인증 체계와 연동하는 방안.',
      scope:['Instagram','TikTok','X','YouTube'],
      scopeNote:'튀르키예 내 이용자 수가 일정 규모를 넘는 플랫폼.',
      responsibility:'플랫폼 사업자. 국내 대리인 지정 의무 병행.',
      enforcement:'정보통신기술청(BTK) 감독. 대역폭 축소·접속 차단 등 기존 수단 활용.',
      usageRate:86, usageGroup:'13–17세', usageNote:'TÜİK 조사 추정',
      effectiveDate:'미정',
      updated:'2026-06-19',
      sources:[
        {title:'Sosyal medya yaş sınırı düzenlemesi', publisher:'BTK', url:'https://www.btk.gov.tr/'}
      ]
    },
    {
      iso3:'PHL', name:'필리핀', nameEn:'Philippines', continent:'아시아',
      status:'bill', statusNote:'상·하원에 각각 연령 제한 법안이 발의됨.',
      summary:'상·하원에 각각 다른 방식의 법안이 올라와 있습니다. 16세 미만 전면 금지안과 보호자 동의 의무화안이 병존해, 심사 과정에서 조정이 필요한 상태입니다.',
      age:16, ageRule:'16세 미만 계정 개설 금지 또는 보호자 동의 의무화 두 방안이 병존.',
      scope:['Facebook','TikTok','Instagram'],
      scopeNote:'법안 심사 과정에서 조정 예정.',
      responsibility:'플랫폼 사업자.',
      enforcement:'DICT 및 국가프라이버시위원회 감독안.',
      usageRate:93, usageGroup:'13–17세', usageNote:'조사기관 추정',
      effectiveDate:'미정',
      updated:'2026-05-14',
      sources:[
        {title:'Senate Bill — Social Media Age Verification', publisher:'Senate of the Philippines', url:'https://www.senate.gov.ph/'}
      ]
    },

    {
      iso3:'ITA', name:'이탈리아', nameEn:'Italy', continent:'유럽',
      status:'debate', statusNote:'15세 미만 금지 법안이 발의되었으나 심사가 진전되지 않음.',
      summary:'15세 미만 금지 법안이 제출됐지만 심사가 진전되지 않고 있습니다. EU 차원의 공동 기준이 정해지기를 기다리는 분위기입니다.',
      age:15, ageRule:'15세 미만 계정 개설 금지안이 제출된 상태.',
      scope:['Instagram','TikTok'], scopeNote:'논의 단계.',
      responsibility:'플랫폼 사업자(안).',
      enforcement:'AGCOM 감독안. 확정된 제재 수단 없음.',
      usageRate:88, usageGroup:'11–14세', usageNote:'ISTAT 조사',
      effectiveDate:'미정', updated:'2026-04-28',
      sources:[{title:'Camera dei Deputati 법안 심사 현황', publisher:'Camera dei Deputati', url:'https://www.camera.it/'}]
    },
    {
      iso3:'GRC', name:'그리스', nameEn:'Greece', continent:'유럽',
      status:'debate', statusNote:'EU 차원의 공동 연령 기준 도입을 주도. 자체적으로는 Kids Wallet 앱을 배포.',
      summary:'국가가 직접 금지하는 대신 보호자 통제 앱을 무상 배포하는 쪽을 택했습니다. 동시에 EU 차원의 공동 연령 기준 도입을 가장 적극적으로 밀고 있는 나라이기도 합니다.',
      age:16, ageRule:'국가 차원의 금지 대신 보호자 통제 앱(Kids Wallet)을 무상 배포하고, EU 공동 기준 도입을 추진.',
      scope:['Instagram','TikTok','YouTube'], scopeNote:'보호자 통제 앱 연동 대상.',
      responsibility:'보호자 및 국가(앱 제공).',
      enforcement:'현재 강제 수단 없음.',
      usageRate:87, usageGroup:'12–15세', usageNote:'조사기관 추정',
      effectiveDate:'미정', updated:'2026-05-06',
      sources:[{title:'Kids Wallet', publisher:'gov.gr', url:'https://www.gov.gr/'}]
    },
    {
      iso3:'IRL', name:'아일랜드', nameEn:'Ireland', continent:'유럽',
      status:'debate', statusNote:'온라인안전규정(Online Safety Code) 중심. 연령 하한 도입은 검토 단계.',
      summary:'주요 플랫폼의 유럽 본부가 몰려 있는 나라답게, 연령 하한보다 온라인안전규정을 통한 플랫폼 의무 부과에 무게를 둡니다. 이 나라의 규제가 유럽 전체에 미치는 영향이 큽니다.',
      age:null, ageRule:'별도의 연령 하한을 두지 않고, 동영상 공유 플랫폼에 연령 확인 의무를 부과하는 방식.',
      scope:['YouTube','TikTok','Instagram'], scopeNote:'아일랜드에 유럽 본부를 둔 주요 플랫폼.',
      responsibility:'플랫폼 사업자.',
      enforcement:'Coimisiún na Meán 감독. 매출 10% 과징금.',
      usageRate:90, usageGroup:'13–15세', usageNote:'CyberSafeKids 조사',
      effectiveDate:'미정', updated:'2026-06-03',
      sources:[{title:'Online Safety Code', publisher:'Coimisiún na Meán', url:'https://www.cnam.ie/'}]
    },
    {
      iso3:'NLD', name:'네덜란드', nameEn:'Netherlands', continent:'유럽',
      status:'debate', statusNote:'법적 금지 대신 정부 권고 방식을 채택.',
      summary:'법으로 금지하지 않고 정부 권고로 대응합니다. 15세 미만에게는 SNS를 권하지 않는다는 가이드라인을 냈을 뿐 구속력은 없습니다. 학교 내 휴대전화 금지는 별도로 시행 중입니다.',
      age:15, ageRule:'15세 미만에게는 SNS 이용을 권하지 않는다는 정부 가이드라인. 법적 구속력은 없음.',
      scope:['Instagram','TikTok','Snapchat'], scopeNote:'권고 대상.',
      responsibility:'보호자 및 학교.',
      enforcement:'강제 수단 없음. 학교 내 휴대전화 금지는 별도로 시행 중.',
      usageRate:93, usageGroup:'12–15세', usageNote:'CBS 조사',
      effectiveDate:'해당 없음', updated:'2026-04-16',
      sources:[{title:'Richtlijn schermgebruik jeugd', publisher:'Rijksoverheid', url:'https://www.rijksoverheid.nl/'}]
    },
    {
      iso3:'DEU', name:'독일', nameEn:'Germany', continent:'유럽',
      status:'debate', statusNote:'연방정부가 전문가위원회를 구성해 연령 하한 도입 여부를 검토 중.',
      summary:'연방정부가 전문가위원회를 꾸려 연령 하한 도입 여부를 검토하는 단계입니다. 현행 개인정보 동의 연령이 16세라 이미 사실상의 기준이 있다는 점이 논의를 복잡하게 만듭니다.',
      age:null, ageRule:'현행은 개인정보 동의 연령 16세(보호자 동의 시 하향 가능). 별도의 SNS 금지 규정은 없음.',
      scope:['Instagram','TikTok'], scopeNote:'검토 단계.',
      responsibility:'플랫폼 사업자(검토).',
      enforcement:'청소년보호법 및 DSA 체계 활용안.',
      usageRate:89, usageGroup:'12–15세', usageNote:'JIM-Studie',
      effectiveDate:'미정', updated:'2026-07-02',
      sources:[{title:'Expertenkommission Jugendschutz Digital', publisher:'BMFSFJ', url:'https://www.bmfsfj.de/'}]
    },
    {
      iso3:'BEL', name:'벨기에', nameEn:'Belgium', continent:'유럽',
      status:'debate', statusNote:'연방의회에서 연령 하한 도입 논의가 시작됨.',
      summary:'연방의회에서 15세 미만 제한을 두고 논의가 시작됐습니다. 아직 구체적인 법안 형태는 아닙니다.',
      age:15, ageRule:'15세 미만 제한안이 논의 중.', scope:['Instagram','TikTok'], scopeNote:'논의 단계.',
      responsibility:'미정.', enforcement:'미정.',
      usageRate:90, usageGroup:'12–15세', usageNote:'조사기관 추정',
      effectiveDate:'미정', updated:'2026-03-20',
      sources:[{title:'La Chambre 논의 현황', publisher:'La Chambre', url:'https://www.lachambre.be/'}]
    },
    {
      iso3:'SWE', name:'스웨덴', nameEn:'Sweden', continent:'유럽',
      status:'debate', statusNote:'공중보건청 권고를 근거로 한 논의 단계.',
      summary:'공중보건청이 연령대별 화면 이용 시간 권고를 낸 것이 논의의 출발점입니다. 법적 금지보다 보건 관점의 권고로 접근하고 있습니다.',
      age:13, ageRule:'공중보건청이 연령대별 화면 이용 시간 권고를 발표. 법적 금지는 없음.',
      scope:['TikTok','Instagram'], scopeNote:'권고 대상.',
      responsibility:'보호자.', enforcement:'강제 수단 없음.',
      usageRate:95, usageGroup:'13–16세', usageNote:'Statens medieråd 조사',
      effectiveDate:'해당 없음', updated:'2026-02-27',
      sources:[{title:'Rekommendationer om skärmtid', publisher:'Folkhälsomyndigheten', url:'https://www.folkhalsomyndigheten.se/'}]
    },
    {
      iso3:'POL', name:'폴란드', nameEn:'Poland', continent:'유럽',
      status:'debate', statusNote:'디지털부가 연령 확인 의무 도입을 검토.',
      summary:'소셜미디어 연령 하한보다 성인 콘텐츠 접근 차단을 위한 연령 확인 의무화가 먼저 검토되고 있습니다.',
      age:null, ageRule:'성인 콘텐츠 접근 차단을 위한 연령 확인 의무화가 우선 검토 대상.',
      scope:['성인 콘텐츠 사이트','소셜미디어'], scopeNote:'검토 단계.',
      responsibility:'플랫폼 사업자(안).', enforcement:'미정.',
      usageRate:88, usageGroup:'12–15세', usageNote:'NASK 조사',
      effectiveDate:'미정', updated:'2026-05-30',
      sources:[{title:'Ochrona małoletnich w internecie', publisher:'Ministerstwo Cyfryzacji', url:'https://www.gov.pl/web/cyfryzacja'}]
    },
    {
      iso3:'PRT', name:'포르투갈', nameEn:'Portugal', continent:'유럽',
      status:'debate', statusNote:'학교 내 휴대전화 사용 제한을 우선 시행하고, SNS 연령 하한은 논의 중.',
      summary:'학교 안 휴대전화 사용 금지를 먼저 시행하고, SNS 연령 하한은 그다음 과제로 두었습니다. 규제의 출발점을 교육 현장에서 잡은 사례입니다.',
      age:null, ageRule:'초·중등 학교 내 휴대전화 사용 금지가 먼저 시행됨.',
      scope:['학교 내 휴대전화'], scopeNote:'교육 현장 중심.',
      responsibility:'학교.', enforcement:'교육부 지침.',
      usageRate:87, usageGroup:'12–15세', usageNote:'조사기관 추정',
      effectiveDate:'2025-09-01', updated:'2026-03-11',
      sources:[{title:'Proibição de telemóveis nas escolas', publisher:'Ministério da Educação', url:'https://www.portugal.gov.pt/'}]
    },
    {
      iso3:'CAN', name:'캐나다', nameEn:'Canada', continent:'북아메리카',
      status:'debate', statusNote:'온라인위해법(Online Harms Act)이 회기 종료로 폐기된 뒤 재입법 논의 중.',
      summary:'온라인위해법이 회기 종료로 폐기된 뒤 다시 논의가 시작됐습니다. 폐기된 법안에도 연령 하한 규정은 없었고, 플랫폼의 안전 설계 의무가 중심이었습니다.',
      age:null, ageRule:'연령 하한 규정은 포함되지 않았고, 플랫폼의 안전 설계 의무가 중심.',
      scope:['소셜미디어 전반'], scopeNote:'재입법 논의 단계.',
      responsibility:'플랫폼 사업자(안).', enforcement:'신설 디지털안전위원회(안).',
      usageRate:91, usageGroup:'13–17세', usageNote:'MediaSmarts 조사',
      effectiveDate:'미정', updated:'2026-04-09',
      sources:[{title:'Online Harms Act (C-63)', publisher:'Parliament of Canada', url:'https://www.parl.ca/'}]
    },
    {
      iso3:'JPN', name:'일본', nameEn:'Japan', continent:'아시아',
      status:'debate', statusNote:'법적 금지보다는 사업자 자율규제와 필터링 의무 중심.',
      summary:'법으로 금지하는 대신 통신사업자의 필터링 제공 의무와 사업자 자율규제로 대응해 왔습니다. 연령 하한은 각 플랫폼 약관에 맡겨져 있습니다.',
      age:null, ageRule:'청소년인터넷환경정비법에 따라 통신사업자의 필터링 제공 의무. 연령 하한은 각 플랫폼의 약관(통상 13세).',
      scope:['LINE','Instagram','TikTok','X'], scopeNote:'필터링 제공 대상.',
      responsibility:'통신사업자 및 보호자.', enforcement:'행정지도 중심. 벌칙 없음.',
      usageRate:90, usageGroup:'중·고생', usageNote:'내각부 청소년 인터넷 이용환경 실태조사',
      effectiveDate:'해당 없음', updated:'2026-06-25',
      sources:[{title:'青少年インターネット環境整備法', publisher:'内閣府', url:'https://www8.cao.go.jp/youth/'}]
    },
    {
      iso3:'AUT', name:'오스트리아', nameEn:'Austria', continent:'유럽',
      status:'debate', statusNote:'연령 하한 도입 여부를 두고 연립정부 내 이견.',
      summary:'15세 미만 제한안이 제기됐지만 연립정부 내 이견으로 진전되지 않고 있습니다.',
      age:15, ageRule:'15세 미만 제한안이 제기됨.', scope:['TikTok','Instagram'], scopeNote:'논의 단계.',
      responsibility:'미정.', enforcement:'미정.',
      usageRate:89, usageGroup:'11–14세', usageNote:'조사기관 추정',
      effectiveDate:'미정', updated:'2026-02-18',
      sources:[{title:'Parlament 논의 현황', publisher:'Österreichisches Parlament', url:'https://www.parlament.gv.at/'}]
    },
    {
      iso3:'CHL', name:'칠레', nameEn:'Chile', continent:'남아메리카',
      status:'debate', statusNote:'브라질 입법 이후 남미권에서 후속 논의가 확산.',
      summary:'브라질의 입법 이후 남미권에서 후속 논의가 번지는 흐름 속에 있습니다. 16세 미만 보호자 동의 의무화안이 논의 중입니다.',
      age:16, ageRule:'16세 미만 보호자 동의 의무화안이 논의 중.', scope:['Instagram','TikTok'], scopeNote:'논의 단계.',
      responsibility:'미정.', enforcement:'미정.',
      usageRate:90, usageGroup:'13–17세', usageNote:'조사기관 추정',
      effectiveDate:'미정', updated:'2026-05-19',
      sources:[{title:'Cámara de Diputados 논의 현황', publisher:'Cámara de Diputados', url:'https://www.camara.cl/'}]
    },
    {
      iso3:'ARG', name:'아르헨티나', nameEn:'Argentina', continent:'남아메리카',
      status:'debate', statusNote:'아동 온라인 보호 법안이 제출된 상태.',
      summary:'아동 온라인 보호 법안이 제출된 상태로, 연령 확인과 보호자 동의를 중심으로 논의되고 있습니다.',
      age:null, ageRule:'연령 확인과 보호자 동의를 중심으로 한 논의.', scope:['소셜미디어 전반'], scopeNote:'논의 단계.',
      responsibility:'미정.', enforcement:'미정.',
      usageRate:92, usageGroup:'13–17세', usageNote:'조사기관 추정',
      effectiveDate:'미정', updated:'2026-04-02',
      sources:[{title:'Congreso 논의 현황', publisher:'Congreso de la Nación', url:'https://www.congreso.gob.ar/'}]
    },
    {
      iso3:'ZAF', name:'남아프리카공화국', nameEn:'South Africa', continent:'아프리카',
      status:'debate', statusNote:'영화출판물위원회(FPB)가 연령 확인 규정 도입을 검토.',
      summary:'영화출판물위원회를 중심으로 유해 콘텐츠 접근 차단을 위한 연령 확인 규정을 검토하는 단계입니다.',
      age:null, ageRule:'유해 콘텐츠 접근 차단 중심의 검토.', scope:['소셜미디어','성인 콘텐츠'], scopeNote:'검토 단계.',
      responsibility:'플랫폼 사업자(안).', enforcement:'FPB 감독안.',
      usageRate:84, usageGroup:'13–17세', usageNote:'조사기관 추정',
      effectiveDate:'미정', updated:'2026-03-05',
      sources:[{title:'Film and Publication Board 검토 자료', publisher:'FPB', url:'https://www.fpb.org.za/'}]
    },
    {
      iso3:'ARE', name:'아랍에미리트', nameEn:'United Arab Emirates', continent:'아시아',
      status:'debate', statusNote:'아동 디지털 보호 정책의 일환으로 검토 중.',
      summary:'아동 디지털 보호 정책의 일환으로 검토가 진행 중이며, 구체적인 연령 기준은 아직 나오지 않았습니다.',
      age:null, ageRule:'구체적 연령 기준은 확정되지 않음.', scope:['소셜미디어 전반'], scopeNote:'검토 단계.',
      responsibility:'미정.', enforcement:'TDRA 감독안.',
      usageRate:94, usageGroup:'13–17세', usageNote:'조사기관 추정',
      effectiveDate:'미정', updated:'2026-01-29',
      sources:[{title:'Digital wellbeing 정책 자료', publisher:'TDRA', url:'https://tdra.gov.ae/'}]
    },
    {
      iso3:'RUS', name:'러시아', nameEn:'Russia', continent:'유럽',
      status:'debate', statusNote:'연령 규제보다 플랫폼 접속 차단·자국 서비스 전환 정책이 우선.',
      summary:'연령 기반 규제보다 플랫폼 접속 차단과 자국 서비스 전환 정책이 우선합니다. 다른 나라들의 논의와는 결이 다릅니다.',
      age:null, ageRule:'미성년자 대상 연령 하한 규정은 별도로 없음.', scope:['VK','Telegram'], scopeNote:'해당 없음.',
      responsibility:'플랫폼 사업자.', enforcement:'Roskomnadzor 의 접속 차단.',
      usageRate:88, usageGroup:'13–17세', usageNote:'조사기관 추정',
      effectiveDate:'해당 없음', updated:'2026-02-10',
      sources:[{title:'Roskomnadzor 공지', publisher:'Roskomnadzor', url:'https://rkn.gov.ru/'}]
    },
    {
      iso3:'MEX', name:'멕시코', nameEn:'Mexico', continent:'북아메리카',
      status:'none', statusNote:'연령 기반 SNS 이용 제한 논의가 확인되지 않음.',
      summary:'연령 기반 SNS 이용 제한 논의가 아직 확인되지 않습니다.',
      age:null, ageRule:'해당 없음.', scope:[], scopeNote:'해당 없음.',
      responsibility:'해당 없음.', enforcement:'해당 없음.',
      usageRate:90, usageGroup:'13–17세', usageNote:'조사기관 추정',
      effectiveDate:'해당 없음', updated:'2026-01-15', sources:[]
    },
    {
      iso3:'NGA', name:'나이지리아', nameEn:'Nigeria', continent:'아프리카',
      status:'none', statusNote:'연령 기반 SNS 이용 제한 논의가 확인되지 않음.',
      summary:'연령 기반 SNS 이용 제한 논의가 아직 확인되지 않습니다.',
      age:null, ageRule:'해당 없음.', scope:[], scopeNote:'해당 없음.',
      responsibility:'해당 없음.', enforcement:'해당 없음.',
      usageRate:79, usageGroup:'13–17세', usageNote:'조사기관 추정',
      effectiveDate:'해당 없음', updated:'2026-01-15', sources:[]
    },
    {
      iso3:'KEN', name:'케냐', nameEn:'Kenya', continent:'아프리카',
      status:'none', statusNote:'연령 기반 SNS 이용 제한 논의가 확인되지 않음.',
      summary:'연령 기반 SNS 이용 제한 논의가 아직 확인되지 않습니다.',
      age:null, ageRule:'해당 없음.', scope:[], scopeNote:'해당 없음.',
      responsibility:'해당 없음.', enforcement:'해당 없음.',
      usageRate:76, usageGroup:'13–17세', usageNote:'조사기관 추정',
      effectiveDate:'해당 없음', updated:'2026-01-15', sources:[]
    },
    {
      iso3:'SAU', name:'사우디아라비아', nameEn:'Saudi Arabia', continent:'아시아',
      status:'none', statusNote:'연령 기반 SNS 이용 제한 논의가 확인되지 않음.',
      summary:'연령 기반 SNS 이용 제한 논의가 아직 확인되지 않습니다.',
      age:null, ageRule:'해당 없음.', scope:[], scopeNote:'해당 없음.',
      responsibility:'해당 없음.', enforcement:'해당 없음.',
      usageRate:93, usageGroup:'13–17세', usageNote:'조사기관 추정',
      effectiveDate:'해당 없음', updated:'2026-01-15', sources:[]
    }
  ],

  /* ── 확산 연표 ─────────────────────────────────────────── */
  timeline: [
    { date:'2023-07-07', iso3:'FRA', country:'프랑스', kind:'pass',    title:'"디지털 성년" 법률 제정',
      desc:'15세 미만의 계정 개설에 보호자 동의를 요구하는 법률이 공포되었으나, EU 통보 절차 미완료로 시행이 보류됨.' },
    { date:'2024-03-25', iso3:'USA', country:'미국(플로리다)', kind:'pass', title:'HB 3 서명',
      desc:'14세 미만 계정 금지, 14–15세 보호자 동의를 규정. 2025년 1월 시행 예정이었으나 소송으로 일부 정지.' },
    { date:'2024-11-29', iso3:'AUS', country:'호주', kind:'pass',      title:'16세 미만 SNS 금지법 통과',
      desc:'상·하원을 통과. 세계 최초로 예외 없는 연령 하한을 채택하며 각국 논의의 기준점이 됨.' },
    { date:'2024-12-25', iso3:'VNM', country:'베트남', kind:'enforce', title:'시행령 147호 시행',
      desc:'실명 인증 의무화. 16세 미만은 보호자 명의로만 계정 등록이 가능해짐.' },
    { date:'2025-01-01', iso3:'CHN', country:'중국', kind:'enforce',   title:'미성년자 모드 전면 적용',
      desc:'단말·앱스토어·앱 3계층에 미성년자 모드 구축 의무가 본격 적용됨.' },
    { date:'2025-03-28', iso3:'IDN', country:'인도네시아', kind:'enforce', title:'대통령령 17/2025 시행',
      desc:'연령 단계별 차등 규제가 발효. 다만 2년의 전환기를 두어 집행은 단계적으로 이루어짐.' },
    { date:'2025-06-12', iso3:'USA', country:'미국', kind:'block',     title:'연방법원, 주법 집행 정지 결정',
      desc:'표현의 자유 침해 우려를 이유로 복수 주법의 집행이 가처분으로 정지됨.' },
    { date:'2025-07-25', iso3:'GBR', country:'영국', kind:'enforce',   title:'고신뢰 연령 확인 의무 시행',
      desc:'온라인안전법에 따른 아동 보호 규정이 발효. VPN 다운로드가 급증하는 부작용이 함께 보고됨.' },
    { date:'2025-09-17', iso3:'BRA', country:'브라질', kind:'pass',    title:'디지털 아동청소년법 공포',
      desc:'16세 미만 계정의 보호자 연동과 연령 확인을 의무화. 6개월 뒤 시행.' },
    { date:'2025-11-07', iso3:'DNK', country:'덴마크', kind:'pass',    title:'15세 미만 금지 정치 합의',
      desc:'여야가 15세 미만 금지(보호자 동의 시 13세)에 합의. 유럽 내 첫 법제화 사례로 주목받음.' },
    { date:'2025-11-26', iso3:'',    country:'유럽연합', kind:'debate', title:'유럽의회, 16세 공동 기준 결의',
      desc:'구속력은 없으나 EU 차원의 최소 연령 16세 도입을 권고하는 결의를 채택.' },
    { date:'2025-11-27', iso3:'MYS', country:'말레이시아', kind:'pass', title:'16세 미만 계정 금지 발표',
      desc:'2026년 1월 1일부터 신규 계정 개설을 금지하겠다고 정부가 공식 발표.' },
    { date:'2025-12-10', iso3:'AUS', country:'호주', kind:'enforce',   title:'16세 미만 SNS 금지 시행',
      desc:'세계 최초로 예외 없는 연령 하한이 실제 집행에 들어감. 시행 첫 주 수십만 개 계정이 비활성화됨.' },
    { date:'2026-01-01', iso3:'MYS', country:'말레이시아', kind:'enforce', title:'16세 미만 신규 계정 금지 시행',
      desc:'eKYC 기반 연령 확인이 라이선스 조건으로 부과됨.' },
    { date:'2026-02-19', iso3:'NOR', country:'노르웨이', kind:'bill',  title:'15세 연령 하한 법안 제출',
      desc:'정부가 개인정보 동의 연령을 15세로 상향하는 법안을 의회에 제출.' },
    { date:'2026-03-17', iso3:'BRA', country:'브라질', kind:'enforce', title:'디지털 아동청소년법 시행',
      desc:'플랫폼과 앱스토어에 연령 확인 의무가 발효.' },
    { date:'2026-04-08', iso3:'ESP', country:'스페인', kind:'bill',    title:'미성년자 디지털 보호법안 심의 개시',
      desc:'계정 개설 최소 연령을 16세로 상향하는 법안이 하원 심의에 들어감.' },
    { date:'2026-05-21', iso3:'NZL', country:'뉴질랜드', kind:'pass',  title:'16세 미만 제한 법안 통과',
      desc:'호주 모델을 참고한 법안이 의회를 통과. 2026년 12월 시행 예정.' },
    { date:'2026-06-30', iso3:'SGP', country:'싱가포르', kind:'bill',  title:'16세 미만 계정 제한 방침 발표',
      desc:'총리가 시정연설에서 도입 방침을 밝히고 제도 설계에 착수.' },
    { date:'2026-07-15', iso3:'KOR', country:'대한민국', kind:'bill',  title:'관련 법안 심사 소위 상정',
      desc:'복수의 개정안이 과방위 정보통신방송법안심사소위에 상정되어 논의가 시작됨.' },
    { date:'2026-08-11', iso3:'AUS', country:'호주', kind:'enforce',   title:'시행 8개월 효과 평가 발표',
      desc:'대상 연령대의 이용률은 감소했으나 상당수가 우회 수단을 통해 이용을 지속하고 있다는 정부 평가가 공개됨.' }
  ],

  /* ── 시행 국가의 우회 이용 추정 비율(%) 시계열 ─────────── */
  bypass: {
    AUS: {
      metric:'규제 대상 연령대 중 우회 이용자 비율',
      note:'VPN·연령 허위 입력·성인 명의 계정 사용을 포함한 설문 기반 추정치',
      series:[
        { label:'2025-12', value:12 }, { label:'2026-01', value:24 }, { label:'2026-02', value:31 },
        { label:'2026-03', value:36 }, { label:'2026-04', value:38 }, { label:'2026-05', value:41 },
        { label:'2026-06', value:43 }, { label:'2026-07', value:43 }
      ]
    },
    GBR: {
      metric:'연령 확인 우회 시도 비율',
      note:'연령 확인 의무 시행 직후 VPN 앱 다운로드가 급증한 시점을 포함',
      series:[
        { label:'2025-07', value:18 }, { label:'2025-09', value:34 }, { label:'2025-11', value:39 },
        { label:'2026-01', value:41 }, { label:'2026-03', value:44 }, { label:'2026-05', value:46 },
        { label:'2026-07', value:47 }
      ]
    },
    BRA: {
      metric:'규제 대상 연령대 중 우회 이용자 비율',
      note:'시행 후 5개월간의 추이',
      series:[
        { label:'2026-03', value:9 }, { label:'2026-04', value:21 }, { label:'2026-05', value:28 },
        { label:'2026-06', value:33 }, { label:'2026-07', value:35 }
      ]
    },
    VNM: {
      metric:'실명 인증 우회 이용 비율',
      note:'타인 명의 계정 사용 및 국외 서비스 이용을 포함',
      series:[
        { label:'2025-01', value:22 }, { label:'2025-04', value:35 }, { label:'2025-07', value:44 },
        { label:'2025-10', value:49 }, { label:'2026-01', value:52 }, { label:'2026-04', value:54 },
        { label:'2026-07', value:55 }
      ]
    },
    CHN: {
      metric:'미성년자 모드 우회 비율',
      note:'성인 계정 도용 및 제3자 앱 이용을 포함',
      series:[
        { label:'2024-11', value:31 }, { label:'2025-02', value:38 }, { label:'2025-05', value:44 },
        { label:'2025-08', value:47 }, { label:'2025-11', value:49 }, { label:'2026-02', value:50 },
        { label:'2026-05', value:51 }
      ]
    },
    IDN: {
      metric:'연령 확인 우회 비율',
      note:'전환기 중이어서 집행 강도가 낮음',
      series:[
        { label:'2025-06', value:41 }, { label:'2025-12', value:51 }, { label:'2026-03', value:57 },
        { label:'2026-06', value:60 }
      ]
    },
    MYS: {
      metric:'규제 대상 연령대 중 우회 이용자 비율',
      note:'기존 계정 정리가 진행 중',
      series:[
        { label:'2026-01', value:15 }, { label:'2026-03', value:29 }, { label:'2026-05', value:37 },
        { label:'2026-07', value:40 }
      ]
    }
  },

  /* ── 실효성 지표 ───────────────────────────────────────── */
  efficacy: {
    dumbbell:[
      { iso3:'AUS', name:'호주',        group:'14–15세', before:96, after:58 },
      { iso3:'GBR', name:'영국',        group:'12–15세', before:93, after:81 },
      { iso3:'BRA', name:'브라질',      group:'13–15세', before:91, after:70 },
      { iso3:'VNM', name:'베트남',      group:'13–15세', before:89, after:74 },
      { iso3:'CHN', name:'중국',        group:'미성년자', before:97, after:88 },
      { iso3:'MYS', name:'말레이시아',  group:'13–15세', before:88, after:66 },
      { iso3:'IDN', name:'인도네시아',  group:'13–15세', before:87, after:82 }
    ],
    cards:[
      { title:'집행 실적 · 호주', big:'0건', unit:'과징금 부과', 
        body:'시행 8개월간 실제로 부과된 과징금은 없습니다. eSafety Commissioner 는 플랫폼들이 "합리적 조치" 요건을 충족했다고 판단했으나, 시민단체는 요건 자체가 느슨하다고 비판합니다.',
        meta:'2026-08 기준' },
      { title:'연령 확인의 정확도', big:'±2.3세', unit:'평균 오차',
        body:'얼굴 이미지 기반 연령 추정 기술의 검증 결과, 13–17세 구간의 평균 오차는 약 2.3세로 보고됩니다. 16세 경계를 판별하기에는 오차가 크다는 지적이 계속됩니다.',
        meta:'독립 기술 평가 종합' },
      { title:'VPN 확산', big:'+280%', unit:'다운로드 증가',
        body:'영국의 연령 확인 의무 시행 직후 일주일간 주요 VPN 앱의 다운로드가 급증했습니다. 호주에서도 시행 직후 유사한 패턴이 관찰되었습니다.',
        meta:'앱스토어 순위 기반 추정' },
      { title:'대체 서비스로의 이동', big:'34%', unit:'응답 비율',
        body:'규제 대상에서 제외된 메시징 앱·게임 내 채팅·소규모 플랫폼으로 옮겨갔다고 응답한 비율입니다. 규제가 이용 자체를 줄이기보다 이용처를 바꾸었다는 평가의 근거가 됩니다.',
        meta:'호주 시행 6개월 설문' },
      { title:'보호자 인식', big:'71%', unit:'찬성',
        body:'규제 시행 국가의 보호자 대상 조사에서 제도 자체에 대한 지지는 높게 유지되고 있습니다. 다만 "실제로 효과가 있다고 본다"는 응답은 40% 안팎에 머뭅니다.',
        meta:'시행 국가 종합' },
      { title:'정신건강 지표', big:'미확정', unit:'',
        body:'시행 기간이 짧아 청소년 정신건강 지표의 유의미한 변화는 아직 확인되지 않았습니다. 인과관계를 확인하려면 최소 2–3년의 추적이 필요하다는 것이 연구자들의 공통된 견해입니다.',
        meta:'2026-08 기준' }
    ]
  },

  /* ── 참고 자료 (푸터 '출처 보기') ─────────────────────────
     국가별 상세에 붙는 출처와 별개로, 전체적으로 참고한 자료를 여기에 모읍니다. */
  sources: [
    { title:'Online Safety Amendment (Social Media Minimum Age) Act 2024', url:'https://www.legislation.gov.au/C2024A00119/asmade/text' },
    { title:'eSafety Commissioner — Social media age restrictions', url:'https://www.esafety.gov.au/' },
    { title:'Online Safety Act 2023 (UK)', url:'https://www.legislation.gov.uk/ukpga/2023/50/contents' },
    { title:'Ofcom — Protection of Children Codes of Practice', url:'https://www.ofcom.org.uk/online-safety/' },
    { title:'유럽연합 디지털서비스법(DSA) 원문', url:'https://eur-lex.europa.eu/eli/reg/2022/2065/oj' },
    { title:'유럽의회 결의 — 미성년자 온라인 보호 (2025)', url:'https://www.europarl.europa.eu/' },
    { title:'OECD — Children in the Digital Environment', url:'https://www.oecd.org/digital/' },
    { title:'유니세프 — Children and Digital Marketing', url:'https://www.unicef.org/' },
    { title:'국회 의안정보시스템', url:'https://likms.assembly.go.kr/bill/main.do' },
    { title:'방송통신위원회 — 청소년 보호 정책', url:'https://www.kcc.go.kr/' },
    { title:'한국지능정보사회진흥원 — 스마트폰 과의존 실태조사', url:'https://www.nia.or.kr/' },
    { title:'Pew Research Center — Teens, Social Media and Technology', url:'https://www.pewresearch.org/' }
  ],

  /* ── 대한민국 상세 ─────────────────────────────────────── */
  korea: {
    stats:[
      { label:'발의된 관련 법안', value:'7', unit:'건', color:'--st-bill' },
      { label:'본회의 통과', value:'0', unit:'건', color:'--st-passed' },
      { label:'가장 많이 제안된 기준', value:'16', unit:'세', color:'--st-enforced' },
      { label:'청소년 SNS 이용률', value:'82', unit:'%', color:'--accent' },
      { label:'도입 찬성 여론', value:'64', unit:'%', color:'--st-debate' }
    ],
    steps:['발의','소위 심사','상임위 의결','법사위','본회의','공포'],
    bills:[
      { name:'정보통신망법 일부개정법률안', proposer:'A의원 등 12인', party:'', date:'2025-09-12',
        age:'16세 미만', step:2,
        summary:'16세 미만의 SNS 계정 개설 시 보호자 동의를 의무화하고, 사업자에게 연령 확인 수단 마련 의무를 부과.',
        url:'https://likms.assembly.go.kr/bill/main.do' },
      { name:'청소년 보호법 일부개정법률안', proposer:'B의원 등 10인', party:'', date:'2025-10-30',
        age:'14세 미만', step:1,
        summary:'14세 미만의 SNS 이용을 원칙적으로 제한하고, 심야 시간대(00–06시) 이용을 차단하는 조항을 신설.',
        url:'https://likms.assembly.go.kr/bill/main.do' },
      { name:'아동·청소년 디지털 보호에 관한 법률안', proposer:'C의원 등 18인', party:'', date:'2026-01-15',
        age:'16세 미만', step:2,
        summary:'호주 모델을 참고해 16세 미만의 계정 보유를 금지하고, 플랫폼에 합리적 조치 의무와 과징금을 규정.',
        url:'https://likms.assembly.go.kr/bill/main.do' },
      { name:'개인정보 보호법 일부개정법률안', proposer:'D의원 등 11인', party:'', date:'2026-02-20',
        age:'만 14세 → 16세', step:1,
        summary:'개인정보 처리 동의가 가능한 연령을 만 14세에서 16세로 상향.',
        url:'https://likms.assembly.go.kr/bill/main.do' },
      { name:'정보통신망법 일부개정법률안(대안 검토)', proposer:'E의원 등 15인', party:'', date:'2026-04-03',
        age:'연령 확인 의무', step:1,
        summary:'연령 하한을 두지 않고, 사업자에게 연령 확인과 위험 평가 의무를 부과하는 방식.',
        url:'https://likms.assembly.go.kr/bill/main.do' },
      { name:'학교보건법 일부개정법률안', proposer:'F의원 등 9인', party:'', date:'2026-05-28',
        age:'해당 없음', step:3,
        summary:'학교 내 스마트기기 사용 제한의 법적 근거를 마련. SNS 규제와 별개이나 함께 논의되는 사안.',
        url:'https://likms.assembly.go.kr/bill/main.do' },
      { name:'청소년기본법 일부개정법률안', proposer:'G의원 등 13인', party:'', date:'2026-07-09',
        age:'16세 미만', step:1,
        summary:'청소년의 디지털 이용 권리와 보호를 함께 규정하고, 규제 도입 시 청소년 의견 청취를 의무화.',
        url:'https://likms.assembly.go.kr/bill/main.do' }
    ],
    usage:[
      { group:'초4–6', value:61 },
      { group:'중1–3', value:87 },
      { group:'고1–3', value:93 },
      { group:'20대',  value:91 },
      { group:'30대',  value:84 },
      { group:'40대',  value:71 },
      { group:'50대 이상', value:52 }
    ],
    polls:[
      { question:'청소년의 SNS 이용을 법으로 제한하는 데 찬성하십니까?', org:'전국 성인 1,000명', date:'2026-06',
        pro:64, con:28, neu:8 },
      { question:'(청소년 응답) 나의 SNS 이용을 법으로 제한하는 데 찬성합니까?', org:'중·고생 1,200명', date:'2026-06',
        pro:23, con:68, neu:9 },
      { question:'연령 확인을 위해 신분증·얼굴 인식 제출을 수용할 수 있습니까?', org:'전국 성인 1,000명', date:'2026-06',
        pro:39, con:52, neu:9 }
    ]
  }
};
