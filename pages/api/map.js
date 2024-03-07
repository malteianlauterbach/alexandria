import DottedMap from 'dotted-map';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const map = new DottedMap({ height: 120, grid: 'diagonal' });

  // Define the query terms and their associated colors
  const queryTerms = [
    { term: 'Hezbollah', color: 'magenta' },
    { term: 'Daesh', color: 'pink' },
    { term: 'ISIS', color: 'red' },
    { term: 'ISIS', color: 'orange' },
  ];

  // Loop through the query terms, fetch data, and add pins
  for (const { term, color } of queryTerms) {
    try {
      const gdeltResponse = await fetch(
        `https://api.gdeltproject.org/api/v2/geo/geo?query=${term}&format=GeoJSON&mode=rss&timespan=1day`
      );
      const gdeltData = await gdeltResponse.json();

    
      gdeltData.features.forEach((feature) => {
        const { geometry, properties } = feature;
        if (geometry.type === 'Point') {
          const [longitude, latitude] = geometry.coordinates;
          map.addPin({
            lat: latitude,
            lng: longitude,
            svgOptions: { color, radius: 0.175 },
          });
        }
      });
      gdeltData.features.forEach(({ properties }) => {
        const { name, html } = properties;
      
        // Use a regular expression to extract the title from the HTML string
        const titleMatch = html.match(/<a.*?title="(.*?)"/);
        const title = titleMatch ? titleMatch[1] : null;
      
        console.log(`Title for term "${name}":`, title);
      });
      
      
  
    } catch (error) {
      console.error(`Error fetching data for term "${term}":`, error);
    }
  }

  const svgMap = map.getSVG({
    radius: 0.135,
    color: '#ffffff',
    shape: 'circle',
    backgroundColor: '#020300',
  });

  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(svgMap);
}
