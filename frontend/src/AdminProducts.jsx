import React, { useEffect, useState } from 'react';
import './AdminProducts.css';
import './AdminAbout.css';
import Swal from 'sweetalert2';

const API = 'http://localhost:5098/api';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [originalById, setOriginalById] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', subtext: '', icon: '', alt: '', path: '', mainImage: '', imageUrl: '', detailDescription: '', section1Title: '', section1Description: '', section1MoreText: '', section1Image: '', section2Title: '', section2Description: '', section2MoreText: '', section2Image: '', section3Title: '', section3Description: '', section3MoreText: '', section3Image: '' });
    const [newImageFile, setNewImageFile] = useState(null);
    const [newImagePreview, setNewImagePreview] = useState('');
    const [newIconFile, setNewIconFile] = useState(null);
    const [newIconPreview, setNewIconPreview] = useState('');
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(1);

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        product.subtext?.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    // Calculate pagination for filtered products
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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

    const isCreateValid = () => {
        const hasName = (newProduct.name || '').trim().length > 0;
        const hasSubtext = (newProduct.subtext || '').trim().length > 0;
        const hasDetail = (newProduct.detailDescription || '').trim().length > 0;
        const hasMainImage = !!newImageFile || ((newProduct.imageUrl || '').trim().length > 0);
        const hasIcon = !!newIconFile || ((newProduct.icon || '').trim().length > 0);
        return hasName && hasSubtext && hasDetail && hasMainImage && hasIcon;
    };

    const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/uploads/')) return `http://localhost:5098${url}`;
        return url;
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/products`);
            if (!res.ok) throw new Error('Failed to load products');
            const data = await res.json();
            const normalized = data.map(p => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }));
            setProducts(normalized);
            const map = {}; data.forEach(p => map[p.id] = { ...p });
            setOriginalById(map);
            // Reset to first page when loading products
            setCurrentPage(1);
        } catch (e) { setError(e.message); } finally { setLoading(false); }
    };

    useEffect(() => { loadProducts(); }, []);

    const handleAddProduct = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setNewProduct({ name: '', subtext: '', icon: '', alt: '', path: '', mainImage: '', imageUrl: '', detailDescription: '', section1Title: '', section1Description: '', section1MoreText: '', section1Image: '', section2Title: '', section2Description: '', section2MoreText: '', section2Image: '', section3Title: '', section3Description: '', section3MoreText: '', section3Image: '' });
        setNewImageFile(null);
        setNewImagePreview('');
        setCreating(false);
        setNewIconFile(null);
        setNewIconPreview('');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const createProduct = async () => {
        try {
            // Validate required fields individually with specific error messages
            if (!newProduct.name || !newProduct.name.trim()) {
                Swal.fire(
                    'Xəta!',
                    'Məhsul adı məcburidir',
                    'error'
                );
                return;
            }

            if (!newProduct.subtext || !newProduct.subtext.trim()) {
                Swal.fire(
                    'Xəta!',
                    'Məhsul alt mətni məcburidir',
                    'error'
                );
                return;
            }

            if (!newProduct.detailDescription || !newProduct.detailDescription.trim()) {
                Swal.fire(
                    'Xəta!',
                    'Ətraflı təsvir məcburidir',
                    'error'
                );
                return;
            }

            if (!newImageFile && !newProduct.imageUrl) {
                Swal.fire(
                    'Xəta!',
                    'Məhsul şəkli məcburidir',
                    'error'
                );
                return;
            }

            if (!newIconFile && !newProduct.icon) {
                Swal.fire(
                    'Xəta!',
                    'Məhsul ikonu məcburidir',
                    'error'
                );
                return;
            }
            setCreating(true);
            // Prepare the product data with image URLs
            let finalImageUrl = newProduct.imageUrl;
            let finalIconUrl = newProduct.icon;

            // If we have image files, upload them first to get URLs
            if (newImageFile) {
                try {
                    // Create a temporary product to get an ID for upload
                    const tempRes = await fetch(`${API}/products`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: newProduct.name,
                            subtext: newProduct.subtext,
                            imageUrl: '',
                            detailDescription: newProduct.detailDescription,
                            section1Title: newProduct.section1Title,
                            section1Description: newProduct.section1Description,
                            section1MoreText: newProduct.section1MoreText,
                            section2Title: newProduct.section2Title,
                            section2Description: newProduct.section2Description,
                            section2MoreText: newProduct.section2MoreText,
                            section3Title: newProduct.section3Title,
                            section3Description: newProduct.section3Description,
                            section3MoreText: newProduct.section3MoreText
                        })
                    });

                    if (!tempRes.ok) throw new Error('Failed to create temporary product for image upload');
                    const tempProduct = await tempRes.json();

                    // Upload main image
                    const form = new FormData();
                    form.append('file', newImageFile);
                    const up = await fetch(`${API}/upload/product/${tempProduct.id}`, { method: 'POST', body: form });
                    if (up.ok) {
                        const { url } = await up.json();
                        finalImageUrl = url;
                    } else {
                        console.error('Main image upload failed:', up.status, up.statusText);
                    }

                    // Upload icon if provided
                    if (newIconFile) {
                        const formIcon = new FormData();
                        formIcon.append('file', newIconFile);
                        const upIcon = await fetch(`${API}/upload/product/${tempProduct.id}`, { method: 'POST', body: formIcon });
                        if (upIcon.ok) {
                            const { url: iconUrl } = await upIcon.json();
                            finalIconUrl = iconUrl;
                        } else {
                            console.error('Icon upload failed:', upIcon.status, upIcon.statusText);
                        }
                    }

                    // Now update the product with the final image URLs
                    const updateRes = await fetch(`${API}/products/${tempProduct.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: newProduct.name,
                            subtext: newProduct.subtext,
                            imageUrl: finalImageUrl,
                            icon: finalIconUrl,
                            detailDescription: newProduct.detailDescription,
                            section1Title: newProduct.section1Title,
                            section1Description: newProduct.section1Description,
                            section1MoreText: newProduct.section1MoreText,
                            section2Title: newProduct.section2Title,
                            section2Description: newProduct.section2Description,
                            section2MoreText: newProduct.section2MoreText,
                            section3Title: newProduct.section3Title,
                            section3Description: newProduct.section3Description,
                            section3MoreText: newProduct.section3MoreText
                        })
                    });

                    if (updateRes.ok) {
                        const created = await updateRes.json();

                        // Add main image to images array
                        if (finalImageUrl) {
                            await fetch(`${API}/products/${tempProduct.id}/images`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ imageUrl: finalImageUrl, alt: newProduct.name || '' })
                            });
                        }

                        handleCloseModal();
                        await loadProducts();
                        Swal.fire('Uğurlu!', 'Məhsul uğurla əlavə edildi', 'success');
                        return;
                    }

                } catch (uploadError) {
                    console.error('Image upload error:', uploadError);
                    Swal.fire('Xəta!', 'Şəkil yükləmə zamanı xəta baş verdi', 'error');
                    return;
                }
            }

            // If no image files, create product normally
            const res = await fetch(`${API}/products`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                    name: newProduct.name,
                    subtext: newProduct.subtext,
                    imageUrl: finalImageUrl,
                    icon: finalIconUrl,
                    detailDescription: newProduct.detailDescription,
                    section1Title: newProduct.section1Title,
                    section1Description: newProduct.section1Description,
                    section1MoreText: newProduct.section1MoreText,
                    section2Title: newProduct.section2Title,
                    section2Description: newProduct.section2Description,
                    section2MoreText: newProduct.section2MoreText,
                    section3Title: newProduct.section3Title,
                    section3Description: newProduct.section3Description,
                    section3MoreText: newProduct.section3MoreText
                })
            });
            if (!res.ok) throw new Error('Create failed');
            const created = await res.json();

            // Upload icon first if selected
            if (newIconFile && created?.id) {
                try {
                    const formIcon = new FormData();
                    formIcon.append('file', newIconFile);
                    const upIcon = await fetch(`${API}/upload/product/${created.id}`, { method: 'POST', body: formIcon });
                    if (upIcon.ok) {
                        const { url: iconUrl } = await upIcon.json();
                        await fetch(`${API}/products/${created.id}`, {
                            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                                name: created.name || newProduct.name || '',
                                subtext: created.subtext || newProduct.subtext || '',
                                imageUrl: created.imageUrl || newProduct.imageUrl || '',
                                icon: iconUrl
                            })
                        });
                    } else {
                        console.error('Icon upload failed:', upIcon.status, upIcon.statusText);
                    }
                } catch (iconError) {
                    console.error('Icon upload error:', iconError);
                }
            }

            if (newImageFile && created?.id) {
                try {
                    const form = new FormData();
                    form.append('file', newImageFile);
                    const up = await fetch(`${API}/upload/product/${created.id}`, { method: 'POST', body: form });
                    if (up.ok) {
                        const { url } = await up.json();
                        await fetch(`${API}/products/${created.id}`, {
                            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                                name: created.name || newProduct.name || '',
                                subtext: created.subtext || newProduct.subtext || '',
                                imageUrl: url,
                                detailDescription: newProduct.detailDescription || '',
                                section1Title: newProduct.section1Title || '',
                                section1Description: newProduct.section1Description || '',
                                section1MoreText: newProduct.section1MoreText || '',
                                section2Title: newProduct.section2Title || '',
                                section2Description: newProduct.section2Description || '',
                                section2MoreText: newProduct.section2MoreText || '',
                                section3Title: newProduct.section3Title || '',
                                section3Description: newProduct.section3Description || '',
                                section3MoreText: newProduct.section3MoreText || ''
                            })
                        });
                    } else {
                        console.error('Main image upload failed:', up.status, up.statusText);
                    }
                } catch (imageError) {
                    console.error('Main image upload error:', imageError);
                }
            }

            handleCloseModal();
            await loadProducts();
            Swal.fire(
                'Uğurlu!',
                'Məhsul uğurla əlavə edildi',
                'success'
            );
        } catch (e) {
            console.error('Product creation error:', e);
            Swal.fire(
                'Xəta!',
                e.message,
                'error'
            );
        } finally {
            setCreating(false);
        }
    };

    const hasChanges = (p) => {
        const o = originalById[p.id];
        if (!o) return false;
        return (
            (p.name || '') !== (o.name || '') ||
            (p.nameEn || '') !== (o.nameEn || '') ||
            (p.nameRu || '') !== (o.nameRu || '') ||
            (p.subtext || '') !== (o.subtext || '') ||
            (p.subtextEn || '') !== (o.subtextEn || '') ||
            (p.subtextRu || '') !== (o.subtextRu || '') ||
            (p.icon || '') !== (o.icon || '') ||
            (p.alt || '') !== (o.alt || '') ||
            (p.path || '') !== (o.path || '') ||
            (p.mainImage || '') !== (o.mainImage || '') ||
            (p.imageUrl || '') !== (o.imageUrl || '') ||
            (p.detailDescription || '') !== (o.detailDescription || '') ||
            (p.detailDescriptionEn || '') !== (o.detailDescriptionEn || '') ||
            (p.detailDescriptionRu || '') !== (o.detailDescriptionRu || '') ||
            (p.section1Title || '') !== (o.section1Title || '') ||
            (p.section1TitleEn || '') !== (o.section1TitleEn || '') ||
            (p.section1TitleRu || '') !== (o.section1TitleRu || '') ||
            (p.section1Description || '') !== (o.section1Description || '') ||
            (p.section1DescriptionEn || '') !== (o.section1DescriptionEn || '') ||
            (p.section1DescriptionRu || '') !== (o.section1DescriptionRu || '') ||
            (p.section1MoreText || '') !== (o.section1MoreText || '') ||
            (p.section1MoreTextEn || '') !== (o.section1MoreTextEn || '') ||
            (p.section1MoreTextRu || '') !== (o.section1MoreTextRu || '') ||
            (p.section1Image || '') !== (o.section1Image || '') ||
            (p.section2Title || '') !== (o.section2Title || '') ||
            (p.section2TitleEn || '') !== (o.section2TitleEn || '') ||
            (p.section2TitleRu || '') !== (o.section2TitleRu || '') ||
            (p.section2Description || '') !== (o.section2Description || '') ||
            (p.section2DescriptionEn || '') !== (o.section2DescriptionEn || '') ||
            (p.section2DescriptionRu || '') !== (o.section2DescriptionRu || '') ||
            (p.section2MoreText || '') !== (o.section2MoreText || '') ||
            (p.section2MoreTextEn || '') !== (o.section2MoreTextEn || '') ||
            (p.section2MoreTextRu || '') !== (o.section2MoreTextRu || '') ||
            (p.section2Image || '') !== (o.section2Image || '') ||
            (p.section3Title || '') !== (o.section3Title || '') ||
            (p.section3TitleEn || '') !== (o.section3TitleEn || '') ||
            (p.section3TitleRu || '') !== (o.section3TitleRu || '') ||
            (p.section3Description || '') !== (o.section3Description || '') ||
            (p.section3DescriptionEn || '') !== (o.section3DescriptionEn || '') ||
            (p.section3DescriptionRu || '') !== (o.section3DescriptionRu || '') ||
            (p.section3MoreText || '') !== (o.section3MoreText || '') ||
            (p.section3MoreTextEn || '') !== (o.section3MoreTextEn || '') ||
            (p.section3MoreTextRu || '') !== (o.section3MoreTextRu || '') ||
            (p.section3Image || '') !== (o.section3Image || '')
        );
    };

    const saveProduct = async (id) => {
        const p = products.find(x => x.id === id);
        if (!p) return;

        // Validate required fields before saving
        if (!p.name || !p.name.trim()) {
            Swal.fire(
                'Xəta!',
                'Məhsul adı məcburidir',
                'error'
            );
            return;
        }

        if (!p.subtext || !p.subtext.trim()) {
            Swal.fire(
                'Xəta!',
                'Məhsul alt mətni məcburidir',
                'error'
            );
            return;
        }

        if (!p.detailDescription || !p.detailDescription.trim()) {
            Swal.fire(
                'Xəta!',
                'Ətraflı təsvir məcburidir',
                'error'
            );
            return;
        }

        if (!p.imageUrl) {
            Swal.fire(
                'Xəta!',
                'Məhsul şəkli məcburidir',
                'error'
            );
            return;
        }

        if (!p.icon) {
            Swal.fire(
                'Xəta!',
                'Məhsul ikonu məcburidir',
                'error'
            );
            return;
        }

        try {
            const res = await fetch(`${API}/products/${id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                    name: p.name || '',
                    nameEn: p.nameEn || '',
                    nameRu: p.nameRu || '',
                    subtext: p.subtext || '',
                    subtextEn: p.subtextEn || '',
                    subtextRu: p.subtextRu || '',
                    imageUrl: p.imageUrl || '',
                    icon: p.icon || '',
                    detailDescription: p.detailDescription || '',
                    detailDescriptionEn: p.detailDescriptionEn || '',
                    detailDescriptionRu: p.detailDescriptionRu || '',
                    section1Title: p.section1Title || '',
                    section1TitleEn: p.section1TitleEn || '',
                    section1TitleRu: p.section1TitleRu || '',
                    section1Description: p.section1Description || '',
                    section1DescriptionEn: p.section1DescriptionEn || '',
                    section1DescriptionRu: p.section1DescriptionRu || '',
                    section1MoreText: p.section1MoreText || '',
                    section1MoreTextEn: p.section1MoreTextEn || '',
                    section1MoreTextRu: p.section1MoreTextRu || '',
                    section1Image: p.section1Image || '',
                    section2Title: p.section2Title || '',
                    section2TitleEn: p.section2TitleEn || '',
                    section2TitleRu: p.section2TitleRu || '',
                    section2Description: p.section2Description || '',
                    section2DescriptionEn: p.section2DescriptionEn || '',
                    section2DescriptionRu: p.section2DescriptionRu || '',
                    section2MoreText: p.section2MoreText || '',
                    section2MoreTextEn: p.section2MoreTextEn || '',
                    section2MoreTextRu: p.section2MoreTextRu || '',
                    section2Image: p.section2Image || '',
                    section3Title: p.section3Title || '',
                    section3TitleEn: p.section3TitleEn || '',
                    section3TitleRu: p.section3TitleRu || '',
                    section3Description: p.section3Description || '',
                    section3DescriptionEn: p.section3DescriptionEn || '',
                    section3DescriptionRu: p.section3DescriptionRu || '',
                    section3MoreText: p.section3MoreText || '',
                    section3MoreTextEn: p.section3MoreTextEn || '',
                    section3MoreTextRu: p.section3MoreTextRu || '',
                    section3Image: p.section3Image || ''
                })
            });
            if (!res.ok) throw new Error('Save failed');
            const saved = await res.json();
            setOriginalById(prev => ({ ...prev, [id]: { ...saved } }));
            Swal.fire(
                'Uğurlu!',
                'Məhsul məlumatları uğurla yadda saxlanıldı',
                'success'
            );
        } catch (e) {
            Swal.fire(
                'Xəta!',
                e.message,
                'error'
            );
        }
    };

    const undoProduct = (id) => {
        const o = originalById[id];
        if (!o) return;
        setProducts(prev => prev.map(x => x.id === id ? { ...o } : x));
    };

    // entity delete removed from UI per request; keep API helpers minimal
    // images API
    const refreshImages = async (productId) => {
        try {
            const res = await fetch(`${API}/products/${productId}/images`);
            if (!res.ok) return;
            const imgs = await res.json();
            setProducts(prev => prev.map(x => x.id === productId ? { ...x, images: imgs } : x));
        } catch { }
    };

    const removeImage = async (productId, imageId) => {
        const result = await Swal.fire({
            title: 'Təsdiq',
            text: 'Şəkil silinsin?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Bəli, sil',
            cancelButtonText: 'Xeyr, saxla',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`${API}/products/${productId}/images/${imageId}`, { method: 'DELETE' });
            if (res.status !== 204) throw new Error('Delete image failed');
            await refreshImages(productId);
            Swal.fire(
                'Uğurlu!',
                'Şəkil uğurla silindi',
                'success'
            );
        } catch (e) {
            Swal.fire(
                'Xəta!',
                e.message,
                'error'
            );
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const result = await Swal.fire({
                title: 'Əminsiniz?',
                text: "Bu məhsulu silmək istədiyinizə əminsiniz?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Bəli, sil!',
                cancelButtonText: 'Ləğv et'
            });

            if (result.isConfirmed) {
                const res = await fetch(`${API}/products/${productId}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete product');

                await Swal.fire(
                    'Silindi!',
                    'Məhsul uğurla silindi.',
                    'success'
                );

                await loadProducts();

                // Reset to first page if current page is empty
                if (currentProducts.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            }
        } catch (e) {
            Swal.fire(
                'Xəta!',
                e.message,
                'error'
            );
        }
    };

    return (
        <div className="admin-products-container admin-about-container container-fluid">
            <div className="admin-products-header d-flex justify-content-between align-items-center mb-3 pt-3" style={{ padding: '0 15px' }}>
                <h2 className="m-0">Məhsullar</h2>
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
                            style={{ backgroundColor: '#2a2a2a', border: 'none', color: 'white', paddingLeft: '40px' }}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                            aria-hidden="true"
                        >
                            <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z" stroke="#ffffff" strokeWidth="2" />
                            <path d="M20 20l-4.35-4.35" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <button className="btn d-flex align-items-center gap-2" onClick={handleAddProduct} style={{
                        background: 'linear-gradient(90deg, #007bff, #00d4ff)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '8px',
                        padding: '8px 16px'
                    }}>
                        <span style={{ fontSize: '16px' }}>+</span>
                        Əlavə et
                    </button>
                </div>
            </div>

            {/* Products cards (modeled after equipment cards) */}
            {error && <div className="text-danger">{error}</div>}
            {loading && <div>Yüklənir...</div>}

            {currentProducts.map((p, idx) => (
                <div key={p.id} className="admin-about-card p-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="slide-indicator">Slide {indexOfFirstItem + idx + 1}</div>
                        <div className="top-actions d-flex gap-2">
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteProduct(p.id)}
                                title="Məhsulu sil"
                            >
                                <img src="/assets/admin-trash.png" alt="Delete" style={{ width: '16px', height: '16px' }} />
                            </button>
                        </div>
                    </div>

                    <div className="row g-3 align-items-start">
                        <div className="col-12 col-lg-8 d-flex flex-column gap-3">
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">ID</label>
                                <div className="col-sm-9">
                                    <div className="form-control-plaintext">{String(p.id).padStart(2, '0')}</div>
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Heading</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.name || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, name: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Heading (EN)</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.nameEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, nameEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Heading (RU)</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.nameRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, nameRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Subtext</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={5} value={p.subtext || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, subtext: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Subtext (EN)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.subtextEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, subtextEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Subtext (RU)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.subtextRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, subtextRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Ətraflı Təsvir <span style={{ color: '#ff4d4f' }}>*</span></label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.detailDescription || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, detailDescription: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Detail (EN)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.detailDescriptionEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, detailDescriptionEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Detail (RU)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.detailDescriptionRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, detailDescriptionRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Image URL</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.imageUrl || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, imageUrl: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">İkon URL <span style={{ color: '#ff4d4f' }}>*</span></label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.icon || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, icon: e.target.value } : x))} />
                                </div>
                            </div>
                            {/* Section 1 */}
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 1 Title</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.section1Title || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1Title: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 1 Title (EN)</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.section1TitleEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1TitleEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 1 Title (RU)</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.section1TitleRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1TitleRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 1 Description</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.section1Description || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1Description: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 1 Description (EN)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.section1DescriptionEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1DescriptionEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 1 Description (RU)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.section1DescriptionRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1DescriptionRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 1 More</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={3} value={p.section1MoreText || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1MoreText: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 1 More (EN)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={3} value={p.section1MoreTextEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1MoreTextEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 1 More (RU)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={3} value={p.section1MoreTextRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1MoreTextRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 1 Image</label>
                                <div className="col-sm-9">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <input className="form-control" value={p.section1Image || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1Image: e.target.value } : x))} placeholder="Section 1 image URL" />
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => document.getElementById(`section1-image-file-${p.id}`)?.click()}>
                                            Browse
                                        </button>
                                    </div>
                                    {/* Section 1 Image Preview */}
                                    <div className="image-placeholder position-relative mb-2">
                                        {p.section1Image && <img src={resolveUrl(p.section1Image)} alt="Section 1" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1Image: '' } : x))}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById(`section1-image-file-${p.id}`)?.click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <input id={`section1-image-file-${p.id}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const form = new FormData();
                                        form.append('file', file);
                                        try {
                                            const res = await fetch(`${API}/upload/product/${p.id}`, { method: 'POST', body: form });
                                            if (!res.ok) throw new Error('Yükləmə alınmadı');
                                            const { url } = await res.json();
                                            setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section1Image: url } : x));
                                            Swal.fire('Uğurlu!', 'Section 1 şəkli yeniləndi', 'success');
                                        } catch (err) {
                                            Swal.fire('Xəta!', err.message, 'error');
                                        } finally {
                                            e.target.value = '';
                                        }
                                    }} />
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 2 Title</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.section2Title || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2Title: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 2 Title (EN)</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.section2TitleEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2TitleEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 2 Title (RU)</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.section2TitleRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2TitleRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 2 Description</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.section2Description || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2Description: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 2 Description (EN)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.section2DescriptionEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2DescriptionEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 2 Description (RU)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.section2DescriptionRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2DescriptionRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 2 More</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={3} value={p.section2MoreText || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2MoreText: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 2 More (EN)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={3} value={p.section2MoreTextEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2MoreTextEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 2 More (RU)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={3} value={p.section2MoreTextRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2MoreTextRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 2 Image</label>
                                <div className="col-sm-9">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <input className="form-control" value={p.section2Image || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2Image: e.target.value } : x))} placeholder="Section 2 image URL" />
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => document.getElementById(`section2-image-file-${p.id}`)?.click()}>
                                            Browse
                                        </button>
                                    </div>
                                    {/* Section 2 Image Preview */}
                                    <div className="image-placeholder position-relative mb-2">
                                        {p.section2Image && <img src={resolveUrl(p.section2Image)} alt="Section 2" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2Image: '' } : x))}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById(`section2-image-file-${p.id}`)?.click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <input id={`section2-image-file-${p.id}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const form = new FormData();
                                        form.append('file', file);
                                        try {
                                            const res = await fetch(`${API}/upload/product/${p.id}`, { method: 'POST', body: form });
                                            if (!res.ok) throw new Error('Yükləmə alınmadı');
                                            const { url } = await res.json();
                                            setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section2Image: url } : x));
                                            Swal.fire('Uğurlu!', 'Section 2 şəkli yeniləndi', 'success');
                                        } catch (err) {
                                            Swal.fire('Xəta!', err.message, 'error');
                                        } finally {
                                            e.target.value = '';
                                        }
                                    }} />
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 3 Title</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.section3Title || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3Title: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 3 Title (EN)</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.section3TitleEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3TitleEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 3 Title (RU)</label>
                                <div className="col-sm-9">
                                    <input className="form-control" value={p.section3TitleRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3TitleRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 3 Description</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.section3Description || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3Description: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 3 Description (EN)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.section3DescriptionEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3DescriptionEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 3 Description (RU)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={4} value={p.section3DescriptionRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3DescriptionRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 3 More</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={3} value={p.section3MoreText || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3MoreText: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 3 More (EN)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={3} value={p.section3MoreTextEn || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3MoreTextEn: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 3 More (RU)</label>
                                <div className="col-sm-9">
                                    <textarea className="form-control" rows={3} value={p.section3MoreTextRu || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3MoreTextRu: e.target.value } : x))} />
                                </div>
                            </div>
                            <div className="form-group row g-3 align-items-start">
                                <label className="col-sm-3 col-form-label">Section 3 Image</label>
                                <div className="col-sm-9">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <input className="form-control" value={p.section3Image || ''} onChange={(e) => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3Image: e.target.value } : x))} placeholder="Section 3 image URL" />
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => document.getElementById(`section3-image-file-${p.id}`)?.click()}>
                                            Browse
                                        </button>
                                    </div>
                                    {/* Section 3 Image Preview */}
                                    <div className="image-placeholder position-relative mb-2">
                                        {p.section3Image && <img src={resolveUrl(p.section3Image)} alt="Section 3" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3Image: '' } : x))}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById(`section3-image-file-${p.id}`)?.click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <input id={`section3-image-file-${p.id}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const form = new FormData();
                                        form.append('file', file);
                                        try {
                                            const res = await fetch(`${API}/upload/product/${p.id}`, { method: 'POST', body: form });
                                            if (!res.ok) throw new Error('Yükləmə alınmadı');
                                            const { url } = await res.json();
                                            setProducts(prev => prev.map(x => x.id === p.id ? { ...x, section3Image: url } : x));
                                            Swal.fire('Uğurlu!', 'Section 3 şəkli yeniləndi', 'success');
                                        } catch (err) {
                                            Swal.fire('Xəta!', err.message, 'error');
                                        } finally {
                                            e.target.value = '';
                                        }
                                    }} />
                                </div>
                            </div>


                        </div>
                        <div className="col-12 col-lg-4">
                            <div className="image-upload-container d-flex flex-column gap-3">
                                {/* Main Image - Top */}
                                <div>
                                    <h6 className="text-white mb-2">Əsas Şəkil</h6>
                                    <div className="image-placeholder position-relative">
                                        {p.imageUrl && <img src={resolveUrl(p.imageUrl)} alt={p.alt || p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, imageUrl: '' } : x))}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById(`main-image-file-${p.id}`)?.click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="image-info">*Yüklənən şəkil aaa x bbb ölçüsündə olmalıdır</div>

                                    {/* Hidden file input for main image */}
                                    <input id={`main-image-file-${p.id}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const form = new FormData();
                                        form.append('file', file);
                                        try {
                                            const res = await fetch(`${API}/upload/product/${p.id}`, { method: 'POST', body: form });
                                            if (!res.ok) throw new Error('Yükləmə alınmadı');
                                            const { url } = await res.json();
                                            setProducts(prev => prev.map(x => x.id === p.id ? { ...x, imageUrl: url } : x));
                                            Swal.fire(
                                                'Uğurlu!',
                                                'Əsas şəkil uğurla yeniləndi',
                                                'success'
                                            );
                                        } catch (err) {
                                            Swal.fire(
                                                'Xəta!',
                                                err.message,
                                                'error'
                                            );
                                        } finally {
                                            e.target.value = '';
                                        }
                                    }} />
                                </div>

                                {/* Icon */}
                                <div>
                                    <h6 className="text-white mb-2">İkon</h6>
                                    <div className="image-placeholder position-relative" style={{ minHeight: 120 }}>
                                        {p.icon && <img src={resolveUrl(p.icon)} alt="Icon" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete icon" onClick={() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, icon: '' } : x))}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse icon" onClick={() => document.getElementById(`icon-file-${p.id}`)?.click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="image-info">*İkon önizləməsi</div>
                                    <input id={`icon-file-${p.id}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const form = new FormData();
                                        form.append('file', file);
                                        try {
                                            const res = await fetch(`${API}/upload/product/${p.id}`, { method: 'POST', body: form });
                                            if (!res.ok) throw new Error('Yükləmə alınmadı');
                                            const { url } = await res.json();
                                            setProducts(prev => prev.map(x => x.id === p.id ? { ...x, icon: url } : x));
                                            Swal.fire(
                                                'Uğurlu!',
                                                'İkon uğurla yeniləndi',
                                                'success'
                                            );
                                        } catch (err) {
                                            Swal.fire(
                                                'Xəta!',
                                                err.message,
                                                'error'
                                            );
                                        } finally {
                                            e.target.value = '';
                                        }
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" disabled={!hasChanges(p)} onClick={() => saveProduct(p.id)}>Yadda saxla</button>
                            <button className="btn btn-outline-light" disabled={!hasChanges(p)} onClick={() => undoProduct(p.id)}>Undo</button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">


                {/* Always show pagination, even if only one page */}
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        <li className="page-item">
                            <button className="page-link" onClick={() => goToPage(1)} disabled={currentPage === 1}>
                                İlk
                            </button>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={goToPreviousPage} disabled={currentPage === 1}>
                                Əvvəlki
                            </button>
                        </li>
                        {Array.from({ length: Math.max(1, totalPages) }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => goToPage(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className="page-item">
                            <button className="page-link" onClick={goToNextPage} disabled={currentPage === totalPages || totalPages <= 1}>
                                Sonrakı
                            </button>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages || totalPages <= 1}>
                                Son
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Add Product Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Yeni Məhsul Əlavə Et</h3>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group mb-3">
                                <label className="form-label">Məhsul Adı <span style={{ color: '#ff4d4f' }}>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Məhsul adını daxil edin"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Məhsul Təsviri (Subtext) <span style={{ color: '#ff4d4f' }}>*</span></label>
                                <textarea className="form-control" rows="3" placeholder="Qısa təsvir" value={newProduct.subtext} onChange={(e) => setNewProduct({ ...newProduct, subtext: e.target.value })} required />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Ətraflı Təsvir <span style={{ color: '#ff4d4f' }}>*</span></label>
                                <textarea className="form-control" rows="4" placeholder="Ətraflı təsvir" value={newProduct.detailDescription} onChange={(e) => setNewProduct({ ...newProduct, detailDescription: e.target.value })} required />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Section 1 Title</label>
                                <input className="form-control" value={newProduct.section1Title} onChange={(e) => setNewProduct({ ...newProduct, section1Title: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Section 1 Description</label>
                                <textarea className="form-control" rows="3" value={newProduct.section1Description} onChange={(e) => setNewProduct({ ...newProduct, section1Description: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Section 1 More</label>
                                <textarea className="form-control" rows="3" value={newProduct.section1MoreText} onChange={(e) => setNewProduct({ ...newProduct, section1MoreText: e.target.value })} />
                            </div>

                            {/* Section 1 Image */}
                            <div className="form-group mb-3">
                                <label className="form-label">Section 1 Image</label>
                                <div className="image-upload-container">
                                    <div className="image-placeholder position-relative" style={{ minHeight: 120 }}>
                                        {newProduct.section1Image ? (
                                            <img src={newProduct.section1Image} alt="Section 1 Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />
                                        ) : (
                                            <div className="text-muted d-flex align-items-center justify-content-center" style={{ height: '100%' }}>Şəkil seçilməyib</div>
                                        )}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setNewProduct({ ...newProduct, section1Image: '' })}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById('new-product-section1-image')?.click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <input id="new-product-section1-image" type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                        const f = e.target.files?.[0] || null;
                                        if (f) {
                                            setNewProduct({ ...newProduct, section1Image: URL.createObjectURL(f) });
                                        }
                                    }} />
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="form-group mb-3">
                                <label className="form-label">Section 2 Title</label>
                                <input className="form-control" value={newProduct.section2Title} onChange={(e) => setNewProduct({ ...newProduct, section2Title: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Section 2 Description</label>
                                <textarea className="form-control" rows="3" value={newProduct.section2Description} onChange={(e) => setNewProduct({ ...newProduct, section2Description: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Section 2 More</label>
                                <textarea className="form-control" rows="3" value={newProduct.section2MoreText} onChange={(e) => setNewProduct({ ...newProduct, section2MoreText: e.target.value })} />
                            </div>

                            {/* Section 2 Image */}
                            <div className="form-group mb-3">
                                <label className="form-label">Section 2 Image</label>
                                <div className="image-upload-container">
                                    <div className="image-placeholder position-relative" style={{ minHeight: 120 }}>
                                        {newProduct.section2Image ? (
                                            <img src={newProduct.section2Image} alt="Section 2 Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />
                                        ) : (
                                            <div className="text-muted d-flex align-items-center justify-content-center" style={{ height: '100%' }}>Şəkil seçilməyib</div>
                                        )}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setNewProduct({ ...newProduct, section2Image: '' })}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById('new-product-section2-image')?.click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <input id="new-product-section2-image" type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                        const f = e.target.files?.[0] || null;
                                        if (f) {
                                            setNewProduct({ ...newProduct, section2Image: URL.createObjectURL(f) });
                                        }
                                    }} />
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div className="form-group mb-3">
                                <label className="form-label">Section 3 Title</label>
                                <input className="form-control" value={newProduct.section3Title} onChange={(e) => setNewProduct({ ...newProduct, section3Title: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Section 3 Description</label>
                                <textarea className="form-control" rows="3" value={newProduct.section3Description} onChange={(e) => setNewProduct({ ...newProduct, section3Description: e.target.value })} />
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Section 3 More</label>
                                <textarea className="form-control" rows="3" value={newProduct.section3MoreText} onChange={(e) => setNewProduct({ ...newProduct, section3MoreText: e.target.value })} />
                            </div>

                            {/* Section 3 Image */}
                            <div className="form-group mb-3">
                                <label className="form-label">Section 3 Image</label>
                                <div className="image-upload-container">
                                    <div className="image-placeholder position-relative" style={{ minHeight: 120 }}>
                                        {newProduct.section3Image ? (
                                            <img src={newProduct.section3Image} alt="Section 3 Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />
                                        ) : (
                                            <div className="text-muted d-flex align-items-center justify-content-center" style={{ height: '100%' }}>Şəkil seçilməyib</div>
                                        )}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={() => setNewProduct({ ...newProduct, section3Image: '' })}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById('new-product-section3-image')?.click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <input id="new-product-section3-image" type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                        const f = e.target.files?.[0] || null;
                                        if (f) {
                                            setNewProduct({ ...newProduct, section3Image: URL.createObjectURL(f) });
                                        }
                                    }} />
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Şəkil <span style={{ color: '#ff4d4f' }}>*</span></label>
                                <div className="image-upload-container">
                                    <div className="image-placeholder position-relative" style={{ minHeight: 180 }}>
                                        {newImagePreview ? (
                                            <img src={newImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />
                                        ) : (
                                            <div className="text-muted d-flex align-items-center justify-content-center" style={{ height: '100%' }}>Şəkil seçilməyib</div>
                                        )}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={() => { setNewImageFile(null); setNewImagePreview(''); }}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => document.getElementById('new-product-file')?.click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <input id="new-product-file" type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                        const f = e.target.files?.[0] || null;
                                        setNewImageFile(f);
                                        if (f) {
                                            setNewImagePreview(URL.createObjectURL(f));
                                        } else {
                                            setNewImagePreview('');
                                        }
                                    }} />
                                    <div className="image-info">*Yüklənən şəkil ölçüsü uyğun olmalıdır</div>
                                </div>
                            </div>

                            {/* Icon uploader using refresh as browse */}
                            <div className="form-group mb-3">
                                <label className="form-label">İkon <span style={{ color: '#ff4d4f' }}>*</span></label>
                                <div className="image-upload-container">
                                    <div className="image-placeholder position-relative" style={{ minHeight: 120 }}>
                                        {newIconPreview ? (
                                            <img src={newIconPreview} alt="Icon Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />
                                        ) : (
                                            <div className="text-muted d-flex align-items-center justify-content-center" style={{ height: '100%' }}>İkon seçilməyib</div>
                                        )}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete icon" onClick={() => { setNewIconFile(null); setNewIconPreview(''); }}>
                                                <img src="/assets/admin-trash.png" alt="Del" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse icon" onClick={() => document.getElementById('new-product-icon')?.click()}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <input id="new-product-icon" type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                        const f = e.target.files?.[0] || null;
                                        setNewIconFile(f);
                                        if (f) {
                                            setNewIconPreview(URL.createObjectURL(f));
                                        } else {
                                            setNewIconPreview('');
                                        }
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseModal}>
                                Ləğv et
                            </button>
                            <button className="btn btn-primary" onClick={createProduct} disabled={creating || !isCreateValid()}>
                                {creating ? 'Yaradılır...' : 'Əlavə et'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}