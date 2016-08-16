#!/usr/bin/env node
require('shelljs/make');
var fs = require('fs');

var src = 'src/index.js'
var destPath = 'dist/speed_report.js';
var destPathMin = 'dist/speed_report.min.js'

var minify = function(src) {
	uglify = require('uglify-js')
	var result = uglify.minify([src]);
	return result.code;
}


var fsize = function(file){
	return fs.statSync(file).size;
}

var format_number = function(size, precision){
	var precision = precision || 1;
	var factor = Math.pow(10, precision);
	var decimal = Math.round(size * factor) % factor;
	return parseInt(size) + "." + decimal;
}

var report_size = function(file){
 	echo(file + ': ' + format_number(fsize(file) / 1024) + ' KB');
}


var tpl = {
	amd: 'define(function(){\r\n{{tab}}{{content}};\r\n{{tab}}module.exports = SPEED_REPORT;\r\n})',
	cmd: 'define(function(require, exports, module){\r\n{{tab}}{{content}};\r\n{{tab}}module.exports = SPEED_REPORT;\r\n})',
	commonjs: '{{content}};\r\nmodule.exports = SPEED_REPORT;'
};

var tab = '    ';
target.wrap = function(content) {
	var loader = env['LOADER'] || '';
	loader = loader.toLowerCase();
	if (loader && tpl[loader]) {
		if (loader === 'amd' ||  loader === 'cmd') {
			content = tpl[loader].replace(/\{\{content\}\}/, content.split(/\r\n|\n|\r/).join('\n' + '    ')).replace(/\{\{tab\}\}/g, tab);
		} else {
			content = tpl[loader].replace(/\{\{content\}\}/, content);
		}
	}
	return content;
};

target.build = function() {
	cd(__dirname);
	mkdir('-p', 'dist');
	var dist = cat(src);
	dist = target.wrap(dist);
	dist.to(destPath);
	report_size(destPath);
}

target.minify = function() {
	minify(destPath).to(destPathMin);
}

target.dist = function(){
	target.build();
	target.minify();
	report_size(destPathMin);
}
