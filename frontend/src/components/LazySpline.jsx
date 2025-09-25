import React, { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from './ErrorBoundary.jsx';

const LazySpline = ({ scene, fallbackImage, className, style }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [splineError, setSplineError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef(null);

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
                        onError={() => setSplineError(true)}
                        onLoad={() => setIsLoaded(true)}
                    />
                </ErrorBoundary>
            )}
        </div>
    );
};

export default LazySpline;
