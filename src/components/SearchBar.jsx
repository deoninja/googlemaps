import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ addLocation, setMapCenter }) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  
  // Initialize autocomplete on mount
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps Places API not loaded");
      return;
    }
    
    // Create the autocomplete instance
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode', 'establishment']
    });
    
    // Handle place selection
    const placeChangedListener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      
      if (!place.geometry || !place.geometry.location) {
        console.warn("Place selected has no geometry");
        return;
      }
      
      const position = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      
      // Add location to list
      addLocation({
        name: place.name || place.formatted_address || 'Selected Location',
        position,
        description: place.formatted_address || ''
      });
      
      // Center map on this location
      setMapCenter(position);
      
      // Clear search field
      setSearch('');
    });
    
    // Clean up
    return () => {
      if (autocompleteRef.current && window.google && window.google.maps) {
        window.google.maps.event.removeListener(placeChangedListener);
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [addLocation, setMapCenter]);
  
  // Prevent form submission on Enter key
  const handleSubmit = (e) => {
    e.preventDefault();
    return false;
  };
  
  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search for a location"
      />
    </form>
  );
};

export default SearchBar;