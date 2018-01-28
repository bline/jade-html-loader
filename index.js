/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Scott Beck @bline
*/

var loaderUtils = require("loader-utils");
var Path = require('path');

module.exports = function(source) {
	this.cacheable && this.cacheable(true);
	var jade = require("jade");
	var query = loaderUtils.parseQuery(this.query);

	var dirname = Path.dirname(this.resourcePath);

	var tmpl = jade.compileClientWithDependenciesTracked(source, {
		filename: this.resourcePath,
		self: query.self,
		pretty: query.pretty,
		basedir: query.basedir,
		locals: query,
		compileDebug: true,
		externalRuntime: false
	});

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

	return mod(query.locals || query);
}

function resolve(path) {
	return JSON.stringify(require.resolve(path));
}

function toString(key, value) {
	if (!(value instanceof RegExp)) return value;
	return value.toString();
}
