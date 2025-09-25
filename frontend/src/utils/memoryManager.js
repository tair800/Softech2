// Memory management utilities
export const memoryManager = {
    // Clear browser memory caches
    clearCaches: async () => {
        try {
            // Clear image cache
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(name => caches.delete(name))
                );
            }

            // Clear localStorage if needed
            // localStorage.clear(); // Uncomment if you want to clear all stored data

            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }

            console.log('Memory caches cleared');
        } catch (error) {
            console.warn('Failed to clear caches:', error);
        }
    },

    // Monitor memory usage (if available)
    getMemoryInfo: () => {
        if ('memory' in performance) {
            const memory = performance.memory;
            return {
                usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // MB
                totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576), // MB
                jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
                usagePercent: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
            };
        }
        return null;
    },

    // Check if memory usage is high
    isMemoryUsageHigh: () => {
        const memoryInfo = memoryManager.getMemoryInfo();
        if (memoryInfo) {
            return memoryInfo.usagePercent > 80; // Consider high if > 80%
        }
        return false;
    },

    // Debounce function to prevent excessive function calls
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function to limit function execution rate
    throttle: (func, limit) => {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Web Workers for heavy computations (if needed)
export const createWorker = (workerFunction) => {
    const blob = new Blob([`(${workerFunction.toString()})()`], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
};

// Memory leak detection
export const detectMemoryLeaks = () => {
    const initialMemory = memoryManager.getMemoryInfo();

    return {
        check: () => {
            const currentMemory = memoryManager.getMemoryInfo();
            if (initialMemory && currentMemory) {
                const increase = currentMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
                if (increase > 50) { // 50MB increase
                    console.warn('Potential memory leak detected:', increase + 'MB increase');
                    return true;
                }
            }
            return false;
        },
        reset: () => {
            const newInitialMemory = memoryManager.getMemoryInfo();
            if (newInitialMemory) {
                initialMemory.usedJSHeapSize = newInitialMemory.usedJSHeapSize;
            }
        }
    };
};
