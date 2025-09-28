import React, { useEffect, useState } from 'react';
import './AdminBlog.css';
import './AdminAbout.css';
import Swal from 'sweetalert2';

const API = 'http://localhost:5098/api';

export default function AdminBlog() {
    const [blogs, setBlogs] = useState([]);
    const [originalById, setOriginalById] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [newBlog, setNewBlog] = useState({
        title1: '', desc1: '', title1En: '', title1Ru: '', desc1En: '', desc1Ru: '',
        title2: '', desc2: '', title2En: '', title2Ru: '', desc2En: '', desc2Ru: '',
        features: '',
        mainImageUrl: '',
        detailImg1Url: '',
        detailImg2Url: '',
        detailImg3Url: '',
        detailImg4Url: ''
    });
    const [newMainFile, setNewMainFile] = useState(null);
    const [newMainPreview, setNewMainPreview] = useState('');
    const [newDetailFiles, setNewDetailFiles] = useState({ 1: null, 2: null, 3: null, 4: null });
    const [newDetailPreviews, setNewDetailPreviews] = useState({ 1: '', 2: '', 3: '', 4: '' });

    // Dynamic sections state
    const [blogSections, setBlogSections] = useState({}); // blogId -> sections array
    const [showSectionsModal, setShowSectionsModal] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);

    const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/uploads/')) return `http://localhost:5098${url}`;
        return url;
    };

    // Feature helpers (same UX as AdminEquipment)
    const parseFeatures = (features) => {
        if (!features) return [];
        try {
            const arr = JSON.parse(features);
            if (!Array.isArray(arr)) return [];
            return arr.map((f, idx) => ({
                id: f.id ?? `${idx}_${Math.random().toString(36).slice(2)}`,
                feature: f.feature ?? '',
                featureEn: f.featureEn ?? '',
                featureRu: f.featureRu ?? '',
                orderIndex: f.orderIndex ?? idx
            }));
        } catch { return []; }
    };

    const serializeFeatures = (arr) => {
        const clean = (arr || []).map((f, idx) => ({
            id: f.id || `${idx}_${Math.random().toString(36).slice(2)}`,
            feature: f.feature || '',
            featureEn: f.featureEn || '',
            featureRu: f.featureRu || '',
            orderIndex: idx
        }));
        return JSON.stringify(clean);
    };

    const autoReorder = (items) => {
        if (!items || items.length === 0) return [];
        return items.map((item, index) => ({ ...item, orderIndex: index }));
    };

    const reorderBlogFeatures = (blogId, fromIndex, toIndex) => {
        setBlogs(prev => prev.map(b => {
            if (b.id !== blogId) return b;
            const items = b._features || [];
            if (!items.length) return b;
            const copy = [...items];
            const [moved] = copy.splice(fromIndex, 1);
            copy.splice(toIndex, 0, moved);
            const next = autoReorder(copy);
            return { ...b, _features: next, features: serializeFeatures(next) };
        }));
    };

    const addBlogFeature = (blogId) => {
        setBlogs(prev => prev.map(b => {
            if (b.id !== blogId) return b;
            const items = b._features || [];
            // Limit to 3 features; prevent adding when there are empty rows
            if (items.some(it => !it.feature || !it.feature.trim())) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Diqqət!',
                    text: 'Boş sətir var, əvvəlcə doldurun və ya silin.',
                    showConfirmButton: false,
                    timer: 1500
                });
                return b;
            }
            if (items.length >= 3) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Limit!',
                    text: 'Maksimum 3 xüsusiyyət əlavə edə bilərsiniz.',
                    showConfirmButton: false,
                    timer: 1500
                });
                return b;
            }
            const next = autoReorder([...(items || []), { id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, feature: '', featureEn: '', featureRu: '', orderIndex: 0 }]);
            return { ...b, _features: next, features: serializeFeatures(next) };
        }));
    };

    const updateBlogFeature = (blogId, featureIndex, field, value) => {
        setBlogs(prev => prev.map(b => {
            if (b.id !== blogId) return b;
            const items = b._features || [];
            const updated = items.map((f, idx) => idx === featureIndex ? { ...f, [field]: value } : f);
            return { ...b, _features: updated, features: serializeFeatures(updated) };
        }));
    };

    const removeBlogFeature = (blogId, featureIndex) => {
        setBlogs(prev => prev.map(b => {
            if (b.id !== blogId) return b;
            const items = b._features || [];
            const updated = autoReorder(items.filter((_, idx) => idx !== featureIndex));
            return { ...b, _features: updated, features: serializeFeatures(updated) };
        }));
    };

    const loadBlogs = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/blogs`);
            if (!res.ok) throw new Error('Failed to load blogs');
            const data = await res.json();
            // Attach parsed features array for UI editing
            const normalized = data.map(b => ({ ...b, _features: parseFeatures(b.features) }));
            setBlogs(normalized);
            const map = {}; data.forEach(b => map[b.id] = { ...b });
            setOriginalById(map);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadBlogs(); }, []);

    const hasChanges = (b) => {
        const o = originalById[b.id];
        if (!o) return false;
        return (
            (b.title1 || '') !== (o.title1 || '') ||
            (b.desc1 || '') !== (o.desc1 || '') ||
            (b.title1En || '') !== (o.title1En || '') ||
            (b.title1Ru || '') !== (o.title1Ru || '') ||
            (b.desc1En || '') !== (o.desc1En || '') ||
            (b.desc1Ru || '') !== (o.desc1Ru || '') ||
            (b.title2 || '') !== (o.title2 || '') ||
            (b.desc2 || '') !== (o.desc2 || '') ||
            (b.title2En || '') !== (o.title2En || '') ||
            (b.title2Ru || '') !== (o.title2Ru || '') ||
            (b.desc2En || '') !== (o.desc2En || '') ||
            (b.desc2Ru || '') !== (o.desc2Ru || '') ||
            (serializeFeatures(b._features || []) || '') !== (o.features || '') ||
            (b.mainImageUrl || '') !== (o.mainImageUrl || '') ||
            (b.detailImg1Url || '') !== (o.detailImg1Url || '') ||
            (b.detailImg2Url || '') !== (o.detailImg2Url || '') ||
            (b.detailImg3Url || '') !== (o.detailImg3Url || '') ||
            (b.detailImg4Url || '') !== (o.detailImg4Url || '')
        );
    };

    const saveBlog = async (id) => {
        const b = blogs.find(x => x.id === id);
        if (!b) return;

        if (!b.title1 || !b.title1.trim()) {
            Swal.fire({ icon: 'error', title: 'Xəta!', text: 'Title1 məcburidir', showConfirmButton: false, timer: 1500 });
            return;
        }

        // Features validation: max 3 and no empty items
        const feat = b._features || [];
        if (feat.length > 3) {
            Swal.fire({ icon: 'warning', title: 'Limit!', text: 'Maksimum 3 xüsusiyyət saxlana bilər.', showConfirmButton: false, timer: 1500 });
            return;
        }
        if (feat.some(f => !f.feature || !f.feature.trim())) {
            Swal.fire({ icon: 'warning', title: 'Diqqət!', text: 'Boş xüsusiyyət sətirləri var. Zəhmət olmasa doldurun və ya silin!', showConfirmButton: false, timer: 1500 });
            return;
        }

        try {
            const res = await fetch(`${API}/blogs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title1: b.title1 || '', desc1: b.desc1 || '',
                    title1En: b.title1En || '', title1Ru: b.title1Ru || '', desc1En: b.desc1En || '', desc1Ru: b.desc1Ru || '',
                    title2: b.title2 || '', desc2: b.desc2 || '',
                    title2En: b.title2En || '', title2Ru: b.title2Ru || '', desc2En: b.desc2En || '', desc2Ru: b.desc2Ru || '',
                    features: serializeFeatures(b._features || []),
                    mainImageUrl: b.mainImageUrl || '',
                    detailImg1Url: b.detailImg1Url || '',
                    detailImg2Url: b.detailImg2Url || '',
                    detailImg3Url: b.detailImg3Url || '',
                    detailImg4Url: b.detailImg4Url || ''
                })
            });
            if (!res.ok) throw new Error('Save failed');
            const saved = await res.json();
            setOriginalById(prev => ({ ...prev, [id]: { ...saved } }));
            Swal.fire({ icon: 'success', title: 'Uğurlu!', text: 'Blog yadda saxlanıldı', showConfirmButton: false, timer: 1200 });
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Xəta!', text: e.message, showConfirmButton: false, timer: 1800 });
        }
    };

    const undoBlog = (id) => {
        const o = originalById[id];
        if (!o) return;
        setBlogs(prev => prev.map(x => x.id === id ? { ...o } : x));
    };

    const deleteBlog = async (id) => {
        const result = await Swal.fire({ title: 'Əminsiniz?', text: 'Blog silinsin?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Bəli, sil' });
        if (!result.isConfirmed) return;
        try {
            const res = await fetch(`${API}/blogs/${id}`, { method: 'DELETE' });
            if (res.status !== 204) throw new Error('Delete failed');
            await loadBlogs();
            Swal.fire('Silindi', 'Blog silindi', 'success');
        } catch (e) { Swal.fire('Xəta!', e.message, 'error'); }
    };

    const openCreate = () => setShowModal(true);
    const closeCreate = () => {
        setShowModal(false);
        setNewBlog({ title1: '', desc1: '', title1En: '', title1Ru: '', desc1En: '', desc1Ru: '', title2: '', desc2: '', title2En: '', title2Ru: '', desc2En: '', desc2Ru: '', features: '', mainImageUrl: '', detailImg1Url: '', detailImg2Url: '', detailImg3Url: '', detailImg4Url: '' });
        setNewMainFile(null);
        setNewMainPreview('');
        setNewDetailFiles({ 1: null, 2: null, 3: null, 4: null });
        setNewDetailPreviews({ 1: '', 2: '', 3: '', 4: '' });
    };

    // Dynamic sections management
    const loadBlogSections = async (blogId) => {
        try {
            const response = await fetch(`${API}/blogsections/blog/${blogId}`);
            if (response.ok) {
                const sections = await response.json();
                setBlogSections(prev => ({ ...prev, [blogId]: sections }));
            }
        } catch (error) {
            console.error('Error loading blog sections:', error);
        }
    };

    const openSectionsModal = (blogId) => {
        setSelectedBlogId(blogId);
        loadBlogSections(blogId);
        setShowSectionsModal(true);
    };

    const closeSectionsModal = () => {
        setShowSectionsModal(false);
        setSelectedBlogId(null);
    };

    const addSection = async () => {
        if (!selectedBlogId) return;

        const newSection = {
            blogId: selectedBlogId,
            title: 'New Section',
            titleEn: '',
            titleRu: '',
            description: '',
            descriptionEn: '',
            descriptionRu: '',
            orderIndex: (blogSections[selectedBlogId] || []).length
        };

        try {
            const response = await fetch(`${API}/blogsections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSection)
            });

            if (response.ok) {
                await loadBlogSections(selectedBlogId);
            }
        } catch (error) {
            console.error('Error adding section:', error);
        }
    };

    const updateSection = async (sectionId, updatedSection) => {
        try {
            const response = await fetch(`${API}/blogsections/${sectionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSection)
            });

            if (response.ok) {
                await loadBlogSections(selectedBlogId);
            }
        } catch (error) {
            console.error('Error updating section:', error);
        }
    };

    const deleteSection = async (sectionId) => {
        try {
            const response = await fetch(`${API}/blogsections/${sectionId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await loadBlogSections(selectedBlogId);
            }
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    const createBlog = async () => {
        if (!newBlog.title1 || !newBlog.title1.trim()) { Swal.fire('Xəta!', 'Title1 məcburidir', 'error'); return; }
        try {
            const res = await fetch(`${API}/blogs`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                    title1: newBlog.title1 || '', desc1: newBlog.desc1 || '',
                    title1En: newBlog.title1En || '', title1Ru: newBlog.title1Ru || '', desc1En: newBlog.desc1En || '', desc1Ru: newBlog.desc1Ru || '',
                    title2: newBlog.title2 || '', desc2: newBlog.desc2 || '',
                    title2En: newBlog.title2En || '', title2Ru: newBlog.title2Ru || '', desc2En: newBlog.desc2En || '', desc2Ru: newBlog.desc2Ru || '',
                    features: newBlog.features || '',
                    mainImageUrl: newBlog.mainImageUrl || '',
                    detailImg1Url: newBlog.detailImg1Url || '',
                    detailImg2Url: newBlog.detailImg2Url || '',
                    detailImg3Url: newBlog.detailImg3Url || '',
                    detailImg4Url: newBlog.detailImg4Url || ''
                })
            });
            if (!res.ok) throw new Error('Create failed');
            const created = await res.json();

            // If any images selected, upload them and update the blog
            let updatedPayload = {};

            if (newMainFile) {
                const form = new FormData(); form.append('file', newMainFile);
                const up = await fetch(`${API}/upload/blog/${created.id}`, { method: 'POST', body: form });
                if (up.ok) { const { url } = await up.json(); updatedPayload.mainImageUrl = url; }
            }
            for (const n of [1, 2, 3, 4]) {
                const f = newDetailFiles[n];
                if (f) {
                    const form = new FormData(); form.append('file', f);
                    const up = await fetch(`${API}/upload/blog/${created.id}`, { method: 'POST', body: form });
                    if (up.ok) {
                        const { url } = await up.json();
                        updatedPayload[`detailImg${n}Url`] = url;
                    }
                }
            }

            if (Object.keys(updatedPayload).length > 0) {
                await fetch(`${API}/blogs/${created.id}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                        title1: created.title1 || newBlog.title1 || '',
                        desc1: created.desc1 || newBlog.desc1 || '',
                        title2: created.title2 || newBlog.title2 || '',
                        desc2: created.desc2 || newBlog.desc2 || '',
                        title1En: created.title1En || newBlog.title1En || '', title1Ru: created.title1Ru || newBlog.title1Ru || '', desc1En: created.desc1En || newBlog.desc1En || '', desc1Ru: created.desc1Ru || newBlog.desc1Ru || '',
                        title2En: created.title2En || newBlog.title2En || '', title2Ru: created.title2Ru || newBlog.title2Ru || '', desc2En: created.desc2En || newBlog.desc2En || '', desc2Ru: created.desc2Ru || newBlog.desc2Ru || '',
                        features: created.features || newBlog.features || '',
                        mainImageUrl: updatedPayload.mainImageUrl || created.mainImageUrl || '',
                        detailImg1Url: updatedPayload.detailImg1Url || created.detailImg1Url || '',
                        detailImg2Url: updatedPayload.detailImg2Url || created.detailImg2Url || '',
                        detailImg3Url: updatedPayload.detailImg3Url || created.detailImg3Url || '',
                        detailImg4Url: updatedPayload.detailImg4Url || created.detailImg4Url || ''
                    })
                });
            }

            closeCreate();
            await loadBlogs();
            Swal.fire('Uğurlu!', 'Blog əlavə edildi', 'success');
        } catch (e) { Swal.fire('Xəta!', e.message, 'error'); }
    };

    const uploadImage = async (blogId, file, setter) => {
        if (!file) return;
        const form = new FormData();
        form.append('file', file);
        try {
            const res = await fetch(`${API}/upload/blog/${blogId}`, { method: 'POST', body: form });
            if (!res.ok) throw new Error('Upload failed');
            const { url } = await res.json();
            setter(url);
            Swal.fire('Uğurlu!', 'Şəkil yeniləndi', 'success');
        } catch (e) { Swal.fire('Xəta!', e.message, 'error'); }
    };

    return (
        <div className="admin-blog-container admin-about-container container-fluid">
            <div className="admin-products-header d-flex justify-content-between align-items-center mb-3 pt-3" style={{ padding: '0 15px' }}>
                <h2 className="m-0">Bloglar</h2>
                <div className="d-flex gap-3 align-items-center">
                    <button className="btn" onClick={openCreate} style={{ background: 'linear-gradient(90deg, #007bff, #00d4ff)', border: 'none', color: 'white', borderRadius: 8, padding: '8px 16px' }}>+
                        Əlavə et
                    </button>
                </div>
            </div>

            {error && <div className="text-danger">{error}</div>}
            {loading && <div>Yüklənir...</div>}

            {!loading && blogs.length === 0 && (
                <div className="admin-about-card p-4 mb-4 text-center text-white-50">
                    <div className="mb-2">Hələ ki, blog tapılmadı</div>
                    <button className="btn btn-primary" onClick={openCreate}>Yeni Blog Əlavə Et</button>
                </div>
            )}

            {blogs.map((b) => (
                <div key={b.id} className="admin-about-card p-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="slide-indicator">Blog #{String(b.id).padStart(2, '0')}</div>
                        <div className="top-actions d-flex gap-2">
                            <button className="btn btn-outline-danger btn-sm" onClick={() => deleteBlog(b.id)} title="Sil">
                                <img src="/assets/admin-trash.png" alt="Delete" style={{ width: 16, height: 16 }} />
                            </button>
                        </div>
                    </div>

                    <div className="row g-3 align-items-start">
                        <div className="col-12 col-lg-8 d-flex flex-column gap-3">
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">ID</label>
                                <div className="col-sm-9"><div className="form-control-plaintext">{String(b.id).padStart(2, '0')}</div></div>
                            </div>

                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Title 1 (AZ)</label>
                                <div className="col-sm-9"><input className="form-control" value={b.title1 || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, title1: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Title 1 (EN)</label>
                                <div className="col-sm-9"><input className="form-control" value={b.title1En || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, title1En: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Title 1 (RU)</label>
                                <div className="col-sm-9"><input className="form-control" value={b.title1Ru || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, title1Ru: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Desc 1 (AZ)</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={4} value={b.desc1 || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, desc1: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Desc 1 (EN)</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={4} value={b.desc1En || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, desc1En: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Desc 1 (RU)</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={4} value={b.desc1Ru || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, desc1Ru: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Title 2 (AZ)</label>
                                <div className="col-sm-9"><input className="form-control" value={b.title2 || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, title2: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Title 2 (EN)</label>
                                <div className="col-sm-9"><input className="form-control" value={b.title2En || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, title2En: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Title 2 (RU)</label>
                                <div className="col-sm-9"><input className="form-control" value={b.title2Ru || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, title2Ru: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Desc 2 (AZ)</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={3} value={b.desc2 || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, desc2: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Desc 2 (EN)</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={3} value={b.desc2En || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, desc2En: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Desc 2 (RU)</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={3} value={b.desc2Ru || ''} onChange={(e) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, desc2Ru: e.target.value } : x))} /></div>
                            </div>

                            {/* Features section (same UX as equipment) */}
                            <div className="form-group row g-3 align-items-start features-section">
                                <label className="col-sm-3 col-form-label">Features</label>
                                <div className="col-sm-9">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span>Blog Features</span>
                                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addBlogFeature(b.id)} disabled={(b._features || []).length >= 4}>+ Add Feature</button>
                                    </div>
                                    <div className="alert alert-info alert-sm mb-3" style={{ fontSize: '12px', padding: '8px 12px' }}>
                                        <strong>💡 Avtomatik Sıralama:</strong> Xüsusiyyətlər avtomatik olaraq ardıcıl nömrələnir. Yenidən sıralamaq üçün ↑↓ istifadə edin.
                                    </div>
                                    {(b._features || []).map((f, featureIndex) => (
                                        <div key={f.id || featureIndex} className="d-flex flex-column gap-2 mb-3 feature-item w-100">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge bg-primary" style={{ minWidth: '30px', textAlign: 'center' }}>#{f.orderIndex + 1}</span>
                                                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => reorderBlogFeatures(b.id, featureIndex, Math.max(0, featureIndex - 1))} disabled={featureIndex === 0} title="Move Up">↑</button>
                                                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => reorderBlogFeatures(b.id, featureIndex, Math.min((b._features || []).length - 1, featureIndex + 1))} disabled={featureIndex === (b._features || []).length - 1} title="Move Down">↓</button>
                                            </div>
                                            <div className="d-flex flex-column gap-2">
                                                <input className="form-control" placeholder="Feature (AZ)" value={f.feature || ''} onChange={(ev) => updateBlogFeature(b.id, featureIndex, 'feature', ev.target.value)} />
                                                <input className="form-control" placeholder="Feature (EN)" value={f.featureEn || ''} onChange={(ev) => updateBlogFeature(b.id, featureIndex, 'featureEn', ev.target.value)} />
                                                <input className="form-control" placeholder="Feature (RU)" value={f.featureRu || ''} onChange={(ev) => updateBlogFeature(b.id, featureIndex, 'featureRu', ev.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="image-upload-container d-flex flex-column gap-3">
                                {/* Main Image */}
                                <div>
                                    <h6 className="text-white mb-2">Əsas Şəkil</h6>
                                    <div className="image-placeholder position-relative">
                                        {b.mainImageUrl && <img src={resolveUrl(b.mainImageUrl)} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, mainImageUrl: '' } : x))}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById(`blog-main-image-${b.id}`)?.click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <input id={`blog-main-image-${b.id}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                        const f = e.target.files?.[0];
                                        await uploadImage(b.id, f, (url) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, mainImageUrl: url } : x)));
                                        e.target.value = '';
                                    }} />
                                </div>

                                {/* Detail Images 1-4 */}
                                {[1, 2, 3, 4].map((n) => (
                                    <div key={n}>
                                        <h6 className="text-white mb-2">Detail Şəkil {n}</h6>
                                        <div className="image-placeholder position-relative" style={{ minHeight: 120 }}>
                                            {b[`detailImg${n}Url`] && <img src={resolveUrl(b[`detailImg${n}Url`])} alt={`Detail ${n}`} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />}
                                            <div className="image-actions position-absolute">
                                                <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, [`detailImg${n}Url`]: '' } : x))}>
                                                    <img src="/assets/admin-trash.png" alt="Delete" />
                                                </button>
                                                <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById(`blog-detail${n}-image-${b.id}`)?.click()}>
                                                    <img src="/assets/admin-refresh.png" alt="Browse" />
                                                </button>
                                            </div>
                                        </div>
                                        <input id={`blog-detail${n}-image-${b.id}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                            const f = e.target.files?.[0];
                                            await uploadImage(b.id, f, (url) => setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, [`detailImg${n}Url`]: url } : x)));
                                            e.target.value = '';
                                        }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" disabled={!hasChanges(b)} onClick={() => saveBlog(b.id)}>Yadda saxla</button>
                            <button className="btn btn-outline-light" disabled={!hasChanges(b)} onClick={() => undoBlog(b.id)}>Undo</button>
                            <button className="btn btn-secondary" onClick={() => openSectionsModal(b.id)}>Manage Sections</button>
                        </div>
                    </div>
                </div>
            ))}

            {showModal && (
                <div className="modal-overlay" onClick={closeCreate}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Yeni Blog</h3>
                            <button className="modal-close" onClick={closeCreate}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group mb-3">
                                <label className="form-label">Title 1 <span style={{ color: '#ff4d4f' }}>*</span></label>
                                <input className="form-control" value={newBlog.title1} onChange={(e) => setNewBlog({ ...newBlog, title1: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Desc 1</label>
                                <textarea className="form-control" rows="3" value={newBlog.desc1} onChange={(e) => setNewBlog({ ...newBlog, desc1: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Title 1 (EN)</label>
                                <input className="form-control" value={newBlog.title1En} onChange={(e) => setNewBlog({ ...newBlog, title1En: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Title 1 (RU)</label>
                                <input className="form-control" value={newBlog.title1Ru} onChange={(e) => setNewBlog({ ...newBlog, title1Ru: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Desc 1 (EN)</label>
                                <textarea className="form-control" rows="3" value={newBlog.desc1En} onChange={(e) => setNewBlog({ ...newBlog, desc1En: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Desc 1 (RU)</label>
                                <textarea className="form-control" rows="3" value={newBlog.desc1Ru} onChange={(e) => setNewBlog({ ...newBlog, desc1Ru: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Title 2</label>
                                <input className="form-control" value={newBlog.title2} onChange={(e) => setNewBlog({ ...newBlog, title2: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Title 2 (EN)</label>
                                <input className="form-control" value={newBlog.title2En} onChange={(e) => setNewBlog({ ...newBlog, title2En: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Title 2 (RU)</label>
                                <input className="form-control" value={newBlog.title2Ru} onChange={(e) => setNewBlog({ ...newBlog, title2Ru: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Desc 2</label>
                                <textarea className="form-control" rows="3" value={newBlog.desc2} onChange={(e) => setNewBlog({ ...newBlog, desc2: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Desc 2 (EN)</label>
                                <textarea className="form-control" rows="3" value={newBlog.desc2En} onChange={(e) => setNewBlog({ ...newBlog, desc2En: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Desc 2 (RU)</label>
                                <textarea className="form-control" rows="3" value={newBlog.desc2Ru} onChange={(e) => setNewBlog({ ...newBlog, desc2Ru: e.target.value })} />
                            </div>
                            {/* Create modal features section */}
                            <div className="form-group mb-3">
                                <label className="form-label">Features (JSON)</label>
                                <textarea className="form-control" rows="3" placeholder='[ { "feature": "item" } ]' value={newBlog.features} onChange={(e) => setNewBlog({ ...newBlog, features: e.target.value })} />
                                <small className="form-text text-muted">Admin equipment-style editor is available after creation on the card.</small>
                            </div>

                            {/* Image pickers */}
                            <div className="row g-3">
                                <div className="col-12 col-lg-6">
                                    <label className="form-label">Əsas Şəkil</label>
                                    <div className="image-upload-container">
                                        <div className="image-placeholder position-relative" style={{ minHeight: 160 }}>
                                            {newMainPreview ? (
                                                <img src={newMainPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />
                                            ) : (
                                                <div className="text-muted d-flex align-items-center justify-content-center" style={{ height: '100%' }}>Şəkil seçilməyib</div>
                                            )}
                                            <div className="image-actions position-absolute">
                                                <button className="action-btn delete-img" aria-label="Delete image" onClick={() => { setNewMainFile(null); setNewMainPreview(''); }}>
                                                    <img src="/assets/admin-trash.png" alt="Delete" />
                                                </button>
                                                <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById('new-blog-main-image')?.click()}>
                                                    <img src="/assets/admin-refresh.png" alt="Browse" />
                                                </button>
                                            </div>
                                        </div>
                                        <input id="new-blog-main-image" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                            const f = e.target.files?.[0] || null; setNewMainFile(f); setNewMainPreview(f ? URL.createObjectURL(f) : '');
                                        }} />
                                    </div>
                                </div>

                                {[1, 2, 3, 4].map((n) => (
                                    <div key={n} className="col-12 col-lg-6">
                                        <label className="form-label">Detail Şəkil {n}</label>
                                        <div className="image-upload-container">
                                            <div className="image-placeholder position-relative" style={{ minHeight: 120 }}>
                                                {newDetailPreviews[n] ? (
                                                    <img src={newDetailPreviews[n]} alt={`Detail ${n}`} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />
                                                ) : (
                                                    <div className="text-muted d-flex align-items-center justify-content-center" style={{ height: '100%' }}>Şəkil seçilməyib</div>
                                                )}
                                                <div className="image-actions position-absolute">
                                                    <button className="action-btn delete-img" aria-label="Delete image" onClick={() => { setNewDetailFiles(prev => ({ ...prev, [n]: null })); setNewDetailPreviews(prev => ({ ...prev, [n]: '' })); }}>
                                                        <img src="/assets/admin-trash.png" alt="Delete" />
                                                    </button>
                                                    <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById(`new-blog-detail-image-${n}`)?.click()}>
                                                        <img src="/assets/admin-refresh.png" alt="Browse" />
                                                    </button>
                                                </div>
                                            </div>
                                            <input id={`new-blog-detail-image-${n}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                                const f = e.target.files?.[0] || null; setNewDetailFiles(prev => ({ ...prev, [n]: f })); setNewDetailPreviews(prev => ({ ...prev, [n]: f ? URL.createObjectURL(f) : '' }));
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closeCreate}>Ləğv et</button>
                            <button className="btn btn-primary" onClick={createBlog}>Əlavə et</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sections Management Modal */}
            {showSectionsModal && (
                <div className="modal-overlay" onClick={closeSectionsModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', background: '#2c3e50', color: 'white' }}>
                        <div className="modal-header" style={{ background: '#34495e', borderBottom: '1px solid #4a5f7a' }}>
                            <h3 className="modal-title" style={{ color: 'white' }}>Manage Blog Sections</h3>
                            <button className="modal-close" onClick={closeSectionsModal} style={{ color: 'white' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body" style={{ background: '#2c3e50' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 style={{ color: 'white' }}>Dynamic Sections</h5>
                                <button className="btn btn-success btn-sm" onClick={addSection} style={{ border: 'none', outline: 'none' }}>
                                    + Add Section
                                </button>
                            </div>

                            {(blogSections[selectedBlogId] || []).map((section, index) => (
                                <div key={section.id} className="mb-4" style={{
                                    background: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)',
                                    border: '2px solid #4a5f7a',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                }}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 style={{ color: '#ecf0f1', margin: 0, fontWeight: '600' }}>Section #{index + 1}</h6>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => updateSection(section.id, section)}
                                                style={{ fontSize: '12px', padding: '4px 8px' }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteSection(section.id)}
                                                style={{ fontSize: '12px', padding: '4px 8px' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label" style={{ color: '#bdc3c7', fontSize: '13px', fontWeight: '500' }}>Title (AZ)</label>
                                            <input
                                                className="form-control"
                                                style={{
                                                    background: '#1a252f',
                                                    color: 'white',
                                                    border: '1px solid #5a6c7d',
                                                    borderRadius: '6px',
                                                    fontSize: '14px'
                                                }}
                                                value={section.title || ''}
                                                onChange={(e) => updateSection(section.id, { ...section, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label" style={{ color: '#bdc3c7', fontSize: '13px', fontWeight: '500' }}>Title (EN)</label>
                                            <input
                                                className="form-control"
                                                style={{
                                                    background: '#1a252f',
                                                    color: 'white',
                                                    border: '1px solid #5a6c7d',
                                                    borderRadius: '6px',
                                                    fontSize: '14px'
                                                }}
                                                value={section.titleEn || ''}
                                                onChange={(e) => updateSection(section.id, { ...section, titleEn: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label" style={{ color: '#bdc3c7', fontSize: '13px', fontWeight: '500' }}>Title (RU)</label>
                                            <input
                                                className="form-control"
                                                style={{
                                                    background: '#1a252f',
                                                    color: 'white',
                                                    border: '1px solid #5a6c7d',
                                                    borderRadius: '6px',
                                                    fontSize: '14px'
                                                }}
                                                value={section.titleRu || ''}
                                                onChange={(e) => updateSection(section.id, { ...section, titleRu: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label" style={{ color: '#bdc3c7', fontSize: '13px', fontWeight: '500' }}>Description (AZ)</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                style={{
                                                    background: '#1a252f',
                                                    color: 'white',
                                                    border: '1px solid #5a6c7d',
                                                    borderRadius: '6px',
                                                    fontSize: '14px'
                                                }}
                                                value={section.description || ''}
                                                onChange={(e) => updateSection(section.id, { ...section, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label" style={{ color: '#bdc3c7', fontSize: '13px', fontWeight: '500' }}>Description (EN)</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                style={{
                                                    background: '#1a252f',
                                                    color: 'white',
                                                    border: '1px solid #5a6c7d',
                                                    borderRadius: '6px',
                                                    fontSize: '14px'
                                                }}
                                                value={section.descriptionEn || ''}
                                                onChange={(e) => updateSection(section.id, { ...section, descriptionEn: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label" style={{ color: '#bdc3c7', fontSize: '13px', fontWeight: '500' }}>Description (RU)</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                style={{
                                                    background: '#1a252f',
                                                    color: 'white',
                                                    border: '1px solid #5a6c7d',
                                                    borderRadius: '6px',
                                                    fontSize: '14px'
                                                }}
                                                value={section.descriptionRu || ''}
                                                onChange={(e) => updateSection(section.id, { ...section, descriptionRu: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(!blogSections[selectedBlogId] || blogSections[selectedBlogId].length === 0) && (
                                <div className="text-center py-4" style={{ color: '#bdc3c7' }}>
                                    No sections yet. Click "Add Section" to create one.
                                </div>
                            )}
                        </div>
                        <div className="modal-footer" style={{ background: '#34495e', borderTop: '1px solid #4a5f7a' }}>
                            <button className="btn btn-secondary" onClick={closeSectionsModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


