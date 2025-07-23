// Security utilities for headers and CSP
// This provides client-side security enhancements

interface SecurityHeaders {
  [key: string]: string;
}

export class SecurityManager {
  // Content Security Policy configuration
  private static readonly CSP_DIRECTIVES = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://cdn.supabase.co",
      "https://*.supabase.co",
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "https:", "blob:"],
    "connect-src": ["'self'", "https://*.supabase.co", "wss://*.supabase.co"],
    "media-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": [],
  };

  static generateCSP(): string {
    return Object.entries(this.CSP_DIRECTIVES)
      .map(([directive, sources]) =>
        sources.length > 0 ? `${directive} ${sources.join(" ")}` : directive
      )
      .join("; ");
  }

  static getSecurityHeaders(): SecurityHeaders {
    return {
      "Content-Security-Policy": this.generateCSP(),
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    };
  }

  // Sanitization utilities
  static sanitizeHtml(input: string): string {
    // Remove HTML tags and potentially dangerous characters
    return input
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .trim();
  }

  static sanitizeUserInput(input: string): string {
    // Basic input sanitization for user-generated content
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove angle brackets
      .substring(0, 1000); // Limit length
  }

  static validateUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      // Only allow http and https protocols
      return ["http:", "https:"].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  }

  // Setup client-side security headers (limited effectiveness)
  static applyClientSecurityHeaders(): void {
    if (typeof document !== "undefined") {
      // Add meta tags for security headers where possible
      const metaTags = [
        { name: "referrer", content: "strict-origin-when-cross-origin" },
        { httpEquiv: "X-Content-Type-Options", content: "nosniff" },
        { httpEquiv: "X-XSS-Protection", content: "1; mode=block" },
      ];

      metaTags.forEach(tag => {
        if (
          !document.querySelector(`meta[name="${tag.name}"]`) &&
          !document.querySelector(`meta[http-equiv="${tag.httpEquiv}"]`)
        ) {
          const meta = document.createElement("meta");
          if (tag.name) meta.setAttribute("name", tag.name);
          if (tag.httpEquiv) meta.setAttribute("http-equiv", tag.httpEquiv);
          meta.setAttribute("content", tag.content);
          document.head.appendChild(meta);
        }
      });
    }
  }

  // Logging security events (development only)
  static logSecurityEvent(event: string, details?: any): void {
    if (process.env.NODE_ENV === "development") {
      console.warn(`🚨 Security Event: ${event}`, details);
    }

    // In production, you would send this to your logging service
    // Example: send to monitoring service, Supabase logs, etc.
  }
}

// Initialize security headers on module load
if (typeof window !== "undefined") {
  SecurityManager.applyClientSecurityHeaders();
}
