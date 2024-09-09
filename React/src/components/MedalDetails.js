import React, { useRef, useEffect } from 'react';

const MedalDetails = ({ medalType, selectedMedalData, totalMedals, onClose }) => {
  const modalRef = useRef();
  const wrapperRef = useRef(); // Wrapper to detect outside clicks

  useEffect(() => {
    const modal = modalRef.current;

    const onMouseDown = (e) => {
      const offsetX = e.clientX - modal.getBoundingClientRect().left;
      const offsetY = e.clientY - modal.getBoundingClientRect().top;

      const onMouseMove = (e) => {
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        // Ensure the modal stays within the bounds of the window
        modal.style.left = `${Math.max(0, Math.min(newX, window.innerWidth - modal.offsetWidth))}px`;
        modal.style.top = `${Math.max(0, Math.min(newY, window.innerHeight - modal.offsetHeight))}px`;
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={wrapperRef} className="modal-wrapper">
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
              <th>Language</th>
              <th>birth_country</th>
              <th>residence_country</th>
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
                  <td>{medalist.language}</td>
                  <td>{medalist.birth_country}</td>
                  <td>{medalist.residence_country}</td>
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
    </div>
  );
};

export default MedalDetails;
