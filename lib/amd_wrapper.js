var fs = require("fs");
var join = require("path").join;
var detect = require("detect-amd");
var esprima = require("esprima");
var xxhash = require("xxhash");
var url = require("url");

var amdMetaHash = {};
var parseAMDMeta = function (fileContent) {
  var hash = xxhash.hash(fileContent, 0xCAFEBABE);
  if (amdMetaHash[hash] === undefined) {
    amdMetaHash[hash] = detect.fromAst(esprima.parse(fileContent));
  }
  return amdMetaHash[hash];
};

module.exports = function (root) {
  return function (req, res) {
    // var originalUrl = url.parse(req.originalUrl);
    var path = url.parse(req.url).pathname;

    var r = root;

    if (path.indexOf("/browser-builtins") === 0) {
      // console.log("BUILTIN?", path);
      r = join(__dirname, "../node_modules");
    }

    fs.readFile(join(r, path), function (err, content) {
      if (err) {
        return res.send(404);
      }


      // if (content.indexOf("module.exports") !== -1 || content.indexOf("define(") === -1) {


      var amdMeta = parseAMDMeta(content);
      if (!amdMeta) {
        content = "define(function (require, exports, module) {\n" +
          "var define; var global = window;\n" +
          content.toString().replace(/(require\(['"].*)\.js(['"]\))/, "$1$2") +
          "\n});";
      } else if (amdMeta.id) {
        content = content.toString().replace(/(define\([ '"\n]+.*[ '"\n]+,)/, "define(");
      }

      res.type("text/javascript");
      res.send(content);
    });
  };
};