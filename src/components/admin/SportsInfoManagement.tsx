import React, { useEffect, useState } from "react";
import { sportsInfoApi, type SportsInfo } from "../../lib/contentManagement";

interface SportsInfoManagementProps {
  onNavigate?: (page: string) => void;
}

export const SportsInfoManagement: React.FC<SportsInfoManagementProps> = () => {
  const [sportsInfos, setSportsInfos] = useState<SportsInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSport, setEditingSport] = useState<SportsInfo | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    gradient: "orange",
    participants: 0,
    nextGame: "",
    features: [""],
    totalTeams: 0,
    rosterPath: "",
    comingSoon: false,
    isActive: true,
  });

  useEffect(() => {
    fetchSportsInfos();
  }, []);

  const fetchSportsInfos = async () => {
    try {
      setLoading(true);
      const data = await sportsInfoApi.getAll();
      setSportsInfos(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load sports information"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      description: "",
      gradient: "orange",
      participants: 0,
      nextGame: "",
      features: [""],
      totalTeams: 0,
      rosterPath: "",
      comingSoon: false,
      isActive: true,
    });
    setEditingSport(null);
    setIsCreateMode(false);
  };

  const handleEdit = (sport: SportsInfo) => {
    setFormData({
      name: sport.name,
      title: sport.title,
      description: sport.description,
      gradient: sport.gradient,
      participants: sport.participants,
      nextGame: sport.nextGame
        ? sport.nextGame instanceof Date
          ? sport.nextGame.toISOString().split("T")[0]
          : sport.nextGame
        : "",
      features: sport.features.length > 0 ? sport.features : [""],
      totalTeams: sport.totalTeams,
      rosterPath: sport.rosterPath || "",
      comingSoon: sport.comingSoon,
      isActive: sport.isActive,
    });
    setEditingSport(sport);
    setIsCreateMode(false);
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ""),
        nextGame: formData.nextGame ? new Date(formData.nextGame) : undefined,
      };

      if (editingSport) {
        await sportsInfoApi.update(editingSport.id, dataToSave);
      } else {
        await sportsInfoApi.create(dataToSave);
      }
      await fetchSportsInfos();
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save sports information"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sports information?"))
      return;
    try {
      await sportsInfoApi.delete(id);
      await fetchSportsInfos();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete sports information"
      );
    }
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures.length > 0 ? newFeatures : [""],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const gradientOptions = [
    {
      value: "orange",
      label: "Orange",
      color: "from-orange-500 to-orange-600",
    },
    { value: "green", label: "Green", color: "from-green-500 to-green-600" },
    { value: "blue", label: "Blue", color: "from-blue-500 to-blue-600" },
    {
      value: "pink",
      label: "Pink",
      color: "from-pink-500 to-pink-600",
    },
    {
      value: "white",
      label: "White",
      color: "from-gray-200 to-gray-300",
    },
    {
      value: "black",
      label: "Black",
      color: "from-gray-800 to-gray-900",
    },
    {
      value: "gray",
      label: "Gray",
      color: "from-gray-500 to-gray-600",
    },
    {
      value: "brown",
      label: "Brown",
      color: "from-amber-700 to-amber-800",
    },
    {
      value: "purple",
      label: "Purple",
      color: "from-purple-500 to-purple-600",
    },
    {
      value: "yellow",
      label: "Yellow",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      value: "red",
      label: "Red",
      color: "from-red-500 to-red-600",
    },
    {
      value: "cyan",
      label: "Cyan",
      color: "from-cyan-400 to-cyan-500",
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-8">Loading sports information...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Sports Information Management
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setIsCreateMode(true);
              resetForm();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Sport
          </button>
        </div>

        {/* Create/Edit Form */}
        {(isCreateMode || editingSport) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingSport
                ? "Edit Sports Information"
                : "Create New Sports Information"}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sport Name (lowercase key) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        name: e.target.value.toLowerCase(),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="kickball"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kickball League"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gradient Theme
                  </label>
                  <select
                    value={formData.gradient}
                    onChange={e =>
                      setFormData({ ...formData, gradient: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {gradientOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`mt-2 h-6 bg-gradient-to-r ${
                      gradientOptions.find(o => o.value === formData.gradient)
                        ?.color
                    } rounded`}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Participants
                    </label>
                    <input
                      type="number"
                      value={formData.participants}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          participants: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Teams
                    </label>
                    <input
                      type="number"
                      value={formData.totalTeams}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          totalTeams: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Game Date
                  </label>
                  <input
                    type="date"
                    value={formData.nextGame}
                    onChange={e =>
                      setFormData({ ...formData, nextGame: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roster Path
                  </label>
                  <input
                    type="text"
                    value={formData.rosterPath}
                    onChange={e =>
                      setFormData({ ...formData, rosterPath: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#summer-kickball-teams"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sport-coming-soon"
                      checked={formData.comingSoon}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          comingSoon: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="sport-coming-soon"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Coming Soon (show as coming soon instead of active)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sport-active"
                      checked={formData.isActive}
                      onChange={e =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="sport-active"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Active (visible on site)
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe this sport, its format, and what makes it special..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={e => updateFeature(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Feature description"
                        />
                        {formData.features.length > 1 && (
                          <button
                            onClick={() => removeFeature(index)}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addFeature}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                    >
                      Add Feature
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={
                  !formData.name || !formData.title || !formData.description
                }
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {editingSport ? "Update" : "Create"}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Sports List */}
        <div className="space-y-4">
          {sportsInfos.map(sport => {
            const gradientInfo = gradientOptions.find(
              g => g.value === sport.gradient
            );

            return (
              <div
                key={sport.id}
                className={`bg-white border border-gray-200 rounded-lg p-6 ${
                  !sport.isActive ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-6 h-6 bg-gradient-to-r ${gradientInfo?.color} rounded`}
                      ></div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        {sport.name}
                      </span>
                      {sport.comingSoon && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Coming Soon
                        </span>
                      )}
                      {!sport.isActive && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {sport.title}
                    </h3>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {sport.description}
                    </p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium text-gray-900">
                          Participants:
                        </span>
                        <span className="ml-1 text-gray-600">
                          {sport.participants}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Teams:
                        </span>
                        <span className="ml-1 text-gray-600">
                          {sport.totalTeams}
                        </span>
                      </div>
                      {sport.nextGame && (
                        <div>
                          <span className="font-medium text-gray-900">
                            Next Game:
                          </span>
                          <span className="ml-1 text-gray-600">
                            {sport.nextGame instanceof Date
                              ? sport.nextGame.toLocaleDateString()
                              : new Date(sport.nextGame).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {sport.rosterPath && (
                        <div>
                          <span className="font-medium text-gray-900">
                            Roster Path:
                          </span>
                          <span className="ml-1 text-gray-600">
                            {sport.rosterPath}
                          </span>
                        </div>
                      )}
                    </div>

                    {sport.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {sport.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(sport)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sport.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {sportsInfos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No sports information found. Create your first sport!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
