import React from "react";

interface RulesSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

const RulesSection: React.FC<RulesSectionProps> = ({
  title,
  children,
  icon,
}) => (
  <div className="mb-8 bg-white rounded-lg shadow-md border-l-4 border-blue-400 p-6">
    <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
      {icon && <span className="mr-3 text-2xl">{icon}</span>}
      {title}
    </h2>
    {children}
  </div>
);

const KickballRules: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ⚽ Kickball League Rules
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to Out Sports League Kickball! These rules are designed to
            keep our games fun, fair, and inclusive for everyone. Remember:
            we're here to have a great time together!
          </p>
        </div>

        {/* Our Philosophy */}
        <div className="bg-orange-100 rounded-lg p-6 mb-8 border-l-4 border-orange-500">
          <h2 className="text-xl font-semibold text-orange-900 mb-3">
            🌟 Our League Philosophy
          </h2>
          <p className="text-orange-800">
            Out Sports League is all about <strong>Fun First</strong>! We
            prioritize sportsmanship, inclusivity, and community building over
            intense competition. Everyone plays, everyone belongs, and everyone
            has a voice. Let's kick some balls and make some friends! ⚽️
          </p>
        </div>

        {/* Team Structure */}
        <RulesSection title="Team Structure" icon="👥">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Team Size:</strong> 10-12 players per roster (minimum 8
                to field a team)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Field Players:</strong> 8 players on the field at one
                time (1 pitcher, 1 catcher, 6 fielders)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Gender Balance:</strong> No gender restrictions - all
                identities welcome!
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Substitutions:</strong> Players can be substituted at
                any time between innings
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Game Basics */}
        <RulesSection title="Game Basics" icon="⚾">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Game Length:</strong> 7 innings or 50 minutes, whichever
                comes first
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Mercy Rule:</strong> Game ends if one team is ahead by
                10+ runs after 5 innings
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Equipment:</strong> We provide the kickball - just bring
                your energy!
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Outs per Inning:</strong> 3 outs per team per inning
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Kicking Rules */}
        <RulesSection title="Kicking & Batting" icon="🦶">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Kicking Order:</strong> Must kick in the same order
                throughout the game
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Foul Balls:</strong> Count as strikes, but you can't
                strike out on a foul ball
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Strikes:</strong> 3 strikes = out (includes swinging and
                missing)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Balls:</strong> 4 balls = walk to first base
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Kicking Style:</strong> Must kick with foot only - no
                punting or drop kicking
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Base Running */}
        <RulesSection title="Base Running" icon="🏃">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Leading Off:</strong> Runners can lead off base once the
                ball is kicked
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Force Outs:</strong> Runner is out if forced and fielder
                has control of ball at base
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Tag Outs:</strong> Must be tagged with the ball (thrown
                balls count if they hit the runner)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Overthrows:</strong> Runners may advance on overthrown
                balls
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Home Plate:</strong> Runner must touch home plate to
                score (no sliding into home)
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Fielding */}
        <RulesSection title="Fielding" icon="🥎">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Pitcher's Box:</strong> Pitcher must stay in the
                pitcher's box until ball is kicked
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Catcher Position:</strong> Catcher must stay behind home
                plate until ball is kicked
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Fair/Foul Territory:</strong> Ball must be kicked in
                fair territory to be in play
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Fly Balls:</strong> Catching a fly ball = automatic out
                for the kicker
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Sportsmanship */}
        <RulesSection title="Sportsmanship & Community" icon="🤝">
          <div className="space-y-4 text-gray-700">
            <p>
              <strong className="text-pink-600">Respect Everyone:</strong> We
              celebrate all identities, skill levels, and backgrounds.
              Discriminatory language or behavior has no place in our league.
            </p>
            <p>
              <strong className="text-green-600">Have Fun:</strong> Cheer for
              great plays from both teams! High-fives and encouragement make the
              game better for everyone.
            </p>
            <p>
              <strong className="text-blue-600">Self-Officiating:</strong>{" "}
              Players make their own calls with respect and honesty. When in
              doubt, give the benefit to your opponent.
            </p>
            <p>
              <strong className="text-purple-600">Inclusive Play:</strong> Make
              sure everyone gets playing time and feels welcome. We're building
              community, not just winning games.
            </p>
            <p>
              <strong className="text-indigo-600">Spirit of the Game:</strong>{" "}
              Play hard, play fair, and remember that we're all here to have a
              good time together!
            </p>
          </div>
        </RulesSection>

        {/* Questions */}
        <div className="bg-cyan-100 rounded-lg p-6 text-center border-l-4 border-cyan-500">
          <h2 className="text-xl font-semibold text-cyan-800 mb-3">
            Questions? We're Here to Help! 🙋
          </h2>
          <p className="text-cyan-700 mb-4">
            Don't stress about memorizing every rule - we'll help you learn as
            we play! Our league is all about having fun and supporting each
            other.
          </p>
          <p className="text-cyan-800 font-medium">
            Contact us: info@outsportsleague.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default KickballRules;
