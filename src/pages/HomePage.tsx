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
  const { pokemon, isLoading, error, hasMore, loadMore, searchPokemon, resetDisplay } = usePokemonList();
  const [isSearching, setIsSearching] = useState(false);

  // Trigger search whenever the query or initial data changes
  const handleSearch = (query: string) => {
    if (query.trim()) {
      setIsSearching(true);
      searchPokemon(query);
    } else {
      setIsSearching(false);
      resetDisplay();
    }
  };



  if (error) return <div>{error}</div>;

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <PokemonGrid pokemon={pokemon} />
      {!isLoading && pokemon.length === 0 && isSearching && (
        <p className={styles.noResults}>No Pokémon found</p>
      )}
      {isLoading && <Loader />}
      {hasMore && !isLoading && !isSearching && (
        <div className={styles.loadMore}>
          <button className={styles.loadMoreButton} onClick={loadMore}>
            Load more...
          </button>
        </div>
      )}
    </div>
  );
}