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
    { term: 'riots', color: '#FF0000', timespan: '30d' },
    { term: 'kidnapping', color: '#00FFFF', timespan: '30d' },
    { term: 'human trafficking', color: '#FFA500', timespan: '30d' },
    { term: 'cyber attack', color: '#00FF00', timespan: '30d' },
    { term: 'hate crime', color: '#FFFF00', timespan: '30d' },
    { term: 'assassination', color: '#800080', timespan: '30d' },
    { term: 'extremism', color: '#FFC0CB', timespan: '30d' },
    { term: 'rebellion', color: '#008080', timespan: '30d' },
    { term: 'insurgency', color: '#FF69B4', timespan: '30d' },
    { term: 'coup', color: '#FF00FF', timespan: '30d' },
    { term: 'natural disaster', color: '#008000', timespan: '30d' },
    { term: 'drought', color: '#F0E68C', timespan: '30d' },
    { term: 'famine', color: '#DC143C', timespan: '30d' },
    { term: 'epidemic', color: '#FFA07A', timespan: '30d' },
    { term: 'pandemic', color: '#9400D3', timespan: '30d' }
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
