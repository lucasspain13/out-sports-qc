const securityEvents = [];

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request details (be careful not to log sensitive data)
  const requestInfo = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  };

  // Log suspicious patterns
  if (
    req.url.includes("<script>") ||
    req.url.includes("javascript:") ||
    req.url.includes("onload=")
  ) {
    logSecurityEvent("SUSPICIOUS_REQUEST", {
      ...requestInfo,
      reason: "Potential XSS attempt in URL",
    });
  }

  // Log admin access attempts
  if (req.url.startsWith("/api/admin")) {
    logSecurityEvent("ADMIN_ACCESS_ATTEMPT", requestInfo);
  }

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const responseInfo = {
      ...requestInfo,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    // Log failed authentication attempts
    if (req.url.includes("/auth/") && res.statusCode >= 400) {
      logSecurityEvent("AUTH_FAILURE", responseInfo);
    }

    // Log slow requests (potential DoS)
    if (duration > 5000) {
      // 5 seconds
      logSecurityEvent("SLOW_REQUEST", responseInfo);
    }
  });

  next();
};

const logSecurityEvent = (eventType, details) => {
  const event = {
    type: eventType,
    timestamp: new Date().toISOString(),
    ...details,
  };

  // Store in memory for development (in production, send to logging service)
  securityEvents.push(event);

  // Keep only last 1000 events to prevent memory bloat
  if (securityEvents.length > 1000) {
    securityEvents.shift();
  }

  // Console log for development
  if (process.env.NODE_ENV === "development") {
    console.warn(`🚨 Security Event [${eventType}]:`, details);
  }

  // In production, you would send this to your monitoring service:
  // - Supabase Edge Functions
  // - External logging service (LogRocket, DataDog, etc.)
  // - Custom analytics endpoint
};

const getSecurityEvents = (req, res) => {
  // Only allow this in development or for admin users
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({ error: "Access denied" });
  }

  res.json({
    events: securityEvents,
    count: securityEvents.length,
  });
};

module.exports = {
  requestLogger,
  logSecurityEvent,
  getSecurityEvents,
};
