# KCIS Client (정적 HTML)

GitHub Pages로 배포되는 KCIS 연명부 프론트엔드.

- 운영 URL: https://kcis-project.github.io/
- API 서버: http://168.110.112.119 (자동 감지 — localhost 일 땐 http://localhost:3000)

## 구조

```
docs/
├── index.html       # 메인 디렉토리 페이지 (GitHub Pages가 서빙)
└── bookmarklet.js   # LinkedIn 부킷마크릿 소스 (페이지 로드 시 동적으로 빌드되어 a[href=javascript:...]에 주입)
```

## 로컬 개발

```bash
cd docs
python3 -m http.server 5500
# 브라우저로 http://localhost:5500 접속
```

서버는 따로 띄워야 합니다 (`cd ../../server && npm run dev`).

`API_BASE` 는 hostname 기반으로 자동 분기됩니다 (`index.html` 상단 참고).

## 배포

GitHub Pages → Source: `main` 브랜치 / `/docs` 폴더.
`docs/` 안의 내용을 push 하면 자동 반영됩니다.

## LinkedIn 가져오기 (북마크릿)

1. 회원가입 모달의 "📎 KCIS LinkedIn 가져오기" 링크를 북마크바에 드래그
2. 본인 LinkedIn 프로필(`https://www.linkedin.com/in/...`)로 이동 → 북마크 클릭
3. 새 창으로 KCIS 등록 페이지가 열리고 폼이 자동으로 채워짐

서버는 LinkedIn 에 절대 접근하지 않습니다 — 사용자 본인 브라우저 세션으로 DOM 에서 추출.

## 기존 파일 (이관 중, 추후 제거 예정)

- `build_site.py`, `build_site_structured.py`, `server.py`, `Dockerfile`,
  `requirements.txt`, `supabase_setup.sql` : 이전 Flask + Supabase 시절 파일
- `directory_site/index.html` : Flask 시절 산출물 — `docs/index.html` 만 유지
