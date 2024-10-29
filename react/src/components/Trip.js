import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function Trip() {
  const { trip_id } = useParams(); // Get trip_id from URL
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marker, setMarker] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch trip data from the API
  const fetchTripData = async () => {
    try {
      const response = await fetch(`/api/trips/${trip_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use your auth token
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch trip data');
      }
      const data = await response.json();
      console.log(data);
      setTripData(data);
      setMarker({ lat: data.start_location_lat, lng: data.start_location_long });
    } catch (error) {
      console.error('Error fetching trip data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trip data when the component mounts
  useEffect(() => {
    fetchTripData();
  }, [trip_id]);

  // Callback function to handle adding to trip
  const handleAddToTrip = () => {
    // Add your logic for adding the location to the trip here
    setSuccessMessage('Location added to trip successfully!');

    // Clear the success message after some time
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
    // Close the popup after adding to the trip
    setShowPopup(false);
  };

  // Custom hook to handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setMarker(e.latlng); // Set marker position to where the map was clicked
        setShowPopup(true); // Show the popup
      },
    });
    return null;
  };

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">{tripData ? tripData.name : 'Loading...'}</h1>
        <p className="lead">{tripData ? tripData.description : 'Loading description...'}</p>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {loading ? (
        <p>Loading trip details...</p>
      ) : (
        <div className="row mb-4">
          <div className="col-md-12">
            <h3>Map</h3>
            <div className="map-container" style={{ height: '400px' }}>
              <MapContainer
                center={[marker ? marker.lat : 0, marker ? marker.lng : 0]} // Set center based on marker or default to (0,0)
                zoom={10}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
                {marker && showPopup && (
                  <Marker position={[marker.lat, marker.lng]}>
                    <Popup>
                      <div>
                        {/* <h5>Location</h5> */}
                        {/* <p>Latitude: {marker.lat}</p>
                        <p>Longitude: {marker.lng}</p> */}
                        <button className="btn btn-secondary" onClick={handleAddToTrip}>Add to Trip</button>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trip;
