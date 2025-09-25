import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import { useParams, useNavigate } from 'react-router-dom';
import './ServiceDetail.css';

const API = 'http://localhost:5098/api';

function ServiceDetail() {
    const { id } = useParams();
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [currentService, setCurrentService] = useState({});
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [error, setError] = useState(null);

    const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/uploads/')) return `http://localhost:5098${url}`;
        return url;
    };

    // Language helper with AZ default and sensible fallbacks
    const pickByLanguage = (lang, en, ru, az) => {
        const vAz = (az || '').trim();
        const vEn = (en || '').trim();
        const vRu = (ru || '').trim();
        if (lang === 'en') return vEn || vAz || vRu;
        if (lang === 'ru') return vRu || vAz || vEn;
        return vAz || vEn || vRu;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!currentService?.id || allServices.length === 0) {
                    setLoading(true);
                } else {
                    setRefetching(true);
                }

                // Fetch all services for sidebar navigation
                const servicesRes = await fetch(`${API}/services?language=${language}`);
                if (!servicesRes.ok) throw new Error('Failed to load services');
                const servicesData = await servicesRes.json();
                setAllServices(servicesData);

                // Fetch current service details
                const serviceRes = await fetch(`${API}/services/${id}?language=${language}`);
                if (!serviceRes.ok) throw new Error('Failed to load service');
                const serviceData = await serviceRes.json();
                setCurrentService(serviceData);
            } catch (e) {
                console.error('Error fetching data:', e);
                setError(e.message);
            } finally {
                setLoading(false);
                setRefetching(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, language]);

    // Stable navigate handler to avoid re-creating on language changes
    const handleNav = useCallback((targetId) => navigate(`/services/${targetId}`), [navigate]);

    // Show loading state
    if (loading) {
        return (
            <div className="service-detail-container">
                <div className="service-detail-content">
                    <div className="service-detail-center">
                        <h2>Yüklənir...</h2>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !currentService) {
        return (
            <div className="service-detail-container">
                <div className="service-detail-content">
                    <div className="service-detail-center">
                        <h2>Xəta: {error || 'Xidmət tapılmadı'}</h2>
                    </div>
                </div>
            </div>
        );
    }


    function Icon({ isActive }) {
        return (
            <div className="icon-container" data-name="Icon">
                <img
                    height="41"
                    src={isActive ? "/assets/services-active.png" : "/assets/services-deac.png"}
                    width="41"
                    alt="Icon"
                />
            </div>
        );
    }

    function Background({ isActive }) {
        return (
            <div className="background" data-name="Background">
                <div className="background-inner">
                    <div className="icon-flip">
                        <Icon isActive={isActive} />
                    </div>
                </div>
            </div>
        );
    }

    function Link({ service, isActive }) {
        const subtitle = pickByLanguage(language, service.subtitleEn, service.subtitleRu, service.subtitle);
        return (
            <div className="link-container" data-name="Link" onClick={() => handleNav(service.id)}>
                <div className="link-text">
                    <p className="adjustLetterSpacing">
                        {subtitle}
                    </p>
                </div>
                <Background isActive={isActive} />
                <div className="side-indicator" data-name="Background" />
            </div>
        );
    }

    function Item({ service, isActive }) {
        return (
            <div className="item-container" data-name="Item">
                <div aria-hidden="true" className="item-border" />
                <Link service={service} isActive={isActive} />
            </div>
        );
    }

    function Icon1({ isActive }) {
        return (
            <div className="icon-container-small" data-name="Icon">
                <img
                    height="36"
                    src={isActive ? "/assets/services-active.png" : "/assets/services-deac.png"}
                    width="36"
                    alt="Icon"
                />
            </div>
        );
    }

    function Link1({ service, isActive }) {
        const subtitle = pickByLanguage(language, service.subtitleEn, service.subtitleRu, service.subtitle);
        return (
            <div className="link-container-inactive" data-name="Link" onClick={() => handleNav(service.id)}>
                <div className="link-text-inactive">
                    <p className="adjustLetterSpacing">
                        {subtitle}
                    </p>
                </div>
                <div className="icon-wrapper">
                    <div className="icon-flip">
                        <Icon1 isActive={isActive} />
                    </div>
                </div>
                <div className="side-indicator-white" data-name="Background" />
            </div>
        );
    }

    function Item1({ service, isActive }) {
        return (
            <div className="item-container item-inactive" data-name="Item">
                <div aria-hidden="true" className="item-border" />
                <Link1 service={service} isActive={isActive} />
            </div>
        );
    }

    function List() {
        return (
            <div className="list-container" data-name="List">
                {allServices.map((service) => {
                    const isActive = service.id === parseInt(id);

                    if (isActive) {
                        return <Item key={service.id} service={service} isActive={isActive} />;
                    } else {
                        return <Item1 key={service.id} service={service} isActive={isActive} />;
                    }
                })}
            </div>
        );
    }

    function Aside() {
        return (
            <div className="aside-container" data-name="Aside">
                <List />
            </div>
        );
    }

    return (
        <div className="service-detail-container">
            {/* Circle Background Element */}
            <div className="service-detail-circle-background-right"></div>

            <div className="service-detail-content">
                <div className="service-detail-left">
                    <h3 className="service-detail-sidebar-title">{pickByLanguage(language, 'Our Services', 'Наши услуги', 'Xidmətlərimiz')}</h3>
                    <div className="list-container">
                        <Aside />
                    </div>
                </div>
                <div className="service-detail-right">
                    <div className="service-detail-content-area">
                        <img
                            src={resolveUrl(currentService.detailImage)}
                            alt={pickByLanguage(language, currentService.nameEn, currentService.nameRu, currentService.name)}
                            className="service-detail-image"
                        />
                    </div>
                    <h1 className="service-detail-title">{pickByLanguage(language, currentService.nameEn, currentService.nameRu, currentService.name)}</h1>
                    {(currentService.description || currentService.descriptionEn || currentService.descriptionRu) && (
                        <p className="service-detail-description">{pickByLanguage(language, currentService.descriptionEn, currentService.descriptionRu, currentService.description)}</p>
                    )}
                    {refetching && <div className="service-detail-refetching-overlay" />}
                </div>
            </div>
        </div>
    );
}

export default ServiceDetail; 