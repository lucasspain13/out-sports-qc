import {
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  Info,
  Plus,
  Save,
  Shield,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  aboutFeaturesApi,
  AboutFeature as AboutFeatureType,
} from "../../lib/contentManagement";

interface ExtendedAboutFeature extends AboutFeatureType {
  color?: string;
  created_at?: string;
  updated_at?: string;
}

type AboutFeatureFormData = Omit<
  ExtendedAboutFeature,
  "id" | "created_at" | "updated_at"
>;

const ICON_OPTIONS = [
  { value: "star", label: "Star", icon: Star },
  { value: "info", label: "Info", icon: Info },
  { value: "check-circle", label: "Check Circle", icon: CheckCircle },
  { value: "clock", label: "Clock", icon: Clock },
  { value: "shield", label: "Shield", icon: Shield },
  { value: "users", label: "Users", icon: Users },
];

const COLOR_OPTIONS = [
  { value: "blue", label: "Blue", class: "text-blue-600" },
  { value: "green", label: "Green", class: "text-green-600" },
  { value: "purple", label: "Purple", class: "text-purple-600" },
  { value: "red", label: "Red", class: "text-red-600" },
  { value: "orange", label: "Orange", class: "text-orange-600" },
  { value: "indigo", label: "Indigo", class: "text-indigo-600" },
];

export default function AboutFeaturesManagement() {
  const [features, setFeatures] = useState<ExtendedAboutFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFeature, setEditingFeature] =
    useState<ExtendedAboutFeature | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState<AboutFeatureFormData>({
    title: "",
    description: "",
    icon: "star",
    color: "blue",
    isActive: true,
    sortOrder: 0,
  });

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const data = await aboutFeaturesApi.getAll();
      setFeatures(
        data.sort(
          (a: ExtendedAboutFeature, b: ExtendedAboutFeature) =>
            a.sortOrder - b.sortOrder
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch about features"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "star",
      color: "blue",
      isActive: true,
      sortOrder: features.length,
    });
    setEditingFeature(null);
    setIsCreateMode(false);
  };

  const handleEdit = (feature: ExtendedAboutFeature) => {
    setFormData({
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      color: feature.color || "blue",
      isActive: feature.isActive,
      sortOrder: feature.sortOrder,
    });
    setEditingFeature(feature);
    setIsCreateMode(false);
  };

  const handleSave = async () => {
    try {
      if (editingFeature) {
        await aboutFeaturesApi.update(editingFeature.id, formData);
      } else {
        await aboutFeaturesApi.create(formData);
      }
      await fetchFeatures();
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save about feature"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this about feature?")) {
      try {
        await aboutFeaturesApi.delete(id);
        await fetchFeatures();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete about feature"
        );
      }
    }
  };

  const handleToggleActive = async (feature: ExtendedAboutFeature) => {
    try {
      await aboutFeaturesApi.update(feature.id, {
        ...feature,
        isActive: !feature.isActive,
      });
      await fetchFeatures();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update about feature status"
      );
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = ICON_OPTIONS.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Star;
  };

  const getColorClass = (colorName: string) => {
    const colorOption = COLOR_OPTIONS.find(opt => opt.value === colorName);
    return colorOption ? colorOption.class : "text-blue-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg font-medium text-gray-600">
          Loading about features...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            About Features Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage the feature highlights shown on the About page
          </p>
        </div>
        <button
          onClick={() => setIsCreateMode(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create/Edit Form */}
      {(isCreateMode || editingFeature) && (
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingFeature ? "Edit Feature" : "Create New Feature"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter feature title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={e =>
                  setFormData({
                    ...formData,
                    sortOrder: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={e =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {ICON_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <select
                value={formData.color}
                onChange={e =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {COLOR_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter feature description"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={e =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
            <div className="flex items-start space-x-3">
              {React.createElement(getIconComponent(formData.icon), {
                className: `w-6 h-6 ${getColorClass(
                  formData.color || "blue"
                )} flex-shrink-0 mt-0.5`,
              })}
              <div>
                <h4 className="font-medium text-gray-900">
                  {formData.title || "Feature Title"}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.description || "Feature description goes here..."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.title.trim() || !formData.description.trim()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingFeature ? "Update Feature" : "Create Feature"}
            </button>
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            About Features ({features.length})
          </h2>
        </div>

        {features.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <Star className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No features found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first about feature.
            </p>
            <button
              onClick={() => setIsCreateMode(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Feature
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {features.map(feature => {
              const IconComponent = getIconComponent(feature.icon);
              return (
                <div key={feature.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <IconComponent
                        className={`w-6 h-6 ${getColorClass(
                          feature.color || "blue"
                        )} flex-shrink-0 mt-1`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">
                            {feature.title}
                          </h3>
                          {!feature.isActive && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {feature.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Order: {feature.sortOrder}</span>
                          <span>Color: {feature.color || "blue"}</span>
                          <span>Icon: {feature.icon}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleToggleActive(feature)}
                        className={`p-1 rounded-full transition-colors ${
                          feature.isActive
                            ? "text-green-600 hover:bg-green-100"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                        title={feature.isActive ? "Deactivate" : "Activate"}
                      >
                        {feature.isActive ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(feature)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(feature.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
