import { Game, GameStatus, Schedule, ScheduleWeek, Team } from "../types";
import { gameLocations } from "./locations";
import { dodgeballTeams, kickballTeams } from "./teams";

// Helper function to create round-robin matchups
const createRoundRobinMatchups = (teams: Team[]) => {
  const matchups = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matchups.push([teams[i], teams[j]]);
    }
  }
  return matchups;
};

// Helper function to get random location
const getRandomLocation = () => {
  return gameLocations[Math.floor(Math.random() * gameLocations.length)];
};

// Helper function to generate game times
const getGameTimes = () => {
  const times = [
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
  ];
  return times[Math.floor(Math.random() * times.length)];
};

// Helper function to generate realistic scores
const generateScore = () => ({
  homeScore: Math.floor(Math.random() * 15) + 1,
  awayScore: Math.floor(Math.random() * 15) + 1,
});

// Create kickball schedule
const createKickballSchedule = (): Schedule => {
  const matchups = createRoundRobinMatchups(kickballTeams);
  const weeks: ScheduleWeek[] = [];
  const season = "Summer 2025";

  // Start date for the season - updated to current timeframe
  const startDate = new Date("2025-07-01");

  let gameId = 1;
  let weekNumber = 1;

  // Create 6 weeks of games (each team plays each other twice)
  for (let round = 0; round < 2; round++) {
    for (let weekOffset = 0; weekOffset < 3; weekOffset++) {
      const weekStartDate = new Date(startDate);
      weekStartDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);

      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);

      const weekGames: Game[] = [];

      // Schedule 2 games per week
      for (let gameIndex = 0; gameIndex < 2; gameIndex++) {
        const matchupIndex =
          (weekOffset * 2 + gameIndex + round * 6) % matchups.length;
        const [homeTeam, awayTeam] = matchups[matchupIndex];

        const gameDate = new Date(weekStartDate);
        // Alternate between weekday and weekend games
        gameDate.setDate(weekStartDate.getDate() + (gameIndex === 0 ? 2 : 5)); // Wednesday and Saturday

        const status: GameStatus =
          weekNumber <= 3
            ? "completed"
            : weekNumber === 4
            ? "in-progress"
            : "scheduled";

        const game: Game = {
          id: `kb-game-${gameId}`,
          homeTeam,
          awayTeam,
          date: gameDate,
          time: getGameTimes(),
          location: getRandomLocation(),
          status,
          scores: status === "completed" ? generateScore() : undefined,
          sportType: "kickball",
          week: weekNumber,
          season,
          year: 2025,
        };

        weekGames.push(game);
        gameId++;
      }

      weeks.push({
        weekNumber,
        startDate: weekStartDate,
        endDate: weekEndDate,
        games: weekGames,
      });

      weekNumber++;
    }
  }

  return {
    season,
    sportType: "kickball",
    weeks,
    totalWeeks: weeks.length,
  };
};

// Create dodgeball schedule
const createDodgeballSchedule = (): Schedule => {
  const matchups = createRoundRobinMatchups(dodgeballTeams);
  const weeks: ScheduleWeek[] = [];
  const season = "Summer 2025";

  // Start date for the season (offset by a few days from kickball)
  const startDate = new Date("2025-07-03");

  let gameId = 1;
  let weekNumber = 1;

  // Create 6 weeks of games (each team plays each other twice)
  for (let round = 0; round < 2; round++) {
    for (let weekOffset = 0; weekOffset < 3; weekOffset++) {
      const weekStartDate = new Date(startDate);
      weekStartDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);

      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);

      const weekGames: Game[] = [];

      // Schedule 2 games per week
      for (let gameIndex = 0; gameIndex < 2; gameIndex++) {
        const matchupIndex =
          (weekOffset * 2 + gameIndex + round * 6) % matchups.length;
        const [homeTeam, awayTeam] = matchups[matchupIndex];

        const gameDate = new Date(weekStartDate);
        // Alternate between weekday and weekend games
        gameDate.setDate(weekStartDate.getDate() + (gameIndex === 0 ? 1 : 4)); // Tuesday and Friday

        const status: GameStatus =
          weekNumber <= 2
            ? "completed"
            : weekNumber === 3
            ? "in-progress"
            : "scheduled";

        const game: Game = {
          id: `db-game-${gameId}`,
          homeTeam,
          awayTeam,
          date: gameDate,
          time: getGameTimes(),
          location: getRandomLocation(),
          status,
          scores: status === "completed" ? generateScore() : undefined,
          sportType: "dodgeball",
          week: weekNumber,
          season,
          year: 2025,
        };

        weekGames.push(game);
        gameId++;
      }

      weeks.push({
        weekNumber,
        startDate: weekStartDate,
        endDate: weekEndDate,
        games: weekGames,
      });

      weekNumber++;
    }
  }

  return {
    season,
    sportType: "dodgeball",
    weeks,
    totalWeeks: weeks.length,
  };
};

// Export schedules
export const kickballSchedule = createKickballSchedule();
export const dodgeballSchedule = createDodgeballSchedule();

export const allSchedules = [kickballSchedule, dodgeballSchedule];

// Helper functions
export const getScheduleBySport = (
  sportType: "kickball" | "dodgeball"
): Schedule => {
  return sportType === "kickball" ? kickballSchedule : dodgeballSchedule;
};

export const getGameById = (gameId: string): Game | undefined => {
  for (const schedule of allSchedules) {
    for (const week of schedule.weeks) {
      const game = week.games.find(g => g.id === gameId);
      if (game) return game;
    }
  }
  return undefined;
};

export const getGamesByWeek = (
  sportType: "kickball" | "dodgeball",
  weekNumber: number
): Game[] => {
  const schedule = getScheduleBySport(sportType);
  const week = schedule.weeks.find(w => w.weekNumber === weekNumber);
  return week ? week.games : [];
};

export const getGamesByTeam = (teamId: string): Game[] => {
  const games: Game[] = [];
  for (const schedule of allSchedules) {
    for (const week of schedule.weeks) {
      for (const game of week.games) {
        if (game.homeTeam.id === teamId || game.awayTeam.id === teamId) {
          games.push(game);
        }
      }
    }
  }
  return games;
};

export const getGamesByLocation = (locationId: string): Game[] => {
  const games: Game[] = [];
  for (const schedule of allSchedules) {
    for (const week of schedule.weeks) {
      for (const game of week.games) {
        if (game.location.id === locationId) {
          games.push(game);
        }
      }
    }
  }
  return games;
};

export const getUpcomingGames = (
  sportType?: "kickball" | "dodgeball"
): Game[] => {
  const now = new Date();
  const games: Game[] = [];

  const schedulesToCheck = sportType
    ? [getScheduleBySport(sportType)]
    : allSchedules;

  for (const schedule of schedulesToCheck) {
    for (const week of schedule.weeks) {
      for (const game of week.games) {
        if (game.date >= now && game.status === "scheduled") {
          games.push(game);
        }
      }
    }
  }

  return games.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getCompletedGames = (
  sportType?: "kickball" | "dodgeball"
): Game[] => {
  const games: Game[] = [];

  const schedulesToCheck = sportType
    ? [getScheduleBySport(sportType)]
    : allSchedules;

  for (const schedule of schedulesToCheck) {
    for (const week of schedule.weeks) {
      for (const game of week.games) {
        if (game.status === "completed") {
          games.push(game);
        }
      }
    }
  }

  return games.sort(
    (a, b) => Number(b.time.slice(0, 1)) - Number(a.time.slice(0, 1))
  );
};
