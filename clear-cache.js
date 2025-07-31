/**
 * Cache clearing utility for development
 * Run this in the browser console to clear the sports cache
 */

// Add to window for browser console access
if (typeof window !== "undefined") {
  window.clearSportsCache = function() {
    // Clear localStorage if any
    if (localStorage) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('sports') || key.includes('cache')) {
          localStorage.removeItem(key);
          console.log(`Cleared localStorage key: ${key}`);
        }
      });
    }
    
    // Force page reload to clear in-memory cache
    console.log("🔄 Clearing cache and reloading page...");
    window.location.reload(true);
  };
  
  console.log("🛠️ Cache clearing utility loaded!");
  console.log("Run window.clearSportsCache() to clear sports data cache");
}
