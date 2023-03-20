import Head from 'next/head';
import DottedMapComponent from '../components/DottedMapComponent';

export default function Home({ svgMap }) {
  return (
    <div className="container">
      <Head>
        <title>World Map Dot Matrix</title>
        <meta name="description" content="World Map Dot Matrix with events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>World Map Dot Matrix</h1>
        <DottedMapComponent svgMap={svgMap} />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch('http://localhost:3000/api/map');
  const svgMap = await response.text();

  return { props: { svgMap } };
}

