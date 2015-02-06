# Gulp-TypeDoc

[![NPM version](https://badge.fury.io/js/gulp-tsreflect.svg)](http://badge.fury.io/js/gulp-tsreflect)

[![NPM](https://nodei.co/npm/gulp-tsreflect.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-tsreflect/)
[![NPM](https://nodei.co/npm-dl/gulp-tsreflect.png?months=9&height=3)](https://nodei.co/npm/gulp-tsreflect/)

## Synopsis


Gulp plugin to execute the tsreflect-compiler  (https://github.com/artifacthealth/tsreflect-compiler)

## Installation

You do not need to install tsreflect-compiler separately, just install gulp-tsreflect:

```shell
npm install --save-dev gulp-tsreflect
```

## Usage

The plugin takes an object, of which all properties are passed transparently to the tsreflect compiler. Pipe in TypeScript files. The documentation files are not piped out, they end up in the directory you indicate in the options.

## Code Example

```javascript
var tsreflect = require("gulp-tsreflect");

gulp.task("tsreflect", function() {
	return gulp
		.src(["lib/*.ts"])
		.pipe(tsreflect({ 
			outDir: "./out"
		}))
	;
});
```

## Changelog

### 1.0.0
Initial veresion

## License

MIT


