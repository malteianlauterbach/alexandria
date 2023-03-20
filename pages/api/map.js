import DottedMap from 'dotted-map';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const map = new DottedMap({ height: 120, grid: 'diagonal' });

  // Define the query terms and their associated colors and timespans
  const queryTerms = [
    { term: 'terror', color: 'red', timespan: '1day' },
    { term: 'bombing', color: 'blue', timespan: '1day' },
    { term: 'war', color: 'green', timespan: '1day' },
    { term: 'army', color: 'purple', timespan: '1day' },
    { term: 'cartel', color: 'orange', timespan: '7days' },
    { term: 'protests', color: 'yellow', timespan: '7days' },
    { term: 'violence', color: 'cyan', timespan: '1day' },
    { term: 'murder', color: 'magenta', timespan: '1day' },
    { term: 'refugees', color: 'brown', timespan: '30days' },
    { term: 'drugs', color: 'lime', timespan: '7days' },
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
