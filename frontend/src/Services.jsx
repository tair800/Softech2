import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import ServiceCard3D from './components/ServiceCard3D';
import Spline from '@splinetool/react-spline';
import PageTitle from './components/PageTitle';
import LoadingAnimation from './components/LoadingAnimation';
import './Services.css';
import { t } from './utils/i18n';

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [error, setError] = useState(null);
    const [splineError, setSplineError] = useState(false);
    const [splineLoaded, setSplineLoaded] = useState(false);
    const { language } = useLanguage();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Check if Spline has already been loaded in this session
    useEffect(() => {
        const alreadyLoaded = sessionStorage.getItem("splineLoaded");
        if (alreadyLoaded) {
            setSplineLoaded(true);
        }
    }, []);

    // Handle Spline load completion
    const handleSplineLoad = () => {
        setSplineLoaded(true);
        // Only set sessionStorage if Spline actually loaded successfully
        if (!splineError) {
            sessionStorage.setItem("splineLoaded", "true");
        }
    };

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            const startTime = Date.now();

            try {
                const response = await fetch(`https://softech-api.webonly.io/api/services?language=${language}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setServices(data);
            } catch (err) {
                console.error('Error fetching services:', err);
                setError(err.message);
            } finally {
                // Ensure minimum loading time of 0.1 seconds
                const elapsedTime = Date.now() - startTime;
                const minLoadingTime = 100; // 0.1 seconds
                const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

                setTimeout(() => {
                    setLoading(false);
                }, remainingTime);
            }
        };

        fetchServices();
    }, [language]);

    // Keep Spline instance stable across re-renders (e.g., language change)
    const memoizedSpline = useMemo(() => (
        <Spline
            scene="https://prod.spline.design/mP2TljaQ-tsNIzZt/scene.splinecode"
            onLoad={handleSplineLoad}
            onError={() => {
                setSplineError(true);
                setSplineLoaded(false);
                // Clear sessionStorage if Spline fails to load
                sessionStorage.removeItem("splineLoaded");
            }}
        />
    ), []);


    if (error) {
        return (
            <div className="services-container">
                <div className="services-center">
                    <div>Error loading services: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="services-container">
            <PageTitle title={t('services', language)} customClass="page-title-services" />
            <div className="services-circle-background-1"></div>
            <div className="services-circle-background-2"></div>
            <div className="services-circle-background-3"></div>

            <div className="services-center">
                <div className="services-rainbow">
                    {!splineError ? (
                        memoizedSpline
                    ) : (
                        <div className="spline-fallback">
                            <img src="/assets/rainbow.png" alt="Rainbow" />
                        </div>
                    )}
                </div>

                <div className="services-grid-3d">
                    {services.map((service) => (
                        <div key={service.id} className="service-card-3d-wrapper">
                            <ServiceCard3D service={service} />
                        </div>
                    ))}
                </div>
                {refetching && (
                    <div className="services-refetching-overlay" />
                )}
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="loading-overlay">
                    <LoadingAnimation message={language === 'en' ? 'Loading Services...' : language === 'ru' ? 'Загрузка услуг...' : 'Xidmətlər yüklənir...'} />
                </div>
            )}
        </div>
    );
}

export default Services;
