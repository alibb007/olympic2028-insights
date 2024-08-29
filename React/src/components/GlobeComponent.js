import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import * as turf from '@turf/turf';

const GlobeComponent = forwardRef(({ countries }, ref) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const globeEl = React.useRef();

  useEffect(() => {
    if (countries.length > 0 && selectedCountry) {
      const centroid = turf.centroid(selectedCountry).geometry.coordinates;
      const lat = centroid[1];
      const lon = centroid[0];
      
      if (lat !== undefined && lon !== undefined) {
        globeEl.current.pointOfView({ lat, lng: lon, altitude: 1.2 }, 2000);
      }
    }
  }, [selectedCountry, countries]);

  useImperativeHandle(ref, () => ({
    focusOnCountry(country) {
      setSelectedCountry(country);
    },
  }));

  return (
    <div className="globe-container">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={countries}
        polygonCapColor={(d) =>
          d === selectedCountry ? 'rgba(255, 0, 0, 0.8)' : 'rgba(200, 200, 200, 0.6)'
        }
        polygonSideColor={() => 'rgba(100, 100, 100, 0.15)'}
        polygonStrokeColor={() => '#111'}
        polygonAltitude={(d) => (d === selectedCountry ? 0.12 : 0.03)}
        polygonLabel={({ properties }) => `
          <b>${properties?.name || 'No Name'}</b> <br />
          Population: ${d3.format(',')(properties?.POP_EST || 'N/A')}
        `}
        onPolygonClick={setSelectedCountry}
        polygonsTransitionDuration={400}
      />
    </div>
  );
});

export default GlobeComponent;
