import type {
  Game,
  GameLocation,
  Player,
  Schedule,
  ScheduleWeek,
  Team,
} from "../types";
import type { Database } from "./supabase";
import { supabase } from "./supabase";

// Type aliases for database types
type DbTeam = Database["public"]["Tables"]["teams"]["Row"];
type DbPlayer = Database["public"]["Tables"]["players"]["Row"];
type DbGame = Database["public"]["Tables"]["games"]["Row"];
type DbLocation = Database["public"]["Tables"]["locations"]["Row"];

// Helper function to convert old color values to new ones
const convertLegacyGradient = (gradient: string): "orange" | "green" | "blue" | "pink" | "white" | "black" | "gray" | "brown" | "purple" | "yellow" | "red" | "cyan" => {
  // Map old color values to new ones
  const colorMap: Record<string, "orange" | "green" | "blue" | "pink" | "white" | "black" | "gray" | "brown" | "purple" | "yellow" | "red" | "cyan"> = {
    "teal": "green",
    "purple": "pink",
    // Keep all valid new colors as-is
    "orange": "orange",
    "green": "green", 
    "blue": "blue",
    "pink": "pink",
    "white": "white",
    "black": "black",
    "gray": "gray",
    "brown": "brown",
    "yellow": "yellow",
    "red": "red",
    "cyan": "cyan"
  };
  
  return colorMap[gradient] || "blue"; // Default to blue if unknown
};

// Transform database team to application team type
const transformTeam = (dbTeam: DbTeam, players: Player[] = []): Team => ({
  id: dbTeam.id,
  name: dbTeam.name,
  sportType: dbTeam.sport as "kickball" | "dodgeball",
  gradient: convertLegacyGradient(dbTeam.gradient),
  description: dbTeam.description || "",
  players,
  captain: dbTeam.captain_id || undefined,
  founded: dbTeam.founded || 2020,
  wins: dbTeam.wins || 0,
  losses: dbTeam.losses || 0,
  motto: dbTeam.motto || "",
});

// Transform database player to application player type
const transformPlayer = (dbPlayer: DbPlayer): Player => ({
  id: dbPlayer.id,
  name: dbPlayer.name,
  jerseyNumber: dbPlayer.jersey_number || 0,
  quote: dbPlayer.quote || "",
  avatar: dbPlayer.photo_url || "",
  teamId: dbPlayer.team_id,
  sportType: dbPlayer.sport_type as "kickball" | "dodgeball",
});

// Transform database location to application location type
const transformLocation = (dbLocation: any): GameLocation => ({
  id: dbLocation.id,
  name: dbLocation.name,
  address: dbLocation.address,
  city: dbLocation.city || "",
  state: dbLocation.state || "",
  zipCode: dbLocation.zip_code || "",
  coordinates: {
    lat: Number(dbLocation.latitude) || 0,
    lng: Number(dbLocation.longitude) || 0,
  },
  facilities: dbLocation.facilities || [],
  fieldType: dbLocation.field_type as "grass" | "turf" | "indoor" | "court",
  capacity: dbLocation.capacity || undefined,
  parking: dbLocation.parking,
  restrooms: dbLocation.restrooms,
  waterFountains: dbLocation.water_fountains || false,
  concessions: dbLocation.concessions,
});

// Transform database game to application game type
const transformGame = (
  dbGame: DbGame,
  homeTeam: Team,
  awayTeam: Team,
  location: GameLocation
): Game => ({
  id: dbGame.id,
  homeTeam,
  awayTeam,
  date: new Date(dbGame.scheduled_at),
  time: dbGame.game_time,
  location,
  status: dbGame.status as Game["status"],
  scores:
    dbGame.home_score !== null &&
    dbGame.away_score !== null &&
    dbGame.home_score !== undefined &&
    dbGame.away_score !== undefined
      ? { homeScore: dbGame.home_score, awayScore: dbGame.away_score }
      : undefined,
  sportType: dbGame.sport_type as "kickball" | "dodgeball",
  week: dbGame.week_number || 1,
  season: dbGame.season || "Summer 2025",
  year: (dbGame as any).year || new Date(dbGame.scheduled_at).getFullYear(),
});

