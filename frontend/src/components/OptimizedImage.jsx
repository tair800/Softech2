import React, { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({
    src,
    alt,
    className,
    style,
    onClick,
    placeholder = "/assets/placeholder.png",
    lazy = true
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isVisible, setIsVisible] = useState(!lazy);
    const imgRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        if (!lazy) {
            setIsVisible(true);
            return;
        }

        // Intersection Observer for lazy loading
        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observerRef.current?.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        if (imgRef.current) {
            observerRef.current.observe(imgRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [lazy]);

    useEffect(() => {
        if (!isVisible) return;

        const img = new Image();

        img.onload = () => {
            setIsLoaded(true);
            setHasError(false);
        };

        img.onerror = () => {
            setHasError(true);
            setIsLoaded(false);
        };

        img.src = src;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, isVisible]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    if (!isVisible) {
        return (
            <div
                ref={imgRef}
                className={`${className} image-placeholder`}
                style={{ ...style, backgroundColor: '#f0f0f0' }}
            >
                <div style={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0' }} />
            </div>
        );
    }

    if (hasError) {
        return (
            <div
                className={`${className} image-error`}
                style={{ ...style, backgroundColor: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <span style={{ color: '#c62828', fontSize: '12px' }}>Image Error</span>
            </div>
        );
    }

    return (
        <img
            ref={imgRef}
            src={isLoaded ? src : placeholder}
            alt={alt}
            className={className}
            style={{
                ...style,
                opacity: isLoaded ? 1 : 0.7,
                transition: 'opacity 0.3s ease-in-out'
            }}
            onClick={onClick}
            loading={lazy ? "lazy" : "eager"}
        />
    );
};

export default OptimizedImage;
