import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules/html2canvas/dist')));

// ---------- 유튜브 영상 정보 가져오기 ----------

function getVideoId(url) {
  const m = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=|embed\/|live\/|v\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function fetchYoutubeInfo(url) {
  const id = getVideoId(url);
  if (!id) throw new Error('유튜브 링크 형식이 올바르지 않아요.');

  const info = { id, title: '', channel: '', description: '', transcript: '' };

  // 1) 제목·채널 (oEmbed)
  try {
    const r = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
    );
    if (r.ok) {
      const j = await r.json();
      info.title = j.title || '';
      info.channel = j.author_name || '';
    }
  } catch {}

  // 2) 설명·자막 (영상 페이지)
  try {
    const r = await fetch(`https://www.youtube.com/watch?v=${id}&hl=ko`, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'ko-KR,ko;q=0.9' },
    });
    const html = await r.text();

    const desc = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
    if (desc) info.description = JSON.parse(`"${desc[1]}"`);

    const tracksMatch = html.match(/"captionTracks":(\[.*?\])/);
    if (tracksMatch) {
      const tracks = JSON.parse(tracksMatch[1]);
      const track =
        tracks.find((t) => t.languageCode === 'ko') ||
        tracks.find((t) => t.languageCode?.startsWith('en')) ||
        tracks[0];
      if (track?.baseUrl) {
        const xml = await (await fetch(track.baseUrl, { headers: { 'User-Agent': UA } })).text();
        info.transcript = [...xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)]
          .map((m) => decodeEntities(decodeEntities(m[1])).replace(/\s+/g, ' ').trim())
          .filter(Boolean)
          .join(' ');
      }
    }
  } catch {}

  if (!info.title && !info.description && !info.transcript) {
    throw new Error('영상 정보를 가져오지 못했어요. 영상 내용(자막)을 직접 붙여넣어 주세요.');
  }
  return info;
}

app.post('/api/youtube', async (req, res) => {
  try {
    res.json(await fetchYoutubeInfo(req.body.url));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ---------- 카드뉴스 생성 ----------

const SYSTEM_PROMPT = `당신은 한국 인스타그램 카드뉴스 전문 에디터입니다.
주어진 자료(주제, 유튜브 영상 제목/설명/자막, 메모)를 바탕으로 저장·공유하고 싶어지는 카드뉴스를 만듭니다.

규칙
- 1장은 표지: 스크롤을 멈추게 하는 짧고 강한 제목(15자 안팎)과 부제 한 줄.
- 중간 장: 한 장에 핵심 하나. 제목은 20자 이내, 본문은 2~4줄(한 줄 20자 안팎), 모바일에서 한눈에 읽히게.
- 마지막 장: 요약 또는 행동 유도(저장/공유/댓글).
- 자료에 없는 사실·숫자는 지어내지 않습니다. 영상 내용을 참고했다면 영상의 핵심 흐름을 따릅니다.
- 이모지는 장마다 1개만.
- 반드시 아래 JSON 형식만 출력하고 다른 말은 쓰지 않습니다.

{
  "cards": [
    { "type": "cover" | "content" | "outro", "emoji": "💡", "title": "...", "body": "줄바꿈은 \\n 사용" }
  ],
  "caption": "인스타그램 게시글 캡션 (3~6줄)",
  "hashtags": ["#태그", "..."]
}`;

function buildUserPrompt({ topic, notes, tone, cardCount, video }) {
  const parts = [`카드 장수: ${cardCount}장 (표지와 마지막 장 포함)`, `말투: ${tone}`];
  if (topic) parts.push(`주제: ${topic}`);
  if (video) {
    parts.push(
      `참고 유튜브 영상\n- 제목: ${video.title || '(없음)'}\n- 채널: ${video.channel || '(없음)'}\n- 설명: ${
        video.description || '(없음)'
      }\n- 자막/내용:\n${(video.transcript || '(없음)').slice(0, 15000)}`
    );
  }
  if (notes) parts.push(`추가 메모/요청:\n${notes}`);
  return parts.join('\n\n');
}

function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('AI 응답을 해석하지 못했어요. 다시 시도해 주세요.');
  return JSON.parse(text.slice(start, end + 1));
}

app.post('/api/generate', async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: '.env 파일에 ANTHROPIC_API_KEY를 넣어 주세요.' });
  }
  const { topic = '', notes = '', tone = '친근한 반말', cardCount = 6, video = null } = req.body;
  if (!topic.trim() && !video && !notes.trim()) {
    return res.status(400).json({ error: '주제나 유튜브 영상 중 하나는 입력해 주세요.' });
  }

  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt({
            topic: topic.trim(),
            notes: notes.trim(),
            tone,
            cardCount: Math.min(Math.max(Number(cardCount) || 6, 3), 10),
            video,
          }),
        },
      ],
    });
    const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    res.json(extractJson(text));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || '생성 중 오류가 났어요.' });
  }
});

app.listen(PORT, () => {
  console.log(`카드뉴스 AI 실행 중 → http://localhost:${PORT}`);
});
