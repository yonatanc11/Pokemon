export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonType{
    slot: number;
    type: NamedAPIResource;
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: NamedAPIResource;
}
export interface PokemonAbility {
    is_hidden: boolean;
    slot: number;
    ability: NamedAPIResource;
} 

export interface PokemonSprites {
  front_default: string | null;
}

export interface PokemonMove {
  move: NamedAPIResource;
}

export interface PokemonDetail {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    types: PokemonType[];
    stats: PokemonStat[];
    abilities: PokemonAbility[];
    sprites: PokemonSprites;
    moves: PokemonMove[];
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: FlavorTextEntry[];
}

export interface Pokemon {
    id: number;
    name: string;
    types: PokemonType[];
    sprite: string;
}
export interface TypePokemon {
    pokemon: NamedAPIResource;
    slot: number;
}
export interface TypeDetail {
    id: number;
    name: string;
    pokemon: TypePokemon[];
}