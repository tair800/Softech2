import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = ({ message = "Loading..." }) => {
    return (
        <div className="loading-container">
            <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            <div className="loading-text">{message}</div>
            <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default LoadingAnimation;
