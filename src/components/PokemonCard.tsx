import {useNavigate} from 'react-router-dom';
import type { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  showRemove? : boolean;
  onRemove? : () => void;
}

export default function PokemonCard ({ pokemon,showRemove, onRemove} : PokemonCardProps){
    const navigate = useNavigate();
    
    return(
        <div onClick={() => navigate(`/pokemon/${pokemon.id}`)}>
      <span>#{String(pokemon.id).padStart(3, '0')}</span>
       <img src={pokemon.sprite} alt={pokemon.name} />
  <span>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
      {showRemove && (
        <button onClick={(e) => { e.stopPropagation(); onRemove?.(); }}>
          ✕
        </button>
      )}
        </div>
    )

}