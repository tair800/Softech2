import React from 'react';
import './TestCard.css';

const TestCard = () => {
  return (
    <div className="testcard-container">
      <div className="testcard-card">
        <div className="blue-border-div">
          <img src="/assets/equipment1.png" alt="Equipment 1" />
        </div>
        <div className="version-container">
          <img src="/assets/maps-logo.png" alt="Maps Logo" className="version-icon" />
          <span className="version-name">Scanner</span>
        </div>
        <div className="equipment-name">PosTürk TX-1700M</div>
        <div className="image-container">
          <img src="/assets/services-active.png" alt="Services Active" />
        </div>
      </div>
    </div>
  );
};

export default TestCard;

