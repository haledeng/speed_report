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
			// base timeline
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

	var minusStart = function(speed, pageStart) {
		for (prop in speed) {
			if (speed.hasOwnProperty(prop)) {
				speed[prop] -= pageStart;
			}
		}
		return speed;
	};

	// initialize.
	report.init = function(conf) {
		defaultConf = extend(defaultConf, conf);
	};


	/**
	 * [report description]
	 * @param    {object}                 point [user define point]
	 * point like:
	 * {
	 *  	pageStart:
	 *  	domEnd:
	 *  	cssEnd:
	 *  	jsEnd: js loader end
	 *  	dataEnd: fetch data from cgi
	 *  	firstScreen: on mobile, first screen render end
	 *  	allEnd:
	 * }
	 */
	report.report = function(point) {
		// base timeline
		var pageStart = point.pageStart;
		delete point.pageStart;
		point = minusStart(point, pageStart);

		var timing = {};
		if (defaultConf.includeTiming) {
			timing = window.performance.timing || {};
		}
		timing = filterTiming(timing);
		var navigationStart = timing.navigationStart;
		delete timing.navigationStart;
		timing = minusStart(timing, navigationStart);
		timing = extend(timing, point);
		// prevent cache
		timing._ = +new Date();
		var queryString = join(timing, '&');
		var url = addQuery2Url(defaultConf.url, queryString);
		new Image().src = url;
		return url;
	};

	return report;
})(window);
