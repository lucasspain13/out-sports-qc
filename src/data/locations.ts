import { GameLocation } from "../types";

// Game Locations around a metropolitan area
export const gameLocations: GameLocation[] = [
  {
    id: "loc-1",
    name: "Riverside Sports Complex",
    address: "1250 Riverside Drive, Metro City, MC 12345",
    coordinates: {
      lat: 40.7589,
      lng: -73.9851,
    },
    facilities: [
      "Parking",
      "Restrooms",
      "Concessions",
      "Bleachers",
      "Scoreboard",
    ],
    fieldType: "grass",
    capacity: 200,
    parking: true,
    restrooms: true,
    concessions: true,
  },
  {
    id: "loc-2",
    name: "Central Park Athletic Fields",
    address: "789 Park Avenue, Metro City, MC 12346",
    coordinates: {
      lat: 40.7614,
      lng: -73.9776,
    },
    facilities: ["Parking", "Restrooms", "Water Fountains", "Picnic Area"],
    fieldType: "turf",
    capacity: 150,
    parking: true,
    restrooms: true,
    concessions: false,
  },
  {
    id: "loc-3",
    name: "Metro Community Center",
    address: "456 Community Lane, Metro City, MC 12347",
    coordinates: {
      lat: 40.7505,
      lng: -73.9934,
    },
    facilities: [
      "Indoor Courts",
      "Parking",
      "Restrooms",
      "Locker Rooms",
      "Vending Machines",
    ],
    fieldType: "indoor",
    capacity: 100,
    parking: true,
    restrooms: true,
    concessions: false,
  },
  {
    id: "loc-4",
    name: "Westside Recreation Center",
    address: "321 West Street, Metro City, MC 12348",
    coordinates: {
      lat: 40.7648,
      lng: -73.9808,
    },
    facilities: [
      "Basketball Courts",
      "Parking",
      "Restrooms",
      "Snack Bar",
      "Equipment Storage",
    ],
    fieldType: "court",
    capacity: 80,
    parking: true,
    restrooms: true,
    concessions: true,
  },
  {
    id: "loc-5",
    name: "Northside Athletic Park",
    address: "987 North Boulevard, Metro City, MC 12349",
    coordinates: {
      lat: 40.7731,
      lng: -73.9712,
    },
    facilities: [
      "Multiple Fields",
      "Parking",
      "Restrooms",
      "Concessions",
      "Playground",
    ],
    fieldType: "grass",
    capacity: 250,
    parking: true,
    restrooms: true,
    concessions: true,
  },
  {
    id: "loc-6",
    name: "Eastside Sports Hub",
    address: "654 East Avenue, Metro City, MC 12350",
    coordinates: {
      lat: 40.7542,
      lng: -73.9623,
    },
    facilities: [
      "Artificial Turf",
      "Parking",
      "Restrooms",
      "Pro Shop",
      "Lighting",
    ],
    fieldType: "turf",
    capacity: 180,
    parking: true,
    restrooms: true,
    concessions: true,
  },
  {
    id: "loc-7",
    name: "Southside Gymnasium",
    address: "147 South Road, Metro City, MC 12351",
    coordinates: {
      lat: 40.7456,
      lng: -73.9889,
    },
    facilities: [
      "Indoor Gym",
      "Parking",
      "Restrooms",
      "Sound System",
      "Air Conditioning",
    ],
    fieldType: "indoor",
    capacity: 120,
    parking: true,
    restrooms: true,
    concessions: false,
  },
  {
    id: "loc-8",
    name: "Harbor View Courts",
    address: "258 Harbor Street, Metro City, MC 12352",
    coordinates: {
      lat: 40.7398,
      lng: -74.006,
    },
    facilities: [
      "Outdoor Courts",
      "Parking",
      "Restrooms",
      "Harbor View",
      "Picnic Tables",
    ],
    fieldType: "court",
    capacity: 90,
    parking: true,
    restrooms: true,
    concessions: false,
  },
];

// Helper functions for location data
export const getLocationById = (
  locationId: string
): GameLocation | undefined => {
  return gameLocations.find(location => location.id === locationId);
};

export const getLocationsByFieldType = (
  fieldType: GameLocation["fieldType"]
): GameLocation[] => {
  return gameLocations.filter(location => location.fieldType === fieldType);
};

export const getLocationsWithConcessions = (): GameLocation[] => {
  return gameLocations.filter(location => location.concessions);
};

export const getLocationsByCapacity = (minCapacity: number): GameLocation[] => {
  return gameLocations.filter(
    location => (location.capacity || 0) >= minCapacity
  );
};
