import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import * as turf from '@turf/turf';

const GlobeComponent = forwardRef(({ countries, medalData }, ref) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showMedalInfo, setShowMedalInfo] = useState(false);
  const globeEl = React.useRef();

  useEffect(() => {
    if (countries.length > 0 && selectedCountry) {
      const centroid = turf.centroid(selectedCountry).geometry.coordinates;
      const lat = centroid[1];
      const lon = centroid[0];
      
      if (lat !== undefined && lon !== undefined) {
        globeEl.current.pointOfView({ lat, lng: lon, altitude: 1.2 }, 2000);
        setTimeout(() => {
          setShowMedalInfo(true);
        }, 2000);
      }
    }
  }, [selectedCountry, countries]);

  useImperativeHandle(ref, () => ({
    focusOnCountry(country) {
      setShowMedalInfo(false);
      setSelectedCountry(country);
    },
  }));

  const getMedalData = (countryName) => {
    console.log("Looking for medal data for:", countryName);
    const data = medalData.find(country => country['Country Name'].toLowerCase() === countryName.toLowerCase());
    console.log("Found data:", data);
    return data;
  };

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
        onPolygonClick={(d) => {
          setShowMedalInfo(false);
          setSelectedCountry(d);
        }}
        polygonsTransitionDuration={400}
      />
      {selectedCountry && showMedalInfo && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedCountry(null)}>&times;</span>
            <h2>{selectedCountry.properties.name}</h2>
            {getMedalData(selectedCountry.properties.name) ? (
              <div>
                <p><strong>Gold:</strong> {getMedalData(selectedCountry.properties.name).Gold}</p>
                <p><strong>Silver:</strong> {getMedalData(selectedCountry.properties.name).Silver}</p>
                <p><strong>Bronze:</strong> {getMedalData(selectedCountry.properties.name).Bronze}</p>
                <p><strong>Total:</strong> {getMedalData(selectedCountry.properties.name).Total}</p>
              </div>
            ) : (
              <p>No medal data available for this country.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default GlobeComponent;
