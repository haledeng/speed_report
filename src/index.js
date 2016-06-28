var SPEED_REPORT = (function(win) {
	if (win.SPEED_REPORT) return win.SPEED_REPORT;

	var report = win.SPEED_REPORT = {};
	var defaultConf = {
		url: 'http://test.com',
		// include performance.timing report
		includeTiming: true
	};

	var toString = Object.prototype.toString;
	/**
	 * [typeis check object type]
	 */
	var typeis = function(obj) {
		var reg = /^\[object\s(.*)\]$/;
		return toString.call(obj).replace(reg, function(all, t) {
			return t;
		});
	};

	/**
	 * [isObj check something is object]
	 */
	var isObj = function(obj) {
		return typeis(obj) === 'Object';
	};

	/**
	 * [extend exntend object]
	 * @param  {object} dist [description]
	 * @param  {object} src  [description]
	 * @return {object}      [description]
	 */
	var extend = function(dist, src) {
		// if (!isObj(dist)) return {};
		if (!isObj(src)) return dist;
		for (var prop in src) {
			if (src.hasOwnProperty(prop)) {
				dist[prop] = src[prop];
			}
		}
		return dist;
	};

	/**
	 * [join join object's property and value]
	 * @param    {object}                 obj       [to join object]
	 * @param    {string}                 seperator [join seperator]
	 * @return   {string}                           [join result]
	 */
	var join = function(obj, seperator) {
		if (!isObj(obj)) return '';
		var ret = [];
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				ret.push(prop + '=' + obj[prop]);
			}
		}
		return ret.join(seperator);
	};

	/**
	 * [addQuery2Url add querystring to url]
	 */
	var addQuery2Url = function(url, query) {
		if (!url) return '';
		if (!query) return url;
		url += ~url.indexOf('?') ? '&' : '?';
		url += query;
		return url;
	};


	var filterTiming = function(timing) {
		var props = [
			'navigationStart',
			'unloadEventStart',
			'unloadEventEnd',
			'redirectStart',
			'redirectEnd',
			'fetchStart',
			'domainLookupStart',
			'domainLookupEnd',
			'connectStart',
			'connectEnd',
			'secureConnectionStart',
			'requestStart',
			'responseStart',
			'responseEnd',
			'domLoading',
			'domInteractive',
			'domContentLoadedEventStart',
			'domContentLoadedEventEnd',
			'domComplete',
			'loadEventStart'
		];
		var ret = {};
		var prop;
		for (var i = 0; i < props.length; i++) {
			prop = props[i];
			if (timing[prop]) {
				ret[prop] = timing[prop];
			}
		}
		return ret;
	};

	// initialize.
	report.init = function(conf) {
		defaultConf = extend(defaultConf, conf);
	};


	/**
	 * [report description]
	 * @param    {object}                 point [user define point]
	 */
	report.report = function(point) {
		var timing = {};
		if (defaultConf.includeTiming) {
			timing = performance.timing || {}
		}
		timing = filterTiming(timing);
		timing = extend(timing, point);
		var queryString = join(timing, '&');
		var url = addQuery2Url(defaultConf.url, queryString);
		new Image().src = url;
		return url;
	};

	return report;
})(window);

if (typeof module !== 'undefined' && module.exports) {
	module.exports = SPEED_REPORT;
}