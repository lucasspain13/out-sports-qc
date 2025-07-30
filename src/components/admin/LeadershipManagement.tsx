import React, { useEffect, useState } from "react";
import {
  leadershipApi,
  type LeadershipMember,
} from "../../lib/contentManagement";

interface LeadershipManagementProps {
  onNavigate?: (page: string) => void;
}

export const LeadershipManagement: React.FC<LeadershipManagementProps> = () => {
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<LeadershipMember | null>(
    null
  );
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    joinedYear: new Date().getFullYear(),
    avatar: "",
    specialties: [""],
    favoriteQuote: "",
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await leadershipApi.getAll();
      setMembers(data.sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load leadership team"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      bio: "",
      email: "",
      joinedYear: new Date().getFullYear(),
      avatar: "",
      specialties: [""],
      favoriteQuote: "",
      sortOrder: members.length + 1,
      isActive: true,
    });
    setEditingMember(null);
    setIsCreateMode(false);
  };

  const handleEdit = (member: LeadershipMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      email: member.email || "",
      joinedYear: member.joinedYear,
      avatar: member.avatar || "",
      specialties: member.specialties.length > 0 ? member.specialties : [""],
      favoriteQuote: member.favoriteQuote || "",
      sortOrder: member.sortOrder,
      isActive: member.isActive,
    });
    setEditingMember(member);
    setIsCreateMode(false);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateMode(true);
  };

  const handleSpecialtyChange = (index: number, value: string) => {
    const newSpecialties = [...formData.specialties];
    newSpecialties[index] = value;
    setFormData({ ...formData, specialties: newSpecialties });
  };

  const addSpecialty = () => {
    setFormData({ ...formData, specialties: [...formData.specialties, ""] });
  };

  const removeSpecialty = (index: number) => {
    if (formData.specialties.length > 1) {
      const newSpecialties = formData.specialties.filter((_, i) => i !== index);
      setFormData({ ...formData, specialties: newSpecialties });
    }
  };

  const handleSave = async () => {
    try {
      const cleanSpecialties = formData.specialties.filter(
        s => s.trim() !== ""
      );
      const memberData = {
        ...formData,
        specialties: cleanSpecialties,
        email: formData.email || undefined,
        avatar: formData.avatar || undefined,
        favoriteQuote: formData.favoriteQuote || undefined,
      };

      if (editingMember) {
        await leadershipApi.update(editingMember.id, memberData);
      } else {
        await leadershipApi.create(memberData);
      }
      await fetchMembers();
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save leadership member"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leadership member?"))
      return;

    try {
      await leadershipApi.delete(id);
      await fetchMembers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete leadership member"
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
            Leadership Team Management
          </h1>
          <p className="text-gray-600">
            Manage your organization's leadership team.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark"
        >
          Add Team Member
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
        {/* Members List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Leadership Team
            </h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {members.map(member => (
              <div key={member.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {member.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        #{member.sortOrder}
                      </span>
                    </div>
                    <p className="text-sm text-brand-blue font-medium">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {member.bio}
                    </p>

                    <div className="mt-2 space-y-1">
                      {member.email && (
                        <p className="text-xs text-gray-500">{member.email}</p>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          Joined {member.joinedYear}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            member.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {member.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No leadership members found. Add your first team member!
              </div>
            )}
          </div>
        </div>

        {/* Edit/Create Form */}
        {(editingMember || isCreateMode) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingMember ? "Edit Team Member" : "Add Team Member"}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="Alex Rivera"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={e =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="League Commissioner"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={e =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  placeholder="Brief bio describing their background and role..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="OutSportsQC@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joined Year
                  </label>
                  <input
                    type="number"
                    value={formData.joinedYear}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        joinedYear: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    min="2000"
                    max={new Date().getFullYear()}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialties
                </label>
                {formData.specialties.map((specialty, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={specialty}
                      onChange={e =>
                        handleSpecialtyChange(index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="Community Building"
                    />
                    {formData.specialties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecialty(index)}
                        className="px-2 py-2 text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecialty}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Specialty
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Favorite Quote
                </label>
                <input
                  type="text"
                  value={formData.favoriteQuote}
                  onChange={e =>
                    setFormData({ ...formData, favoriteQuote: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  placeholder="Sports are better when everyone gets to play."
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
                </div>              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark"
                >
                  {editingMember ? "Update" : "Create"}
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

export default LeadershipManagement;
