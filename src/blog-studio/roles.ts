// 8개 역할별 프롬프트 생성기 — 네이버 홈피드 노출에 맞춘 버전

export type AccountType = 'store' | 'creator' | 'custom';

export interface StudioInput {
  account: AccountType;
  customAccount: string; // account === 'custom' 일 때 블로그 성격 설명
  niche: string; // 블로그 분야
  keyword: string; // 메인 키워드
  topic: string; // 글 주제
  audience: string; // 타깃 독자
  region: string; // 지역 (선택)
  experience: string; // 내 경험 메모
  photos: string; // 가지고 있는 사진 메모
  keywordData: string; // 데이터랩/키워드도구 결과 붙여넣기 (선택)
  chosenTitle: string; // 고른 제목
  outline: string; // 확정한 목차 (선택)
  draft: string; // 점검할 초안
  stats: string; // 주간 통계
}

export const EMPTY_INPUT: StudioInput = {
  account: 'store',
  customAccount: '',
  niche: '',
  keyword: '',
  topic: '',
  audience: '',
  region: '',
  experience: '',
  photos: '',
  keywordData: '',
  chosenTitle: '',
  outline: '',
  draft: '',
  stats: '',
};

export const ACCOUNT_PRESETS: Record<AccountType, { label: string; desc: string }> = {
  store: {
    label: '닭잡고오리발 매장 블로그',
    desc:
      '순천 연향동에서 국내산 닭요리 전문점(닭잡고오리발)을 운영하는 사장이 직접 쓰는 블로그. ' +
      '독자는 순천 지역 손님, 회식·단체 예약을 잡는 총무, 가족 외식을 찾는 사람, 밀키트 구매 고객. ' +
      '광고 티가 나면 안 되고, 사장이 겪은 매장 이야기와 실용 정보 위주.',
  },
  creator: {
    label: 'AI 크리에이터 블로그',
    desc:
      '닭요리 가게를 운영하면서 AI를 직접 써보고 되는 것만 알려주는 사장(13년 기업교육 경력)의 블로그. ' +
      '독자는 AI를 써보고 싶은데 어디서부터 할지 모르는 자영업자·직장인. ' +
      '전문가가 아니라 먼저 해본 사람의 시행착오가 핵심.',
  },
  custom: { label: '직접 입력', desc: '' },
};

export function accountDesc(i: StudioInput): string {
  if (i.account === 'custom') return i.customAccount.trim() || '(블로그 성격을 입력하세요)';
  return ACCOUNT_PRESETS[i.account].desc;
}

const v = (s: string, fallback: string) => (s.trim() ? s.trim() : fallback);

function context(i: StudioInput): string {
  const lines = [
    `[블로그 성격] ${accountDesc(i)}`,
    i.niche.trim() && `[블로그 분야] ${i.niche.trim()}`,
    i.audience.trim() && `[타깃 독자] ${i.audience.trim()}`,
    i.region.trim() && `[지역] ${i.region.trim()}`,
  ].filter(Boolean);
  return lines.join('\n');
}

const HOMEFEED_PRIMER = `[홈피드 기준]
네이버 홈피드는 검색해서 들어온 사람이 아니라 "피드를 스크롤하다 멈춘 사람"이 읽는다.
썸네일·제목으로 멈추게 하고 → 도입부로 붙잡고 → 체류시간을 늘리고 → 공감·댓글을 끌어내는 글이 노출된다.
직접 찍은 사진, 직접 겪은 경험, 의견이 갈리는 포인트가 있어야 하고, 광고 티·정보 나열·복붙 느낌은 감점이다.`;

const NO_FAKE = `모르는 숫자·사실은 지어내지 마. 필요한 자리에는 [여기에 실제 경험/숫자] 자리표시를 남겨.`;

