import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import * as turf from '@turf/turf';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';

const GlobeComponent = forwardRef(({ countries, medalData }, ref) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [barData, setBarData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const globeEl = React.useRef();

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
            setShowChart(true);
          } else {
            setBarData(createNoMedalData());
            setShowChart(true);
          }
        }, 2000);
      }
    }
  }, [selectedCountry, countries]);

  useImperativeHandle(ref, () => ({
    focusOnCountry(country) {
      setShowChart(false);
      setSelectedCountry(country);
    },
  }));

  const getMedalData = (countryName) => {
    return medalData.find(
      (country) => country['Country Name'].toLowerCase() === countryName.toLowerCase()
    );
  };

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
            display: true, // Ensure datalabels are always displayed
            color: '#000',
            anchor: 'end',
            align: 'start',
            offset: -10,
            font: {
              weight: 'bold',
              size: 14,
            },
            formatter: function (value) {
              return value;
            },
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
          datalabels: {
            display: true, // Ensure datalabels are always displayed
            color: '#000',
            anchor: 'end',
            align: 'start',
            offset: -10,
            font: {
              weight: 'bold',
              size: 14,
            },
            formatter: (value) => value === 0 ? 'No Medals :(' : value,
          },
        },
      ],
    };
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
        display: true, // Ensure datalabels are always displayed
        anchor: 'end',
        align: 'start',
        color: '#000',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: function (value) {
          return value;
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
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
          <div style="font-family: 'Arial Black', sans-serif; color: white;">
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
          <Bar data={barData} options={options} />
        </div>
      )}
    </div>
  );
});

export default GlobeComponent;
