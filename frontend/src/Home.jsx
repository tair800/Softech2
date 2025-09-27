import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from './contexts/LanguageContext.jsx';
import './Home.css';
import prevIcon from '/assets/prev.png';
import nextIcon from '/assets/next.png';
import logoIcon from '/assets/logo-icon.png';
import logoText from '/assets/logo-text.png';

function CircularProgress({ currentIndex, totalSlides, slides, language }) {
    // Get responsive dimensions from CSS
    const [dimensions, setDimensions] = useState({ width: 400, height: 320 });

    useEffect(() => {
        const updateDimensions = () => {
            const circularProgress = document.querySelector('.circular-progress');
            if (circularProgress) {
                const computedStyle = window.getComputedStyle(circularProgress);
                const width = parseInt(computedStyle.width);
                const height = parseInt(computedStyle.height);
                setDimensions({ width, height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const base = Math.max(200, Math.min(dimensions.width, dimensions.height));
    // Mobile-friendly factors
    const isSmall = base <= 360;
    const isMedium = base > 360 && base <= 540;
    const radiusFactor = isSmall ? 0.42 : isMedium ? 0.50 : 0.58;
    const radius = base * radiusFactor;
    const strokeW = Math.max(4, base * (isSmall ? 0.006 : 0.01));
    const centerX = Math.max(0, dimensions.width / 2);
    const centerY = Math.max(0, dimensions.height / 2);

    // Calculate rotation angle to keep active slider at top
    const rotationAngle = -(currentIndex * 360 / totalSlides);

    return (
        <div className="circular-progress">
            {/* Logo icon - positioned outside the rotating SVG so it doesn't rotate */}
            <div className="circle-logo">
                <img src={logoIcon} alt="Logo" className="circle-logo-icon" />
            </div>

            <svg
                width={dimensions.width}
                height={dimensions.height}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                {/* Gradient definition for border */}
                <defs>
                    <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="22.5%" stopColor="rgba(0, 123, 255, 0.7)" />
                        <stop offset="80.89%" stopColor="rgba(23, 219, 252, 0.7)" />
                    </linearGradient>
                </defs>

                {/* Circle border */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    fill="none"
                    stroke="url(#circleGradient)"
                    strokeWidth={strokeW}
                    className="progress-circle"
                />

                {/* Slider names positioned around the circle */}
                {(slides || []).map((slide, index) => {
                    const angle = (index * 360 / totalSlides - 90) * (Math.PI / 180); // Start from top
                    const textRadius = radius + (base * (isSmall ? 0.03 : 0.08)); // Responsive text positioning
                    const x = centerX + textRadius * Math.cos(angle);
                    const y = centerY + textRadius * Math.sin(angle);
                    const isActive = index === currentIndex;
                    // Check if screen is 1920px or larger
                    const isLargeScreen = window.innerWidth >= 1920;
                    const fontSize = isLargeScreen ?
                        Math.max(18, base * 0.045) : // Larger font size for 1920px+ screens
                        Math.max(8, base * (isSmall ? 0.025 : 0.035)); // Original responsive font size
                    const activeFontSize = isLargeScreen ?
                        fontSize * 1.6 : // Larger scale boost for 1920px+ screens
                        fontSize * (isSmall ? 1.2 : 1.5); // Original scale boost

                    return (
                        <text
                            key={slide.id}
                            x={x}
                            y={y}
                            className={`slider-name ${isActive ? 'active' : ''}`}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                                fontSize: isActive ? activeFontSize : fontSize,
                                fontWeight: isActive ? '700' : '500',
                                fill: isActive ? '#17DBFC' : '#ffffff',
                                transform: `rotate(${angle * 180 / Math.PI + 90}deg) scale(${isActive ? (isLargeScreen ? 1.5 : (isSmall ? 1.15 : 1.35)) : 1})`,
                                transformOrigin: `${x}px ${y}px`,
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            {(() => {
                                const az = (slide.name || '').trim();
                                const en = (slide.nameEn || '').trim();
                                const ru = (slide.nameRu || '').trim();
                                if (language === 'en') return en || az || ru;
                                if (language === 'ru') return ru || az || en;
                                return az || en || ru;
                            })()}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}

export default function Home() {
    const scrollerRef = useRef(null);
    const { language } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState('next');
    const [imageWidth, setImageWidth] = useState(window.innerWidth / 3);
    const [slides, setSlides] = useState([]);

    // Fetch sliders from API
    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const response = await fetch('https://softech-api.webonly.io/api/sliders');
                if (response.ok) {
                    const data = await response.json();
                    console.log('API Response:', data);
                    // Transform API data to match frontend expectations
                    const transformedSlides = data.map(slide => ({
                        id: slide.id,
                        img: slide.imageUrl ? `https://softech-api.webonly.io${slide.imageUrl}` : '/assets/slider1.png',
                        name: slide.name || 'Default',
                        nameEn: slide.nameEn || 'Default',
                        nameRu: slide.nameRu || 'По умолчанию'
                    }));
                    console.log('Transformed Slides:', transformedSlides);
                    setSlides(transformedSlides);
                } else {
                    console.error('Failed to fetch sliders:', response.statusText);
                    // Fallback to fake data if API fails
                    setSlides([
                        { id: 1, img: '/assets/slider1.png', name: 'Texnologiya', nameEn: 'Technology', nameRu: 'Технология' },
                        { id: 2, img: '/assets/slider2.png', name: 'İnnovasiya', nameEn: 'Innovation', nameRu: 'Инновация' },
                        { id: 3, img: '/assets/slider3.png', name: 'Keyfiyyət', nameEn: 'Quality', nameRu: 'Качество' },
                        { id: 4, img: '/assets/slider4.png', name: 'Etibarlılıq', nameEn: 'Reliability', nameRu: 'Надежность' },
                        { id: 5, img: '/assets/slider5.png', name: 'Müasirlik', nameEn: 'Modernity', nameRu: 'Современность' },
                        { id: 6, img: '/assets/slider6.png', name: 'Peşəkar', nameEn: 'Professional', nameRu: 'Профессиональный' },
                    ]);
                }
            } catch (error) {
                console.error('Error fetching sliders:', error);
                // Fallback to fake data if API fails
                setSlides([
                    { id: 1, img: '/assets/slider1.png', name: 'Texnologiya', nameEn: 'Technology', nameRu: 'Технология' },
                    { id: 2, img: '/assets/slider2.png', name: 'İnnovasiya', nameEn: 'Innovation', nameRu: 'Инновация' },
                    { id: 3, img: '/assets/slider3.png', name: 'Keyfiyyət', nameEn: 'Quality', nameRu: 'Качество' },
                    { id: 4, img: '/assets/slider4.png', name: 'Etibarlılıq', nameEn: 'Reliability', nameRu: 'Надежность' },
                    { id: 5, img: '/assets/slider5.png', name: 'Müasirlik', nameEn: 'Modernity', nameRu: 'Современность' },
                    { id: 6, img: '/assets/slider6.png', name: 'Peşəkar', nameEn: 'Professional', nameRu: 'Профессиональный' },
                ]);
            }
        };

        fetchSliders();
    }, []);

    // Update image width on window resize
    useEffect(() => {
        const handleResize = () => {
            setImageWidth(window.innerWidth / 3);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // Auto-advance slider with infinite loop - DISABLED
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (!isTransitioning) {
    //             setDirection('next');
    //             setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    //         }
    //     }, 4000);

    //     return () => clearInterval(interval);
    // }, [isTransitioning]);

    // Update transform for smooth scrolling
    useEffect(() => {
        if (scrollerRef.current && slides.length > 0) {
            const gapWidth = 20; // 20px gap between images
            const totalItemWidth = imageWidth + gapWidth;

            // Debug logging
            console.log('Slider Debug:', {
                currentIndex,
                imageWidth,
                totalItemWidth,
                slidesLength: slides.length,
                viewportWidth: window.innerWidth
            });

            // Let's try a different approach
            // We want the active slide to appear in the center of the viewport
            // The viewport width is window.innerWidth
            // Each slide should take 1/3 of the viewport width
            // We need to position the scroller so that the active slide is centered

            // Calculate the center position of the viewport
            const viewportCenter = window.innerWidth / 2;

            // Calculate the position of the active slide in the middle copy
            const middleCopyStart = slides.length * totalItemWidth;
            const activeSlidePosition = middleCopyStart + (currentIndex * totalItemWidth);

            // Calculate how much we need to move the scroller to center the active slide
            const slideCenter = activeSlidePosition + (imageWidth / 2);
            const scrollPosition = slideCenter - viewportCenter;

            console.log('Viewport center:', viewportCenter);
            console.log('Active slide position:', activeSlidePosition);
            console.log('Slide center:', slideCenter);
            console.log('Scroll position:', scrollPosition);

            scrollerRef.current.style.transform = `translateX(-${scrollPosition}px)`;
        }
    }, [currentIndex, imageWidth, slides.length]);



    const nextSlide = () => {
        if (!isTransitioning && slides.length > 0) {
            setIsTransitioning(true);
            setDirection('next');
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);

            setTimeout(() => {
                setIsTransitioning(false);
            }, 600);
        }
    };

    const prevSlide = () => {
        if (!isTransitioning && slides.length > 0) {
            setIsTransitioning(true);
            setDirection('prev');
            setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);

            setTimeout(() => {
                setIsTransitioning(false);
            }, 600);
        }
    };

    return (
        <div className="home-container">
            <div className="circle-background-left"></div>
            <div className="circle-background-right"></div>

            {/* Logo text positioned absolutely */}
            <div className="home-logo-text">
                <img src={logoText} alt="Logo Text" className="home-logo-text-background" />
            </div>

            <div className="slider-container">
                <div className="top-ellipse">
                    <svg className="ellipse-svg" fill="none" preserveAspectRatio="none" viewBox="0 0 1920 147">
                        <ellipse cx="960" cy="73.5" fill="#111214" rx="960" ry="73.5" />
                    </svg>
                </div>

                <div className="image-scroller-wrapper">
                    <div className="image-scroller-container">
                        <div ref={scrollerRef} className="image-scroller" style={{ width: `${slides.length * (imageWidth + 20)}px` }}>
                            {[...slides, ...slides, ...slides].map((slide, index) => (
                                <div key={`${index}-${slide.id}`} className="image-slide" style={{ width: `${imageWidth}px`, backgroundImage: `url('${slide.img}')` }} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bottom-ellipse">
                    <svg className="ellipse-svg" fill="none" preserveAspectRatio="none" viewBox="0 0 1920 147">
                        <ellipse cx="960" cy="73.5" fill="#111214" rx="960" ry="73.5" />
                    </svg>
                </div>
            </div>

            <div className="circular-progress-container">
                <button className="slider-nav-btn slider-prev-btn" onClick={prevSlide} disabled={isTransitioning}>
                    <img src={prevIcon} alt="Previous" className="slider-nav-icon" />
                </button>
                <CircularProgress currentIndex={currentIndex} totalSlides={slides.length} slides={slides} language={language} />
                <button className="slider-nav-btn slider-next-btn" onClick={nextSlide} disabled={isTransitioning}>
                    <img src={nextIcon} alt="Next" className="slider-nav-icon" />
                </button>
            </div>
        </div>
    );
}