export const WRITING_RULES = `[본문 규칙]
- 전체 1000~1400자 (공백 포함, 제목 제외)
- 메인 키워드 5회 이상, 문맥 속에 자연스럽게 (한 문장에 2번 금지)
- 도입부 4단계: ①실제 상황·이슈(2줄 이상) → ②독자 고민 건드리기 → ③내 반응(의문/공감) → ④다음 줄을 읽게 만드는 한 문장. 도입부에서 결론 금지
- 소제목 정확히 3개, 모두 문장형, '단정+갈등' 구조, 각 줄 앞에 "## " 표시
- 각 소제목 아래 첫 2줄에 그 섹션의 핵심 답을 먼저
- 설명 → 반응 → 정보 → 의문 → 공감 반복, 대화체
- 내 경험·해석 4회 이상, 몰입 문장("여기서 많이들 놓칩니다" 류)을 매번 다른 표현으로
- 짧은 문장, 2~3줄마다 빈 줄, 같은 어미 3연속 금지
- 사진 자리 [사진1] [사진2] … 최소 5개
- 마지막 문장은 독자에게 던지는 질문
- 금지: "안녕하세요 여러분", "알아보겠습니다", "~하는 것이 중요합니다", "핵심은 바로", "결론적으로", "놀랍게도", "무려", 첫째/둘째/셋째, "시도해보시는 건 어떨까요", 최저가·무조건·100% 같은 광고 표현
- ${NO_FAKE}`;

const OUTPUT_FOOTER = `본문은 코드블록 없이 바로 출력하고, 맨 아래에 이렇게 붙여줘.
─────────────
글자수: OOO자 (공백 포함)
메인키워드 사용: O회
소제목: 3개
사진 표시: O개`;

export interface Role {
  id: string;
  no: number;
  name: string;
  ko: string;
  summary: string;
  needs: (keyof StudioInput)[];
  build: (i: StudioInput) => string;
}

