# jade html loader for webpack

## Usage

``` javascript
var html = require("jade-html!./file.jade");
// => returns file.jade content as html
```

Allows you to get HTML back instead of a function reference. I found this
useful for templates which render server side.

Possible options are (all passed to jade.compile()):

* self   - set the context

* pretty - boolean, output pretty html or not

* locals - set locals

The loader query is passed to template function, also all environments variables
from process.env will be copied into locals and could be used in
templates `#{MY_ENV_VAR}`.


```javascript
require("jade-html?{author:"Kafka"}!./file.jade");
```

```jade
html
  script src="#{CDN_URL}/react.js"
  body
    h3 #{author}
```

Don't forget to polyfill `require` if you want to use it in node.
See [enhanced-require](https://github.com/webpack/enhanced-require) documentation.


## License

MIT (http://www.opensource.org/licenses/mit-license.php)

