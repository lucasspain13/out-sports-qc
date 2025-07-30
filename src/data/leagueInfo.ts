import {
  ContactInfo,
  CoreValue,
  FAQ,
  LeadershipMember,
  LeagueInfo,
  Testimonial,
  Timeline,
  TimelineMilestone,
} from "../types";

// Core Values
export const coreValues: CoreValue[] = [
  {
    id: "inclusivity",
    name: "Inclusivity",
    description:
      "We welcome players of all backgrounds, skill levels, and identities. Everyone belongs here.",
    icon: "🤝",
  },
  {
    id: "fun",
    name: "Fun",
    description:
      "Sports should be enjoyable! We prioritize laughter, friendship, and positive experiences.",
    icon: "🎉",
  },
  {
    id: "community",
    name: "Community",
    description:
      "Building lasting connections and supporting each other on and off the field.",
    icon: "🏘️",
  },
  {
    id: "growth",
    name: "Growth",
    description:
      "Encouraging personal development, skill improvement, and confidence building.",
    icon: "🌱",
  },
  {
    id: "respect",
    name: "Respect",
    description:
      "Treating all players, officials, and community members with dignity and kindness.",
    icon: "🙏",
  },
];

// Contact Information
export const contactInfo: ContactInfo = {
  email: "OutSportsQC@gmail.com",
  phone: "(563) 381-0504",
  address: {
    street: "",
    city: "Davenport",
    state: "IA",
    zipCode: "52807",
  },
  socialMedia: {
    facebook: "https://facebook.com/outsportsleague",
    instagram: "https://instagram.com/outsportsleague",
  },
  officeHours: {
    weekdays: "Monday - Friday: 9:00 AM - 6:00 PM",
    weekends: "Saturday: 10:00 AM - 4:00 PM, Sunday: Closed",
  },
};

// League Information
export const leagueInfo: LeagueInfo = {
  mission:
    "To create an inclusive, welcoming sports community where everyone can play, grow, and belong. We believe that sports have the power to bring people together, build confidence, and create lasting friendships that extend far beyond the playing field.",
  history:
    "Founded in 2024 by a group of friends who wanted to create a more inclusive recreational sports experience, OUT Sports League began with just two kickball teams and a dream. What started as weekend games in a local park has grown into a thriving community of over 300 members across multiple sports, united by our commitment to fun, friendship, and acceptance.",
  values: coreValues,
  contact: contactInfo,
  foundedYear: 2024,
  memberCount: 62,
  seasonsCompleted: 1,
};

// Leadership Team
export const leadership: LeadershipMember[] = [
  {
    id: "leader-1",
    name: "Alex Rivera",
    role: "League Commissioner",
    bio: "Alex founded OUT Sports League with a vision of creating inclusive recreational sports for everyone. With 8 years of experience in community organizing and a passion for kickball, Alex ensures our league stays true to its core values while continuing to grow.",
    avatar: "",
    email: "OutSportsQC@gmail.com",
    joinedYear: 2024,
    specialties: [
      "Community Building",
      "Strategic Planning",
      "Conflict Resolution",
    ],
    favoriteQuote: "Sports are better when everyone gets to play.",
  },
  {
    id: "leader-2",
    name: "Jordan Chen",
    role: "Operations Director",
    bio: "Jordan keeps our league running smoothly, managing everything from field reservations to equipment inventory. Their attention to detail and organizational skills ensure every game day runs without a hitch.",
    avatar: "",
    email: "OutSportsQC@gmail.com",
    joinedYear: 2020,
    specialties: ["Operations Management", "Logistics", "Vendor Relations"],
    favoriteQuote: "Excellence is in the details.",
  },
  {
    id: "leader-3",
    name: "Sam Thompson",
    role: "Player Development Coordinator",
    bio: "Sam focuses on helping new players feel welcome and confident. They organize skill-building workshops, mentorship programs, and social events that help our community grow stronger together.",
    avatar: "",
    email: "OutSportsQC@gmail.com",
    joinedYear: 2020,
    specialties: ["Player Development", "Training Programs", "Mentorship"],
    favoriteQuote: "Every expert was once a beginner.",
  },
  {
    id: "leader-4",
    name: "Casey Martinez",
    role: "Community Outreach Manager",
    bio: "Casey builds bridges between our league and the broader community. They coordinate charity events, partnerships with local businesses, and initiatives that make a positive impact beyond our games.",
    avatar: "",
    email: "OutSportsQC@gmail.com",
    joinedYear: 2021,
    specialties: [
      "Community Outreach",
      "Event Planning",
      "Partnership Development",
    ],
    favoriteQuote: "Together we can make a difference.",
  },
  {
    id: "leader-5",
    name: "Riley Park",
    role: "Safety & Inclusion Officer",
    bio: "Riley ensures our league remains a safe and welcoming space for all. They develop policies, handle concerns, and work continuously to make our community more inclusive and accessible.",
    avatar: "",
    email: "OutSportsQC@gmail.com",
    joinedYear: 2021,
    specialties: [
      "Safety Protocols",
      "Inclusion Initiatives",
      "Policy Development",
    ],
    favoriteQuote:
      "Safety and inclusion aren't destinations, they're ongoing journeys.",
  },
  {
    id: "leader-6",
    name: "Morgan Davis",
    role: "Social Media & Communications",
    bio: "Morgan tells our story to the world through engaging content and clear communication. They manage our online presence and ensure our community stays connected and informed.",
    avatar: "",
    email: "OutSportsQC@gmail.com",
    joinedYear: 2022,
    specialties: ["Social Media", "Content Creation", "Communications"],
    favoriteQuote: "Every picture tells a story, every story builds community.",
  },
  {
    id: "leader-7",
    name: "Taylor Kim",
    role: "Volunteer Coordinator",
    bio: "Taylor organizes our amazing volunteer team that makes everything possible. From referees to scorekeepers to event helpers, they ensure we have the support we need for every activity.",
    avatar: "",
    email: "OutSportsQC@gmail.com",
    joinedYear: 2022,
    specialties: ["Volunteer Management", "Training", "Recognition Programs"],
    favoriteQuote: "Volunteers don't get paid because they're priceless.",
  },
  {
    id: "leader-8",
    name: "Avery Johnson",
    role: "Finance & Sponsorship Director",
    bio: "Avery manages our league's finances and builds relationships with sponsors who share our values. Their work ensures we can keep costs low while providing high-quality experiences for all members.",
    avatar: "",
    email: "OutSportsQC@gmail.com",
    joinedYear: 2021,
    specialties: ["Financial Management", "Sponsorship", "Budget Planning"],
    favoriteQuote: "Good stewardship enables great experiences.",
  },
];

