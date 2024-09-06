import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import GlobeComponent from './components/GlobeComponent';
import SearchBar from './components/SearchBar';
import LandingPage from './components/LandingPage';

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [countries, setCountries] = useState([]);
  const [medalData, setMedalData] = useState([]);
  const globeRef = useRef();

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then((res) => res.json())
      .then((geoData) => {
        setCountries(geoData.features);
      });

    fetch('/medals.json')
      .then((res) => res.json())
      .then((data) => setMedalData(data));
  }, []);

  const handleSearch = (query) => {
    const country = countries.find(
      (c) => c.properties.name.toLowerCase() === query.toLowerCase()
    );
    if (country) {
      globeRef.current.focusOnCountry(country);
    } else {
      alert("Country not found!");
    }
  };

  const handleStartClick = () => {
    setShowLandingPage(false);
  };

  return (
    <div className="App">
      {showLandingPage ? (
        <LandingPage onStart={handleStartClick} />
      ) : (
        <div className="main-content">
          <Sidebar />
          <SearchBar onSearch={handleSearch} countries={countries} />
          <GlobeComponent ref={globeRef} countries={countries} medalData={medalData} />
        </div>
      )}
    </div>
  );
}

export default App;
