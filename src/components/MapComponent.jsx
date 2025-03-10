import React, { useEffect, useRef } from 'react';




const MapComponent = ({ center, markers, selectedMarker, onMarkerClick, onMapClick }) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const VITE_API_MAP_KEY = import.meta.env.VITE_API_MAP_KEY;
  
  // Initialize Google Maps
  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsAPI = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${VITE_API_MAP_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };
    
    // Initialize the map
    const initializeMap = () => {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        streetViewControl: true,
        mapTypeControl: true
      });
      
      // Add click listener to the map
      googleMapRef.current.addListener('click', onMapClick);
    };
    
    if (!window.google) {
      loadGoogleMapsAPI();
    } else {
      initializeMap();
    }
    
    return () => {
      // Clean up event listeners if needed
      if (googleMapRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(googleMapRef.current);
      }
    };
  }, []);
  
  // Update center when it changes
  useEffect(() => {
    if (googleMapRef.current && window.google) {
      googleMapRef.current.setCenter(center);
    }
  }, [center]);
  
  // Update markers when they change
  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    if (!googleMapRef.current || !window.google) return;
    
    // Create new markers
    markers.forEach(markerData => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: googleMapRef.current,
        title: markerData.name,
        animation: selectedMarker && markerData.id === selectedMarker.id 
          ? window.google.maps.Animation.BOUNCE 
          : null
      });
      
      // Add click listener to marker
      marker.addListener('click', () => onMarkerClick(markerData.id));
      
      // Store reference to marker
      markersRef.current.push(marker);
      
      // Add info window if this is the selected marker
      if (selectedMarker && markerData.id === selectedMarker.id) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${markerData.name}</strong>${markerData.description ? `<p>${markerData.description}</p>` : ''}</div>`
        });
        infoWindow.open(googleMapRef.current, marker);
      }
    });
  }, [markers, selectedMarker]);
  
  return <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default MapComponent;