// Community Testimonials
export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    memberName: "Phoenix Rainbow",
    role: "Team Captain",
    quote:
      "Joining OUT Sports League was the best decision I made after moving to Austin. Not only did I find an amazing kickball team, but I found a family. The inclusive environment here is genuine - everyone truly supports each other.",
    avatar: "",
    teamName: "Rainbow Runners",
    sportType: "kickball",
    memberSince: 2020,
    location: "Austin, TX",
  },
  {
    id: "testimonial-2",
    memberName: "Marcus Williams",
    role: "Player",
    quote:
      "I was nervous about joining a sports league as someone who hadn't played since high school. The welcoming atmosphere and patient teammates helped me rediscover my love for being active. Three seasons later, I'm more confident than ever!",
    avatar: "",
    teamName: "Blue Lightning",
    sportType: "kickball",
    memberSince: 2022,
    location: "Austin, TX",
  },
  {
    id: "testimonial-3",
    memberName: "Dr. Sarah Chen",
    role: "Player",
    quote:
      "As a busy professional, I needed something fun to help me unwind. OUT Sports League provides the perfect balance of competition and community. The friendships I've made here extend far beyond game day.",
    avatar: "",
    teamName: "Teal Tornadoes",
    sportType: "dodgeball",
    memberSince: 2021,
    location: "Austin, TX",
  },
  {
    id: "testimonial-4",
    memberName: "Jamie Rodriguez",
    role: "Volunteer Referee",
    quote:
      "Volunteering as a referee has been incredibly rewarding. The respect and appreciation shown by players makes every game enjoyable. This league truly embodies good sportsmanship.",
    avatar: "",
    memberSince: 2021,
    location: "Austin, TX",
  },
  {
    id: "testimonial-5",
    memberName: "Alex Thompson",
    role: "Player",
    quote:
      "I love how this league celebrates diversity. Players of all ages, backgrounds, and skill levels come together for pure fun. It's refreshing to be part of something so positive and inclusive.",
    avatar: "",
    teamName: "Purple Panthers",
    sportType: "dodgeball",
    memberSince: 2020,
    location: "Austin, TX",
  },
  {
    id: "testimonial-6",
    memberName: "Riley Martinez",
    role: "Team Captain",
    quote:
      "Leading a team in this league has taught me so much about inclusive leadership. The support from league organizers and the collaborative spirit among teams creates an environment where everyone can thrive.",
    avatar: "",
    teamName: "Thunder Kickers",
    sportType: "kickball",
    memberSince: 2024,
    location: "Austin, TX",
  },
  {
    id: "testimonial-7",
    memberName: "Jordan Park",
    role: "Player",
    quote:
      "After years of feeling intimidated by traditional sports leagues, I finally found my place here. The emphasis on fun over winning, while still maintaining competitive spirit, is exactly what I was looking for.",
    avatar: "",
    teamName: "Dodge Dynasty",
    sportType: "dodgeball",
    memberSince: 2022,
    location: "Austin, TX",
  },
  {
    id: "testimonial-8",
    memberName: "Casey Kim",
    role: "Player",
    quote:
      "The social events and community service projects show that this league is about more than just sports. We're building real connections and making a positive impact in our city.",
    avatar: "",
    teamName: "Rainbow Runners",
    sportType: "kickball",
    memberSince: 2021,
    location: "Austin, TX",
  },
  {
    id: "testimonial-9",
    memberName: "Sam Davis",
    role: "Player",
    quote:
      "I joined as a complete beginner and never felt judged or left behind. The patient coaching and encouraging teammates helped me develop skills I never thought I had. Now I'm helping welcome new players too!",
    avatar: "",
    teamName: "Blue Blitz",
    sportType: "dodgeball",
    memberSince: 2021,
    location: "Austin, TX",
  },
  {
    id: "testimonial-10",
    memberName: "Morgan Lee",
    role: "Player",
    quote:
      "The league's commitment to safety and inclusion isn't just talk - it's evident in every policy, every interaction, and every game. I feel completely comfortable being myself here.",
    avatar: "",
    teamName: "Purple Power",
    sportType: "kickball",
    memberSince: 2020,
    location: "Austin, TX",
  },
];

