import React, { useEffect, useState } from "react";
import { DynamicAppContent } from "./components/app/DynamicAppContent";
import { VerificationStatus } from "./components/auth/VerificationStatus";
import AdaptiveNavigation from "./components/navigation/AdaptiveNavigation";
import { DynamicNavigation } from "./components/navigation/DynamicNavigation";
import {
  AdminDashboard,
  AdminLogin,
  AnimationDemo,
  GameDetail,
  GeneralInfoPage,
  KickballRules,
  LeagueRules,
  LiabilityWaiverPage,
  PhotoWaiverPage,
  RegistrationPage,
  RosterOverview,
  ScheduleOverview,
  TeamDetailPage,
} from "./components/pages";
import { SportAwarePage } from "./components/pages/SportAwarePage";
import { ContentProvider } from "./components/providers/ContentProvider";
import { SportProvider } from "./contexts/SportContext";
import { useAuth } from "./contexts/AuthContext";
import { useGame } from "./hooks/useGames";
import { useRealtimeScores } from "./hooks/useRealtimeScores";
import { teamsApi } from "./lib/database";
import {
  navigateBack,
  navigateTo,
  navigateToGame,
  navigateToSportRoster,
  navigateToTeam,
} from "./lib/navigation";
import { Team, Player } from "./types";

// Team detail wrapper component that loads team by ID
const TeamDetailWrapper: React.FC<{
  teamId: string;
  sportType: "kickball" | "dodgeball";
  onBack: () => void;
  onPlayerSelect: (player: Player) => void;
}> = ({ teamId, sportType, onBack, onPlayerSelect }) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true);
        const teamData = await teamsApi.getById(teamId);
        if (teamData && teamData.sportType === sportType) {
          setTeam(teamData);
        } else {
          setError("Team not found");
        }
      } catch (err) {
        setError("Failed to load team");
        console.error("Error loading team:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [teamId, sportType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Team Not Found
          </h1>
          <p className="text-gray-600">Team ID: {teamId}</p>
        </div>
      </div>
    );
  }

  return (
    <TeamDetailPage
      team={team}
      onBack={onBack}
      onPlayerSelect={onPlayerSelect}
    />
  );
};
const GameDetailWrapper: React.FC<{
  gameId: string;
  onTeamSelect: (teamId: string) => void;
}> = ({ gameId, onTeamSelect }) => {
  const { game, loading, error } = useGame(gameId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Game Not Found
          </h1>
          <p className="text-gray-600">Game ID: {gameId}</p>
          <p className="text-sm text-gray-500 mt-4">
            {error || "The requested game could not be found."}
          </p>
          <button
            onClick={() => navigateBack()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <GameDetail
      game={game}
      onBack={() => navigateBack()}
      onTeamSelect={onTeamSelect}
    />
  );
};

function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}

