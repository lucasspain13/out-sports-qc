import React, { useEffect, useState } from "react";
import { useNotification } from "../../contexts/NotificationContext";
import { supabase } from "../../lib/supabase";

interface RegistrationDetails {
  id: string;
  sport: string;
  season: string;
  game_dates: string;
  game_time: string;
  location: string;
  deadline: string;
  sport_type: "kickball" | "dodgeball";
  created_at?: string;
  updated_at?: string;
}

interface Registration {
  id: string;
  sport_type: "kickball" | "dodgeball";
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  shirt_size: string;
  skill_level: "beginner" | "intermediate" | "advanced";
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

interface WaiverStatus {
  liability: 'signed' | 'incomplete' | 'none';
  photo_release: 'signed' | 'incomplete' | 'none';
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
  const [registrationDetails, setRegistrationDetails] = useState<RegistrationDetails | null>(null);
  const [waiverStatuses, setWaiverStatuses] = useState<Record<string, WaiverStatus>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<
    "all" | "kickball" | "dodgeball"
  >("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"registrations" | "details">("registrations");
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchRegistrations();
    fetchSummary();
    fetchRegistrationDetails();
  }, []);

  useEffect(() => {
    if (registrations.length > 0) {
      fetchWaiverStatuses();
    }
  }, [registrations]);

  const fetchWaiverStatuses = async () => {
    try {
      if (registrations.length === 0) return;

      const { data, error } = await supabase
        .from("waiver_signatures")
        .select("participant_name, participant_dob, waiver_type, acknowledge_terms");

      if (error) throw error;

      // Group waivers by participant (name + dob)
      const statusMap: Record<string, WaiverStatus> = {};
      
      // Initialize all registered players with 'none' status
      registrations.forEach(reg => {
        const playerKey = `${reg.first_name} ${reg.last_name}|${reg.date_of_birth}`;
        statusMap[playerKey] = { liability: 'none', photo_release: 'none' };
      });

      // Update with actual waiver data
      data?.forEach(waiver => {
        const waiverPlayerKey = `${waiver.participant_name}|${waiver.participant_dob}`;
        
        // Find matching registration by name and DOB
        const matchingReg = registrations.find(reg => {
          const regPlayerKey = `${reg.first_name} ${reg.last_name}|${reg.date_of_birth}`;
          return regPlayerKey === waiverPlayerKey;
        });

        if (matchingReg) {
          const playerKey = `${matchingReg.first_name} ${matchingReg.last_name}|${matchingReg.date_of_birth}`;
          
          if (statusMap[playerKey]) {
            const status = waiver.acknowledge_terms ? 'signed' : 'incomplete';
            
            if (waiver.waiver_type === 'liability') {
              statusMap[playerKey].liability = status;
            } else if (waiver.waiver_type === 'photo_release') {
              statusMap[playerKey].photo_release = status;
            }
          }
        }
      });

      setWaiverStatuses(statusMap);
    } catch (error: any) {
      console.error("Error fetching waiver statuses:", error);
      showNotification({
        type: "error",
        title: "Error Loading Waiver Statuses",
        message: error.message,
        duration: 5000,
      });
    }
  };

  const fetchRegistrationDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("registration_details")
        .select("*")
        .eq("sport_type", "kickball")
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      if (data) {
        setRegistrationDetails(data);
      } else {
        // Create default registration details if none exist
        const defaultDetails: Partial<RegistrationDetails> = {
          sport: "Kickball",
          season: "Fall 2025",
          game_dates: "7 weeks",
          game_time: "Sundays 2-4pm",
          location: "TBD",
          deadline: "TBD",
          sport_type: "kickball"
        };
        
        const { data: newData, error: insertError } = await supabase
          .from("registration_details")
          .insert(defaultDetails)
          .select()
          .single();
          
        if (insertError) throw insertError;
        setRegistrationDetails(newData);
      }
    } catch (error: any) {
      console.error("Error fetching registration details:", error);
      showNotification({
        type: "error",
        title: "Error Loading Registration Details",
        message: error.message,
        duration: 5000,
      });
    }
  };

  const updateRegistrationDetails = async (details: Partial<RegistrationDetails>) => {
    try {
      const { data, error } = await supabase
        .from("registration_details")
        .update(details)
        .eq("sport_type", "kickball")
        .select()
        .single();

      if (error) throw error;
      
      setRegistrationDetails(data);
      showNotification({
        type: "success",
        title: "Details Updated",
        message: "Registration details have been updated successfully",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error updating registration details:", error);
      showNotification({
        type: "error",
        title: "Update Failed",
        message: error.message,
        duration: 5000,
      });
    }
  };

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

  const formatDateOfBirth = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "";
    try {
      // Parse the date string and add 1 day to fix timezone offset issue
      const date = new Date(dateStr);
      date.setDate(date.getDate() + 1);
      
      // Format as MM/DD/YYYY
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return "";
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

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("registrations")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "registrations"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Registrations
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Registration Details
            </button>
          </nav>
        </div>
      </div>

      {/* Registration Details Tab */}
      {activeTab === "details" && registrationDetails && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Registration Page Information
          </h2>
          <p className="text-gray-600 mb-6">
            Update the information displayed in the 6 boxes at the top of the registration form.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sport
              </label>
              <input
                type="text"
                value={registrationDetails.sport}
                onChange={(e) => updateRegistrationDetails({ sport: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Kickball"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Season
              </label>
              <input
                type="text"
                value={registrationDetails.season}
                onChange={(e) => updateRegistrationDetails({ season: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Fall 2025"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Game Dates
              </label>
              <input
                type="text"
                value={registrationDetails.game_dates}
                onChange={(e) => updateRegistrationDetails({ game_dates: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 7 weeks"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Game Time
              </label>
              <input
                type="text"
                value={registrationDetails.game_time}
                onChange={(e) => updateRegistrationDetails({ game_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Sundays 2-4pm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={registrationDetails.location}
                onChange={(e) => updateRegistrationDetails({ location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., TBD"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="text"
                value={registrationDetails.deadline}
                onChange={(e) => updateRegistrationDetails({ deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., TBD"
              />
            </div>
          </div>
        </div>
      )}

      {/* Registrations Tab Content */}
      {activeTab === "registrations" && (
        <>
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
                  Waivers
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
                        {registration.date_of_birth && (
                          <span className="text-gray-500 font-normal">
                            {" "}({formatDateOfBirth(registration.date_of_birth)})
                          </span>
                        )}
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
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Liability:</span>
                        <span className="text-lg">
                          {(() => {
                            const participantKey = `${registration.first_name} ${registration.last_name}|${registration.date_of_birth}`;
                            const status = waiverStatuses[participantKey]?.liability;
                            return status === 'signed' ? '✅' : status === 'incomplete' ? '⚠️' : '❌';
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Photo:</span>
                        <span className="text-lg">
                          {(() => {
                            const participantKey = `${registration.first_name} ${registration.last_name}|${registration.date_of_birth}`;
                            const status = waiverStatuses[participantKey]?.photo_release;
                            return status === 'signed' ? '✅' : status === 'incomplete' ? '⚠️' : '❌';
                          })()}
                        </span>
                      </div>
                    </div>
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
        </>
      )}
    </div>
  );
};
