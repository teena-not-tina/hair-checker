import React from 'react';

function Landing({ onSelect }) {
  return (
    <div className="page fade-in">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="landing-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D5A3D" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <p className="landing-badge">모발 성분 검증 서비스</p>
          <h1 className="landing-title">
            내 머리카락에<br />맞는 제품일까?
          </h1>
          <p className="landing-desc">
            두피와 모발 상태를 분석하고<br />
            제품 성분을 검증해드려요
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="landing-entry" onClick={() => onSelect('verify')}>
            <p className="landing-entry-title">제품이 있어요</p>
            <p className="landing-entry-desc">고민 중인 제품이 나에게 맞는지 검증할게요</p>
          </div>
          <div className="landing-entry" onClick={() => onSelect('recommend')}>
            <p className="landing-entry-title">추천해주세요</p>
            <p className="landing-entry-desc">내 상태에 맞는 성분 기준을 알려드려요</p>
          </div>
        </div>
      </div>

      <p className="landing-footer" style={{ marginTop: '32px' }}>
        AI 기반 성분 분석 · 개인정보 수집 없음
      </p>
    </div>
  );
}

export default Landing;
