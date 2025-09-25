import React, { useState, useEffect } from 'react';
import './Blog.css';
import PageTitle from './components/PageTitle';
import { Link } from 'react-router-dom';
import LazySpline from './components/LazySpline.jsx';
import { useLanguage } from './contexts/LanguageContext.jsx';

const API = 'http://localhost:5098/api';

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { language } = useLanguage();

    const t = (key) => {
        const dict = {
            pageTitle: { az: 'Bloq', en: 'Blog', ru: 'Блог' },
            leftTitle: { az: 'Rəqəmsal Dəyişimlərə İlham Verən Yazılar', en: 'Articles Inspiring Digital Transformation', ru: 'Статьи, вдохновляющие цифровую трансформацию' },
            rightTitle: { az: 'SOFTECH-in təcrübəsi və bilikləri ilə proqramlaşdırma, idarəetmə sistemləri və sənaye avtomatlaşdırması üzrə məqalələr sərhədləri aşır. Yeniliklərdən xəbərdar olun, imkanlardan istifadə edin.', en: 'With SOFTECH’s expertise, articles on programming, control systems, and industrial automation push boundaries. Stay updated and seize opportunities.', ru: 'Благодаря опыту SOFTECH статьи по программированию, системам управления и промышленной автоматизации расширяют границы. Будьте в курсе и используйте возможности.' },
            loading: { az: 'Yüklənir...', en: 'Loading...', ru: 'Загрузка...' },
            loadError: { az: 'Bloqlar yüklənmədi', en: 'Failed to load blogs', ru: 'Не удалось загрузить блогы' },
        };
        return (dict[key] && (dict[key][language] || dict[key].az)) || key;
    };

    const pick = (az, en, ru) => {
        const vAz = (az || '').trim();
        const vEn = (en || '').trim();
        const vRu = (ru || '').trim();
        if (language === 'en') return vEn || vAz || vRu;
        if (language === 'ru') return vRu || vAz || vEn;
        return vAz || vEn || vRu;
    };

    const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/uploads/')) return `http://localhost:5098${url}`;
        return url;
    };

    useEffect(() => {
        let isMounted = true;
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API}/blogs`);
                if (!res.ok) throw new Error('Failed to load blogs');
                const data = await res.json();
                if (isMounted) setBlogs(Array.isArray(data) ? data : []);
            } catch (e) {
                if (isMounted) setError(t('loadError'));
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchBlogs();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="blog-container">
            <PageTitle title={t('pageTitle')} customClass="page-title-blog" />

            <div className="blog-top">
                <div className="blog-spline">
                    <LazySpline
                        scene="https://prod.spline.design/mP2TljaQ-tsNIzZt/scene.splinecode"
                        fallbackImage="/assets/rainbow.png"
                        className="blog-spline-canvas"
                    />
                </div>
            </div>

            <div className="container blog-content">
                <div className="row g-5 align-items-start">
                    <div className="col-12 col-lg-6">
                        <div className="blog-section blog-section-left">
                            <h3 className="blog-section-title">{t('leftTitle')}</h3>

                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="blog-section blog-section-right">
                            <h3 className="blog-section-title text-lg-end">{t('rightTitle')}</h3>

                        </div>
                    </div>
                </div>

                {/* Blog images gallery */}
                <div className="row g-4 blog-gallery mt-2 pt-5">
                    {/* Loading/Error */}
                    {loading && (
                        <div className="col-12 text-center text-white-50">{t('loading')}</div>
                    )}
                    {(!loading && error) && (
                        <div className="col-12 text-center text-danger">{error}</div>
                    )}

                    {/* Map first blog to the three-card gallery layout */}
                    {(!loading && !error && blogs.length > 0) && (
                        <>
                            {/* First image */}
                            <div className="col-12 col-md-6 col-lg-4">
                                <Link to={`/blog/${blogs[0]?.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="blog-image-card">
                                        <img src={resolveUrl(blogs[0]?.detailImg1Url) || "/assets/equipment1.png"} alt="Blog 1" onError={(e) => { e.currentTarget.src = "/assets/equipment1.png"; }} />
                                    </div>
                                    <div className="blog-caption">
                                        <div className="blog-caption-inner">
                                            <div className="row g-2 align-items-stretch">
                                                <div className="col-4 col-md-3">
                                                    <div className="cap-number-box">
                                                        <span className="cap-number">01</span>
                                                    </div>
                                                </div>
                                                <div className="col-8 col-md-9">
                                                    <div className="cap-title-box">
                                                        <h2>{pick(blogs[0]?.title1, blogs[0]?.title1En, blogs[0]?.title1Ru)}</h2>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="cap-desc-box">
                                                        <p>{pick(blogs[0]?.desc1, blogs[0]?.desc1En, blogs[0]?.desc1Ru)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Second image - tall */}
                            <div className="col-12 col-md-6 col-lg-4">
                                <Link to={`/blog/${blogs[0]?.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="blog-image-card tall">
                                        <img src={resolveUrl(blogs[0]?.mainImageUrl) || "/assets/equipment1.png"} alt="Blog 2" onError={(e) => { e.currentTarget.src = "/assets/equipment1.png"; }} />
                                        {/* Top overlay for number and title */}
                                        <div className="blog-caption-overlay blog-caption-top">
                                            <div className="blog-caption-inner">
                                                <div className="row g-2 align-items-stretch mt-2">
                                                    <div className="col-3">
                                                        <div className="cap-number-box">
                                                            <span className="cap-number">02</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-9">
                                                        <div className="cap-title-box">
                                                            <h2>{pick(blogs[0]?.title2, blogs[0]?.title2En, blogs[0]?.title2Ru)}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Bottom overlay for description */}
                                        <div className="blog-caption-overlay blog-caption-bottom">
                                            <div className="blog-caption-inner">
                                                <div className="cap-desc-box">
                                                    <p>{pick(blogs[0]?.desc2, blogs[0]?.desc2En, blogs[0]?.desc2Ru)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Third image */}
                            <div className="col-12 col-md-6 col-lg-4">
                                <Link to={`/blog/${blogs[0]?.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="blog-image-card">
                                        <img src={resolveUrl(blogs[0]?.detailImg4Url || blogs[0]?.detailImg2Url)} alt="Blog 3" onError={(e) => { e.currentTarget.src = "/assets/equipment1.png"; }} />
                                    </div>
                                    <div className="blog-caption">
                                        <div className="blog-caption-inner">
                                            <div className="row g-2 align-items-stretch">
                                                <div className="col-4 col-md-3">
                                                    <div className="cap-number-box">
                                                        <span className="cap-number">03</span>
                                                    </div>
                                                </div>
                                                <div className="col-8 col-md-9">
                                                    <div className="cap-title-box">
                                                        <h2>{pick(blogs[0]?.title3, blogs[0]?.title3En, blogs[0]?.title3Ru)}</h2>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="cap-desc-box">
                                                        <p>{pick(blogs[0]?.desc3, blogs[0]?.desc3En, blogs[0]?.desc3Ru)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Blog;


