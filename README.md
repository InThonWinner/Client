# KUnnect - React Application

고려대학교 정보대학 학생들을 위한 포트폴리오 관리 및 경험 데이터 기반 챗봇 서비스입니다.

## 주요 기능

### 1. 인증 시스템
- **회원가입**: 이메일, 비밀번호, 실명, 닉네임, 전화번호, 역할, 학번, 소속 정보 입력
- **인증**: 학생 인증 페이지를 통한 본인 확인
- **로그인/로그아웃**: JWT 토큰 기반 인증

### 2. 포트폴리오 관리
- **포트폴리오 조회**: 자신의 포트폴리오를 시각적으로 확인
- **포트폴리오 편집**: 
  - 이름, 소속, 연락처 정보 수정
  - 기술스택, 경력, 프로젝트, 활동 및 수상 경력 관리
  - 각 섹션별 공개/비공개 설정 (토글 스위치)
  - 실시간 저장 및 반영

### 3. AI 챗봇 서비스
- **대화형 챗봇**: 선배들의 실제 경험 데이터 기반 질의응답
- **채팅 세션 관리**: 
  - 여러 채팅 세션 생성 및 관리
  - 세션별 대화 기록 저장 및 불러오기
  - 새 채팅 시작 기능
- **RAG 기반 응답**: ChromaDB 검색 결과를 활용한 정확한 답변 제공

### 4. 커뮤니티 피드
- **피드 조회**: 카테고리별 게시글 필터링
  - 진로/공부 방향 (STUDY_PATH)
  - 수업/과목 관련 (COURSE)
  - 프로젝트/활동 (PROJECT)
  - 취업/인턴 (CAREER)
  - 기타 (ETC)
- **게시글 작성**: 제목, 내용, 카테고리, 익명 여부 설정
- **게시글 조회**: 개별 게시글 상세 보기

## 기술 스택

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM 6
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Styling**: CSS3 (컴포넌트별 CSS 모듈)

## 프로젝트 구조

```
├── public/
│   └── images/              # 정적 이미지 파일
│       ├── logo.png
│       ├── emblem.png
│       ├── profile.png
│       └── image2.png
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── LandingPage.jsx      # 랜딩 페이지
│   │   ├── SignupPage.jsx       # 회원가입 페이지
│   │   ├── CertificationPage.jsx # 학생 인증 페이지
│   │   ├── LoginPage.jsx        # 로그인 페이지
│   │   ├── PortfolioPage.jsx    # 포트폴리오 조회 페이지
│   │   ├── PortfolioEditPage.jsx # 포트폴리오 편집 페이지
│   │   ├── ChatbotPage.jsx      # 챗봇 페이지
│   │   ├── FeedPage.jsx         # 피드 목록 페이지
│   │   ├── FeedWritePage.jsx    # 게시글 작성 페이지
│   │   ├── FeedReadPage.jsx     # 게시글 조회 페이지
│   │   └── ProtectedRoute.jsx   # 인증 보호 라우트
│   ├── services/            # API 서비스 레이어
│   │   ├── api.js              # Axios 인스턴스 및 인터셉터
│   │   ├── authService.js       # 인증 관련 API
│   │   ├── portfolioService.js  # 포트폴리오 관련 API
│   │   ├── chatbotService.js    # 챗봇 관련 API
│   │   ├── feedService.js       # 피드 관련 API
│   │   └── postsService.js      # 게시글 관련 API
│   ├── config/
│   │   └── api.js              # API 엔드포인트 설정
│   ├── App.jsx              # 메인 앱 컴포넌트 (라우팅)
│   ├── main.jsx             # 애플리케이션 진입점
│   └── index.css            # 전역 스타일
├── package.json
├── vite.config.js
└── README.md
```

## 시작하기

### 사전 요구사항

- Node.js (v16 이상)
- npm 또는 yarn

