const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

const logDir = path.join(__dirname, "../logs");

const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    payment: 3, 
  },
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM",
      zippedArchive: true,
      maxFiles: "2m",
      level: "info",
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM",
      zippedArchive: true,
      maxFiles: "2m",
      level: "error",
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, "payment-%DATE%.log"),
      datePattern: "YYYY-MM",
      zippedArchive: true,
      maxFiles: "2m",
      level: "payment",
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
});

module.exports = logger;
