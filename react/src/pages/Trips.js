import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import TripForm from '../components/TripForm'; // Import the TripForm component
import { Dropdown, Button } from 'react-bootstrap'; // Import necessary Bootstrap components

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function Trips() {
  const [marker, setMarker] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [initialLocation, setInitialLocation] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [trips, setTrips] = useState([]); // State to hold trips
  const [loading, setLoading] = useState(true); // State for loading status
  const [sortBy, setSortBy] = useState('created_at'); // Default sort by creation time
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort order

  // Fetch trips from the API
  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use your auth token
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      const data = await response.json();
      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trips when the component mounts
  useEffect(() => {
    fetchTrips();
  }, []);

  // Function to handle adding a marker to the map
  function AddMarkerOnClick() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker({ lat, lng });
        setPopupInfo({ lat, lng });
        setInitialLocation(`${lat}, ${lng}`);
      },
    });
    return null;
  }

  // Handler for creating a trip
  const handleCreateTrip = () => {
    setShowForm(true);
  };

  // Callback function to close the form
  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Callback function to handle successful trip submission
  const handleTripSubmit = (tripData) => {
    console.log('New trip created:', tripData);
    setSuccessMessage('Trip created successfully!');
    
    // Refresh trips after creating a new trip
    fetchTrips();

    // Clear the success message after some time
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Sort trips based on the selected criteria and order
  const sortedTrips = [...trips].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'created_at') {
      comparison = new Date(a.created_at) - new Date(b.created_at);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Trips</h1>
        <p className="lead">Plan and manage your trips with ease!</p>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* Sort Selection */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Sort by: {sortBy === 'name' ? 'Name' : 'Creation Date'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortBy('name')}>Name</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy('created_at')}>Creation Date</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </Button>
      </div>

      <Button variant="primary" onClick={fetchTrips} className="mb-3">
        Refresh Trips
      </Button>

      {loading ? (
        <p>Loading trips...</p>
      ) : trips.length === 0 ? (
        <div className="alert alert-info">No trips available. Click on the map and create a new trip!</div>
      ) : (
        <div className="row">
          {sortedTrips.map((trip) => (
            <Link
              to={`/trips/${trip.id}`}
              className="text-decoration-none text-reset"
              key={trip.id}
            >
              <div className="card mb-3 shadow-sm hover-shadow">
                <div className="card-body">
                  <h5 className="card-title">{trip.name}</h5>
                  <p className="card-text">Created on: {formatDate(trip.created_at)}</p>
                  <p className="card-text"><small className="text-muted">Trip ID: {trip.id}</small></p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4">
        <h2>Map</h2>
        <div className="map-container mb-4" style={{ position: 'relative', borderRadius: '5px' }}>
          <MapContainer
            center={[39.8283, -98.5795]}
            zoom={4}
            style={{ height: "500px", width: "100%", borderRadius: '5px' }}
            className="shadow-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <AddMarkerOnClick />
            {marker && (
              <Marker position={[marker.lat, marker.lng]}>
                <Popup onClose={() => setPopupInfo(null)}>
                  <div className="p-2">
                    {/* <h5 className="font-weight-bold">Marker Coordinates</h5> */}
                    {/* <p>Latitude: {marker.lat}</p>
                    <p>Longitude: {marker.lng}</p> */}
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

      {showForm && (
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
