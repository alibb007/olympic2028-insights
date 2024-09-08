import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Globe from 'react-globe.gl';
import * as turf from '@turf/turf';
import * as THREE from 'three';

const GlobeComponent = forwardRef(({ countries }, ref) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const globeEl = React.useRef();

  const [medalsData, setMedalsData] = useState([]);

  useEffect(() => {
    fetch('/medals2.json')
      .then((response) => response.json())
      .then((data) => setMedalsData(data))
      .catch((error) => console.error('Error fetching medals.json:', error));
  }, []);

  useEffect(() => {
    if (countries.length > 0 && selectedCountry) {
      const centroid = turf.centroid(selectedCountry).geometry.coordinates;
      const lat = centroid[1];
      const lon = centroid[0];

      if (lat !== undefined && lon !== undefined) {
        globeEl.current.pointOfView({ lat, lng: lon, altitude: 1.2 }, 2000);

        setTimeout(() => {
          const medalDataForCountry = getMedalData(selectedCountry.properties.name);
          if (medalDataForCountry) {
            addBarsToGlobe(medalDataForCountry, { lat, lon });
          }
        }, 2000);
      }
    }
  }, [selectedCountry, countries]);

  useImperativeHandle(ref, () => ({
    focusOnCountry(country) {
      setSelectedCountry(country);
    },
  }));

  const getMedalData = (countryName) => {
    const medalData = medalsData.find(
      (country) => country['Country Name'].toLowerCase() === countryName.toLowerCase()
    );
    return medalData || { Gold: 0, Silver: 0, Bronze: 0 };
  };

  const addBarsToGlobe = (medalData, position) => {
    const { Gold, Silver, Bronze } = medalData;
    const colors = ['gold', 'silver', '#cd7f32'];
    const heights = [Gold, Silver, Bronze];
    
    heights.forEach((height, index) => {
      if (height > 0) {
        console.log(`Adding bar at position: ${JSON.stringify(position)}, height: ${height}, color: ${colors[index]}`);
        
        const bar = new THREE.Mesh(
          new THREE.BoxGeometry(5.2, 5.2, height ), // Adjust the height scale as needed
          new THREE.MeshBasicMaterial({ color: colors[index] })
        );

        // Get the x, y, z coordinates
        const coords = globeEl.current.getCoords(position.lat, position.lon, 0.1);

        if (Array.isArray(coords)) {
          const [x, y, z] = coords; // Destructure only if coords is an array
          bar.position.set(x, y, z);
        } else if (coords && typeof coords === 'object') {
          // Assuming getCoords returns an object with x, y, z properties
          bar.position.set(coords.x, coords.y, coords.z);
        } else {
          console.error("Unexpected format of coordinates: ", coords);
        }

        bar.lookAt(0, 0, 0); // Ensure the bar points towards the globe's center

        globeEl.current.scene().add(bar);
      }
    });
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
        polygonLabel={({ properties }) => {
          const countryMedalData = getMedalData(properties?.name);
          const totalMedals = countryMedalData
            ? countryMedalData.Gold + countryMedalData.Silver + countryMedalData.Bronze
            : 0;

          return `
          <div style="font-family: 'Paris2024', sans-serif; color: gold; font-size: 28px; font-weight: bold;">
            <b>${properties?.name || 'No Name'}</b> <br />
            Total Medals: ${totalMedals}
          </div>
          `;
        }}
        onPolygonClick={(d) => {
          setSelectedCountry(d);
        }}
        polygonsTransitionDuration={400}
      />
    </div>
  );
});

export default GlobeComponent;