// Frequently Asked Questions
export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "Do I need experience to join?",
    answer:
      "Not at all! We welcome players of all skill levels, from complete beginners to experienced athletes. Our focus is on fun, learning, and community rather than elite competition.",
    category: "general",
    priority: 1,
  },
  {
    id: "faq-2",
    question: "How much does it cost to join?",
    answer:
      "Registration fees vary by sport and season length, typically ranging from $75-120 per season. This includes team placement, equipment, field rentals, and end-of-season celebrations. We offer payment plans and scholarships for those who need financial assistance.",
    category: "costs",
    priority: 2,
  },
  {
    id: "faq-3",
    question: "When do seasons start?",
    answer:
      "We run seasons year-round with new seasons starting every 8-10 weeks. Spring seasons typically begin in March, Summer in June, Fall in September, and Winter in December. Check our website for current registration dates.",
    category: "registration",
    priority: 3,
  },
  {
    id: "faq-4",
    question: "Can I join as an individual or do I need a team?",
    answer:
      "You can absolutely join as an individual! Most of our players register solo and are placed on teams. We use a combination of skill assessment, availability, and personality matching to create balanced, compatible teams.",
    category: "registration",
    priority: 4,
  },
  {
    id: "faq-5",
    question: "What sports do you offer?",
    answer:
      "Currently we offer kickball and dodgeball leagues. We're always exploring new sports based on member interest - recent surveys have shown interest in volleyball, softball, and ultimate frisbee.",
    category: "general",
    priority: 5,
  },
  {
    id: "faq-6",
    question: "Where do games take place?",
    answer:
      "Games are held at various parks and facilities around Austin, including Zilker Park, Auditorium Shores, and local community centers. Specific locations are shared with teams before each season begins.",
    category: "general",
    priority: 6,
  },
  {
    id: "faq-7",
    question: "What's your policy on competitive play vs. fun?",
    answer:
      "We strike a balance between friendly competition and inclusive fun. While we keep score and celebrate victories, our primary focus is on sportsmanship, learning, and community building. Overly aggressive or unsportsmanlike behavior isn't tolerated.",
    category: "rules",
    priority: 7,
  },
  {
    id: "faq-8",
    question: "Do you have age restrictions?",
    answer:
      "Players must be 18 or older to participate in our adult leagues. We're exploring youth programs and family-friendly events for future seasons.",
    category: "registration",
    priority: 8,
  },
  {
    id: "faq-9",
    question: "What happens if it rains?",
    answer:
      "Games may be postponed or moved indoors depending on weather conditions. We prioritize player safety and will communicate any changes via email at least 2 hours before game time when possible.",
    category: "safety",
    priority: 9,
  },
  {
    id: "faq-10",
    question: "Can I switch teams during a season?",
    answer:
      "Team changes during a season are rare and only considered in exceptional circumstances. We encourage players to work through any team dynamics with their captain and league organizers first.",
    category: "rules",
    priority: 10,
  },
  {
    id: "faq-11",
    question: "Do you offer volunteer opportunities?",
    answer:
      "Yes! We always need volunteers for refereeing, scorekeeping, event setup, and community outreach. Volunteers receive discounts on registration fees and exclusive volunteer appreciation events.",
    category: "general",
    priority: 11,
  },
  {
    id: "faq-12",
    question: "What safety measures do you have in place?",
    answer:
      "We have comprehensive safety protocols including first aid trained staff at games, equipment safety checks, clear rules about contact, and a zero-tolerance policy for harassment or discrimination. All incidents are taken seriously and addressed promptly.",
    category: "safety",
    priority: 12,
  },
];

