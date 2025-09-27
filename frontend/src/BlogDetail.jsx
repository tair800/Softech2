import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BlogDetail.css';
import BlogSlider from './components/BlogSlider.jsx';
import AboutTeamHeader from './components/AboutTeamHeader.jsx';
import { useLanguage } from './contexts/LanguageContext.jsx';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [sliderBlogs, setSliderBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { language } = useLanguage();

    const t = (key) => {
        const dict = {
            loading: { az: 'Yüklənir...', en: 'Loading...', ru: 'Загрузка...' },
            loadError: { az: 'Yükləmə xətası', en: 'Load error', ru: 'Ошибка загрузки' },
            feature: { az: 'Xüsusiyyət', en: 'Feature', ru: 'Особенность' },
        };
        return (dict[key] && (dict[key][language] || dict[key].az)) || key;
    };

    const API = 'https://softech-api.webonly.io/api';

    const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/uploads/')) return `https://softech-api.webonly.io${url}`;
        return url;
    };

    // Language picker with AZ default and fallbacks
    const pickByLanguage = (lang, en, ru, fallback) => {
        const vEn = (en || '').trim();
        const vRu = (ru || '').trim();
        const vAz = (fallback || '').trim();
        if (lang === 'en') return vEn || vAz || vRu;
        if (lang === 'ru') return vRu || vAz || vEn;
        return vAz || vEn || vRu;
    };

    const features = useMemo(() => {
        if (!blog?.features) return [];
        try {
            const arr = JSON.parse(blog.features);
            if (!Array.isArray(arr)) return [];
            return arr;
        } catch { return []; }
    }, [blog]);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API}/blogs/${id}`);
                if (!res.ok) throw new Error('Failed to load blog');
                const data = await res.json();
                if (mounted) setBlog(data);
            } catch (e) {
                if (mounted) setError(t('loadError'));
            } finally {
                if (mounted) setLoading(false);
            }
        };
        if (id) load();
        return () => { mounted = false; };
    }, [id]);

    // Load blogs for generic slider
    useEffect(() => {
        let mounted = true;
        const loadAll = async () => {
            try {
                const res = await fetch(`${API}/blogs`);
                if (!res.ok) return;
                const list = await res.json();
                if (!mounted) return;
                let mapped = (Array.isArray(list) ? list : []).map((b) => ({
                    id: b.id,
                    image: b.mainImageUrl || b.detailImg1Url || b.detailImg2Url || b.detailImg3Url || b.detailImg4Url || '/assets/equipment1.png',
                    alt: b.title1 || b.title2 || 'Blog',
                    number: String(b.id).padStart(2, '0'),
                    title: b.title2 || b.title1 || '',
                    description: b.desc2 || b.desc1 || ''
                }));
                if (mapped.length === 1) mapped = [mapped[0], mapped[0], mapped[0]];
                if (mapped.length === 2) mapped = [mapped[0], mapped[1], mapped[0]];
                setSliderBlogs(mapped);
            } catch { }
        };
        loadAll();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="blog-detail-page" >
            <div className="container">
                {loading && <div className="text-center text-white-50">{t('loading')}</div>}
                {(!loading && error) && <div className="text-center text-danger">{error}</div>}
                {!!blog && (
                    <div className="row">
                        {/* Left side */}
                        <div className="col-12 col-md-6">
                            <div className="blog-detail-left">
                                <h1 className="blog-detail-title">{pickByLanguage(language || 'az', blog.title2En, blog.title2Ru, blog.title2 || blog.title1)}</h1>
                                <p className="blog-detail-desc">{pickByLanguage(language || 'az', blog.desc1En, blog.desc1Ru, blog.desc1)}</p>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="col-12 col-md-6">
                            <div className="blog-detail-right">
                                <div className="blog-images-layout">
                                    {/* Image 1 - Left */}
                                    <div className="blog-image-oval blog-image-1">
                                        <img src={resolveUrl(blog.detailImg1Url) || '/assets/blog-detail1.png'} alt="Blog Image 1" />
                                    </div>

                                    {/* Images 2 & 3 - Middle (stacked) */}
                                    <div className="blog-images-middle">
                                        <div className="blog-image-oval blog-image-2">
                                            <img src={resolveUrl(blog.detailImg2Url) || '/assets/blog-detail2.png'} alt="Blog Image 2" />
                                        </div>
                                        <div className="blog-image-oval blog-image-3">
                                            <img src={resolveUrl(blog.detailImg3Url) || '/assets/blog-detail3.png'} alt="Blog Image 3" />
                                        </div>
                                    </div>

                                    {/* Image 4 - Right */}
                                    <div className="blog-image-oval blog-image-4">
                                        <img src={resolveUrl(blog.detailImg4Url) || '/assets/blog-detail4.png'} alt="Blog Image 4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Content Section */}
                {!!blog && (
                    <div className="row mt-5">
                        {/* Left side - Title and Description */}
                        <div className="col-12 col-md-6">
                            <div className="blog-additional-left">
                                <h2 className="blog-detail-title-2">{pickByLanguage(language || 'az', blog.title2En, blog.title2Ru, blog.title2)}</h2>
                                <p className="blog-detail-desc-2">{pickByLanguage(language || 'az', blog.desc2En, blog.desc2Ru, blog.desc2)}</p>
                            </div>
                        </div>

                        {/* Right side - Empty */}
                        <div className="col-12 col-md-6">
                            <div className="blog-additional-right">
                                {/* Right side content will go here */}
                            </div>
                        </div>
                    </div>
                )}

                {/* Features Section - Full Width */}
                {!!blog && features.length > 0 && (
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="blog-features-full">
                                {features.map((f, idx) => {
                                    const text = pickByLanguage(language || 'az', f.featureEn, f.featureRu, f.feature);
                                    return (
                                        <div key={idx} className="blog-feature-item">
                                            <div className="blog-feature-icon">
                                                <img src="/assets/blog-icon.svg" alt={t('feature')} />
                                            </div>
                                            <div className="blog-feature-content">
                                                <h3>{text}</h3>
                                                <p></p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Third Section - Title 3 and Description 3 */}
                {!!blog && (
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="blog-third-section">
                                <h2 className="blog-detail-title-3">{pickByLanguage(language || 'az', blog.title3En, blog.title3Ru, blog.title3)}</h2>
                                <p className="blog-detail-desc-3">{pickByLanguage(language || 'az', blog.desc3En, blog.desc3Ru, blog.desc3)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Blog Detail Slider (generic, from API) */}
                {sliderBlogs.length > 0 && (
                    <>
                        <AboutTeamHeader title={language === 'en' ? 'Similar blogs' : language === 'ru' ? 'Похожие блоги' : 'Oxşar bloglar'} style={{ marginTop: '44px' }} />
                        <div className="blog-slider-container">
                            <BlogSlider blogData={sliderBlogs} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogDetail;
