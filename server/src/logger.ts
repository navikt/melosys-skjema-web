import morgan from "morgan";
import winston from "winston";

import config from "./config.js";

const { format } = winston;
const { combine, json, timestamp } = format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  return config.app.env === "dev" ? "debug" : "info";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const logFormat = combine(timestamp(), json());

const stdoutLogger = winston.createLogger({
  level: level(),
  levels,
  transports: [
    new winston.transports.Console({
      format: logFormat,
    }),
  ],
});

const debug = (message: string) => {
  stdoutLogger.debug(message.replaceAll(/[\n\r]/g, ""));
};

const info = (message: string) => {
  stdoutLogger.info(message.replaceAll(/[\n\r]/g, ""));
};

const warning = (message: string) => {
  stdoutLogger.warn(message.replaceAll(/[\n\r]/g, ""));
};

const error = (message: string, error_: Error) => {
  if (error_) {
    stdoutLogger.error(message, { message: `: ${error_.message}` });
  } else {
    stdoutLogger.error(message, { message: `: ${error_}` });
  }
};

const stream = {
  // Use the http severity
  write: (message: string) => stdoutLogger.http(message),
};

const vanligFormat =
  ":method :url :status :res[content-length] - :response-time ms";

const morganMiddleware = morgan(vanligFormat, { stream });

export default {
  debug,
  info,
  warning,
  error,
  logger: stdoutLogger,
  morganMiddleware,
};
