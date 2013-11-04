var nopt = require("nopt");
var help = require("./help");
var createExample = require("./create_example");
var serve = require("./server");

var options = {
  "create": Boolean,
  "port": Number,
  "help": Boolean
};

var shorthands = {
  "c": ["--create"],
  "p": ["--port"],
  "h": ["--help"]
};

module.exports = function () {
  var parsed = nopt(options, shorthands, process.argv);

  var cwd = process.cwd();

  if (parsed.help) {
    return help();
  }

  if (parsed.create) {
    return createExample(cwd);
  }

  var port = parsed.port || 4103;
  serve(cwd, port);
};