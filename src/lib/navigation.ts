/**
 * Navigation utilities for the Out Sports League application
 * Provides centralized navigation functions with consistent behavior
 */

/**
 * Navigate to a specific route with smooth scroll to top
 * @param route - The route hash to navigate to (with or without #)
 * @param options - Navigation options
 */
export const navigateTo = (
  route: string,
  options: {
    behavior?: ScrollBehavior;
    replace?: boolean;
  } = {}
) => {
  const { behavior = "smooth", replace = false } = options;

  // Ensure route starts with #
  const normalizedRoute = route.startsWith("#") ? route : `#${route}`;

  // Navigate
  if (replace) {
    window.location.replace(normalizedRoute);
  } else {
    window.location.hash = normalizedRoute;
  }

  // Scroll to top
  window.scrollTo({
    top: 0,
    left: 0,
    behavior,
  });
};

/**
 * Navigate back in browser history with scroll to top
 */
export const navigateBack = () => {
  window.history.back();

  // Use setTimeout to ensure the navigation completes before scrolling
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, 50);
};

/**
 * Navigate to team detail page
 * @param team - Team object with sportType and id
 */
export const navigateToTeam = (team: { sportType: string; id: string }) => {
  navigateTo(`${team.sportType}-teams/${team.id}`);
};

/**
 * Navigate to sport roster overview
 * @param sportType - The sport type (kickball, dodgeball)
 */
export const navigateToSportRoster = (sportType: string) => {
  navigateTo(`${sportType}-teams`);
};

/**
 * Navigate to game detail page
 * @param gameId - The game ID
 */
export const navigateToGame = (gameId: string) => {
  navigateTo(`game/${gameId}`);
};

/**
 * Navigate to home page
 */
export const navigateToHome = () => {
  navigateTo("home");
};

/**
 * Navigate to registration page
 * @param sportType - The sport type for registration
 */
export const navigateToRegistration = (sportType: string) => {
  navigateTo(`${sportType}-registration`);
};

/**
 * Navigate to schedule page
 * @param sportType - The sport type for schedule
 */
export const navigateToSchedule = (sportType: string) => {
  navigateTo(`${sportType}-schedule`);
};

/**
 * Navigate to rules page
 * @param sportType - The sport type for rules
 */
export const navigateToRules = (sportType: string) => {
  navigateTo(`${sportType}-rules`);
};
