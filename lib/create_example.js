var fs = require("fs");
var path = require("path");

module.exports = function (destination) {
  var index = fs.readFileSync(path.join(__dirname, "index.html"));
  fs.writeFileSync(path.join(destination, "index.html"), index);
};