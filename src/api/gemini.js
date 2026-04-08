const isDev = process.env.NODE_ENV === 'development';

async function callGemini(prompt) {
  let data;

  if (isDev) {
    // 로컬: 직접 호출 (개발용)
    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024, thinkingConfig: { thinkingBudget: 0 } },
      }),
    });
    data = await response.json();
  } else {
    // 배포: 서버사이드로 호출
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    data = await response.json();
  }

  console.log('토큰:', { 입력: data.usageMetadata?.promptTokenCount, 출력: data.usageMetadata?.candidatesTokenCount });
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
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

JSON형식:
{"productName":"정식명","brand":"브랜드","category":"샴푸/트리트먼트/에센스","score":0-100,"summary":"10자요약","goodMatches":[{"name":"성분","reason":"이유","status":"good"}],"warnings":[{"name":"성분","reason":"이유","status":"warn"}],"badMatches":[{"name":"성분","reason":"이유","status":"bad"}],"tip":"15자팁"}

점수: 80+적합, 50-79주의, 0-49비추. 모르는 제품이면 {"error":true,"message":"제품정보없음"}`;

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

JSON형식:
{"productName":"직접입력","brand":"-","category":"-","score":0-100,"summary":"10자요약","goodMatches":[{"name":"성분","reason":"이유","status":"good"}],"warnings":[{"name":"성분","reason":"이유","status":"warn"}],"badMatches":[{"name":"성분","reason":"이유","status":"bad"}],"tip":"15자팁"}

점수: 80+적합, 50-79주의, 0-49비추.`;

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