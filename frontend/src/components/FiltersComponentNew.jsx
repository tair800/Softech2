import React, { useState, useEffect } from 'react';
import './FiltersComponent.css';

// Loading component
function LoadingSpinner({ label = 'Loading filters...' }) {
    return (
        <div className="filters-loading">
            <div className="loading-spinner"></div>
            <p>{label}</p>
        </div>
    );
}

// Reset Button component
function LinkBlock({ onReset, label = 'Reset' }) {
    return (
        <div className="reset-button" data-name="Link [block]" onClick={onReset}>
            <div aria-hidden="true" className="reset-border" />
            <div className="reset-text">
                <p className="reset-label">{label}</p>
            </div>
        </div>
    );
}

export default function FiltersComponent({ onFilterChange, selectedLanguage = 'en' }) {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);

    const t = (key) => {
        const dict = {
            filters: { az: 'Filterlər', en: 'Filters', ru: 'Фильтры' },
            loading: { az: 'Filterlər yüklənir...', en: 'Loading filters...', ru: 'Загрузка фильтров...' },
            searchPlaceholder: { az: 'Məhsul Axtar', en: 'Search Product', ru: 'Поиск товара' },
            categories: { az: 'Kateqoriyalar', en: 'Categories', ru: 'Категории' },
            tags: { az: 'Etiketlər', en: 'Tags', ru: 'Теги' },
            clearAll: { az: 'Hamısını Təmizlə', en: 'Clear All', ru: 'Очистить все' },
            reset: { az: 'Sıfırla', en: 'Reset', ru: 'Сбросить' },
        };
        return (dict[key] && (dict[key][selectedLanguage] || dict[key].az)) || key;
    };

    const pickName = (item) => {
        const base = (item?.name || '').trim();
        const en = (item?.nameEn || '').trim();
        const ru = (item?.nameRu || '').trim();
        if (selectedLanguage === 'en') return en || base || ru;
        if (selectedLanguage === 'ru') return ru || base || en;
        return base || en || ru;
    };

    useEffect(() => {
        fetchCategoriesAndTags();
    }, []);

    // Reload categories and tags when language changes (to refresh counts etc.)
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

    // Note: Removed scroll restoration to prevent page jumping when filters change

    const fetchCategoriesAndTags = async () => {
        try {
            setLoading(true);

            // Fetch categories without language parameter
            const categoriesResponse = await fetch(`http://localhost:5098/api/equipment/categories`);
            const categoriesData = await categoriesResponse.json();

            // Fetch tags without language parameter
            const tagsResponse = await fetch(`http://localhost:5098/api/equipment/tags`);
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
            const newSelection = prev.includes(categoryId) ? [] : [categoryId];
            return newSelection;
        });
    };

    const handleTagToggle = (tagId) => {
        setSelectedTags(prev => {
            const newSelection = prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId];
            return newSelection;
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        console.log('Search input changed to:', value); // Debug log
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedTags([]);
        setSearchTerm('');
    };

    // Notify parent when any filter input changes
    useEffect(() => {
        if (!onFilterChange) return;

        const selectedCategoryNames = categories
            .filter(c => selectedCategories.includes(c.id))
            .map(c => c.name);
        const selectedTagNames = tags
            .filter(t => selectedTags.includes(t.id))
            .map(t => t.name);

        onFilterChange({
            categories: selectedCategories,
            categoryNames: selectedCategoryNames,
            tags: selectedTags,
            tagNames: selectedTagNames,
            search: searchTerm
        });
    }, [selectedCategories, selectedTags, searchTerm, categories, tags]);

    if (loading) {
        return (
            <div className="filters-container-new">
                <LoadingSpinner label={t('loading')} />
            </div>
        );
    }

    return (
        <div className="filters-simple">
            {/* Header removed to avoid overlaying text behind page header */}

            {/* Search */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>

            {/* Categories and Tags Side by Side */}
            <div className="filters-row">
                {/* Left Side - Categories */}
                <div className="filter-column">
                    <h4 className="filter-title">{t('categories')}</h4>
                    <div className="filter-list">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className={`filter-item ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                                onClick={() => handleCategoryToggle(category.id)}
                            >
                                {pickName(category)} ({category.equipmentCount || 0})
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Tags */}
                <div className="filter-column">
                    <h4 className="filter-title">{t('tags')}</h4>
                    <div className="filter-list">
                        {tags.map((tag) => (
                            <div
                                key={tag.id}
                                className={`filter-item ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                                onClick={() => handleTagToggle(tag.id)}
                            >
                                {pickName(tag)} ({tag.equipmentCount || 0})
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Clear Button */}
            {(selectedCategories.length > 0 || selectedTags.length > 0 || searchTerm) && (
                <div className="clear-section">
                    <button className="clear-btn" onClick={clearAllFilters}>
                        {t('clearAll')}
                    </button>
                </div>
            )}
        </div>
    );
}
