import React, { useEffect, useState } from "react";
import { coreValuesApi, type CoreValue } from "../../lib/contentManagement";

interface CoreValuesManagementProps {
  onNavigate?: (page: string) => void;
}

export const CoreValuesManagement: React.FC<CoreValuesManagementProps> = () => {
  const [values, setValues] = useState<CoreValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<CoreValue | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchValues();
  }, []);

  const fetchValues = async () => {
    try {
      setLoading(true);
      const data = await coreValuesApi.getAll();
      setValues(data.sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load core values"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
      sortOrder: values.length + 1,
      isActive: true,
    });
    setEditingValue(null);
    setIsCreateMode(false);
  };

  const handleEdit = (value: CoreValue) => {
    setFormData({
      name: value.name,
      description: value.description,
      icon: value.icon,
      sortOrder: value.sortOrder,
      isActive: value.isActive,
    });
    setEditingValue(value);
    setIsCreateMode(false);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateMode(true);
  };

  const handleSave = async () => {
    try {
      if (editingValue) {
        await coreValuesApi.update(editingValue.id, formData);
      } else {
        await coreValuesApi.create(formData);
      }
      await fetchValues();
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save core value"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this core value?")) return;

    try {
      await coreValuesApi.delete(id);
      await fetchValues();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete core value"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Core Values Management
          </h1>
          <p className="text-gray-600">
            Manage the core values displayed on your website.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark"
        >
          Add Core Value
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Values List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Current Core Values
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {values.map(value => (
              <div key={value.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{value.icon}</span>
                      <h3 className="font-semibold text-gray-900">
                        {value.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        #{value.sortOrder}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          value.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {value.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(value)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(value.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {values.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No core values found. Create your first one!
              </div>
            )}
          </div>
        </div>

        {/* Edit/Create Form */}
        {(editingValue || isCreateMode) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingValue ? "Edit Core Value" : "Create Core Value"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={e =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  placeholder="🤝"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  placeholder="Inclusivity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  placeholder="We welcome players of all backgrounds, skill levels, and identities..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      sortOrder: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  min="1"
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
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-gray-700"
                >
                  Active (visible on website)
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark"
                >
                  {editingValue ? "Update" : "Create"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoreValuesManagement;
