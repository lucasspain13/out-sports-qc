// Supabase data access layer - replaces static data files
import {
  gamesApi,
  getGameById,
  getLocationById,
  getPlayerById,
  getScheduleBySport,
  getTeamById,
  getTeamsBySport,
  locationsApi,
  playersApi,
  scheduleApi,
  teamsApi,
} from "../lib/database";
import { gameLocations } from "./locations";
import { Team } from "../types";

// Export all the APIs for direct use
export {
  gamesApi,
  getGameById,
  getLocationById,
  getPlayerById,
  getScheduleBySport,
  getTeamById,
  getTeamsBySport,
  locationsApi,
  playersApi,
  scheduleApi,
  teamsApi,
};

// Compatibility exports that match the static data structure
export const getAllTeams = () => teamsApi.getAll();
export const getKickballTeams = () => teamsApi.getBySport("kickball");
export const getDodgeballTeams = () => teamsApi.getBySport("dodgeball");
export const getAllPlayers = () => playersApi.getAll();

// Location functions - use database with fallback to static data
export const getAllLocations = async () => {
  try {
    const dbLocations = await locationsApi.getAll();
    // If database has locations, use them; otherwise fall back to static data
    return dbLocations.length > 0 ? dbLocations : gameLocations;
  } catch (error) {
    console.warn("Failed to load locations from database, using static data:", error);
    return gameLocations;
  }
};
export const getAllGames = () => gamesApi.getAll();

// Helper functions that maintain compatibility with existing code
export const getTeamCaptain = async (team: Team) => {
  if (!team.captain) return undefined;
  return await getPlayerById(team.captain);
};

export const getGamesByWeek = async (
  sportType: "kickball" | "dodgeball",
  weekNumber: number
) => {
  const schedule = await getScheduleBySport(sportType);
  const week = schedule.weeks.find(w => w.weekNumber === weekNumber);
  return week ? week.games : [];
};

export const getGamesByTeam = (teamId: string) => gamesApi.getByTeam(teamId);

export const getUpcomingGames = (sportType?: "kickball" | "dodgeball") =>
  gamesApi.getUpcoming(sportType);

export const getCompletedGames = async (
  sportType?: "kickball" | "dodgeball"
) => {
  const allGames = sportType
    ? await gamesApi.getBySport(sportType)
    : await gamesApi.getAll();

  return allGames
    .filter(game => game.status === "completed")
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Location helper functions
export const getLocationsByFieldType = async (fieldType: string) => {
  const locations = await getAllLocations();
  return locations.filter(location => location.fieldType === fieldType);
};

export const getLocationsWithConcessions = async () => {
  const locations = await getAllLocations();
  return locations.filter(location => 
    location.facilities.some(facility => 
      facility.toLowerCase().includes('concession')
    )
  );
};

export const getLocationsByCapacity = async (_minCapacity: number) => {
  const locations = await getAllLocations();
  // Since GameLocation doesn't have capacity, return all locations
  return locations;
};

export const getGamesByLocation = (locationId: string) => {
  return gamesApi
    .getAll()
    .then(games => games.filter(game => game.location.id === locationId));
};
