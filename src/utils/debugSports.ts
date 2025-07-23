// Sports Data Debug Utility
// This utility helps debug sports data loading issues

import {
  sportsInfoApi,
  testSupabaseConnection,
} from "../lib/contentManagement";

export const debugSportsData = async () => {
  console.log("=== SPORTS DATA DEBUG ===");

  // Test Supabase connection
  console.log("1. Testing Supabase connection...");
  const connectionTest = await testSupabaseConnection();
  console.log("Connection test result:", connectionTest);

  // Test sports data loading
  console.log("2. Testing sports data loading...");
  try {
    const sportsData = await sportsInfoApi.getAll();
    console.log("Sports data loaded:", sportsData);

    if (sportsData.length === 0) {
      console.warn("⚠️ No sports data found in database!");
      console.log("This is likely why sport names aren't showing on cards.");
      console.log(
        "Run the fix-sports-data.sql script to populate the sports_info table."
      );
    } else {
      console.log("✅ Sports data found:", sportsData.length, "sports");
      sportsData.forEach(sport => {
        console.log(
          `- ${sport.name}: ${sport.description.substring(0, 50)}...`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error loading sports data:", error);
    console.log("This explains why sport names aren't showing on cards.");
  }

  console.log("=== DEBUG COMPLETE ===");
};

// Auto-run debug in development
if (import.meta.env.DEV) {
  debugSportsData();
}

export default debugSportsData;
