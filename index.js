/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Scott Beck @bline
*/
var loaderUtils = require("loader-utils");
module.exports = function(source) {
	this.cacheable && this.cacheable(true);
	var jade = require("jade");
	var query = loaderUtils.parseQuery(this.query);
	var tmplFunc = jade.compile(source, {
		filename: this.resource,
		self: query.self,
		pretty: query.pretty,
		locals: query.locals,
		compileDebug: this.debug || false
	});

	return tmplFunc(query);
}
