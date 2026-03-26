import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { getRandomTelAvivLocation } from '../utils/mapUtils';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import Loader from '../components/Loader';
import styles from './PokemonMapPage.module.scss';
import Directions from '../components/Directions';

const API_KEY = import.meta.env.VITE_MAP_API_KEY as string;
const MOVEO_OFFICE = { lat: 32.0853, lng: 34.7818 };

export default function PokemonMapPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pokemon, isLoading, error } = usePokemonDetail(Number(id));
  const [pokemonLocation] = useState(() => getRandomTelAvivLocation());

  if (isLoading) return <Loader />;
  if (error || !pokemon) return <div>{error ?? 'Pokemon not found'}</div>;

  const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <div className={styles.page}>
      <button
        className={styles.backLink}
        onClick={() => navigate(`/pokemon/${id}`)}
      >
        ← Back to details
      </button>

      <h1 className={styles.title}>{pokemonName} — Location</h1>

      <APIProvider apiKey={API_KEY}>
        <div className={styles.mapContainer}>
          <Map
            defaultZoom={13}
            defaultCenter={pokemonLocation}
            mapId="DEMO_MAP_ID"
            className={styles.map}
          >
            <AdvancedMarker position={pokemonLocation} title={pokemonName}>
              <img
                src={pokemon.sprites.front_default ?? ''}
                alt={pokemonName}
                style={{ width: 50, height: 50 }}
              />
            </AdvancedMarker>

            <AdvancedMarker position={MOVEO_OFFICE} title="Moveo Office" />
          </Map>
        </div>

        <Directions origin={pokemonLocation} destination={MOVEO_OFFICE} />
      </APIProvider>
    </div>
  );



}