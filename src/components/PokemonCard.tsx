import { useNavigate } from 'react-router-dom';
import type { Pokemon } from '../types/pokemon';
import styles from './PokemonCard.module.scss';
interface PokemonCardProps {
  pokemon: Pokemon;
  showRemove?: boolean;
  onRemove?: () => void;
}

export default function PokemonCard({ pokemon, showRemove, onRemove }: PokemonCardProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/pokemon/${pokemon.id}`)}>
      {/* Header: pokemon number + optional remove button */}
      <div className={styles.cardHeader}>
        <span className={styles.pokemonId}>
          #{String(pokemon.id).padStart(3, '0')}
        </span>
        {showRemove && (
          <button
            className={styles.removeBtn}
            onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Pokemon sprite */}
      <img
        className={styles.sprite}
        src={pokemon.sprite}
        alt={pokemon.name}
      />

      {/* Pokemon name */}
      <span className={styles.pokemonName}>
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </span>
    </div>
  );

}