import React, { useEffect, useState } from "react";
import { teamsApi } from "../../lib/database";
import {
  getErrorActionSuggestion,
  parseSupabaseError,
} from "../../lib/errorHandling";
import { supabase } from "../../lib/supabase";
import { Team } from "../../types";
import { AdminErrorBanner } from "./AdminErrorBanner";

interface TeamFormData {
  name: string;
  sport: "kickball" | "dodgeball";
  gradient: "orange" | "teal" | "blue" | "purple";
  description: string;
  motto: string;
  founded: number;
}

export const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorActionSuggestion, setErrorActionSuggestion] = useState<
    string | null
  >(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState<
    "all" | "kickball" | "dodgeball"
  >("all");
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    sport: "kickball",
    gradient: "blue",
    description: "",
    motto: "",
    founded: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await teamsApi.getAll();
      setTeams(teamsData);
      // Clear any previous errors
      setError(null);
      setErrorActionSuggestion(null);
    } catch (err) {
      const errorMessage = parseSupabaseError(err);
      const actionSuggestion = getErrorActionSuggestion(err);
      setError(errorMessage);
      setErrorActionSuggestion(actionSuggestion);
      console.error("Teams fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        // Update existing team
        const { error } = await supabase
          .from("teams")
          .update({
            name: formData.name,
            sport: formData.sport,
            gradient: formData.gradient,
            description: formData.description,
            motto: formData.motto,
            founded: formData.founded,
          })
          .eq("id", editingTeam.id);

        if (error) throw error;
      } else {
        // Create new team
        const { error } = await supabase.from("teams").insert([
          {
            name: formData.name,
            sport: formData.sport,
            gradient: formData.gradient,
            description: formData.description,
            motto: formData.motto,
            founded: formData.founded,
            wins: 0,
            losses: 0,
          },
        ]);

        if (error) throw error;
      }

      await fetchTeams();
      resetForm();
    } catch (err) {
      const errorMessage = parseSupabaseError(err);
      const actionSuggestion = getErrorActionSuggestion(err);
      setError(
        `Failed to ${editingTeam ? "update" : "create"} team: ${errorMessage}`
      );
      setErrorActionSuggestion(actionSuggestion);
      console.error("Team save error:", err);
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      sport: team.sportType,
      gradient: team.gradient,
      description: team.description,
      motto: team.motto,
      founded: team.founded,
    });
    setShowForm(true);
  };

  const handleDelete = async (teamId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this team? This will also remove all associated players."
      )
    ) {
      return;
    }

    try {
      // First delete all players in the team
      const { error: playersError } = await supabase
        .from("players")
        .delete()
        .eq("team_id", teamId);

      if (playersError) throw playersError;

      // Then delete the team
      const { error: teamError } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamId);

      if (teamError) throw teamError;

      await fetchTeams();
      // Clear any previous errors on successful deletion
      setError(null);
      setErrorActionSuggestion(null);
    } catch (err) {
      const errorMessage = parseSupabaseError(err);
      const actionSuggestion = getErrorActionSuggestion(err);
      setError(`Failed to delete team: ${errorMessage}`);
      setErrorActionSuggestion(actionSuggestion);
      console.error("Team delete error:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sport: "kickball",
      gradient: "blue",
      description: "",
      motto: "",
      founded: new Date().getFullYear(),
    });
    setEditingTeam(null);
    setShowForm(false);
    setError(null);
    setErrorActionSuggestion(null);
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSport =
      sportFilter === "all" || team.sportType === sportFilter;
    return matchesSearch && matchesSport;
  });

  const gradientClasses = {
    orange: "from-orange-400 to-red-500",
    teal: "from-teal-400 to-cyan-500",
    blue: "from-blue-400 to-indigo-500",
    purple: "from-purple-400 to-pink-500",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Team
        </button>
      </div>

      <AdminErrorBanner
        error={error}
        actionSuggestion={errorActionSuggestion}
        onDismiss={() => {
          setError(null);
          setErrorActionSuggestion(null);
        }}
      />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={sportFilter}
            onChange={e =>
              setSportFilter(e.target.value as "all" | "kickball" | "dodgeball")
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Sports</option>
            <option value="kickball">Kickball</option>
            <option value="dodgeball">Dodgeball</option>
          </select>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredTeams.map(team => (
          <div
            key={team.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div
              className={`h-32 bg-gradient-to-r ${
                gradientClasses[team.gradient]
              } flex items-center justify-center`}
            >
              <h3 className="text-2xl font-bold text-white text-center">
                {team.name}
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full capitalize">
                  {team.sportType}
                </span>
                <span className="text-sm text-gray-500">
                  Founded {team.founded}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {team.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{team.players.length} players</span>
                <span>
                  {team.wins}W - {team.losses}L
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(team)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingTeam ? "Edit Team" : "Add New Team"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sport
                </label>
                <select
                  value={formData.sport}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      sport: e.target.value as "kickball" | "dodgeball",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="kickball">Kickball</option>
                  <option value="dodgeball">Dodgeball</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Theme
                </label>
                <select
                  value={formData.gradient}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      gradient: e.target.value as
                        | "orange"
                        | "teal"
                        | "blue"
                        | "purple",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="blue">Blue</option>
                  <option value="orange">Orange</option>
                  <option value="teal">Teal</option>
                  <option value="purple">Purple</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Motto
                </label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={e =>
                    setFormData({ ...formData, motto: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Founded Year
                </label>
                <input
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={formData.founded}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      founded: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTeam ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
