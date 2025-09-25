import React, { useEffect, useState } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import ProductCard3D from './components/ProductCard3D';
import Spline from '@splinetool/react-spline';
import PageTitle from './components/PageTitle';
import { t } from './utils/i18n';
import './Products.css';

function Products() {
    const [productsState, setProductsState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [splineError, setSplineError] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const API = 'http://localhost:5098/api';
                const res = await fetch(`${API}/products?language=${language}`);
                if (!res.ok) throw new Error('Failed to load products');
                const data = await res.json();
                // Normalize for card: ensure icon is present
                const normalized = (Array.isArray(data) ? data : []).map(p => ({
                    ...p,
                    icon: p.icon || p.imageUrl || '/assets/market-icon.png'
                }));
                setProductsState(normalized);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [language]);

    return (
        <div className="products-container">
            <PageTitle title={t('products', language)} customClass="page-title-products" />
            <div className="products-circle-background-left-1"></div>
            <div className="products-circle-background-left-2"></div>

            <div className="products-center">
                <div className="products-rainbow">
                    {!splineError ? (
                        <Spline
                            scene="https://prod.spline.design/mP2TljaQ-tsNIzZt/scene.splinecode"
                            onError={(error) => {
                                setSplineError(true);
                            }}
                        />
                    ) : (
                        <div className="spline-fallback">
                            <img src="/assets/rainbow.png" alt="Rainbow" />
                        </div>
                    )}
                </div>
            </div>

            <div className="products-team-header">
                <div className="products-team-title">{t('categories', language)}</div>

                <div className="products-team-nav">
                    <div className="products-team-nav-dot products-team-nav-dot-faded"></div>
                    <div className="products-team-nav-dot products-team-nav-dot-gradient"></div>
                    <div className="products-team-divider"></div>
                    <div className="products-team-bar"></div>
                </div>
            </div>

            {error && <div className="products-center"><div>Error: {error}</div></div>}
            {loading && <div className="products-center"><div>Loading...</div></div>}
            <div className="products-grid-3d">
                {productsState.map((product) => (
                    <div key={product.id} className="product-card-3d-wrapper">
                        <ProductCard3D product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;    