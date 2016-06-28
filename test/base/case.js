describe('report base', function(){
	it('should have query string', function() {
		SPEED_REPORT.init({
			url: 'http://a.com',
			includeTiming: false
		});

		var url = SPEED_REPORT.report({
			domStart: 1,
			cssStart: 2,
			jsStart: 3
		});
		expect(url).to.equal('http://a.com?domStart=1&cssStart=2&jsStart=3');
	});
});

describe('report performance timing', function(){
	it('should have timing', function() {
		SPEED_REPORT.init({
			url: 'http://b.com',
			includeTiming: true
		});

		var url = SPEED_REPORT.report({
			domStart: 1,
			cssStart: 2,
			jsStart: 3
		});
		expect(url.indexOf('navigationStart=') > -1).to.equal(true);
	});
});