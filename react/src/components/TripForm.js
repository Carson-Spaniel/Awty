import React, { useState } from 'react';

const TripForm = ({ onClose, onSubmit, initialLocation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startLocation, setStartLocation] = useState(initialLocation);
  const [endLocation, setEndLocation] = useState('');
  const [error, setError] = useState(''); // State to hold error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tripData = {
      name,
      description,
      start_location: startLocation,
      end_location: endLocation,
    };

    console.log('Trip data being submitted:', tripData);

    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('/api/trips/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Capture response text
        console.error('Response error:', errorText); // Log the error
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Trip created:', result);

      // Call the onSubmit callback passed from Trips component
      onSubmit(result); 
      onClose(); // Close the form after successful submission
    } catch (error) {
      console.error('Error creating trip:', error);
      setError('Failed to create trip. Please try again.'); // Update the error state
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block', background: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Trip</h5>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Location (Lat, Lng)</label>
                <input
                  type="text"
                  className="form-control"
                  value={startLocation}
                  readOnly // Make it read-only since it's set by marker
                />
              </div>
              <div className="form-group">
                <label>End Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripForm;
