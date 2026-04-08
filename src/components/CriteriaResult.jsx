import React from 'react';

function CriteriaResult({ criteria, profileTags, mode, onGoToProducts, onGoToChecklist, onBack }) {
  return (
    <div className="page fade-in">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <p style={{ fontSize: '15px', fontWeight: 600, flex: 1 }}>나의 분석 기준</p>
      </div>

      {/* Profile Summary */}
      <div className="profile-summary">
        <p className="profile-label">나의 프로필</p>
        <div className="profile-tags">
          {profileTags.map((tag, i) => (
            <span key={i} className={`tag tag-${tag.type}`}>{tag.text}</span>
          ))}
        </div>
      </div>

      {/* Good Ingredients */}
      {criteria.good.length > 0 && (
        <div className="ingredient-section">
          <div className="section-header">
            <div className="section-dot" style={{ background: 'var(--success)' }} />
            <p className="section-title">필요한 성분</p>
          </div>
          {criteria.good.map((item, i) => (
            <div className="ingredient-card" key={i}>
              <p className="ingredient-name" style={{ color: 'var(--success-dark)' }}>{item.name}</p>
              <p className="ingredient-reason">{item.reason}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bad Ingredients */}
      {criteria.bad.length > 0 && (
        <div className="ingredient-section">
          <div className="section-header">
            <div className="section-dot" style={{ background: 'var(--danger)' }} />
            <p className="section-title">피해야 할 성분</p>
          </div>
          {criteria.bad.map((item, i) => (
            <div className="ingredient-card" key={i}>
              <p className="ingredient-name" style={{ color: 'var(--danger-dark)' }}>{item.name}</p>
              <p className="ingredient-reason">{item.reason}</p>
            </div>
          ))}
        </div>
      )}

      <div className="spacer" />

      <div className="bottom-actions">
        <button className="btn-primary" onClick={onGoToProducts}>
          {mode === 'verify' ? '제품 검증하기' : '제품 검증하기'}
        </button>
        <button className="btn-text" onClick={onGoToChecklist}>
          구매 체크리스트로 보기
        </button>
      </div>
    </div>
  );
}

export default CriteriaResult;
