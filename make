require('shelljs/make');
fs = require('fs');

src = 'src/index.js'
destPath = 'dist/speed_report.js';
destPathMin = 'dist/speed_report.min.js'

minify = (src) ->
	uglify = require('uglify-js')
	result = uglify.minify([src]);
	return result.code


fsize = (file) ->
	fs.statSync(file).size

format_number = (size, precision = 1) ->
  factor = Math.pow(10, precision)
  decimal = Math.round(size * factor) % factor
  parseInt(size) + "." + decimal

report_size = (file) ->
  echo "#{file}: #{format_number(fsize(file) / 1024)} KB"

target.build = ->
	cd __dirname;
	mkdir '-p', 'dist';
	dist = cat(src);
	dist.to(destPath);

target.minify = ->
	minify(src).to(destPathMin);

target.dist = -> 
	target.build();
	target.minify();
	report_size(destPathMin);
