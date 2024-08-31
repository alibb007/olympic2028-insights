import React, { useRef, useEffect } from 'react';

const MedalDetails = ({ medalType, selectedMedalData, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    const modal = modalRef.current;
    const onMouseDown = (e) => {
      let offsetX = e.clientX - modal.getBoundingClientRect().left;
      let offsetY = e.clientY - modal.getBoundingClientRect().top;

      const onMouseMove = (e) => {
        modal.style.left = `${e.clientX - offsetX}px`;
        modal.style.top = `${e.clientY - offsetY}px`;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    modal.addEventListener('mousedown', onMouseDown);

    return () => {
      modal.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  return (
    <div ref={modalRef} className="medal-details">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>{medalType} Medalists</h2>
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
          {selectedMedalData && selectedMedalData.length > 0 ? (
            selectedMedalData.map((medalist, index) => (
              <tr key={index}>
                <td>{medalist.name}</td>
                <td>{medalist.discipline}</td>
                <td>{medalist.event}</td>
                <td>{medalist.medal_date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MedalDetails;
