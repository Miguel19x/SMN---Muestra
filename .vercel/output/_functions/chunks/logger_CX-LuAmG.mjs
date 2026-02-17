class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
  }
  /**
   * Log con nivel y contexto
   */
  log(level, message, context) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const emoji = {
      debug: "🔍",
      info: "ℹ️",
      warn: "⚠️",
      error: "❌"
    };
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...context
    };
    if (this.isDevelopment) {
      console[level](`${emoji[level]} [${level.toUpperCase()}] ${message}`, context || "");
    } else {
      console[level](JSON.stringify(logEntry));
    }
  }
  debug(message, context) {
    if (this.isDevelopment) {
      this.log("debug", message, context);
    }
  }
  info(message, context) {
    this.log("info", message, context);
  }
  warn(message, context) {
    this.log("warn", message, context);
  }
  error(message, context) {
    this.log("error", message, context);
  }
}
const logger = new Logger();

export { logger as l };
