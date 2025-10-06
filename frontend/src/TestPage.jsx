import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import PageTitle from './components/PageTitle';
import LoadingAnimation from './components/LoadingAnimation';
import './TestPage.css';

const TestCard = () => {
  const [splineError, setSplineError] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if Spline has already been loaded in this session
  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem("splineLoaded");
    if (alreadyLoaded) {
      setSplineLoaded(true);
      setIsLoading(false);
    }
  }, []);

  // Handle Spline load completion
  const handleSplineLoad = () => {
    setSplineLoaded(true);
    // Only set sessionStorage if Spline actually loaded successfully
    if (!splineError) {
      sessionStorage.setItem("splineLoaded", "true");
    }
    setIsLoading(false);
  };

  const handleMouseDown = (e) => {
    // Allow scrolling when not directly interacting with canvas
    if (e.target.tagName !== 'CANVAS') {
      e.stopPropagation();
    }
  };

  return (
    <div className="test-page-container" onMouseDown={handleMouseDown}>
      <PageTitle title="Test Səhifəsi" />
      <div className="spline-wrapper">
        {!splineError ? (
          <Spline
            scene="https://prod.spline.design/mP2TljaQ-tsNIzZt/scene.splinecode"
            onLoad={handleSplineLoad}
            onError={(error) => {
              setSplineError(true);
              setSplineLoaded(false);
              // Clear sessionStorage if Spline fails to load
              sessionStorage.removeItem("splineLoaded");
            }}
          />
        ) : (
          <div className="spline-fallback">
            <img src="/assets/rainbow.png" alt="Rainbow" />
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <LoadingAnimation message="Loading Test Page..." />
        </div>
      )}
    </div>
  );
};

export default TestCard;

