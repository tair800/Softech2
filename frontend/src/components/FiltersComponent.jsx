import React, { useState, useEffect } from 'react';
import './FiltersComponent.css';

// SVG Icon component
function Iconset() {
    return (
        <div className="iconset-container" data-name="iconset">
            <svg className="iconset-svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g id="iconset">
                    <path
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        id="Vector"
                        stroke="var(--stroke-0, white)"
                        strokeLinecap="round"
                        strokeMiterlimit="10"
                        strokeWidth="1.5"
                    />
                </g>
            </svg>
        </div>
    );
}

// Search Icon component
function Iconset1() {
    return (
        <div className="search-icon" data-name="iconset">
            <svg className="search-svg" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g id="iconset">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" fill="var(--fill-0, white)" id="Vector" />
                </g>
            </svg>
        </div>
    );
}

// Search Frame component
function Frame22() {
    return (
        <div className="search-frame">
            <div className="search-placeholder">
                <p className="search-text">Məhsul Axtar</p>
            </div>
            <Iconset1 />
        </div>
    );
}

// Search Container component
function Frame18() {
    return (
        <div className="search-container">
            <Frame22 />
        </div>
    );
}

// Reset Button component
function LinkBlock({ onReset }) {
    return (
        <div className="reset-button" data-name="Link [block]" onClick={onReset}>
            <div aria-hidden="true" className="reset-border" />
            <div className="reset-text">
                <p className="reset-label">Reset</p>
            </div>
        </div>
    );
}

const FiltersComponent = ({ onFilterChange, selectedLanguage = 'en' }) => {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        fetchCategoriesAndTags();
    }, []);

    // Reload categories and tags when language changes
    useEffect(() => {
        fetchCategoriesAndTags();
    }, [selectedLanguage]);

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Restore scroll position after filter changes
    useEffect(() => {
        if (scrollPosition > 0) {
            window.scrollTo(0, scrollPosition);
        }
    }, [selectedCategories, selectedTags, searchTerm]);

    const fetchCategoriesAndTags = async () => {
        try {
            setLoading(true);

            // Fetch categories with language parameter
            const categoriesResponse = await fetch(`https://softech-api.webonly.io/api/equipment/categories?language=${selectedLanguage}`);
            const categoriesData = await categoriesResponse.json();

            // Fetch tags with language parameter
            const tagsResponse = await fetch(`https://softech-api.webonly.io/api/equipment/tags?language=${selectedLanguage}`);
            const tagsData = await tagsResponse.json();

            setCategories(categoriesData);
            setTags(tagsData);
        } catch (error) {
            console.error('Error fetching categories and tags:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories(prev => {
            // For categories, only allow one selection at a time
            const newSelection = prev.includes(categoryId)
                ? [] // If clicking the same category, deselect it
                : [categoryId]; // If clicking a different category, select only that one

            // Notify parent component of filter changes
            if (onFilterChange) {
                onFilterChange({
                    categories: newSelection,
                    tags: selectedTags,
                    search: searchTerm
                });
            }

            return newSelection;
        });
    };

    const handleTagToggle = (tagId) => {
        setSelectedTags(prev => {
            const newSelection = prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId];

            // Notify parent component of filter changes
            if (onFilterChange) {
                onFilterChange({
                    categories: selectedCategories,
                    tags: newSelection,
                    search: searchTerm
                });
            }

            return newSelection;
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        console.log('Search input changed to:', value); // Debug log

        // Notify parent component of filter changes
        if (onFilterChange) {
            onFilterChange({
                categories: selectedCategories,
                tags: selectedTags,
                search: value
            });
        }
    };

    const clearAllFilters = () => {
        setSelectedCategories([]); // Clear single category selection
        setSelectedTags([]); // Clear multiple tag selections
        setSearchTerm('');

        if (onFilterChange) {
            onFilterChange({
                categories: [],
                tags: [],
                search: ''
            });
        }
    };

    if (loading) {
        return (
            <div className="filters-container">
                <div className="filters-content">
                    <div className="filters-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading filters...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate dynamic height based on content
    const calculateContainerHeight = () => {
        const baseHeight = 400; // Base height for titles and search
        const categoriesHeight = categories.length * 25; // 25px per category
        const tagsHeight = tags.length * 30; // 30px per tag - show all tags
        const clearButtonHeight = (selectedCategories.length > 0 || selectedTags.length > 0 || searchTerm) ? 50 : 0;

        return baseHeight + categoriesHeight + tagsHeight + clearButtonHeight;
    };

    return (
        <div className="filters-container" style={{ height: `${calculateContainerHeight()}px` }}>
            <div className="filters-content">
                <div className="filter-icon">
                    <div className="icon-rotated">
                        <img src="/assets/filter.png" alt="Filter" style={{ width: '24px', height: '24px' }} />
                    </div>
                </div>
                <div className="filters-title">
                    <p className="filters-title-text">Filters</p>
                </div>
                <div className="category-title">
                    <p className="category-title-text">Category</p>
                </div>
                <div className="tags-title">
                    <p className="tags-title-text">Tags</p>
                </div>







                {/* Dynamic Categories */}
                {categories.map((category, index) => (
                    <div
                        key={category.id}
                        className={`category-item ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                        onClick={() => handleCategoryToggle(category.id)}
                        style={{
                            left: '24px',
                            top: `${173.5 + (index * 25)}px`
                        }}
                    >
                        <p className="category-item-text">{category.name} ({category.equipmentCount || 0})</p>
                    </div>
                ))}

                {/* Dynamic Tags */}
                {tags.map((tag, index) => (
                    <div
                        key={tag.id}
                        className={`tag-item ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                        onClick={() => handleTagToggle(tag.id)}
                        style={{
                            left: '24px',
                            top: `${400 + (index * 30)}px`,
                            width: 'auto',
                            minWidth: '80px'
                        }}
                    >
                        <div className="tag-text">
                            <p className="tag-label">{tag.name} ({tag.equipmentCount || 0})</p>
                        </div>
                    </div>
                ))}

                {/* Search Container */}
                <div className="search-container">
                    <div className="search-frame">
                        <input
                            type="text"
                            placeholder="Məhsul Axtar"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    console.log('Search submitted:', searchTerm);
                                }
                            }}
                            className="search-input"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '14px',
                                width: '100%',
                                padding: '8px 0',
                                fontFamily: 'MadaniArabic-Medium, sans-serif'
                            }}
                        />
                        <div style={{
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ width: '16px', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '1px' }}></div>
                            <div style={{ width: '16px', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '1px' }}></div>
                            <div style={{ width: '16px', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '1px' }}></div>
                        </div>
                    </div>
                </div>

                {/* Clear Filters Button */}
                {(selectedCategories.length > 0 || selectedTags.length > 0 || searchTerm) && (
                    <div
                        className="clear-filters-btn"
                        onClick={clearAllFilters}
                        style={{
                            position: 'absolute',
                            left: '24px',
                            top: `${400 + (tags.length * 30) + 50}px`
                        }}
                    >
                        Clear All Filters
                    </div>
                )}

            </div>
            <div aria-hidden="true" className="filters-outer-border" />
        </div>
    );
};

export default FiltersComponent;
