import React, { useEffect, useMemo, useState } from 'react';
import { Check, ClipboardCopy, Sparkles, FolderOpen, Zap, RotateCcw, ExternalLink } from 'lucide-react';
import projectInstructions from '../../blog-automation/PROJECT_INSTRUCTIONS.md?raw';
import {
  ACCOUNT_PRESETS,
  AccountType,
  EMPTY_INPUT,
  FIELD_LABELS,
  ROLES,
  StudioInput,
  buildQuickPrompt,
} from './roles';
import { checkDraft, RULES, Status } from './checker';

const STORAGE_KEY = 'blog_studio_input_v1';

function loadInput(): StudioInput {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...EMPTY_INPUT, ...JSON.parse(saved) };
  } catch {
    // 저장소 접근 불가 시 기본값
  }
  return EMPTY_INPUT;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

function CopyButton({ text, label = '프롬프트 복사' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
        done ? 'bg-[#03C75A] text-white' : 'bg-[#C84B31] hover:bg-[#a83c26] text-white'
      }`}
    >
      {done ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
      {done ? '복사됨 — Claude에 붙여넣기' : label}
    </button>
  );
}

const inputCls =
  'w-full rounded-lg border border-[#2D2D2D]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C84B31]/40';

function Field({
  label,
  hint,
  children,
  highlight,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <label className={`block rounded-lg ${highlight ? 'ring-2 ring-[#FFA94D] ring-offset-2 ring-offset-[#FCF9F4]' : ''}`}>
      <span className="block text-xs font-bold text-[#2D2D2D] mb-1">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-[#2D2D2D]/55 mt-1">{hint}</span>}
    </label>
  );
}

const STATUS_STYLE: Record<Status, string> = {
  pass: 'bg-[#03C75A]/10 text-[#027a38] border-[#03C75A]/30',
  warn: 'bg-[#FFA94D]/15 text-[#9a5300] border-[#FFA94D]/40',
  fail: 'bg-[#C84B31]/10 text-[#C84B31] border-[#C84B31]/30',
};
const STATUS_LABEL: Record<Status, string> = { pass: '통과', warn: '보완', fail: '수정' };

function DraftChecker({ input }: { input: StudioInput }) {
  const result = useMemo(() => checkDraft(input.draft, input.keyword, input.chosenTitle), [input.draft, input.keyword, input.chosenTitle]);
  if (!input.draft.trim()) {
    return (
      <div className="rounded-xl border border-dashed border-[#2D2D2D]/20 p-5 text-sm text-[#2D2D2D]/60">
        왼쪽 <b>초안</b> 칸에 Claude가 쓴 글을 붙여넣으면 홈피드 기준으로 바로 점검합니다.
      </div>
    );
  }
  const color = result.score >= 85 ? '#03C75A' : result.score >= 65 ? '#FFA94D' : '#C84B31';
  return (
    <div className="rounded-xl border border-[#2D2D2D]/10 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="text-4xl font-black" style={{ color }}>
          {result.score}
          <span className="text-base font-bold text-[#2D2D2D]/50">/100</span>
        </div>
        <div className="text-xs text-[#2D2D2D]/70 leading-relaxed">
          본문 {result.bodyChars}자 (공백 제외 {result.bodyCharsNoSpace}자)
          <br />
          키워드 {result.keywordCount}회 · 목표 {RULES.minChars}~{RULES.maxChars}자 / {RULES.minKeyword}회 이상
        </div>
      </div>
      <ul className="space-y-2">
        {result.items.map((it) => (
          <li key={it.id} className="flex gap-2 items-start text-sm">
            <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded border ${STATUS_STYLE[it.status]}`}>
              {STATUS_LABEL[it.status]}
            </span>
            <span className="min-w-0">
              <b>{it.label}</b>
              <span className="block text-xs text-[#2D2D2D]/65 break-words">{it.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type TabId = 'setup' | 'quick' | string;

export default function BlogStudio() {
  const [input, setInput] = useState<StudioInput>(loadInput);
  const [tab, setTab] = useState<TabId>('setup');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
    } catch {
      // 무시
    }
  }, [input]);

  const set = <K extends keyof StudioInput>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setInput((prev) => ({ ...prev, [k]: e.target.value }));

  const role = ROLES.find((r) => r.id === tab);
  const needs = new Set<keyof StudioInput>(role ? role.needs : tab === 'quick' ? ['keyword', 'topic', 'experience', 'photos'] : []);
  const prompt = role ? role.build(input) : tab === 'quick' ? buildQuickPrompt(input) : projectInstructions;
  const missing = [...needs].filter((k) => typeof input[k] === 'string' && !(input[k] as string).trim());

  const tabs: { id: TabId; label: string; sub: string }[] = [
    { id: 'setup', label: 'Step 0', sub: '프로젝트 지침' },
    { id: 'quick', label: '⚡ 빠른 모드', sub: '한 번에 완성' },
    ...ROLES.map((r) => ({ id: r.id, label: `${r.no}. ${r.name}`, sub: r.ko })),
  ];

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#2D2D2D]">
      <header className="border-b border-[#2D2D2D]/10 bg-[#FCF9F4]/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-[#C84B31] flex items-center gap-2">
              <Sparkles className="w-5 h-5 shrink-0" />
              <span className="truncate">홈피드 블로그 자동화</span>
            </h1>
            <p className="text-[11px] text-[#2D2D2D]/60 truncate">Claude 8역할 프롬프트 + 홈피드 자동 점검 · 입력값은 이 브라우저에만 저장</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('입력한 내용을 모두 지울까요?')) setInput(EMPTY_INPUT);
            }}
            className="shrink-0 inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#2D2D2D]/15 hover:bg-white"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 초기화
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-5 grid lg:grid-cols-[360px_1fr] gap-6">
        {/* 입력 패널 */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2">
          <Field label={FIELD_LABELS.account}>
            <select className={inputCls} value={input.account} onChange={set('account')}>
              {(Object.keys(ACCOUNT_PRESETS) as AccountType[]).map((k) => (
                <option key={k} value={k}>
                  {ACCOUNT_PRESETS[k].label}
                </option>
              ))}
            </select>
          </Field>
          {input.account === 'custom' && (
            <Field label={FIELD_LABELS.customAccount} hint="누가, 누구에게, 어떤 이야기를 쓰는 블로그인지">
              <textarea rows={3} className={inputCls} value={input.customAccount} onChange={set('customAccount')} />
            </Field>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label={FIELD_LABELS.keyword} highlight={needs.has('keyword')}>
              <input className={inputCls} value={input.keyword} onChange={set('keyword')} placeholder="순천 회식 장소" />
            </Field>
            <Field label={FIELD_LABELS.region}>
              <input className={inputCls} value={input.region} onChange={set('region')} placeholder="순천 연향동" />
            </Field>
          </div>
          <Field label={FIELD_LABELS.topic} highlight={needs.has('topic')}>
            <input className={inputCls} value={input.topic} onChange={set('topic')} placeholder="20명 회식 장소 고를 때 총무가 놓치는 것" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={FIELD_LABELS.niche} highlight={needs.has('niche')}>
              <input className={inputCls} value={input.niche} onChange={set('niche')} placeholder="순천 맛집·회식" />
            </Field>
            <Field label={FIELD_LABELS.audience} highlight={needs.has('audience')}>
              <input className={inputCls} value={input.audience} onChange={set('audience')} placeholder="회식 잡는 총무" />
            </Field>
          </div>
          <Field label={FIELD_LABELS.experience} hint="홈피드 핵심! 실제 있었던 일·숫자·손님 반응을 메모처럼" highlight={needs.has('experience')}>
            <textarea
              rows={5}
              className={inputCls}
              value={input.experience}
              onChange={set('experience')}
              placeholder={'지난주 금요일 25명 단체 예약\n당일 인원 늘어서 테이블 다시 붙임\n총무님이 주차 제일 먼저 물어봄'}
            />
          </Field>
          <Field label={FIELD_LABELS.photos} highlight={needs.has('photos')}>
            <textarea rows={3} className={inputCls} value={input.photos} onChange={set('photos')} placeholder={'단체석 전체샷, 숯불 굽는 장면, 간장찜닭 클로즈업'} />
          </Field>
          <Field label={FIELD_LABELS.keywordData} hint="네이버 데이터랩·검색광고 키워드도구 결과 (선택)" highlight={needs.has('keywordData')}>
            <textarea rows={3} className={inputCls} value={input.keywordData} onChange={set('keywordData')} placeholder="순천 회식 1,200 / 순천 단체석 880 …" />
          </Field>
          <Field label={FIELD_LABELS.chosenTitle} hint="3번 Title Writer 결과에서 고른 제목" highlight={needs.has('chosenTitle')}>
            <input className={inputCls} value={input.chosenTitle} onChange={set('chosenTitle')} />
          </Field>
          <Field label={FIELD_LABELS.outline} hint="4번 결과를 붙여넣으면 5번 프롬프트에 들어갑니다 (선택)" highlight={needs.has('outline')}>
            <textarea rows={4} className={inputCls} value={input.outline} onChange={set('outline')} />
          </Field>
          <Field label={FIELD_LABELS.draft} hint="Claude가 쓴 초안 → 6번에서 자동 점검" highlight={needs.has('draft')}>
            <textarea rows={6} className={inputCls} value={input.draft} onChange={set('draft')} />
          </Field>
          <Field label={FIELD_LABELS.stats} hint="블로그 > 통계에서 복사 (8번용)" highlight={needs.has('stats')}>
            <textarea rows={4} className={inputCls} value={input.stats} onChange={set('stats')} placeholder="제목 | 조회수 | 홈피드% | 평균 사용시간 | 공감 | 댓글" />
          </Field>
        </aside>

        {/* 결과 패널 */}
        <main className="min-w-0 space-y-4">
          <nav className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 text-left rounded-xl px-3 py-2 border transition-colors ${
                  tab === t.id ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]' : 'bg-white border-[#2D2D2D]/10 hover:border-[#C84B31]/50'
                }`}
              >
                <span className="block text-xs font-black whitespace-nowrap">{t.label}</span>
                <span className={`block text-[11px] whitespace-nowrap ${tab === t.id ? 'text-white/70' : 'text-[#2D2D2D]/55'}`}>{t.sub}</span>
              </button>
            ))}
          </nav>

          <section className="rounded-2xl bg-white border border-[#2D2D2D]/10 p-4 sm:p-6 space-y-4">
            {tab === 'setup' ? (
              <div className="space-y-2">
                <h2 className="text-lg font-black flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-[#C84B31]" /> Claude 프로젝트 만들기
                </h2>
                <ol className="text-sm text-[#2D2D2D]/80 list-decimal pl-5 space-y-1">
                  <li>claude.ai → Projects → <b>New project</b> → 이름 "네이버 블로그 자동화"</li>
                  <li>아래 지침을 복사해서 프로젝트 <b>Instructions(지침)</b> 칸에 붙여넣기</li>
                  <li>프로젝트 지식에 경험 메모·매장 정보·지난 통계 파일 업로드</li>
                  <li>이후 각 Step 탭의 프롬프트를 복사해 그 프로젝트 안 대화창에 붙여넣기</li>
                </ol>
              </div>
            ) : tab === 'quick' ? (
              <div>
                <h2 className="text-lg font-black flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#C84B31]" /> 빠른 모드 — 제목·목차·본문·점검을 한 번에
                </h2>
                <p className="text-sm text-[#2D2D2D]/70 mt-1">키워드·주제·경험 메모만 채우고 복사하세요. 결과 본문은 왼쪽 초안 칸에 붙여 6번에서 점검합니다.</p>
              </div>
            ) : (
              role && (
                <div>
                  <h2 className="text-lg font-black">
                    {role.no}. {role.name} <span className="text-[#C84B31]">· {role.ko}</span>
                  </h2>
                  <p className="text-sm text-[#2D2D2D]/70 mt-1">{role.summary}</p>
                </div>
              )
            )}

            {missing.length > 0 && (
              <p className="text-xs rounded-lg bg-[#FFA94D]/15 text-[#9a5300] px-3 py-2">
                채우면 더 좋아요: {missing.map((k) => FIELD_LABELS[k]).join(', ')} (왼쪽 주황 테두리 칸)
              </p>
            )}

            {tab === 'seo' && <DraftChecker input={input} />}

            <div className="flex flex-wrap items-center gap-2">
              <CopyButton text={prompt} label={tab === 'setup' ? '지침 복사' : '프롬프트 복사'} />
              <a
                href="https://claude.ai/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold border border-[#2D2D2D]/15 hover:bg-[#FCF9F4]"
              >
                Claude 열기 <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-xs text-[#2D2D2D]/50">{prompt.length.toLocaleString()}자</span>
            </div>

            <pre className="whitespace-pre-wrap break-words text-[13px] leading-relaxed bg-[#FCF9F4] rounded-xl p-4 max-h-[60vh] overflow-y-auto border border-[#2D2D2D]/5 font-[inherit]">
              {prompt}
            </pre>
          </section>

          <section className="rounded-2xl border border-[#03C75A]/30 bg-[#03C75A]/5 p-4 text-sm text-[#2D2D2D]/80">
            <b className="text-[#027a38]">업로드는 직접</b> — 네이버 블로그 글쓰기 오픈 API는 종료되어 자동 발행보다 수동 업로드가 안전합니다.
            최종본을 편집기에 붙여넣고 <b>[사진N] 자리에 직접 찍은 사진</b>을 넣은 뒤, 대표사진·태그를 설정해 발행하세요.
          </section>
        </main>
      </div>
    </div>
  );
}
