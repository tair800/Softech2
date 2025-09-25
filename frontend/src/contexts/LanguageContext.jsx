import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext({
    language: 'az',
    setLanguage: () => { },
});

export function LanguageProvider({ children }) {
    const normalizeLanguage = (lng) => {
        const map = { aze: 'az', az: 'az', eng: 'en', en: 'en', rus: 'ru', ru: 'ru' };
        return map[(lng || '').toLowerCase()] || 'az';
    };
    const [language, setLanguage] = useState(() => {
        try {
            const saved = localStorage.getItem('app_language');
            if (saved) return normalizeLanguage(saved);
            const envDefault = import.meta.env.VITE_DEFAULT_LANGUAGE || 'az';
            return normalizeLanguage(envDefault);
        } catch (e) {
            return 'az';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('app_language', language);
        } catch (e) {
            // ignore
        }
    }, [language]);

    const value = useMemo(() => ({ language, setLanguage }), [language]);
    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export default LanguageContext;


