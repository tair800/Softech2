import React from 'react';
import Spline from '@splinetool/react-spline';
import PageTitle from './components/PageTitle';
import './TestPage.css';

const TestCard = () => {
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
        <Spline
          scene="https://prod.spline.design/mP2TljaQ-tsNIzZt/scene.splinecode"
        />
      </div>
    </div>
  );
};

export default TestCard;

