# jade html loader for webpack

## Usage

``` javascript
var html = require("jade-html!./file.jade");
// => returns file.jade content as html
```

Don't forget to polyfill `require` if you want to use it in node.
See `webpack` documentation.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
