var _ = require("lodash");
var fs = require("fs");
var path = require("path");
var readInstalled = require("read-installed");

var builtinPath = path.join(__dirname, "..", "node_modules", "browser-builtins", "builtin");

var builtins = {};
fs.readdirSync(builtinPath).forEach(function (file) {
  builtins[path.basename(file, '.js')] = path.resolve(builtinPath, file);
});

var aloeNodeModulesPath = path.join(__dirname, "..", "node_modules");

module.exports = function makeConfig(dir, baseUrl, cb) {
  readInstalled(dir, function (err, npmList) {
    readInstalled(path.join(aloeNodeModulesPath, "browser-builtins"), function (err, aloeNpmList) {
      var builtinPackages = _.map(builtins, function (absPath, name) {
        var pathParts = absPath.split("/");
        return {
          name: name,
          main: pathParts.pop().split(".js")[0],
          // these are "virtual" locations in that they
          // will be handled by the server in a special way
          // when requested, because they're not located in the
          // project's node_modules, but aloe's node_modules
          location: baseUrl + "/" + path.relative(aloeNodeModulesPath, pathParts.join("/"))
        };
      });

      var amdConfig = {
        map: {
          // add core which are provided by modules
          "*": {
            punycode: "punycode",
            http: "http-browserify",
            vm: "vm-browserify",
            crypto: "crypto-browserify",
            console: "console-browserify",
            zlib: "zlib-browserify",
            buffer: "buffer-browserify",
            constants: "constants-browserify",
            os: "os-browserify"
          }
        },
        packages: builtinPackages
      };

      var basePath = "/";
      extractInfo(aloeNpmList.dependencies, false, basePath + "browser-builtins/node_modules");
      extractInfo(npmList.dependencies, false, basePath);

      cb(amdConfig);

      function extractInfo(dependencies, currentPackage, currentPath) {
        var isTopLevel = !currentPackage;
        var versionedName;

        _.each(dependencies, function (info, name) {
          // skip aloe, at least for now, we could make this configurable
          // in .aloerc to help avoid devDeps, etc. (dev deps might still be useful
          // though for example for using npm in tests, etc.)
          if (name === "aloe") {
            return;
          }

          if (!isTopLevel) {
            versionedName = name + "-" + info.version;
          } else {
            versionedName = name;
          }

          amdConfig.packages.push({
            name: versionedName,
            main: info.main || "index",
            location: baseUrl + path.join(currentPath, name)
          });

          if (!isTopLevel) {
            if (!amdConfig.map[currentPackage]) {
              amdConfig.map[currentPackage] = {};
            }
            amdConfig.map[currentPackage][name] = versionedName;
          }

          if (info.dependencies) {
            extractInfo(info.dependencies, versionedName, path.join(currentPath, name, "node_modules"));
          }

        });
      }
    });
  });
};