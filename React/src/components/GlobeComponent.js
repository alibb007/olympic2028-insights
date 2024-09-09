import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Globe from 'react-globe.gl';
import * as turf from '@turf/turf';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';
import MedalDetails from './MedalDetails';

const GlobeComponent = forwardRef(({ countries }, ref) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [barData, setBarData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [showMedalDetails, setShowMedalDetails] = useState(false);
  const [selectedMedalData, setSelectedMedalData] = useState(null);
  const [medalType, setMedalType] = useState(null);
  const [totalMedals, setTotalMedals] = useState(0);
  const globeEl = React.useRef();

  const [medalsData, setMedalsData] = useState([]);
  const [fullData, setFullData] = useState([]);

  
  useEffect(() => {
    // Fetch medals2.json (complete version)
    fetch('/medals2.json')
      .then((response) => response.json())
      .then((data) => setMedalsData(data))
      .catch((error) => console.error('Error fetching medals2.json:', error));

    // Fetch data.json (as originally)
    fetch('/medals2.json')
      .then((response) => response.json())
      .then((data) => setFullData(data))
      .catch((error) => console.error('Error fetching data.json:', error));
  }, []);

  const countryNameMapping = {
    "USA": "United States",
    "England": "United Kingdom",
    "Czechia": "Czech Republic",
    "Côte d'Ivoire": "Ivory Coast",
    "Korea, Republic of": "South Korea",
    "Korea, Democratic People's Republic of": "North Korea",
    "Russian Federation": "Russia",
    "Serbia": "Republic of Serbia",
    "North Macedonia": "Macedonia"
  };
  
  

  const getMedalData = (countryName) => {
    // Normalize the country name using the mapping
    const normalizedCountryName = countryNameMapping[countryName] || countryName;
  
    // Find the medal data by matching the normalized country name
    const medalData = medalsData.find(
      (entry) => entry['Country Name'].toLowerCase() === normalizedCountryName.toLowerCase()
    );
  
    // Return the medal data or a default structure if no data is found
    return medalData || { Gold: 0, Silver: 0, Bronze: 0 };
  };
  
  

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
            setBarData(createBarData(medalDataForCountry));
            setTotalMedals(
              medalDataForCountry.Gold + medalDataForCountry.Silver + medalDataForCountry.Bronze
            );
            setShowChart(true);
          } else {
            setBarData(createNoMedalData());
            setTotalMedals(0);
            setShowChart(true);
          }
        }, 2000);
      }
    }
  }, [selectedCountry, countries]);

  useImperativeHandle(ref, () => ({
    focusOnCountry(country) {
      setShowChart(false);
      setShowMedalDetails(false);
      setSelectedCountry(country);
    },
  }));

  
  

  const createBarData = (medalDataForCountry) => {
    return {
      labels: ['🥇 Gold', '🥈 Silver', '🥉 Bronze'],
      datasets: [
        {
          label: `${medalDataForCountry['Country Name']} Medal Count`,
          data: [medalDataForCountry.Gold, medalDataForCountry.Silver, medalDataForCountry.Bronze],
          backgroundColor: ['gold', 'silver', '#cd7f32'],
          borderRadius: 8,
          datalabels: {
            align: 'end',
            anchor: 'end',
            color: '#000',
            font: {
              weight: 'bold',
              size: 14,
            },
            formatter: (value) => value, // Show values above each bar
          },
        },
      ],
    };
  };

  const createNoMedalData = () => {
    return {
      labels: ['🥇 Gold', '🥈 Silver', '🥉 Bronze'],
      datasets: [
        {
          label: 'No Medals :(',
          data: [0, 0, 0],
          backgroundColor: ['#e0e0e0', '#e0e0e0', '#e0e0e0'],
          borderRadius: 8,
        },
      ],
    };
  };

  const handleBarClick = (elements) => {
    if (elements.length > 0) {
      const clickedElementIndex = elements[0].index;
      const medalType = ['Gold', 'Silver', 'Bronze'][clickedElementIndex];
      const countryName = selectedCountry.properties.name;
  
      // Normalize the country name using the mapping
      const normalizedCountryName = countryNameMapping[countryName] || countryName;
  
      // Find the NOC using the normalized country name
      const noc = medalsData.find(
        (country) => country['Country Name'].toLowerCase() === normalizedCountryName.toLowerCase()
      )?.NOC;
  
      if (noc) {
        const medalists = fullData.filter((entry) => entry.NOC === noc && entry.medal_type === medalType);
  
        setMedalType(medalType);
        setSelectedMedalData(medalists);
        setShowMedalDetails(true);
      } else {
        console.error("No NOC found for the selected country");
      }
    }
  };
  

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
      datalabels: {
        display: true, // Show the medal counts above the bars
        color: '#000',
        font: {
          size: 16,
          weight: 'bold',
        },
        align: 'top',
      },
    },
    onClick: (event, elements) => handleBarClick(elements),
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Paris2024', // Apply custom font
            size: 20,
            weight: 'bold',
          },
          color: '#000',
        },
      },
      y: {
        grid: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
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
          setShowChart(false);
          setSelectedCountry(d);
        }}
        polygonsTransitionDuration={400}
      />

      {showChart && barData && (
        <div className="chart-container">
          <button className="close-button" onClick={() => setShowChart(false)}>X</button>
          <div className="chart-caption">
            <p>Select each bar for more details</p>
          </div>
          <Bar data={barData} options={options} />
          <div className="total-medals">
            <strong>Total Medals: {totalMedals}</strong>
          </div>
        </div>
      )}

      {showMedalDetails && (
        <MedalDetails
          medalType={medalType}
          selectedMedalData={selectedMedalData}
          onClose={() => setShowMedalDetails(false)}
        />
      )}
    </div>
  );
});

export default GlobeComponent;
