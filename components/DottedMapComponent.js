import React from 'react';

// It takes two props: events and svgMap
const DottedMapComponent = ({ events, svgMap }) => {
  // Render a container div with class name 'map-container'
  // Inside the container, render an img element
  // The img src is set to a data URI containing the SVG map, which is passed as props
  return (
    <div className="map-container">
      <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`} alt="Dotted Map" />
    </div>
  );
};

export default DottedMapComponent;
