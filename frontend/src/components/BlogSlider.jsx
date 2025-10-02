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
    const [currentIndex, setCurrentIndex] = useState(0); // Start with first card (index 0)
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');
    const navigate = useNavigate();

    const goToSlide = (index) => {
        if (index === currentIndex || isAnimating || index < 0 || index >= blogData.length) return;

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

        // Handle edge cases for 1 and 2 cards
        if (totalCards === 1) {
            return {
                left: null,
                middle: blogData[0],
                right: null
            };
        }

        if (totalCards === 2) {
            if (currentIndex === 0) {
                return {
                    left: null,
                    middle: blogData[0],
                    right: blogData[1]
                };
            } else {
                return {
                    left: blogData[0],
                    middle: blogData[1],
                    right: null
                };
            }
        }

        // Handle 3+ cards (original logic)
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

    // Smart pagination logic - limit visible buttons
    const getPaginationButtons = () => {
        const totalPages = blogData.length;
        const maxVisibleButtons = 5; // Maximum number of buttons to show
        const currentPage = currentIndex + 1;

        if (totalPages <= maxVisibleButtons) {
            // Show all buttons if total is less than or equal to max
            return blogData.map((blog, index) => ({
                type: 'button',
                index: index,
                number: blog.number,
                isActive: index === currentIndex
            }));
        }

        // Smart pagination for many blogs
        const buttons = [];
        const halfVisible = Math.floor(maxVisibleButtons / 2);

        // Always show first button
        buttons.push({
            type: 'button',
            index: 0,
            number: blogData[0].number,
            isActive: currentIndex === 0
        });

        // Calculate start and end positions
        let startPos = Math.max(1, currentPage - halfVisible);
        let endPos = Math.min(totalPages - 1, currentPage + halfVisible);

        // Adjust if we're near the beginning
        if (currentPage <= halfVisible) {
            endPos = Math.min(totalPages - 1, maxVisibleButtons - 1);
        }

        // Adjust if we're near the end
        if (currentPage >= totalPages - halfVisible) {
            startPos = Math.max(1, totalPages - maxVisibleButtons + 1);
        }

        // Add ellipsis after first button if needed
        if (startPos > 1) {
            buttons.push({
                type: 'ellipsis',
                text: '...'
            });
        }

        // Add middle buttons
        for (let i = startPos; i < endPos; i++) {
            if (i !== 0 && i !== totalPages - 1) { // Skip first and last (already handled)
                buttons.push({
                    type: 'button',
                    index: i,
                    number: blogData[i].number,
                    isActive: i === currentIndex
                });
            }
        }

        // Add ellipsis before last button if needed
        if (endPos < totalPages - 1) {
            buttons.push({
                type: 'ellipsis',
                text: '...'
            });
        }

        // Always show last button (if not already shown)
        if (totalPages > 1) {
            buttons.push({
                type: 'button',
                index: totalPages - 1,
                number: blogData[totalPages - 1].number,
                isActive: currentIndex === totalPages - 1
            });
        }

        return buttons;
    };

    return (
        <div className="blog-slider-container">
            {/* Slider Cards */}
            <div className="blog-slider-cards">
                {/* Left Card - Only render if exists */}
                {visibleCards.left && (
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
                )}

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

                {/* Right Card - Only render if exists */}
                {visibleCards.right && (
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
                )}
            </div>

            {/* Navigation Buttons - Only show if more than 1 card */}
            {blogData.length > 1 && (
                <div className="blog-slider-navigation">
                    {getPaginationButtons().map((item, index) => (
                        item.type === 'button' ? (
                            <button
                                key={`btn-${item.index}`}
                                className={`blog-slider-nav-btn ${item.isActive ? 'active' : ''}`}
                                onClick={() => goToSlide(item.index)}
                            >
                                {item.number}
                            </button>
                        ) : (
                            <span key={`ellipsis-${index}`} className="blog-slider-ellipsis">
                                {item.text}
                            </span>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogSlider;
