import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token and user data on app load
        const storedToken = localStorage.getItem('adminToken');
        const storedUser = localStorage.getItem('adminUser');
        const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');

        if (storedToken && storedUser && tokenExpiresAt) {
            const expiresAt = new Date(tokenExpiresAt);
            if (expiresAt > new Date()) {
                // Token is still valid
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } else {
                // Token has expired, clear storage
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token, expiresAt) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        if (expiresAt) {
            localStorage.setItem('tokenExpiresAt', expiresAt);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('tokenExpiresAt');
    };

    const isAuthenticated = () => {
        // Check if we have both token and user, and if token hasn't expired
        if (!token || !user) {
            return false;
        }

        const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
        if (tokenExpiresAt) {
            const expiresAt = new Date(tokenExpiresAt);
            if (expiresAt <= new Date()) {
                // Token has expired, logout
                logout();
                return false;
            }
        }

        return true;
    };

    const getAuthHeaders = () => {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        getAuthHeaders
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
