import React, { useState } from 'react';
import { analyzeProduct, analyzeIngredients } from '../api/gemini';

function ProductInput({ criteria, profileTags, existingResults, onAnalysisComplete, onBack }) {
  const [productName, setProductName] = useState('');
  const [ingredientText, setIngredientText] = useState('');
  const [products, setProducts] = useState(existingResults || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputMode, setInputMode] = useState('product'); // 'product' or 'ingredient'

  const handleAddProduct = async () => {
    if (!productName.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeProduct(productName.trim(), criteria, profileTags);
      
      if (result.error) {
        setError(result.message);
      } else {
        setProducts([...products, result]);
        setProductName('');
      }
    } catch (e) {
      setError(e.message || '분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeIngredients = async () => {
    if (!ingredientText.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeIngredients(ingredientText.trim(), criteria, profileTags);
      
      if (result.error) {
        setError(result.message);
      } else {
        setProducts([...products, result]);
        setIngredientText('');
      }
    } catch (e) {
      setError(e.message || '분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleAddProduct();
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
        <p style={{ fontSize: '15px', fontWeight: 600, flex: 1 }}>제품 분석</p>
      </div>

      <h1 className="page-title">검증할 제품을<br />입력해주세요</h1>
      <p className="page-subtitle">최대 3개까지 비교할 수 있어요</p>

      {/* Input Mode Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          className={inputMode === 'product' ? 'chip selected' : 'chip'}
          onClick={() => setInputMode('product')}
        >
          제품명으로 검색
        </button>
        <button
          className={inputMode === 'ingredient' ? 'chip selected' : 'chip'}
          onClick={() => setInputMode('ingredient')}
        >
          성분 직접 입력
        </button>
      </div>

      {inputMode === 'product' ? (
        <div className="product-input-area">
          <input
            className="product-input"
            type="text"
            placeholder="예) 닥터그루트 샴푸, TS 샴푸"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || products.length >= 3}
          />
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
            제품명을 입력하면 AI가 성분을 분석해요
          </p>
        </div>
      ) : (
        <div className="product-input-area">
          <textarea
            className="ingredient-textarea"
            placeholder="전성분표를 붙여넣어주세요&#10;예) 정제수, 소듐라우레스설페이트, 코카미도프로필베타인..."
            value={ingredientText}
            onChange={(e) => setIngredientText(e.target.value)}
            disabled={loading || products.length >= 3}
          />
        </div>
      )}

      {error && (
        <div style={{
          background: 'var(--danger-light)',
          color: 'var(--danger-dark)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          marginBottom: '16px',
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-container" style={{ padding: '30px 20px' }}>
          <div className="loading-spinner" />
          <p className="loading-text">
            AI가 성분을 분석하고 있어요<br />
            잠시만 기다려주세요
          </p>
        </div>
      )}

      {/* Added Products */}
      {products.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            분석 완료 ({products.length}/3)
          </p>
          <div className="product-list" style={{ flexDirection: 'column' }}>
            {products.map((p, i) => (
              <div className="product-tag" key={i} style={{ justifyContent: 'space-between', width: '100%' }}>
                <span>{p.productName} — {p.score}점</span>
                <button className="product-tag-remove" onClick={() => removeProduct(i)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="spacer" />

      <div className="bottom-actions">
        {products.length === 0 ? (
          <button
            className="btn-primary"
            onClick={inputMode === 'product' ? handleAddProduct : handleAnalyzeIngredients}
            disabled={loading || (inputMode === 'product' ? !productName.trim() : !ingredientText.trim())}
          >
            {loading ? '분석 중...' : '분석하기'}
          </button>
        ) : (
          <>
            {products.length < 3 && (
              <button
                className="btn-secondary"
                onClick={inputMode === 'product' ? handleAddProduct : handleAnalyzeIngredients}
                disabled={loading || (inputMode === 'product' ? !productName.trim() : !ingredientText.trim())}
              >
                + 제품 추가 분석
              </button>
            )}
            <button
              className="btn-primary"
              onClick={() => onAnalysisComplete(products)}
            >
              {products.length > 1 ? '비교 결과 보기' : '결과 보기'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductInput;