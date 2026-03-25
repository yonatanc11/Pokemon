import { useState, useEffect } from 'react';
import { usePokemonList } from '../hooks/usePokemonList';
import PokemonGrid from '../components/PokemonGrid';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import styles from './HomePage.module.scss';
/**
 * HomePage - Main landing page with search and pokemon grid
 * Route: /
 * Search reactively filters the full pokedex as the user types
 */
export default function HomePage() {
  const { pokemon,allNames, isLoading, error, hasMore, loadMore, searchPokemon, resetDisplay } = usePokemonList();
  const [searchQuery, setSearchQuery] = useState('');

  // Trigger search whenever the query or initial data changes
  useEffect(() => {
  if (searchQuery.trim()) {
    searchPokemon(searchQuery);
  } else if (allNames.length > 0) {
    resetDisplay();
  }
}, [searchQuery]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <PokemonGrid pokemon={pokemon} />
      {isLoading && <Loader />}
      {hasMore && !isLoading && !searchQuery.trim() && (
        <div className={styles.loadMore}>
          <button className={styles.loadMoreButton} onClick={loadMore}>
            Load more...
          </button>
        </div>
      )}
    </div>
  );
}