export const ROLES: Role[] = [
  {
    id: 'niche',
    no: 1,
    name: 'Niche Strategist',
    ko: '돈이 되는 주제 고르기',
    summary: '홈피드 주제판에 맞고, 내가 계속 쓸 수 있고, 매출·문의로 이어지는 주제를 고릅니다.',
    needs: ['niche', 'audience', 'experience'],
    build: (i) => `너는 Niche Strategist야.

${context(i)}

${HOMEFEED_PRIMER}

[내가 가진 경험 자산]
${v(i.experience, '(경험 메모 없음 — 블로그 성격에서 추론해줘)')}

내 블로그가 홈피드에 꾸준히 오를 수 있는 세부 주제(니치) 5개를 제안해줘.
각 니치마다 아래 표로 정리해.

| 니치 | 홈피드 주제 카테고리(예: 맛집/여행/육아/IT/비즈니스) | 누가 멈춰서 읽나 | 내 경험으로 쓸 수 있는 글 수(대략) | 돈으로 이어지는 길(방문·예약·밀키트·강의 문의 등) | 경쟁 강도 |

표 아래에
1) 지금 당장 시작할 1순위 니치와 이유 3줄
2) 그 니치로 첫 2주 동안 쓸 글 6개 (제목 한 줄씩)
을 적어줘. ${NO_FAKE}`,
  },
  {
    id: 'keyword',
    no: 2,
    name: 'Keyword Researcher',
    ko: '글감 100개 한 번에 뽑기',
    summary: '경험형·실수형·비교형 등 홈피드에 잘 먹히는 각도로 글감 100개를 뽑습니다.',
    needs: ['niche', 'keywordData'],
    build: (i) => `너는 Keyword Researcher야.

${context(i)}

${HOMEFEED_PRIMER}

${
  i.keywordData.trim()
    ? `[네이버 데이터랩 / 검색광고 키워드도구에서 가져온 데이터]\n${i.keywordData.trim()}\n\n위 데이터의 검색량과 시즌 흐름을 우선 반영해.`
    : `(검색량 데이터는 아직 없어. 네가 추정한 값은 '추정'이라고 표시하고, 내가 데이터랩·키워드도구로 확인할 수 있게 확인용 키워드도 같이 적어줘.)`
}

블로그 글감 100개를 뽑아줘. 아래 5가지 각도로 20개씩 나눠.
A. 경험형 — "직접 해봤더니"
B. 실수·반전형 — "다들 이렇게 하는데 사실은"
C. 비교·선택형 — "A vs B, 저는 이걸 골랐습니다"
D. 시즌·이슈형 — 지금 시기(${new Date().getMonth() + 1}월 전후)에 반응 올 것
E. 질문형 — 독자가 댓글로 의견 남기고 싶어지는 것

각 글감은 표 한 줄로:
| 번호 | 각도 | 메인 키워드 | 글 주제 한 줄 | 홈피드 후킹 포인트 | 내 경험 필요도(상/중/하) |

마지막에 "이번 주에 바로 쓸 5개"를 골라 이유와 함께 표시해줘.`,
  },
  {
    id: 'title',
    no: 3,
    name: 'Title Writer',
    ko: '눌러보고 싶은 제목',
    summary: '피드 스크롤을 멈추게 하는 제목 10개와 썸네일 문구를 만듭니다.',
    needs: ['keyword', 'topic'],
    build: (i) => `너는 Title Writer야.

${context(i)}

[메인 키워드] ${v(i.keyword, '(키워드 입력 필요)')}
[글 주제] ${v(i.topic, '(주제 입력 필요)')}
[내 경험 메모] ${v(i.experience, '없음')}

${HOMEFEED_PRIMER}

홈피드에서 클릭률 높은 제목 10개를 만들어줘. 아래 5가지 유형에서 2개씩.
1. 경험고백형 ("~해봤는데 생각과 달랐습니다")
2. 반전형 ("~인 줄 알았는데")
3. 실수형 ("~할 때 저만 이렇게 했나요")
4. 숫자·비교형 ("3번 가보고 정리한 ~")
5. 질문형 ("~ 어떻게 생각하세요?")

규칙
- 메인 키워드는 앞쪽 절반 안에 그대로 넣기
- 18~32자
- 과장·낚시 금지 (본문이 제목 약속을 지킬 수 있어야 함)
- 광고 단어(최저가, 무조건, 1위, 할인) 금지

표로 정리: | 번호 | 유형 | 제목 | 글자수 | 왜 멈추게 되나 |

그리고 마지막에
- 추천 1개와 이유
- 그 제목에 맞는 썸네일 문구 3개 (8~14자, 사진 위에 올릴 짧은 문구)
를 적어줘.`,
  },
  {
    id: 'outline',
    no: 4,
    name: 'Outline Builder',
    ko: '답부터 시작하는 목차',
    summary: '도입부 4단계 + 문장형 소제목 3개 구조로 목차를 짭니다.',
    needs: ['keyword', 'chosenTitle', 'experience'],
    build: (i) => `너는 Outline Builder야.

${context(i)}

[메인 키워드] ${v(i.keyword, '(키워드 입력 필요)')}
[제목] ${v(i.chosenTitle, '(위에서 고른 제목)')}
[내 경험 메모]
${v(i.experience, '없음')}

이 글의 목차를 만들어줘. 형식은 아래 그대로.

1) 검색의도·피드의도 요약 (3줄)
   - 이 제목을 누른 사람이 진짜 알고 싶은 것
   - 끝까지 읽게 만들 궁금증
   - 댓글로 의견이 갈릴 포인트

2) 도입부 설계 (4단계, 각 1~2줄 메모)
   ① 실제 상황·이슈 ② 독자 고민 ③ 내 반응 ④ 다음 줄을 읽게 할 한 문장
   ※ 도입부에서 결론은 말하지 않는다

3) 소제목 3개 (문장형, '단정+갈등' 구조, "## "로 시작)
   각 소제목 아래:
   - 핵심 답 (이 섹션 첫 2줄에 먼저 줄 답)
   - 들어갈 내 경험 (메모에서 골라 연결, 없으면 [여기에 실제 경험])
   - 반전 또는 공감 포인트 1개
   - 들어갈 사진 [사진N] 위치

4) 마무리 설계
   - 정리 1줄 / 핵심 재강조 1줄 / 마지막 독자 질문 1줄

5) FAQ 후보 3개 (본문에 넣을지 내가 고를게)

${NO_FAKE}`,
  },
  {
    id: 'writer',
    no: 5,
    name: 'Post Writer',
    ko: '내 경험이 들어간 본문',
    summary: '홈피드 본문 규칙과 내 말투로 초안을 한 번에 씁니다.',
    needs: ['keyword', 'chosenTitle', 'experience', 'outline'],
    build: (i) => `너는 Post Writer야.

${context(i)}

[메인 키워드] ${v(i.keyword, '(키워드 입력 필요)')}
[제목] ${v(i.chosenTitle, '(위에서 고른 제목)')}
[글 주제] ${v(i.topic, '(주제)')}
[목차]
${v(i.outline, '(위에서 만든 목차를 그대로 따라줘)')}

[내 경험 메모 — 이 내용을 본문 곳곳에 녹여줘]
${v(i.experience, '없음 → 경험이 들어갈 자리마다 [여기에 실제 경험] 표시')}

[가지고 있는 사진]
${v(i.photos, '없음 → [사진N] 위치만 표시')}

[말투]
화자는 전문가가 아니라 직접 해본 사장이다. 기본은 합니다체, 의외였던 순간·혼잣말·독자에게 말 거는 순간에는 해요체로 떨어뜨린다 (7:3).
일반론 문장은 쓰지 말고, 언제 어디서 뭘 하다 알게 됐는지를 붙인다. 이모지는 0~3개.

${WRITING_RULES}

첫 줄에 제목을 쓰고, 한 줄 띄운 뒤 본문을 써줘.
${OUTPUT_FOOTER}`,
  },
  {
    id: 'seo',
    no: 6,
    name: 'SEO Checker',
    ko: '상위 노출 점검',
    summary: '초안을 붙여넣으면 브라우저에서 바로 자동 점검하고, Claude 검수 프롬프트도 만듭니다.',
    needs: ['keyword', 'draft'],
    build: (i) => `너는 SEO Checker야. 네이버 홈피드와 블로그 검색 노출 기준으로 아래 글을 점검해줘.

[메인 키워드] ${v(i.keyword, '(키워드 입력 필요)')}

${HOMEFEED_PRIMER}

[점검할 글]
${v(i.draft, '(초안을 붙여넣으세요)')}

아래 항목을 표로 점검해: | 항목 | 통과/보완 | 근거(본문 인용) | 고칠 문장 제안 |
1. 제목: 키워드 앞쪽 배치, 18~32자, 과장·낚시 없음
2. 도입부 4단계 (상황 → 고민 → 내 반응 → 궁금증) / 도입부에서 결론 누설 여부
3. 글자수 1000~1400자, 키워드 5회 이상·자연스러움 (몰아넣기 없는지)
4. 소제목 정확히 3개, 문장형, 의견이 갈리는 구조
5. 내 경험·해석 4회 이상 / 지어낸 것 같은 수치·사실
6. 체류 장치: 몰입 문장, 반전, 공감 포인트
7. 가독성: 2~3줄마다 줄바꿈, 같은 어미 3연속
8. AI 냄새 표현, 광고성 표현(최저가·무조건·100%·외부링크 과다)
9. 마지막 문장이 독자 질문인지
10. 사진 표시 5개 이상, 대표사진(썸네일) 후보

마지막에
- 100점 만점 점수
- 꼭 고칠 것 TOP 3
- 고친 최종본 전체 (코드블록 없이)`,
  },
  {
    id: 'image',
    no: 7,
    name: 'Image Planner',
    ko: '사진·썸네일 기획',
    summary: '대표사진(썸네일) 구도와 [사진N]별 촬영·편집 가이드를 만듭니다.',
    needs: ['chosenTitle', 'photos', 'draft'],
    build: (i) => `너는 Image Planner야.

${context(i)}

[제목] ${v(i.chosenTitle, '(제목)')}
[가지고 있는 사진]
${v(i.photos, '아직 없음 — 새로 찍을 목록을 짜줘')}

[본문 초안]
${v(i.draft, '(위에서 쓴 초안 기준으로)')}

홈피드에서는 대표사진(썸네일)이 제목만큼 클릭을 좌우한다.
직접 찍은 사진이어야 하고, 글자가 너무 많은 썸네일·다른 곳에서 가져온 이미지는 피한다.

1) 대표사진(썸네일) 기획 3안
   | 안 | 구도·피사체 | 색감·밝기 | 사진 위 문구(8~14자, 없어도 됨) | 왜 멈추게 되나 |
2) 본문 [사진1]~[사진N] 각각
   | 번호 | 어떤 장면 | 촬영 팁(각도·거리·빛) | 사진 아래 캡션 1줄 | 가진 사진 중 대체 가능한 것 |
3) 촬영 체크리스트 (현장에서 한 번에 다 찍을 수 있게 순서대로)
4) 업로드 전 편집 팁 (세로/가로 비율, 밝기, 개인정보·얼굴 가리기)`,
  },
  {
    id: 'growth',
    no: 8,
    name: 'Growth Analyst',
    ko: '주간 통계로 다음 글 고르기',
    summary: '블로그 통계를 붙여넣으면 잘된 글의 공통점과 다음 주 글 3개를 뽑습니다.',
    needs: ['stats'],
    build: (i) => `너는 Growth Analyst야.

${context(i)}

[이번 주 블로그 통계 — 네이버 블로그 > 통계에서 복사]
${v(
  i.stats,
  `(아래 형식으로 붙여넣으세요)
제목 | 조회수 | 유입경로(홈피드/검색/기타 비율) | 평균 사용시간 | 공감 | 댓글`,
)}

1) 글별로 표 정리: | 제목 | 조회수 | 홈피드 유입 비율 | 체류 | 반응(공감+댓글) | 판정(키울 글/보통/버릴 각도) |
2) 홈피드에서 잘된 글의 공통점 3가지 (제목 유형, 썸네일, 주제 각도, 발행 요일·시간)
3) 안된 글의 원인 가설 2가지와 다음에 바꿔볼 것
4) 다음 주에 쓸 글 3개
   | 제목 | 메인 키워드 | 노리는 것(홈피드/검색) | 필요한 내 경험·사진 |
5) 잘된 글 1개를 골라 "후속편" 아이디어 2개

숫자가 부족해서 판단이 어려운 부분은 추측하지 말고 "데이터 부족"이라고 적어줘.`,
  },
];

