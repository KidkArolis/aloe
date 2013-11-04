var _ = require("lodash");
var config = require("config");
var winston = require("winston");

var logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)(_.extend({
      level: "debug",
      colorize: true,
      timestamp: true
    }, config.logger))
  ]
});

module.exports = logger;