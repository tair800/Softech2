import React from 'react';
import { useLanguage } from './contexts/LanguageContext.jsx';
import { Link } from 'react-router-dom';
import logoWhite from '/assets/logo-white.png';
import footerLogo from '/assets/footer-new.png';
import nextIcon from '/assets/next.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faFacebookF, faXTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

function Footer() {
    const { language } = useLanguage();
    const t = (key) => {
        const dict = {
            desc: {
                az: 'Şirkət yeni standartlarla proqram təminatı satışı və servisi həyata keçirən proqramlaşdırma şirkətidir.',
                en: 'The company is a software firm providing software sales and service with new standards.',
                ru: 'Компания — это фирма по разработке ПО, предоставляющая продажу и сервис программного обеспечения по новым стандартам.'
            },
            madeby: {
                az: 'Veb-sayt Webonly tərəfindən hazırlanıb.',
                en: 'Website developed by Webonly.',
                ru: 'Веб-сайт разработан компанией Webonly'
            },
            rights: {
                az: 'Copywrite @2025. Bütün hüquqlar qorunur.',
                en: 'Copyright @2025. All rights reserved.',
                ru: 'Copyright @2025. Все права защищены.'
            },
            products: { az: 'Məhsullar', en: 'Products', ru: 'Продукты' },
            contact: { az: 'Əlaqə', en: 'Contact', ru: 'Контакты' },
            location: { az: '1 Ahmad Rajabli, Baku, Azerbaijan', en: '1 Ahmad Rajabli, Baku, Azerbaijan', ru: '1 Ahmad Rajabli, Баку, Азербайджан' },
            emailPh: { az: 'Email daxil edin', en: 'Enter your email', ru: 'Введите ваш email' }
        };
        return (dict[key] && (dict[key][language] || dict[key].az)) || key;
    };

    const lt = (key) => {
        const dict = {
            tradeWarehouse: { az: 'Ticarət və Anbar', en: 'Trade & Warehouse', ru: 'Торговля и Склад' },
            market: { az: 'Market', en: 'Market', ru: 'Маркет' },
            restaurantModule: { az: 'Restoran idarəetmə modulu', en: 'Restaurant Management Module', ru: 'Модуль управления рестораном' },
            textileModule: { az: 'Tekstil Modulu', en: 'Textile Module', ru: 'Текстильный модуль' },
            creditPawn: { az: 'Kredit və Lombard', en: 'Credit & Pawn', ru: 'Кредит и Ломбард' },
            mobileSales: { az: 'Mobil Satış', en: 'Mobile Sales', ru: 'Мобильные продажи' },
            pharmacyModule: { az: 'Aptek idarəetmə modulu', en: 'Pharmacy Management Module', ru: 'Модуль управления аптекой' },
            manufacturingModule: { az: 'İstehsal idarəetmə modulu', en: 'Manufacturing Management Module', ru: 'Модуль управления производством' }
        };
        return (dict[key] && (dict[key][language] || dict[key].az)) || key;
    };

    const productItems = [
        lt('tradeWarehouse'),
        lt('market'),
        lt('restaurantModule'),
        lt('textileModule'),
        lt('creditPawn'),
        lt('mobileSales'),
        lt('pharmacyModule'),
        lt('manufacturingModule')
    ];
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-col footer-col-left">
                    <div className="footer-logo-row">
                        <Link to="/">
                            <img src={logoWhite} alt="Logo White" className="footer-logo-white" />
                        </Link>
                    </div>
                    <p className="footer-desc">{t('desc')}</p>
                    <form className="footer-email-form">
                        <input type="email" placeholder={t('emailPh')} className="footer-email-input" />
                        <button type="submit" className="footer-email-btn">
                            <img src={nextIcon} alt="Next" className="footer-email-btn-arrow" />
                        </button>
                    </form>
                    <div className="footer-socials">
                        <a href="https://www.facebook.com/Softech.az/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FontAwesomeIcon icon={faFacebookF} /></a>
                        <a href="https://www.instagram.com/softech_erp/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                    </div>
                    <hr className="footer-divider" />
                    <div className="footer-meta-row">
                        <div className="footer-madeby">{t('madeby')}</div>
                        <div className="footer-copyright">{t('rights')}</div>
                    </div>
                </div>

                <div className="footer-center-right-row">
                    <div className="footer-col footer-col-center">
                        <h3 className="footer-title">{t('products')}</h3>
                        <ul className="footer-links">
                            {productItems.map((label, idx) => (
                                <li key={idx}>{label}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-col footer-col-right">
                        <h3 className="footer-title">{t('contact')}</h3>
                        <ul className="footer-contact">
                            <li><FontAwesomeIcon icon={faLocationDot} className="footer-contact-icon" />
                                <a href="https://maps.google.com/maps?q=1+Ahmad+Rajabli,+Baku,+Azerbaijan" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{t('location')}</a>
                            </li>
                            <li><FontAwesomeIcon icon={faPhone} className="footer-contact-icon" />
                                <a href="tel:+994552742303" style={{ color: 'inherit', textDecoration: 'none' }}>+994 55 274 23 03</a>
                            </li>
                            <li><FontAwesomeIcon icon={faPhone} className="footer-contact-icon" />
                                <a href="tel:+994512521556" style={{ color: 'inherit', textDecoration: 'none' }}>+994 51 252 15 56</a>
                            </li>
                            <li><FontAwesomeIcon icon={faEnvelope} className="footer-contact-icon" /> <a href="mailto:cavidn@softech.az" style={{ color: 'inherit', textDecoration: 'none' }}>cavidn@softech.az</a></li>
                        </ul>
                    </div>
                </div>
                <img src={footerLogo} alt="Footer Decorative" className="footer-bg-img" />
            </div>
        </footer>
    );
}

export default Footer; 