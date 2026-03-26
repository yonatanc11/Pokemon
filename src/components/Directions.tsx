import { useEffect, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import styles from './Directions.module.scss';
type TravelMode = 'DRIVING' | 'WALKING' | 'TRANSIT';

interface DirectionsProps {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
}

export default function Directions({ origin, destination }: DirectionsProps) {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');

    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [travelMode, setTravelMode] = useState<TravelMode>('DRIVING');
    const [showDirections, setShowDirections] = useState(false);

    // initial map
    useEffect(() => {
        if (!routesLibrary || !map) return;

        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(
            new routesLibrary.DirectionsRenderer({
                map,
                suppressMarkers: true,
            })
        );
    }, [routesLibrary, map]);

    // calculate and display directions
    useEffect(() => {
        if (!directionsService || !directionsRenderer || !showDirections) return;

        directionsService
            .route({
                origin,
                destination,
                travelMode: google.maps.TravelMode[travelMode],
            })
            .then((response) => {
                directionsRenderer.setDirections(response);
            })
            .catch((err) => console.error('Directions request failed:', err));
    }, [
        directionsService,
        directionsRenderer,
        showDirections,
        travelMode,
        origin,
        destination,
    ]);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            directionsRenderer?.setMap(null);
        };
    }, [directionsRenderer]);

    return (
        <div className={styles.controls}>
            {!showDirections ? (
                <button
                    className={styles.directionsButton}
                    onClick={() => setShowDirections(true)}
                >
                    Show Directions to Moveo
                </button>
            ) : (
                <div className={styles.travelModes}>
                    {(['DRIVING', 'WALKING', 'TRANSIT'] as TravelMode[]).map((mode) => (
                        <button
                            key={mode}
                            className={`${styles.modeButton} ${travelMode === mode ? styles.active : ''
                                }`}
                            onClick={() => setTravelMode(mode)}
                        >
                            {mode.charAt(0) + mode.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

}
