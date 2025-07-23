import { motion } from "framer-motion";
import React, { useState } from "react";
import { usePlatform } from "../../../hooks/usePlatform";
import { useRealtimeScores } from "../../../hooks/useRealtimeScores";
import { navigateToGame } from "../../../lib/navigation";
import { Game } from "../../../types";
import MobileSettingsScreen from "./MobileSettingsScreen";

interface LiveScoresScreenProps {
  className?: string;
}

const LiveScoresScreen: React.FC<LiveScoresScreenProps> = ({
  className = "",
}) => {
  const platform = usePlatform();
  const { liveGames, loading, error } = useRealtimeScores();
  const [refreshing, setRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // If settings is open, show settings screen
  if (showSettings) {
    return <MobileSettingsScreen onBack={() => setShowSettings(false)} />;
  }

  // Filter games by status
  const gamesInProgress = liveGames.filter(
    game => game.status === "in-progress"
  );
  const upcomingGames = liveGames.filter(game => game.status === "scheduled");
  const completedGames = liveGames.filter(game => game.status === "completed");

  const handleRefresh = async () => {
    setRefreshing(true);
    // Add haptic feedback
    if (platform.isNative) {
      try {
        navigator.vibrate?.(50);
      } catch (e) {
        // Ignore if vibration not supported
      }
    }

    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Platform-specific styles
  const styles = {
    container: platform.isIOS
      ? "bg-gray-50 min-h-screen"
      : platform.isAndroid
      ? "bg-gray-100 min-h-screen"
      : "bg-white min-h-screen",
    spinner: platform.isIOS
      ? "w-8 h-8 border-2 border-blue-500 border-t-transparent"
      : "w-6 h-6 border-2 border-blue-600 border-t-transparent",
    loadingText: platform.isIOS
      ? "text-gray-600 text-base"
      : platform.isAndroid
      ? "text-gray-700 text-sm"
      : "text-gray-600 text-sm",
    errorTitle: platform.isIOS
      ? "text-xl font-semibold text-gray-900 mb-2"
      : platform.isAndroid
      ? "text-lg font-medium text-gray-900 mb-2"
      : "text-lg font-semibold text-gray-900 mb-2",
    button: platform.isIOS
      ? "bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-medium"
      : platform.isAndroid
      ? "bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-medium"
      : "bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-medium",
    header: platform.isIOS
      ? "bg-white border-b border-gray-200 px-4 py-6 pt-12"
      : platform.isAndroid
      ? "bg-white px-4 py-4 pt-8 shadow-sm"
      : "bg-white border-b border-gray-200 px-4 py-6",
    title: platform.isIOS
      ? "text-3xl font-bold text-gray-900"
      : platform.isAndroid
      ? "text-2xl font-medium text-gray-900"
      : "text-2xl font-bold text-gray-900",
    refreshButton: platform.isIOS
      ? "w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
      : "w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center",
    sectionTitle: platform.isIOS
      ? "text-lg font-semibold text-gray-900"
      : platform.isAndroid
      ? "text-base font-medium text-gray-900"
      : "text-base font-semibold text-gray-900",
    liveTitle: platform.isIOS
      ? "text-lg font-semibold text-gray-900 uppercase tracking-wide"
      : platform.isAndroid
      ? "text-base font-medium text-gray-900 uppercase tracking-wide"
      : "text-base font-semibold text-gray-900 uppercase tracking-wide",
    emptyTitle: platform.isIOS
      ? "text-xl font-semibold text-gray-900 mb-2"
      : platform.isAndroid
      ? "text-lg font-medium text-gray-900 mb-2"
      : "text-lg font-semibold text-gray-900 mb-2",
  };

  if (loading && !refreshing) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div
              className={`${styles.spinner} animate-spin rounded-full mx-auto mb-4`}
            />
            <p className={styles.loadingText}>Loading live scores...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className="flex items-center justify-center pt-20">
          <div className="text-center px-6">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className={styles.errorTitle}>Unable to Load Scores</h2>
            <p className="text-gray-600 text-sm mb-6">
              Check your connection and try again.
            </p>
            <button
              onClick={handleRefresh}
              className={`${styles.button} text-white transition-colors`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Pull to refresh indicator */}
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm py-4">
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent animate-spin rounded-full mr-3" />
            <span className="text-sm text-gray-600">Refreshing...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className="flex items-center justify-between">
          <h1 className={styles.title}>Live Scores</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(true)}
              className={`${styles.refreshButton} transition-colors`}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`${styles.refreshButton} transition-colors`}
            >
              <motion.div
                animate={{ rotate: refreshing ? 360 : 0 }}
                transition={{
                  duration: 1,
                  repeat: refreshing ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {/* Live Games Section */}
        {gamesInProgress.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3" />
              <h2 className={`${styles.liveTitle} mb-4`}>Live Now</h2>
            </div>
            <div className="space-y-3">
              {gamesInProgress.map((game, index) => (
                <GameCard
                  key={game.id}
                  game={game}
                  platform={platform}
                  delay={index * 0.1}
                  isLive={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Games Section */}
        {upcomingGames.length > 0 && (
          <div className="mb-8">
            <h2 className={`${styles.sectionTitle} mb-4`}>Upcoming Today</h2>
            <div className="space-y-3">
              {upcomingGames.slice(0, 5).map((game, index) => (
                <GameCard
                  key={game.id}
                  game={game}
                  platform={platform}
                  delay={index * 0.1}
                  isLive={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Results Section */}
        {completedGames.length > 0 && (
          <div className="mb-8">
            <h2 className={`${styles.sectionTitle} mb-4`}>Recent Results</h2>
            <div className="space-y-3">
              {completedGames.slice(0, 3).map((game, index) => (
                <GameCard
                  key={game.id}
                  game={game}
                  platform={platform}
                  delay={index * 0.1}
                  isLive={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!gamesInProgress.length &&
          !upcomingGames.length &&
          !completedGames.length && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className={styles.emptyTitle}>No Games Today</h2>
              <p className="text-gray-600 text-sm mb-6">
                Check back later for live scores and updates.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

interface GameCardProps {
  game: Game;
  platform: ReturnType<typeof usePlatform>;
  delay: number;
  isLive: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  platform,
  delay,
  isLive,
}) => {
  const homeScore = game.scores?.homeScore || 0;
  const awayScore = game.scores?.awayScore || 0;

  const handleGameClick = () => {
    // Add haptic feedback
    if (platform.isNative) {
      try {
        navigator.vibrate?.(30);
      } catch (e) {
        // Ignore if vibration not supported
      }
    }
    navigateToGame(game.id);
  };

  // Platform-specific card styles
  const cardStyles = platform.isIOS
    ? "bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
    : platform.isAndroid
    ? "bg-white rounded-lg shadow-md p-4"
    : "bg-white rounded-lg shadow-sm border border-gray-200 p-4";

  const hoverEffect = platform.isIOS
    ? "hover:shadow-md"
    : platform.isAndroid
    ? "hover:shadow-lg"
    : "hover:shadow-md";

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      onClick={handleGameClick}
      className={`${cardStyles} w-full ${hoverEffect} transition-all duration-200 active:scale-98`}
    >
      <div className="flex items-center justify-between">
        {/* Away Team */}
        <div className="flex-1 text-left">
          <div
            className={
              platform.isIOS
                ? "text-base font-semibold text-gray-900"
                : platform.isAndroid
                ? "text-sm font-medium text-gray-900"
                : "text-sm font-semibold text-gray-900"
            }
          >
            {game.awayTeam.name}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
            {game.sportType}
          </div>
        </div>

        {/* Score/Time */}
        <div className="flex items-center px-4">
          {isLive ? (
            <div className="flex items-center space-x-3">
              <span
                className={
                  platform.isIOS
                    ? "text-2xl font-bold text-gray-900 tabular-nums"
                    : platform.isAndroid
                    ? "text-xl font-bold text-gray-900 tabular-nums"
                    : "text-xl font-bold text-gray-900 tabular-nums"
                }
              >
                {awayScore}
              </span>
              <span className="text-gray-400 font-medium">-</span>
              <span
                className={
                  platform.isIOS
                    ? "text-2xl font-bold text-gray-900 tabular-nums"
                    : platform.isAndroid
                    ? "text-xl font-bold text-gray-900 tabular-nums"
                    : "text-xl font-bold text-gray-900 tabular-nums"
                }
              >
                {homeScore}
              </span>
            </div>
          ) : (
            <div className="text-center">
              <div
                className={
                  platform.isIOS
                    ? "text-base font-semibold text-gray-900"
                    : platform.isAndroid
                    ? "text-sm font-medium text-gray-900"
                    : "text-sm font-semibold text-gray-900"
                }
              >
                {new Date(game.date).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
              {game.status === "completed" && (
                <div className="text-xs text-gray-500 mt-1">Final</div>
              )}
            </div>
          )}
        </div>

        {/* Home Team */}
        <div className="flex-1 text-right">
          <div
            className={
              platform.isIOS
                ? "text-base font-semibold text-gray-900"
                : platform.isAndroid
                ? "text-sm font-medium text-gray-900"
                : "text-sm font-semibold text-gray-900"
            }
          >
            {game.homeTeam.name}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
            {game.location.name}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default LiveScoresScreen;
