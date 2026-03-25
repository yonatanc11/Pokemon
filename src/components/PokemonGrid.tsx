import type { Pokemon } from '../types/pokemon';
import PokemonCard from './PokemonCard';
import styles from './PokemonGrid.module.scss';
interface PokemonGridProps {
   pokemon : Pokemon[];
}

export default function PokemonGrid({pokemon} : PokemonGridProps){
    return (
    <div className={styles.grid}>
      {pokemon.map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
    </div>
  );
}   