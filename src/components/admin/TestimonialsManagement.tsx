import React, { useEffect, useState } from "react";
import { testimonialsApi, type Testimonial } from "../../lib/contentManagement";

interface TestimonialsManagementProps {
  onNavigate?: (page: string) => void;
}

export const TestimonialsManagement: React.FC<
  TestimonialsManagementProps
> = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "featured" | "kickball" | "dodgeball"
  >("all");

  // Form state
  const [formData, setFormData] = useState({
    memberName: "",
    role: "",
    quote: "",
    avatar: "",
    teamName: "",
    sportType: "",
    memberSince: new Date().getFullYear(),
    location: "Austin, TX",
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialsApi.getAll();
      setTestimonials(
        data.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load testimonials"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      memberName: "",
      role: "",
      quote: "",
      avatar: "",
      teamName: "",
      sportType: "",
      memberSince: new Date().getFullYear(),
      location: "Austin, TX",
      isFeatured: false,
      isActive: true,
    });
    setEditingTestimonial(null);
    setIsCreateMode(false);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      memberName: testimonial.memberName,
      role: testimonial.role,
      quote: testimonial.quote,
      avatar: testimonial.avatar || "",
      teamName: testimonial.teamName || "",
      sportType: testimonial.sportType || "",
      memberSince: testimonial.memberSince || new Date().getFullYear(),
      location: testimonial.location,
      isFeatured: testimonial.isFeatured,
      isActive: testimonial.isActive,
    });
    setEditingTestimonial(testimonial);
    setIsCreateMode(false);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateMode(true);
  };

  const handleSave = async () => {
    try {
      const testimonialData = {
        ...formData,
        avatar: formData.avatar || undefined,
        teamName: formData.teamName || undefined,
        sportType: formData.sportType || undefined,
        memberSince: formData.memberSince || undefined,
      };

      if (editingTestimonial) {
        await testimonialsApi.update(editingTestimonial.id, testimonialData);
      } else {
        await testimonialsApi.create(testimonialData);
      }
      await fetchTestimonials();
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save testimonial"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await testimonialsApi.delete(id);
      await fetchTestimonials();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete testimonial"
      );
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filter === "all") return true;
    if (filter === "featured") return testimonial.isFeatured;
    if (filter === "kickball" || filter === "dodgeball")
      return testimonial.sportType === filter;
    return true;
  });

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
            Testimonials Management
          </h1>
          <p className="text-gray-600">
            Manage member testimonials and reviews.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark"
        >
          Add Testimonial
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

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {[
          { key: "all", label: "All" },
          { key: "featured", label: "Featured" },
          { key: "kickball", label: "Kickball" },
          { key: "dodgeball", label: "Dodgeball" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === key
                ? "bg-brand-blue text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Testimonials List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Testimonials ({filteredTestimonials.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredTestimonials.map(testimonial => (
              <div key={testimonial.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {testimonial.memberName}
                      </h3>
                      {testimonial.isFeatured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-brand-blue font-medium">
                        {testimonial.role}
                      </span>
                      {testimonial.teamName && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">
                            {testimonial.teamName}
                          </span>
                        </>
                      )}
                      {testimonial.sportType && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600 capitalize">
                            {testimonial.sportType}
                          </span>
                        </>
                      )}
                    </div>

                    <blockquote className="text-gray-700 text-sm italic mb-2 line-clamp-3">
                      "{testimonial.quote}"
                    </blockquote>

                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {testimonial.memberSince && (
                        <span>Member since {testimonial.memberSince}</span>
                      )}
                      <span>•</span>
                      <span>{testimonial.location}</span>
                      <span
                        className={`px-2 py-1 rounded-full ${
                          testimonial.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {testimonial.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredTestimonials.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No testimonials found for the selected filter.
              </div>
            )}
          </div>
        </div>

        {/* Edit/Create Form */}
        {(editingTestimonial || isCreateMode) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Name *
                  </label>
                  <input
                    type="text"
                    value={formData.memberName}
                    onChange={e =>
                      setFormData({ ...formData, memberName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="Phoenix Rainbow"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={e =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    required
                  >
                    <option value="">Select role...</option>
                    <option value="Player">Player</option>
                    <option value="Team Captain">Team Captain</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Volunteer Referee">Volunteer Referee</option>
                    <option value="Coach">Coach</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quote/Testimonial *
                </label>
                <textarea
                  value={formData.quote}
                  onChange={e =>
                    setFormData({ ...formData, quote: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  placeholder="Share their experience with the league..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={formData.teamName}
                    onChange={e =>
                      setFormData({ ...formData, teamName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="Rainbow Runners"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sport Type
                  </label>
                  <select
                    value={formData.sportType}
                    onChange={e =>
                      setFormData({ ...formData, sportType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="">General (not sport-specific)</option>
                    <option value="kickball">Kickball</option>
                    <option value="dodgeball">Dodgeball</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <input
                    type="number"
                    value={formData.memberSince}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        memberSince: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    min="2019"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="Austin, TX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={e =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={e =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Featured (show prominently)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={Boolean(formData.isActive)}
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
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark"
                >
                  {editingTestimonial ? "Update" : "Create"}
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

export default TestimonialsManagement;
