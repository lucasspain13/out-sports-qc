import React, { useEffect, useState } from "react";
import { useNotification } from "../../contexts/NotificationContext";
import { supabase } from "../../lib/supabase";

interface Registration {
  id: string;
  sport_type: "kickball" | "dodgeball";
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  shirt_size: string;
  experience_level: "beginner" | "intermediate" | "advanced";
  emergency_contact_name: string;
  emergency_contact_phone: string;
  how_did_you_hear: string;
  dietary_restrictions: string;
  medical_conditions: string;
  agree_to_terms: boolean;
  agree_to_email_updates: boolean;
  registration_date: string;
  status: "pending" | "approved" | "waitlist" | "declined";
  notes: string;
}

interface RegistrationSummary {
  sport_type: "kickball" | "dodgeball";
  total_registrations: number;
  pending_registrations: number;
  approved_registrations: number;
  waitlist_registrations: number;
  beginners: number;
  intermediate_players: number;
  advanced_players: number;
  email_subscribers: number;
}

export const RegistrationManagement: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [summary, setSummary] = useState<RegistrationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<
    "all" | "kickball" | "dodgeball"
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchRegistrations();
    fetchSummary();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("player_registrations")
        .select("*")
        .order("registration_date", { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error: any) {
      console.error("Error fetching registrations:", error);
      showNotification({
        type: "error",
        title: "Error Loading Registrations",
        message: error.message,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const { data, error } = await supabase
        .from("registration_summary")
        .select("*");

      if (error) throw error;
      setSummary(data || []);
    } catch (error: any) {
      console.error("Error fetching summary:", error);
    }
  };

  const updateRegistrationStatus = async (
    id: string,
    status: string,
    notes?: string
  ) => {
    try {
      const { error } = await supabase
        .from("player_registrations")
        .update({ status, notes: notes || null })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === id
            ? { ...reg, status: status as any, notes: notes || "" }
            : reg
        )
      );

      // Refresh summary
      await fetchSummary();

      showNotification({
        type: "success",
        title: "Status Updated",
        message: `Registration status updated to ${status}`,
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error updating status:", error);
      showNotification({
        type: "error",
        title: "Update Failed",
        message: error.message,
        duration: 5000,
      });
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const sportMatch =
      selectedSport === "all" || reg.sport_type === selectedSport;
    const statusMatch =
      selectedStatus === "all" || reg.status === selectedStatus;
    return sportMatch && statusMatch;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "waitlist":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getExperienceBadgeColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Registration Management
        </h1>
        <p className="text-gray-600">
          Manage player registrations for kickball and dodgeball leagues
        </p>
      </div>

      {/* Summary Cards */}
      {summary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {summary.map(stat => (
            <div
              key={stat.sport_type}
              className="bg-white rounded-lg shadow p-6 border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {stat.sport_type} League
                </h3>
                <span className="text-2xl">
                  {stat.sport_type === "kickball" ? "☄️" : "🏐"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stat.total_registrations}
                  </div>
                  <div className="text-gray-500">Total Registrations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stat.pending_registrations}
                  </div>
                  <div className="text-gray-500">Pending Review</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-green-600">
                    {stat.approved_registrations}
                  </div>
                  <div className="text-gray-500">Approved</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-gray-600">
                    {stat.email_subscribers}
                  </div>
                  <div className="text-gray-500">Email Subscribers</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sport
            </label>
            <select
              value={selectedSport}
              onChange={e => setSelectedSport(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sports</option>
              <option value="kickball">Kickball</option>
              <option value="dodgeball">Dodgeball</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="waitlist">Waitlist</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div className="flex items-end">
            <span className="text-sm text-gray-500">
              Showing {filteredRegistrations.length} of {registrations.length}{" "}
              registrations
            </span>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sport
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map(registration => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {registration.first_name} {registration.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {registration.sport_type === "kickball" ? "☄️" : "🏐"}
                      </span>
                      <span className="text-sm capitalize">
                        {registration.sport_type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Shirt: {registration.shirt_size}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExperienceBadgeColor(
                        registration.experience_level
                      )}`}
                    >
                      {registration.experience_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(
                      registration.registration_date
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(
                        registration.status
                      )}`}
                    >
                      {registration.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <select
                        value={registration.status}
                        onChange={e =>
                          updateRegistrationStatus(
                            registration.id,
                            e.target.value
                          )
                        }
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="waitlist">Waitlist</option>
                        <option value="declined">Declined</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              No registrations found
            </div>
            <div className="text-gray-400 text-sm">
              Try adjusting your filters or check back later
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
