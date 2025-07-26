import { motion, useInView } from "framer-motion";
import React, { useRef, useState } from "react";
import { LeadershipMember } from "../../types";

interface LeadershipTeamProps {
  leadership: LeadershipMember[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const LeadershipTeam: React.FC<LeadershipTeamProps> = ({
  leadership,
  title = "Meet Our Leadership Team",
  subtitle = "The passionate individuals who make our community thrive",
  className = "",
}) => {
  const [selectedMember, setSelectedMember] = useState<LeadershipMember | null>(
    null
  );
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getRoleColor = (role: string) => {
    const roleColors = {
      "League Commissioner": "from-brand-orange to-brand-orange-light",
      "Operations Director": "bg-gradient-primary",
      "Player Development Coordinator": "from-brand-blue to-brand-blue-light",
      "Community Outreach Manager": "from-brand-purple to-brand-purple-light",
      "Safety & Inclusion Officer": "from-brand-orange to-brand-blue",
      "Social Media & Communications": "bg-gradient-primary",
      "Volunteer Coordinator": "from-brand-blue to-brand-purple",
      "Finance & Sponsorship Director": "from-brand-purple to-brand-orange",
    };
    return (
      roleColors[role as keyof typeof roleColors] || "from-gray-600 to-gray-500"
    );
  };

  const getRoleAccent = (role: string) => {
    const roleAccents = {
      "League Commissioner": "border-brand-orange/20 bg-brand-orange/5",
      "Operations Director": "border-brand-blue/20 bg-brand-blue/5",
      "Player Development Coordinator": "border-brand-blue/20 bg-brand-blue/5",
      "Community Outreach Manager": "border-brand-purple/20 bg-brand-purple/5",
      "Safety & Inclusion Officer":
        "border-brand-orange/20 bg-gradient-to-br from-brand-orange/5 to-brand-blue/5",
      "Social Media & Communications":
        "border-brand-red/20 bg-gradient-to-br from-brand-red/5 to-brand-purple/5",
      "Volunteer Coordinator":
        "border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 to-brand-purple/5",
      "Finance & Sponsorship Director":
        "border-brand-purple/20 bg-gradient-to-br from-brand-purple/5 to-brand-orange/5",
    };
    return (
      roleAccents[role as keyof typeof roleAccents] ||
      "border-gray-200 bg-gray-50"
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("");
  };

  return (
    <section
      className={`py-20 bg-gradient-to-br from-gray-50 to-white ${className}`}
      ref={ref}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {leadership.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                y: -8,
                transition: { duration: 0.2 },
              }}
              className="group cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              {/* Card */}
              <div
                className={`h-full bg-white rounded-2xl p-6 border-2 ${getRoleAccent(
                  member.role
                )} shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-opacity-40`}
              >
                {/* Avatar */}
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getRoleColor(
                      member.role
                    )} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                  >
                    {getInitials(member.name)}
                  </motion.div>

                  {/* Online indicator */}
                  <div className="absolute bottom-1 right-1/2 transform translate-x-6 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {member.name}
                  </h3>

                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getRoleColor(
                      member.role
                    )} text-white mb-4`}
                  >
                    {member.role}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {member.specialties.slice(0, 2).map((specialty, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                      >
                        {specialty}
                      </span>
                    ))}
                    {member.specialties.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                        +{member.specialties.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Years with league */}
                  <div className="text-xs text-gray-500">
                    With us since {member.joinedYear}
                  </div>
                </div>

                {/* Hover indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-4 right-4 text-gray-400 group-hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRoleColor(
                    selectedMember.role
                  )} flex items-center justify-center text-white text-xl font-bold`}
                >
                  {getInitials(selectedMember.name)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedMember.name}
                  </h3>
                  <p
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getRoleColor(
                      selectedMember.role
                    )} text-white`}
                  >
                    {selectedMember.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  About
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedMember.bio}
                </p>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Specialties
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div
                className={`p-4 rounded-lg bg-gradient-to-r ${getRoleColor(
                  selectedMember.role
                )} bg-opacity-5 border-l-4 border-gradient-to-b ${getRoleColor(
                  selectedMember.role
                )}`}
              >
                <blockquote className="text-gray-700 italic">
                  "{selectedMember.favoriteQuote}"
                </blockquote>
              </div>

              {/* Contact & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Joined:</span>{" "}
                  {selectedMember.joinedYear}
                </div>
                {selectedMember.email && (
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedMember.email}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default LeadershipTeam;
