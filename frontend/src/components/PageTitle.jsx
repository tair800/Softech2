import React from 'react';
import './PageTitle.css';

const PageTitle = ({ title, customClass = "" }) => {
    return (
        <div className={`page-title-container ${customClass}`}>
            <div className="page-title-content">
                <h1 style={{ textTransform: "uppercase", fontSize: "5.8rem",
                    background: "linear-gradient(90deg, #17DBFC 0%, #FFFFFF 50%, #467EFE 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }} >SOFTECH</h1>
                <h2 className="page-title">{title}</h2>
            </div>
        </div>
    );
};

export default PageTitle;
