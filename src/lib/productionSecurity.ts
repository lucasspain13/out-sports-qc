// Production Security Configuration
// This file contains security utilities and checks for production deployment

/**
 * Sanitized logging utility that prevents sensitive data leakage
 */
export const secureLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === "development") {
    if (data) {
      // Create a sanitized version of the data
      const sanitizedData = sanitizeLogData(data);
      console.log(`[DEV] ${message}`, sanitizedData);
    } else {
      console.log(`[DEV] ${message}`);
    }
  } else {
    // In production, only log critical errors without sensitive data
    if (message.includes("Error") || message.includes("Failed")) {
      console.error(`[PROD] ${message}`);
    }
  }
};

/**
 * Sanitize sensitive data from logs
 */
const sanitizeLogData = (data: any): any => {
  if (!data || typeof data !== "object") return data;

  const sanitized = { ...data };

  // Sanitize common sensitive fields
  const sensitiveFields = [
    "userId",
    "user_id",
    "id",
    "email",
    "userEmail",
    "token",
    "pushToken",
    "push_token",
    "password",
    "key",
    "secret",
    "authorization",
    "auth",
  ];

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      if (typeof sanitized[field] === "string") {
        if (field.includes("email") || field.includes("Email")) {
          sanitized[field] = sanitized[field].replace(
            /(.{2}).*(@.*)/,
            "$1***$2"
          );
        } else if (field.includes("token") || field.includes("Token")) {
          sanitized[field] = sanitized[field].substring(0, 8) + "...";
        } else if (field.includes("id") || field.includes("Id")) {
          sanitized[field] = sanitized[field].substring(0, 8) + "...";
        } else {
          sanitized[field] = "[REDACTED]";
        }
      }
    }
  }

  return sanitized;
};

/**
 * Production security headers for AWS deployment
 */
export const getSecurityHeaders = () => {
  return {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    "Content-Security-Policy":
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
      "frame-ancestors 'none';",
  };
};

/**
 * Validate environment variables for production
 */
export const validateProductionEnv = () => {
  const requiredEnvVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

  const missing = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate URL format
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (
    !supabaseUrl.startsWith("https://") ||
    !supabaseUrl.includes(".supabase.co")
  ) {
    throw new Error("Invalid SUPABASE_URL format");
  }

  // Validate key format (basic check)
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!anonKey.startsWith("eyJ")) {
    throw new Error("Invalid SUPABASE_ANON_KEY format");
  }

  secureLog("✅ Environment variables validated for production");
};

/**
 * Runtime security checks for production
 */
export const performSecurityChecks = () => {
  try {
    validateProductionEnv();

    // Check if we're in production mode
    if (process.env.NODE_ENV === "production") {
      secureLog("🔒 Production security checks passed");
    }

    return true;
  } catch (error) {
    console.error(
      "❌ Security check failed:",
      error instanceof Error ? error.message : error
    );
    return false;
  }
};
