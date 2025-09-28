import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import './UserProfile.css';

export default function UserProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        switch (field) {
            case 'old':
                setShowOldPassword(!showOldPassword);
                break;
            case 'new':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirm':
                setShowConfirmPassword(!showConfirmPassword);
                break;
            default:
                break;
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validation
        if (!passwordData.oldPassword.trim()) {
            setError('Cari şifrə daxil edilməlidir');
            setLoading(false);
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Yeni şifrə və təsdiq şifrəsi uyğun gəlmir');
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Yeni şifrə ən azı 6 simvol olmalıdır');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5098/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword,
                    confirmPassword: passwordData.confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess('Şifrə uğurla dəyişdirildi');
                setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setError(data.message || 'Şifrə dəyişdirilə bilmədi');
            }
        } catch (err) {
            setError('Şəbəkə xətası. Yenidən cəhd edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-profile-container">
            <div className="profile-header">
                <h1>İstifadəçi Profili</h1>
                <p>Hesab məlumatlarınızı idarə edin</p>
            </div>

            <div className="profile-content">
                {/* User Information Section */}
                <div className="profile-section">
                    <h2>Şəxsi Məlumatlar</h2>
                    <div className="user-info-grid">
                        <div className="info-item">
                            <label>Ad:</label>
                            <span>{user?.firstName || 'Məlumat yoxdur'}</span>
                        </div>
                        <div className="info-item">
                            <label>Soyad:</label>
                            <span>{user?.lastName || 'Məlumat yoxdur'}</span>
                        </div>
                        <div className="info-item">
                            <label>İstifadəçi adı:</label>
                            <span>{user?.username || 'Məlumat yoxdur'}</span>
                        </div>
                        <div className="info-item">
                            <label>Email:</label>
                            <span>{user?.email || 'Məlumat yoxdur'}</span>
                        </div>
                        <div className="info-item">
                            <label>Rol:</label>
                            <span>{user?.role || 'İstifadəçi'}</span>
                        </div>
                        <div className="info-item">
                            <label>Qeydiyyat tarixi:</label>
                            <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('az-AZ') : 'Məlumat yoxdur'}</span>
                        </div>
                    </div>
                </div>

                {/* Password Change Section */}
                <div className="profile-section">
                    <h2>Şifrə Dəyişdir</h2>
                    <form onSubmit={handlePasswordUpdate} className="password-form">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="success-message">
                                {success}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="oldPassword">Cari Şifrə</label>
                            <div className="password-input-container">
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    id="oldPassword"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    placeholder="Cari şifrənizi daxil edin"
                                    className="password-input"
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => togglePasswordVisibility('old')}
                                >
                                    <img
                                        src="/assets/eye-icon.png"
                                        alt={showOldPassword ? "Hide password" : "Show password"}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">Yeni Şifrə</label>
                            <div className="password-input-container">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    placeholder="Yeni şifrə daxil edin"
                                    className="password-input"
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => togglePasswordVisibility('new')}
                                >
                                    <img
                                        src="/assets/eye-icon.png"
                                        alt={showNewPassword ? "Hide password" : "Show password"}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Şifrəni Təsdiqlə</label>
                            <div className="password-input-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    placeholder="Yeni şifrəni təkrar daxil edin"
                                    className="password-input"
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                >
                                    <img
                                        src="/assets/eye-icon.png"
                                        alt={showConfirmPassword ? "Hide password" : "Show password"}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="update-password-btn"
                            disabled={loading}
                        >
                            {loading ? 'Yenilənir...' : 'Şifrəni Yenilə'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
