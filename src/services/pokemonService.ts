import type {
  PokemonListResponse,
  PokemonDetail,
  PokemonSpecies,
} from '../types/pokemon';

const { VITE_POKEAPI_BASE_URL } = import.meta.env;
const BASE_URL = VITE_POKEAPI_BASE_URL;

export async function getPokemonList(
  limit: number = 12,
  offset: number = 0
): Promise<PokemonListResponse> {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!response.ok) throw new Error('Failed to fetch pokemon list');
  return response.json();
}

export async function getPokemonDetail(
  idOrName: number | string
): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!response.ok) throw new Error(`Failed to fetch pokemon: ${idOrName}`);
  return response.json();
}

export async function getPokemonSpecies(
  id: number
): Promise<PokemonSpecies> {
  const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch species: ${id}`);
  return response.json();
}