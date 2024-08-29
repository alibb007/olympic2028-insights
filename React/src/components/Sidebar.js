import React from 'react';
import { FaHome, FaChartBar, FaTachometerAlt, FaProjectDiagram } from 'react-icons/fa';
import '../App.css'; // Ensure that this import is at the top

const Sidebar = () => {
  return (
    <div className="sidebar"> {/* Use "sidebar" as the className */}
      <ul>
        <li>
          <FaHome className="icon" />
          <div className="text">Home</div>
        </li>
        <li>
          <FaChartBar className="icon" />
          <div className="text">Summary</div>
        </li>
        <li>
          <FaTachometerAlt className="icon" />
          <div className="text">Dashboard</div>
        </li>
        <li>
          <FaProjectDiagram className="icon" />
          <div className="text">Prediction</div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
