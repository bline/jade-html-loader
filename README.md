# jade html loader for webpack

The loader allows you to get HTML back instead of a function reference. I found this useful for templates which render server side.

## Installation

```sh
npm i jade-html --save-dev
```

**Note**: npm version 3 won't automatically install [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies), so you need to manual install jade:

```sh
npm i jade --save-dev
```

## Usage

```javascript
var html = require("jade-html?single!./file.jade");
// => returns file.jade content as html
```

If you want to use this loader with [file-loader](https://github.com/webpack/file-loader) then you should remove the `single` option:

```javascript
require("file?name=[name].html!jade-html!./file.jade");
```

## Options

Possible options are (all passed to jade.compile()):

* self   - set the context;

* pretty - boolean, output pretty html or not;

* locals - set locals;

* single - set this option if you want the loader without file-loader.

Don't forget to polyfill `require` if you want to use it in node.
See [enhanced-require](https://github.com/webpack/enhanced-require) documentation.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
