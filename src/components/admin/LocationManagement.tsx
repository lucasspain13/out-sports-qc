import React, { useEffect, useState } from "react";
import { locationsApi } from "../../lib/database";
import {
  getErrorActionSuggestion,
  parseSupabaseError,
} from "../../lib/errorHandling";
import { supabase } from "../../lib/supabase";
import { GameLocation } from "../../types";
import { AdminErrorBanner } from "./AdminErrorBanner";

interface LocationFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  facilities: string[];
  fieldType: "grass" | "turf" | "indoor" | "court";
  capacity?: number;
  parking: boolean;
  restrooms: boolean;
  concessions: boolean;
}

export const LocationManagement: React.FC = () => {
  const [locations, setLocations] = useState<GameLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorActionSuggestion, setErrorActionSuggestion] = useState<
    string | null
  >(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<GameLocation | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<LocationFormData>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: 0,
    longitude: 0,
    facilities: [],
    fieldType: "grass",
    capacity: undefined,
    parking: false,
    restrooms: false,
    concessions: false,
  });

  const facilityOptions = [
    "Parking",
    "Concessions",
    "Bleachers",
    "Scoreboard",
    "Water Fountains",
    "Picnic Area",
    "Indoor Courts",
    "Locker Rooms",
    "Vending Machines",
    "Basketball Courts",
    "Snack Bar",
    "Equipment Storage",
    "Multiple Fields",
    "Playground",
    "Artificial Turf",
    "Pro Shop",
    "Lighting",
    "Sound System",
    "Air Conditioning",
    "Harbor View",
    "Picnic Tables",
  ];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const locationsData = await locationsApi.getAll();
      setLocations(locationsData);
      // Clear any previous errors
      setError(null);
      setErrorActionSuggestion(null);
    } catch (err) {
      const errorMessage = parseSupabaseError(err);
      const actionSuggestion = getErrorActionSuggestion(err);
      setError(errorMessage);
      setErrorActionSuggestion(actionSuggestion);
      console.error("Locations fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const locationData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        facilities: formData.facilities,
        field_type: formData.fieldType,
        capacity: formData.capacity || null,
        parking: formData.parking,
        restrooms: formData.restrooms,
        concessions: formData.concessions,
      };

      if (editingLocation) {
        // Update existing location
        const { error } = await supabase
          .from("locations")
          .update(locationData)
          .eq("id", editingLocation.id);

        if (error) throw error;
      } else {
        // Create new location
        const { error } = await supabase
          .from("locations")
          .insert([locationData]);

        if (error) throw error;
      }

      await fetchLocations();
      resetForm();
    } catch (err) {
      const errorMessage = parseSupabaseError(err);
      const actionSuggestion = getErrorActionSuggestion(err);
      setError(
        `Failed to ${
          editingLocation ? "update" : "create"
        } location: ${errorMessage}`
      );
      setErrorActionSuggestion(actionSuggestion);
      console.error("Location save error:", err);
    }
  };

  const handleEdit = (location: GameLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      city: "", // These would need to be parsed from address or stored separately
      state: "",
      zipCode: "",
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
      facilities: location.facilities,
      fieldType: location.fieldType,
      capacity: location.capacity,
      parking: location.parking,
      restrooms: location.restrooms,
      concessions: location.concessions,
    });
    setShowForm(true);
  };

  const handleDelete = async (locationId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this location? This may affect scheduled games."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("locations")
        .delete()
        .eq("id", locationId);

      if (error) throw error;

      await fetchLocations();
      // Clear any previous errors on successful deletion
      setError(null);
      setErrorActionSuggestion(null);
    } catch (err) {
      const errorMessage = parseSupabaseError(err);
      const actionSuggestion = getErrorActionSuggestion(err);
      setError(`Failed to delete location: ${errorMessage}`);
      setErrorActionSuggestion(actionSuggestion);
      console.error("Location delete error:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: 0,
      longitude: 0,
      facilities: [],
      fieldType: "grass",
      capacity: undefined,
      parking: false,
      restrooms: false,
      concessions: false,
    });
    setEditingLocation(null);
    setShowForm(false);
    setError(null);
    setErrorActionSuggestion(null);
  };

  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const filteredLocations = locations.filter(
    location =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFieldTypeColor = (fieldType: string) => {
    const colors = {
      grass: "bg-green-100 text-green-800",
      turf: "bg-blue-100 text-blue-800",
      indoor: "bg-purple-100 text-purple-800",
      court: "bg-orange-100 text-orange-800",
    };
    return (
      colors[fieldType as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Location Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Location
        </button>
      </div>

      <AdminErrorBanner
        error={error}
        actionSuggestion={errorActionSuggestion}
        onDismiss={() => {
          setError(null);
          setErrorActionSuggestion(null);
        }}
      />

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <input
          type="text"
          placeholder="Search locations..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredLocations.map(location => (
          <div
            key={location.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {location.name}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getFieldTypeColor(
                    location.fieldType
                  )}`}
                >
                  {location.fieldType}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3">{location.address}</p>

              {location.capacity && (
                <p className="text-sm text-gray-500 mb-3">
                  Capacity: {location.capacity}
                </p>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Facilities:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {location.facilities.slice(0, 3).map((facility, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {facility}
                    </span>
                  ))}
                  {location.facilities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{location.facilities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex space-x-3">
                  {location.parking && <span>🅿️ Parking</span>}
                  {location.concessions && <span>🍿 Concessions</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(location)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(location.id)}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No locations found matching your search.
          </p>
        </div>
      )}

      {/* Location Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingLocation ? "Edit Location" : "Add New Location"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={e =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={e =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Type
                  </label>
                  <select
                    value={formData.fieldType}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        fieldType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="grass">Grass</option>
                    <option value="turf">Turf</option>
                    <option value="indoor">Indoor</option>
                    <option value="court">Court</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        latitude: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        longitude: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity (optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity || ""}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Amenities
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.parking}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            parking: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Parking
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.concessions}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            concessions: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Concessions
                    </label>
                  </div>
                </div>

                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Facilities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded p-3">
                    {facilityOptions.map(facility => (
                      <label
                        key={facility}
                        className="flex items-center text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityToggle(facility)}
                          className="mr-2"
                        />
                        {facility}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingLocation ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
