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
  <div className="mb-8 bg-white rounded-lg shadow-md border-l-4 border-teal-400 p-6">
    <h2 className="text-xl font-semibold text-teal-900 mb-4 flex items-center">
      {icon && <span className="mr-3 text-2xl">{icon}</span>}
      {title}
    </h2>
    {children}
  </div>
);

const DodgeballRules: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Dodgeball League Rules
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to Out Sports League Dodgeball! Fast-paced, strategic, and
            incredibly fun. These rules ensure everyone has a blast while
            staying safe and inclusive!
          </p>
        </div>

        {/* Our Philosophy */}
        <div className="bg-teal-100 rounded-lg p-6 mb-8 border-l-4 border-teal-500">
          <h2 className="text-xl font-semibold text-teal-900 mb-3">
            🌟 Our League Philosophy
          </h2>
          <p className="text-teal-800">
            Out Sports League dodgeball emphasizes{" "}
            <strong>Strategy & Fun</strong>! We believe in quick thinking,
            teamwork, and lots of laughter. Everyone gets to play, everyone gets
            to shine, and everyone goes home with a smile. Let's dodge, duck,
            dip, dive, and... dodge! 🎯
          </p>
        </div>

        {/* Team Structure */}
        <RulesSection title="Team Structure" icon="👥">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Team Size:</strong> 8-10 players per roster (minimum 6
                to field a team)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Court Players:</strong> 6 players on court per team at
                game start
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Gender Balance:</strong> All gender identities welcome -
                no restrictions!
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Substitutions:</strong> Subs enter only when original
                players are eliminated
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Game Format */}
        <RulesSection title="Game Format" icon="🏟️">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Match Structure:</strong> Best of 3 games (or time limit
                of 45 minutes)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Game Length:</strong> First team to eliminate all
                opponents wins that game
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Time Limit:</strong> 10-minute maximum per individual
                game
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Balls Used:</strong> 6 official dodgeballs (foam balls
                for safety)
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Game Start */}
        <RulesSection title="Starting the Game" icon="🚀">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Opening Rush:</strong> 6 balls placed on center line,
                teams rush to collect
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Initial Attack:</strong> Players must return to back
                line before throwing
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Fair Collection:</strong> Teams can collect a maximum of
                3 balls on opening rush
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Ready Position:</strong> All players start behind their
                back line
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Gameplay */}
        <RulesSection title="How to Play" icon="🎮">
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-violet-600 mb-2">
                Getting Players Out:
              </h3>
              <ul className="space-y-2 ml-4">
                <li>
                  • <strong>Direct Hit:</strong> Hit an opponent with a thrown
                  ball (must hit before bouncing)
                </li>
                <li>
                  • <strong>Catch:</strong> Catch a ball thrown by the opponent
                  (thrower is out)
                </li>
                <li>
                  • <strong>Block Fail:</strong> Ball hits you after bouncing
                  off something you're holding
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-violet-600 mb-2">
                Staying In:
              </h3>
              <ul className="space-y-2 ml-4">
                <li>
                  • <strong>Successful Block:</strong> Block a ball with another
                  ball you're holding
                </li>
                <li>
                  • <strong>Dodge:</strong> Avoid being hit by moving out of the
                  way
                </li>
                <li>
                  • <strong>Catch:</strong> Successfully catch an opponent's
                  throw
                </li>
              </ul>
            </div>
          </div>
        </RulesSection>

        {/* Special Rules */}
        <RulesSection title="Special Rules & Strategies" icon="🎯">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Head Shots:</strong> Intentional head shots result in
                the thrower being out (accidental = play on)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Boundaries:</strong> Players are out if they cross the
                center line or go out of bounds
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Ball Possession:</strong> Can't hold a ball for more
                than 10 seconds without throwing
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Revival:</strong> When teammate catches a ball, one
                eliminated player returns
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Stalling:</strong> Teams can't all stay on back line -
                must have active players forward
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Safety First */}
        <RulesSection title="Safety & Respect" icon="🛡️">
          <div className="space-y-4 text-gray-700">
            <p>
              <strong className="text-blue-600">Foam Balls Only:</strong> We use
              soft foam dodgeballs to minimize impact and ensure everyone can
              play comfortably.
            </p>
            <p>
              <strong className="text-green-600">No Excessive Force:</strong>{" "}
              Throw with control, not anger. The goal is strategy and fun, not
              intimidation.
            </p>
            <p>
              <strong className="text-purple-600">Honest Play:</strong> Call
              yourself out when hit. Honor system builds trust and keeps games
              flowing smoothly.
            </p>
            <p>
              <strong className="text-pink-600">Inclusive Environment:</strong>{" "}
              Support all players regardless of skill level. We're all learning
              and improving together!
            </p>
            <p>
              <strong className="text-orange-600">No Targeting:</strong> Don't
              repeatedly target the same player. Spread the love (and the
              throws) around!
            </p>
          </div>
        </RulesSection>

        {/* Sportsmanship */}
        <RulesSection title="Community & Sportsmanship" icon="🤝">
          <div className="space-y-4 text-gray-700">
            <p>
              <strong className="text-indigo-600">Celebrate Everyone:</strong>{" "}
              Cheer for good plays from both teams! A great catch or dodge
              deserves recognition.
            </p>
            <p>
              <strong className="text-emerald-600">Inclusive Language:</strong>{" "}
              We maintain a welcoming environment free from discriminatory
              language or behavior.
            </p>
            <p>
              <strong className="text-rose-600">Team Spirit:</strong> Encourage
              your teammates and help new players learn the ropes.
            </p>
            <p>
              <strong className="text-amber-600">Fun Competition:</strong> Play
              to win, but remember that building community is our real goal.
            </p>
            <p>
              <strong className="text-cyan-600">After-Game Socializing:</strong>{" "}
              Stick around after games to chat and get to know your fellow
              players!
            </p>
          </div>
        </RulesSection>

        {/* Pro Tips */}
        <div className="bg-fuchsia-100 rounded-lg p-6 mb-8 border-l-4 border-fuchsia-500">
          <h2 className="text-xl font-semibold text-fuchsia-800 mb-3">
            💡 Pro Tips for New Players
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-fuchsia-700">
            <div>
              <p className="font-medium mb-2">Strategy Tips:</p>
              <ul className="space-y-1 text-sm">
                <li>• Work as a team - coordinate throws!</li>
                <li>• Use blocks strategically to protect yourself</li>
                <li>• Keep moving - stationary targets are easy hits</li>
                <li>• Practice your catching - it brings teammates back!</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Etiquette Tips:</p>
              <ul className="space-y-1 text-sm">
                <li>• Call yourself out honestly when hit</li>
                <li>• Help retrieve balls between games</li>
                <li>• Encourage newer players</li>
                <li>• Have fun and don't take it too seriously!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-lime-100 rounded-lg p-6 text-center border-l-4 border-lime-500">
          <h2 className="text-xl font-semibold text-lime-800 mb-3">
            Questions? We've Got You! 🙋
          </h2>
          <p className="text-lime-700 mb-4">
            New to dodgeball or have questions about our rules? No worries! Our
            community is here to help you learn and have an amazing time.
          </p>
          <p className="text-lime-800 font-medium">
            Contact us: 
            <a 
              href="mailto:OutSportsQC@gmail.com"
              className="ml-1 underline hover:text-lime-600 transition-colors duration-200"
            >
              OutSportsQC@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DodgeballRules;
