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
export const getAllLocations = () => locationsApi.getAll();
export const getAllGames = () => gamesApi.getAll();

// Helper functions that maintain compatibility with existing code
export const getTeamCaptain = async (team: any) => {
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
  return locations.filter(location => location.concessions);
};

export const getLocationsByCapacity = async (minCapacity: number) => {
  const locations = await getAllLocations();
  return locations.filter(location => (location.capacity || 0) >= minCapacity);
};

export const getGamesByLocation = (locationId: string) => {
  return gamesApi
    .getAll()
    .then(games => games.filter(game => game.location.id === locationId));
};
