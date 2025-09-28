import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimilarEquipmentCard from './components/SimilarEquipmentCard';
import './EquipmentDetail.css';
import { useLanguage } from './contexts/LanguageContext.jsx';

const API = 'http://localhost:5098/api';

function EquipmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [currentPage, setCurrentPage] = useState(0);
    const [equipment, setEquipment] = useState(null);
    const [similarEquipment, setSimilarEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [similarCurrentPage, setSimilarCurrentPage] = useState(0);

    const resolveUrl = (url) => {
        if (!url || url === 'string' || url === '') return '/assets/equipment1.png';
        if (url.startsWith('/uploads/')) return `http://localhost:5098${url}`;
        if (url.startsWith('/assets/')) return url;
        return url;
    };

    // Pick value based on language with sensible fallbacks
    const pickByLanguage = (lang, en, ru, fallback) => {
        const valueEn = (en || '').trim();
        const valueRu = (ru || '').trim();
        const valueFallback = (fallback || '').trim();
        if (lang === 'az') return valueFallback || valueEn || valueRu;
        if (lang === 'ru') return valueRu || valueEn || valueFallback;
        // default 'en'
        return valueEn || valueRu || valueFallback;
    };

    // Fetch equipment detail (data is language-agnostic; we transform at render time)
    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API}/equipment/${id}`);
                if (!res.ok) throw new Error('Failed to load equipment');
                const data = await res.json();

                setEquipment(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };
        fetchEquipment();
    }, [id]);

    // Fetch similar equipment
    useEffect(() => {
        const fetchSimilarEquipment = async () => {
            try {
                const res = await fetch(`${API}/equipment`);
                if (!res.ok) throw new Error('Failed to load similar equipment');
                const data = await res.json();

                // Filter out current equipment only
                const filtered = data.filter(item => item.id !== parseInt(id));

                // Use all available equipment (no artificial limit)
                setSimilarEquipment(filtered);
            } catch (e) {
                console.error('Error loading similar equipment:', e);
            }
        };

        if (equipment) {
            fetchSimilarEquipment();
        }
    }, [equipment, id]);

    // Handle similar equipment scroll
    const handleSimilarScroll = (event) => {
        const container = event.target;
        const scrollLeft = container.scrollLeft;
        const pageWidth = 5 * 270; // 5 cards per page * (250px + 20px gap)
        const currentPageIndex = Math.round(scrollLeft / pageWidth);
        setSimilarCurrentPage(Math.max(0, Math.min(currentPageIndex, totalSimilarPages - 1)));
    };

    // Calculate total pages for similar equipment (5 cards per page)
    const totalSimilarPages = Math.ceil(similarEquipment.length / 5);

    // Handle dot click navigation
    const handleDotClick = (pageIndex) => {
        const container = document.querySelector('.similar-equipment-cards');
        if (container) {
            const scrollPosition = pageIndex * (5 * 270); // 5 cards per page * (250px + 20px gap)
            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            setSimilarCurrentPage(pageIndex);
        }
    };



    if (loading) {
        return (
            <div className="equipment-detail-container">
                <div className="equipment-detail-center">
                    <h2>{language === 'en' ? 'Loading...' : language === 'ru' ? 'Загрузка...' : 'Yüklənir...'}</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="equipment-detail-container">
                <div className="equipment-detail-center">
                    <h2>{language === 'en' ? 'Error' : language === 'ru' ? 'Ошибка' : 'Xəta'}: {error}</h2>
                    <button
                        onClick={() => navigate('/equipment')}
                        style={{
                            background: 'linear-gradient(90deg, #007bff, #00d4ff)',
                            border: 'none',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginTop: '20px'
                        }}
                    >
                        {language === 'en' ? 'Back to Equipment' : language === 'ru' ? 'Назад к оборудованию' : 'Avadanlıqlara qayıt'}
                    </button>
                </div>
            </div>
        );
    }

    if (!equipment) {
        return (
            <div className="equipment-detail-container">
                <div className="equipment-detail-center">
                    <h2>{language === 'en' ? 'Equipment not found' : language === 'ru' ? 'Оборудование не найдено' : 'Avadanlıq tapılmadı'}</h2>
                    <button
                        onClick={() => navigate('/equipment')}
                        style={{
                            background: 'linear-gradient(90deg, #007bff, #00d4ff)',
                            border: 'none',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginTop: '20px'
                        }}
                    >
                        {language === 'en' ? 'Back to Equipment' : language === 'ru' ? 'Назад к оборудованию' : 'Avadanlıqlara qayıt'}
                    </button>
                </div>
            </div>
        );
    }

    // Ensure equipment has required fields with fallbacks
    const safeEquipment = {
        id: equipment.id || 0,
        name: equipment.name || 'Unknown Equipment',
        description: equipment.description || '',
        descriptionEn: equipment.descriptionEn || '',
        descriptionRu: equipment.descriptionRu || '',
        version: equipment.version || '',
        core: equipment.core || '',
        imageUrl: equipment.imageUrl || '',
        features: equipment.features || [],
        specifications: equipment.specifications || []
    };

    return (
        <div className="equipment-detail-container">
            <div className="equipment-detail-circle-background-1"></div>
            <div className="equipment-detail-circle-background-2"></div>
            <div className="equipment-detail-circle-background-3"></div>
            <div className="equipment-detail-circle-background-4"></div>

            <div className="equipment-detail-content">
                <div className="equipment-detail-left">
                    <h1 className="equipment-detail-title">{safeEquipment.name}</h1>
                    <p className="equipment-detail-description">
                        {pickByLanguage(language || 'az', safeEquipment.descriptionEn, safeEquipment.descriptionRu, safeEquipment.description)}
                    </p>
                    <div className="equipment-detail-features">
                        {(() => {
                            // Handle both JSON string and array formats for features
                            let features = [];
                            if (safeEquipment.features) {
                                if (typeof safeEquipment.features === 'string') {
                                    try {
                                        features = JSON.parse(safeEquipment.features);
                                    } catch (e) {
                                        console.warn('Failed to parse features JSON:', e);
                                        features = [];
                                    }
                                } else if (Array.isArray(safeEquipment.features)) {
                                    features = safeEquipment.features;
                                }
                            }

                            return features.map((featureObj, index) => {
                                const currentLang = language || 'az';
                                const text = pickByLanguage(currentLang, featureObj.featureEn, featureObj.featureRu, featureObj.feature);
                                return (
                                    <div key={index} className="equipment-feature-item">
                                        <div className="feature-checkmark">✓</div>
                                        <span className="feature-text">{text}</span>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
                <div className="equipment-detail-right">
                    <div className="equipment-image-container">
                        <img src={resolveUrl(safeEquipment.imageUrl)} alt={safeEquipment.name} className="equipment-detail-image" />
                    </div>
                </div>
            </div>

            <div className="equipment-detail-team-header">
                <div className="equipment-detail-team-title">{language === 'en' ? 'Features' : language === 'ru' ? 'Особенности' : 'Xüsusiyyətlər'}</div>
                <div className="equipment-detail-team-nav">
                    <div className="equipment-detail-team-nav-dot equipment-detail-team-nav-dot-faded"></div>
                    <div className="equipment-detail-team-nav-dot equipment-detail-team-nav-dot-gradient"></div>
                    <div className="equipment-detail-team-divider"></div>
                    <div className="equipment-detail-team-bar"></div>
                </div>
            </div>

            <div className="equipment-specifications-section">
                <div className="equipment-specifications-header">
                    <div className="equipment-model">{safeEquipment.version || safeEquipment.core || 'Model'}</div>
                    {(() => {
                        // Check if we have more than 6 specifications
                        let specifications = [];
                        if (safeEquipment.specifications && Array.isArray(safeEquipment.specifications)) {
                            specifications = safeEquipment.specifications.filter(spec => {
                                const currentLang = language || 'az';
                                const displayKey = pickByLanguage(currentLang, spec.keyEn, spec.keyRu, spec.key);
                                const displayValue = pickByLanguage(currentLang, spec.valueEn, spec.valueRu, spec.value);
                                return displayKey !== 'model' && displayValue && displayValue.trim() !== '';
                            });
                        }

                        if (specifications.length > 6) {
                            return (
                                <button className="equipment-detail-nav-button" onClick={() => setCurrentPage(currentPage === 0 ? 1 : 0)}>
                                    <span className="button-text">
                                        {currentPage === 0
                                            ? (language === 'en' ? 'More' : language === 'ru' ? 'Больше' : 'Daha çox')
                                            : (language === 'en' ? 'Less' : language === 'ru' ? 'Меньше' : 'Daha az')}
                                    </span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: currentPage === 1 ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            );
                        }
                        return null;
                    })()}
                </div>

                <div className="equipment-specifications-list">
                    {(() => {
                        // Handle specifications data - could be array or undefined
                        let specifications = [];
                        if (safeEquipment.specifications) {
                            if (Array.isArray(safeEquipment.specifications)) {
                                specifications = safeEquipment.specifications;
                            }
                        }

                        if (specifications.length === 0) {
                            return (
                                <div className="text-center text-muted py-4">
                                    {language === 'en' ? 'No specifications available' : language === 'ru' ? 'Характеристики отсутствуют' : 'Xüsusiyyətlər mövcud deyil'}
                                </div>
                            );
                        }

                        const processedSpecs = specifications
                            .map(spec => {
                                const currentLang = language || 'az';
                                const displayKey = pickByLanguage(currentLang, spec.keyEn, spec.keyRu, spec.key);
                                const displayValue = pickByLanguage(currentLang, spec.valueEn, spec.valueRu, spec.value);
                                return { ...spec, displayKey, displayValue };
                            })
                            .filter(spec => spec.displayKey !== 'model' && spec.displayValue && spec.displayValue.trim() !== '');

                        return (
                            <>
                                {/* Always show first 6 specifications */}
                                {processedSpecs.slice(0, 6).map((spec) => {
                                    const parts = spec.displayValue.split(' - ');
                                    const topValue = parts[0];
                                    const bottomValue = parts[1] || '';

                                    return (
                                        <div key={spec.id || Math.random()} className="specification-item specification-item-base">
                                            <div className="spec-label">{spec.displayKey}</div>
                                            <div className="spec-line-css"></div>
                                            <div className="spec-value">
                                                <div className="spec-value-top">{topValue}</div>
                                                {bottomValue && <div className="spec-value-bottom">{bottomValue}</div>}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Additional specifications that slide up when button is clicked */}
                                {processedSpecs.length > 6 && (
                                    <div className={`additional-specifications ${currentPage === 1 ? 'show' : 'hide'}`}>
                                        {processedSpecs.slice(6, 12).map((spec) => {
                                            const parts = spec.displayValue.split(' - ');
                                            const topValue = parts[0];
                                            const bottomValue = parts[1] || '';

                                            return (
                                                <div key={spec.id || Math.random()} className="specification-item specification-item-additional">
                                                    <div className="spec-label">{spec.displayKey}</div>
                                                    <div className="spec-line-css"></div>
                                                    <div className="spec-value">
                                                        <div className="spec-value-top">{topValue}</div>
                                                        {bottomValue && <div className="spec-value-bottom">{bottomValue}</div>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            </div>

            <div className="equipment-detail-team-header">
                <div className="equipment-detail-team-title">{language === 'en' ? 'Similar equipment' : language === 'ru' ? 'Похожее оборудование' : 'Oxşar avadanlıqlar'}</div>
                <div className="equipment-detail-team-nav">
                    <div className="equipment-detail-team-nav-dot equipment-detail-team-nav-dot-faded"></div>
                    <div className="equipment-detail-team-nav-dot equipment-detail-team-nav-dot-gradient"></div>
                    <div className="equipment-detail-team-divider"></div>
                    <div className="equipment-detail-team-bar"></div>
                </div>
            </div>

            <div className="similar-equipment-scroller">
                <div className="similar-equipment-cards" onScroll={handleSimilarScroll}>
                    {similarEquipment.map((item, index) => (
                        <SimilarEquipmentCard key={item.id} equipment={item} />
                    ))}
                </div>

                {/* Dynamic Dot Navigation */}
                {totalSimilarPages > 1 && (
                    <div className="similar-equipment-dots">
                        {Array.from({ length: totalSimilarPages }, (_, index) => (
                            <div
                                key={index}
                                className={`similar-equipment-dot ${index === similarCurrentPage ? 'similar-equipment-dot-active' : ''}`}
                                onClick={() => handleDotClick(index)}
                            ></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EquipmentDetail; 