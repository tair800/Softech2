import { useEffect, useRef } from 'react';

export const useMemoryOptimization = () => {
    const cleanupRefs = useRef(new Set());

    const addCleanup = (cleanupFn) => {
        cleanupRefs.current.add(cleanupFn);
    };

    const removeCleanup = (cleanupFn) => {
        cleanupRefs.current.delete(cleanupFn);
    };

    useEffect(() => {
        return () => {
            // Run all cleanup functions when component unmounts
            cleanupRefs.current.forEach(cleanup => {
                try {
                    cleanup();
                } catch (error) {
                    console.warn('Cleanup function error:', error);
                }
            });
            cleanupRefs.current.clear();

            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
        };
    }, []);

    return { addCleanup, removeCleanup };
};

// Hook for optimizing image loading
export const useImageOptimization = () => {
    const imageCache = useRef(new Map());

    const preloadImage = (src) => {
        if (imageCache.current.has(src)) {
            return imageCache.current.get(src);
        }

        const img = new Image();
        const promise = new Promise((resolve, reject) => {
            img.onload = () => resolve(src);
            img.onerror = reject;
        });

        img.src = src;
        imageCache.current.set(src, promise);

        return promise;
    };

    const clearImageCache = () => {
        imageCache.current.clear();
    };

    return { preloadImage, clearImageCache };
};
