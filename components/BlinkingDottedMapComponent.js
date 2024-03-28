import React, { useEffect, useRef } from 'react';

const DottedMapComponent = ({ svgMap }) => {
  const mapRef = useRef();

  useEffect(() => {
    const handlePinClick = (event) => {
      const title = event.target.getAttribute('title');
      console.log('Pin title:', title);
      // You can perform any other action here, such as displaying the title in a popup
    };

    if (mapRef.current) {
      const pins = mapRef.current.querySelectorAll('.pin');
      pins.forEach(pin => {
        pin.addEventListener('click', handlePinClick);
      });

      // Clean up event listeners when component unmounts
      return () => {
        pins.forEach(pin => {
          pin.removeEventListener('click', handlePinClick);
        });
      };
    }
  }, [svgMap]);

  return (
    <div
      ref={mapRef}
      className="map-container"
      dangerouslySetInnerHTML={{ __html: svgMap }}
    />
  );
};

export default DottedMapComponent;
