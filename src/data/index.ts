// Central export for all data - now using Supabase
export * from "./supabase";

// Export league information and general content
export * from "./leagueInfo";

// Keep static data exports for fallback/reference
export * as staticLocations from "./locations";
export * as staticSchedules from "./schedules";
export * as staticTeams from "./teams";
