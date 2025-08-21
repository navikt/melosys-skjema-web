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

const stdoutLogger = winston.createLogger({
  level: level(),
  levels,
  transports: [
    new winston.transports.Console({
      format: combine(timestamp(), json()),
    }),
  ],
});

const debug = (msg: string) => {
  stdoutLogger.debug(msg.replaceAll(/[\n\r]/g, ""));
};

const info = (msg: string) => {
  stdoutLogger.info(msg.replaceAll(/[\n\r]/g, ""));
};

const warning = (msg: string) => {
  stdoutLogger.warn(msg.replaceAll(/[\n\r]/g, ""));
};

const error = (msg: string, err: Error) => {
  if (err) {
    stdoutLogger.error(msg, { message: `: ${err.message}` });
  } else {
    stdoutLogger.error(msg, { message: `: ${err}` });
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
