import React, { useState } from "react";
import { gameLocations } from "../../data/locations";
import { dodgeballSchedule, kickballSchedule } from "../../data/schedules";
import { Game, GameLocation } from "../../types";
import { GameCard, LocationMap, ScheduleWeek } from "../ui";

const ScheduleDemo: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<GameLocation | null>(
    null
  );
  const [selectedSport, setSelectedSport] = useState<"kickball" | "dodgeball">(
    "kickball"
  );

  const currentSchedule =
    selectedSport === "kickball" ? kickballSchedule : dodgeballSchedule;

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setSelectedLocation(game.location);
  };

  const handleLocationSelect = (location: GameLocation) => {
    setSelectedLocation(location);
  };

  // Get some sample games for individual GameCard demo
  const sampleGames = currentSchedule.weeks[0]?.games.slice(0, 2) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2 text-gray-900 mb-4">
            Schedule UI Components Demo
          </h1>
          <p className="body-base text-gray-600 mb-6">
            Demonstrating the GameCard, LocationMap, and ScheduleWeek components
            with live data.
          </p>

          {/* Sport Selector */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setSelectedSport("kickball")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSport === "kickball"
                  ? "bg-brand-teal text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              ⚽ Kickball
            </button>
            <button
              onClick={() => setSelectedSport("dodgeball")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSport === "dodgeball"
                  ? "bg-brand-teal text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              🏐 Dodgeball
            </button>
          </div>
        </div>

        {/* Individual GameCard Demo */}
        <section className="mb-12">
          <h2 className="heading-3 text-gray-900 mb-6">
            Individual Game Cards
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sampleGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => handleGameSelect(game)}
                showLocation={true}
                showScore={
                  game.status === "completed" || game.status === "in-progress"
                }
              />
            ))}
          </div>
        </section>

        {/* Location Map Demo */}
        <section className="mb-12">
          <h2 className="heading-3 text-gray-900 mb-6">Location Map</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Single Location Map */}
            <div>
              <h3 className="card-title text-gray-900 mb-4">
                {selectedLocation ? selectedLocation.name : "All Locations"}
              </h3>
              <LocationMap
                locations={
                  selectedLocation ? [selectedLocation] : gameLocations
                }
                selectedLocation={selectedLocation || undefined}
                onLocationSelect={handleLocationSelect}
                height="400px"
                showAllMarkers={!selectedLocation}
              />
            </div>

            {/* Location List */}
            <div>
              <h3 className="card-title text-gray-900 mb-4">
                Available Locations
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {gameLocations.map(location => (
                  <div
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedLocation?.id === location.id
                        ? "border-brand-teal bg-brand-teal/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900">
                      {location.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {location.address}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="capitalize">{location.fieldType}</span>
                      {location.capacity && (
                        <span>Capacity: {location.capacity}</span>
                      )}
                      <div className="flex space-x-2">
                        {location.parking && <span>🅿️</span>}
                        {location.restrooms && <span>🚻</span>}
                        {location.concessions && <span>🍿</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Week Demo */}
        <section className="mb-12">
          <h2 className="heading-3 text-gray-900 mb-6">Weekly Schedule</h2>
          <div className="space-y-6">
            {currentSchedule.weeks.slice(0, 4).map(week => (
              <ScheduleWeek
                key={week.weekNumber}
                week={week}
                onGameSelect={handleGameSelect}
                showLocations={true}
              />
            ))}
          </div>
        </section>

        {/* Selected Game Details */}
        {selectedGame && (
          <section className="mb-12">
            <h2 className="heading-3 text-gray-900 mb-6">
              Selected Game Details
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="card-title text-gray-900 mb-4">
                    Game Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Matchup:
                      </span>
                      <p className="text-gray-900">
                        {selectedGame.awayTeam.name} @{" "}
                        {selectedGame.homeTeam.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Date & Time:
                      </span>
                      <p className="text-gray-900">
                        {selectedGame.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at {selectedGame.time}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Status:
                      </span>
                      <p className="text-gray-900 capitalize">
                        {selectedGame.status}
                      </p>
                    </div>
                    {selectedGame.scores && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Final Score:
                        </span>
                        <p className="text-gray-900">
                          {selectedGame.awayTeam.name}:{" "}
                          {selectedGame.scores.awayScore} -{" "}
                          {selectedGame.homeTeam.name}:{" "}
                          {selectedGame.scores.homeScore}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="card-title text-gray-900 mb-4">Location</h3>
                  <LocationMap
                    locations={[selectedGame.location]}
                    selectedLocation={selectedGame.location}
                    height="300px"
                    showAllMarkers={false}
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ScheduleDemo;
