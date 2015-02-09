# gulp-tsreflect

[![NPM version](https://badge.fury.io/js/gulp-tsreflect.svg)](http://badge.fury.io/js/gulp-tsreflect)

[![NPM](https://nodei.co/npm/gulp-tsreflect.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-tsreflect/)
[![NPM](https://nodei.co/npm-dl/gulp-tsreflect.png?months=9&height=3)](https://nodei.co/npm/gulp-tsreflect/)

## Synopsis

Gulp plugin to use the tsreflect-compiler  (https://github.com/artifacthealth/tsreflect-compiler)

## Installation

You do NOT need to install tsreflect-compiler separately.

```shell
npm install --save-dev gulp-tsreflect
```

## Usage

The plugin takes an object, of which all properties are passed transparently to the tsreflect compiler. Pipe in TypeScript files. Pipe out JSON files.

## Code Example

```javascript
var tsreflect = require("gulp-tsreflect");

gulp.task("tsreflect", function() {
	return gulp
		.src(["lib/*.ts"], { base: "." })
		.pipe(tsreflect({ removeComments: true }))
		.pipe(gulp.dest("."))
	;
});
```

## Changelog

### 2.0.2
Typo in README.md

### 2.0.1
Remove unused package from package.json.

### 2.0.0
Interface change, which was made possible by tsreflect-compiler@0.1.3: the output files are now written to the stream instead of to disk. This makes proper Gulp builds possible.

### 1.0.0
Initial version

## License

MIT


