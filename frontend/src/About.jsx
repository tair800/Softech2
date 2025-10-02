import React, { useState, useRef, useEffect } from 'react';
// import { teamMembers } from './data/teamData';
// import { logos } from './data/logoData';
import Spline from '@splinetool/react-spline';
import PageTitle from './components/PageTitle';
import phoneIcon from '/assets/phone.svg';
import linkedinIcon from '/assets/linkedin.svg';
import mailIcon from '/assets/mail.svg';
import './About.css';
import AboutTeamHeader from './components/AboutTeamHeader.jsx';
import { useLanguage } from './contexts/LanguageContext';
// no external translator; use API-provided localized fields
import { t } from './utils/i18n';

function About() {
    const [teamMembersState, setTeamMembersState] = useState([]);
    const [logosState, setLogosState] = useState([]);
    const [splineError, setSplineError] = useState(false);
    const [director, setDirector] = useState(null);
    const [aboutLogo, setAboutLogo] = useState(null);
    const { language } = useLanguage();
    const [translated, setTranslated] = useState({
        title: 'Haqqımızda',
        aboutHeading: '',
        aboutSubtext: '',
        teamTitle: 'Kollektiv',
        referenceTitle: 'Referance',
        directorName: '',
        directorPosition: '',
        directorDescription: ''
    });
    const [translatedTeamMembers, setTranslatedTeamMembers] = useState([]);

    // Function to resolve image URLs
    const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/assets/')) return url; // Static assets don't need API base URL
        if (url.startsWith('/uploads/')) return `https://softech-api.webonly.io${url}`;
        return url;
    };


    // Fetch data from API (localized by language)
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [empRes, refRes, aboutLogoRes] = await Promise.all([
                    fetch(`https://softech-api.webonly.io/api/employees?language=${language}`),
                    fetch('https://softech-api.webonly.io/api/references'),
                    fetch(`https://softech-api.webonly.io/api/AboutLogo?language=${language}`)
                ]);
                if (empRes.ok) {
                    const employees = await empRes.json();
                    // Find the director from the API response
                    const directorEmployee = employees.find(emp =>
                        emp.position.toLowerCase().includes('direktor') ||
                        emp.position.toLowerCase().includes('director') ||
                        emp.position.toLowerCase().includes('директор')
                    );
                    setDirector(directorEmployee);

                    // Filter out the director from the team members list
                    const otherEmployees = employees.filter(emp => emp.id !== directorEmployee?.id);
                    setTeamMembersState(otherEmployees);
                }
                if (refRes.ok) setLogosState(await refRes.json());
                if (aboutLogoRes.ok) {
                    const aboutLogos = await aboutLogoRes.json();
                    // Get the first (and should be only) AboutLogo record
                    if (aboutLogos.length > 0) {
                        setAboutLogo(aboutLogos[0]);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchAll();
    }, [language]);

    // (removed) separate refetch hooks; consolidated into main fetchAll above

    useEffect(() => {
        // Use localized values from API (AboutLogo and Employees endpoints)
        setTranslated(prev => ({
            ...prev,
            title: 'Haqqımızda',
            aboutHeading: aboutLogo?.heading || prev.aboutHeading,
            aboutSubtext: aboutLogo?.subtext || prev.aboutSubtext,
            teamTitle: 'Kollektiv',
            referenceTitle: 'Referance',
            directorName: director?.name || prev.directorName,
            directorPosition: director?.position || prev.directorPosition,
            directorDescription: director?.description || prev.directorDescription,
        }));
    }, [language, aboutLogo, director]);

    // Apply localized fields from API directly (no external translation)
    useEffect(() => {
        setTranslatedTeamMembers(teamMembersState.map(m => ({
            ...m,
            positionTranslated: m.position,
            descriptionTranslated: m.description,
        })));
    }, [language, teamMembersState]);

    // (removed) separate employees refetch; consolidated into main fetchAll above

    // Update CSS custom properties for dynamic animation
    useEffect(() => {
        const logoCount = logosState.length;
        const root = document.documentElement;
        root.style.setProperty('--logo-count', logoCount);
        root.style.setProperty('--carousel-width', `calc(200px * ${logoCount * 2})`);
        root.style.setProperty('--animation-duration', `${Math.max(30, logoCount * 2)}s`);
    }, [logosState]);



    return (
        <div className="about-container">
            <PageTitle title={t('about', language)} customClass="page-title-about" />
            <div className="about-circle-background"></div>
            <div className="about-circle-background-left-2"></div>
            <div className="about-circle-background-right"></div>
            <div className="about-circle-background-right-2"></div>

            <div className="about-rainbow">
                {!splineError ? (
                    <Spline
                        scene="https://prod.spline.design/mP2TljaQ-tsNIzZt/scene.splinecode"
                        onError={(error) => {
                            setSplineError(true);
                        }}
                    />
                ) : (
                    <div className="spline-fallback">
                        <img src="/assets/rainbow.png" alt="Rainbow" />
                    </div>
                )}
            </div>

            <div className="about-logo">
                <img src={resolveUrl(aboutLogo?.imageUrl) || "/assets/logo-only.png"} alt="Logo" />
                <p className="about-logo-text">{translated.aboutHeading}</p>
                <p className="about-logo-description">{translated.aboutSubtext}</p>
            </div>

            <AboutTeamHeader title={t('team', language)} />

            <div className="about-description-section">
                <img src={resolveUrl(director?.imageUrl) || "/assets/market4.png"} alt="Director" className="about-director-img" />
                <div className="about-name">{translated.directorName}</div>
                <div className="about-position">{translated.directorPosition}</div>
                <div>
                    <p className="about-description-text">{translated.directorDescription}</p>
                    <img src="/assets/comma.png" alt="Comma" className="about-comma" />
                </div>
            </div>

            <div className="about-team-cards">
                {translatedTeamMembers.map((member) => (
                    <div key={member.id} className="team-card">
                        <div className="card-image">
                            <img src={resolveUrl(member.imageUrl)} alt={member.name} />
                        </div>
                        <div className="card-content">
                            <div className="card-name">{member.name}</div>
                            <div className="card-position">{member.positionTranslated || member.position}</div>
                            <div className="card-contacts">
                                <a href={`tel:${member.phone}`}>
                                    <img src={phoneIcon} alt="Phone" />
                                </a>
                                <a href={`mailto:${member.email}`}>
                                    <img src={mailIcon} alt="Email" />
                                </a>
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                    <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" />
                                </a>
                            </div>
                            {/* No description for non-director employees on normal page */}
                        </div>
                    </div>
                ))}
            </div>

            <AboutTeamHeader title={t('references', language)} />

            <div className="logo-carousel-container">
                <div className="logo-carousel">
                    <div className="logo-carousel-track">
                        {logosState.map((logo) => (
                            <div key={`first-${logo.id}`} className="logo-item">
                                <img src={resolveUrl(logo.imageUrl)} alt={logo.name} />
                            </div>
                        ))}
                        {logosState.map((logo) => (
                            <div key={`second-${logo.id}`} className="logo-item">
                                <img src={resolveUrl(logo.imageUrl)} alt={logo.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About; 