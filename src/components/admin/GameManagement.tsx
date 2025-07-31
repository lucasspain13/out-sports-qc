import React, { useEffect, useState } from "react";
import { gamesApi, locationsApi, teamsApi } from "../../lib/database";
import { sportsInfoApi } from "../../lib/contentManagement";
import { supabase } from "../../lib/supabase";
import { Game, GameLocation, Team } from "../../types";
import { SportsInfo } from "../../lib/contentManagement";

interface GameFormData {
  homeTeamId: string;
  awayTeamId: string;
  locationId: string;
  scheduledAt: string;
  gameTime: string;
  sportType: "kickball" | "dodgeball";
  weekNumber: number;
  season: string;
  year: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "postponed" | "archived";
  homeScore?: number;
  awayScore?: number;
  selectedSportInfo?: SportsInfo; // Store the complete sports info for the selected sport
}

export const GameManagement: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [locations, setLocations] = useState<GameLocation[]>([]);
  const [sportsInfo, setSportsInfo] = useState<SportsInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sportFilter, setSportFilter] = useState<
    "all" | "kickball" | "dodgeball"
  >("all");
  const [formData, setFormData] = useState<GameFormData>({
    homeTeamId: "",
    awayTeamId: "",
    locationId: "",
    scheduledAt: "",
    gameTime: "",
    sportType: "kickball",
    weekNumber: 1,
    season: "Summer 2025",
    year: new Date().getFullYear(),
    status: "scheduled",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gamesData, teamsData, locationsData, sportsData] = await Promise.all([
        gamesApi.getAll(),
        teamsApi.getAll(),
        locationsApi.getAll(),
        sportsInfoApi.getAll(),
      ]);
      setGames(gamesData);
      setTeams(teamsData);
      setLocations(locationsData);
      setSportsInfo(sportsData);
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
      if (formData.homeTeamId === formData.awayTeamId) {
        setError("Home and away teams must be different");
        return;
      }

      const gameData = {
        home_team_id: formData.homeTeamId,
        away_team_id: formData.awayTeamId,
        location_id: formData.locationId,
        scheduled_at: formData.scheduledAt,
        game_time: formData.gameTime,
        sport_type: formData.sportType,
        week_number: formData.weekNumber,
        season: formData.season,
        year: formData.year,
        status: formData.status,
        home_score:
          formData.homeScore !== undefined ? formData.homeScore : null,
        away_score:
          formData.awayScore !== undefined ? formData.awayScore : null,
      };

      if (editingGame) {
        // Update existing game
        const { error } = await supabase
          .from("games")
          .update(gameData)
          .eq("id", editingGame.id);

        if (error) throw error;
      } else {
        // Create new game
        const { error } = await supabase.from("games").insert([gameData]);

        if (error) throw error;
      }

      await fetchData();
      resetForm();
    } catch (err) {
      setError(`Failed to ${editingGame ? "update" : "create"} game`);
      console.error("Game save error:", err);
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    // Find the corresponding sports info for this game
    const correspondingSport = sportsInfo.find(sport => 
      sport.name === game.sportType && 
      sport.season === game.season && 
      sport.year === game.year
    );
    
    setFormData({
      homeTeamId: game.homeTeam.id,
      awayTeamId: game.awayTeam.id,
      locationId: game.location.id,
      scheduledAt: game.date.toISOString().slice(0, 16),
      gameTime: game.time,
      sportType: game.sportType,
      weekNumber: game.week,
      season: game.season,
      year: game.year,
      status: game.status,
      homeScore: game.scores?.homeScore,
      awayScore: game.scores?.awayScore,
      selectedSportInfo: correspondingSport,
    });
    setShowForm(true);
  };

  const handleDelete = async (gameId: string) => {
    if (!confirm("Are you sure you want to delete this game?")) {
      return;
    }

    try {
      const { error } = await supabase.from("games").delete().eq("id", gameId);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      setError("Failed to delete game");
      console.error("Game delete error:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      homeTeamId: "",
      awayTeamId: "",
      locationId: "",
      scheduledAt: "",
      gameTime: "",
      sportType: "kickball",
      weekNumber: 1,
      season: "",
      year: new Date().getFullYear(),
      status: "scheduled",
      selectedSportInfo: undefined,
    });
    setEditingGame(null);
    setShowForm(false);
    setError(null);
  };

  // Archive games by season, year, and sport
  // const archiveGamesByCriteria = async (season: string, year: number, sportType: "kickball" | "dodgeball") => {
  //   try {
  //     const gamesToArchive = games.filter(
  //       game => 
  //         game.season === season && 
  //         game.year === year && 
  //         game.sportType === sportType &&
  //         game.status !== "archived"
  //     );

  //     if (gamesToArchive.length === 0) {
  //       alert("No games found matching the criteria.");
  //       return;
  //     }

  //     const confirmMessage = `Archive ${gamesToArchive.length} games from ${season} ${year} ${sportType}?`;
  //     if (!confirm(confirmMessage)) return;

  //     for (const game of gamesToArchive) {
  //       await supabase
  //         .from("games")
  //         .update({ status: "archived" })
  //         .eq("id", game.id);
  //     }

  //     await fetchData();
  //     alert(`Successfully archived ${gamesToArchive.length} games.`);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Failed to archive games");
  //   }
  // };

  const filteredGames = games.filter(game => {
    const matchesStatus =
      statusFilter === "all" || game.status === statusFilter;
    const matchesSport =
      sportFilter === "all" || game.sportType === sportFilter;
    return matchesStatus && matchesSport;
  });

  const availableTeams = teams.filter(
    team => team.sportType === formData.sportType
  );

  // Get active and coming soon sports for the dropdown
  const getAvailableSports = () => {
    return sportsInfo
      .filter(sport => sport.isActive || sport.comingSoon)
      .sort((a, b) => {
        // Sort by year ascending, then season order, then sport name
        const seasonOrder = { "Spring": 1, "Summer": 2, "Fall": 3, "Winter": 4 };
        
        if (a.year !== b.year) {
          return (a.year || 0) - (b.year || 0);
        }
        
        const seasonA = seasonOrder[a.season as keyof typeof seasonOrder] || 999;
        const seasonB = seasonOrder[b.season as keyof typeof seasonOrder] || 999;
        if (seasonA !== seasonB) {
          return seasonA - seasonB;
        }
        
        return (a.name || "").localeCompare(b.name || "");
      });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      postponed: "bg-gray-100 text-gray-800",
      archived: "bg-purple-100 text-purple-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
        <h1 className="text-3xl font-bold text-gray-900">Game Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Schedule New Game
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="postponed">Postponed</option>
              <option value="archived">Archived</option>
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

      {/* Games List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Season
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sport
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGames.map(game => (
                <tr key={game.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {game.homeTeam.name} vs {game.awayTeam.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Week {game.week}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {game.season}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {game.year}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {game.sportType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {game.date.toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{game.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {game.location.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {game.location.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(
                        game.status
                      )}`}
                    >
                      {game.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {game.scores ? (
                      <div>
                        <span className="font-medium">
                          {game.homeTeam.name}:
                        </span>{" "}
                        {game.scores.homeScore}
                        <br />
                        <span className="font-medium">
                          {game.awayTeam.name}:
                        </span>{" "}
                        {game.scores.awayScore}
                      </div>
                    ) : (
                      <span className="text-gray-400">No score</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(game)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(game.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No games found matching your criteria.
          </p>
        </div>
      )}

      {/* Game Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingGame ? "Edit Game" : "Schedule New Game"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sport
                  </label>
                  <select
                    value={formData.selectedSportInfo?.id || ""}
                    onChange={e => {
                      const selectedSport = getAvailableSports().find(sport => sport.id === e.target.value);
                      if (selectedSport) {
                        setFormData({
                          ...formData,
                          selectedSportInfo: selectedSport,
                          sportType: selectedSport.name as "kickball" | "dodgeball",
                          season: selectedSport.season || "",
                          year: selectedSport.year || new Date().getFullYear(),
                          homeTeamId: "",
                          awayTeamId: "",
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Sport</option>
                    {getAvailableSports().map(sport => (
                      <option key={sport.id} value={sport.id}>
                        {sport.season} {sport.year} {sport.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="postponed">Postponed</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Team
                  </label>
                  <select
                    required
                    value={formData.homeTeamId}
                    onChange={e =>
                      setFormData({ ...formData, homeTeamId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select home team</option>
                    {availableTeams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Away Team
                  </label>
                  <select
                    required
                    value={formData.awayTeamId}
                    onChange={e =>
                      setFormData({ ...formData, awayTeamId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select away team</option>
                    {availableTeams
                      .filter(team => team.id !== formData.homeTeamId)
                      .map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    required
                    value={formData.locationId}
                    onChange={e =>
                      setFormData({ ...formData, locationId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduledAt}
                    onChange={e =>
                      setFormData({ ...formData, scheduledAt: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Game Time Display
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 7:00 PM"
                    value={formData.gameTime}
                    onChange={e =>
                      setFormData({ ...formData, gameTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Week Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.weekNumber}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        weekNumber: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {(formData.status === "completed" ||
                  formData.status === "in-progress") && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Home Team Score
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={
                          formData.homeScore !== undefined
                            ? formData.homeScore
                            : ""
                        }
                        onChange={e => {
                          const value = e.target.value;
                          setFormData({
                            ...formData,
                            homeScore:
                              value === "" ? undefined : parseInt(value, 10),
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Away Team Score
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={
                          formData.awayScore !== undefined
                            ? formData.awayScore
                            : ""
                        }
                        onChange={e => {
                          const value = e.target.value;
                          setFormData({
                            ...formData,
                            awayScore:
                              value === "" ? undefined : parseInt(value, 10),
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
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
                  {editingGame ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
