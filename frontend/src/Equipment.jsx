import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from './contexts/LanguageContext.jsx';
import { useNavigate } from 'react-router-dom';
import LazySpline from './components/LazySpline';
import OptimizedImage from './components/OptimizedImage';
import FiltersComponent from './components/FiltersComponentNew.jsx';
import EquipmentCard from './components/EquipmentCard';
import MemoryCleanupButton from './components/MemoryCleanupButton';
import PageTitle from './components/PageTitle';
import { memoryManager } from './utils/memoryManager';
import equipmentPrevIcon from '/assets/equipment-prev.svg';
import equipmentNextIcon from '/assets/equipment-next.svg';
import './Equipment.css';

function Equipment() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState(null);
    const [isSliding, setIsSliding] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStartY, setTouchStartY] = useState(null);
    const [lastScrollTime, setLastScrollTime] = useState(0);

    const [equipmentList, setEquipmentList] = useState([]);
    const [mainEquipmentList, setMainEquipmentList] = useState([]);
    const [filteredEquipment, setFilteredEquipment] = useState([]);
    const [currentFilters, setCurrentFilters] = useState({
        categories: [],
        categoryNames: [],
        tags: [],
        tagNames: [],
        search: ''
    });
    const [isSearching, setIsSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEquipment, setTotalEquipment] = useState(0);
    const { language, setLanguage } = useLanguage();

    // Dynamic items per page based on screen size
    const getItemsPerPage = () => {
        console.log(`Screen size: ${window.innerWidth}x${window.innerHeight}`);
        if (window.innerWidth === 1920 && window.innerHeight === 1080) {
            return 8; // 8 equipment per page for 1920x1080
        }
        if (window.innerWidth === 1280 && window.innerHeight === 832) {
            return 4; // 4 equipment per page for 1280x832
        }
        if (window.innerWidth >= 1024) {
            return 6; // 6 equipment per page for desktop screens (1024px+)
        }
        return 4; // 4 equipment per page for mobile/tablet screens
    };
    const timeoutRef = useRef(null);
    const lastScrollYRef = useRef(0);

    const slideDuration = 300;

    const resolveUrl = (url) => {
        if (!url || url === 'string' || url === '') return '/assets/equipment1.png';
        if (url.startsWith('/uploads/')) return `https://softech-api.webonly.io${url}`;
        if (url.startsWith('/assets/')) return url;
        return url;
    };

    const currentItem = mainEquipmentList[currentIndex] || {};
    const hasMultipleImages = false;
    const currentImage = resolveUrl(currentItem.imageUrl);

    const handleMoreClick = () => {
        if (currentItem?.id) navigate(`/equipment/${currentItem.id}`);
    };

    const handleFilterChange = async (filters) => {
        // Capture current scroll position to prevent page jump
        lastScrollYRef.current = window.scrollY || 0;

        const restoreScroll = () => {
            // Restore after layout has updated
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.scrollTo(0, lastScrollYRef.current);
                });
            });
        };
        setCurrentFilters(filters);
        setCurrentPage(1); // Reset to first page when filters change
        setIsSearching(true);


        try {
            // Apply client-side filtering for categories and tags
            let filtered = equipmentList;

            // Filter by categories
            if (filters.categories && filters.categories.length > 0) {
                filtered = filtered.filter(equipment =>
                    equipment.categories &&
                    equipment.categories.some(cat => cat.id === filters.categories[0])
                );

            }

            // Filter by tags
            if (filters.tags && filters.tags.length > 0) {
                filtered = filtered.filter(equipment =>
                    equipment.tags &&
                    filters.tags.every(selectedTagId =>
                        equipment.tags.some(tag => tag.id === selectedTagId)
                    )
                );

            }

            // If there's a search term, use API search
            if (filters.search && filters.search.trim() !== '') {
                const searchUrl = `https://softech-api.webonly.io/api/equipment/search?q=${encodeURIComponent(filters.search.trim())}`;


                const response = await fetch(searchUrl);
                if (!response.ok) {
                    throw new Error(`Search failed: ${response.status}`);
                }

                const searchResults = await response.json();


                // Apply category and tag filters to search results
                let searchFiltered = searchResults;

                // Filter by categories
                if (filters.categories && filters.categories.length > 0) {
                    searchFiltered = searchFiltered.filter(equipment =>
                        equipment.categories &&
                        equipment.categories.some(cat => cat.id === filters.categories[0])
                    );
                }

                // Filter by tags
                if (filters.tags && filters.tags.length > 0) {
                    searchFiltered = searchFiltered.filter(equipment =>
                        equipment.tags &&
                        filters.tags.every(selectedTagId =>
                            equipment.tags.some(tag => tag.id === selectedTagId)
                        )
                    );
                }

                setFilteredEquipment(searchFiltered);
                restoreScroll();
            } else {
                // No search term, just apply category and tag filters
                setFilteredEquipment(filtered);
                restoreScroll();
            }

        } catch (error) {
            console.error('Search error:', error);
            // Fallback to client-side filtering if API fails
            let filtered = equipmentList;

            // Filter by categories
            if (filters.categories && filters.categories.length > 0) {
                filtered = filtered.filter(equipment =>
                    equipment.categories &&
                    equipment.categories.some(cat => cat.id === filters.categories[0])
                );
            }

            // Filter by tags
            if (filters.tags && filters.tags.length > 0) {
                filtered = filtered.filter(equipment =>
                    equipment.tags &&
                    filters.tags.every(selectedTagId =>
                        equipment.tags.some(tag => tag.id === selectedTagId)
                    )
                );
            }

            // Filter by search term - only search by name
            if (filters.search && filters.search.trim() !== '') {
                const searchTerm = filters.search.toLowerCase().trim();
                filtered = filtered.filter(equipment => {
                    const name = equipment.name?.toLowerCase() || '';
                    return name.includes(searchTerm);
                });
            }

            setFilteredEquipment(filtered);
            restoreScroll();
        } finally {
            setIsSearching(false);
        }
    };

    // Persist language selection for use on detail page
    useEffect(() => {
        try {
            localStorage.setItem('selectedLanguage', language);
        } catch { }
    }, [language]);

    // Handle pagination when currentPage or filteredEquipment change
    useEffect(() => {
        if (filteredEquipment.length > 0) {
            const itemsPerPage = getItemsPerPage();
            setTotalEquipment(filteredEquipment.length);
            setTotalPages(Math.ceil(filteredEquipment.length / itemsPerPage));
            console.log(`Total equipment: ${filteredEquipment.length}, Total pages: ${Math.ceil(filteredEquipment.length / itemsPerPage)}, Items per page: ${itemsPerPage}`);
        }
    }, [filteredEquipment]);

    const startSlide = (direction) => {
        if (isSliding) return;
        setSlideDirection(direction);
        setIsSliding(true);

        timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prev) => {
                if (!mainEquipmentList.length) return 0;
                if (direction === 'left') {
                    return prev === mainEquipmentList.length - 1 ? 0 : prev + 1;
                } else {
                    return prev === 0 ? mainEquipmentList.length - 1 : prev - 1;
                }
            });
            setSlideDirection(null);
            setIsSliding(false);
        }, slideDuration);
    };

    const getSlideStyle = () => {
        if (!slideDirection) return {};
        const distance = slideDirection === 'left' ? '-100%' : '100%';
        return {
            transform: `translateX(${distance})`,
            transition: `transform ${slideDuration}ms ease-in-out`,
        };
    };

    const resetSlideStyle = () => ({
        transform: 'translateX(0)',
        transition: `transform ${slideDuration}ms ease-in-out`,
    });

    const handleScrollerTouchStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!hasMultipleImages) return;
        const touch = e.touches[0];
        setTouchStartY(touch.clientY);
    };

    const handleScrollerTouchMove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!hasMultipleImages || !touchStartY) return;
    };

    const handleScrollerTouchEnd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTouchStartY(null);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchEquipment = async () => {
            try {
                const res = await fetch(`https://softech-api.webonly.io/api/equipment/full`);
                if (!res.ok) throw new Error('Failed to load equipment');
                const data = await res.json();

                if (isMounted) {

                    setEquipmentList(data);
                    setFilteredEquipment(data);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchEquipment();

        return () => {
            isMounted = false;
        };
    }, []);

    // Fetch main equipment for slider
    useEffect(() => {
        let isMounted = true;
        const fetchMainEquipment = async () => {
            try {
                const res = await fetch(`https://softech-api.webonly.io/api/equipment/main`);
                if (!res.ok) throw new Error('Failed to load main equipment');
                const data = await res.json();

                if (isMounted) {
                    setMainEquipmentList(data);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchMainEquipment();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        setCurrentImageIndex(0);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentIndex]);

    // Memory monitoring
    useEffect(() => {
        const memoryCheckInterval = setInterval(() => {
            if (memoryManager.isMemoryUsageHigh()) {
                console.warn('High memory usage detected');
                // Optionally clear caches or show warning to user
            }
        }, 30000); // Check every 30 seconds

        return () => {
            clearInterval(memoryCheckInterval);
        };
    }, []);

    const handleEquipmentCardClick = (equipmentId) => {
        navigate(`/equipment/${equipmentId}`);
    };

    // Translation function for pagination
    const tPagination = (key) => {
        const dict = {
            previous: {
                az: '‹',
                en: '‹',
                ru: '‹'
            },
            next: {
                az: '›',
                en: '›',
                ru: '›'
            },
            page: {
                az: 'Səhifə',
                en: 'Page',
                ru: 'Страница'
            },
            of: {
                az: 'dən',
                en: 'of',
                ru: 'из'
            }
        };
        return (dict[key] && (dict[key][language] || dict[key].az)) || key;
    };

    // Pagination handlers
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    // Get paginated equipment
    const getPaginatedEquipment = () => {
        const itemsPerPage = getItemsPerPage();
        console.log(`Getting paginated equipment - Items per page: ${itemsPerPage}, Total equipment: ${totalEquipment}, Current page: ${currentPage}`);
        if (totalEquipment <= 8) {
            return filteredEquipment; // Show all if 8 or fewer
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = filteredEquipment.slice(startIndex, endIndex);
        console.log(`Paginated items: ${paginatedItems.length} items (${startIndex} to ${endIndex})`);
        return paginatedItems;
    };

    return (
        <div className="equipment-container">
            <PageTitle title={language === 'en' ? 'Equipment' : language === 'ru' ? 'Оборудование' : 'Avadanlıqlar'} customClass="page-title-equipment" />
            <div className="equipment-circle-background-left-1"></div>
            <div className="equipment-circle-background-left-2"></div>
            <div className="equipment-circle-background-left-3"></div>
            <div className="equipment-circle-background-left-4"></div>

            <div className="equipment-center">
                <div className="equipment-rainbow">
                    <LazySpline
                        scene="https://prod.spline.design/mP2TljaQ-tsNIzZt/scene.splinecode"
                        fallbackImage="/assets/rainbow.png"
                        className="equipment-spline"
                    />
                </div>
            </div>

            <div className="equipment-content-row">
                {/* Main Content Area */}
                <div className="equipment-main-content">
                    <div className="equipment-left">
                        <div className="equipment-square" style={slideDirection ? getSlideStyle() : resetSlideStyle()} onTouchStart={handleScrollerTouchStart} onTouchMove={handleScrollerTouchMove} onTouchEnd={handleScrollerTouchEnd}>
                            <div className="equipment-square-content">
                                <div className="equipment-product-title">
                                    {(currentItem.name || '').split(' ').slice(0, -1).join(' ')}<br />
                                    {(currentItem.name || '').split(' ').slice(-1)}
                                </div>
                                <div className="equipment-product-model blue">{currentItem.version}</div>
                                <div className="equipment-product-cpu">{currentItem.core}</div>
                                <button className="equipment-more-btn" onClick={handleMoreClick}>
                                    {language === 'en' ? 'More' : language === 'ru' ? 'Подробнее' : 'Daha çox'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="equipment-right">
                        <div className="equipment-img-wrapper" style={slideDirection ? getSlideStyle() : resetSlideStyle()}>
                            <div className="equipment-title-left">
                                <div className="equipment-product-id">{currentItem.id}</div>
                                {currentItem.name}
                            </div>
                            <img src={equipmentPrevIcon} alt="Previous" className="equipment-nav-btn prev-btn" onClick={() => startSlide('right')} />
                            {currentImage && <OptimizedImage src={currentImage} alt={currentItem.name} className="equipment-main-img" onClick={() => setShowModal(true)} lazy={false} />}
                            <img src={equipmentNextIcon} alt="Next" className="equipment-nav-btn next-btn" onClick={() => startSlide('left')} />
                        </div>

                        <div className="equipment-details" style={slideDirection ? getSlideStyle() : resetSlideStyle()}>
                            <div className="equipment-product-id">{String(currentItem.id || '').padStart(2, '0')}</div>
                            <div className="equipment-product-name">{currentItem.name}</div>
                            <div className="equipment-cpu">{currentItem.core}</div>
                            <div className="equipment-model">{currentItem.version}</div>
                            <button className="emc-more-btn" onClick={handleMoreClick}>
                                {language === 'en' ? 'More' : language === 'ru' ? 'Подробнее' : 'Daha çox'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile controls: filter button + search bar */}
                <div className="equipment-mobile-controls">
                    <button
                        className="emc-filter-btn"
                        type="button"
                        onClick={() => setShowFilterModal(true)}
                        aria-label="Filters"
                    >
                        <img src="/assets/filter.svg" alt="filters" className="emc-filter-svg" />
                    </button>

                    <div className="emc-search">
                        <input
                            className="emc-search-input"
                            type="text"
                            value={currentFilters.search}
                            onChange={(e) => handleFilterChange({ ...currentFilters, search: e.target.value })}
                            placeholder={language === 'en' ? 'Search Product' : language === 'ru' ? 'Поиск товара' : 'Məhsul Axtar'}
                        />
                        <button
                            className="emc-search-btn"
                            type="button"
                            onClick={() => handleFilterChange({ ...currentFilters })}
                            aria-label={language === 'en' ? 'Search' : language === 'ru' ? 'Поиск' : 'Axtar'}
                        >
                            <span className="emc-search-icon" />
                        </button>
                    </div>
                </div>

                {/* Bottom Section - Left Sidebar + Right Content */}
                <div className="equipment-bottom-section">
                    {/* Left Sidebar - Filters */}
                    <div className="equipment-sidebar">
                        {/* Language follows global header; no local selector */}
                        <FiltersComponent onFilterChange={handleFilterChange} selectedLanguage={language} />
                        <MemoryCleanupButton className="equipment-memory-cleanup" />
                    </div>

                    {/* Right Content Area */}
                    <div className="equipment-right-content">
                        <div className="equipment-cards-container">
                            <div className="equipment-cards-heade">
                                {currentFilters.categories.length > 0 || currentFilters.tags.length > 0 || currentFilters.search ? (
                                    <div className="active-filters">
                                        <span>{language === 'en' ? 'Active filters:' : language === 'ru' ? 'Активные фильтры:' : 'Aktiv filterlər:'}</span>
                                        {currentFilters.categoryNames && currentFilters.categoryNames.length > 0 && (
                                            currentFilters.categoryNames.map(name => (
                                                <span key={`cat-${name}`} className="filter-badge">{name}</span>
                                            ))
                                        )}
                                        {currentFilters.tagNames && currentFilters.tagNames.length > 0 && (
                                            currentFilters.tagNames.map(name => (
                                                <span key={`tag-${name}`} className="filter-badge">{name}</span>
                                            ))
                                        )}
                                        {currentFilters.search && (
                                            <span className="filter-badge">{language === 'en' ? 'Search' : language === 'ru' ? 'Поиск' : 'Axtarış'}: "{currentFilters.search}"</span>
                                        )}
                                    </div>
                                ) : null}
                            </div>

                            {filteredEquipment.length === 0 ? (
                                <div className="no-equipment-found">
                                    <p>{language === 'en' ? 'No equipment found matching your filters.' : language === 'ru' ? 'Оборудование, соответствующее вашим фильтрам, не найдено.' : 'Filtrlərə uyğun avadanlıq tapılmadı.'}</p>
                                    <button
                                        className="clear-filters-btn"
                                        onClick={() => handleFilterChange({ categories: [], tags: [], search: '' })}
                                    >
                                        {language === 'en' ? 'Clear All Filters' : language === 'ru' ? 'Сбросить все фильтры' : 'Bütün Filtrləri Təmizlə'}
                                    </button>
                                </div>
                            ) : (
                                <div className="equipment-cards-grid">
                                    {getPaginatedEquipment().map(equipment => (
                                        <EquipmentCard
                                            key={equipment.id}
                                            equipment={equipment}
                                            onMoreClick={handleEquipmentCardClick}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Pagination Component */}
                            {totalEquipment > 8 && (
                                <div className="equipment-pagination">
                                    <div className="pagination-controls">
                                        <button
                                            className="pagination-btn pagination-prev"
                                            onClick={handlePrevious}
                                            disabled={currentPage === 1}
                                        >
                                            <span>{tPagination('previous')}</span>
                                        </button>

                                        <div className="pagination-numbers">
                                            {getPageNumbers().map((pageNumber) => (
                                                <button
                                                    key={pageNumber}
                                                    className={`pagination-number ${pageNumber === currentPage ? 'active' : ''}`}
                                                    onClick={() => handlePageClick(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            className="pagination-btn pagination-next"
                                            onClick={handleNext}
                                            disabled={currentPage === totalPages}
                                        >
                                            <span>{tPagination('next')}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && currentImage && (
                <div className="equipment-modal" onClick={() => setShowModal(false)}>
                    <OptimizedImage src={currentImage} alt={currentItem.name} className="equipment-modal-img" lazy={false} />
                </div>
            )}

            {showFilterModal && (
                <div className="emc-filter-modal" onClick={() => setShowFilterModal(false)}>
                    <div className="emc-filter-sheet" onClick={(e) => e.stopPropagation()}>
                        <div className="emc-filter-header">
                            <span>{language === 'en' ? 'Filters' : language === 'ru' ? 'Фильтры' : 'Filterlər'}</span>
                            <button className="emc-filter-close" onClick={() => setShowFilterModal(false)} aria-label="Close">✕</button>
                        </div>
                        <div className="emc-filter-body">
                            <FiltersComponent onFilterChange={handleFilterChange} selectedLanguage={language} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Equipment;
