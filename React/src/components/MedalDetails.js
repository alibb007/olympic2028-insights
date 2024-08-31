import React from 'react';

const MedalDetails = ({ medalType, medalData, onClose }) => {
  return (
    <div className="medal-details">
      <button className="close-button" onClick={onClose}>X</button>
      <h3>{medalType} Medalists</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Discipline</th>
            <th>Event</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {medalData.map((medal, index) => (
            <tr key={index}>
              <td>{medal.name}</td>
              <td>{medal.discipline}</td>
              <td>{medal.event}</td>
              <td>{medal.medal_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedalDetails;
