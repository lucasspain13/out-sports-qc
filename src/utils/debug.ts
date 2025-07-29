// Debug utility for conditional logging
const isDevelopment = import.meta.env.DEV;

export const debugLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

export const debugWarn = (...args: any[]) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

export const debugError = (...args: any[]) => {
  if (isDevelopment) {
    console.error(...args);
  }
};
