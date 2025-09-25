import React, { useEffect, useState } from 'react';
import './AdminProducts.css';

const API = 'http://localhost:5098/api';

export default function AdminSliders() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState({ name: '', imageUrl: '', orderIndex: 0, isActive: true });

    const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/uploads/')) return `http://localhost:5098${url}`;
        return url;
    };

    const load = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/sliders`);
            if (!res.ok) throw new Error('Failed to load sliders');
            const data = await res.json();
            setItems(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const uploadImage = async (file, setter) => {
        if (!file) return;
        const form = new FormData();
        // UploadController.UploadImage expects parameter name 'image'
        form.append('image', file);
        try {
            const res = await fetch(`${API}/upload/image`, { method: 'POST', body: form });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            const imageUrl = data.imageUrl || data.url || '';
            if (!imageUrl) throw new Error('Invalid upload response');
            setter(imageUrl);
        } catch (e) {
            throw e;
        }
    };

    const save = async (it) => {
        const payload = {
            name: it.name || '',
            nameEn: it.nameEn || '',
            nameRu: it.nameRu || '',
            imageUrl: it.imageUrl || '',
            orderIndex: it.orderIndex ?? 0,
            isActive: !!it.isActive
        };
        const res = await fetch(`${API}/sliders/${it.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Save failed');
    };

    const remove = async (id) => {
        const res = await fetch(`${API}/sliders/${id}`, { method: 'DELETE' });
        if (res.status !== 204) throw new Error('Delete failed');
    };

    const create = async () => {
        const res = await fetch(`${API}/sliders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creating) });
        if (!res.ok) throw new Error('Create failed');
        setCreating({ name: '', imageUrl: '', orderIndex: 0, isActive: true });
        await load();
    };

    return (
        <div className="admin-products-container container-fluid">
            <div className="admin-products-header d-flex justify-content-between align-items-center mb-3 pt-3" style={{ padding: '0 15px' }}>
                <h2 className="m-0">Sliders</h2>
                <div />
            </div>

            {error && <div className="text-danger">{error}</div>}
            {loading && <div>Loading...</div>}

            {items.map((it, idx) => (
                <div key={it.id} className="admin-about-card p-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="slide-indicator">Slide {idx + 1}</div>
                        <div className="top-actions d-flex gap-2"></div>
                    </div>
                    <div className="row g-3 align-items-start">
                        <div className="col-12 col-lg-8 d-flex flex-column gap-3">
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">ID</label>
                                <div className="col-sm-9"><div className="form-control-plaintext">{String(it.id).padStart(2, '0')}</div></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Name (AZ)</label>
                                <div className="col-sm-9"><input className="form-control" value={it.name || ''} onChange={(e) => setItems(prev => prev.map(x => x.id === it.id ? { ...x, name: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Name (EN)</label>
                                <div className="col-sm-9"><input className="form-control" value={it.nameEn || ''} onChange={(e) => setItems(prev => prev.map(x => x.id === it.id ? { ...x, nameEn: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Name (RU)</label>
                                <div className="col-sm-9"><input className="form-control" value={it.nameRu || ''} onChange={(e) => setItems(prev => prev.map(x => x.id === it.id ? { ...x, nameRu: e.target.value } : x))} /></div>
                            </div>

                        </div>
                        <div className="col-12 col-lg-4">
                            <div className="image-upload-container d-flex flex-column gap-2">
                                <div className="image-placeholder position-relative" style={{ minHeight: 120 }}>
                                    {it.imageUrl && <img src={resolveUrl(it.imageUrl)} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />}
                                    <div className="image-actions position-absolute">
                                        <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setItems(prev => prev.map(x => x.id === it.id ? { ...x, imageUrl: '' } : x))}>
                                            <img src="/assets/admin-trash.png" alt="Delete" />
                                        </button>
                                        <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById(`slider-image-${it.id}`)?.click()}>
                                            <img src="/assets/admin-refresh.png" alt="Browse" />
                                        </button>
                                    </div>
                                </div>
                                <input id={`slider-image-${it.id}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                    const f = e.target.files?.[0];
                                    if (f) {
                                        try {
                                            await uploadImage(f, (url) => setItems(prev => prev.map(x => x.id === it.id ? { ...x, imageUrl: url } : x)));
                                        } catch (err) {
                                            console.error('Image upload failed:', err);
                                        }
                                    }
                                    e.target.value = '';
                                }} />
                            </div>
                            <div className="d-flex gap-2 mt-2">
                                <button className="btn btn-primary" onClick={async () => { await save({ ...it, nameEn: it.nameEn || '', nameRu: it.nameRu || '' }); await load(); }}>Yadda saxla</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}


