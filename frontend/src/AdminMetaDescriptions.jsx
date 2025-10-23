import React, { useState, useEffect } from 'react';
import './AdminMetaDescriptions.css';

const API = 'http://localhost:5098/api';

function AdminMetaDescriptions() {
    const [metaDescriptions, setMetaDescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPage, setEditingPage] = useState(null);
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        openGraphTitle: '',
        openGraphDescription: '',
        twitterTitle: '',
        twitterDescription: '',
        isActive: true
    });

    const languages = [
        { key: 'az', name: 'Azərbaycan' },
        { key: 'en', name: 'English' },
        { key: 'ru', name: 'Русский' }
    ];

    const pageNames = {
        'home': 'Ana Səhifə',
        'about': 'Haqqımızda',
        'services': 'Xidmətlər',
        'equipment': 'Avadanlıqlar',
        'products': 'Məhsullar',
        'blog': 'Bloq',
        'contact': 'Əlaqə',
        'factory': 'Zavod'
    };

    useEffect(() => {
        fetchMetaDescriptions();
    }, []);

    const fetchMetaDescriptions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API}/metadescriptions`);
            if (!response.ok) throw new Error('Failed to fetch meta descriptions');
            const data = await response.json();
            setMetaDescriptions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (pageKey, language, metaData) => {
        setEditingPage(pageKey);
        setEditingLanguage(language);
        setEditForm({
            title: metaData?.title || '',
            description: metaData?.description || '',
            openGraphTitle: metaData?.openGraphTitle || '',
            openGraphDescription: metaData?.openGraphDescription || '',
            twitterTitle: metaData?.twitterTitle || '',
            twitterDescription: metaData?.twitterDescription || '',
            isActive: metaData?.isActive !== false
        });
    };

    const handleSave = async () => {
        try {
            const metaData = metaDescriptions.find(p => p.pageKey === editingPage);
            const languageData = metaData?.languages.find(l => l.language === editingLanguage);

            if (languageData?.id) {
                // Update existing
                const response = await fetch(`${API}/metadescriptions/${languageData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editForm)
                });

                if (!response.ok) throw new Error('Failed to update meta description');
            } else {
                // Create new
                const response = await fetch(`${API}/metadescriptions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pageKey: editingPage,
                        language: editingLanguage,
                        ...editForm
                    })
                });

                if (!response.ok) throw new Error('Failed to create meta description');
            }

            setEditingPage(null);
            setEditingLanguage(null);
            fetchMetaDescriptions();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setEditingPage(null);
        setEditingLanguage(null);
        setEditForm({
            title: '',
            description: '',
            openGraphTitle: '',
            openGraphDescription: '',
            twitterTitle: '',
            twitterDescription: '',
            isActive: true
        });
    };

    if (loading) {
        return (
            <div className="admin-meta-descriptions-container">
                <div className="loading">Meta təsvirləri yüklənir...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-meta-descriptions-container">
                <div className="error">Xəta: {error}</div>
            </div>
        );
    }

    return (
        <div className="admin-meta-descriptions-container">
            <div className="admin-header">
                <h1>Meta Təsvirləri İdarəetməsi</h1>
                <p>Bütün səhifələr və dillər üçün SEO meta təsvirlərini idarə edin</p>
            </div>

            <div className="meta-descriptions-grid">
                {/* Sidebar - Pages and Languages */}
                <div className="meta-page-card">
                    {metaDescriptions.map((page) => (
                        <div key={page.pageKey}>
                            <div className="page-header">
                                <h3>{page.pageName}</h3>
                                <span className="page-key">({page.pageKey})</span>
                            </div>

                            <div className="languages-grid">
                                {languages.map((lang) => {
                                    const langData = page.languages.find(l => l.language === lang.key);
                                    const hasContent = langData?.title && langData?.description;

                                    return (
                                        <div
                                            key={lang.key}
                                            className={`language-card ${hasContent ? 'complete' : 'incomplete'}`}
                                            onClick={() => handleEdit(page.pageKey, lang.key, langData)}
                                        >
                                            <div className="language-header">
                                                <h4>{lang.name}</h4>
                                                <span className="language-code">({lang.key})</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="main-content-area">
                    {editingPage && editingLanguage ? (
                        <div className="edit-form">
                            <h2>
                                Redaktə: {pageNames[editingPage]} - {languages.find(l => l.key === editingLanguage)?.name}
                            </h2>

                            <div className="form-group">
                                <label>Başlıq:</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    maxLength={200}
                                    placeholder="Səhifə başlığını daxil edin..."
                                />
                                <small>{editForm.title.length}/200</small>
                            </div>

                            <div className="form-group">
                                <label>Təsvir:</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    maxLength={500}
                                    rows={6}
                                    placeholder="Meta təsvirini daxil edin..."
                                />
                                <small>{editForm.description.length}/500</small>
                            </div>

                            <div className="form-actions">
                                <button onClick={handleSave} className="btn-save">Dəyişiklikləri Saxla</button>
                                <button onClick={handleCancel} className="btn-cancel">Ləğv Et</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#7f8c8d',
                            fontSize: '1.1rem'
                        }}>
                            <h3>Səhifə və dili seçin</h3>
                            <p>Meta təsvirlərini redaktə etmək üçün yan paneldən seçin</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminMetaDescriptions;
