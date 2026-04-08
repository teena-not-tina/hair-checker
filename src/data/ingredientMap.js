export const scalpTypeMap = {
  oily: {
    label: '지성',
    good: [
      { name: '살리실릭애씨드 (BHA)', reason: '두피 각질과 피지를 효과적으로 제거' },
      { name: '티트리 오일', reason: '항균 효과로 지성 두피 환경 개선' },
      { name: '징크피리치온', reason: '피지 조절 및 항균 작용' },
      { name: '나이아신아마이드', reason: '피지 분비 조절, 두피 장벽 강화' },
    ],
    bad: [
      { name: '실리콘 (디메치콘 등)', reason: '두피에 잔여물이 쌓여 모공 막힘 유발' },
      { name: '무거운 오일류 (미네랄 오일)', reason: '유분 과다로 두피 환경 악화' },
    ],
  },
  dry: {
    label: '건성',
    good: [
      { name: '판테놀 (덱스판테놀)', reason: '두피 보습 및 진정 효과' },
      { name: '히알루론산', reason: '수분 공급 및 보습 유지' },
      { name: '세라마이드', reason: '두피 장벽 강화, 수분 손실 방지' },
      { name: '글리세린', reason: '보습 효과, 두피 건조 완화' },
    ],
    bad: [
      { name: 'SLS / SLES', reason: '강한 세정력으로 두피 건조 악화' },
      { name: '알코올 (변성 알코올)', reason: '두피 수분을 빼앗아 건조함 심화' },
    ],
  },
  sensitive: {
    label: '민감성',
    good: [
      { name: '알란토인', reason: '두피 진정 및 자극 완화' },
      { name: '병풀추출물 (센텔라)', reason: '진정 및 피부 재생 효과' },
      { name: '판테놀', reason: '보습과 진정 효과' },
      { name: '캐모마일 추출물', reason: '항염 및 진정 작용' },
    ],
    bad: [
      { name: 'SLS / SLES', reason: '민감한 두피에 강한 자극' },
      { name: '파라벤', reason: '알레르기 및 두피 자극 가능' },
      { name: '인공향료', reason: '민감성 두피에 자극 유발' },
      { name: '인공색소', reason: '불필요한 화학 자극' },
    ],
  },
  combination: {
    label: '복합성',
    good: [
      { name: '나이아신아마이드', reason: '유수분 밸런스 조절' },
      { name: '판테놀', reason: '건조한 부위 보습, 전체 진정' },
      { name: '살리실릭애씨드 (저농도)', reason: '지성 부위 각질 관리' },
    ],
    bad: [
      { name: 'SLS / SLES', reason: '건조한 부위를 더 자극할 수 있음' },
      { name: '무거운 실리콘', reason: '지성 부위 모공 막힘 가능' },
    ],
  },
};

export const damageMap = {
  healthy: { label: '건강', good: [{ name: '비오틴', reason: '모발 건강 유지에 도움' }], bad: [] },
  slight: {
    label: '약간 손상',
    good: [
      { name: '케라틴', reason: '모발 단백질 보충' },
      { name: '판테놀', reason: '모발 보습 및 탄력' },
    ],
    bad: [],
  },
  severe: {
    label: '심한 손상',
    good: [
      { name: '가수분해 케라틴', reason: '손상된 모발 구조 복구' },
      { name: '아르간 오일', reason: '깊은 보습과 윤기 부여' },
      { name: '콜라겐', reason: '모발 탄력 강화' },
      { name: '단백질 복합체', reason: '모발 내부 강화' },
    ],
    bad: [{ name: '강한 계면활성제', reason: '이미 약해진 모발을 더 손상' }],
  },
};

export const hairTypeMap = {
  'thin-straight': {
    label: '가는 직모',
    good: [{ name: '케라틴 (경량)', reason: '볼륨과 탄력 부여' }, { name: '비오틴', reason: '모발 강화' }],
    bad: [{ name: '무거운 오일류', reason: '가는 모발을 눌러 볼륨 저하' }, { name: '고농도 실리콘', reason: '모발에 무거움을 줌' }],
  },
  'thin-wavy': {
    label: '가는 곱슬/웨이브',
    good: [{ name: '경량 보습제 (글리세린)', reason: '웨이브 유지하며 가볍게 보습' }, { name: '호호바 오일', reason: '가벼운 오일로 곱슬 관리' }],
    bad: [{ name: '무거운 버터류 (시어버터)', reason: '가는 모발을 납작하게 만듦' }],
  },
  'thick-straight': {
    label: '굵은 직모',
    good: [{ name: '세라마이드', reason: '모발 장벽 강화' }, { name: '아르간 오일', reason: '윤기와 부드러움' }],
    bad: [],
  },
  'thick-wavy': {
    label: '굵은 곱슬/웨이브',
    good: [{ name: '시어버터', reason: '곱슬 모발에 깊은 보습' }, { name: '코코넛 오일', reason: '곱슬 관리 및 윤기' }, { name: '글리세린', reason: '수분 공급으로 푸석함 방지' }],
    bad: [{ name: '설페이트 (SLS)', reason: '곱슬 모발의 수분을 과도하게 제거' }],
  },
};

