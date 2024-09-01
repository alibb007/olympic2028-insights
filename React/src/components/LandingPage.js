import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import '../LandingPage.css'; // Assuming the CSS is in LandingPage.css

const LandingPage = ({ onStart }) => {
  const globeEl = useRef();

  useEffect(() => {
    const globe = globeEl.current;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5; // Slow rotation speed
    globe.pointOfView({ altitude: 2.5 }, 2000);
  }, []);

  return (
    <div className="landing-page">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <div className="overlay">
        <h1>Welcome to Olympic 2024 Dashboard :)</h1>
        <button className="start-button" onClick={onStart}>START</button>
      </div>
    </div>
  );
};

export default LandingPage;
