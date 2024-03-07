// components/BlinkingDottedMapComponent.js
import React, { useEffect, useRef } from 'react';

const BlinkingDottedMapComponent = ({ svgMap }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current) {
      const pins = mapRef.current.querySelectorAll('.pin');
      pins.forEach((pin) => {
        pin.style.animation = 'blink 15.5s infinite';
      });
    }
  }, [svgMap]);

  return (
    <div
      ref={mapRef}
      className="dotted-map"
      dangerouslySetInnerHTML={{ __html: svgMap }}
      style={{ width: '100%', height: 'auto' }}
    />
  );
};

export default BlinkingDottedMapComponent;
