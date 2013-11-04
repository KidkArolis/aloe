var express = require("express");
var fs = require("fs");
var path = require("path");
var amdConfig = require("./amd_config");

module.exports = function (cwd, port) {

  var baseUrl = "http://localhost:" + port;
  var requirejs = fs.readFileSync(path.join(__dirname, "require.js"));

  var app = express();
  app.use(express.compress());
  app.use(express.favicon());

  // app.set('port', process.env.PORT || 3456);
  // app.use(express.logger({
  //   format: "short",
  //   stream: {
  //     write: function (message) {
  //       log.info(message.replace(/\n/g, ""));
  //     }
  //   }
  // }));

  var getRequire = function (configOnly, cb) {
    amdConfig(cwd, baseUrl, function (config) {
      config = "require.config(" + JSON.stringify(config, null, 2) + ")";
      if (configOnly) {
        cb(config);
      } else {
        cb(requirejs + config);
      }
    });
  };

  app.get("/require.config.js", function (req, res) {
    res.type('application/javascript');
    getRequire(true, function (config) {
      res.send(config);
    });
  });

  app.get('/require.js', function (req, res) {
    res.type('application/javascript');
    getRequire(false, function (requireAndConfig) {
      res.send(requireAndConfig);
    });
  });

  app.use(require("./amd_wrapper")(path.join(cwd, "node_modules")));

  return app.listen(port, function () {
    console.log("listening on http://localhost:4103");
  });
};