import React, { useEffect, useState } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import ProductCard3D from './components/ProductCard3D';
import Spline from '@splinetool/react-spline';
import PageTitle from './components/PageTitle';
import { t } from './utils/i18n';
import './Products.css';

function Products() {
    const [allProducts, setAllProducts] = useState([]);
    const [productsState, setProductsState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [splineError, setSplineError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const { language } = useLanguage();
    const itemsPerPage = 4; // 4 products per page

    // Fetch all products once when language changes
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);

                const API = 'http://localhost:5098/api';
                const res = await fetch(`${API}/products?language=${language}`);
                if (!res.ok) throw new Error('Failed to load products');
                const data = await res.json();

                console.log('API Response:', data); // Debug log

                // Handle both single product response and array response
                let products = [];

                if (Array.isArray(data)) {
                    products = data;
                } else if (data.products && Array.isArray(data.products)) {
                    products = data.products;
                } else {
                    products = [data]; // Single product
                }

                // Normalize for card: ensure icon is present
                const normalized = products.map(p => ({
                    ...p,
                    icon: p.icon || p.imageUrl || '/assets/market-icon.png'
                }));

                setAllProducts(normalized);
                setTotalProducts(normalized.length);
                setTotalPages(Math.ceil(normalized.length / itemsPerPage));
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, [language]);

    // Handle pagination when currentPage or allProducts change
    useEffect(() => {
        if (allProducts.length > 0) {
            // If we have 8 or fewer products, show all of them
            if (allProducts.length <= 8) {
                setProductsState(allProducts);
                console.log(`Showing all ${allProducts.length} products (no pagination needed)`);
            } else {
                // If we have more than 8 products, use pagination
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedProducts = allProducts.slice(startIndex, endIndex);
                setProductsState(paginatedProducts);
                console.log(`Showing products ${startIndex + 1}-${endIndex} of ${allProducts.length}`);
            }
        }
    }, [allProducts, currentPage]);

    // Translation function for pagination
    const tPagination = (key) => {
        const dict = {
            previous: {
                az: '‹',
                en: '‹',
                ru: '‹'
            },
            next: {
                az: '›',
                en: '›',
                ru: '›'
            },
            page: {
                az: 'Səhifə',
                en: 'Page',
                ru: 'Страница'
            },
            of: {
                az: 'dən',
                en: 'of',
                ru: 'из'
            }
        };
        return (dict[key] && (dict[key][language] || dict[key].az)) || key;
    };

    // Pagination handlers
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

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

            {/* Pagination Component */}
            {totalProducts > 8 && (
                <div className="products-pagination">

                    <div className="pagination-controls">
                        <button
                            className="pagination-btn pagination-prev"
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                        >
                            <span>{tPagination('previous')}</span>
                        </button>

                        <div className="pagination-numbers">
                            {getPageNumbers().map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    className={`pagination-number ${pageNumber === currentPage ? 'active' : ''}`}
                                    onClick={() => handlePageClick(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                        </div>

                        <button
                            className="pagination-btn pagination-next"
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                        >
                            <span>{tPagination('next')}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;    