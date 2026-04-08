import React, { useState, useRef } from 'react';
import { analyzeProduct, analyzeIngredients } from '../api/gemini';

function ProductInput({ criteria, profileTags, existingResults, onAnalysisComplete, onBack }) {
  const [productName, setProductName] = useState('');
  const [ingredientText, setIngredientText] = useState('');
  const [products, setProducts] = useState(existingResults || []);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputMode, setInputMode] = useState('product');
  const [ocrPreview, setOcrPreview] = useState(null); // { imageUrl, fieldCount }
  const fileInputRef = useRef(null);

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
        setOcrPreview(null);
      }
    } catch (e) {
      setError(e.message || '분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    setError(null);
    setOcrPreview(null);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        throw new Error('성분표 인식에 실패했어요. 다시 촬영해주세요.');
      }

      const data = await response.json();

      if (data.text && data.text.trim()) {
        setIngredientText(data.text.trim());
        setInputMode('ocr');
        setOcrPreview({
          imageUrl: previewUrl,
          fieldCount: data.fieldCount || 0,
        });
      } else {
        URL.revokeObjectURL(previewUrl);
        setError('성분표를 인식하지 못했어요. 글씨가 잘 보이도록 다시 촬영해주세요.');
      }
    } catch (e) {
      URL.revokeObjectURL(previewUrl);
      setError(e.message || '사진 처리 중 오류가 발생했습니다.');
    } finally {
      setOcrLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleOcrRetake = () => {
    if (ocrPreview?.imageUrl) URL.revokeObjectURL(ocrPreview.imageUrl);
    setOcrPreview(null);
    setIngredientText('');
    setInputMode('product');
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleAddProduct();
    }
  };

  const canAnalyze = () => {
    if (inputMode === 'product') return productName.trim().length > 0;
    if (inputMode === 'ingredient') return ingredientText.trim().length > 0;
    if (inputMode === 'ocr') return ingredientText.trim().length > 0;
    return false;
  };

  const handleAnalyze = () => {
    if (inputMode === 'product') {
      handleAddProduct();
    } else {
      handleAnalyzeIngredients();
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

      {/* Input Mode Toggle - hide when OCR result showing */}
      {inputMode !== 'ocr' && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
          <button
            className="chip"
            onClick={handleCameraClick}
            disabled={ocrLoading || products.length >= 3}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            성분표 촬영
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageCapture}
        style={{ display: 'none' }}
      />

      {/* OCR Loading */}
      {ocrLoading && (
        <div className="loading-container" style={{ padding: '30px 20px' }}>
          <div className="loading-spinner" />
          <p className="loading-text">
            성분표를 인식하고 있어요<br />
            잠시만 기다려주세요
          </p>
        </div>
      )}

      {/* OCR Result Preview */}
      {!ocrLoading && inputMode === 'ocr' && ocrPreview && (
        <div style={{
          background: 'var(--success-light)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <img
              src={ocrPreview.imageUrl}
              alt="촬영한 성분표"
              style={{
                width: '72px',
                height: '72px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--success-dark)', marginBottom: '4px' }}>
                ✓ 성분표 인식 완료
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {ocrPreview.fieldCount}개 텍스트 영역 인식됨
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              className="chip"
              onClick={handleOcrRetake}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              다시 촬영
            </button>
            <button
              className="chip"
              onClick={() => setInputMode('ingredient')}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              인식 결과 확인
            </button>
          </div>
        </div>
      )}

      {/* Product name input */}
      {!ocrLoading && inputMode === 'product' && (
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
      )}

      {/* Ingredient text input */}
      {!ocrLoading && inputMode === 'ingredient' && (
        <div className="product-input-area">
          <textarea
            className="ingredient-textarea"
            placeholder="전성분표를 붙여넣거나, 위 📷 버튼으로 촬영하세요"
            value={ingredientText}
            onChange={(e) => setIngredientText(e.target.value)}
            disabled={loading || products.length >= 3}
          />
          {ocrPreview && (
            <button
              onClick={() => setInputMode('ocr')}
              style={{
                marginTop: '8px', fontSize: '12px', color: 'var(--primary)',
                background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              ← 미리보기로 돌아가기
            </button>
          )}
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
            onClick={handleAnalyze}
            disabled={loading || ocrLoading || !canAnalyze()}
          >
            {loading ? '분석 중...' : '분석하기'}
          </button>
        ) : (
          <>
            {products.length < 3 && (
              <button
                className="btn-secondary"
                onClick={handleAnalyze}
                disabled={loading || ocrLoading || !canAnalyze()}
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