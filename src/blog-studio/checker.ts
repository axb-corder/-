// 홈피드 초안 자동 점검기 — 브라우저에서 바로 계산 (API 불필요)

export const RULES = {
  minChars: 1000,
  maxChars: 1400,
  minKeyword: 5,
  maxKeyword: 12,
  subheadings: 3,
  minExperience: 4,
  minPhotos: 5,
  titleMin: 18,
  titleMax: 32,
};

export type Status = 'pass' | 'warn' | 'fail';

export interface CheckItem {
  id: string;
  label: string;
  status: Status;
  detail: string;
  weight: number;
}

export interface CheckResult {
  title: string;
  bodyChars: number;
  bodyCharsNoSpace: number;
  keywordCount: number;
  items: CheckItem[];
  score: number;
}

const AI_PHRASES = [
  '안녕하세요 여러분',
  '여러분 안녕하세요',
  '여러분, 안녕하세요',
  '알아보겠습니다',
  '알아볼까요',
  '것이 중요합니다',
  '핵심은 바로',
  '결론적으로',
  '정리하자면',
  '놀랍게도',
  '무려',
  '게임 체인저',
  '혁신적인',
  '시도해보시는 건 어떨까요',
  '시도해 보시는 건 어떨까요',
  '많은 관심 부탁',
  '첫째,',
  '둘째,',
  '셋째,',
  '라는 점에서 의미가',
];

const AD_PHRASES = ['최저가', '무조건', '100% 보장', '100%보장', '업계 1위', '지금 바로 구매', '구매하기', '할인코드', '파격 할인', '클릭하세요'];

const EXPERIENCE_RE = /(저는|제가|저희|직접|해보니|해봤|해 봤|가보니|가봤|먹어보니|먹어봤|써보니|써봤|느꼈|솔직히|개인적으로|제 생각|내 생각)/g;

const IMMERSION_RE = /(놓치|여기서|중요한 건|흐름이 바뀝|반전|근데|그런데 막상|의외로|생각과 달)/;

const SUBHEAD_RE = /^\s*(#{2,3}\s+|■|▶|【|\[소제목\])/;

const QUESTION_END_RE = /(\?|？|나요|까요|세요|신가요|인가요|을까요|ㄹ까요|는지요|어떠세요)[\s.!~😊🙂]*$/;

function countOccurrences(text: string, word: string): number {
  if (!word) return 0;
  let count = 0;
  let idx = text.indexOf(word);
  while (idx !== -1) {
    count++;
    idx = text.indexOf(word, idx + word.length);
  }
  return count;
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\[사진\s*\d+\]/g, '\n')
    .split(/(?<=[.!?？。~])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3 && !SUBHEAD_RE.test(s));
}

