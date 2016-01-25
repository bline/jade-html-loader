# jade html loader for webpack
Unlike the [webpack/jade-loader](https://github.com/webpack/jade-loader) it allows you to get HTML string back instead of a function reference.

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

``` javascript
var html = require("jade-html!./file.jade");
// returns file.jade content as html string
```

### Apply via webpack config

It's recommended to adjust your `webpack.config` so `jade-html` is applied automatically on all files ending on `.jade`:

``` javascript
module.exports = {
  ...
  module: {
    loaders: [
      {
        test: /\.jade$/,
        loaders: [jade-html]
      }
    ]
  }
};
```

Then you only need to write: `require("./file.jade")`.

## Jade compiler options and template locals

You can pass options to jade by defining a `jadeLoader`-property on your `webpack.config.js`.
See jade [API documentation](http://jade-lang.com/api/) for all available options.

All properties from webpack config will be passed to jade compiler function.


``` javascript
module.exports = {
  ...
  module: {
    loaders: [
     {
       test: /\.jade$/,
       loaders: [jade-html]
     }
    ]
  }
  jadeLoader: {
     locals: {
       foo: 'bar',
     },
     pretty: true,
     debug: false,
     cache: true,
     basedir: sourcePath
  }
};
```

Passing your options as [query parameters](http://webpack.github.io/docs/using-loaders.html#query-parameters) is also supported,
but can get confusing if you need to set a lot of options.

If you need to define two different loader configs, you can also change the config's property name via `jade-html?config=otherJadeLoaderConfig`:

``` javascript
module.exports = {
  ...
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ["jade-html?config=otherJadeLoaderConfig"]
      }
    ]
  }
  otherJadeLoaderConfig: {
    ...
  }
};
```

### Locals
As you can see above we can pass locals via `webpack.config.js`:

``` javascript
module.exports = {
  ...
    jadeLoader: {
     locals: {
       foo: 'bar',
       anyExpression: require('someModule')
     },
    }
};
```

Also you can pass locals via query string:

``` javascript
require('template.jade?foo=bar')
```

All params will be passed to template.

## require() in templates

You can use `require()` in jade templates to utilize webpack functionality.

Don't forget to polyfill `require()` if you want to use it.
See [enhanced-require](https://github.com/webpack/enhanced-require) documentation.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)

