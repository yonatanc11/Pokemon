import { useState, useEffect } from 'react';
import type { Pokemon, PokemonDetail } from '../types/pokemon';
import { getPokemonList, getPokemonDetail } from '../services/pokemonService';

export function usePokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]); // accumulated list of pokemon for the grid
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [offset, setOffset] = useState(0); // Tracks pagination position
  const [hasMore, setHasMore] = useState(true); // Indicates if more pokemon are available to load

  const fetchPokemon = async (currentOffset: number) => {
    try {
      setIsLoading(true);
      const listResponse = await getPokemonList(12, currentOffset);

      setHasMore(listResponse.next !== null);

      const details: Pokemon[] = await Promise.all(
        listResponse.results.map(async (item) => {
          const detail: PokemonDetail = await getPokemonDetail(item.name);
          return {
            id: detail.id,
            name: detail.name,
            types: detail.types,
            sprite: detail.sprites.front_default ?? '',
          };
        })
      );

      if (currentOffset === 0) {
      setPokemon(details);          // replace on initial load
    } else {
      setPokemon((prev) => [...prev, ...details]);  // append on load more
    }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(0);
  }, []);

  const loadMore = () => {
    const newOffset = offset + 12;
    setOffset(newOffset);
    fetchPokemon(newOffset);
  };

  return { pokemon, isLoading, error, hasMore, loadMore };
}