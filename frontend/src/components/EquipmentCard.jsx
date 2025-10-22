import React from 'react';
import './EquipmentCard.css';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const EquipmentCard = ({ equipment, onMoreClick }) => {
    const { language } = useLanguage();
    const resolveUrl = (url) => {
        if (!url || url === 'string' || url === '') return '/assets/equipment1.png';
        if (url.startsWith('/uploads/')) return `http://localhost:5098${url}`;
        if (url.startsWith('/assets/')) return url;
        return url;
    };

    const imageUrl = resolveUrl(equipment.imageUrl);

    return (
        <div className="equipment-card">
            {/* Image Section - Upper two-thirds */}
            <div className="equipment-card-image-container">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={equipment.name}
                        className="equipment-card-image"
                        onError={(e) => {
                            e.target.src = '/assets/equipment1.png'; // Fallback image
                        }}
                    />
                ) : (
                    <div className="equipment-card-placeholder">
                        <img src="/assets/equipment1.png" alt="Equipment" />
                    </div>
                )}
            </div>

            {/* Black Background Section - Lower one-third */}
            <div className="equipment-card-black-section">
                <div className="equipment-card-info">
                    <div className="equipment-card-category">
                        {equipment.categories && equipment.categories.length > 0
                            ? equipment.categories[0].name
                            : 'Equipment'
                        }
                    </div>
                    <div className="equipment-card-name">{equipment.name}</div>
                    <div className="equipment-card-model">{equipment.version || 'N/A'}</div>
                </div>

                <button
                    className="equipment-card-more-btn"
                    onClick={() => {
                        try { localStorage.setItem('selectedLanguage', language); } catch { }
                        onMoreClick(equipment.id);
                    }}
                >
                    Daha çox
                </button>
            </div>
        </div>
    );
};

export default EquipmentCard;
