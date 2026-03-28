import { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  onSearch: (value: string) => void;
}


export default function SearchBar({ onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);


  const handleSearch = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    onSearch(inputValue);

    if (inputValue.trim() && !recentSearches.includes(inputValue.trim())) {
      setRecentSearches((prev) => [inputValue.trim(), ...prev].slice(0, 5));
    }
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Remove a single item from recent searches
  const handleRemoveRecent = (search: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== search));
  };

  // Clear all recent searches
  const handleClearAll = () => {
    setRecentSearches([]);
  };

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search pokemon..."
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          Search
        </button>
      </div>

      {showDropdown && recentSearches.length > 0 && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownTitle}>Recent searches</span>
            <button className={styles.clearButton} onClick={handleClearAll}>
              Clear
            </button>
          </div>
          {recentSearches.map((search) => (
            <div className={styles.dropdownItem} key={search}>
              <span
                className={styles.dropdownItemText}
                onClick={() => {
                  setInputValue(search);
                  onSearch(search);
                  setShowDropdown(false);
                }}
              >
                {search}
              </span>
              <button
                className={styles.dropdownItemRemove}
                onClick={() => handleRemoveRecent(search)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}