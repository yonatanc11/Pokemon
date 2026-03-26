import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { useFavorites } from '../context/FavoritesContext';
import TypeBadge from '../components/TypeBadge';
import Loader from '../components/Loader';
import styles from './PokemonDetailsPage.module.scss';
export default function PokemonDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { pokemon, description, isLoading, error } = usePokemonDetail(Number(id));
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();

    if (isLoading) return <Loader />;
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
            <button className={styles.backLink} onClick={() => navigate('/')}>
                ← Home page
            </button>

            <div className={styles.detailCard}>
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
                <div className={styles.cardContent}>
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
                    <div className={styles.rightColumn}>
                        <h2 className={styles.sectionTitle}>Description</h2>
                        <p className={styles.description}>{description}</p>

                        <h2 className={styles.sectionTitle}>Stats</h2>
                        <div className={styles.statsGrid}>
                            {leftStats.map((s) => (
                                <span className={styles.statItem} key={s.stat.name}>
                                    {formatStatName(s.stat.name)}: {s.base_stat}
                                </span>
                            ))}
                            {rightStats.map((s) => (
                                <span className={styles.statItem} key={s.stat.name}>
                                    {formatStatName(s.stat.name)}: {s.base_stat}
                                </span>
                            ))}
                            <span className={styles.statTotal}>Total: {total}</span>
                        </div>
                    </div>
                </div>
            </div>
            <button className={styles.backButton} onClick={() => navigate(`/pokemon/${id}/map`)}>
                Directions
            </button>
        </div>
    );
}