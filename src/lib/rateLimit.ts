// Client-side rate limiting utility for authentication attempts
// This provides basic protection but should be complemented by server-side rate limiting

interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

class ClientRateLimit {
  private attempts = new Map<string, RateLimitEntry>();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly blockDurationMs = 30 * 60 * 1000; // 30 minutes

  private getKey(identifier: string, action: string): string {
    return `${action}:${identifier}`;
  }

  isBlocked(identifier: string, action: string): boolean {
    const key = this.getKey(identifier, action);
    const entry = this.attempts.get(key);

    if (!entry) return false;

    // Check if block period has expired
    if (entry.blockedUntil && Date.now() > entry.blockedUntil) {
      this.attempts.delete(key);
      return false;
    }

    return !!entry.blockedUntil;
  }

  canAttempt(
    identifier: string,
    action: string
  ): { allowed: boolean; remainingAttempts?: number; retryAfter?: number } {
    if (this.isBlocked(identifier, action)) {
      const entry = this.attempts.get(this.getKey(identifier, action));
      const retryAfter = entry?.blockedUntil
        ? Math.ceil((entry.blockedUntil - Date.now()) / 1000)
        : 0;
      return { allowed: false, retryAfter };
    }

    const key = this.getKey(identifier, action);
    const entry = this.attempts.get(key);
    const now = Date.now();

    if (!entry) {
      return { allowed: true, remainingAttempts: this.maxAttempts - 1 };
    }

    // Reset if window has expired
    if (now - entry.lastAttempt > this.windowMs) {
      this.attempts.delete(key);
      return { allowed: true, remainingAttempts: this.maxAttempts - 1 };
    }

    const remainingAttempts = this.maxAttempts - entry.attempts;
    return {
      allowed: remainingAttempts > 0,
      remainingAttempts: Math.max(0, remainingAttempts - 1),
    };
  }

  recordAttempt(identifier: string, action: string, success: boolean): void {
    const key = this.getKey(identifier, action);
    const now = Date.now();

    if (success) {
      // Clear attempts on successful action
      this.attempts.delete(key);
      return;
    }

    const entry = this.attempts.get(key);

    if (!entry || now - entry.lastAttempt > this.windowMs) {
      // First attempt or window expired
      this.attempts.set(key, {
        attempts: 1,
        lastAttempt: now,
      });
    } else {
      // Increment attempts
      const newAttempts = entry.attempts + 1;
      const updatedEntry: RateLimitEntry = {
        attempts: newAttempts,
        lastAttempt: now,
      };

      // Block if max attempts exceeded
      if (newAttempts >= this.maxAttempts) {
        updatedEntry.blockedUntil = now + this.blockDurationMs;
      }

      this.attempts.set(key, updatedEntry);
    }
  }

  getRemainingTime(identifier: string, action: string): number {
    const key = this.getKey(identifier, action);
    const entry = this.attempts.get(key);

    if (!entry?.blockedUntil) return 0;

    return Math.max(0, Math.ceil((entry.blockedUntil - Date.now()) / 1000));
  }
}

// Export singleton instance
export const authRateLimit = new ClientRateLimit();
