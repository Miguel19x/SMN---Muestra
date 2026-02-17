class CustomError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { CustomError as C };
