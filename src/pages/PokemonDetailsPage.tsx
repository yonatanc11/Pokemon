import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { useFavorites } from '../context/FavoritesContext';
import TypeBadge from '../components/TypeBadge';
import Loader from '../components/Loader';
import styles from './PokemonDetailsPage.module.scss';
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
    
    const leftStats = pokemon.stats.filter((_, i) => i < 3);   // HP, Attack, Defense
    const rightStats = pokemon.stats.filter((_, i) => i >= 3);  // Sp.Atk, Sp.Def, Speed
    const total = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

    const formatStatName = (name: string): string => {
        const map: Record<string, string> = {
            'hp': 'HP',
            'attack': 'Attack',
            'defense': 'Defense',
            'special-attack': 'Special Atk',
            'special-defense': 'Special Def',
            'speed': 'Speed',
        };
        return map[name] ?? name;
    };
    return (
        <div className={styles.page}>
            {/* Back navigation */}
            <button className={styles.backLink} onClick={() => navigate('/')}>
                ← Home page
            </button>

            <div className={styles.detailCard}>
                {/* Top row: ID + heart */}
                <div className={styles.cardTop}>
                    <span className={styles.pokemonId}>
                        #{String(pokemon.id).padStart(3, '0')}
                    </span>
                    <button
                        className={styles.heartButton}
                        onClick={() => favorited ? removeFavorite(pokemon.id) : addFavorite(pokemon.id)}
                    >
                        {favorited ? '♥' : '♡'}
                    </button>
                </div>

                {/* Two-column content */}
                <div className={styles.cardContent}>
                    {/* Left: sprite, name, types */}
                    <div className={styles.leftColumn}>
                        <img
                            className={styles.sprite}
                            src={pokemon.sprites.front_default ?? ''}
                            alt={pokemon.name}
                        />
                        <span className={styles.pokemonName}>
                            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                        </span>
                        <div className={styles.typeBadges}>
                            {pokemon.types.map((t) => (
                                <TypeBadge key={t.type.name} typeName={t.type.name} />
                            ))}
                        </div>
                    </div>

                    {/* Right: description + stats */}
                    <div className={styles.rightColumn}>
                        <h2 className={styles.sectionTitle}>Description</h2>
                        <p className={styles.description}>{description}</p>

                        <h2 className={styles.sectionTitle}>Stats</h2>
                        <div className={styles.statsGrid}>
                            {/* Left stat column: HP, Attack, Defense */}
                            {leftStats.map((s) => (
                                <span className={styles.statItem} key={s.stat.name}>
                                    {formatStatName(s.stat.name)}: {s.base_stat}
                                </span>
                            ))}
                            {/* Right stat column: Sp.Atk, Sp.Def, Speed */}
                            {rightStats.map((s) => (
                                <span className={styles.statItem} key={s.stat.name}>
                                    {formatStatName(s.stat.name)}: {s.base_stat}
                                </span>
                            ))}
                            {/* Total */}
                            <span className={styles.statTotal}>Total: {total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}