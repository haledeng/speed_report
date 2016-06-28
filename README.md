# speed_report
page speed report.

### usage
initialize report config and report data.
```
// initialize config
SPEED_REPORT.init({
	url: 'http://test.com', // report url
	includeTiming: true // include performance.timing
});

// report data, request the config url
SPEED_REPORT.report({	
	domStart: '',
	jsStart: ''
});
```

### build
You will have to install Node.js.
```
npm i
npm run dist
```


### running tests
Clone the whole project, open `test/base/index.html` with brower.
