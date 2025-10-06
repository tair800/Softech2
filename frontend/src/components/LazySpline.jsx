import React, { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from './ErrorBoundary.jsx';

const LazySpline = ({ scene, fallbackImage, className, style }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [splineError, setSplineError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [splineLoaded, setSplineLoaded] = useState(false);
    const containerRef = useRef(null);

    // Check if Spline has already been loaded in this session
    useEffect(() => {
        const alreadyLoaded = sessionStorage.getItem("splineLoaded");
        if (alreadyLoaded) {
            setSplineLoaded(true);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only load once when visible
                }
            },
            {
                threshold: 0.1, // Load when 10% visible
                rootMargin: '50px' // Start loading 50px before visible
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    // Handle Spline load completion
    const handleSplineLoad = () => {
        setSplineLoaded(true);
        setIsLoaded(true);
        // Only set sessionStorage if Spline actually loaded successfully
        if (!splineError) {
            sessionStorage.setItem("splineLoaded", "true");
        }
    };

    // Cleanup function for memory management
    useEffect(() => {
        return () => {
            // Force garbage collection hint when component unmounts
            if (window.gc) {
                window.gc();
            }
        };
    }, []);

    const webglSupported = () => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    };

    const shouldShowFallback = splineError || !isVisible || !webglSupported();

    if (shouldShowFallback) {
        return (
            <div ref={containerRef} className={className} style={style}>
                <div className="spline-fallback">
                    <img src={fallbackImage || "/assets/rainbow.png"} alt="Rainbow" />
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={className} style={style}>
            {isVisible && (
                <ErrorBoundary
                    fallback={
                        <div className="spline-fallback">
                            <img src={fallbackImage || "/assets/rainbow.png"} alt="Rainbow" />
                        </div>
                    }
                >
                    <Spline
                        scene={scene}
                        onError={() => {
                            setSplineError(true);
                            setSplineLoaded(false);
                            // Clear sessionStorage if Spline fails to load
                            sessionStorage.removeItem("splineLoaded");
                        }}
                        onLoad={handleSplineLoad}
                    />
                </ErrorBoundary>
            )}
        </div>
    );
};

export default LazySpline;
