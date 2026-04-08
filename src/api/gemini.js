const isDev = process.env.NODE_ENV === 'development';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callGemini(prompt, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      let response;

      if (isDev) {
        const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 1024, thinkingConfig: { thinkingBudget: 0 } },
          }),
        });
      } else {
        response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
      }

      if (response.status === 429 || response.status === 503) {
        const waitSec = (attempt + 1) * 5;
        const reason = response.status === 429 ? 'rate limit' : '서버 일시 장애';
        console.log(`${response.status} ${reason}, ${waitSec}초 후 재시도 (${attempt + 1}/${retries})`);
        if (attempt < retries - 1) {
          await sleep(waitSec * 1000);
          continue;
        }
        throw new Error('AI 서버가 일시적으로 불안정해요. 잠시 후 다시 시도해주세요.');
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) throw new Error('AI 응답이 비어있습니다. 다시 시도해주세요.');
      return text;

    } catch (e) {
      if (attempt === retries - 1) throw e;
      if (!e.message.includes('서버') && !e.message.includes('429') && !e.message.includes('rate limit')) throw e;
    }
  }
}

function parseJSON(raw) {
  try {
    return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
  } catch (e) {
    console.error('JSON parse failed:', raw);
    return { error: true, message: '분석 결과를 처리하는 중 오류가 발생했습니다.' };
  }
}

export async function analyzeProduct(productName, criteria, profileTags) {
  const good = criteria.good.map(i => i.name).join(', ');
  const bad = criteria.bad.map(i => i.name).join(', ');
  const profile = profileTags.map(t => t.text).join(', ');

  const prompt = `헤어케어 성분 전문가로서 답변. 반드시 JSON만 출력.

프로필: ${profile}
좋은성분: ${good}
나쁜성분: ${bad}
제품: ${productName}

성분판정기준:
- 나쁜성분이라도 전성분표 뒤쪽(소량)이면 warnings로 분류
- SLS/SLES: 지성두피에는 세정력이 필요하므로 warnings(주의)로. 건성/민감성이면 badMatches
- 실리콘: 트리트먼트/에센스에서는 코팅효과로 warnings. 샴푸에서 지성두피면 badMatches
- 알코올: 변성알코올만 주의. 세틸알코올/세테아릴알코올은 보습 성분이므로 goodMatches 가능
- 함량 추정: 전성분표 순서가 앞(1~5번)이면 고함량→영향 큼, 뒤쪽이면 저함량→영향 작음

JSON형식:
{"productName":"정식명","brand":"브랜드","category":"샴푸/트리트먼트/에센스","score":0-100,"summary":"10자요약","goodMatches":[{"name":"성분","reason":"이유","status":"good"}],"warnings":[{"name":"성분","reason":"주의이유와맥락","status":"warn"}],"badMatches":[{"name":"성분","reason":"이유","status":"bad"}],"tip":"15자팁"}

점수: 85+매우적합, 70-84적합, 50-69주의필요, 0-49비추천. 모르는 제품이면 {"error":true,"message":"제품정보없음"}`;

  return parseJSON(await callGemini(prompt));
}

export async function analyzeIngredients(ingredientText, criteria, profileTags) {
  const good = criteria.good.map(i => i.name).join(', ');
  const bad = criteria.bad.map(i => i.name).join(', ');
  const profile = profileTags.map(t => t.text).join(', ');

  const prompt = `헤어케어 성분 전문가로서 답변. 반드시 JSON만 출력.

프로필: ${profile}
좋은성분: ${good}
나쁜성분: ${bad}
성분목록: ${ingredientText}

성분판정기준:
- 나쁜성분이라도 전성분표 뒤쪽(소량)이면 warnings로 분류
- SLS/SLES: 지성두피에는 세정력이 필요하므로 warnings(주의)로. 건성/민감성이면 badMatches
- 실리콘: 트리트먼트/에센스에서는 코팅효과로 warnings. 샴푸에서 지성두피면 badMatches
- 알코올: 변성알코올만 주의. 세틸알코올/세테아릴알코올은 보습 성분이므로 goodMatches 가능
- 함량 추정: 전성분표 순서가 앞(1~5번)이면 고함량→영향 큼, 뒤쪽이면 저함량→영향 작음

JSON형식:
{"productName":"직접입력","brand":"-","category":"-","score":0-100,"summary":"10자요약","goodMatches":[{"name":"성분","reason":"이유","status":"good"}],"warnings":[{"name":"성분","reason":"주의이유와맥락","status":"warn"}],"badMatches":[{"name":"성분","reason":"이유","status":"bad"}],"tip":"15자팁"}

점수: 85+매우적합, 70-84적합, 50-69주의필요, 0-49비추천.`;

  return parseJSON(await callGemini(prompt));
}

export async function getRecommendation(criteria, profileTags, productCategory) {
  const good = criteria.good.map(i => i.name).join(', ');
  const bad = criteria.bad.map(i => i.name).join(', ');
  const profile = profileTags.map(t => t.text).join(', ');

  const prompt = `헤어케어 전문가. JSON만 출력.

프로필: ${profile}
제품유형: ${productCategory}
좋은성분: ${good}
나쁜성분: ${bad}

{"additionalTips":["팁1","팁2","팁3"],"recommendedType":"추천제형","avoidType":"피할제형"}`;

  return parseJSON(await callGemini(prompt));
}