/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Scott Beck @bline
 */

var _ = require('lodash');
var loaderUtils = require("loader-utils");
var Path = require('path');

module.exports = function(source) {
    var jade = require("jade");
    var options = loaderUtils.getOptions(this);

    var jadeOptions = _.defaults(options, {
        filename: this.resourcePath,
        externalRuntime: false
    });

    var tmpl = jade.compileClientWithDependenciesTracked(source, jadeOptions);

    tmpl.dependencies.forEach(function(dep) {
        this.addDependency(dep);
    }.bind(this));

    var opts = this.options;

    var loaders = opts.module ? opts.module.loaders : opts.resolve.loaders;

    var mopts = Object.keys(opts).reduce(function(acc, key) {
        acc[key] = opts[key];
        return acc;
    }, {});

    mopts.recursive = true;
    mopts.resolve = {
        loaders: loaders,
        extensions: opts.resolve.extensions,
        modulesDirectories: (opts.resolve.modulesDirectories || []).concat(opts.resolve.fallback || [])
    };

    var er = 'var jade = require(' + resolve('jade/runtime') + ');\nrequire = require(' + resolve('enhanced-require') + ')(module, require(' + resolve('./json2regexp') + ')(' +
        JSON.stringify(mopts, toString) + '));\n';

    var moduleBody = er + tmpl.body + '\n\nmodule.exports = template;\ntemplate.__require = require';

    var mod = this.exec(moduleBody, this.resource);

    var _require = mod.__require;

    for (var file in _require.contentCache) {
        this.addDependency && this.addDependency(file);
    }

    return mod(jadeOptions.locals);
};

function resolve(path) {
    return JSON.stringify(require.resolve(path));
}

function toString(key, value) {
    if (!(value instanceof RegExp)) return value;
    return value.toString();
}
