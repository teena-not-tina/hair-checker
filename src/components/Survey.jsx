import React, { useState } from 'react';

const QUESTIONS = [
  {
    id: 'scalpType',
    title: '두피 타입이\n어떤 편인가요?',
    subtitle: '하나를 선택해주세요',
    type: 'single',
    options: [
      { value: 'oily', label: '지성', desc: '오후만 되면 기름지고 떡짐' },
      { value: 'dry', label: '건성', desc: '각질이 일어나고 당김' },
      { value: 'sensitive', label: '민감성', desc: '쉽게 붉어지고 트러블' },
      { value: 'combination', label: '복합성', desc: '부위마다 지성/건성 다름' },
      { value: 'unknown', label: '모르겠어요', desc: '', muted: true },
    ],
  },
  {
    id: 'damageLevel',
    title: '모발 손상 정도는\n어떤가요?',
    subtitle: '하나를 선택해주세요',
    type: 'single',
    options: [
      { value: 'healthy', label: '건강해요', desc: '윤기 있고 탄력 있음' },
      { value: 'slight', label: '약간 손상', desc: '끝이 갈라지거나 푸석함' },
      { value: 'severe', label: '심한 손상', desc: '전체적으로 건조하고 끊어짐' },
      { value: 'unknown', label: '모르겠어요', desc: '', muted: true },
    ],
  },
  {
    id: 'hairType',
    title: '모발 굵기와 형태는요?',
    subtitle: '하나를 선택해주세요',
    type: 'single',
    options: [
      { value: 'thin-straight', label: '가는 직모', desc: '힘없이 처지고 볼륨이 잘 안 살아요' },
      { value: 'thin-wavy', label: '가는 곱슬/웨이브', desc: '부스스하고 정리가 잘 안 돼요' },
      { value: 'thick-straight', label: '굵은 직모', desc: '뻣뻣하고 머리숱이 많아 보여요' },
      { value: 'thick-wavy', label: '굵은 곱슬/웨이브', desc: '풍성하지만 건조하고 부풀어요' },
      { value: 'unknown', label: '모르겠어요', desc: '', muted: true },
    ],
  },
  {
    id: 'treatments',
    title: '최근 1년 이내\n시술을 하셨나요?',
    subtitle: '해당하는 것을 모두 선택해주세요',
    type: 'multi',
    options: [
      { value: 'dyeing', label: '염색' },
      { value: 'perm', label: '파마/매직' },
      { value: 'bleach', label: '탈색' },
      { value: 'none', label: '안 했어요' },
    ],
  },
  {
    id: 'concerns',
    title: '가장 고민되는 것은\n무엇인가요?',
    subtitle: '해당하는 것을 모두 선택해주세요',
    type: 'multi',
    options: [
      { value: 'grayHair', label: '새치' },
      { value: 'hairLoss', label: '탈모' },
      { value: 'dryness', label: '건조함' },
      { value: 'volume', label: '볼륨 부족' },
      { value: 'scalpTrouble', label: '두피 트러블' },
      { value: 'dandruff', label: '비듬' },
      { value: 'unknown', label: '모르겠어요' },
    ],
  },
];

function Survey({ mode, onComplete, onBack }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = QUESTIONS[currentQ];
  const totalQ = QUESTIONS.length;
  const progress = ((currentQ + 1) / totalQ) * 100;

  const handleSingleSelect = (value) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleMultiSelect = (value) => {
    const current = answers[question.id] || [];
    
    // "none" or "unknown" clears others
    if (value === 'none' || value === 'unknown') {
      setAnswers({ ...answers, [question.id]: [value] });
      return;
    }
    
    // Remove "none"/"unknown" when selecting other options
    let updated = current.filter((v) => v !== 'none' && v !== 'unknown');
    
    if (updated.includes(value)) {
      updated = updated.filter((v) => v !== value);
    } else {
      updated = [...updated, value];
    }
    
    setAnswers({ ...answers, [question.id]: updated });
  };

  const isSelected = (value) => {
    if (question.type === 'single') return answers[question.id] === value;
    return (answers[question.id] || []).includes(value);
  };

  const canProceed = () => {
    if (question.type === 'single') return !!answers[question.id];
    return (answers[question.id] || []).length > 0;
  };

  const handleNext = () => {
    if (currentQ < totalQ - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="page fade-in" key={currentQ}>
      <div className="page-header">
        <button className="back-button" onClick={handlePrev}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">{currentQ + 1}/{totalQ}</span>
      </div>

      <h1 className="page-title" style={{ whiteSpace: 'pre-line' }}>{question.title}</h1>
      <p className="page-subtitle">{question.subtitle}</p>

      {question.type === 'single' ? (
        <div className="options-list">
          {question.options.map((opt) => (
            <div
              key={opt.value}
              className={`option-card ${isSelected(opt.value) ? 'selected' : ''} ${opt.muted ? 'option-muted' : ''}`}
              onClick={() => handleSingleSelect(opt.value)}
            >
              {!opt.muted && question.id === 'scalpType' && (
                <div className="option-icon">
                  <img src={`/images/scalp-${opt.value}.png`} alt={opt.label} />
                </div>
              )}
              <div>
                <p className="option-label">{opt.label}</p>
                {opt.desc && <p className="option-desc">{opt.desc}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="chips-grid">
          {question.options.map((opt) => (
            <div
              key={opt.value}
              className={`chip ${isSelected(opt.value) ? 'selected' : ''}`}
              onClick={() => handleMultiSelect(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      <div className="spacer" />
      <div className="bottom-actions">
        <button className="btn-primary" onClick={handleNext} disabled={!canProceed()}>
          {currentQ < totalQ - 1 ? '다음' : '분석 시작'}
        </button>
      </div>
    </div>
  );
}

export default Survey;