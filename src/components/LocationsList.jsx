import React from 'react';

const LocationsList = ({ locations, selectedLocation, selectLocation, removeLocation }) => {
  if (locations.length === 0) {
    return (
      <div className="locations-list">
        <h2>Saved Locations</h2>
        <p>No locations saved yet. Search for a location or click on the map to add one.</p>
      </div>
    );
  }
  
  return (
    <div className="locations-list">
      <h2>Saved Locations</h2>
      <ul>
        {locations.map(location => (
          <li 
            key={location.id} 
            className={selectedLocation && selectedLocation.id === location.id ? 'selected' : ''}
            onClick={() => selectLocation(location.id)}
          >
            <div className="location-info">
              <h3>{location.name}</h3>
              {location.description && <p>{location.description}</p>}
              <p className="coordinates">
                {location.position.lat.toFixed(4)}, {location.position.lng.toFixed(4)}
              </p>
            </div>
            <button 
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeLocation(location.id);
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationsList;
