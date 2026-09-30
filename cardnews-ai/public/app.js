const $ = (id) => document.getElementById(id);

const THEMES = [
  { name: '밤하늘', bg: 'linear-gradient(160deg,#1b1740,#3a2b8f)', text: '#ffffff', accent: '#ffd84d' },
  { name: '크림', bg: '#fbf5ea', text: '#2b2118', accent: '#ff8a3d' },
  { name: '민트', bg: 'linear-gradient(160deg,#d9fbef,#a6ecd6)', text: '#0f3b33', accent: '#11a683' },
  { name: '코랄', bg: 'linear-gradient(160deg,#ff7a6b,#ffb36b)', text: '#ffffff', accent: '#2b1a55' },
  { name: '블랙', bg: '#111114', text: '#f2f2f2', accent: '#b6ff3b' },
  { name: '화이트', bg: '#ffffff', text: '#16161a', accent: '#5b4bff' },
];

const state = { video: null, data: null, theme: THEMES[0], brand: '' };

// ---------- 테마 ----------
function renderThemes() {
  $('themes').innerHTML = '';
  THEMES.forEach((t) => {
    const b = document.createElement('button');
    b.className = 'theme-chip' + (t === state.theme ? ' active' : '');
    b.title = t.name;
    b.style.background = t.bg;
    b.onclick = () => {
      state.theme = t;
      renderThemes();
      applyTheme();
    };
    $('themes').appendChild(b);
  });
}
function applyTheme() {
  document.querySelectorAll('.card').forEach((c) => {
    c.style.setProperty('--c-bg', state.theme.bg);
    c.style.setProperty('--c-text', state.theme.text);
    c.style.setProperty('--c-accent', state.theme.accent);
  });
}

// ---------- 상태 표시 ----------
function setStatus(msg, isError = false) {
  $('status').textContent = msg;
  $('status').className = 'status' + (isError ? ' error' : '');
}

async function postJson(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `요청 실패 (${r.status})`);
  return j;
}

// ---------- 유튜브 불러오기 ----------
$('ytBtn').onclick = async () => {
  const url = $('ytUrl').value.trim();
  if (!url) return setStatus('유튜브 링크를 넣어 주세요.', true);
  $('ytBtn').disabled = true;
  setStatus('영상 정보를 가져오는 중…');
  try {
    const v = await postJson('/api/youtube', { url });
    state.video = v;
    if (v.transcript) $('transcript').value = v.transcript;
    if (!$('topic').value && v.title) $('topic').value = v.title;
    $('ytInfo').innerHTML = `
      <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" />
      <div><b></b><br><span></span><br><small></small></div>`;
    $('ytInfo').querySelector('b').textContent = v.title || '(제목 없음)';
    $('ytInfo').querySelector('span').textContent = v.channel || '';
    $('ytInfo').querySelector('small').textContent = v.transcript
      ? `자막 ${v.transcript.length.toLocaleString()}자 불러옴`
      : '자막이 없어요. 영상 내용을 직접 붙여넣으면 더 정확해져요.';
    $('ytInfo').classList.remove('hidden');
    setStatus('영상 정보를 불러왔어요.');
  } catch (e) {
    state.video = null;
    setStatus(e.message, true);
  } finally {
    $('ytBtn').disabled = false;
  }
};

// ---------- 생성 ----------
$('genBtn').onclick = async () => {
  const transcript = $('transcript').value.trim();
  const ytUrl = $('ytUrl').value.trim();
  let video = null;
  if (state.video || transcript) {
    video = { ...(state.video || {}), transcript };
    if (!video.title && ytUrl) video.title = ytUrl;
  }

  $('genBtn').disabled = true;
  setStatus('AI가 카드뉴스를 쓰는 중… (10~30초)');
  try {
    const data = await postJson('/api/generate', {
      topic: $('topic').value,
      notes: $('notes').value,
      tone: $('tone').value,
      cardCount: Number($('cardCount').value),
      video,
    });
    state.data = data;
    renderCards();
    setStatus(`완성! ${data.cards.length}장을 만들었어요.`);
  } catch (e) {
    setStatus(e.message, true);
  } finally {
    $('genBtn').disabled = false;
  }
};

// ---------- 카드 렌더링 ----------
function renderCards() {
  const { cards, caption = '', hashtags = [] } = state.data;
  const box = $('cards');
  box.innerHTML = '';

  cards.forEach((c, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'card-wrap';

    const card = document.createElement('div');
    card.className = `card ${c.type || 'content'}`;
    card.innerHTML = `
      <div class="page">${i + 1} / ${cards.length}</div>
      <div class="emoji" contenteditable="true"></div>
      <div class="title" contenteditable="true"></div>
      ${c.body ? '<div class="body" contenteditable="true"></div>' : ''}
      <div class="brand" contenteditable="true"></div>`;
    card.querySelector('.emoji').textContent = c.emoji || '';
    card.querySelector('.title').textContent = c.title || '';
    if (c.body) card.querySelector('.body').textContent = c.body.replace(/\\n/g, '\n');
    card.querySelector('.brand').textContent = state.brand || '@내계정';

    const tools = document.createElement('div');
    tools.className = 'tools';
    tools.innerHTML = `<span>${i + 1}장</span>`;
    const dl = document.createElement('button');
    dl.textContent = 'PNG 저장';
    dl.onclick = () => downloadCard(card, i + 1);
    tools.appendChild(dl);

    wrap.append(card, tools);
    box.appendChild(wrap);
  });

  applyTheme();

  // 계정명은 한 장에서 고치면 모든 장에 반영
  box.querySelectorAll('.brand').forEach((el) =>
    el.addEventListener('input', () => {
      state.brand = el.textContent;
      box.querySelectorAll('.brand').forEach((o) => o !== el && (o.textContent = el.textContent));
    })
  );

  $('caption').value = `${caption}\n\n${hashtags.join(' ')}`.trim();
  $('captionBox').classList.remove('hidden');
  $('dlAll').disabled = false;
}

// ---------- 저장 ----------
async function cardToBlob(card) {
  document.activeElement?.blur();
  const scale = 1080 / card.offsetWidth;
  card.classList.add('exporting');
  const canvas = await html2canvas(card, { scale, backgroundColor: null, useCORS: true });
  card.classList.remove('exporting');
  return new Promise((res) => canvas.toBlob(res, 'image/png'));
}
function saveBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
async function downloadCard(card, n) {
  saveBlob(await cardToBlob(card), `cardnews_${String(n).padStart(2, '0')}.png`);
}
$('dlAll').onclick = async () => {
  $('dlAll').disabled = true;
  const cards = [...document.querySelectorAll('.card')];
  for (let i = 0; i < cards.length; i++) {
    setStatus(`저장 중… ${i + 1}/${cards.length}`);
    await downloadCard(cards[i], i + 1);
    await new Promise((r) => setTimeout(r, 300));
  }
  setStatus('모두 저장했어요.');
  $('dlAll').disabled = false;
};

$('copyCaption').onclick = async () => {
  await navigator.clipboard.writeText($('caption').value);
  $('copyCaption').textContent = '복사됨!';
  setTimeout(() => ($('copyCaption').textContent = '복사'), 1500);
};

renderThemes();
