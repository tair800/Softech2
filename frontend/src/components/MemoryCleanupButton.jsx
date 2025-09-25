import React, { useState } from 'react';
import { memoryManager } from '../utils/memoryManager';

const MemoryCleanupButton = ({ className = '', style = {} }) => {
    const [isClearing, setIsClearing] = useState(false);
    const [lastCleanup, setLastCleanup] = useState(null);

    const handleCleanup = async () => {
        setIsClearing(true);
        try {
            await memoryManager.clearCaches();
            setLastCleanup(new Date());

            // Show success message
            console.log('Memory cleanup completed successfully');
        } catch (error) {
            console.error('Memory cleanup failed:', error);
        } finally {
            setIsClearing(false);
        }
    };

    const getMemoryInfo = () => {
        const info = memoryManager.getMemoryInfo();
        if (!info) return null;

        return {
            used: info.usedJSHeapSize,
            total: info.totalJSHeapSize,
            limit: info.jsHeapSizeLimit,
            percent: info.usagePercent
        };
    };

    const memoryInfo = getMemoryInfo();

    return (
        <div className={`memory-cleanup-container ${className}`} style={style}>
            {memoryInfo && (
                <div className="memory-info">
                    <span className="memory-usage">
                        Memory: {memoryInfo.used}MB / {memoryInfo.limit}MB ({memoryInfo.percent}%)
                    </span>
                    {memoryInfo.percent > 80 && (
                        <span className="memory-warning">⚠️ High Usage</span>
                    )}
                </div>
            )}

            <button
                onClick={handleCleanup}
                disabled={isClearing}
                className="memory-cleanup-btn"
                title="Clear memory caches and free up RAM"
            >
                {isClearing ? 'Clearing...' : '🧹 Clear Memory'}
            </button>

            {lastCleanup && (
                <div className="last-cleanup">
                    Last cleaned: {lastCleanup.toLocaleTimeString()}
                </div>
            )}
        </div>
    );
};

export default MemoryCleanupButton;
