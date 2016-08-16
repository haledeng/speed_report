var inquirer = require('inquirer');
var fs = require('fs');
var uglify = require('uglify-js');

var src = 'src/index.js'
var destPath = 'dist/speed_report.js';
var destPathMin = 'dist/speed_report.min.js';

function replace(content, loader) {
	var tpl = {
		amd: 'define(function(){\r\n{{tab}}{{content}};\r\n{{tab}}module.exports = SPEED_REPORT;\r\n})',
		cmd: 'define(function(require, exports, module){\r\n{{tab}}{{content}};\r\n{{tab}}module.exports = SPEED_REPORT;\r\n})',
		commonjs: '{{content}};\r\nmodule.exports = SPEED_REPORT;'
	};
	var tab = '    ';
	loader = loader.toLowerCase();
	if (loader && tpl[loader]) {
		if (loader === 'amd' || loader === 'cmd') {
			content = tpl[loader].replace(/\{\{content\}\}/, content.split(/\r\n|\n|\r/).join('\n' + '    ')).replace(/\{\{tab\}\}/g, tab);
		} else {
			content = tpl[loader].replace(/\{\{content\}\}/, content);
		}
	}
	return content;
}

function generate(content) {
	fs.writeFileSync(destPath, content, 'utf-8');
	try {
		content = uglify.minify(content, {
			fromString: true
		});
		fs.writeFileSync(destPathMin, content.code, 'utf-8');
	} catch (e) {}
}

inquirer.prompt([{
	type: 'list',
	message: 'select module type',
	name: 'module',
	default: 'commonjs',
	choices: [{
		name: 'amd'
	}, {
		name: 'cmd'
	}, {
		name: 'commonjs'
	}]
}]).then(function(answers) {
	var mod = answers.module;
	var content = fs.readFileSync(src, 'utf-8');
	content = replace(content, mod);
	generate(content);
});