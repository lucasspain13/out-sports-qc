import React, { useEffect, useState } from "react";
import { playersApi, teamsApi } from "../../lib/database";
import { supabase } from "../../lib/supabase";
import { Player, Team } from "../../types";

interface PlayerFormData {
  name: string;
  jerseyNumber: number;
  quote: string;
  teamId: string;
  sportType: "kickball" | "dodgeball";
}

export const PlayerManagement: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [sportFilter, setSportFilter] = useState<
    "all" | "kickball" | "dodgeball"
  >("all");
  const [formData, setFormData] = useState<PlayerFormData>({
    name: "",
    jerseyNumber: 1,
    quote: "",
    teamId: "",
    sportType: "kickball",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [playersData, teamsData] = await Promise.all([
        playersApi.getAll(),
        teamsApi.getAll(),
      ]);
      setPlayers(playersData);
      setTeams(teamsData);
    } catch (err) {
      setError("Failed to load data");
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if jersey number is already taken in the team
      const existingPlayer = players.find(
        p =>
          p.teamId === formData.teamId &&
          p.jerseyNumber === formData.jerseyNumber &&
          p.id !== editingPlayer?.id
      );

      if (existingPlayer) {
        setError(
          `Jersey number ${formData.jerseyNumber} is already taken by ${existingPlayer.name}`
        );
        return;
      }

      if (editingPlayer) {
        // Update existing player
        const { error } = await supabase
          .from("players")
          .update({
            name: formData.name,
            jersey_number: formData.jerseyNumber,
            quote: formData.quote,
            team_id: formData.teamId,
            sport_type: formData.sportType,
          })
          .eq("id", editingPlayer.id);

        if (error) throw error;
      } else {
        // Create new player
        const { error } = await supabase.from("players").insert([
          {
            name: formData.name,
            jersey_number: formData.jerseyNumber,
            quote: formData.quote,
            team_id: formData.teamId,
            sport_type: formData.sportType,
          },
        ]);

        if (error) throw error;
      }

      await fetchData();
      resetForm();
    } catch (err) {
      setError(`Failed to ${editingPlayer ? "update" : "create"} player`);
      console.error("Player save error:", err);
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      jerseyNumber: player.jerseyNumber,
      quote: player.quote,
      teamId: player.teamId,
      sportType: player.sportType,
    });
    setShowForm(true);
  };

  const handleDelete = async (playerId: string) => {
    if (!confirm("Are you sure you want to delete this player?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", playerId);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      setError("Failed to delete player");
      console.error("Player delete error:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      jerseyNumber: 1,
      quote: "",
      teamId: "",
      sportType: "kickball",
    });
    setEditingPlayer(null);
    setShowForm(false);
    setError(null);
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "Unknown Team";
  };

  const getTeamGradient = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    const gradientClasses = {
      orange: "from-orange-400 to-red-500",
      green: "from-green-400 to-emerald-500",
      blue: "from-blue-400 to-indigo-500",
      pink: "from-pink-400 to-rose-500",
      white: "from-gray-100 to-gray-200",
      black: "from-gray-700 to-gray-900",
      gray: "from-gray-400 to-gray-600",
      brown: "from-amber-600 to-amber-800",
      purple: "from-purple-400 to-purple-600",
      yellow: "from-yellow-400 to-yellow-600",
      red: "from-red-400 to-red-600",
      cyan: "from-cyan-300 to-cyan-500",
    };
    return team ? gradientClasses[team.gradient as keyof typeof gradientClasses] || gradientClasses.blue : gradientClasses.blue;
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTeam = teamFilter === "all" || player.teamId === teamFilter;
    const matchesSport =
      sportFilter === "all" || player.sportType === sportFilter;
    return matchesSearch && matchesTeam && matchesSport;
  });

  const availableTeams = teams.filter(
    team => team.sportType === formData.sportType
  );

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
        <h1 className="text-3xl font-bold text-gray-900">Player Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Player
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={teamFilter}
              onChange={e => setTeamFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Teams</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={sportFilter}
              onChange={e =>
                setSportFilter(
                  e.target.value as "all" | "kickball" | "dodgeball"
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Sports</option>
              <option value="kickball">Kickball</option>
              <option value="dodgeball">Dodgeball</option>
            </select>
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        {filteredPlayers.map(player => (
          <div
            key={player.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div
              className={`h-24 bg-gradient-to-r ${getTeamGradient(
                player.teamId
              )} flex items-center justify-center`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  #{player.jerseyNumber}
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {player.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {getTeamName(player.teamId)}
              </p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                "{player.quote}"
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span className="px-2 py-1 bg-gray-100 rounded-full capitalize">
                  {player.sportType}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(player)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(player.id)}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No players found matching your criteria.
          </p>
        </div>
      )}

      {/* Player Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingPlayer ? "Edit Player" : "Add New Player"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Player Name
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
                  value={formData.sportType}
                  onChange={e => {
                    const newSportType = e.target.value as
                      | "kickball"
                      | "dodgeball";
                    setFormData({
                      ...formData,
                      sportType: newSportType,
                      teamId: "", // Reset team when sport changes
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="kickball">Kickball</option>
                  <option value="dodgeball">Dodgeball</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team
                </label>
                <select
                  required
                  value={formData.teamId}
                  onChange={e =>
                    setFormData({ ...formData, teamId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a team</option>
                  {availableTeams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jersey Number
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  required
                  value={formData.jerseyNumber}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      jerseyNumber: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Player Quote
                </label>
                <textarea
                  value={formData.quote}
                  onChange={e =>
                    setFormData({ ...formData, quote: e.target.value })
                  }
                  rows={3}
                  placeholder="Enter a motivational quote or personal motto..."
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
                  {editingPlayer ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
