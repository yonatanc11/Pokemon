import { useState, useEffect } from 'react';
import type { PokemonDetail, PokemonSpecies } from '../types/pokemon';
import { getPokemonDetail, getPokemonSpecies } from '../services/pokemonService';

// Custom hook that fetches a single pokemon's full data + description
// Used by the PokemonDetailPage when a user clicks on a card
export function usePokemonDetail(id: number) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refetches whenever the pokemon ID changes (navigating between detail pages)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [detail, species] = await Promise.all([
          getPokemonDetail(id),
          getPokemonSpecies(id),
        ]);

        setPokemon(detail);

        // The API returns descriptions in many languages — find the English one
        const englishEntry = species.flavor_text_entries.find(
          (entry) => entry.language.name === 'en'
        );
        setDescription(englishEntry?.flavor_text ?? '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { pokemon, description, isLoading, error };
}