import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './Blog.css';
import PageTitle from './components/PageTitle';
import LazySpline from './components/LazySpline.jsx';
import BlogSlider from './components/BlogSlider.jsx';
import LoadingAnimation from './components/LoadingAnimation';
import { useLanguage } from './contexts/LanguageContext.jsx';
import { getMetaDescription, getPageTitle } from './utils/metaDescriptions';

const API = 'https://softech-api.webonly.io/api';

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { language } = useLanguage();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
        if (url.startsWith('/uploads/')) return `https://softech-api.webonly.io${url}`;
        return url;
    };

    useEffect(() => {
        let isMounted = true;
        const fetchBlogs = async () => {
            setLoading(true);
            const startTime = Date.now();

            try {
                const res = await fetch(`${API}/blogs`);
                if (!res.ok) throw new Error('Failed to load blogs');
                const data = await res.json();
                if (isMounted) setBlogs(Array.isArray(data) ? data : []);
            } catch (e) {
                if (isMounted) setError(t('loadError'));
            } finally {
                if (isMounted) {
                    // Ensure minimum loading time of 0.1 seconds
                    const elapsedTime = Date.now() - startTime;
                    const minLoadingTime = 100; // 0.1 seconds
                    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

                    setTimeout(() => {
                        setLoading(false);
                    }, remainingTime);
                }
            }
        };
        fetchBlogs();
        return () => { isMounted = false; };
    }, []);

    // Transform blog data for BlogSlider
    const transformedBlogs = blogs.map((blog, index) => ({
        id: blog.id,
        slug: blog.slug || blog.id.toString(), // Use slug if available, fallback to ID
        image: resolveUrl(blog.mainImageUrl) || resolveUrl(blog.detailImg1Url) || "/assets/equipment1.png",
        alt: pick(blog.title1, blog.title1En, blog.title1Ru) || "Blog",
        number: String(index + 1).padStart(2, '0'),
        title: pick(blog.title1, blog.title1En, blog.title1Ru) || `Blog ${index + 1}`,
        description: pick(blog.desc1, blog.desc1En, blog.desc1Ru) || "Blog description"
    }));

    // Debug logging
    console.log('Blog component language:', language);
    console.log('Blog page title:', getPageTitle('blog', language));
    console.log('Blog meta description:', getMetaDescription('blog', language));

    return (
        <>
            <Helmet>
                <title>{getPageTitle('blog', language)}</title>
                <meta name="description" content={getMetaDescription('blog', language)} />
                <meta property="og:title" content={getPageTitle('blog', language)} />
                <meta property="og:description" content={getMetaDescription('blog', language)} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={getPageTitle('blog', language)} />
                <meta name="twitter:description" content={getMetaDescription('blog', language)} />
            </Helmet>
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

                    {/* Blog Slider */}
                    <div className="blog-slider-section mt-2 pt-5">
                        {/* Loading/Error */}
                        {loading && (
                            <div className="text-center text-white-50">{t('loading')}</div>
                        )}
                        {(!loading && error) && (
                            <div className="text-center text-danger">{error}</div>
                        )}

                        {/* Blog Slider */}
                        {(!loading && !error && transformedBlogs.length > 0) && (
                            <BlogSlider blogData={transformedBlogs} />
                        )}
                    </div>
                </div>

                {/* Loading Overlay */}
                {loading && (
                    <div className="loading-overlay">
                        <LoadingAnimation message={t('loading')} />
                    </div>
                )}
            </div>
        </>
    );
}

export default Blog;


