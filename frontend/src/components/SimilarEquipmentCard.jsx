import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SimilarEquipmentCard.css';

// Configurable API base (align with admin)
const API = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== '')
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : 'https://softech-api.webonly.io/api';
const API_ORIGIN = API.replace(/\/api$/i, '');

const SimilarEquipmentCard = ({ equipment, isActive = false }) => {
    const navigate = useNavigate();

    const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        // For other uploads, build absolute from API origin
        if (url.startsWith('/uploads/')) {
            return `${API_ORIGIN}${url}`;
        }
        if (url.startsWith('/assets/')) {
            return url;
        }
        return url;
    };

    const handleCardClick = () => {
        navigate(`/avadanlıqlar/${equipment.slug || equipment.id}`);
    };

    return (
        <div
            className={`similar-equipment-card ${isActive ? 'active' : ''}`}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="similar-blue-border-div">
                <img src={resolveUrl(equipment.imageUrl)} alt={equipment.name} />
            </div>
            <div className="similar-version-container">
                <img src="/assets/maps-logo.png" alt="Maps Logo" className="similar-version-icon" />
                <span className="similar-version-name">{equipment.version || 'Scanner'}</span>
            </div>
            <div className="similar-equipment-name">{equipment.name}</div>
            <div className="similar-image-container">
                <img src="/assets/services-active.png" alt="Services Active" />
            </div>
        </div>
    );
};

export default SimilarEquipmentCard;
