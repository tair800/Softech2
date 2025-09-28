import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import ServiceCard3D from './components/ServiceCard3D';
import Spline from '@splinetool/react-spline';
import PageTitle from './components/PageTitle';
import './Services.css';
import { t } from './utils/i18n';

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [error, setError] = useState(null);
    const [splineError, setSplineError] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        fetchServices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    const fetchServices = async () => {
        try {
            if (services.length === 0) {
                setLoading(true);
            } else {
                setRefetching(true);
            }
            const response = await fetch(`http://localhost:5098/api/services?language=${language}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setServices(data);
        } catch (err) {
            console.error('Error fetching services:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setRefetching(false);
        }
    };

    // Keep Spline instance stable across re-renders (e.g., language change)
    const memoizedSpline = useMemo(() => (
        <Spline
            scene="https://prod.spline.design/mP2TljaQ-tsNIzZt/scene.splinecode"
            onError={() => setSplineError(true)}
        />
    ), []);

    if (loading) {
        return (
            <div className="services-container">
                <div className="services-center">
                    <div>Loading services...</div>
                </div>
            </div>
        );
    }

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
        </div>
    );
}

export default Services;
