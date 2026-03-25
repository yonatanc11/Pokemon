import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { useFavorites } from '../context/FavoritesContext';
import TypeBadge from '../components/TypeBadge';
import Loader from '../components/Loader';

/**
 * PokemonDetailPage - Displays full details for a single pokemon
 * Route: /pokemon/:id
 * Shows: sprite, name, types, description (from species endpoint), stats, and favorite toggle
 */
export default function PokemonDetailPage() {
    // Extract the pokemon ID from the URL parameter (e.g., /pokemon/25 → id = "25")
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch full pokemon data + description using our custom hook
    const { pokemon, description, isLoading, error } = usePokemonDetail(Number(id));

    // Access favorites context for the heart toggle button
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();

    // Show loader while data is being fetched
    if (isLoading) return <Loader />;

    // Show error message if fetch failed or pokemon doesn't exist
    if (error || !pokemon) return <div>{error ?? 'Pokemon not found'}</div>;

    const favorited = isFavorite(pokemon.id);

    return (
        <div>
            {/* Back navigation to home page */}
            <button onClick={() => navigate('/')}>← Home page</button>

            {/* Header: pokemon number + favorite toggle */}
            <div>
                <span>#{String(pokemon.id).padStart(3, '0')}</span>
                <button
                    onClick={() =>
                        favorited ? removeFavorite(pokemon.id) : addFavorite(pokemon.id)
                    }
                >
                    {favorited ? '♥' : '♡'}
                </button>
            </div>

            {/* Pokemon sprite and name */}
            <img src={pokemon.sprites.front_default ?? ''} alt={pokemon.name} />
            <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>

            {/* Type badges (e.g., Grass, Poison) */}
            <div>
                {pokemon.types.map((t) => (
                    <TypeBadge key={t.type.name} typeName={t.type.name} />
                ))}
            </div>

            {/* Description from the pokemon-species endpoint */}
            <h2>Description</h2>
            <p>{description}</p>

            {/* Base stats table with total */}
            <h2>Stats</h2>
            <div>
                {pokemon.stats.map((s) => (
                    <div key={s.stat.name}>
                        <span>
                            {s.stat.name}: {s.base_stat}
                        </span>
                    </div>
                ))}
                {/* Sum of all 6 base stats */}
                <span>
                    Total: {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
                </span>
            </div>
        </div>
    );
}