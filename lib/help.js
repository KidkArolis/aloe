module.exports = help;

function help() {
/*

  Usage: aloe

  Starts the aloe development server on ``http://localhost:4103`` and serves npm packages
  that you can require() in your AMD project. Simply embed the following in your project:

  <script src="http://localhost:4103/require.js"></script>

  and then you'll be able to npm install <module> and then require(<module>) in your AMD project.
  The node_modules path lookups work as usual. Node builtins (e.g. require("url")) are also available.

  Modules that are detected to support AMD are not touched (with an exception of named modules),
  and all other files (e.g. CJS modules) are wrapped with the following wrapper:

    define(function (require, exports, module) {});

  To see a sample app, run:
    aloe create app

  arguments:

    --create                    Creates a sample index.html
    --port                      Set the port, defaults to 4103

*/

  var str = help + '';

  process.stdout.write(str.slice(str.indexOf('/*') + 3, str.indexOf('*/')));
}