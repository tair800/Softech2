import React, { useState, useEffect } from 'react';
import './Blog.css';
import PageTitle from './components/PageTitle';
import LazySpline from './components/LazySpline.jsx';
import BlogSlider from './components/BlogSlider.jsx';
import { useLanguage } from './contexts/LanguageContext.jsx';

const API = 'https://softech-api.webonly.io/api';

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
        if (url.startsWith('/uploads/')) return `https://softech-api.webonly.io${url}`;
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

    // Transform blog data for BlogSlider
    const transformedBlogs = blogs.map((blog, index) => ({
        id: blog.id,
        image: resolveUrl(blog.mainImageUrl) || resolveUrl(blog.detailImg1Url) || "/assets/equipment1.png",
        alt: pick(blog.title1, blog.title1En, blog.title1Ru) || "Blog",
        number: String(index + 1).padStart(2, '0'),
        title: pick(blog.title1, blog.title1En, blog.title1Ru) || `Blog ${index + 1}`,
        description: pick(blog.desc1, blog.desc1En, blog.desc1Ru) || "Blog description"
    }));

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
        </div>
    );
}

export default Blog;


