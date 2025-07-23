import {
  Eye,
  EyeOff,
  Globe,
  Mail,
  Save,
  Settings,
  Shield,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiteSetting, siteSettingsApi } from "../../lib/contentManagement";

interface ExtendedSiteSetting extends SiteSetting {
  valueType?: string;
  updated_at?: string;
  created_at?: string;
}

type SiteSettingFormData = Omit<
  ExtendedSiteSetting,
  "id" | "created_at" | "updated_at"
>;

const SETTING_CATEGORIES = {
  general: { label: "General", icon: Globe },
  contact: { label: "Contact", icon: Mail },
  league: { label: "League", icon: Trophy },
  features: { label: "Features", icon: Settings },
  security: { label: "Security", icon: Shield },
};

export default function SiteSettingsManagement() {
  const [settings, setSettings] = useState<ExtendedSiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSettings, setEditingSettings] = useState<
    Record<string, SiteSettingFormData>
  >({});
  const [activeCategory, setActiveCategory] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>(
    {}
  );

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await siteSettingsApi.getAll();
      setSettings(
        data.map(setting => ({
          ...setting,
          valueType: setting.type, // Map type to valueType for compatibility
        }))
      );

      // Initialize editing state with current values
      const initialEditingState: Record<string, SiteSettingFormData> = {};
      data.forEach(setting => {
        initialEditingState[setting.key] = {
          key: setting.key,
          value: setting.value,
          description: setting.description,
          category: setting.category,
          isPublic: setting.isPublic,
          type: setting.type,
          valueType: setting.type,
        };
      });
      setEditingSettings(initialEditingState);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch site settings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingChange = (
    key: string,
    field: keyof SiteSettingFormData,
    value: any
  ) => {
    setEditingSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    try {
      // Find settings that have changed
      const changedSettings = Object.entries(editingSettings).filter(
        ([key, editedSetting]) => {
          const originalSetting = settings.find(s => s.key === key);
          return (
            originalSetting &&
            JSON.stringify(editedSetting) !==
              JSON.stringify({
                key: originalSetting.key,
                value: originalSetting.value,
                description: originalSetting.description,
                category: originalSetting.category,
                isPublic: originalSetting.isPublic,
                valueType: originalSetting.valueType,
              })
          );
        }
      );

      // Update each changed setting
      await Promise.all(
        changedSettings
          .map(([key, editedSetting]) => {
            const originalSetting = settings.find(s => s.key === key);
            return originalSetting
              ? siteSettingsApi.update(originalSetting.id, editedSetting)
              : null;
          })
          .filter(Boolean)
      );

      await fetchSettings();
      setHasChanges(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save site settings"
      );
    }
  };

  const handleReset = () => {
    const resetEditingState: Record<string, SiteSettingFormData> = {};
    settings.forEach(setting => {
      resetEditingState[setting.key] = {
        key: setting.key,
        value: setting.value,
        description: setting.description,
        category: setting.category,
        isPublic: setting.isPublic,
        type: setting.type,
        valueType: setting.valueType,
      };
    });
    setEditingSettings(resetEditingState);
    setHasChanges(false);
  };

  const toggleShowSensitive = (key: string) => {
    setShowSensitive(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderSettingInput = (setting: ExtendedSiteSetting) => {
    const editedValue = editingSettings[setting.key];
    if (!editedValue) return null;

    const isSensitive = !setting.isPublic;
    const shouldMask = isSensitive && !showSensitive[setting.key];

    switch (setting.valueType || setting.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editedValue.value === "true"}
              onChange={e =>
                handleSettingChange(
                  setting.key,
                  "value",
                  e.target.checked ? "true" : "false"
                )
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {editedValue.value === "true" ? "Enabled" : "Disabled"}
            </span>
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            value={editedValue.value}
            onChange={e =>
              handleSettingChange(setting.key, "value", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case "json":
        return (
          <textarea
            value={editedValue.value}
            onChange={e =>
              handleSettingChange(setting.key, "value", e.target.value)
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="Enter valid JSON..."
          />
        );

      default: // string
        return (
          <div className="relative">
            <input
              type={shouldMask ? "password" : "text"}
              value={editedValue.value}
              onChange={e =>
                handleSettingChange(setting.key, "value", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {isSensitive && (
              <button
                type="button"
                onClick={() => toggleShowSensitive(setting.key)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {shouldMask ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        );
    }
  };

  const filteredSettings = settings.filter(
    setting => setting.category === activeCategory
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg font-medium text-gray-600">
          Loading site settings...
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
            Site Settings Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Configure global site settings and preferences
          </p>
        </div>
        {hasChanges && (
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset Changes
            </button>
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </button>
          </div>
        )}
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

      {hasChanges && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            You have unsaved changes. Don't forget to save your modifications.
          </p>
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        {/* Category Navigation */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {Object.entries(SETTING_CATEGORIES).map(([key, category]) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === key;
              const categorySettings = settings.filter(s => s.category === key);

              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {categorySettings.length}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="p-6">
          {filteredSettings.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No settings in this category
              </h3>
              <p className="text-gray-600">
                This category doesn't have any settings configured yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSettings.map(setting => (
                <div key={setting.key} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {setting.key}
                        </h3>
                        {!setting.isPublic && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            Sensitive
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {setting.valueType || setting.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {setting.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Value:
                    </label>
                    {renderSettingInput(setting)}
                  </div>

                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`public-${setting.key}`}
                        checked={
                          editingSettings[setting.key]?.isPublic || false
                        }
                        onChange={e =>
                          handleSettingChange(
                            setting.key,
                            "isPublic",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`public-${setting.key}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        Public setting
                      </label>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last updated:{" "}
                      {setting.updated_at
                        ? new Date(setting.updated_at).toLocaleString()
                        : "Never"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
