import DottedMap from 'dotted-map';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const map = new DottedMap({ height: 120, grid: 'diagonal' });

  // Define the query terms and their associated colors and timespans
  const queryTerms = [
    { term: 'terror', color: 'red', timespan: '30d' },
    { term: 'bombing', color: 'red', timespan: '1d' },
    { term: 'war', color: 'red', timespan: '1d' },
    { term: 'army', color: 'orange', timespan: '1d' },
    { term: 'cartel', color: 'pink', timespan: '7d' },
    { term: 'protests', color: 'lightblue', timespan: '7d' },
    { term: 'violence', color: 'red', timespan: '1d' },
    { term: 'murder', color: 'red', timespan: '1d' },
    { term: 'refugees', color: 'red', timespan: '30d' },
    { term: 'drugs', color: 'orange', timespan: '7d' },
  ];

  // Loop through the query terms, fetch data, and add pins
  for (const { term, color, timespan } of queryTerms) {
    try {
      const gdeltResponse = await fetch(
        `https://api.gdeltproject.org/api/v2/geo/geo?query=${term}&format=GeoJSON&mode=rss&timespan=${timespan}`
      );
      const gdeltData = await gdeltResponse.json();

      gdeltData.features.forEach((feature) => {
        const { geometry, properties } = feature;
        if (geometry.type === 'Point') {
          const [longitude, latitude] = geometry.coordinates;
          map.addPin({
            lat: latitude,
            lng: longitude,
            svgOptions: { color, radius: 0.4 },
          });
        }
      });
    } catch (error) {
      console.error(`Error fetching data for term "${term}":`, error);
    }
  }

  const svgMap = map.getSVG({
    radius: 0.35,
    color: '#ffffff',
    shape: 'circle',
    backgroundColor: '#020300',
  });

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(svgMap);
}
