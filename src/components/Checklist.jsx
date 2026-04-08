import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

function Checklist({ criteria, profileTags, profile, onBack, onRestart }) {
  const captureRef = useRef(null);

  const handleSaveImage = async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = '구매_체크리스트.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (e) {
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  };

  // Split good ingredients into must-have and nice-to-have
  const mustHave = criteria.good.slice(0, 3);
  const niceToHave = criteria.good.slice(3, 6);

  return (
    <div className="page fade-in">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <p style={{ fontSize: '15px', fontWeight: 600, flex: 1 }}>나의 구매 체크리스트</p>
      </div>

      <div ref={captureRef} className="capture-area">
        {/* Profile */}
        <div className="profile-summary">
          <p className="profile-label">나의 프로필</p>
          <div className="profile-tags">
            {profileTags.map((tag, i) => (
              <span key={i} className={`tag tag-${tag.type}`}>{tag.text}</span>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--gray-100)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            매장에서 제품 뒷면 전성분표를 확인하세요
          </p>
        </div>

        {/* Must Have */}
        {mustHave.length > 0 && (
          <div className="checklist-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div className="checklist-icon" style={{ background: 'var(--success-light)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success-dark)" strokeWidth="3">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
              <p style={{ fontSize: '15px', fontWeight: 600 }}>반드시 포함</p>
            </div>
            <div className="checklist-items">
              {mustHave.map((item, i) => (
                <p className="checklist-item" key={i}>{item.name}</p>
              ))}
            </div>
          </div>
        )}

        {/* Nice to Have */}
        {niceToHave.length > 0 && (
          <div className="checklist-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div className="checklist-icon" style={{ background: 'var(--warning-light)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning-dark)" strokeWidth="3">
                  <path d="M12 6v6M12 16v1" />
                </svg>
              </div>
              <p style={{ fontSize: '15px', fontWeight: 600 }}>있으면 좋은</p>
            </div>
            <div className="checklist-items">
              {niceToHave.map((item, i) => (
                <p className="checklist-item" key={i}>{item.name}</p>
              ))}
            </div>
          </div>
        )}

        {/* Avoid */}
        {criteria.bad.length > 0 && (
          <div className="checklist-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div className="checklist-icon" style={{ background: 'var(--danger-light)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger-dark)" strokeWidth="3">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </div>
              <p style={{ fontSize: '15px', fontWeight: 600 }}>피해야 할</p>
            </div>
            <div className="checklist-items">
              {criteria.bad.map((item, i) => (
                <p className="checklist-item" key={i}>
                  {item.name}
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                    ({item.reason})
                  </span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="tip-box">
          <p className="tip-label">Tip</p>
          <p className="tip-text">
            전성분표에서 SLS/SLES가 앞쪽(1~5번째)에 있으면 함량이 높은 것이니 피하세요. 
            원하는 성분이 중간 이상에 위치한 제품을 고르세요. 
            성분 함량은 전성분표 순서로 대략 유추할 수 있어요.
          </p>
        </div>
      </div>

      <div className="spacer" />

      <div className="bottom-actions">
        <button className="btn-primary" onClick={handleSaveImage}>
          이미지로 저장
        </button>
        <button className="btn-text" onClick={onRestart}>
          처음부터 다시하기
        </button>
      </div>
    </div>
  );
}

export default Checklist;
