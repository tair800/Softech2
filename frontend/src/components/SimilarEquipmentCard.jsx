import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SimilarEquipmentCard.css';

const SimilarEquipmentCard = ({ equipment }) => {
    const navigate = useNavigate();

    const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;

        // Map database upload paths to local assets
        if (url.includes('equipment1.png')) {
            return '/assets/equipment1.png';
        }
        if (url.includes('equipment2.png')) {
            return '/assets/equipment2.png';
        }

        // For other uploads, try the API server
        if (url.startsWith('/uploads/')) {
            return `http://localhost:5098${url}`;
        }
        if (url.startsWith('/assets/')) {
            return url;
        }
        return url;
    };

    const handleCardClick = () => {
        navigate(`/equipment/${equipment.id}`);
    };

    return (
        <div
            className="similar-equipment-card"
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
