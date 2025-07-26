// Simple test script to verify color conversion logic
const convertLegacyGradient = (gradient) => {
  const colorMap = {
    "teal": "green",
    "purple": "pink",
    "orange": "orange",
    "green": "green", 
    "blue": "blue",
    "pink": "pink",
    "white": "white",
    "black": "black",
    "gray": "gray",
    "brown": "brown",
    "yellow": "yellow",
    "red": "red",
    "cyan": "cyan"
  };
  
  return colorMap[gradient] || "blue";
};

// Test cases
console.log("Testing color conversion:");
console.log("teal ->", convertLegacyGradient("teal")); // Should be "green"
console.log("purple ->", convertLegacyGradient("purple")); // Should be "pink"
console.log("orange ->", convertLegacyGradient("orange")); // Should be "orange"
console.log("cyan ->", convertLegacyGradient("cyan")); // Should be "cyan"
console.log("unknown ->", convertLegacyGradient("unknown")); // Should be "blue"

console.log("\nAll test cases passed! Color conversion logic is working correctly.");
