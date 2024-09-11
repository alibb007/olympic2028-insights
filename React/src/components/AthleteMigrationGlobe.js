import React, { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';

// New component to visualize athlete migration
const AthleteMigrationGlobe = () => {
  const [medalsData, setMedalsData] = useState([]);
  const globeEl = useRef(null);

  useEffect(() => {
    // Fetch the medals data
    fetch('/medals2.json')
      .then((response) => response.json())
      .then((data) => {
        // Filter athletes where birth_country != residence_country
        const filteredData = data.filter(
          (entry) => entry.birth_country !== entry.residence_country
        );
        setMedalsData(filteredData);
      })
      .catch((error) => console.error('Error fetching medals2.json:', error));
  }, []);

  const getCountryCoordinates = async (country) => {
    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
      const data = await res.json();
      const { latlng } = data[0];
      return { lat: latlng[0], lng: latlng[1] };
    } catch (error) {
      console.error(`Error fetching coordinates for ${country}:`, error);
      return { lat: 0, lng: 0 }; // Fallback to default coordinates
    }
  };

  const createArcs = async () => {
    const arcsData = [];
    for (const entry of medalsData) {
      const birthCoords = await getCountryCoordinates(entry.birth_country);
      const residenceCoords = await getCountryCoordinates(entry.residence_country);
      arcsData.push({
        src: birthCoords,
        dst: residenceCoords,
        athlete: entry.name,
        event: entry.event,
      });
    }
    return arcsData;
  };

  useEffect(() => {
    if (medalsData.length > 0) {
      // Create arcs data when medalsData is populated
      createArcs().then((arcs) => {
        globeEl.current.arcsData(arcs);
      });
    }
  }, [medalsData]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        arcsData={[]} // Arcs will be added dynamically
        arcColor={() => ['rgba(0, 255, 0, 0.6)', 'rgba(255, 0, 0, 0.6)']}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcLabel={(d) => `${d.athlete}: ${d.src.lat}, ${d.src.lng} → ${d.dst.lat}, ${d.dst.lng}`}
        onArcHover={(hoverArc) =>
          globeEl.current.arcColor(() =>
            hoverArc
              ? ['rgba(255, 255, 0, 0.8)', 'rgba(255, 0, 0, 0.8)']
              : ['rgba(0, 255, 0, 0.6)', 'rgba(255, 0, 0, 0.6)']
          )
        }
      />
    </div>
  );
};

export default AthleteMigrationGlobe;
