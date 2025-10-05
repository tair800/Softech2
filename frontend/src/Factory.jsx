import React, { useState, useEffect } from 'react';
import PageTitle from './components/PageTitle';
import LoadingAnimation from './components/LoadingAnimation';
import './Factory.css';

function Factory() {
    const [isLoading, setIsLoading] = useState(true);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
        // Simulate loading for Factory page
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="factory-container">
            <PageTitle title="Zavod" />

            {/* Loading Overlay */}
            {isLoading && (
                <div className="loading-overlay">
                    <LoadingAnimation message="Loading Factory..." />
                </div>
            )}
        </div>
    );
}

export default Factory; 