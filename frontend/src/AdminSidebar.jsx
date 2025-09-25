import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import './AdminSidebar.css';
import logoWhite from '/assets/logo-white.png';
import logoIcon from '/assets/logo-icon.png';
import footerLogo from '/assets/admin-footer.png';

export default function AdminSidebar() {
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            // Call logout API
            const token = localStorage.getItem('adminToken');
            if (token) {
                await fetch('http://localhost:5098/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Always logout locally
            logout();
            navigate('/login');
        }
    };


    return (
        <div className="admin-sidebar">
            <div className="sidebar-logo">
                <img src={logoWhite} alt="Softech Logo" />
            </div>

            <nav className="sidebar-nav">
                <Link to="/admin-panel" className={`nav-item ${currentPath === '/admin-panel' ? 'active' : ''}`}>
                    <div className="nav-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                        </svg>
                    </div>
                    <span className="nav-text">İdarəetmə Paneli</span>
                </Link>

                <Link to="/admin-panel/about" className={`nav-item ${currentPath === '/admin-panel/about' ? 'active' : ''}`}>
                    <div className="nav-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                    </div>
                    <span className="nav-text">Haqqımızda</span>
                </Link>

                <Link to="/admin-panel/products" className={`nav-item ${currentPath === '/admin-panel/products' ? 'active' : ''}`}>
                    <div className="nav-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                        </svg>
                    </div>
                    <span className="nav-text">Məhsullar</span>
                </Link>

                <Link to="/admin-panel/equipment" className={`nav-item ${currentPath === '/admin-panel/equipment' ? 'active' : ''}`}>
                    <div className="nav-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z" />
                        </svg>
                    </div>
                    <span className="nav-text">Avadanlıqlar</span>
                </Link>

                <Link to="/admin-panel/services" className={`nav-item ${currentPath === '/admin-panel/services' ? 'active' : ''}`}>
                    <div className="nav-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                        </svg>
                    </div>
                    <span className="nav-text">Xidmətlər</span>
                </Link>

                <Link to="/admin-panel/blog" className={`nav-item ${currentPath === '/admin-panel/blog' ? 'active' : ''}`}>
                    <div className="nav-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 4h16v2H4zM4 8h16v10H4zM6 10h12v6H6z" />
                        </svg>
                    </div>
                    <span className="nav-text">Blog</span>
                </Link>

                <Link to="/admin-panel/sliders" className={`nav-item ${currentPath === '/admin-panel/sliders' ? 'active' : ''}`}>
                    <div className="nav-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 6h18v2H3V6zm4 5h10v2H7v-2zm-4 5h18v2H3v-2z" />
                        </svg>
                    </div>
                    <span className="nav-text">Sliders</span>
                </Link>

                <Link to="/admin-panel/categories-tags" className={`nav-item ${currentPath === '/admin-panel/categories-tags' ? 'active' : ''}`}>
                    <div className="nav-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
                        </svg>
                    </div>
                    <span className="nav-text">Kateqoriyalar & Etiketlər</span>
                </Link>

                <Link to="/admin-panel/profile" className={`nav-item ${currentPath === '/admin-panel/profile' ? 'active' : ''}`}>
                    <div className="nav-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <span className="nav-text">Profil</span>
                </Link>

                <div className="nav-item">
                    <div className="nav-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                        </svg>
                    </div>
                    <span className="nav-text">Tənzimləmələr</span>
                </div>
            </nav>

            {/* User profile and logout section */}
            <div className="sidebar-user-section">
                {user && (
                    <div className="user-info">
                        <div className="user-avatar">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3-3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                            </svg>
                        </div>
                        <div className="user-details">
                            <div className="user-name">{user.firstName} {user.lastName}</div>
                            <div className="user-role">Director</div>
                        </div>
                    </div>
                )}

                <button onClick={handleLogout} className="logout-button">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                    </svg>
                    <span>Çıxış</span>
                </button>
            </div>

            <div className="footer-logo">
                <img src={footerLogo} alt="Footer Logo" />
            </div>
        </div>
    );
}