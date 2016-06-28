require('shelljs/make');
var fs = require('fs');

var src = 'src/index.js'
var destPath = 'dist/speed_report.js';
var destPathMin = 'dist/speed_report.min.js'

var minify = function() {
	uglify = require('uglify-js')
	result = uglify.minify([src]);
	result.code.to(destPathMin);
	reportSize(destPathMin);
}

var build = function() {
	cd(__dirname);
	mkdir('-p', 'dist');
	var dist = cat(src);
	dist.to(destPath);
	reportSize(destPath);
}

var fsize = function(file) {
	return fs.statSync(file).size;
}

var format_number = function(size) {
	var precision = 1;
	var factor = Math.pow(10, precision);
	var decimal = Math.round(size * factor) % factor;
	return parseInt(size) + "." + decimal;
}

var reportSize = function(file) {
	echo(file + ': ' + format_number(fsize(file) / 1024) + 'KB');
}

build();
minify();