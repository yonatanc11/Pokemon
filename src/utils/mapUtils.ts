const TEL_AVIV_POLYGON: { lat: number; lng: number }[] = [

  { lat: 32.0402, lng: 34.7520 },

  { lat: 32.0402, lng: 34.7700 },

  { lat: 32.0500, lng: 34.7800 },

  { lat: 32.0650, lng: 34.7950 },
  { lat: 32.0800, lng: 34.8000 },
  { lat: 32.0950, lng: 34.8050 },

  { lat: 32.1100, lng: 34.8100 },
  { lat: 32.1200, lng: 34.8050 },

  { lat: 32.1200, lng: 34.7870 },

  { lat: 32.1100, lng: 34.7830 },
  { lat: 32.0900, lng: 34.7780 },
  { lat: 32.0700, lng: 34.7720 },
  { lat: 32.0550, lng: 34.7660 },

  { lat: 32.0402, lng: 34.7520 },
];


export const MOVEO_OFFICE = {
  lat: 32.0633,
  lng: 34.7718,
};

function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: { lat: number; lng: number }[]
): boolean {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;

    const intersect =
      yi > point.lng !== yj > point.lng &&
      point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

// generates a random lat/lng point within the defined polygon of Tel Aviv
export function getRandomTelAvivLocation(): { lat: number; lng: number } {

  const latMin = 32.0402;
  const latMax = 32.1200;
  const lngMin = 34.7506;
  const lngMax = 34.8100;

  let point: { lat: number; lng: number };
  do {
    point = {
      lat: latMin + Math.random() * (latMax - latMin),
      lng: lngMin + Math.random() * (lngMax - lngMin),
    };
  } while (!isPointInPolygon(point, TEL_AVIV_POLYGON));

  return point;
}