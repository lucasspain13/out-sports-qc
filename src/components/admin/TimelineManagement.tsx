import React, { useEffect, useState } from "react";
import {
  timelineApi,
  type TimelineMilestone,
} from "../../lib/contentManagement";

interface TimelineManagementProps {
  onNavigate?: (page: string) => void;
}

export const TimelineManagement: React.FC<TimelineManagementProps> = () => {
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMilestone, setEditingMilestone] =
    useState<TimelineMilestone | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "founding" | "expansion" | "achievement" | "community" | "facility"
  >("all");

  // Form state
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: "",
    title: "",
    description: "",
    type: "achievement" as TimelineMilestone["type"],
    isActive: true,
  });

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const data = await timelineApi.getAll();
      setMilestones(
        data.sort((a: TimelineMilestone, b: TimelineMilestone) => {
          if (a.year !== b.year) return b.year - a.year; // Most recent year first
          return (
            new Date(a.month + " 1").getMonth() -
            new Date(b.month + " 1").getMonth()
          );
        })
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load timeline milestones"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear(),
      month: "",
      title: "",
      description: "",
      type: "achievement",
      isActive: true,
    });
    setEditingMilestone(null);
    setIsCreateMode(false);
  };

  const handleEdit = (milestone: TimelineMilestone) => {
    setFormData({
      year: milestone.year,
      month: milestone.month || "",
      title: milestone.title,
      description: milestone.description,
      type: milestone.type,
      isActive: milestone.isActive,
    });
    setEditingMilestone(milestone);
    setIsCreateMode(false);
  };

  const handleSave = async () => {
    try {
      if (editingMilestone) {
        await timelineApi.update(editingMilestone.id, formData);
      } else {
        await timelineApi.create(formData);
      }
      await fetchMilestones();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save milestone");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    try {
      await timelineApi.delete(id);
      await fetchMilestones();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete milestone"
      );
    }
  };

  const filteredMilestones = milestones.filter(
    milestone => filter === "all" || milestone.type === filter
  );

  const milestoneTypes = [
    {
      key: "founding",
      label: "Founding",
      icon: "🎯",
      color: "bg-purple-100 text-purple-800",
    },
    {
      key: "expansion",
      label: "Expansion",
      icon: "🚀",
      color: "bg-blue-100 text-blue-800",
    },
    {
      key: "achievement",
      label: "Achievement",
      icon: "🏆",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      key: "community",
      label: "Community",
      icon: "🤝",
      color: "bg-green-100 text-green-800",
    },
    {
      key: "facility",
      label: "Facility",
      icon: "🏗️",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (loading) {
    return (
      <div className="text-center py-8">Loading timeline milestones...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Timeline & Milestones Management
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => {
              setIsCreateMode(true);
              resetForm();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Milestone
          </button>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({milestones.length})
            </button>
            {milestoneTypes.map(type => {
              const count = milestones.filter(
                milestone => milestone.type === type.key
              ).length;
              return (
                <button
                  key={type.key}
                  onClick={() => setFilter(type.key as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === type.key
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type.icon} {type.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Create/Edit Form */}
        {(isCreateMode || editingMilestone) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingMilestone ? "Edit Milestone" : "Create New Milestone"}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          year:
                            parseInt(e.target.value) ||
                            new Date().getFullYear(),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="2019"
                      max={new Date().getFullYear() + 5}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Month
                    </label>
                    <select
                      value={formData.month}
                      onChange={e =>
                        setFormData({ ...formData, month: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select month</option>
                      {months.map(month => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        type: e.target.value as TimelineMilestone["type"],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {milestoneTypes.map(type => (
                      <option key={type.key} value={type.key}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="milestone-active"
                    checked={formData.isActive}
                    onChange={e =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="milestone-active"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Active (visible on timeline)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe this milestone and its significance to the league..."
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={!formData.title || !formData.description}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {editingMilestone ? "Update" : "Create"}
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

        {/* Timeline Milestones List */}
        <div className="space-y-6">
          {filteredMilestones.map(milestone => {
            const typeInfo =
              milestoneTypes.find(t => t.key === milestone.type) ||
              milestoneTypes[2];

            return (
              <div
                key={milestone.id}
                className={`bg-white border border-gray-200 rounded-lg p-6 ${
                  !milestone.isActive ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${typeInfo.color}`}
                      >
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {milestone.month
                          ? `${milestone.month} ${milestone.year}`
                          : milestone.year}
                      </span>
                      {!milestone.isActive && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {milestone.title}
                    </h3>

                    <p className="text-gray-700 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(milestone)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(milestone.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredMilestones.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No milestones found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
