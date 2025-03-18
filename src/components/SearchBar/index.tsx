import React from 'react';
import { debounce } from '../../utils/debounce';
import './styles.css';

interface SearchBarProps {
    onSearch: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const debouncedSearch = React.useMemo(
        () => debounce(onSearch, 300),
        [onSearch]
    );

    return (
        <div className="search-container">
            <input
                type="text"
                onChange={(e) => debouncedSearch(e.target.value)}
                placeholder="Search by name, industry, or type..."
                className="search-input"
            />
        </div>
    );
}; 