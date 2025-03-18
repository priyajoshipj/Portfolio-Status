import React, { useEffect, useRef } from 'react';
import { debounce } from '../../utils/debounce';
import './styles.css';

interface LoadMoreProps {
    onLoadMore: () => void;
    isLoading: boolean;
}

export const LoadMore: React.FC<LoadMoreProps> = ({ onLoadMore, isLoading }) => {
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const debouncedLoadMore = React.useMemo(
        () => debounce(onLoadMore, 300),
        [onLoadMore]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    debouncedLoadMore();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '200px',
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [debouncedLoadMore, isLoading]);

    return (
        <div ref={loadMoreRef} className="load-more">
            {isLoading ? 'Loading more data...' : 'Load more data....'}
        </div>
    );
}; 