// Teams API
export const teamsApi = {
  // Get all teams
  async getAll(): Promise<Team[]> {
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("*")
      .order("name");

    if (teamsError) throw teamsError;

    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("*")
      .order("jersey_number");

    if (playersError) throw playersError;

    const players = playersData.map(transformPlayer);

    return teamsData.map(team => {
      const teamPlayers = players.filter(p => p.teamId === team.id);
      return transformTeam(team, teamPlayers);
    });
  },

  // Get teams by sport
  async getBySport(sportType: "kickball" | "dodgeball"): Promise<Team[]> {
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("*")
      .eq("sport", sportType)
      .order("name");

    if (teamsError) throw teamsError;

    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("*")
      .eq("sport_type", sportType)
      .order("jersey_number");

    if (playersError) throw playersError;

    const players = playersData.map(transformPlayer);

    return teamsData.map(team => {
      const teamPlayers = players.filter(p => p.teamId === team.id);
      return transformTeam(team, teamPlayers);
    });
  },

  // Get team by ID
  async getById(teamId: string): Promise<Team | null> {
    try {
      console.log(`🏀 Fetching team ${teamId}...`);

      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .single();

      if (teamError) {
        console.error(`❌ Error fetching team ${teamId}:`, teamError);
        return null;
      }

      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("*")
        .eq("team_id", teamId)
        .order("jersey_number");

      if (playersError) {
        console.error(
          `❌ Error fetching players for team ${teamId}:`,
          playersError
        );
        // Return team without players instead of failing completely
        return transformTeam(teamData, []);
      }

      const players = playersData.map(transformPlayer);
      const team = transformTeam(teamData, players);

      console.log(
        `✅ Successfully fetched team ${team.name} with ${players.length} players`
      );
      return team;
    } catch (error) {
      console.error(`❌ Unexpected error fetching team ${teamId}:`, error);
      return null;
    }
  },

  // Migration function to update legacy color values in the database
  async migrateLegacyColors() {
    try {
      // Update teams with "teal" to "green"
      const { error: tealError } = await supabase
        .from("teams")
        .update({ gradient: "green" })
        .eq("gradient", "teal");

      if (tealError) throw tealError;

      // Update teams with "purple" to "pink"  
      const { error: purpleError } = await supabase
        .from("teams")
        .update({ gradient: "pink" })
        .eq("gradient", "purple");

      if (purpleError) throw purpleError;

      return { success: true };
    } catch (error) {
      console.error("Failed to migrate legacy colors:", error);
      throw error;
    }
  },

  // Team CRUD operations
  async createTeam(teamData: {
    name: string;
    sport: "kickball" | "dodgeball";
    gradient: "orange" | "green" | "blue" | "pink" | "white" | "black" | "gray" | "brown" | "purple" | "yellow" | "red" | "cyan";
    description: string;
    motto: string;
    founded: number;
  }) {
    const { data, error } = await supabase
      .from("teams")
      .insert([
        {
          ...teamData,
          wins: 0,
          losses: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTeam(
    teamId: string,
    teamData: Partial<{
      name: string;
      sport: "kickball" | "dodgeball";
      gradient: "orange" | "green" | "blue" | "pink" | "white" | "black" | "gray" | "brown" | "purple" | "yellow" | "red" | "cyan";
      description: string;
      motto: string;
      founded: number;
      wins: number;
      losses: number;
      captain_id: string;
    }>
  ) {
    // Prepare the update data, ensuring gradient is handled properly
    const updateData = { ...teamData };
    
    // Ensure gradient value is valid (convert legacy values if needed)
    if (updateData.gradient) {
      updateData.gradient = convertLegacyGradient(updateData.gradient);
    }

    const { data, error } = await supabase
      .from("teams")
      .update(updateData)
      .eq("id", teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTeam(teamId: string) {
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
  },
};

// Players API
export const playersApi = {
  // Get all players
  async getAll(): Promise<Player[]> {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("name");

    if (error) throw error;
    return data.map(transformPlayer);
  },

  // Get player by ID
  async getById(playerId: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();

    if (error) return null;
    return transformPlayer(data);
  },

  // Get players by team
  async getByTeam(teamId: string): Promise<Player[]> {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("team_id", teamId)
      .order("jersey_number");

    if (error) throw error;
    return data.map(transformPlayer);
  },
};

// Locations API
export const locationsApi = {
  // Get all locations
  async getAll(): Promise<GameLocation[]> {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("name");

    if (error) throw error;
    return data.map(transformLocation);
  },

  // Get location by ID
  async getById(locationId: string): Promise<GameLocation | null> {
    try {
      console.log(`📍 Fetching location ${locationId}...`);

      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("id", locationId)
        .single();

      if (error) {
        console.error(`❌ Error fetching location ${locationId}:`, error);
        return null;
      }

      const location = transformLocation(data);
      console.log(`✅ Successfully fetched location ${location.name}`);
      return location;
    } catch (error) {
      console.error(
        `❌ Unexpected error fetching location ${locationId}:`,
        error
      );
      return null;
    }
  },
};

// Games API
export const gamesApi = {
  // Get all games with full team and location data
  async getAll(): Promise<Game[]> {
    try {
      console.log("🎮 Fetching all games...");

      const { data: gamesData, error: gamesError } = await supabase
        .from("games")
        .select(
          `
          *,
          home_team:teams!games_home_team_id_fkey(*),
          away_team:teams!games_away_team_id_fkey(*),
          location:locations(*)
        `
        )
        .order("scheduled_at");

      if (gamesError) {
        console.error("❌ Error fetching games:", gamesError);
        throw gamesError;
      }

      console.log(`📊 Found ${gamesData?.length || 0} games`);

      const games: Game[] = [];

      // Use Promise.allSettled to handle multiple concurrent requests with error resilience
      const gamePromises = gamesData.map(async gameData => {
        try {
          const [homeTeamResult, awayTeamResult, locationResult] =
            await Promise.allSettled([
              teamsApi.getById(gameData.home_team_id),
              teamsApi.getById(gameData.away_team_id),
              locationsApi.getById(gameData.location_id),
            ]);

          const homeTeam =
            homeTeamResult.status === "fulfilled" ? homeTeamResult.value : null;
          const awayTeam =
            awayTeamResult.status === "fulfilled" ? awayTeamResult.value : null;
          const location =
            locationResult.status === "fulfilled" ? locationResult.value : null;

          if (homeTeam && awayTeam && location) {
            return transformGame(gameData, homeTeam, awayTeam, location);
          } else {
            console.warn(`⚠️ Incomplete data for game ${gameData.id}:`, {
              hasHomeTeam: !!homeTeam,
              hasAwayTeam: !!awayTeam,
              hasLocation: !!location,
            });
            return null;
          }
        } catch (error) {
          console.error(`❌ Error processing game ${gameData.id}:`, error);
          return null;
        }
      });

      const gameResults = await Promise.allSettled(gamePromises);

      gameResults.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value) {
          games.push(result.value);
        } else if (result.status === "rejected") {
          console.error(
            `❌ Failed to process game at index ${index}:`,
            result.reason
          );
        }
      });

      console.log(`✅ Successfully processed ${games.length} games`);
      return games;
    } catch (error) {
      console.error("❌ Failed to fetch games:", error);
      throw new Error(
        `Failed to load games: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  // Get games by sport
  async getBySport(sportType: "kickball" | "dodgeball"): Promise<Game[]> {
    try {
      console.log(`🎮 Fetching ${sportType} games...`);

      const { data: gamesData, error: gamesError } = await supabase
        .from("games")
        .select("*")
        .eq("sport_type", sportType)
        .order("scheduled_at");

      if (gamesError) {
        console.error(`❌ Error fetching ${sportType} games:`, gamesError);
        throw gamesError;
      }

      console.log(`📊 Found ${gamesData?.length || 0} ${sportType} games`);

      const games: Game[] = [];

      // Use Promise.allSettled for better error handling
      const gamePromises = gamesData.map(async gameData => {
        try {
          const [homeTeamResult, awayTeamResult, locationResult] =
            await Promise.allSettled([
              teamsApi.getById(gameData.home_team_id),
              teamsApi.getById(gameData.away_team_id),
              locationsApi.getById(gameData.location_id),
            ]);

          const homeTeam =
            homeTeamResult.status === "fulfilled" ? homeTeamResult.value : null;
          const awayTeam =
            awayTeamResult.status === "fulfilled" ? awayTeamResult.value : null;
          const location =
            locationResult.status === "fulfilled" ? locationResult.value : null;

          if (homeTeam && awayTeam && location) {
            return transformGame(gameData, homeTeam, awayTeam, location);
          } else {
            console.warn(
              `⚠️ Incomplete data for ${sportType} game ${gameData.id}:`,
              {
                hasHomeTeam: !!homeTeam,
                hasAwayTeam: !!awayTeam,
                hasLocation: !!location,
              }
            );
            return null;
          }
        } catch (error) {
          console.error(
            `❌ Error processing ${sportType} game ${gameData.id}:`,
            error
          );
          return null;
        }
      });

      const gameResults = await Promise.allSettled(gamePromises);

      gameResults.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value) {
          games.push(result.value);
        } else if (result.status === "rejected") {
          console.error(
            `❌ Failed to process ${sportType} game at index ${index}:`,
            result.reason
          );
        }
      });

      console.log(
        `✅ Successfully processed ${games.length} ${sportType} games`
      );
      return games;
    } catch (error) {
      console.error(`❌ Failed to fetch ${sportType} games:`, error);
      throw new Error(
        `Failed to load ${sportType} games: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  // Get games by team
  async getByTeam(teamId: string): Promise<Game[]> {
    const { data: gamesData, error: gamesError } = await supabase
      .from("games")
      .select("*")
      .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
      .order("scheduled_at");

    if (gamesError) throw gamesError;

    const games: Game[] = [];

    for (const gameData of gamesData) {
      const homeTeam = await teamsApi.getById(gameData.home_team_id);
      const awayTeam = await teamsApi.getById(gameData.away_team_id);
      const location = await locationsApi.getById(gameData.location_id);

      if (homeTeam && awayTeam && location) {
        games.push(transformGame(gameData, homeTeam, awayTeam, location));
      }
    }

    return games;
  },

  // Get a single game by ID
  async getById(gameId: string): Promise<Game | null> {
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

    if (gameError || !gameData) return null;

    const homeTeam = await teamsApi.getById(gameData.home_team_id);
    const awayTeam = await teamsApi.getById(gameData.away_team_id);
    const location = await locationsApi.getById(gameData.location_id);

    if (!homeTeam || !awayTeam || !location) return null;

    return transformGame(gameData, homeTeam, awayTeam, location);
  },

  // Get upcoming games
  async getUpcoming(sportType?: "kickball" | "dodgeball"): Promise<Game[]> {
    let query = supabase
      .from("games")
      .select("*")
      .eq("status", "scheduled")
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at");

    if (sportType) {
      query = query.eq("sport_type", sportType);
    }

    const { data: gamesData, error: gamesError } = await query;

    if (gamesError) throw gamesError;

    const games: Game[] = [];

    for (const gameData of gamesData) {
      const homeTeam = await teamsApi.getById(gameData.home_team_id);
      const awayTeam = await teamsApi.getById(gameData.away_team_id);
      const location = await locationsApi.getById(gameData.location_id);

      if (homeTeam && awayTeam && location) {
        games.push(transformGame(gameData, homeTeam, awayTeam, location));
      }
    }

    return games;
  },
};

// Schedule API
export const scheduleApi = {
  // Get schedule by sport
  async getBySport(sportType: "kickball" | "dodgeball"): Promise<Schedule> {
    const games = await gamesApi.getBySport(sportType);

    // Group games by week
    const weekMap = new Map<number, Game[]>();
    games.forEach(game => {
      const weekGames = weekMap.get(game.week) || [];
      weekGames.push(game);
      weekMap.set(game.week, weekGames);
    });

    // Create schedule weeks
    const weeks: ScheduleWeek[] = [];
    weekMap.forEach((weekGames, weekNumber) => {
      const sortedGames = weekGames.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
      const startDate = new Date(sortedGames[0].date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      weeks.push({
        weekNumber,
        startDate,
        endDate,
        games: sortedGames,
      });
    });

    weeks.sort((a, b) => a.weekNumber - b.weekNumber);

    return {
      season: games[0]?.season || "Summer 2025",
      sportType,
      weeks,
      totalWeeks: weeks.length,
    };
  },
};

// Helper functions to maintain compatibility with existing code
export const getTeamsBySport = (sportType: "kickball" | "dodgeball") =>
  teamsApi.getBySport(sportType);

export const getTeamById = (teamId: string) => teamsApi.getById(teamId);

export const getPlayerById = (playerId: string) => playersApi.getById(playerId);

export const getLocationById = (locationId: string) =>
  locationsApi.getById(locationId);

export const getGameById = async (gameId: string): Promise<Game | null> => {
  const { data: gameData, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (error) return null;

  const homeTeam = await teamsApi.getById(gameData.home_team_id);
  const awayTeam = await teamsApi.getById(gameData.away_team_id);
  const location = await locationsApi.getById(gameData.location_id);

  if (!homeTeam || !awayTeam || !location) return null;

  return transformGame(gameData, homeTeam, awayTeam, location);
};

export const getScheduleBySport = (sportType: "kickball" | "dodgeball") =>
  scheduleApi.getBySport(sportType);

// Admin CRUD Operations
export const adminApi = {
  // Player operations
  async createPlayer(playerData: {
    name: string;
    jersey_number: number;
    quote: string;
    team_id: string;
    sport_type: "kickball" | "dodgeball";
  }) {
    const { data, error } = await supabase
      .from("players")
      .insert([playerData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePlayer(
    playerId: string,
    playerData: Partial<{
      name: string;
      jersey_number: number;
      quote: string;
      team_id: string;
      sport_type: "kickball" | "dodgeball";
    }>
  ) {
    const { data, error } = await supabase
      .from("players")
      .update(playerData)
      .eq("id", playerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePlayer(playerId: string) {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", playerId);

    if (error) throw error;
  },

  // Game operations
  async createGame(gameData: {
    home_team_id: string;
    away_team_id: string;
    location_id: string;
    scheduled_at: string;
    game_time: string;
    sport_type: "kickball" | "dodgeball";
    week_number: number;
    season: string;
    year: number;
    status:
      | "scheduled"
      | "in-progress"
      | "completed"
      | "cancelled"
      | "postponed"
      | "archived";
    home_score?: number;
    away_score?: number;
  }) {
    const { data, error } = await supabase
      .from("games")
      .insert([gameData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGame(
    gameId: string,
    gameData: Partial<{
      home_team_id: string;
      away_team_id: string;
      location_id: string;
      scheduled_at: string;
      game_time: string;
      sport_type: "kickball" | "dodgeball";
      week_number: number;
      season: string;
      year: number;
      status:
        | "scheduled"
        | "in-progress"
        | "completed"
        | "cancelled"
        | "postponed"
        | "archived";
      home_score: number;
      away_score: number;
    }>
  ) {
    const { data, error } = await supabase
      .from("games")
      .update(gameData)
      .eq("id", gameId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGame(gameId: string) {
    const { error } = await supabase.from("games").delete().eq("id", gameId);

    if (error) throw error;
  },

  // Location operations
  async createLocation(locationData: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    latitude: number;
    longitude: number;
    facilities: string[];
    field_type: "grass" | "turf" | "indoor" | "court";
    capacity?: number;
    parking: boolean;
    restrooms: boolean;
    concessions: boolean;
  }) {
    const { data, error } = await supabase
      .from("locations")
      .insert([locationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLocation(
    locationId: string,
    locationData: Partial<{
      name: string;
      address: string;
      city: string;
      state: string;
      zip_code: string;
      latitude: number;
      longitude: number;
      facilities: string[];
      field_type: "grass" | "turf" | "indoor" | "court";
      capacity: number;
      parking: boolean;
      restrooms: boolean;
      concessions: boolean;
    }>
  ) {
    const { data, error } = await supabase
      .from("locations")
      .update(locationData)
      .eq("id", locationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLocation(locationId: string) {
    const { error } = await supabase
      .from("locations")
      .delete()
      .eq("id", locationId);

    if (error) throw error;
  },

  // Statistics
  async getStats() {
    const [teams, players, games, locations] = await Promise.all([
      teamsApi.getAll(),
      playersApi.getAll(),
      gamesApi.getAll(),
      locationsApi.getAll(),
    ]);

    const upcomingGames = games.filter(
      game => game.status === "scheduled" && new Date(game.date) > new Date()
    ).length;

    const completedGames = games.filter(
      game => game.status === "completed"
    ).length;

    return {
      totalTeams: teams.length,
      totalPlayers: players.length,
      totalGames: games.length,
      totalLocations: locations.length,
      upcomingGames,
      completedGames,
    };
  },
};

// Score Management API for Real-time Updates
export const scoreApi = {
  // Optimized score update with conflict resolution
  async updateScore(gameId: string, homeScore: number, awayScore: number) {
    const { data, error } = await supabase
      .from("games")
      .update({
        home_score: homeScore,
        away_score: awayScore,
        updated_at: new Date().toISOString(),
      })
      .eq("id", gameId)
      .select()
      .single();

    if (error) {
      console.error("Database update error:", error);
      throw error;
    }

    return data;
  },

  // Increment score with validation
  async incrementScore(
    gameId: string,
    team: "home" | "away",
    amount: number = 1
  ) {
    // Get current scores directly from database
    const { data: gameData, error: fetchError } = await supabase
      .from("games")
      .select("home_score, away_score")
      .eq("id", gameId)
      .single();

    if (fetchError || !gameData) {
      throw new Error("Game not found");
    }

    const currentHomeScore = gameData.home_score || 0;
    const currentAwayScore = gameData.away_score || 0;

    const newHomeScore =
      team === "home" ? currentHomeScore + amount : currentHomeScore;
    const newAwayScore =
      team === "away" ? currentAwayScore + amount : currentAwayScore;

    return this.updateScore(gameId, newHomeScore, newAwayScore);
  },

  // Decrement score (now allows negative scores)
  async decrementScore(
    gameId: string,
    team: "home" | "away",
    amount: number = 1
  ) {
    // Get current scores directly from database
    const { data: gameData, error: fetchError } = await supabase
      .from("games")
      .select("home_score, away_score")
      .eq("id", gameId)
      .single();

    if (fetchError || !gameData) {
      throw new Error("Game not found");
    }

    const currentHomeScore = gameData.home_score || 0;
    const currentAwayScore = gameData.away_score || 0;

    const newHomeScore =
      team === "home" ? currentHomeScore - amount : currentHomeScore;
    const newAwayScore =
      team === "away" ? currentAwayScore - amount : currentAwayScore;

    return this.updateScore(gameId, newHomeScore, newAwayScore);
  },

  // Get live games (in-progress status)
  async getLiveGames(): Promise<Game[]> {
    const { data: gamesData, error } = await supabase
      .from("games")
      .select("*")
      .eq("status", "in-progress")
      .order("scheduled_at");

    if (error) throw error;

    const games: Game[] = [];
    for (const gameData of gamesData) {
      const homeTeam = await teamsApi.getById(gameData.home_team_id);
      const awayTeam = await teamsApi.getById(gameData.away_team_id);
      const location = await locationsApi.getById(gameData.location_id);

      if (homeTeam && awayTeam && location) {
        games.push(transformGame(gameData, homeTeam, awayTeam, location));
      }
    }

    return games;
  },

  // Get score change history for a game
  async getScoreHistory(gameId: string) {
    const { data, error } = await supabase
      .from("score_changes")
      .select(
        `
        *,
        admin_user:user_profiles!score_changes_admin_user_id_fkey(email, full_name)
      `
      )
      .eq("game_id", gameId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};
