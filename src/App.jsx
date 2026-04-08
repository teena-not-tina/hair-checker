import React, { useState } from 'react';
import Landing from './components/Landing';
import Survey from './components/Survey';
import CriteriaResult from './components/CriteriaResult';
import ProductInput from './components/ProductInput';
import CompareResult from './components/CompareResult';
import Checklist from './components/Checklist';
import { generateCriteria, getProfileTags } from './data/ingredientMap';

const STEPS = {
  LANDING: 'landing',
  SURVEY: 'survey',
  CRITERIA: 'criteria',
  PRODUCT_INPUT: 'productInput',
  COMPARE: 'compare',
  CHECKLIST: 'checklist',
};

function App() {
  const [step, setStep] = useState(STEPS.LANDING);
  const [mode, setMode] = useState(null); // 'verify' or 'recommend'
  const [profile, setProfile] = useState({
    scalpType: null,
    damageLevel: null,
    hairType: null,
    treatments: [],
    concerns: [],
    productCategory: null,
  });
  const [criteria, setCriteria] = useState({ good: [], bad: [] });
  const [profileTags, setProfileTags] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setStep(STEPS.SURVEY);
  };

  const handleSurveyComplete = (surveyData) => {
    const newProfile = { ...profile, ...surveyData };
    setProfile(newProfile);
    const tags = getProfileTags(newProfile);
    setProfileTags(tags);
    const generatedCriteria = generateCriteria(newProfile);
    setCriteria(generatedCriteria);
    setStep(STEPS.CRITERIA);
  };

  const handleGoToProducts = () => {
    setStep(STEPS.PRODUCT_INPUT);
  };

  const handleGoToChecklist = () => {
    setStep(STEPS.CHECKLIST);
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setStep(STEPS.COMPARE);
  };

  const handleAddMore = () => {
    setStep(STEPS.PRODUCT_INPUT);
  };

  const handleBack = () => {
    switch (step) {
      case STEPS.SURVEY: setStep(STEPS.LANDING); break;
      case STEPS.CRITERIA: setStep(STEPS.SURVEY); break;
      case STEPS.PRODUCT_INPUT: setStep(STEPS.CRITERIA); break;
      case STEPS.COMPARE: setStep(STEPS.PRODUCT_INPUT); break;
      case STEPS.CHECKLIST: setStep(STEPS.CRITERIA); break;
      default: setStep(STEPS.LANDING);
    }
  };

  const handleRestart = () => {
    setStep(STEPS.LANDING);
    setMode(null);
    setProfile({ scalpType: null, damageLevel: null, hairType: null, treatments: [], concerns: [], productCategory: null });
    setCriteria({ good: [], bad: [] });
    setProfileTags([]);
    setAnalysisResults([]);
  };

  return (
    <div className="app-container">
      {step === STEPS.LANDING && (
        <Landing onSelect={handleModeSelect} />
      )}
      {step === STEPS.SURVEY && (
        <Survey mode={mode} onComplete={handleSurveyComplete} onBack={handleBack} />
      )}
      {step === STEPS.CRITERIA && (
        <CriteriaResult
          criteria={criteria}
          profileTags={profileTags}
          mode={mode}
          onGoToProducts={handleGoToProducts}
          onGoToChecklist={handleGoToChecklist}
          onBack={handleBack}
        />
      )}
      {step === STEPS.PRODUCT_INPUT && (
        <ProductInput
          criteria={criteria}
          profileTags={profileTags}
          existingResults={analysisResults}
          onAnalysisComplete={handleAnalysisComplete}
          onBack={handleBack}
        />
      )}
      {step === STEPS.COMPARE && (
        <CompareResult
          results={analysisResults}
          profileTags={profileTags}
          onAddMore={handleAddMore}
          onGoToChecklist={handleGoToChecklist}
          onBack={handleBack}
          onRestart={handleRestart}
        />
      )}
      {step === STEPS.CHECKLIST && (
        <Checklist
          criteria={criteria}
          profileTags={profileTags}
          profile={profile}
          onBack={handleBack}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
