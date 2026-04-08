import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

function CompareResult({ results, profileTags, onAddMore, onGoToChecklist, onBack, onRestart }) {
  const captureRef = useRef(null);

  const sortedResults = [...results].sort((a, b) => b.score - a.score);
  const bestIndex = 0;

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return '적합';
    if (score >= 50) return '주의';
    return '비추천';
  };

  const handleSaveImage = async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = '모발검증_결과.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (e) {
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <p style={{ fontSize: '15px', fontWeight: 600, flex: 1 }}>
          {results.length > 1 ? '제품 비교 결과' : '분석 결과'}
        </p>
      </div>

      <div ref={captureRef} className="capture-area">
        {/* Profile bar */}
        <div className="profile-summary" style={{ marginBottom: '16px' }}>
          <p className="profile-label">분석 기준</p>
          <div className="profile-tags">
            {profileTags.map((tag, i) => (
              <span key={i} className={`tag tag-${tag.type}`}>{tag.text}</span>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        {sortedResults.map((result, index) => (
          <div
            key={index}
            className={`compare-card ${index === bestIndex && results.length > 1 ? 'best' : ''}`}
          >
            {index === bestIndex && results.length > 1 && (
              <div className="compare-badge">가장 적합</div>
            )}
            <div className="compare-header">
              <div>
                <p className="compare-product-name">{result.productName}</p>
                <p className="compare-product-type">{result.brand} · {result.category}</p>
              </div>
              <div className="compare-score">
                <p className="score-number" style={{ color: getScoreColor(result.score) }}>
                  {result.score}
                </p>
                <p className="score-max">/ 100</p>
              </div>
            </div>

            {/* Score bar */}
            <div className="score-bar">
              <div
                className="score-bar-fill"
                style={{
                  flex: result.score,
                  background: getScoreColor(result.score),
                }}
              />
              <div className="score-bar-empty" style={{ flex: 100 - result.score }} />
            </div>

            {/* Tags */}
            <div className="compare-tags">
              {result.goodMatches?.map((m, i) => (
                <span key={`g${i}`} className="compare-tag compare-tag-good">{m.name}</span>
              ))}
              {result.warnings?.map((m, i) => (
                <span key={`w${i}`} className="compare-tag compare-tag-warn">{m.name}</span>
              ))}
              {result.badMatches?.map((m, i) => (
                <span key={`b${i}`} className="compare-tag compare-tag-bad">{m.name}</span>
              ))}
            </div>

            {/* Detail breakdown */}
            {(result.goodMatches?.length > 0 || result.warnings?.length > 0 || result.badMatches?.length > 0) && (
              <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                {result.goodMatches?.map((m, i) => (
                  <p key={`gd${i}`} style={{ fontSize: '12px', color: 'var(--success-dark)', marginBottom: '4px' }}>
                    ✓ {m.name}: {m.reason}
                  </p>
                ))}
                {result.warnings?.map((m, i) => (
                  <p key={`wd${i}`} style={{ fontSize: '12px', color: 'var(--warning-dark)', marginBottom: '4px' }}>
                    ⚠ {m.name}: {m.reason}
                  </p>
                ))}
                {result.badMatches?.map((m, i) => (
                  <p key={`bd${i}`} style={{ fontSize: '12px', color: 'var(--danger-dark)', marginBottom: '4px' }}>
                    ✕ {m.name}: {m.reason}
                  </p>
                ))}
              </div>
            )}

            {result.tip && (
              <div className="tip-box" style={{ marginTop: '12px', marginBottom: 0 }}>
                <p className="tip-label">Tip</p>
                <p className="tip-text">{result.tip}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add More */}
      {results.length < 3 && (
        <button className="add-product-btn" onClick={onAddMore} style={{ marginTop: '8px' }}>
          + 제품 추가 비교
        </button>
      )}

      <div className="spacer" />

      <div className="bottom-actions">
        <button className="btn-primary" onClick={handleSaveImage}>
          결과 이미지로 저장
        </button>
        <button className="btn-secondary" onClick={onGoToChecklist}>
          구매 체크리스트 보기
        </button>
        <button className="btn-text" onClick={onRestart}>
          처음부터 다시하기
        </button>
      </div>
    </div>
  );
}

export default CompareResult;
