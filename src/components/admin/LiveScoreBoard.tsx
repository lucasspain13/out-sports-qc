import React, { useState } from "react";
import { useAdminAuth } from "../../hooks/useAuth";
import { useRealtimeScores } from "../../hooks/useRealtimeScores";
import { Game } from "../../types";

interface ScoreControlsProps {
  game: Game;
  onIncrement: (team: "home" | "away") => void;
  onDecrement: (team: "home" | "away") => void;
  onScoreChange: (team: "home" | "away", score: number) => void;
}

const ScoreControls: React.FC<ScoreControlsProps> = ({
  game,
  onIncrement,
  onDecrement,
  onScoreChange,
}) => {
  const homeScore = game.scores?.homeScore || 0;
  const awayScore = game.scores?.awayScore || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Game Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {game.homeTeam.name} vs {game.awayTeam.name}
        </h2>
        <div className="text-sm text-gray-600">
          {game.location.name} • {game.time}
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
          Live Game
        </div>
      </div>

      {/* Score Display */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Home Team */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {game.homeTeam.name}
          </h3>
          <div className="text-6xl font-bold text-blue-600 mb-6">
            {homeScore}
          </div>
          <div className="space-y-3">
            {/* Direct Score Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Score
              </label>
              <input
                type="number"
                min="0"
                value={homeScore}
                onChange={e => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value)) {
                    onScoreChange("home", value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
              />
            </div>

            <button
              onClick={() => onIncrement("home")}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
            >
              +1
            </button>
            <button
              onClick={() => onDecrement("home")}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
            >
              -1
            </button>
          </div>
        </div>

        {/* Away Team */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {game.awayTeam.name}
          </h3>
          <div className="text-6xl font-bold text-purple-600 mb-6">
            {awayScore}
          </div>
          <div className="space-y-3">
            {/* Direct Score Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Score
              </label>
              <input
                type="number"
                min="0"
                value={awayScore}
                onChange={e => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value)) {
                    onScoreChange("away", value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
              />
            </div>

            <button
              onClick={() => onIncrement("away")}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
            >
              +1
            </button>
            <button
              onClick={() => onDecrement("away")}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
            >
              -1
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t pt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              onIncrement("home");
              setTimeout(() => onIncrement("home"), 100);
              setTimeout(() => onIncrement("home"), 200);
            }}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            {game.homeTeam.name} +3
          </button>
          <button
            onClick={() => {
              onIncrement("away");
              setTimeout(() => onIncrement("away"), 100);
              setTimeout(() => onIncrement("away"), 200);
            }}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            {game.awayTeam.name} +3
          </button>
        </div>
      </div>
    </div>
  );
};

interface ConnectionStatusProps {
  status: "connected" | "disconnected" | "reconnecting";
  lastUpdate: Date | null;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  lastUpdate,
}) => (
  <div className="flex items-center space-x-2">
    <div
      className={`w-3 h-3 rounded-full ${
        status === "connected"
          ? "bg-green-500 animate-pulse"
          : status === "reconnecting"
          ? "bg-yellow-500 animate-pulse"
          : "bg-red-500"
      }`}
    ></div>
    <span className="text-sm text-gray-600">
      {status === "connected"
        ? "Real-time updates active"
        : status === "reconnecting"
        ? "Reconnecting..."
        : "Connection lost"}
    </span>
    {lastUpdate && (
      <span className="text-xs text-gray-400">
        Last update: {lastUpdate.toLocaleTimeString()}
      </span>
    )}
  </div>
);

export const LiveScoreBoard: React.FC = () => {
  const { isAdmin } = useAdminAuth();
  const {
    liveGames,
    loading,
    error,
    connectionStatus,
    lastUpdate,
    updateScore,
    incrementScore,
    decrementScore,
  } = useRealtimeScores();
  const [selectedGameId, setSelectedGameId] = useState<string>("");

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">
          Admin privileges required to access live score management.
        </p>
      </div>
    );
  }

  const selectedGame = liveGames.find(game => game.id === selectedGameId);

  const handleIncrement = async (team: "home" | "away") => {
    if (!selectedGameId) return;
    await incrementScore(selectedGameId, team);
  };

  const handleDecrement = async (team: "home" | "away") => {
    if (!selectedGameId) return;
    await decrementScore(selectedGameId, team);
  };

  const handleScoreChange = async (team: "home" | "away", newScore: number) => {
    if (!selectedGameId || !selectedGame) return;

    const currentHomeScore = selectedGame.scores?.homeScore || 0;
    const currentAwayScore = selectedGame.scores?.awayScore || 0;

    const homeScore = team === "home" ? newScore : currentHomeScore;
    const awayScore = team === "away" ? newScore : currentAwayScore;

    await updateScore(selectedGameId, homeScore, awayScore);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Live Score Management
        </h1>
        <ConnectionStatus status={connectionStatus} lastUpdate={lastUpdate} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Game Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Live Game
        </label>
        <select
          value={selectedGameId}
          onChange={e => setSelectedGameId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        >
          <option value="">Choose a game to manage...</option>
          {liveGames.map(game => (
            <option key={game.id} value={game.id}>
              {game.homeTeam.name} vs {game.awayTeam.name} - {game.time}
              {game.scores &&
                ` (${game.scores.homeScore}-${game.scores.awayScore})`}
            </option>
          ))}
        </select>
        {liveGames.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {liveGames.length} live game{liveGames.length !== 1 ? "s" : ""}{" "}
            available
          </p>
        )}
      </div>

      {liveGames.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Live Games
          </h3>
          <p className="text-gray-500 mb-4">
            There are currently no games in progress. Games must be marked as
            "in-progress" to appear here.
          </p>
          <p className="text-sm text-gray-400">
            Go to Games management to change a game's status to "in-progress" to
            start live scoring.
          </p>
        </div>
      )}

      {/* Score Controls */}
      {selectedGame && (
        <ScoreControls
          game={selectedGame}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onScoreChange={handleScoreChange}
        />
      )}

      {/* Instructions */}
      {liveGames.length > 0 && !selectedGame && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Select a game to start managing scores
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Choose a live game from the dropdown above to display the score
                management controls.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