export const treatmentMap = {
  dyeing: {
    label: '염색',
    good: [{ name: '자외선 차단 성분', reason: '색상 유지에 도움' }, { name: '단백질 / 콜라겐', reason: '염색으로 인한 손상 복구' }],
    bad: [{ name: '강한 설페이트', reason: '색 빠짐 촉진' }],
  },
  perm: {
    label: '파마/매직',
    good: [{ name: '케라틴', reason: '파마로 변형된 모발 구조 보강' }, { name: '보습 성분 (히알루론산)', reason: '건조해진 모발 수분 공급' }],
    bad: [],
  },
  bleach: {
    label: '탈색',
    good: [{ name: '고농도 단백질', reason: '심하게 손상된 모발 필수 보충' }, { name: '오라플렉스 계열', reason: '결합 복구 기능' }, { name: '아르간 오일', reason: '극손상 모발 보습' }],
    bad: [{ name: 'SLS / SLES', reason: '극손상 모발에 추가 자극' }, { name: '알코올 함유 제품', reason: '건조함 심화' }],
  },
  none: { label: '없음', good: [], bad: [] },
};

export const concernMap = {
  grayHair: {
    label: '새치',
    good: [{ name: '비오틴', reason: '모발 건강 유지' }, { name: '구리 펩타이드', reason: '멜라닌 생성 지원' }],
    bad: [],
  },
  hairLoss: {
    label: '탈모',
    good: [
      { name: '카페인', reason: '두피 혈류 촉진, 모낭 활성화 (임상 검증)' },
      { name: '비오틴', reason: '케라틴 생성 촉진' },
      { name: '나이아신아마이드', reason: '두피 혈액순환 개선' },
      { name: '덱스판테놀', reason: '두피 환경 개선' },
    ],
    bad: [],
  },
  dryness: {
    label: '건조함',
    good: [{ name: '히알루론산', reason: '강력한 수분 보유력' }, { name: '글리세린', reason: '수분 공급 및 보습' }, { name: '아르간 오일', reason: '깊은 보습과 윤기' }],
    bad: [{ name: '알코올 (변성)', reason: '수분 탈취로 건조함 악화' }],
  },
  volume: {
    label: '볼륨 부족',
    good: [{ name: '케라틴 (경량)', reason: '모발에 탄력 부여' }, { name: '비오틴', reason: '모발 굵기 개선' }],
    bad: [{ name: '무거운 실리콘/오일', reason: '모발을 눌러 볼륨 감소' }],
  },
  scalpTrouble: {
    label: '두피 트러블',
    good: [{ name: '병풀추출물', reason: '항염 및 진정' }, { name: '티트리 오일', reason: '항균 효과' }, { name: '알란토인', reason: '자극 완화' }],
    bad: [{ name: '인공향료', reason: '트러블 악화 가능' }, { name: '파라벤', reason: '두피 자극' }],
  },
  dandruff: {
    label: '비듬',
    good: [{ name: '징크피리치온', reason: '대표적 항균 성분, 비듬 근본 케어' }, { name: '피록톤올아민', reason: '항균으로 비듬 억제' }, { name: '클림바졸', reason: '항진균 효과' }],
    bad: [],
  },
};

export const categoryAdvice = {
  shampoo: '샴푸는 두피 세정이 핵심이므로, 두피 타입에 맞는 계면활성제와 기능성 성분을 우선 확인하세요.',
  treatment: '트리트먼트/컨디셔너는 모발 중간~끝에 사용하므로, 모발 손상도에 맞는 보습·단백질 성분이 중요합니다.',
  essence: '에센스/오일은 마무리 단계 제품이므로, 모발 굵기에 맞는 제형(가벼운 미스트 vs 풍부한 오일)을 선택하세요.',
  unknown: '모발 상태를 기준으로 가장 필요한 제품 유형을 안내해드릴게요.',
};