// Timeline Milestones
const timelineMilestones: TimelineMilestone[] = [
  {
    id: "milestone-1",
    year: 2024,
    month: "May",
    title: "League Founded",
    description:
      "OUT Sports League officially launched with 2 kickball teams and 24 founding members at Zilker Park.",
    type: "founding",
  },
  {
    id: "milestone-2",
    year: 2024,
    month: "August",
    title: "First Championship",
    description:
      "Rainbow Runners won our inaugural kickball championship, establishing the tradition of celebrating all teams at our end-of-season party.",
    type: "achievement",
  },
  {
    id: "milestone-3",
    year: 2020,
    month: "February",
    title: "Dodgeball Added",
    description:
      "Expanded to include dodgeball leagues, doubling our membership and adding indoor play options.",
    type: "expansion",
  },
  {
    id: "milestone-4",
    year: 2020,
    month: "June",
    title: "Virtual Community Events",
    description:
      "Adapted to pandemic challenges by hosting virtual game nights, trivia, and fitness challenges to keep our community connected.",
    type: "community",
  },
  {
    id: "milestone-5",
    year: 2021,
    month: "January",
    title: "100 Members Milestone",
    description:
      "Reached 100 active members across all sports, marking our transition from small group to established community organization.",
    type: "achievement",
  },
  {
    id: "milestone-6",
    year: 2021,
    month: "May",
    title: "First Charity Tournament",
    description:
      "Hosted our first charity dodgeball tournament, raising $2,500 for local LGBTQ+ youth organizations.",
    type: "community",
  },
  {
    id: "milestone-7",
    year: 2021,
    month: "September",
    title: "Leadership Team Expansion",
    description:
      "Formalized leadership structure with dedicated roles for operations, player development, and community outreach.",
    type: "expansion",
  },
  {
    id: "milestone-8",
    year: 2022,
    month: "March",
    title: "Permanent Equipment Storage",
    description:
      "Secured dedicated storage space for league equipment, improving game setup efficiency and equipment quality.",
    type: "facility",
  },
  {
    id: "milestone-9",
    year: 2022,
    month: "July",
    title: "200 Members Strong",
    description:
      "Doubled our membership again, necessitating expansion to additional playing locations and time slots.",
    type: "achievement",
  },
  {
    id: "milestone-10",
    year: 2022,
    month: "November",
    title: "Volunteer Recognition Program",
    description:
      "Launched formal volunteer recognition program, acknowledging the amazing community members who make our league possible.",
    type: "community",
  },
  {
    id: "milestone-11",
    year: 2023,
    month: "April",
    title: "Scholarship Program Launch",
    description:
      "Established need-based scholarship program to ensure financial barriers don't prevent anyone from participating.",
    type: "community",
  },
  {
    id: "milestone-12",
    year: 2023,
    month: "August",
    title: "300+ Members",
    description:
      "Surpassed 300 active members, making us one of the largest inclusive recreational sports leagues in Austin.",
    type: "achievement",
  },
  {
    id: "milestone-13",
    year: 2024,
    month: "January",
    title: "New Website Launch",
    description:
      "Launched our new website with improved registration, team management, and community features.",
    type: "expansion",
  },
];

export const timeline: Timeline = {
  milestones: timelineMilestones,
};

// Helper functions
export const getFAQsByCategory = (category: FAQ["category"]): FAQ[] => {
  return faqs
    .filter(faq => faq.category === category)
    .sort((a, b) => a.priority - b.priority);
};

export const getLeadershipByRole = (
  role: string
): LeadershipMember | undefined => {
  return leadership.find(member => member.role === role);
};

export const getTestimonialsBySport = (
  sportType: "kickball" | "dodgeball"
): Testimonial[] => {
  return testimonials.filter(
    testimonial => testimonial.sportType === sportType
  );
};

export const getTimelineMilestonesByType = (
  type: TimelineMilestone["type"]
): TimelineMilestone[] => {
  return timeline.milestones.filter(milestone => milestone.type === type);
};