function AppContent() {
  // Auth context
  const { verificationStatus, clearVerificationStatus } = useAuth();

  // Check for live games
  const { liveGames } = useRealtimeScores();
  const hasLiveGames = liveGames.some(game => game.status === "in-progress");

  // Auto-dismiss successful verification after 5 seconds
  useEffect(() => {
    if (verificationStatus.status === "success") {
      const timer = setTimeout(() => {
        clearVerificationStatus();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [verificationStatus.status, clearVerificationStatus]);

  // State for routing
  const [currentRoute, setCurrentRoute] = useState<string>("#home");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Handle hash changes for routing
  useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash || "#home";
      // Split hash and query parameters for routing
      const [hash] = fullHash.split('?');
      const routeHash = hash || "#home";
      
      setCurrentRoute(routeHash);

      // Scroll to top of page on navigation
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      // Handle team detail routes - support both new seasonal and legacy routes
      const teamDetailMatch = routeHash.match(/^#(summer-kickball|fall-kickball|kickball|dodgeball)-teams\/(.+)$/);
      if (teamDetailMatch) {
        const [, routeType, teamId] = teamDetailMatch;
        // Determine sport type from route
        const sportType = routeType.includes('kickball') ? 'kickball' : 'dodgeball';
        // Team loading will be handled by TeamDetailWrapper component
        setSelectedTeam({ id: teamId, sportType } as Team);
      } else {
        setSelectedTeam(null);
      }

      // Handle game detail routes
      const gameDetailMatch = routeHash.match(/^#game\/(.+)$/);
      if (gameDetailMatch) {
        // Store the full hash in currentRoute for game detail handling
        setCurrentRoute(routeHash);
      }
    };

    // Set initial route
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Handle team selection
  const handleTeamSelect = (team: Team) => {
    navigateToTeam(team);
  };

  // Handle back navigation from team detail
  const handleBackToRoster = () => {
    if (selectedTeam) {
      navigateToSportRoster(selectedTeam.sportType);
    }
  };

  // Render content based on current route
  const renderContent = () => {
    // Redirect dodgeball pages to home (temporarily disabled)
    if (currentRoute.startsWith("#dodgeball")) {
      // Show coming soon message and redirect to home
      setTimeout(() => {
        navigateTo("#home");
      }, 3000);

      return (
        <section className="py-20 bg-gray-50 min-h-screen">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-card-purple rounded-full flex items-center justify-center">
                  <span className="text-3xl">🏐</span>
                </div>
                <h1 className="heading-2 text-gray-900 mb-4">
                  Dodgeball Coming Soon!
                </h1>
                <p className="body-large text-gray-600 mb-6">
                  We're excited to bring dodgeball to Out Sports League! Our
                  dodgeball program is currently in development and will be
                  available in the near future.
                </p>
                <p className="body-base text-gray-500 mb-8">
                  Stay tuned for updates on registration, schedules, and team
                  information. In the meantime, check out our kickball league!
                </p>
                <div className="text-sm text-gray-400">
                  Redirecting to homepage in 3 seconds...
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // Team detail page
    if (selectedTeam) {
      return (
        <TeamDetailWrapper
          teamId={selectedTeam.id}
          sportType={selectedTeam.sportType as "kickball" | "dodgeball"}
          onBack={handleBackToRoster}
          onPlayerSelect={() => {
            // Player selected for detail view
          }}
        />
      );
    }

    // Game detail page
    const gameDetailMatch = currentRoute.match(/^#game\/(.+)$/);
    if (gameDetailMatch) {
      const [, gameId] = gameDetailMatch;

      return (
        <GameDetailWrapper
          gameId={gameId}
          onTeamSelect={(teamId: string) => {
            // Navigate to team route - team will be loaded by TeamDetailWrapper
            navigateToTeam({ id: teamId } as Team);
          }}
        />
      );
    }

    // Roster overview pages - Summer and Fall Kickball
    if (currentRoute === "#summer-kickball-teams") {
      return (
        <RosterOverview 
          sportType="kickball" 
          onTeamSelect={handleTeamSelect} 
        />
      );
    }

    if (currentRoute === "#fall-kickball-teams") {
      return (
        <RosterOverview 
          sportType="kickball" 
          onTeamSelect={handleTeamSelect} 
        />
      );
    }

    // Legacy kickball-teams route - redirect to Summer
    if (currentRoute === "#kickball-teams") {
      setTimeout(() => {
        navigateTo("#summer-kickball-teams");
      }, 0);
      return (
        <RosterOverview sportType="kickball" onTeamSelect={handleTeamSelect} />
      );
    }

    // Dodgeball routes are temporarily disabled - handled by redirect above

    // Schedule pages - Summer and Fall Kickball
    if (currentRoute === "#summer-kickball-schedule") {
      return (
        <ScheduleOverview
          sportType="kickball"
          onGameSelect={game => {
            navigateToGame(game.id);
          }}
        />
      );
    }

    if (currentRoute === "#fall-kickball-schedule") {
      return (
        <ScheduleOverview
          sportType="kickball"
          onGameSelect={game => {
            navigateToGame(game.id);
          }}
        />
      );
    }

    // Legacy kickball-schedule route - redirect to Summer
    if (currentRoute === "#kickball-schedule") {
      setTimeout(() => {
        navigateTo("#summer-kickball-schedule");
      }, 0);
      return (
        <ScheduleOverview
          sportType="kickball"
          onGameSelect={game => {
            navigateToGame(game.id);
          }}
        />
      );
    }

    // Dodgeball schedule is temporarily disabled - handled by redirect above

    // Registration pages - Use sport context for dynamic season/sport selection
    if (currentRoute === "#registration") {
      return <SportAwarePage type="registration" />;
    }

    // Legacy kickball-registration route - redirect to Fall (since Summer registration removed)
    if (currentRoute === "#kickball-registration") {
      setTimeout(() => {
        navigateTo("#registration");
      }, 0);
      return <RegistrationPage sportType="kickball" season="Fall 2025" />;
    }

    // Dodgeball registration is temporarily disabled - handled by redirect above

    // Simplified routes that use sport context
    if (currentRoute === "#teams") {
      return (
        <SportAwarePage 
          type="teams"
          onTeamSelect={handleTeamSelect} 
        />
      );
    }

    if (currentRoute === "#schedule") {
      return (
        <SportAwarePage
          type="schedule"
        />
      );
    }

    // Rules pages - Single kickball rules page for all seasons
    if (currentRoute === "#league-rules") {
      return <LeagueRules />;
    }

    if (currentRoute === "#kickball-rules") {
      return <KickballRules />;
    }

    // Legacy summer and fall kickball rules routes - redirect to main rules
    if (currentRoute === "#summer-kickball-rules" || currentRoute === "#fall-kickball-rules") {
      setTimeout(() => {
        navigateTo("#kickball-rules");
      }, 0);
      return <KickballRules />;
    }

    // Dodgeball rules are temporarily disabled - handled by redirect above

    // Admin routes
    if (currentRoute === "#admin-login") {
      return <AdminLogin />;
    }

    if (currentRoute === "#sports-admin") {
      return <AdminDashboard />;
    }

    // General Info page
    if (currentRoute === "#info") {
      return <GeneralInfoPage />;
    }

    // Liability Waiver page
    if (currentRoute === "#liability-waiver") {
      return <LiabilityWaiverPage />;
    }

    // Photo Waiver page
    if (currentRoute === "#photo-waiver") {
      return <PhotoWaiverPage />;
    }

    // Animation Demo page
    if (currentRoute === "#animation-demo") {
      return <AnimationDemo />;
    }

    // Home page
    if (currentRoute === "#home") {
      return (
        <DynamicAppContent
          currentRoute={currentRoute}
          renderContent={() => <></>}
        />
      );
    }

    // Unknown route - redirect to home
    console.warn(`Unknown route: ${currentRoute}, redirecting to home`);
    setTimeout(() => {
      window.location.hash = '#home';
    }, 0);
    
    // Show home page while redirecting
    return (
      <DynamicAppContent
        currentRoute="#home"
        renderContent={() => <></>}
      />
    );
  };

  return (
    <SportProvider currentRoute={currentRoute}>
      <DynamicNavigation currentRoute={currentRoute}>
        {(menuItems) => (
          <div className="App">
            {/* Verification Status */}
            <VerificationStatus
              verificationStatus={verificationStatus}
              onDismiss={clearVerificationStatus}
            />

            {/* Adaptive Navigation - Hide on admin pages */}
            {!currentRoute.startsWith("#admin") &&
              !currentRoute.startsWith("#sports-admin") && (
                <AdaptiveNavigation
                  logo="/logo.png"
                  menuItems={menuItems}
                  showLiveScores={hasLiveGames}
                  currentRoute={currentRoute}
                >
                  {/* Dynamic Content with proper spacing for fixed elements */}
                  <div
                    className={`${
                      currentRoute === "#home"
                        ? "pt-0"
                        : "mt-nav-safe bg-white min-h-screen"
                    }`}
                  >
                    {renderContent()}
                  </div>
                </AdaptiveNavigation>
              )}

            {/* Admin pages without navigation */}
            {(currentRoute.startsWith("#admin") ||
              currentRoute.startsWith("#sports-admin")) && (
              <div className="min-h-screen bg-white">{renderContent()}</div>
            )}
          </div>
        )}
      </DynamicNavigation>
    </SportProvider>
  );
}

export default App;
