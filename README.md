Aloe
====

Use `npm` in your AMD project.

Aloe could be seen as an alternative to browserify - it enables easy usage of npm modules in the browser. It was developed for use in projects that are already AMD and/or like AMD (!), but want to use npm as **the** package manager. The npm packages are (and should be) authored in CJS, but aloe lets you transparently mix npm's CJS modules and your project's AMD modules by wrapping CJS modules are in AMD at serve time.

With Aloe you can do the following in your frontend JavaScript projects:

* use npm as the package manager
* use a mixture of AMD/CJS modules in your project
* link local modules - useful for development of modules, or for splitting your large app into multiple modules - each with it's own `package.json` - while keeping it in the same repo (or separate ones) - using `npm link`
* generate an AMD build config that can be used to build all of the above as you would normally build your AMD project
* use node builtin core modules in the browser (standard lib, like path, buffer, etc. and globals such as process, __dirname, etc. - all reusing browserify's node-browser-builtins)

Aloe is only intended for use in development. For production, aloe can export the AMD config npm modules to a dist/build directory - those files can then be served with your usual static server or optimized using and AMD optimizer, such as r.js. The aloe export feature could also be used for development by running it after each npm install, but that requires a slightly more involved configuration (see examples).


## Usage

Start the server

```
aloe
```

Embed aloe's require.js+config into your HTML

```
<script data-main="app" src="http://localhost:4103/require.js"></script>
```

You can add your own AMD config as usual, you can configure the base URL anyway you want, etc. However, you can now require npm modules you've installed via `npm install`.

E.g.

```
npm install location-bar
```

And in your `app.js`

```
define(function (require) {

  var LocationBar = require("location-bar");

  var locationBar = new LocationBar();
  locationBar.update("/some/url");

});
```


## Configuration

.aloerc

## Linking

## TODO

* look into https://npmjs.org/package/browser-resolve
* error handling
* tests
* --create should create a directory with index.html and app.js and package.json with some modules
* writeup npm link
* aloe config / aloe build / aloe export