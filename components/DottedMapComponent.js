import React from 'react';

const DottedMapComponent = ({ events, svgMap }) => {
  return (
    <div className="map-container">
      <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`} alt="Dotted Map" />
    </div>
  );
};

export default DottedMapComponent;

