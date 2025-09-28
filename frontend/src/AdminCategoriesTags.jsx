import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './AdminCategoriesTags.css';

export default function AdminCategoriesTags() {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Category states
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        nameEn: '',
        nameRu: '',
        description: '',
        descriptionEn: '',
        descriptionRu: '',
        icon: '',
        color: ''
    });

    // Tag states
    const [showTagModal, setShowTagModal] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [tagForm, setTagForm] = useState({
        name: '',
        nameEn: '',
        nameRu: '',
        description: '',
        descriptionEn: '',
        descriptionRu: '',
        color: ''
    });

    const API_BASE = 'http://localhost:5098/api';

    useEffect(() => {
        fetchCategoriesAndTags();
    }, []);

    const fetchCategoriesAndTags = async () => {
        try {
            setLoading(true);
            const [categoriesRes, tagsRes] = await Promise.all([
                fetch(`${API_BASE}/equipment/categories`),
                fetch(`${API_BASE}/equipment/tags`)
            ]);

            if (categoriesRes.ok && tagsRes.ok) {
                const categoriesData = await categoriesRes.json();
                const tagsData = await tagsRes.json();
                setCategories(categoriesData);
                setTags(tagsData);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Category CRUD operations
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingCategory
                ? `${API_BASE}/equipment/categories/${editingCategory.id}`
                : `${API_BASE}/equipment/categories`;

            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryForm)
            });

            if (response.ok) {
                await fetchCategoriesAndTags();
                closeCategoryModal();
                showSuccessMessage(editingCategory ? 'Kateqoriya uğurla yeniləndi!' : 'Kateqoriya uğurla yaradıldı!');
            } else {
                throw new Error('Failed to save category');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteCategory = async (id) => {
        const result = await Swal.fire({
            title: 'Əminsiniz?',
            text: "Bu kateqoriyanı silmək istədiyinizə əminsiniz?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Bəli, sil!',
            cancelButtonText: 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_BASE}/equipment/categories/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await fetchCategoriesAndTags();
                    showSuccessMessage('Kateqoriya uğurla silindi!');
                } else {
                    throw new Error('Failed to delete category');
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const openCategoryModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({
                name: category.name,
                nameEn: category.nameEn || '',
                nameRu: category.nameRu || '',
                description: category.description || '',
                descriptionEn: category.descriptionEn || '',
                descriptionRu: category.descriptionRu || '',
                icon: category.icon || '',
                color: category.color || ''
            });
        } else {
            setEditingCategory(null);
            setCategoryForm({
                name: '',
                nameEn: '',
                nameRu: '',
                description: '',
                descriptionEn: '',
                descriptionRu: '',
                icon: '',
                color: ''
            });
        }
        setShowCategoryModal(true);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setEditingCategory(null);
        setCategoryForm({
            name: '',
            nameEn: '',
            nameRu: '',
            description: '',
            descriptionEn: '',
            descriptionRu: '',
            icon: '',
            color: ''
        });
    };

    // Tag CRUD operations
    const handleTagSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingTag
                ? `${API_BASE}/equipment/tags/${editingTag.id}`
                : `${API_BASE}/equipment/tags`;

            const method = editingTag ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tagForm)
            });

            if (response.ok) {
                await fetchCategoriesAndTags();
                closeTagModal();
                showSuccessMessage(editingTag ? 'Etiket uğurla yeniləndi!' : 'Etiket uğurla yaradıldı!');
            } else {
                throw new Error('Failed to save tag');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteTag = async (id) => {
        const result = await Swal.fire({
            title: 'Əminsiniz?',
            text: "Bu etiketi silmək istədiyinizə əminsiniz?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Bəli, sil!',
            cancelButtonText: 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_BASE}/equipment/tags/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await fetchCategoriesAndTags();
                    showSuccessMessage('Etiket uğurla silindi!');
                } else {
                    throw new Error('Failed to delete tag');
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const openTagModal = (tag = null) => {
        if (tag) {
            setEditingTag(tag);
            setTagForm({
                name: tag.name,
                nameEn: tag.nameEn || '',
                nameRu: tag.nameRu || '',
                description: tag.description || '',
                descriptionEn: tag.descriptionEn || '',
                descriptionRu: tag.descriptionRu || '',
                color: tag.color || ''
            });
        } else {
            setEditingTag(null);
            setTagForm({
                name: '',
                nameEn: '',
                nameRu: '',
                description: '',
                descriptionEn: '',
                descriptionRu: '',
                color: ''
            });
        }
        setShowTagModal(true);
    };

    const closeTagModal = () => {
        setShowTagModal(false);
        setEditingTag(null);
        setTagForm({
            name: '',
            nameEn: '',
            nameRu: '',
            description: '',
            descriptionEn: '',
            descriptionRu: '',
            color: ''
        });
    };

    const showSuccessMessage = (message) => {
        Swal.fire({
            icon: 'success',
            title: message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="admin-categories-tags">
            <div className="page-header">
                <h1>Kateqoriyalar və Etiketlər İdarəetməsi</h1>
                <p>Avadanlıq kateqoriyaları və etiketlərini idarə edin</p>
            </div>

            <div className="content-grid">
                {/* Categories Section */}
                <div className="section-card">
                    <div className="section-header">
                        <h2>Kateqoriyalar</h2>
                        <button
                            className="btn-primary"
                            onClick={() => openCategoryModal()}
                        >
                            + Yeni Kateqoriya
                        </button>
                    </div>

                    <div className="items-grid">
                        {categories.map(category => (
                            <div key={category.id} className="item-card">
                                <div className="item-content">
                                    <h3>{category.name}</h3>
                                    {category.description && (
                                        <p className="description">{category.description}</p>
                                    )}
                                    <div className="item-meta">
                                        <span className="status active">Aktiv</span>
                                        <span className="count">{category.equipmentCount || 0} avadanlıq</span>
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => openCategoryModal(category)}
                                    >
                                        Düzənlə
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => deleteCategory(category.id)}
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="empty-state">
                                <p>Hələ heç bir kateqoriya yoxdur</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tags Section */}
                <div className="section-card">
                    <div className="section-header">
                        <h2>Etiketlər</h2>
                        <button
                            className="btn-primary"
                            onClick={() => openTagModal()}
                        >
                            + Yeni Etiket
                        </button>
                    </div>

                    <div className="items-grid">
                        {tags.map(tag => (
                            <div key={tag.id} className="item-card">
                                <div className="item-content">
                                    <h3>{tag.name}</h3>
                                    {tag.description && (
                                        <p className="description">{tag.description}</p>
                                    )}
                                    <div className="item-meta">
                                        <span className="status active">Aktiv</span>
                                        <span className="count">{tag.equipmentCount || 0} avadanlıq</span>
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => openTagModal(tag)}
                                    >
                                        Düzənlə
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => deleteTag(tag.id)}
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        ))}
                        {tags.length === 0 && (
                            <div className="empty-state">
                                <p>Hələ heç bir etiket yoxdur</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="modal-overlay" onClick={closeCategoryModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingCategory ? 'Kateqoriya Düzənlə' : 'Yeni Kateqoriya'}</h3>
                            <button className="modal-close" onClick={closeCategoryModal}>×</button>
                        </div>
                        <form onSubmit={handleCategorySubmit}>
                            <div className="form-group">
                                <label>Ad (Azərbaycan) *</label>
                                <input
                                    type="text"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    required
                                    placeholder="Kateqoriya adı Azərbaycan dilində"
                                />
                            </div>
                            <div className="form-group">
                                <label>Ad (English)</label>
                                <input
                                    type="text"
                                    value={categoryForm.nameEn}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
                                    placeholder="Category name in English"
                                />
                            </div>
                            <div className="form-group">
                                <label>Ad (Русский)</label>
                                <input
                                    type="text"
                                    value={categoryForm.nameRu}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, nameRu: e.target.value })}
                                    placeholder="Название категории на русском языке"
                                />
                            </div>
                            <div className="form-group">
                                <label>Təsvir (Azərbaycan)</label>
                                <textarea
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                    placeholder="Kateqoriya təsviri Azərbaycan dilində"
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Təsvir (English)</label>
                                <textarea
                                    value={categoryForm.descriptionEn}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, descriptionEn: e.target.value })}
                                    placeholder="Category description in English"
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Təsvir (Русский)</label>
                                <textarea
                                    value={categoryForm.descriptionRu}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, descriptionRu: e.target.value })}
                                    placeholder="Описание категории на русском языке"
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Icon</label>
                                <input
                                    type="text"
                                    value={categoryForm.icon}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                                    placeholder="Kateqoriya iconunu daxil edin (məsələn: fa-cog)"
                                />
                            </div>
                            <div className="form-group">
                                <label>Rəng</label>
                                <input
                                    type="color"
                                    value={categoryForm.color}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                                    placeholder="Kateqoriya rəngini daxil edin"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeCategoryModal}>
                                    Ləğv et
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingCategory ? 'Yadda saxla' : 'Yarat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tag Modal */}
            {showTagModal && (
                <div className="modal-overlay" onClick={closeTagModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingTag ? 'Etiket Düzənlə' : 'Yeni Etiket'}</h3>
                            <button className="modal-close" onClick={closeTagModal}>×</button>
                        </div>
                        <form onSubmit={handleTagSubmit}>
                            <div className="form-group">
                                <label>Ad (Azərbaycan) *</label>
                                <input
                                    type="text"
                                    value={tagForm.name}
                                    onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
                                    required
                                    placeholder="Etiket adı Azərbaycan dilində"
                                />
                            </div>
                            <div className="form-group">
                                <label>Ad (English)</label>
                                <input
                                    type="text"
                                    value={tagForm.nameEn}
                                    onChange={(e) => setTagForm({ ...tagForm, nameEn: e.target.value })}
                                    placeholder="Tag name in English"
                                />
                            </div>
                            <div className="form-group">
                                <label>Ad (Русский)</label>
                                <input
                                    type="text"
                                    value={tagForm.nameRu}
                                    onChange={(e) => setTagForm({ ...tagForm, nameRu: e.target.value })}
                                    placeholder="Название тега на русском языке"
                                />
                            </div>
                            <div className="form-group">
                                <label>Təsvir (Azərbaycan)</label>
                                <textarea
                                    value={tagForm.description}
                                    onChange={(e) => setTagForm({ ...tagForm, description: e.target.value })}
                                    placeholder="Etiket təsviri Azərbaycan dilində"
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Təsvir (English)</label>
                                <textarea
                                    value={tagForm.descriptionEn}
                                    onChange={(e) => setTagForm({ ...tagForm, descriptionEn: e.target.value })}
                                    placeholder="Tag description in English"
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Təsvir (Русский)</label>
                                <textarea
                                    value={tagForm.descriptionRu}
                                    onChange={(e) => setTagForm({ ...tagForm, descriptionRu: e.target.value })}
                                    placeholder="Описание тега на русском языке"
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Rəng</label>
                                <input
                                    type="color"
                                    value={tagForm.color}
                                    onChange={(e) => setTagForm({ ...tagForm, color: e.target.value })}
                                    placeholder="Etiket rəngini daxil edin"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeTagModal}>
                                    Ləğv et
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingTag ? 'Yadda saxla' : 'Yarat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
