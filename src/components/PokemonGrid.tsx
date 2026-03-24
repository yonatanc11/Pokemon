import type { Pokemon } from '../types/pokemon';
import PokemonCard from './PokemonCard';

interface PokemonGridProps {
   pokemon : Pokemon[];
}

export default function PokemonGrid({pokemon} : PokemonGridProps){
    return(
        <div>
            {pokemon.map(p => <PokemonCard key={p.id} pokemon={p} />)}
        </div>
    );
}   