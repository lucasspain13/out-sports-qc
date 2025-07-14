import { Icon, LatLngBounds } from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { LocationMapProps } from "../../types";

// Custom marker icon
const createCustomIcon = (color: string = "#4ecdc4") => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

// Component to fit map bounds when locations change
const FitBounds: React.FC<{ locations: LocationMapProps["locations"] }> = ({
  locations,
}) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;

    if (locations.length === 1) {
      // Single location - center on it
      const location = locations[0];
      map.setView([location.coordinates.lat, location.coordinates.lng], 15);
    } else {
      // Multiple locations - fit bounds
      const bounds = new LatLngBounds(
        locations.map(loc => [loc.coordinates.lat, loc.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [locations, map]);

  return null;
};

const LocationMap: React.FC<LocationMapProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  height = "400px",
  showAllMarkers = true,
}) => {
  const [mapReady, setMapReady] = useState(false);

  // Default center (first location or fallback)
  const defaultCenter =
    locations.length > 0
      ? ([locations[0].coordinates.lat, locations[0].coordinates.lng] as [
          number,
          number
        ])
      : ([40.7589, -73.9851] as [number, number]); // Fallback to NYC

  const getMarkerColor = (locationId: string) => {
    if (selectedLocation && selectedLocation.id === locationId) {
      return "#ff6b35"; // Orange for selected
    }
    return "#4ecdc4"; // Teal for default
  };

  const getExternalMapUrl = (location: LocationMapProps["locations"][0]) => {
    const { lat, lng } = location.coordinates;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  const displayLocations = showAllMarkers
    ? locations
    : selectedLocation
    ? [selectedLocation]
    : locations;

  return (
    <div className="w-full" style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg overflow-hidden shadow-lg"
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapReady && <FitBounds locations={displayLocations} />}

        {displayLocations.map(location => (
          <Marker
            key={location.id}
            position={[location.coordinates.lat, location.coordinates.lng]}
            icon={createCustomIcon(getMarkerColor(location.id))}
            eventHandlers={{
              click: () => {
                if (onLocationSelect) {
                  onLocationSelect(location);
                }
              },
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-64">
                {/* Location Header */}
                <div className="mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {location.name}
                  </h3>
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>

                {/* Field Type and Capacity */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {location.fieldType.charAt(0).toUpperCase() +
                        location.fieldType.slice(1)}
                    </span>
                    {location.capacity && (
                      <span className="text-xs text-gray-500">
                        Capacity: {location.capacity}
                      </span>
                    )}
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Facilities
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {location.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amenities Icons */}
                <div className="flex items-center space-x-4 mb-3 text-sm">
                  <div
                    className={`flex items-center space-x-1 ${
                      location.parking ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Parking</span>
                  </div>
                  <div
                    className={`flex items-center space-x-1 ${
                      location.restrooms ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Restrooms</span>
                  </div>
                  <div
                    className={`flex items-center space-x-1 ${
                      location.concessions ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Concessions</span>
                  </div>
                </div>

                {/* External Map Link */}
                <div className="pt-2 border-t border-gray-200">
                  <a
                    href={getExternalMapUrl(location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Get Directions</span>
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
