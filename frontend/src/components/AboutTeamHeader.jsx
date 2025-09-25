import React from 'react';

export default function AboutTeamHeader({ title, style, className }) {
    return (
        <div className={`about-team-header${className ? ' ' + className : ''}`} style={style}>
            <div className="about-team-title">{title}</div>
            <div className="about-team-nav">
                <div className="about-team-nav-dot about-team-nav-dot-faded"></div>
                <div className="about-team-nav-dot about-team-nav-dot-gradient"></div>
                <div className="about-team-divider"></div>
                <div className="about-team-bar"></div>
            </div>
        </div>
    );
}


