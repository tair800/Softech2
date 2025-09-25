import React, { useEffect, useState, useRef } from 'react';
import './AdminServices.css';
import './AdminAbout.css';
import Swal from 'sweetalert2';

const API = 'http://localhost:5098/api';

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [originalById, setOriginalById] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [newService, setNewService] = useState({ name: '', nameEn: '', nameRu: '', subtitle: '', subtitleEn: '', subtitleRu: '', description: '', descriptionEn: '', descriptionRu: '', subtext: '', subtextEn: '', subtextRu: '', icon: '', detailImage: '', imageUrl: '', imageFile: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/uploads/')) return `http://localhost:5098${url}`;
        return url;
    };

    // Filter services based on search term
    const filteredServices = services.filter(service =>
        service.name?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        service.subtitle?.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(1);

    // Calculate pagination for filtered services
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    // Pagination functions
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // File input refs for browse functionality
    const imageFileRefs = useRef({});

    const loadServices = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/services`);
            if (!res.ok) throw new Error('Failed to load services');
            const data = await res.json();
            setServices(data);
            const map = {}; data.forEach(s => map[s.id] = { ...s });
            setOriginalById(map);
            setCurrentPage(1); // Reset to first page when loading new data
        } catch (e) { setError(e.message); } finally { setLoading(false); }
    };

    useEffect(() => { loadServices(); }, []);

    const handleAddService = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewService({ name: '', subtitle: '', description: '', icon: '', detailImage: '', imageUrl: '', imageFile: null });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const createService = async () => {
        // Validate required fields
        if (!newService.name?.trim() || !newService.subtitle?.trim() || !newService.description?.trim()) {
            await Swal.fire({
                icon: 'warning',
                title: 'Xəbərdarlıq',
                text: 'Zəhmət olmasa bütün məcburi sahələri doldurun',
                confirmButtonText: 'Tamam'
            });
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', newService.name);
            formData.append('nameEn', newService.nameEn);
            formData.append('nameRu', newService.nameRu);
            formData.append('subtitle', newService.subtitle);
            formData.append('subtitleEn', newService.subtitleEn);
            formData.append('subtitleRu', newService.subtitleRu);
            formData.append('description', newService.description);
            formData.append('descriptionEn', newService.descriptionEn);
            formData.append('descriptionRu', newService.descriptionRu);
            formData.append('subtext', newService.subtext || '');
            formData.append('subtextEn', newService.subtextEn || '');
            formData.append('subtextRu', newService.subtextRu || '');
            formData.append('icon', newService.icon);
            const detailImageForApi = newService.detailImage?.startsWith('http://localhost:5098')
                ? newService.detailImage.replace('http://localhost:5098', '')
                : (newService.detailImage || '');
            formData.append('detailImage', detailImageForApi);
            formData.append('imageUrl', newService.imageUrl || '');
            if (newService.imageFile) {
                formData.append('imageFile', newService.imageFile);
            }

            const res = await fetch(`${API}/services`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Create failed');

            await Swal.fire({
                icon: 'success',
                title: 'Uğurlu',
                text: 'Xidmət uğurla əlavə edildi',
                confirmButtonText: 'Tamam'
            });

            handleCloseModal();
            await loadServices();
        } catch (e) {
            await Swal.fire({
                icon: 'error',
                title: 'Xəta',
                text: e.message,
                confirmButtonText: 'Tamam'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const hasChanges = (s) => {
        const o = originalById[s.id];
        if (!o) return false;
        return (
            (s.name || '') !== (o.name || '') ||
            (s.nameEn || '') !== (o.nameEn || '') ||
            (s.nameRu || '') !== (o.nameRu || '') ||
            (s.subtitle || '') !== (o.subtitle || '') ||
            (s.subtitleEn || '') !== (o.subtitleEn || '') ||
            (s.subtitleRu || '') !== (o.subtitleRu || '') ||
            (s.description || '') !== (o.description || '') ||
            (s.descriptionEn || '') !== (o.descriptionEn || '') ||
            (s.descriptionRu || '') !== (o.descriptionRu || '') ||
            (s.subtext || '') !== (o.subtext || '') ||
            (s.subtextEn || '') !== (o.subtextEn || '') ||
            (s.subtextRu || '') !== (o.subtextRu || '') ||
            (s.icon || '') !== (o.icon || '') ||
            (s.detailImage || '') !== (o.detailImage || '') ||
            (s.imageUrl || '') !== (o.imageUrl || '') ||
            s.imageFile !== undefined
        );
    };

    const saveService = async (id) => {
        const s = services.find(x => x.id === id);
        if (!s) return;

        // Validate required fields
        if (!s.name?.trim() || !s.subtitle?.trim() || !s.description?.trim()) {
            await Swal.fire({
                icon: 'warning',
                title: 'Xəbərdarlıq',
                text: 'Zəhmət olmasa bütün məcburi sahələri doldurun',
                confirmButtonText: 'Tamam'
            });
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', s.name);
            formData.append('nameEn', s.nameEn || '');
            formData.append('nameRu', s.nameRu || '');
            formData.append('subtitle', s.subtitle || '');
            formData.append('subtitleEn', s.subtitleEn || '');
            formData.append('subtitleRu', s.subtitleRu || '');
            formData.append('description', s.description || '');
            formData.append('descriptionEn', s.descriptionEn || '');
            formData.append('descriptionRu', s.descriptionRu || '');
            formData.append('subtext', s.subtext || '');
            formData.append('subtextEn', s.subtextEn || '');
            formData.append('subtextRu', s.subtextRu || '');
            formData.append('icon', s.icon || '');
            formData.append('detailImage', s.detailImage || '');
            formData.append('imageUrl', s.imageUrl || '');
            if (s.imageFile) {
                formData.append('imageFile', s.imageFile);
            }

            const res = await fetch(`${API}/services/${id}`, {
                method: 'PUT',
                body: formData
            });

            if (!res.ok) throw new Error('Save failed');
            const saved = await res.json();
            setOriginalById(prev => ({ ...prev, [id]: { ...saved } }));

            await Swal.fire({
                icon: 'success',
                title: 'Uğurlu',
                text: 'Xidmət uğurla yeniləndi',
                confirmButtonText: 'Tamam'
            });
        } catch (e) {
            await Swal.fire({
                icon: 'error',
                title: 'Xəta',
                text: e.message,
                confirmButtonText: 'Tamam'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const undoService = (id) => {
        const o = originalById[id];
        if (!o) return;
        setServices(prev => prev.map(x => x.id === id ? { ...o } : x));
    };

    const removeService = async (id) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Xidməti sil',
            text: 'Bu xidməti silmək istədiyinizə əminsiniz?',
            showCancelButton: true,
            confirmButtonText: 'Bəli, sil',
            cancelButtonText: 'Ləğv et',
            confirmButtonColor: '#dc3545'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API}/services/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Delete failed');

                await Swal.fire({
                    icon: 'success',
                    title: 'Uğurlu',
                    text: 'Xidmət uğurla silindi',
                    confirmButtonText: 'Tamam'
                });

                await loadServices();
            } catch (e) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Xəta',
                    text: e.message,
                    confirmButtonText: 'Tamam'
                });
            }
        }
    };

    return (
        <div className="admin-services-container admin-about-container container-fluid">
            <div className="admin-services-header d-flex justify-content-between align-items-center mb-3 pt-3" style={{ padding: '0 15px' }}>
                <h2 className="m-0">Xidmətlər</h2>
                <div className="d-flex gap-3 align-items-center" style={{ minWidth: 'fit-content' }}>
                    <span role="button" aria-label="Notifications" title="Bildirişlər" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 0 0-5-5.91V4a1 1 0 1 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2Z" />
                        </svg>
                    </span>
                    <div className="dropdown">
                        <button className="btn dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ background: 'transparent', border: 'none', color: 'white' }}>
                            <img src="/assets/globe.png" alt="Language" width="20" height="20" />
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Aze</a></li>
                            <li><a className="dropdown-item" href="#">Eng</a></li>
                            <li><a className="dropdown-item" href="#">Rus</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Search and Add section */}
            <div className="d-flex justify-content-between align-items-center mb-3 ">
                <div></div>
                <div className="d-flex gap-3 align-items-center p-2">
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Axtar..."
                            style={{ paddingLeft: '40px' }}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>
                    <button className="add-btn btn d-flex align-items-center gap-2" onClick={handleAddService}>
                        <span style={{ fontSize: '16px' }}>+</span>
                        Əlavə et
                    </button>
                </div>
            </div>

            {error && <div className="text-danger">{error}</div>}
            {loading && <div>Yüklənir...</div>}
            {currentServices.map((s, idx) => (
                <div key={s.id} className="admin-about-card p-3 mb-4">
                    <div className="row g-3 align-items-start">
                        <div className="col-12 col-lg-8 d-flex flex-column gap-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="text-white m-0">Service {String(indexOfFirstItem + idx + 1).padStart(2, '0')}</h5>
                                <button className="btn btn-danger btn-sm" onClick={() => removeService(s.id)} disabled={submitting}>
                                    {submitting ? 'Silinir...' : 'Sil'}
                                </button>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Name *</label>
                                <div className="col-sm-9"><input className="form-control" value={s.name || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, name: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Name (EN)</label>
                                <div className="col-sm-9"><input className="form-control" value={s.nameEn || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, nameEn: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Name (RU)</label>
                                <div className="col-sm-9"><input className="form-control" value={s.nameRu || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, nameRu: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Subtitle *</label>
                                <div className="col-sm-9"><input className="form-control" value={s.subtitle || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, subtitle: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Subtitle (EN)</label>
                                <div className="col-sm-9"><input className="form-control" value={s.subtitleEn || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, subtitleEn: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Subtitle (RU)</label>
                                <div className="col-sm-9"><input className="form-control" value={s.subtitleRu || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, subtitleRu: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Description *</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={6} value={s.description || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, description: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Description (EN)</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={4} value={s.descriptionEn || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, descriptionEn: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Description (RU)</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={4} value={s.descriptionRu || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, descriptionRu: e.target.value } : x))} /></div>
                            </div>

                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Subtext</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={3} value={s.subtext || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, subtext: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Subtext (EN)</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={3} value={s.subtextEn || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, subtextEn: e.target.value } : x))} /></div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Subtext (RU)</label>
                                <div className="col-sm-9"><textarea className="form-control" rows={3} value={s.subtextRu || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, subtextRu: e.target.value } : x))} /></div>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary" disabled={!hasChanges(s) || submitting} onClick={() => saveService(s.id)}>
                                    {submitting ? 'Yadda saxlanır...' : 'Yadda saxla'}
                                </button>
                                <button className="btn btn-outline-light" disabled={!hasChanges(s)} onClick={() => undoService(s.id)}>Undo</button>
                            </div>
                        </div>
                        <div className="col-12 col-lg-4">
                            <div className="image-upload-container d-flex flex-column gap-2">
                                {/* Detail image uploader */}
                                <div className="image-placeholder position-relative">
                                    {s.detailImage && (
                                        <img
                                            src={resolveUrl(s.detailImage)}
                                            alt={s.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }}
                                        />
                                    )}
                                    <div className="image-actions position-absolute">
                                        <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setServices(prev => prev.map(x => x.id === s.id ? { ...x, detailImage: '', imageFile: null } : x))}>
                                            <img src="/assets/admin-trash.png" alt="Delete" />
                                        </button>
                                        <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById(`service-image-${s.id}`).click()}>
                                            <img src="/assets/admin-refresh.png" alt="Browse" />
                                        </button>
                                    </div>
                                </div>
                                <input
                                    id={`service-image-${s.id}`}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={async (ev) => {
                                        const file = ev.target.files?.[0];
                                        if (file) {
                                            try {
                                                // Upload the image to the server
                                                const formData = new FormData();
                                                formData.append('image', file);

                                                const response = await fetch(`${API}/upload/image`, {
                                                    method: 'POST',
                                                    body: formData
                                                });

                                                if (response.ok) {
                                                    const result = await response.json();
                                                    let imageUrl = result.imageUrl || `/uploads/${result.filename}`;
                                                    // Convert full URL to relative path if needed
                                                    setServices(prev => prev.map(x => x.id === s.id ? { ...x, detailImage: imageUrl, imageFile: file } : x));
                                                } else {
                                                    // Upload failed, don't set any image
                                                    console.error('Image upload failed');
                                                }
                                            } catch (error) {
                                                console.error('Error uploading service image:', error);
                                                // Upload failed, don't set any image
                                            }
                                        }
                                    }}
                                />
                                <div className="image-info">*Yüklənən şəkil aaa x bbb ölçüsündə olmalıdır. Yeniləmə düyməsi şəkil seçmək üçündür.</div>
                                {/* Icon uploader (moved under image) */}
                                <div className="mb-3">
                                    <label className="form-label">İkon</label>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="image-placeholder position-relative" style={{ width: 72, height: 72 }}>
                                            {s.icon && (
                                                <img
                                                    src={resolveUrl(s.icon)}
                                                    alt="Icon"
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }}
                                                />
                                            )}
                                            <div className="image-actions position-absolute">
                                                <button className="action-btn delete-img" aria-label="Delete icon" onClick={() => setServices(prev => prev.map(x => x.id === s.id ? { ...x, icon: '' } : x))}>
                                                    <img src="/assets/admin-trash.png" alt="Delete" />
                                                </button>
                                                <button className="action-btn refresh-img" aria-label="Browse icon" onClick={() => document.getElementById(`service-icon-${s.id}`).click()}>
                                                    <img src="/assets/admin-refresh.png" alt="Browse" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <input className="form-control" placeholder="/assets/service1.png və ya /uploads/..." value={s.icon || ''} onChange={(e) => setServices(prev => prev.map(x => x.id === s.id ? { ...x, icon: e.target.value } : x))} />
                                        </div>
                                    </div>
                                    <input
                                        id={`service-icon-${s.id}`}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={async (ev) => {
                                            const file = ev.target.files?.[0];
                                            if (file) {
                                                try {
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    const response = await fetch(`${API}/upload/service/icon`, { method: 'POST', body: formData });
                                                    if (response.ok) {
                                                        const result = await response.json();
                                                        const imageUrl = result.url ? result.url.replace('http://localhost:5098', '') : '';
                                                        setServices(prev => prev.map(x => x.id === s.id ? { ...x, icon: imageUrl } : x));
                                                    } else {
                                                        console.error('Icon upload failed');
                                                    }
                                                } catch (error) {
                                                    console.error('Error uploading service icon:', error);
                                                    // Upload failed, don't set any image
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => goToPreviousPage()} aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => goToNextPage()} aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Add Service Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Yeni Xidmət Əlavə Et</h3>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group mb-3">
                                <label className="form-label">Xidmət Adı *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Xidmət adını daxil edin"
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Xidmət Alt Başlığı *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Xidmət alt başlığını daxil edin"
                                    value={newService.subtitle}
                                    onChange={(e) => setNewService({ ...newService, subtitle: e.target.value })}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Xidmət Təsviri *</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Xidmət təsvirini daxil edin"
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">İkon</label>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="image-placeholder position-relative" style={{ width: 72, height: 72 }}>
                                        {newService.icon && <img src={resolveUrl(newService.icon)} alt="Icon" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete icon" onClick={() => setNewService({ ...newService, icon: '' })}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse icon" onClick={() => document.getElementById('modal-service-icon').click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <input className="form-control" placeholder="/assets/service1.png və ya /uploads/..." value={newService.icon} onChange={(e) => setNewService({ ...newService, icon: e.target.value })} />
                                    </div>
                                </div>
                                <input
                                    id="modal-service-icon"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={async (ev) => {
                                        const file = ev.target.files?.[0];
                                        if (file) {
                                            try {
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                const response = await fetch(`${API}/upload/service/icon`, { method: 'POST', body: formData });
                                                if (response.ok) {
                                                    const result = await response.json();
                                                    const imageUrl = result.url ? result.url.replace('http://localhost:5098', '') : '';
                                                    setNewService({ ...newService, icon: imageUrl });
                                                } else {
                                                    console.error('Icon upload failed');
                                                }
                                            } catch (error) {
                                                console.error('Error uploading service icon:', error);
                                                // Upload failed, don't set any image
                                            }
                                        }
                                    }}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Şəkil</label>
                                <div className="image-upload-container">
                                    <div className="image-placeholder position-relative">
                                        {newService.detailImage && <img src={resolveUrl(newService.detailImage)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setNewService({ ...newService, detailImage: '', imageFile: null })}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById('modal-service-image').click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <input
                                        id="modal-service-image"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={async (ev) => {
                                            const file = ev.target.files?.[0];
                                            if (file) {
                                                try {
                                                    // Upload the image to the server
                                                    const formData = new FormData();
                                                    formData.append('image', file);

                                                    const response = await fetch(`${API}/upload/image`, {
                                                        method: 'POST',
                                                        body: formData
                                                    });

                                                    if (response.ok) {
                                                        const result = await response.json();
                                                        let imageUrl = result.imageUrl || `/uploads/${result.filename}`;
                                                        // Convert full URL to relative path if needed
                                                        setNewService({ ...newService, detailImage: imageUrl, imageFile: file });
                                                    } else {
                                                        console.error('Image upload failed');
                                                    }
                                                } catch (error) {
                                                    console.error('Error uploading service image:', error);
                                                    // Upload failed, don't set any image
                                                }
                                            }
                                        }}
                                    />
                                    <div className="image-info">*Yüklənən şəkil aaa x bbb ölçüsündə olmalıdır. Yeniləmə düyməsi şəkil seçmək üçündür.</div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseModal} disabled={submitting}>
                                Ləğv et
                            </button>
                            <button className="btn btn-primary" onClick={createService} disabled={submitting}>
                                {submitting ? 'Əlavə edilir...' : 'Əlavə et'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
