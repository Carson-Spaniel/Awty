import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import TripForm from '../components/TripForm'; // Import the TripForm component

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function Trips() {
  const [marker, setMarker] = useState(null); // Store a single marker
  const [popupInfo, setPopupInfo] = useState(null); // Store popup info
  const [showForm, setShowForm] = useState(false); // State to control modal visibility
  const [initialLocation, setInitialLocation] = useState(null); // Store initial location for TripForm

  // Function to handle adding a marker to the map
  function AddMarkerOnClick() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        // Update the state with the new marker and show the popup
        setMarker({ lat, lng });
        setPopupInfo({ lat, lng });
        setInitialLocation(`${lat}, ${lng}`); // Set initial location for TripForm
      },
    });
    return null;
  }

  // Handler for creating a trip
  const handleCreateTrip = () => {
    // Open the TripForm modal
    setShowForm(true);
  };

  // Callback function to close the form
  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Callback function to handle successful trip submission
  const handleTripSubmit = (tripData) => {
    console.log('New trip created:', tripData);
    // Here you might want to update the trips list or handle it further
  };

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Trips</h1>
        <p className="lead">Plan and manage your trips with ease!</p>
        <Link className="btn btn-primary btn-lg" to="/trips">View Trips</Link>
      </div>

      <div className="mt-4">
        <h2>Map</h2>
        <div className="map-container mb-4" style={{ position: 'relative', borderRadius: '5px' }}>
          <MapContainer
            center={[39.8283, -98.5795]} // Centered on the United States
            zoom={4}
            style={{ height: "500px", width: "100%", borderRadius: '5px' }}
            className="shadow-lg" // Bootstrap shadow for depth
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <AddMarkerOnClick />
            {marker && ( // Check if a marker exists
              <Marker position={[marker.lat, marker.lng]}>
                <Popup onClose={() => setPopupInfo(null)}>
                  <div className="p-2">
                    <h5 className="font-weight-bold">Marker Coordinates</h5>
                    <p>Latitude: {marker.lat}</p>
                    <p>Longitude: {marker.lng}</p>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-success" onClick={handleCreateTrip}>Create Trip</button>
                      <button className="btn btn-secondary" onClick={() => {/* Your add to trip logic */}}>Add to Trip</button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>

      {showForm && ( // Conditionally render the TripForm
        <TripForm
          onClose={handleCloseForm} 
          onSubmit={handleTripSubmit}
          initialLocation={initialLocation}
        />
      )}
    </div>
  );
}

export default Trips;
