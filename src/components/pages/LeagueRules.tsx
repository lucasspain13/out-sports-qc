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

const LeagueRules: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏳️‍🌈 Out Sports League Rules
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to Out Sports League! These general rules apply to all
            sports and activities in our league. Our mission is to create an
            inclusive, fun, and welcoming environment for everyone.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-blue-100 rounded-lg p-6 mb-8 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            🌟 Our Mission
          </h2>
          <p className="text-blue-800">
            Out Sports League is dedicated to providing a safe, inclusive, and
            fun environment for LGBTQ+ individuals and allies to participate in
            recreational sports. We believe in <strong>community building</strong>,{" "}
            <strong>acceptance</strong>, and <strong>celebration</strong> of
            diversity through the power of sport.
          </p>
        </div>

        {/* General Conduct */}
        <RulesSection title="General Conduct & Sportsmanship" icon="🤝">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Respect for All:</strong> All participants must treat
                teammates, opponents, and officials with respect and courtesy.
                Discriminatory language or behavior based on sexual orientation,
                gender identity, race, religion, or any other characteristic
                will not be tolerated.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Inclusive Language:</strong> Use people's preferred
                names and pronouns. If you're unsure, just ask respectfully.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Good Sportsmanship:</strong> Celebrate good plays by
                both teams. Disputes should be handled calmly and fairly.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Fun First:</strong> Remember, we're here to have fun
                and build community. Competitive spirit is welcome, but not at
                the expense of inclusivity or kindness.
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Registration & Participation */}
        <RulesSection title="Registration & Participation" icon="📝">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Open to All:</strong> Our league welcomes LGBTQ+
                individuals and allies of all skill levels and backgrounds.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Age Requirement:</strong> Participants must be 18 years
                or older.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Registration:</strong> Complete registration is
                required before participating in any league activities.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Attendance:</strong> Regular attendance is encouraged
                to maintain team chemistry and league quality. Please
                communicate with your team if you'll be absent.
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Safety & Health */}
        <RulesSection title="Safety & Health Guidelines" icon="🏥">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Health & Safety:</strong> Participants play at their
                own risk. Please inform league organizers of any medical
                conditions that may affect your participation.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Injury Protocol:</strong> Stop play immediately if
                someone is injured. Basic first aid will be available at all
                games.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Weather Conditions:</strong> Games may be cancelled or
                postponed due to severe weather. Participants will be notified
                as soon as possible.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Substance Policy:</strong> Participants may not be
                under the influence of alcohol or drugs during league
                activities.
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Communication & Social Media */}
        <RulesSection title="Communication & Social Media" icon="📱">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Official Communications:</strong> Important league
                information will be shared via email and our official social
                media channels.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Photography & Privacy:</strong> Photos and videos may
                be taken during league events for promotional purposes. Please
                let organizers know if you prefer not to be photographed.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Social Media Guidelines:</strong> When posting about
                league activities, please be respectful and positive. Tag us
                @OutSportsQC!
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* Violations & Consequences */}
        <RulesSection title="Rule Violations & Consequences" icon="⚠️">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Progressive Discipline:</strong> Rule violations will
                be addressed through discussion, warnings, and if necessary,
                temporary or permanent removal from the league.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Reporting Issues:</strong> If you experience or witness
                inappropriate behavior, please report it to league organizers
                immediately.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>
                <strong>Zero Tolerance:</strong> Discriminatory behavior,
                harassment, or violence will result in immediate removal from
                the league.
              </span>
            </li>
          </ul>
        </RulesSection>

        {/* League Commitment */}
        <div className="bg-green-100 rounded-lg p-6 mb-8 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-900 mb-3">
            💚 Our Commitment to You
          </h2>
          <p className="text-green-800 mb-4">
            Out Sports League is committed to providing a welcoming and
            inclusive environment where everyone can enjoy recreational sports
            regardless of their skill level, experience, or background.
          </p>
          <p className="text-green-800">
            Questions about these rules? Need clarification on anything? We're
            here to help! Contact us at{" "}
            <a 
              href="mailto:OutSportsQC@gmail.com"
              className="font-bold text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
            >
              OutSportsQC@gmail.com
            </a>{" "}
            or reach out to any league organizer.
          </p>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Have questions or need more information?
          </p>
          <div className="space-y-1">
            <p className="text-blue-600 font-medium">
              📧 Email: 
              <a 
                href="mailto:OutSportsQC@gmail.com"
                className="ml-1 underline hover:text-blue-800 transition-colors duration-200"
              >
                OutSportsQC@gmail.com
              </a>
            </p>
            <p className="text-blue-600 font-medium">
              📞 Phone: 
              <a 
                href="tel:+15633810504"
                className="ml-1 underline hover:text-blue-800 transition-colors duration-200"
              >
                Travis Stanger - 563-381-0504
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueRules;
