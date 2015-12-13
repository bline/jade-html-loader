/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Scott Beck @bline
*/

var loaderUtils = require("loader-utils");

module.exports = function(source) {
	this.cacheable && this.cacheable();

	var jade  = require("jade");
	var query = loaderUtils.parseQuery(this.query);
	var req   = loaderUtils.getRemainingRequest(this).replace(/^!/, "");

	var tmplFunc = jade.compile(source, {
		filename:     req,
		self:         query.self,
		pretty:       query.pretty,
		locals:       query.locals,
		doctype:      query.doctype || "html",
		compileDebug: this.debug || false
	});

	var html = tmplFunc(query);

	return query.single ? "module.exports =" + JSON.stringify(html) + ";" : html;
};
