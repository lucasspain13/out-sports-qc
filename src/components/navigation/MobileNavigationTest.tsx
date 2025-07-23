import React from "react";
import MobileNavigation, { TabId } from "./MobileNavigation";

// Mock content for each tab
const LiveScoresContent = () => (
  <div className="p-6">
    <h1 className="heading-2 text-gray-900 mb-4">Live Scores</h1>
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <div className="font-semibold">Thunder Bolts</div>
            <div className="text-sm text-gray-600">Kickball</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">7 - 5</div>
            <div className="text-xs text-red-500 font-medium">LIVE</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">Lightning Strikes</div>
            <div className="text-sm text-gray-600">Kickball</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <div className="font-semibold">Rainbow Warriors</div>
            <div className="text-sm text-gray-600">Dodgeball</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">12 - 8</div>
            <div className="text-xs text-gray-500">Final</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">Pride Panthers</div>
            <div className="text-sm text-gray-600">Dodgeball</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ScheduleContent = () => (
  <div className="p-6">
    <h1 className="heading-2 text-gray-900 mb-4">Schedule</h1>
    <div className="space-y-4">
      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
        <div key={day} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-lg mb-2">{day}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">6:00 PM</span>
              <span>Kickball League</span>
              <span className="text-blue-600">Field A</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">7:30 PM</span>
              <span>Dodgeball League</span>
              <span className="text-blue-600">Gym 1</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TeamsContent = () => (
  <div className="p-6">
    <h1 className="heading-2 text-gray-900 mb-4">Teams</h1>
    <div className="grid grid-cols-1 gap-4">
      {[
        { name: "Thunder Bolts", sport: "Kickball", wins: 8, losses: 2 },
        { name: "Lightning Strikes", sport: "Kickball", wins: 7, losses: 3 },
        { name: "Rainbow Warriors", sport: "Dodgeball", wins: 9, losses: 1 },
        { name: "Pride Panthers", sport: "Dodgeball", wins: 6, losses: 4 },
      ].map((team, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{team.name}</h3>
              <p className="text-gray-600">{team.sport}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Record</div>
              <div className="font-semibold">
                {team.wins}-{team.losses}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RegistrationContent = () => (
  <div className="p-6">
    <h1 className="heading-2 text-gray-900 mb-4">Registration</h1>
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Season 2024 - Now Open!
        </h3>
        <p className="text-blue-800">
          Join our inclusive LGBTQ+ sports community. Registration currently
          closed.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-lg mb-2">Kickball League</h3>
          <p className="text-gray-600 mb-3">
            Fun, inclusive kickball for all skill levels
          </p>
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-semibold">$75/season</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
              Register
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-lg mb-2">Dodgeball League</h3>
          <p className="text-gray-600 mb-3">High-energy dodgeball action</p>
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-semibold">$65/season</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MobileNavigationTest: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState<TabId>(TabId.LIVE_SCORES);

  const renderContent = () => {
    switch (currentTab) {
      case TabId.LIVE_SCORES:
        return <LiveScoresContent />;
      case TabId.SCHEDULE:
        return <ScheduleContent />;
      case TabId.TEAMS:
        return <TeamsContent />;
      case TabId.REGISTRATION:
        return <RegistrationContent />;
      default:
        return <LiveScoresContent />;
    }
  };

  return (
    <MobileNavigation currentTab={currentTab} onTabChange={setCurrentTab}>
      <div className="min-h-screen bg-gray-50">{renderContent()}</div>
    </MobileNavigation>
  );
};

export default MobileNavigationTest;
