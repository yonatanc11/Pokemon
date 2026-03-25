import { useState } from 'react';
import styles from './SearchBar.module.scss';
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * SearchBar - Text input with search button and recent searches dropdown
 * Filtering happens reactively as the user types (handled by parent)
 * The Search button saves the current term to recent searches
 */
export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Save current search term to recent list (no duplicates, max 5)
  const handleSearch = () => {
    if (value.trim() && !recentSearches.includes(value.trim())) {
      setRecentSearches((prev) => [value.trim(), ...prev].slice(0, 5));
    }
    setShowDropdown(false);
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search pokemon..."
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Recent searches dropdown */}
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
                onClick={() => { onChange(search); setShowDropdown(false); }}
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