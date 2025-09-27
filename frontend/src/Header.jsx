import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoIcon from '/assets/logo-icon.png';
import logoText from '/assets/logo-text.png';
import globeImg from '/assets/globe.png';
import dropdownIcon from '/assets/dropdown-icon.png';
import logoWhite from '/assets/logo-white.png';

import './Header.css';
import StaggeredMenu from './components/StaggeredMenu';
import { useLanguage } from './contexts/LanguageContext';
import { t } from './utils/i18n';

function Header() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const langRef = useRef(null);
    const location = useLocation();
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        function handleClickOutside(event) {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo-frame">
                    <Link to="/" style={{ display: 'block', width: '100%', height: '100%' }}>
                        <img src={logoWhite} alt="Logo White" className="logo-white" />
                    </Link>
                </div>
                <ul className="navbar-links">
                    <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>{t('home', language)}</Link></li>
                    <li><Link to="/about" className={location.pathname === "/about" ? "active" : ""}>{t('about', language)}</Link></li>
                    <li><Link to="/products" className={location.pathname === "/products" || location.pathname.startsWith("/product/") ? "active" : ""}>{t('products', language)}</Link></li>
                    <li><Link to="/services" className={location.pathname === "/services" || location.pathname.startsWith("/services/") ? "active" : ""}>{t('services', language)}</Link></li>
                    <li><Link to="/equipment" className={location.pathname === "/equipment" || location.pathname.startsWith("/equipment/") ? "active" : ""}>{t('equipment', language)}</Link></li>
                    <li><Link to="/blog" className={location.pathname === "/blog" ? "active" : ""}>{t('blog', language)}</Link></li>
                    <li><Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>{t('contact', language)}</Link></li>
                </ul>
                <div className="navbar-right">
                    <div className="navbar-lang desktop-only" ref={langRef} tabIndex={0} onClick={() => setDropdownOpen((open) => !open)}>
                        <img src={globeImg} alt="Language Globe" className="lang-globe" width="19.25" height="19.25" />
                        <img src={dropdownIcon} alt="Dropdown Icon" className="dropdown-icon" width="21" height="21" />
                        {dropdownOpen && (
                            <div className="lang-dropdown">
                                <div className="lang-option" onClick={() => setLanguage('az')}>AZ</div>
                                <div className="lang-option" onClick={() => setLanguage('en')}>EN</div>
                                <div className="lang-option" onClick={() => setLanguage('ru')}>RU</div>
                            </div>
                        )}
                    </div>
                    <div className="staggered-menu-mount">
                        <StaggeredMenu
                            position="right"
                            items={[
                                { label: t('home', language), ariaLabel: 'Go to home page', link: '/' },
                                { label: t('about', language), ariaLabel: 'Learn about us', link: '/about' },
                                { label: t('products', language), ariaLabel: 'View products', link: '/products' },
                                { label: t('services', language), ariaLabel: 'View services', link: '/services' },
                                { label: t('equipment', language), ariaLabel: 'View equipment', link: '/equipment' },
                                { label: t('blog', language), ariaLabel: 'Read blog', link: '/blog' },
                                { label: t('contact', language), ariaLabel: 'Get in touch', link: '/contact' },
                            ]}
                            displaySocials={false}
                            displayItemNumbering={false}
                            menuButtonColor="#ffffff"
                            openMenuButtonColor="#ffffff"
                            changeMenuColorOnOpen={true}
                            colors={['#0a1a1f', '#112833', '#183b4a']}
                            logoUrl={null}
                            accentColor="#19e6ff"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
