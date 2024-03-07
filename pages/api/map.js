// pages/api/map.js
import DottedMap from 'dotted-map';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const map = new DottedMap({ height: 120, grid: 'diagonal' });

  const newsQueryTerms = [
    { term: 'Hezbollah', color: 'magenta' },
    { term: 'Daesh', color: 'pink' },
    { term: 'ISIS', color: 'red' },
    { term: 'Hamas', color: 'orange' },
    { term: 'PIJ', color: 'orange' },
    { term: 'Palestinian Jihad', color: 'orange' },
    { term: 'Taliban', color: 'green' },
    { term: 'IRGC', color: 'red' },
    { term: 'Huthis', color: 'purple' },
    { term: 'Ansar Allah', color: 'purple' },




  ];

  const exchangeRateQueryTerms = [
    { term: 'USD to EUR', color: 'green', fromCurrency: 'USD', toCurrency: 'EUR' },
    { term: 'USD to CHF', color: 'blue', fromCurrency: 'USD', toCurrency: 'CHF' },
    { term: 'USD to Rubels', color: 'purple', fromCurrency: 'USD', toCurrency: 'RUB' },
    { term: 'USD to ILS', color: 'yellow', fromCurrency: 'USD', toCurrency: 'ILS' },
  ];

  const apiData = [];

  // Fetch news data
  for (const { term, color } of newsQueryTerms) {
    try {
      const gdeltResponse = await fetch(
        `http://api.gdeltproject.org/api/v2/geo/geo?query=${term}&format=GeoJSON&mode=rss&timespan=1week`
      );
      const gdeltData = await gdeltResponse.json();

      const titles = gdeltData.features.map(({ properties }) => {
        const { name, html } = properties;
        const titleMatch = html.match(/<a.*?title="(.*?)"/);
        return titleMatch ? titleMatch[1] : null;
      });

      apiData.push({ term, color, data: titles });

      gdeltData.features.forEach((feature) => {
        const { geometry } = feature;
        if (geometry.type === 'Point') {
          const [longitude, latitude] = geometry.coordinates;
          map.addPin({
            lat: latitude,
            lng: longitude,
            svgOptions: { color, radius: 0.175 },
          });
        }
      });
    } catch (error) {
      console.error(`Error fetching news data for term "${term}":`, error);
    }
  }

  // Fetch exchange rate data
  for (const { term, color, fromCurrency, toCurrency } of exchangeRateQueryTerms) {
    try {
      const exchangeRateResponse = await fetch(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=IIQPGMESE4RN6CN8`
      );
      const exchangeRateData = await exchangeRateResponse.json();

      if (exchangeRateData['Realtime Currency Exchange Rate']) {
        const exchangeRate = exchangeRateData['Realtime Currency Exchange Rate']['5. Exchange Rate'];
        apiData.push({ term, color, data: exchangeRate });

        // Add code here to display the exchangeRate data as needed
      } else {
        throw new Error('Invalid response from Alpha Vantage');
      }
    } catch (error) {
      console.error(`Error fetching exchange rate data for term "${term}":`, error);
    }
  }

  const svgMap = map.getSVG({
    radius: 0.135,
    color: '#ffffff',
    shape: 'circle',
    backgroundColor: '#020300',
  });

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ svgMap, apiData });
}