export function generateCriteria(profile) {
  const { scalpType, damageLevel, hairType, treatments, concerns } = profile;
  let goodIngredients = [];
  let badIngredients = [];

  if (scalpType && scalpType !== 'unknown' && scalpTypeMap[scalpType]) {
    goodIngredients.push(...scalpTypeMap[scalpType].good);
    badIngredients.push(...scalpTypeMap[scalpType].bad);
  }
  if (damageLevel && damageLevel !== 'unknown' && damageMap[damageLevel]) {
    goodIngredients.push(...damageMap[damageLevel].good);
    badIngredients.push(...damageMap[damageLevel].bad);
  }
  if (hairType && hairType !== 'unknown' && hairTypeMap[hairType]) {
    goodIngredients.push(...hairTypeMap[hairType].good);
    badIngredients.push(...hairTypeMap[hairType].bad);
  }
  if (treatments && treatments.length > 0) {
    treatments.forEach((t) => { if (treatmentMap[t]) { goodIngredients.push(...treatmentMap[t].good); badIngredients.push(...treatmentMap[t].bad); } });
  }
  if (concerns && concerns.length > 0) {
    concerns.forEach((c) => { if (concernMap[c]) { goodIngredients.push(...concernMap[c].good); badIngredients.push(...concernMap[c].bad); } });
  }

  // 모두 "모르겠어요"일 때 범용 기본 기준 제공
  if (goodIngredients.length === 0 && badIngredients.length === 0) {
    goodIngredients = [
      { name: '판테놀', reason: '보습과 진정에 두루 효과적인 범용 성분' },
      { name: '나이아신아마이드', reason: '두피 장벽 강화 및 유수분 밸런스 조절' },
      { name: '비오틴', reason: '모발 건강 유지에 기본적으로 도움' },
    ];
    badIngredients = [
      { name: 'SLS / SLES', reason: '자극이 강할 수 있는 세정 성분' },
      { name: '파라벤', reason: '민감한 두피에 자극 가능성' },
      { name: '인공향료', reason: '불필요한 화학 자극 요소' },
    ];
  }

  const uniqueGood = [];
  const seenGood = new Set();
  goodIngredients.forEach((item) => { if (!seenGood.has(item.name)) { seenGood.add(item.name); uniqueGood.push(item); } });

  const uniqueBad = [];
  const seenBad = new Set();
  badIngredients.forEach((item) => { if (!seenBad.has(item.name)) { seenBad.add(item.name); uniqueBad.push(item); } });

  return { good: uniqueGood, bad: uniqueBad };
}

export function getProfileTags(profile) {
  const tags = [];
  if (profile.scalpType && profile.scalpType !== 'unknown') {
    const map = { oily: '지성 두피', dry: '건성 두피', sensitive: '민감성 두피', combination: '복합성 두피' };
    tags.push({ text: map[profile.scalpType], type: 'info' });
  }
  if (profile.damageLevel && profile.damageLevel !== 'unknown') {
    const map = { healthy: '건강한 모발', slight: '약간 손상', severe: '심한 손상' };
    const type = profile.damageLevel === 'severe' ? 'danger' : profile.damageLevel === 'slight' ? 'warning' : 'default';
    tags.push({ text: map[profile.damageLevel], type });
  }
  if (profile.hairType && profile.hairType !== 'unknown') {
    const map = { 'thin-straight': '가는 직모', 'thin-wavy': '가는 곱슬', 'thick-straight': '굵은 직모', 'thick-wavy': '굵은 곱슬' };
    tags.push({ text: map[profile.hairType], type: 'default' });
  }
  if (profile.treatments && profile.treatments.length > 0 && !profile.treatments.includes('none')) {
    const map = { dyeing: '염색', perm: '파마/매직', bleach: '탈색' };
    const text = profile.treatments.map((t) => map[t]).filter(Boolean).join(' · ');
    if (text) tags.push({ text: text + ' (1년 이내)', type: 'danger' });
  }
  if (profile.concerns && profile.concerns.length > 0 && !profile.concerns.includes('unknown')) {
    const map = { grayHair: '새치', hairLoss: '탈모', dryness: '건조함', volume: '볼륨 부족', scalpTrouble: '두피 트러블', dandruff: '비듬' };
    const text = profile.concerns.map((c) => map[c]).filter(Boolean).join(' · ');
    if (text) tags.push({ text, type: 'default' });
  }
  return tags;
}