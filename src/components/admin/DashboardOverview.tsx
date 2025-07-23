import React, { useEffect, useState } from "react";
import {
  gamesApi,
  locationsApi,
  playersApi,
  teamsApi,
} from "../../lib/database";

interface DashboardStats {
  totalTeams: number;
  totalPlayers: number;
  totalGames: number;
  totalLocations: number;
  upcomingGames: number;
  completedGames: number;
}

interface DashboardOverviewProps {
  onNavigate?: (page: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
}) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTeams: 0,
    totalPlayers: 0,
    totalGames: 0,
    totalLocations: 0,
    upcomingGames: 0,
    completedGames: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [teams, players, games, locations] = await Promise.all([
          teamsApi.getAll(),
          playersApi.getAll(),
          gamesApi.getAll(),
          locationsApi.getAll(),
        ]);

        const upcomingGames = games.filter(
          game =>
            game.status === "scheduled" && new Date(game.date) > new Date()
        ).length;

        const completedGames = games.filter(
          game => game.status === "completed"
        ).length;

        setStats({
          totalTeams: teams.length,
          totalPlayers: players.length,
          totalGames: games.length,
          totalLocations: locations.length,
          upcomingGames,
          completedGames,
        });
      } catch (err) {
        setError("Failed to load dashboard statistics");
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-red-600 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Teams",
      value: stats.totalTeams,
      color: "blue",
      icon: "👥",
      page: "teams",
    },
    {
      title: "Total Players",
      value: stats.totalPlayers,
      color: "green",
      icon: "🏃",
      page: "players",
    },
    {
      title: "Total Games",
      value: stats.totalGames,
      color: "purple",
      icon: "🏆",
      page: "games",
    },
    {
      title: "Locations",
      value: stats.totalLocations,
      color: "orange",
      icon: "📍",
      page: "locations",
    },
    {
      title: "Upcoming Games",
      value: stats.upcomingGames,
      color: "indigo",
      icon: "📅",
      page: "games",
    },
    {
      title: "Completed Games",
      value: stats.completedGames,
      color: "gray",
      icon: "✅",
      page: "games",
    },
  ];

  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    indigo: "text-indigo-600",
    gray: "text-gray-600",
  };

  return (
    <div>
      {/* Mobile-first header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Welcome to the Sports League Admin Dashboard
        </p>
      </div>

      {/* Stats Grid - iOS-style clickable cards */}
      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((card, index) => (
          <button
            key={index}
            onClick={() => onNavigate?.(card.page)}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow p-4 sm:p-6 ios-card ios-card-elevated hover:shadow-md sm:hover:shadow-lg transition-all duration-200 text-left hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p
                  className={`text-xl sm:text-3xl font-bold ${
                    colorClasses[card.color as keyof typeof colorClasses]
                  }`}
                >
                  {card.value}
                </p>
              </div>
              <div className="text-lg sm:text-3xl self-end sm:self-auto">
                {card.icon}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
