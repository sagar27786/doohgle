import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

interface MapPickerProps {
  onMapSelect: (coords: { lat: number; lng: number }) => void;
  selectedLocation: { lat: number; lng: number } | null;
}

const MapPicker: React.FC<MapPickerProps> = ({ onMapSelect, selectedLocation }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      onMapSelect({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={selectedLocation || center}
      zoom={selectedLocation ? 15 : 10}
      onClick={handleMapClick}
    >
      {selectedLocation && <Marker position={selectedLocation} />}
    </GoogleMap>
  ) : <></>;
};

export default MapPicker;