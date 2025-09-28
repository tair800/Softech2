import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogSlider.css';

const BlogSlider = ({
    blogData = [
        {
            id: 1,
            image: "/assets/equipment1.png",
            alt: "Blog Detail 1",
            number: "01",
            title: "Texnoloji İnnovasiyalar",
            description: "Müasir texnologiyaların tətbiqi və inkişafı üzrə ən son yeniliklər və təcrübələr haqqında ətraflı məlumat."
        },
        {
            id: 2,
            image: "/assets/maps-logo.png",
            alt: "Blog Detail 2",
            number: "02",
            title: "2025-ci ildə Rəqəmsal\nTrendlər",
            description: "Ən son texnoloji yeniliklər və innovasiyalar haqqında ətraflı məlumat və analiz."
        },
        {
            id: 3,
            image: "/assets/services-active.png",
            alt: "Blog Detail 3",
            number: "03",
            title: "Uğur Hekayələri",
            description: "Müştərilərimizin layihələrindən seçilmiş qısa təsvirlər və uğur hekayələri."
        },
        {
            id: 4,
            image: "/assets/equipment1.png",
            alt: "Blog Detail 4",
            number: "04",
            title: "Yeni Texnologiyalar",
            description: "İnnovativ həllər və müasir texnologiyaların tətbiqi sahəsində ən son yeniliklər."
        },
        {
            id: 5,
            image: "/assets/maps-logo.png",
            alt: "Blog Detail 5",
            number: "05",
            title: "Gələcək Proqnozları",
            description: "Texnoloji inkişafın gələcək istiqamətləri və proqnozlar haqqında ətraflı məlumat."
        }
    ]
}) => {
    // Function to truncate description text
    const truncateDescription = (text, maxLength = 125) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };
    const [currentIndex, setCurrentIndex] = useState(1); // Start with middle card (index 1)
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');
    const navigate = useNavigate();

    const goToSlide = (index) => {
        if (index === currentIndex || isAnimating) return;

        setIsAnimating(true);

        // Determine slide direction
        const totalCards = blogData.length;
        let direction = '';

        if (index > currentIndex) {
            direction = 'right';
        } else if (index < currentIndex) {
            direction = 'left';
        }

        setSlideDirection(direction);
        setCurrentIndex(index);

        // Reset animation state after transition completes
        setTimeout(() => {
            setIsAnimating(false);
            setSlideDirection('');
        }, 600); // Match CSS transition duration
    };

    const getVisibleCards = () => {
        const totalCards = blogData.length;
        let leftIndex, middleIndex, rightIndex;

        if (currentIndex === 0) {
            // First card is middle
            leftIndex = totalCards - 1; // Last card on left
            middleIndex = 0;
            rightIndex = 1;
        } else if (currentIndex === totalCards - 1) {
            // Last card is middle
            leftIndex = currentIndex - 1;
            middleIndex = currentIndex;
            rightIndex = 0; // First card on right
        } else {
            // Normal case
            leftIndex = currentIndex - 1;
            middleIndex = currentIndex;
            rightIndex = currentIndex + 1;
        }

        return {
            left: blogData[leftIndex],
            middle: blogData[middleIndex],
            right: blogData[rightIndex]
        };
    };

    const visibleCards = getVisibleCards();

    return (
        <div className="blog-slider-container">
            {/* Slider Cards */}
            <div className="blog-slider-cards">
                {/* Left Card */}
                <div
                    className={`blog-slider-card blog-slider-card-small ${slideDirection === 'left' ? 'slide-left' :
                        slideDirection === 'right' ? 'slide-right' : ''
                        }`}
                    onClick={() => navigate(`/blog/${visibleCards.left.id}`)}
                    role="button"
                    style={{ cursor: 'pointer' }}
                >
                    <div className="blog-image-card">
                        <img
                            key={`left-${visibleCards.left.id}`}
                            src={visibleCards.left.image}
                            alt={visibleCards.left.alt}
                            onError={(e) => { e.currentTarget.src = "/assets/equipment1.png"; }}
                            className={`blog-image ${slideDirection === 'left' ? 'image-slide-out-left' :
                                slideDirection === 'right' ? 'image-slide-in-left' : ''
                                }`}
                        />
                    </div>
                    <div className="blog-caption">
                        <div className="blog-caption-inner">
                            <div className="row g-2 align-items-stretch">
                                <div className="col-4 col-md-3">
                                    <div className="cap-number-box">
                                        <span className="cap-number">{visibleCards.left.number}</span>
                                    </div>
                                </div>
                                <div className="col-8 col-md-9">
                                    <div className="cap-title-box">
                                        <h2>{visibleCards.left.title}</h2>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="cap-desc-box">
                                        <p>{truncateDescription(visibleCards.left.description)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Card (Big) */}
                <div
                    className={`blog-slider-card blog-slider-card-big ${slideDirection === 'left' ? 'slide-left' :
                        slideDirection === 'right' ? 'slide-right' : 'slide-center'
                        }`}
                    onClick={() => navigate(`/blog/${visibleCards.middle.id}`)}
                    role="button"
                    style={{ cursor: 'pointer' }}
                >
                    <div className="blog-image-card tall">
                        <img
                            key={`middle-${visibleCards.middle.id}`}
                            src={visibleCards.middle.image}
                            alt={visibleCards.middle.alt}
                            onError={(e) => { e.currentTarget.src = "/assets/equipment1.png"; }}
                            className={`blog-image ${slideDirection === 'left' ? 'image-slide-out-center' :
                                slideDirection === 'right' ? 'image-slide-in-center' : 'image-center'
                                }`}
                        />
                        {/* Top overlay for number and title */}
                        <div className="blog-caption-overlay blog-caption-top">
                            <div className="blog-caption-inner">
                                <div className="row g-2 align-items-stretch mt-2">
                                    <div className="col-3">
                                        <div className="cap-number-box">
                                            <span className="cap-number">{visibleCards.middle.number}</span>
                                        </div>
                                    </div>
                                    <div className="col-9">
                                        <div className="cap-title-box">
                                            <h2>{visibleCards.middle.title}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Bottom overlay for description */}
                        <div className="blog-caption-overlay blog-caption-bottom">
                            <div className="blog-caption-inner">
                                <div className="cap-desc-box">
                                    <p>{truncateDescription(visibleCards.middle.description)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Card */}
                <div
                    className={`blog-slider-card blog-slider-card-small ${slideDirection === 'left' ? 'slide-left' :
                        slideDirection === 'right' ? 'slide-right' : ''
                        }`}
                    onClick={() => navigate(`/blog/${visibleCards.right.id}`)}
                    role="button"
                    style={{ cursor: 'pointer' }}
                >
                    <div className="blog-image-card">
                        <img
                            key={`right-${visibleCards.right.id}`}
                            src={visibleCards.right.image}
                            alt={visibleCards.right.alt}
                            onError={(e) => { e.currentTarget.src = "/assets/equipment1.png"; }}
                            className={`blog-image ${slideDirection === 'left' ? 'image-slide-in-right' :
                                slideDirection === 'right' ? 'image-slide-out-right' : ''
                                }`}
                        />
                    </div>
                    <div className="blog-caption">
                        <div className="blog-caption-inner">
                            <div className="row g-2 align-items-stretch">
                                <div className="col-4 col-md-3">
                                    <div className="cap-number-box">
                                        <span className="cap-number">{visibleCards.right.number}</span>
                                    </div>
                                </div>
                                <div className="col-8 col-md-9">
                                    <div className="cap-title-box">
                                        <h2>{visibleCards.right.title}</h2>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="cap-desc-box">
                                        <p>{truncateDescription(visibleCards.right.description)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="blog-slider-navigation">
                {blogData.map((blog, index) => (
                    <button
                        key={blog.id}
                        className={`blog-slider-nav-btn ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    >
                        {blog.number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BlogSlider;
