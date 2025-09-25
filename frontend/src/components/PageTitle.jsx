import React from 'react';
import './PageTitle.css';

const PageTitle = ({ title, customClass = "" }) => {
    return (
        <div className={`page-title-container ${customClass}`}>
            <div className="page-title-content">
                <h1 className="page-title">{title}</h1>
            </div>
        </div>
    );
};

export default PageTitle;
