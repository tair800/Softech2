import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminAbout from './AdminAbout';
import AdminProducts from './AdminProducts';
import AdminEquipment from './AdminEquipment';
import AdminServices from './AdminServices';
import AdminBlog from './AdminBlog';
import AdminCategoriesTags from './AdminCategoriesTags';
import AdminSliders from './AdminSliders';
import UserProfile from './UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import './AdminPanel.css';

function AdminPanel() {
    const location = useLocation();

    useEffect(() => {
        // Add class to body to override conflicting CSS
        document.body.classList.add('admin-panel-body');

        // Cleanup when component unmounts
        return () => {
            document.body.classList.remove('admin-panel-body');
        };
    }, []);

    useEffect(() => {
        // Component logic here
    }, [location.pathname]);

    return (
        <ProtectedRoute>
            <div className="admin-panel-container" style={{ display: 'flex' }}>
                <div style={{ flex: '0 0 280px' }}>
                    <AdminSidebar />
                </div>
                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/about" element={<AdminAbout />} />
                        <Route path="/products" element={<AdminProducts />} />
                        <Route path="/equipment" element={<AdminEquipment />} />
                        <Route path="/services" element={<AdminServices />} />
                        <Route path="/blog" element={<AdminBlog />} />
                        <Route path="/sliders" element={<AdminSliders />} />
                        <Route path="/categories-tags" element={<AdminCategoriesTags />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/settings" element={<div>Settings Page</div>} />
                        <Route path="/test" element={<div />} />
                    </Routes>
                </div>
            </div>
        </ProtectedRoute>
    );
}

export default AdminPanel; 