// pages/index.js
import Head from 'next/head';
import DottedMapComponent from '../components/DottedMapComponent';

export default function Home({ svgMap, apiData, stockData }) {
  return (
    <div className="container">
      <Head>
        <meta name="description" content="Reason21 - Events as they occur." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>World Map Dot Matrix</h1>
        <DottedMapComponent svgMap={svgMap} />
        <div className="scrolling-text">
          {apiData.map(({ term, color, data }) => (
            <marquee key={term} style={{ color }}>
              {` "${term}": ${JSON.stringify(data)}`}
            </marquee>
          ))}
          {stockData.map(({ symbol, price }) => (
            <marquee key={symbol} style={{ color: 'green' }}>
              {`${symbol}: $${price}`}
            </marquee>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const response = await fetch('http://localhost:3000/api/map');
    const { svgMap, apiData, stockData } = await response.json();

    return {
      props: {
        svgMap,
        apiData,
        stockData: stockData || [], // Ensure stockData is defined and not undefined
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      props: {
        svgMap: null,
        apiData: [],
        stockData: [], // Return an empty array in case of an error
      },
    };
  }
}

