import React, { useState, useEffect } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import LocationsList from './components/LocationsList';

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  
  // Initialize Google Maps API
  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsAPI = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsLoaded(true);
      document.head.appendChild(script);
    };
    
    if (!window.google) {
      loadGoogleMapsAPI();
    } else {
      setGoogleMapsLoaded(true);
    }
  }, []);
  
  // Add a new location to the list
  const addLocation = (location) => {
    const newLocation = {
      id: Date.now(),
      name: location.name || 'Unnamed Location',
      position: location.position,
      description: location.description || ''
    };
    setLocations([...locations, newLocation]);
  };
  
  // Select a location and center the map on it
  const selectLocation = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setMapCenter(location.position);
    }
  };
  
  // Remove a location from the list
  const removeLocation = (locationId) => {
    setLocations(locations.filter(loc => loc.id !== locationId));
    if (selectedLocation && selectedLocation.id === locationId) {
      setSelectedLocation(null);
    }
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>My Google Maps App</h1>
      </header>
      <main className="app-main">
        <div className="sidebar">
          {googleMapsLoaded && (
            <SearchBar 
              addLocation={addLocation} 
              setMapCenter={setMapCenter} 
            />
          )}
          <LocationsList 
            locations={locations} 
            selectedLocation={selectedLocation}
            selectLocation={selectLocation}
            removeLocation={removeLocation}
          />
        </div>
        <div className="map-container">
          <MapComponent 
            center={mapCenter}
            markers={locations}
            selectedMarker={selectedLocation}
            onMarkerClick={selectLocation}
            onMapClick={(e) => {
              const position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
              addLocation({ 
                name: `Location at ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`,
                position
              });
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;