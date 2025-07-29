import { GameLocation } from "../types";

// Game Locations in the Quad Cities Metropolitan Area - Primary Locations Only
export const gameLocations: GameLocation[] = [
  // Primary Davenport locations with red markers
  {
    id: "loc-25",
    name: "Junge Park",
    address: "3250 Western Avenue, Davenport, IA 52803",
    city: "Davenport",
    state: "IA",
    zipCode: "52803",
    coordinates: {
      lat: 41.55526369651487,
      lng: -90.57899561557102,
    },
    facilities: [
      "Baseball Diamonds",
      "Softball Fields",
      "Recreation Center",
      "Playground",
    ],
    fieldType: "grass",
    parking: true,
    restrooms: true,
    waterFountains: true,
    markerColor: "red",
  },
  {
    id: "loc-26",
    name: "Prairie Heights Park",
    address: "5600 Eastern Avenue, Davenport, IA 52807",
    city: "Davenport",
    state: "IA",
    zipCode: "52807",
    coordinates: {
      lat: 41.5780989969504,
      lng: -90.55507216824395,
    },
    facilities: [
      "Baseball Complex",
      "Softball Diamonds",
      "Sports Complex",
      "Concessions",
    ],
    fieldType: "grass",
    parking: true,
    restrooms: true,
    waterFountains: true,
    markerColor: "red",
  },
];

// Helper functions for location management
export const getLocationById = (
  locationId: string
): GameLocation | undefined => {
  return gameLocations.find(location => location.id === locationId);
};

export const getLocationsByFieldType = (
  fieldType: string
): GameLocation[] => {
  return gameLocations.filter(location => location.fieldType === fieldType);
};

export const getLocationsWithWaterFountains = (): GameLocation[] => {
  return gameLocations.filter(location => location.waterFountains);
};

export const getLocationsByFacility = (facility: string): GameLocation[] => {
  return gameLocations.filter(location =>
    location.facilities.some(f =>
      f.toLowerCase().includes(facility.toLowerCase())
    )
  );
};