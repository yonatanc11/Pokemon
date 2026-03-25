import { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { getPokemonDetail } from '../services/pokemonService';
import type { Pokemon, PokemonDetail } from '../types/pokemon';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';
import styles from './FavoritesPage.module.scss';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch full details for each favorited pokemon ID
  // Re-runs whenever the favorites array changes (add/remove)
  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setPokemonList([]);
        return;
      }

      setIsLoading(true);
      try {
        const details = await Promise.all(
          favorites.map(async (id) => {
            const detail: PokemonDetail = await getPokemonDetail(id);
            return {
              id: detail.id,
              name: detail.name,
              types: detail.types,
              sprite: detail.sprites.front_default ?? '',
            };
          })
        );
        setPokemonList(details);
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  if (isLoading) return <Loader />;

  if (pokemonList.length === 0) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>No favorites yet. Go add some!</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {pokemonList.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            showRemove
            onRemove={() => removeFavorite(p.id)}
          />
        ))}
      </div>
    </div>
  );
}