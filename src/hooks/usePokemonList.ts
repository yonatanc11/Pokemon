import { useState, useEffect } from 'react';
import type { Pokemon, PokemonDetail, NamedAPIResource } from '../types/pokemon';
import { getPokemonList, getPokemonDetail } from '../services/pokemonService';

/**
 * Custom hook that powers the HomePage grid
 * 
 * Strategy:
 * 1. Fetch ALL pokemon names on mount (lightweight — just names and URLs)
 * 2. Fetch details (sprites, types) only for pokemon currently being displayed
 * 3. Cache fetched details so we don't refetch on repeated searches
 */
export function usePokemonList() {
  const [allNames, setAllNames] = useState<NamedAPIResource[]>([]);     // Full list of ~1300 pokemon names
  const [detailsCache, setDetailsCache] = useState<Map<string, Pokemon>>(new Map()); // Cache of fetched details
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]); // Currently visible pokemon
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);                 // How many pokemon to show (grows with "Load more")

  // Step 1: Fetch all pokemon names on mount (single lightweight API call)
  // Step 1: Fetch all names, then load the first batch of details
  useEffect(() => {
    const fetchAllNames = async () => {
      try {
        setIsLoading(true);
        const response = await getPokemonList(1025, 0);
        setAllNames(response.results);

        // Immediately fetch details for the first 12 pokemon
        const firstBatch = response.results.slice(0, 12);
        const details = await fetchDetails(firstBatch);
        setDisplayedPokemon(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllNames();
  }, []);

  /**
   * Fetch details for a list of pokemon, using cache when available
   * Returns an array of Pokemon with sprites and types loaded
   */
  const fetchDetails = async (names: NamedAPIResource[]): Promise<Pokemon[]> => {
    const results: Pokemon[] = [];
    const toFetch: NamedAPIResource[] = [];

    // Check cache first — skip API calls for already-fetched pokemon
    for (const item of names) {
      const cached = detailsCache.get(item.name);
      if (cached) {
        results.push(cached);
      } else {
        toFetch.push(item);
      }
    }

    // Fetch uncached pokemon details in parallel
    if (toFetch.length > 0) {
      const fetched = await Promise.all(
        toFetch.map(async (item) => {
          const detail: PokemonDetail = await getPokemonDetail(item.name);
          return {
            id: detail.id,
            name: detail.name,
            types: detail.types,
            sprite: detail.sprites.front_default ?? '',
          };
        })
      );

      // Add newly fetched pokemon to cache
      setDetailsCache((prev) => {
        const newCache = new Map(prev);
        fetched.forEach((p) => newCache.set(p.name, p));
        return newCache;
      });

      results.push(...fetched);
    }

    // Sort by ID to maintain correct pokedex order
    return results.sort((a, b) => a.id - b.id);
  };

  /**
   * Search and display pokemon matching the query
   * Filters the full name list, then fetches details for matches
   * Called by HomePage whenever searchQuery changes
   */
  const searchPokemon = async (query: string) => {
    setIsLoading(true);
    try {
      let filtered: NamedAPIResource[];

      if (!query.trim()) {
        // No search — show first N pokemon based on visibleCount
        filtered = allNames.slice(0, visibleCount);
      } else {
        // Filter all names by search query (name or ID number)
        const lowerQuery = query.toLowerCase();
        filtered = allNames.filter((item) => {
          const id = item.url.split('/').filter(Boolean).pop() ?? '';
          return (
            item.name.includes(lowerQuery) ||
            id.includes(lowerQuery)
          );
        });
      }
      // Reset display back to the default paginated view (when search is cleared)
      
      const details = await fetchDetails(filtered);
      setDisplayedPokemon(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  const resetDisplay = async () => {
        setIsLoading(true);
        try {
          const batch = allNames.slice(0, visibleCount);
          const details = await fetchDetails(batch);
          setDisplayedPokemon(details);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
          setIsLoading(false);
        }
      };

  // "Load more" — increases visible count by 12 and fetches next batch
  const loadMore = async () => {
    const newCount = visibleCount + 12;
    setVisibleCount(newCount);

    setIsLoading(true);
    try {
      const nextBatch = allNames.slice(0, newCount);
      const details = await fetchDetails(nextBatch);
      setDisplayedPokemon(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Whether there are more pokemon to load
  const hasMore = visibleCount < allNames.length;

  return { pokemon: displayedPokemon, allNames, isLoading, error, hasMore, loadMore, searchPokemon, resetDisplay };
}