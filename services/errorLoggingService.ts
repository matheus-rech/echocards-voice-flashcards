export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  API = 'api',
  STORAGE = 'storage',
  AUDIO = 'audio',
  RENDER = 'render',
  NETWORK = 'network',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

interface ErrorLog {
  timestamp: Date;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
}

class ErrorLoggingService {
  private logs: ErrorLog[] = [];
  private maxLogs = 100; // Keep last 100 errors in memory
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Log an error with context
   */
  logError(
    error: Error | string,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: Record<string, any>
  ): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    const log: ErrorLog = {
      timestamp: new Date(),
      message: errorMessage,
      category,
      severity,
      stack: errorStack,
      context,
    };

    // Add to in-memory logs
    this.logs.push(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest
    }

    // Console logging
    this.logToConsole(log);

    // Store in localStorage for debugging
    this.persistErrorLog(log);

    // Future: Send to external service (Sentry, LogRocket, etc.)
    if (this.isProduction && severity === ErrorSeverity.CRITICAL) {
      this.sendToExternalService(log);
    }
  }

  /**
   * Log to console with appropriate level
   */
  private logToConsole(log: ErrorLog): void {
    const prefix = `[${log.category.toUpperCase()}] [${log.severity.toUpperCase()}]`;
    const message = `${prefix} ${log.message}`;

    switch (log.severity) {
      case ErrorSeverity.LOW:
        console.info(message, log.context);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(message, log.context);
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        console.error(message, log.context);
        if (log.stack) {
          console.error('Stack trace:', log.stack);
        }
        break;
    }
  }

  /**
   * Persist error to localStorage for debugging
   */
  private persistErrorLog(log: ErrorLog): void {
    try {
      const key = 'echoCards_errorLogs';
      const existingLogs = localStorage.getItem(key);
      const logs: ErrorLog[] = existingLogs ? JSON.parse(existingLogs) : [];

      logs.push({
        ...log,
        timestamp: log.timestamp.toISOString() as any, // Serialize date
      });

      // Keep only last 50 errors in localStorage
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }

      localStorage.setItem(key, JSON.stringify(logs));
    } catch (e) {
      // Failed to persist - probably localStorage is full or unavailable
      console.error('Failed to persist error log:', e);
    }
  }

  /**
   * Send to external error tracking service
   * TODO: Integrate with Sentry, LogRocket, or similar
   */
  private sendToExternalService(log: ErrorLog): void {
    // Placeholder for external service integration
    // Example with Sentry:
    // if (window.Sentry) {
    //   window.Sentry.captureException(new Error(log.message), {
    //     level: this.mapSeverityToSentryLevel(log.severity),
    //     tags: { category: log.category },
    //     extra: log.context,
    //   });
    // }
    console.log('[External Service] Would send:', log);
  }

  /**
   * Get all logged errors
   */
  getErrorLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): ErrorLog[] {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): ErrorLog[] {
    return this.logs.filter(log => log.severity === severity);
  }

  /**
   * Clear all error logs
   */
  clearLogs(): void {
    this.logs = [];
    try {
      localStorage.removeItem('echoCards_errorLogs');
    } catch (e) {
      console.error('Failed to clear error logs:', e);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byCategory: Record<ErrorCategory, number>;
    bySeverity: Record<ErrorSeverity, number>;
  } {
    const byCategory = {} as Record<ErrorCategory, number>;
    const bySeverity = {} as Record<ErrorSeverity, number>;

    // Initialize counters
    Object.values(ErrorCategory).forEach(cat => byCategory[cat] = 0);
    Object.values(ErrorSeverity).forEach(sev => bySeverity[sev] = 0);

    // Count errors
    this.logs.forEach(log => {
      byCategory[log.category]++;
      bySeverity[log.severity]++;
    });

    return {
      total: this.logs.length,
      byCategory,
      bySeverity,
    };
  }

  /**
   * Export error logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
export const errorLogger = new ErrorLoggingService();
