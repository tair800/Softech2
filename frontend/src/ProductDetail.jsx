import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import { useParams } from 'react-router-dom';
// Fetch from API instead of static data
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const { language } = useLanguage();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSection, setCurrentSection] = useState(0);
    const [showSections, setShowSections] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const sliderRef = useRef(null);
    const mainSectionRef = useRef(null);
    const sectionRefs = useRef({});

    const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/uploads/')) return `http://localhost:5098${url}`;
        return url;
    };

    // Fetch product detail (localized)
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5098/api/products/${id}?language=${language}`);
                if (!res.ok) throw new Error('Failed to load product');
                const data = await res.json();

                // Debug: Log the API response to see available fields
                console.log('Product API Response:', data);

                // Transform API data to match the expected structure
                const sections = [];

                // Only add sections that have actual content
                if (data.section1Title && data.section1Description) {
                    sections.push({
                        title: data.section1Title,
                        content: data.section1Description,
                        image: data.section1Image ? resolveUrl(data.section1Image) : '',
                        moreText: data.section1MoreText || ''
                    });
                }

                if (data.section2Title && data.section2Description) {
                    sections.push({
                        title: data.section2Title,
                        content: data.section2Description,
                        image: data.section2Image ? resolveUrl(data.section2Image) : '',
                        moreText: data.section2MoreText || ''
                    });
                }

                if (data.section3Title && data.section3Description) {
                    sections.push({
                        title: data.section3Title,
                        content: data.section3Description,
                        image: data.section3Image ? resolveUrl(data.section3Image) : '',
                        moreText: data.section3MoreText || ''
                    });
                }

                setProduct({
                    ...data,
                    sections: sections
                });
                setLoading(false);
            } catch (e) {
                console.error(e);
                setError(e.message);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, language]);

    // removed early returns here to avoid breaking hook order

    // Create dynamic sections based on the number of sections (stable reference)
    const sections = useMemo(() => {
        const s = [{ label: 'Start', value: 0 }];
        const sectionCount = (product && Array.isArray(product.sections)) ? product.sections.length : 0;
        for (let i = 0; i < sectionCount; i += 1) {
            s.push({ label: String(i + 1).padStart(2, '0'), value: i + 1 });
        }
        return s;
    }, [product]);

    const scrollToSection = (sectionIndex) => {
        setCurrentSection(sectionIndex);
        let targetRef;

        if (sectionIndex === 0) {
            // Start - scroll to main section
            targetRef = mainSectionRef.current;
        } else {
            // Scroll to dynamic section
            targetRef = sectionRefs.current[sectionIndex - 1];
        }

        if (targetRef) {
            targetRef.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScrollDown = () => {
        // Reveal sections first, then scroll
        if (!showSections) {
            setShowSections(true);
            // Wait a tick for sections to mount, then scroll
            setTimeout(() => {
                scrollToSection(1);
            }, 50);
        } else {
            scrollToSection(1); // Go to first section
        }
    };

    const handleReadMore = () => {
        if (!isExpanded) {
            setShowSections(true);
            setIsExpanded(true);
            // Scroll to first section after animation
            setTimeout(() => {
                scrollToSection(1);
            }, 300);
        }
    };

    const handleReadLess = () => {
        setIsExpanded(false);
        // Scroll back to main section
        setTimeout(() => {
            setShowSections(false);
            scrollToSection(0);
        }, 300);
    };

    // Scroller functions
    const handleMouseDown = (e) => {
        setIsDragging(true);
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;
        const newPosition = Math.max(0, Math.min(height - 60, y - 30));

        setScrollPosition(newPosition);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleSectionClick = (index) => {
        scrollToSection(index);
        const maxSections = sections.length - 1; // Exclude Start section for calculation
        const trackHeight = sections.length * 60;
        const maxPosition = trackHeight - 60; // Track height - indicator height
        const newPosition = maxSections > 0 ? (index / maxSections) * maxPosition : 0;
        setScrollPosition(newPosition);
    };

    // Update scroller position when currentSection changes
    useEffect(() => {
        const maxSections = sections.length - 1; // Exclude Start section for calculation
        const trackHeight = sections.length * 60;
        const maxPosition = trackHeight - 60; // Track height - indicator height
        const newPosition = maxSections > 0 ? (currentSection / maxSections) * maxPosition : 0;
        setScrollPosition(newPosition);
    }, [currentSection, sections.length]);

    // Attach mouse events to document when dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Force scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentSection(0);
    }, []);

    // Intersection Observer to detect which section is in view
    useEffect(() => {
        if (!product) return; // wait until product is loaded
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '-10% 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.dataset.section;
                    setCurrentSection(parseInt(sectionId));
                }
            });
        }, observerOptions);

        // Observe all sections including main section
        const allSectionRefs = [mainSectionRef.current];

        // Add dynamic section refs
        Object.values(sectionRefs.current).forEach((sectionRef) => {
            if (sectionRef) {
                allSectionRefs.push(sectionRef);
            }
        });

        allSectionRefs.forEach((section, index) => {
            if (section) {
                section.dataset.section = index; // 0 for main, 1 for first section, 2 for second section, etc.
                observer.observe(section);
            }
        });

        return () => observer.disconnect();
    }, [product]);

    // Safe early returns AFTER all hooks have been called
    if (loading) {
        return <div className="product-detail-container"><div className="product-detail-content">Loading...</div></div>;
    }
    if (error || !product) {
        return <div className="product-detail-container"><div className="product-detail-content">{error || 'Not found'}</div></div>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-detail-circle-background-1"></div>
            <div className="product-detail-circle-background-2"></div>

            <div className="product-detail-content">
                {/* Main Section */}
                <div className="main-section" ref={mainSectionRef}>
                    <div className="main-left">
                        <div className="scroller-wrapper">
                            <div className="scroller-container">
                                <div className="scroller-labels">
                                    {sections.map((section, index) => (
                                        <div key={section.label} className="scroller-label" onClick={() => handleSectionClick(index)}>
                                            <p>{section.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div ref={sliderRef} className="scroller-track" style={{ height: `${sections.length * 60}px` }} onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const trackHeight = sections.length * 60;
                                    const y = e.clientY - rect.top;
                                    const newPosition = Math.max(0, Math.min(trackHeight - 60, y - 30));
                                    setScrollPosition(newPosition);
                                }} />
                                <div className="scroller-indicator" style={{ top: `${scrollPosition}px` }} onMouseDown={handleMouseDown} />
                            </div>
                        </div>
                        {product.image || product.imageUrl || product.mainImage ? (
                            <img src={resolveUrl(product.image || product.imageUrl || product.mainImage)} alt="Product" className="product-detail-image" />
                        ) : (
                            <div className="product-detail-image-placeholder">
                                <p>No image available</p>
                            </div>
                        )}

                    </div>
                    <div className="main-right">
                        <h1 className="product-detail-title">{product.name}</h1>
                        <div className="product-detail-line"></div>
                        <p className="product-detail-description">{product.detailDescription}</p>
                        <div className="product-detail-scroll" onClick={isExpanded ? handleReadLess : handleReadMore}>
                            <span>{isExpanded ? 'Daha az' : 'Daha çox'}</span>
                            <img src="/assets/arrowDown.png" alt="Arrow down" className={`scroll-arrow ${isExpanded ? 'rotated' : ''}`} />
                        </div>
                    </div>
                </div>



                {/* Dynamic Sections - hidden until user clicks Read more */}
                {showSections && product.sections?.map((section, index) => {
                    const sectionNumber = String(index + 1).padStart(2, '0');
                    const isEven = index % 2 === 0;

                    return (
                        <div
                            key={index}
                            className={`${isEven ? 'first' : 'second'}-section ${isExpanded ? 'animate-in' : ''}`}
                            ref={(el) => {
                                sectionRefs.current[index] = el;
                            }}
                        >
                            {isEven ? (
                                // Even sections: content on left, image on right
                                <>
                                    <div className={`${isEven ? 'first' : 'second'}-left`}>
                                        <div className={`${isEven ? 'first' : 'second'}-content-container`}>
                                            <div className={`page-number-${sectionNumber}`}>{sectionNumber}</div>
                                            <div className={`${isEven ? 'first' : 'second'}-tagline-container`} data-name="Tagline">
                                                <div className={`${isEven ? 'first' : 'second'}-tagline-line`} data-name="Line"></div>
                                            </div>
                                            <div className={`${isEven ? 'first' : 'second'}-content-title`}>
                                                <p className="block leading-[normal]">{section.title}</p>
                                            </div>
                                            <div className={`${isEven ? 'first' : 'second'}-content-description`}>
                                                <p className="block leading-[1.2]">{section.content}</p>
                                            </div>
                                            {section.moreText && (
                                                <div className={`${isEven ? 'first' : 'second'}-more-container`} data-name="More">
                                                    <div className={`${isEven ? 'first' : 'second'}-more-text`}>
                                                        <p className="block mb-0">{section.moreText}</p>
                                                        {isEven && (
                                                            <>
                                                                <p className="block mb-0">&nbsp;</p>
                                                                <p className="block">&nbsp;</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`${isEven ? 'first' : 'second'}-right`}>
                                        {section.image && <img src={resolveUrl(section.image)} alt={`Section ${index + 1}`} className="product-detail-image" />}
                                    </div>
                                </>
                            ) : (
                                // Odd sections: image on left, content on right
                                <>
                                    <div className={`${isEven ? 'first' : 'second'}-left`}>
                                        {section.image && <img src={resolveUrl(section.image)} alt={`Section ${index + 1}`} className="product-detail-image" />}
                                    </div>
                                    <div className={`${isEven ? 'first' : 'second'}-right`}>
                                        <div className={`${isEven ? 'first' : 'second'}-content-container`}>
                                            <div className={`page-number-${sectionNumber}`}>{sectionNumber}</div>
                                            <div className={`${isEven ? 'first' : 'second'}-tagline-container`} data-name="Tagline">
                                                <div className={`${isEven ? 'first' : 'second'}-tagline-line`} data-name="Line"></div>
                                            </div>
                                            <div className={`${isEven ? 'first' : 'second'}-content-heading`}>
                                                <p className="block leading-[normal]">{section.title}</p>
                                            </div>
                                            <div className={`${isEven ? 'first' : 'second'}-content-description`}>
                                                <p className="block leading-[1.2]">{section.content}</p>
                                            </div>
                                            {section.moreText && (
                                                <div className={`${isEven ? 'first' : 'second'}-more-container`} data-name="More">
                                                    <div className={`${isEven ? 'first' : 'second'}-more-text`}>
                                                        <p className="block mb-0">{section.moreText}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProductDetail;
