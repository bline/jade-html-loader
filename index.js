/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Scott Beck @bline
*/

var _ = require('lodash')
var loaderUtils = require("loader-utils");
var Path = require('path');

module.exports = function(source) {
	this.cacheable && this.cacheable(true);
	var jade = require("jade");
	var query = loaderUtils.parseQuery(this.query);

	var dirname = Path.dirname(this.resourcePath);
	var jadeOptions = _.defaults({
		filename: this.resourcePath,
		self: query.self,
		pretty: query.pretty,
	}, getLoaderConfig(this), {
		compileDebug: true,
		externalRuntime: false
	});

	jadeOptions.locals = _.assign(jadeOptions.locals, query);

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

	return mod(query.locals || query);
}

function resolve(path) {
	return JSON.stringify(require.resolve(path));
}

function toString(key, value) {
	if (!(value instanceof RegExp)) return value;
	return value.toString();
}

/**
 * Check the loader query and webpack config for loader options. If an option is defined in both places,
 * the loader query takes precedence.
 *
 * @param {Loader} loaderContext
 * @returns {Object}
 */
function getLoaderConfig(loaderContext) {
	var query = utils.parseQuery(loaderContext.query);
	var configKey = query.config || 'jadeLoader';
	var config = loaderContext.options[configKey] || {};

	delete query.config;

	return assign({}, config, query);
}
