import React from "react";

export interface MenuItem {
  label: string;
  href?: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: MenuItem[];
}

export interface CTAButton {
  text: string;
  variant: "primary" | "secondary" | "outline";
  href?: string;
  onClick?: () => void;
}

export interface SportInfo {
  name: string;
  title?: string; // Display name for the sport
  description: string;
  image?: string;
  gradient: "orange" | "green" | "blue" | "pink" | "white" | "black" | "gray" | "brown" | "purple" | "yellow" | "red" | "cyan";
  participants?: number;
  nextGame?: Date;
  features?: string[];
  totalTeams?: number;
  rosterPath?: string;
  comingSoon?: boolean;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  primaryCTA: CTAButton;
  secondaryCTA: CTAButton;
  backgroundImage?: string;
}

export interface NavigationProps {
  logo: string;
  menuItems: MenuItem[];
  isScrolled?: boolean;
  onMenuToggle?: () => void;
  showLiveScores?: boolean;
  currentRoute?: string;
}

export interface SportCardProps {
  sport: SportInfo;
  onClick?: () => void;
}

export interface AboutSectionProps {
  title: string;
  content: string;
  features: Feature[];
  image?: string;
}

export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  href?: string;
}

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

// Team Roster Interfaces
export interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  quote: string;
  avatar?: string;
  teamId: string;
  sportType: "kickball" | "dodgeball";
}

export interface Team {
  id: string;
  name: string;
  sportType: "kickball" | "dodgeball";
  gradient: "orange" | "green" | "blue" | "pink" | "white" | "black" | "gray" | "brown" | "purple" | "yellow" | "red" | "cyan";
  description: string;
  players: Player[];
  captain?: string; // Player ID
  founded: number;
  wins: number;
  losses: number;
  motto: string;
}

// Component Props for Team Roster
export interface TeamCardProps {
  team: Team;
  onClick?: () => void;
  showStats?: boolean;
}

export interface PlayerCardProps {
  player: Player;
  iscaptain?: boolean;
  onClick?: () => void;
  showQuote?: boolean;
}

export interface RosterPageProps {
  sportType: "kickball" | "dodgeball";
  teams: Team[];
  onTeamSelect?: (team: Team) => void;
}

export interface TeamDetailPageProps {
  team: Team;
  onBack?: () => void;
  onPlayerSelect?: (player: Player) => void;
}

// Schedule and Game Interfaces
export interface GameLocation {
  id: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: string[];
  fieldType: "grass" | "turf" | "indoor" | "court";
  parking: boolean;
  restrooms: boolean;
  waterFountains: boolean;
  markerColor?: "green" | "red" | "blue" | "yellow" | "orange";
  capacity?: number;
  concessions?: boolean;
}

export type GameStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "postponed";

export interface GameScore {
  homeScore: number;
  awayScore: number;
  periods?: number[];
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: Date;
  time: string;
  location: GameLocation;
  status: GameStatus;
  scores?: GameScore;
  sportType: "kickball" | "dodgeball";
  week: number;
  season: string;
}

export interface ScheduleWeek {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  games: Game[];
}

export interface Schedule {
  season: string;
  sportType: "kickball" | "dodgeball";
  weeks: ScheduleWeek[];
  totalWeeks: number;
}

// Component Props for Schedule
export interface GameCardProps {
  game: Game;
  onClick?: () => void;
  showLocation?: boolean;
  showScore?: boolean;
  compact?: boolean;
}

export interface ScheduleWeekProps {
  week: ScheduleWeek;
  onGameSelect?: (game: Game) => void;
  showLocations?: boolean;
}

export interface ScheduleOverviewProps {
  schedule: Schedule;
  onGameSelect?: (game: Game) => void;
  onWeekSelect?: (week: ScheduleWeek) => void;
  currentWeek?: number;
}

export interface LocationMapProps {
  locations: GameLocation[];
  selectedLocation?: GameLocation;
  onLocationSelect?: (location: GameLocation) => void;
  height?: string;
  showAllMarkers?: boolean;
}

// General Info Interfaces
export interface LeagueInfo {
  mission: string;
  history: string;
  values: CoreValue[];
  contact: ContactInfo;
  foundedYear: number;
  memberCount: number;
  seasonsCompleted: number;
}

export interface CoreValue {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    discord?: string;
  };
  officeHours?: {
    [key: string]: string;
  };
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  email?: string;
  joinedYear: number;
  specialties: string[];
  favoriteQuote: string;
}

export interface Testimonial {
  id: string;
  memberName: string;
  role: string; // e.g., "Player", "Team Captain", "Volunteer"
  quote: string;
  avatar?: string;
  teamName?: string;
  sportType?: "kickball" | "dodgeball";
  memberSince: number;
  location: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category:
    | "general"
    | "registration"
    | "rules"
    | "costs"
    | "events"
    | "safety";
  priority: number; // Lower numbers appear first
}

export interface TimelineMilestone {
  id: string;
  year: number;
  month: string;
  title: string;
  description: string;
  type: "founding" | "expansion" | "achievement" | "community" | "facility";
  image?: string;
}

export interface Timeline {
  milestones: TimelineMilestone[];
}

// Component Props for General Info
export interface LeagueInfoSectionProps {
  leagueInfo: LeagueInfo;
  className?: string;
}

export interface LeadershipSectionProps {
  leadership: LeadershipMember[];
  title?: string;
  className?: string;
}

export interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
  showFilters?: boolean;
  className?: string;
}

export interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  showCategories?: boolean;
  className?: string;
}

export interface TimelineSectionProps {
  timeline: Timeline;
  title?: string;
  className?: string;
}

export interface ContactSectionProps {
  contact: ContactInfo;
  title?: string;
  showMap?: boolean;
  className?: string;
}

export interface GeneralInfoPageProps {
  leagueInfo: LeagueInfo;
  leadership: LeadershipMember[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  timeline: Timeline;
}

// Announcement System Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  type: "general" | "game" | "registration" | "maintenance" | "event";
  target_audience: "all" | "players" | "teams" | "kickball" | "dodgeball";
  is_active: boolean;
  expires_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  priority?: "low" | "normal" | "high" | "urgent";
  type?: "general" | "game" | "registration" | "maintenance" | "event";
  target_audience?: "all" | "players" | "teams" | "kickball" | "dodgeball";
  expires_at?: string;
}

export interface AnnouncementManagementProps {
  className?: string;
}

export interface AnnouncementBannerProps {
  className?: string;
  maxHeight?: string;
  showPriority?: boolean;
}
