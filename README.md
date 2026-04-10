# 💇‍♀️ Hair Checker — 헤어케어 성분 검증 서비스

> 구매 직전, 내 두피와 모발 상태 기준으로 이 제품이 맞는지 빠르게 판단할 수 있는 AI 기반 웹 서비스

🔗 **배포 링크:** [hair-checker.vercel.app](https://hair-checker.vercel.app)

---

## 문제

35~50세 한국 여성, 특히 염색·펌을 반복하는 여성은 헤어케어 제품을 고를 때 **"이 제품이 내 상태에 맞는지"** 확신이 없다. 리뷰를 봐도 개인 상황이 다르고, 성분을 봐도 판단 기준이 없다.

## 해결

**추천이 아닌 검증.** 4문항 문진으로 두피·모발 상태를 파악하고, 개인 맞춤 판단 기준을 생성한 뒤, 제품 성분을 해당 기준에 대입하여 적합도를 점수와 근거로 제시한다.

## 주요 기능

- **4문항 문진** — 두피 타입, 모발 상태(손상도+굵기), 시술 이력, 고민
- **개인 맞춤 기준 생성** — 추천 성분 / 주의 성분 자동 분류
- **AI 성분 분석** — 제품명 입력 또는 성분 직접 입력으로 분석
- **📷 성분표 OCR 촬영** — Clova OCR로 성분표 사진 → 텍스트 자동 추출
- **다중 비교** — 최대 3개 제품 점수 비교 + 성분별 판정 근거
- **매장용 체크리스트** — 이미지 저장 가능

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프론트엔드 | React (CRA, 모바일 최적화) |
| 백엔드 | Vercel Serverless Functions |
| AI 분석 | Gemini 2.5 Flash (thinkingBudget: 0) |
| OCR | Naver Clova OCR (API Gateway 연동) |
| 배포 | Vercel |

## 프로젝트 구조

```
hair-checker/
├── api/
│   ├── analyze.js          # Gemini API 서버사이드 프록시
│   └── ocr.js              # Clova OCR 서버사이드 프록시
├── src/
│   ├── api/
│   │   └── gemini.js       # AI 호출 (재시도 로직 포함)
│   ├── components/
│   │   ├── Landing.jsx      # 랜딩 페이지
│   │   ├── Survey.jsx       # 문진 (4문항, combo 타입)
│   │   ├── CriteriaResult.jsx # 기준 생성 결과
│   │   ├── ProductInput.jsx  # 제품 입력 + OCR
│   │   ├── CompareResult.jsx # 비교 결과
│   │   └── Checklist.jsx     # 구매 체크리스트
│   ├── data/
│   │   └── ingredientMap.js  # 성분 매핑 데이터
│   ├── App.jsx
│   └── index.css
└── public/
    └── images/              # 두피 타입 이미지
```

## 환경 변수

Vercel에 다음 환경 변수 설정 필요:

```
GEMINI_API_KEY=         # Google AI Studio에서 발급
CLOVA_OCR_SECRET=       # Naver Cloud OCR 시크릿 키
CLOVA_OCR_URL=          # Clova OCR API Gateway invoke URL
```

## 로컬 실행

```bash
npm install
npm start
```

로컬에서는 `.env`에 `REACT_APP_GEMINI_API_KEY`를 설정하면 Gemini 직접 호출, 배포 환경에서는 `/api/analyze`로 서버사이드 프록시를 통해 호출.

## 주요 개선 사항

- **429/503 재시도** — exponential backoff (5초→10초→15초, 최대 3회)
- **SLS 맥락별 판정** — 지성 두피에는 "주의", 건성/민감성에는 "비추천"으로 분류
- **범용 기본 기준** — 모든 문항 "모르겠어요" 선택 시 자동 적용
- **OCR 연동** — 사용자 테스트 피드백 반영, 제품명 모르는 경우 대응
