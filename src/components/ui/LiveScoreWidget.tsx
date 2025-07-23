import React from "react";
import { useRealtimeScores } from "../../hooks/useRealtimeScores";
import { navigateToGame } from "../../lib/navigation";
import { Game } from "../../types";

interface LiveScoreWidgetProps {
  className?: string;
  isDarkMode?: boolean;
}

const LiveScoreWidget: React.FC<LiveScoreWidgetProps> = ({
  className = "",
  isDarkMode = false,
}) => {
  const { liveGames, loading, error } = useRealtimeScores();

  // Color schemes based on mode
  const textColor = isDarkMode ? "text-gray-900" : "text-white/90";
  const loadingColor = isDarkMode
    ? "border-gray-900/60 border-t-transparent"
    : "border-white/60 border-t-transparent";
  const errorColor = isDarkMode ? "text-red-600" : "text-red-300";
  const liveIndicatorColor = isDarkMode ? "bg-red-500" : "bg-red-400";

  // Filter for games that are actually in progress
  const gamesInProgress = liveGames.filter(
    game => game.status === "in-progress"
  );

  // Don't render if no games in progress
  if (!gamesInProgress.length && !loading) {
    return null;
  }

  if (loading) {
    return (
      <div
        className={`flex items-center space-x-2 bg-transparent ${textColor} ${className}`}
      >
        <div
          className={`animate-spin rounded-full h-3 w-3 border-2 ${loadingColor}`}
        ></div>
        <span className="text-xs font-medium">Live...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center space-x-2 bg-transparent ${errorColor} ${className}`}
      >
        <span className="text-xs font-medium">⚠️ Live scores unavailable</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center space-x-4 bg-transparent ${textColor} ${className}`}
    >
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 ${liveIndicatorColor} rounded-full animate-pulse`}
        ></div>
        <span className="text-xs font-semibold uppercase tracking-wide">
          LIVE
        </span>
      </div>

      <div className="flex items-center space-x-4 overflow-x-auto max-w-md">
        {gamesInProgress.slice(0, 2).map(game => (
          <GameScore key={game.id} game={game} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );
};

interface GameScoreProps {
  game: Game;
  isDarkMode?: boolean;
}

const GameScore: React.FC<GameScoreProps> = ({ game, isDarkMode = false }) => {
  const homeScore = game.scores?.homeScore || 0;
  const awayScore = game.scores?.awayScore || 0;

  // Color scheme for the game score button
  const buttonBg = isDarkMode
    ? "bg-gray-900/10 hover:bg-gray-900/20"
    : "bg-white/10 hover:bg-white/20";
  const borderColor = isDarkMode
    ? "border-gray-900/20 hover:border-gray-900/40"
    : "border-white/20 hover:border-white/40";
  const separatorColor = isDarkMode ? "text-gray-600" : "text-white/60";

  const handleGameClick = () => {
    navigateToGame(game.id);
  };

  return (
    <button
      onClick={handleGameClick}
      className={`flex items-center space-x-2 ${buttonBg} rounded-md px-2 py-1 transition-all duration-200 backdrop-blur-sm border ${borderColor} flex-shrink-0`}
    >
      {/* Away Team */}
      <div className="text-right">
        <div className="text-xs font-medium truncate max-w-12">
          {game.awayTeam.name}
        </div>
      </div>

      {/* Score */}
      <div className="flex items-center space-x-1">
        <span className="text-sm font-bold tabular-nums">{awayScore}</span>
        <span className={`${separatorColor} text-xs`}>-</span>
        <span className="text-sm font-bold tabular-nums">{homeScore}</span>
      </div>

      {/* Home Team */}
      <div className="text-left">
        <div className="text-xs font-medium truncate max-w-12">
          {game.homeTeam.name}
        </div>
      </div>
    </button>
  );
};

export default LiveScoreWidget;
