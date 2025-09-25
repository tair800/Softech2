import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './Login.css';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, loading: authLoading } = useAuth();

    // Redirect if already authenticated (only after auth loading is complete)
    useEffect(() => {
        console.log('Login useEffect: authLoading:', authLoading, 'isAuthenticated:', isAuthenticated());
        if (!authLoading && isAuthenticated()) {
            console.log('Login: Redirecting to admin panel (already authenticated)');
            navigate('/admin-panel', { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if already authenticated
        if (isAuthenticated()) {
            console.log('Login: Already authenticated, redirecting');
            navigate('/admin-panel', { replace: true });
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5098/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                console.log('Login: Success response received:', data);
                // Use AuthContext login function to properly set authentication state
                login(data.user, data.token, data.expiresAt);

                console.log('Login: About to navigate to admin panel');
                // Add a small delay to ensure state is updated before navigation
                setTimeout(() => {
                    navigate('/admin-panel', { replace: true });
                }, 100);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking authentication
    if (authLoading) {
        return (
            <div className="login-container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    fontSize: '1.2rem',
                    color: '#ffffff'
                }}>
                    Yüklənir...
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-footer-left">
                <img src="/assets/footer-login.png" alt="Admin Footer" />
            </div>

            <div className="login-centered-div">
                <div className="login-left-side transparent">
                    <div className="login-logo-top-left">
                        <img src="/assets/logo-white.png" alt="Logo" />
                    </div>
                    <div className="login-circle-background-left"></div>
                </div>
                <div className="login-right-side black">
                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="login-error-message">
                                {error}
                            </div>
                        )}

                        <h1 className="login-title">DAXİL OLUN</h1>

                        <div className="login-input-group">
                            <input
                                type="text"
                                name="username"
                                className="login-input-field"
                                placeholder="İstifadəçi adı"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="login-input-group">
                            <div className="login-password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="login-input-field"
                                    placeholder="Şifrə"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={togglePasswordVisibility}
                                >
                                    <img
                                        src="/assets/eye-icon.png"
                                        alt={showPassword ? "Hide password" : "Show password"}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="login-checkbox-group">
                            <label className="login-checkbox-label">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                />
                                Məni xatırla
                            </label>
                        </div>

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Daxil olunur...' : 'Daxil ol'}
                        </button>


                    </form>
                </div>
            </div>
        </div>
    );
}
