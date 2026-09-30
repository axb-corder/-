# 🪄 카드뉴스 AI

주제를 쓰거나 **유튜브 링크**를 넣으면 AI(Claude)가 인스타그램 카드뉴스(1080×1080)와 캡션·해시태그를 만들어 주는 도구입니다.

## 기능
- 유튜브 링크 → 제목·설명·자막 자동 불러오기 (자막을 못 가져오면 직접 붙여넣기)
- 주제 / 추가 요청 / 말투 / 장수(4~10장) 선택
- 디자인 테마 6종, 카드 글자는 클릭해서 바로 수정
- 카드별 또는 전체 PNG 저장 (1080×1080)
- 캡션 + 해시태그 복사

## 실행 방법
```bash
cd cardnews-ai
npm install
cp .env.example .env   # .env 파일에 ANTHROPIC_API_KEY 입력
npm start
```
브라우저에서 http://localhost:3000 을 엽니다.

## 파일 구조
- `server.js` — 유튜브 정보 가져오기(`/api/youtube`), 카드뉴스 생성(`/api/generate`)
- `public/` — 화면 (index.html, style.css, app.js)
