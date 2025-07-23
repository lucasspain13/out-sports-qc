import React, { useEffect, useState } from "react";
import { useNotification } from "../../contexts/NotificationContext";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { pushNotificationService } from "../../services/pushNotificationService";
import {
  Announcement,
  AnnouncementManagementProps,
  CreateAnnouncementData,
} from "../../types";

interface EditingAnnouncement extends CreateAnnouncementData {
  id?: string;
}

export const AnnouncementManagement: React.FC<AnnouncementManagementProps> = ({
  className = "",
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<EditingAnnouncement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { showNotification } = useNotification();
  const { user } = useAuth();

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching announcements:", error);
        showNotification({
          type: "error",
          title: "Error",
          message: "Failed to load announcements",
        });
        return;
      }

      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "Failed to load announcements",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = () => {
    setEditingAnnouncement({
      title: "",
      content: "",
      priority: "normal",
      type: "general",
      target_audience: "all",
    });
    setIsModalOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      type: announcement.type,
      target_audience: announcement.target_audience,
      expires_at: announcement.expires_at,
    });
    setIsModalOpen(true);
  };

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement || !user) return;

    setSubmitting(true);

    try {
      if (editingAnnouncement.id) {
        // Update existing announcement
        const { error } = await supabase
          .from("announcements")
          .update({
            title: editingAnnouncement.title,
            content: editingAnnouncement.content,
            priority: editingAnnouncement.priority,
            type: editingAnnouncement.type,
            target_audience: editingAnnouncement.target_audience,
            expires_at: editingAnnouncement.expires_at || null,
          })
          .eq("id", editingAnnouncement.id);

        if (error) throw error;

        showNotification({
          type: "success",
          title: "Success",
          message: "Announcement updated successfully",
        });
      } else {
        // Create new announcement
        const { error } = await supabase.from("announcements").insert({
          title: editingAnnouncement.title,
          content: editingAnnouncement.content,
          priority: editingAnnouncement.priority,
          type: editingAnnouncement.type,
          target_audience: editingAnnouncement.target_audience,
          expires_at: editingAnnouncement.expires_at || null,
          created_by: user.id,
        });

        if (error) throw error;

        showNotification({
          type: "success",
          title: "Success",
          message: "Announcement created successfully",
        });

        // Trigger push notification to mobile apps
        await triggerPushNotification(editingAnnouncement);
      }

      setIsModalOpen(false);
      setEditingAnnouncement(null);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "Failed to save announcement",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;

      showNotification({
        type: "success",
        title: "Success",
        message: "Announcement deleted successfully",
      });

      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "Failed to delete announcement",
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      showNotification({
        type: "success",
        title: "Success",
        message: `Announcement ${!currentStatus ? "activated" : "deactivated"}`,
      });

      fetchAnnouncements();
    } catch (error) {
      console.error("Error toggling announcement status:", error);
      showNotification({
        type: "error",
        title: "Error",
        message: "Failed to update announcement status",
      });
    }
  };

  const triggerPushNotification = async (announcement: EditingAnnouncement) => {
    try {
      // Send push notification to mobile apps via local notification service
      await pushNotificationService.scheduleLocalAnnouncementNotification({
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority || "normal",
        type: announcement.type || "general",
        target_audience: announcement.target_audience || "all",
      });

      // Also attempt to send via Supabase Edge Function for remote push notifications
      const { error } = await supabase.functions.invoke(
        "send-announcement-notification",
        {
          body: {
            title: announcement.title,
            content: announcement.content,
            priority: announcement.priority,
            target_audience: announcement.target_audience,
          },
        }
      );

      if (error) {
        console.warn("Remote push notification failed:", error);
      } else {
        console.log("Push notifications sent successfully");
      }
    } catch (error) {
      console.warn("Push notification service unavailable:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "normal":
        return "text-blue-600 bg-blue-100";
      case "low":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "game":
        return "text-green-600 bg-green-100";
      case "registration":
        return "text-purple-600 bg-purple-100";
      case "maintenance":
        return "text-yellow-600 bg-yellow-100";
      case "event":
        return "text-indigo-600 bg-indigo-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <button
          onClick={handleCreateAnnouncement}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Announcement
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No announcements found</div>
          <button
            onClick={handleCreateAnnouncement}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Create your first announcement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(announcement => (
            <div
              key={announcement.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        announcement.type
                      )}`}
                    >
                      {announcement.type}
                    </span>
                    {!announcement.is_active && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                        Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {announcement.content}
                  </p>

                  <div className="text-sm text-gray-500 space-y-1">
                    <div>Target: {announcement.target_audience}</div>
                    <div>
                      Created:{" "}
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </div>
                    {announcement.expires_at && (
                      <div>
                        Expires:{" "}
                        {new Date(announcement.expires_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() =>
                      handleToggleActive(
                        announcement.id,
                        announcement.is_active
                      )
                    }
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      announcement.is_active
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {announcement.is_active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => handleEditAnnouncement(announcement)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {isModalOpen && editingAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingAnnouncement.id
                  ? "Edit Announcement"
                  : "Create Announcement"}
              </h2>
            </div>

            <form onSubmit={handleSubmitAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingAnnouncement.title}
                  onChange={e =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      title: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  value={editingAnnouncement.content}
                  onChange={e =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      content: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={editingAnnouncement.priority}
                    onChange={e =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={editingAnnouncement.type}
                    onChange={e =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        type: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="game">Game</option>
                    <option value="registration">Registration</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={editingAnnouncement.target_audience}
                    onChange={e =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        target_audience: e.target.value as any,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All</option>
                    <option value="players">Players</option>
                    <option value="teams">Teams</option>
                    <option value="kickball">Kickball</option>
                    <option value="dodgeball">Dodgeball</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires At (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={editingAnnouncement.expires_at || ""}
                  onChange={e =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      expires_at: e.target.value || undefined,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAnnouncement(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingAnnouncement.id
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
