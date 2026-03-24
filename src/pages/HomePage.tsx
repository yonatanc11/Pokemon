import { usePokemonList } from '../hooks/usePokemonList';
import PokemonGrid from '../components/PokemonGrid';
import Loader from '../components/Loader';

export default function HomePage() {
  const { pokemon, isLoading, error, hasMore, loadMore } = usePokemonList();

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Pokedex</h1>
      <PokemonGrid pokemon={pokemon} />
      {isLoading && <Loader />}
      {hasMore && !isLoading && (
        <button onClick={loadMore}>Load more...</button>
      )}
    </div>
  );
}