/** 3→4→5→자체점검을 한 번에 돌리는 빠른 모드 */
export function buildQuickPrompt(i: StudioInput): string {
  return `아래 정보로 네이버 홈피드용 블로그 글을 처음부터 끝까지 한 번에 완성해줘.
단계별로 진행하되, 중간 단계는 짧게 보여주고 최종본에 집중해.

${context(i)}

[메인 키워드] ${v(i.keyword, '(키워드 입력 필요)')}
[글 주제] ${v(i.topic, '(주제 입력 필요)')}
[내 경험 메모]
${v(i.experience, '없음 → 경험이 들어갈 자리마다 [여기에 실제 경험] 표시')}
[가지고 있는 사진]
${v(i.photos, '없음')}

${HOMEFEED_PRIMER}

STEP 1. 제목 5개 (경험고백·반전·실수·비교·질문형 각 1개, 키워드 앞쪽, 18~32자) → 추천 1개 선택
STEP 2. 목차 (도입부 4단계 메모 + 문장형 소제목 3개 + 각 섹션 핵심 답 + 마무리 질문)
STEP 3. 본문 최종본 (아래 규칙 준수)
STEP 4. 자체 점검표 — 규칙별 통과/보완, 어긋나면 고쳐서 다시 출력
STEP 5. 대표사진(썸네일) 구도 1안 + 썸네일 문구 + 해시태그 10개

[말투]
화자는 전문가가 아니라 직접 해본 사장이다. 기본은 합니다체, 감정·혼잣말 지점에서는 해요체 (7:3). 이모지 0~3개.

${WRITING_RULES}

${OUTPUT_FOOTER}`;
}

export const FIELD_LABELS: Record<keyof StudioInput, string> = {
  account: '블로그 계정',
  customAccount: '블로그 성격',
  niche: '블로그 분야',
  keyword: '메인 키워드',
  topic: '글 주제',
  audience: '타깃 독자',
  region: '지역',
  experience: '내 경험 메모',
  photos: '가진 사진',
  keywordData: '키워드 데이터',
  chosenTitle: '고른 제목',
  outline: '목차',
  draft: '초안',
  stats: '주간 통계',
};