### 설치

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정 (선택사항):
`.env` 파일을 생성하고 다음 변수를 설정하세요:
```env
VITE_API_BASE_URL=https://nestjs-app-5cg35pg3yq-uc.a.run.app
```

3. 개발 서버 실행:
```bash
npm run dev
```

4. 브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 프로덕션 빌드 미리보기

```bash
npm run preview
```

## 라우트 구조

### 공개 라우트
- `/` - 랜딩 페이지
- `/signup` - 회원가입 페이지
- `/signup/certification` - 학생 인증 페이지
- `/login` - 로그인 페이지

### 보호된 라우트 (로그인 필요)
- `/portfolio` - 포트폴리오 조회 페이지
- `/portfolio/edit` - 포트폴리오 편집 페이지
- `/chatbot` - 챗봇 페이지
- `/feed` - 피드 목록 페이지
- `/feed/write` - 게시글 작성 페이지
- `/feed/:id` - 게시글 상세 조회 페이지

## 주요 기능 상세

### 포트폴리오 관리
- 각 섹션(기술스택, 경력, 프로젝트, 활동 및 수상 경력, 연락처, 소속)의 공개/비공개 설정
- 실시간 편집 및 저장
- 사용자 실명 자동 표시

### 챗봇 서비스
- 세션 기반 대화 관리
- AI 응답 자동 저장
- 대화 기록 불러오기
- 반응형 디자인으로 다양한 화면 크기 지원

### 커뮤니티 피드
- 카테고리별 필터링
- 익명 게시글 작성
- 게시글 상세 조회

## API 엔드포인트

### 인증
- `POST /api/user/register` - 회원가입
- `POST /api/user/login` - 로그인
- `POST /api/user/logout` - 로그아웃
- `GET /api/user/me` - 현재 사용자 정보 조회

### 포트폴리오
- `GET /portfolio/me` - 내 포트폴리오 조회
- `GET /portfolio/user/:userId` - 특정 사용자 포트폴리오 조회
- `PATCH /portfolio/display-name` - 이름 수정
- `PATCH /portfolio/affiliation` - 소속 수정
- `PATCH /portfolio/contact` - 연락처 수정
- `PATCH /portfolio/tech-stack` - 기술스택 수정
- `PATCH /portfolio/career` - 경력 수정
- `PATCH /portfolio/projects` - 프로젝트 수정
- `PATCH /portfolio/activities-awards` - 활동 및 수상 경력 수정

### 챗봇
- `POST /chat/sessions` - 새 채팅 세션 생성
- `GET /chat/sessions` - 채팅 세션 목록 조회
- `GET /chat/sessions/:sessionId` - 특정 세션 조회
- `GET /chat/sessions/:sessionId/messages` - 세션 메시지 조회
- `POST /chat/sessions/:sessionId/messages` - 메시지 전송
- `DELETE /chat/sessions/:sessionId` - 세션 삭제

### AI
- `POST /ai/chat` - AI 챗봇 질의응답

### 피드
- `GET /posts` - 게시글 목록 조회
- `GET /posts/:id` - 게시글 상세 조회
- `POST /posts` - 게시글 작성
- `PATCH /posts/:id` - 게시글 수정
- `DELETE /posts/:id` - 게시글 삭제

## 개발

### 코드 스타일
- ESLint를 사용한 코드 품질 관리
- React Hooks를 활용한 상태 관리
- 컴포넌트별 CSS 모듈을 사용한 스타일링

### 주요 개발 도구
- **Vite**: 빠른 개발 서버 및 빌드
- **React Router**: 클라이언트 사이드 라우팅
- **Axios**: HTTP 클라이언트 및 인터셉터
- **React Hooks**: 함수형 컴포넌트 상태 관리

## 라이선스

이 프로젝트는 고려대학교 정보대학 2025 Inthon 프로젝트입니다.

## 기여

프로젝트에 기여하고 싶으시다면 이슈를 생성하거나 풀 리퀘스트를 보내주세요.