function ending(sentence: string): string {
  const clean = sentence.replace(/[\s.!?？。~"'”’)\]😊🙂]+$/u, '');
  return clean.slice(-2);
}

/** 붙여넣은 글에서 맨 아래 "─────" 이후 집계 영역을 잘라낸다 */
function stripFooter(text: string): string {
  const idx = text.search(/\n\s*[─━—-]{5,}/);
  return idx === -1 ? text : text.slice(0, idx);
}

export function checkDraft(raw: string, keywordRaw: string, titleOverride = ''): CheckResult {
  const keyword = keywordRaw.trim();
  const text = stripFooter(raw.replace(/\r\n/g, '\n')).trim();
  const lines = text.split('\n');

  // 제목: 따로 입력이 없으면 첫 줄을 제목으로 본다
  let title = titleOverride.trim();
  let bodyLines = lines;
  if (!title) {
    const firstIdx = lines.findIndex((l) => l.trim());
    title = firstIdx === -1 ? '' : lines[firstIdx].replace(/^#\s*/, '').replace(/^제목\s*[:：]\s*/, '').trim();
    bodyLines = lines.slice(firstIdx + 1);
  }
  const body = bodyLines.join('\n').trim();
  const bodyForCount = body.replace(/\[사진\s*\d+\]/g, '').replace(/^#{2,3}\s+/gm, '');
  const bodyChars = bodyForCount.replace(/\n/g, '').length;
  const bodyCharsNoSpace = bodyForCount.replace(/\s/g, '').length;

  const items: CheckItem[] = [];
  const add = (id: string, label: string, status: Status, detail: string, weight: number) =>
    items.push({ id, label, status, detail, weight });

  // 1. 글자수
  if (bodyChars >= RULES.minChars && bodyChars <= RULES.maxChars) {
    add('chars', '본문 글자수', 'pass', `${bodyChars}자 (공백 포함) — 목표 ${RULES.minChars}~${RULES.maxChars}자`, 12);
  } else {
    const gap = bodyChars < RULES.minChars ? `${RULES.minChars - bodyChars}자 부족 → 경험·공감 문단을 늘리세요` : `${bodyChars - RULES.maxChars}자 초과 → 설명 문단을 줄이세요 (도입부·마무리는 유지)`;
    const near = bodyChars >= RULES.minChars - 150 && bodyChars <= RULES.maxChars + 200;
    add('chars', '본문 글자수', near ? 'warn' : 'fail', `${bodyChars}자 (공백 포함) — ${gap}`, 12);
  }

  // 2. 키워드
  const kwCount = keyword ? countOccurrences(body, keyword) : 0;
  if (!keyword) {
    add('keyword', '메인 키워드 반복', 'fail', '메인 키워드를 입력하세요', 12);
  } else if (kwCount < RULES.minKeyword) {
    add('keyword', '메인 키워드 반복', kwCount >= 3 ? 'warn' : 'fail', `"${keyword}" ${kwCount}회 — 최소 ${RULES.minKeyword}회 필요 (${RULES.minKeyword - kwCount}회 더)`, 12);
  } else if (kwCount > RULES.maxKeyword) {
    add('keyword', '메인 키워드 반복', 'warn', `"${keyword}" ${kwCount}회 — 너무 많아요. 억지 반복은 저품질 신호, 일부는 '이곳/이 메뉴' 등으로 받으세요`, 12);
  } else {
    add('keyword', '메인 키워드 반복', 'pass', `"${keyword}" ${kwCount}회`, 12);
  }

  // 2-1. 한 문장에 키워드 몰아넣기
  const sentences = splitSentences(body);
  if (keyword) {
    const stuffed = sentences.filter((s) => countOccurrences(s, keyword) >= 2);
    add(
      'stuffing',
      '키워드 몰아넣기 없음',
      stuffed.length ? 'warn' : 'pass',
      stuffed.length ? `한 문장에 2번 이상: "${stuffed[0].slice(0, 40)}…"` : '한 문장에 한 번씩만 들어가 있어요',
      4,
    );
  }

  // 3. 제목
  if (!title) {
    add('title', '제목', 'fail', '첫 줄에 제목을 넣거나 제목 칸에 입력하세요', 8);
  } else {
    const tLen = title.length;
    const hasKw = keyword && title.includes(keyword);
    const frontKw = hasKw && title.indexOf(keyword) <= Math.ceil(tLen / 2);
    const adInTitle = AD_PHRASES.find((p) => title.includes(p));
    const problems: string[] = [];
    if (!hasKw) problems.push('키워드 없음');
    else if (!frontKw) problems.push('키워드를 앞쪽으로');
    if (tLen < RULES.titleMin) problems.push(`짧음(${tLen}자)`);
    if (tLen > RULES.titleMax) problems.push(`김(${tLen}자)`);
    if (adInTitle) problems.push(`광고 단어 "${adInTitle}"`);
    add(
      'title',
      '제목',
      problems.length === 0 ? 'pass' : !hasKw || adInTitle ? 'fail' : 'warn',
      `"${title}" (${tLen}자)${problems.length ? ' — ' + problems.join(', ') : ' — 키워드 앞쪽, 길이 적당'}`,
      8,
    );
  }

  // 4. 소제목
  const subheads = bodyLines.map((l) => l.trim()).filter((l) => l && SUBHEAD_RE.test(l) && l.length <= 60);
  const sentenceLike = subheads.filter((s) => /(다|요|죠|까|가|니다|[?？!])\s*[.!?？]?$/.test(s.replace(/[#■▶【】\[\]]/g, '').trim()));
  if (subheads.length === RULES.subheadings) {
    add(
      'subheads',
      '소제목 3개 · 문장형',
      sentenceLike.length === subheads.length ? 'pass' : 'warn',
      sentenceLike.length === subheads.length ? '3개 모두 문장형' : `문장형이 아닌 소제목: ${subheads.filter((s) => !sentenceLike.includes(s)).join(' / ')}`,
      10,
    );
  } else {
    add('subheads', '소제목 3개 · 문장형', 'fail', `${subheads.length}개 감지 — 정확히 3개, 줄 앞에 "## "를 붙여 표시하세요`, 10);
  }

  // 5. 경험 표현
  const exp = (body.match(EXPERIENCE_RE) || []).length;
  add(
    'experience',
    '내 경험·해석',
    exp >= RULES.minExperience ? 'pass' : exp >= 2 ? 'warn' : 'fail',
    `경험 표현 ${exp}회 (저는/제가/저희/직접/해보니…) — 최소 ${RULES.minExperience}회`,
    12,
  );

  // 6. 마지막 문장 질문
  const lastLine = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !/^#/.test(l) && !/^\[사진/.test(l) && !/^#\S/.test(l))
    .pop() || '';
  add(
    'question',
    '마지막 문장 = 독자 질문',
    QUESTION_END_RE.test(lastLine) ? 'pass' : 'fail',
    lastLine ? `"${lastLine.slice(-40)}"` : '본문이 비어 있어요',
    10,
  );

  // 7. 같은 어미 3연속
  let streak = 1;
  let worst = '';
  for (let k = 1; k < sentences.length; k++) {
    if (ending(sentences[k]) === ending(sentences[k - 1]) && ending(sentences[k])) {
      streak++;
      if (streak >= 3 && !worst) worst = `"~${ending(sentences[k])}" 3연속: "${sentences[k].slice(0, 30)}…"`;
    } else streak = 1;
  }
  add('ending', '같은 어미 3연속 없음', worst ? 'warn' : 'pass', worst || '어미 리듬 괜찮아요', 6);

  // 8. 문단 길이 (모바일 가독성)
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const longParas = paragraphs.filter((p) => p.split('\n').length > 3 || p.replace(/\n/g, '').length > 160);
  add(
    'paragraph',
    '모바일 가독성 (2~3줄마다 띄우기)',
    longParas.length === 0 ? 'pass' : longParas.length <= 2 ? 'warn' : 'fail',
    longParas.length === 0 ? `문단 ${paragraphs.length}개, 모두 짧아요` : `긴 문단 ${longParas.length}개: "${longParas[0].slice(0, 30)}…"`,
    8,
  );

  // 9. AI 냄새 표현
  const aiHits = AI_PHRASES.filter((p) => body.includes(p) || title.includes(p));
  add('ai', 'AI 냄새 표현 없음', aiHits.length === 0 ? 'pass' : aiHits.length <= 1 ? 'warn' : 'fail', aiHits.length ? `발견: ${aiHits.join(', ')}` : '깔끔해요', 8);

  // 10. 광고성 표현 · 외부 링크
  const adHits = AD_PHRASES.filter((p) => body.includes(p));
  const links = (body.match(/https?:\/\/\S+/g) || []).length;
  const adProblems = [...adHits.map((h) => `"${h}"`), ...(links > 1 ? [`외부 링크 ${links}개`] : [])];
  add('ad', '광고성 표현 · 외부링크', adProblems.length ? 'warn' : 'pass', adProblems.length ? `홈피드 감점 위험: ${adProblems.join(', ')}` : '광고 티 없음', 6);

  // 11. 사진 표시
  const photos = (body.match(/\[사진\s*\d+\]/g) || []).length;
  add('photos', '사진 자리 표시', photos >= RULES.minPhotos ? 'pass' : photos >= 3 ? 'warn' : 'fail', `[사진N] ${photos}개 — 최소 ${RULES.minPhotos}개 (직접 찍은 사진 권장)`, 6);

  // 12. 몰입 문장
  add('immersion', '몰입 유지 문장', IMMERSION_RE.test(body) ? 'pass' : 'warn', IMMERSION_RE.test(body) ? '스크롤을 멈추는 문장이 있어요' : '"근데 여기서 많이들 놓칩니다" 같은 문장을 1~2개 넣어보세요', 4);

  // 13. 도입부 — 첫 문단에 결론 누설/인사말
  const intro = paragraphs.slice(0, 2).join(' ');
  const introBad = /(안녕하세요|오늘은 .{0,20}(소개|알아|정리))/.test(intro);
  add('intro', '도입부 (인사말 없이 상황으로 시작)', introBad ? 'warn' : 'pass', introBad ? '인사말/"오늘은 ~ 소개" 대신 실제 장면으로 시작하세요' : '상황으로 바로 들어가요', 4);

  const total = items.reduce((s, it) => s + it.weight, 0);
  const got = items.reduce((s, it) => s + (it.status === 'pass' ? it.weight : it.status === 'warn' ? it.weight * 0.5 : 0), 0);
  const raw100 = total ? Math.round((got / total) * 100) : 0;
  // 필수 규칙이 하나라도 '수정'이면 발행 가능 점수(80)를 넘지 못하게
  const score = items.some((it) => it.status === 'fail') ? Math.min(raw100, 79) : raw100;

  return { title, bodyChars, bodyCharsNoSpace, keywordCount: kwCount, items, score };
}
