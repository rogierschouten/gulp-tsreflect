// (c) Rogier Schouten <rogier.schouten@gmail.com>
// License: MIT

var through = require('through2');
var util = require('util');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var compiler = require('tsreflect-compiler');

const PLUGIN_NAME = 'gulp-tsreflect';

function plugin(options) {

  var opts = options || {};
  
  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // return empty file
      cb(null, file);
    }
	var diagnostics = compiler.compile([file.path], opts);
	var errors = '';
	if (Array.isArray(diagnostics)) {
		for (var i = 0; i < diagnostics.length; ++i) {
			var d = diagnostics[i];
			if (d.category === compiler.DiagnosticCategory.Error) {
				if (errors !== '') {
					errors += '\n';
				}
				errors += util.format('Error: code %d, file %s:%d,%d "%s"', d.code, d.filename, d.line, d.character, d.messageText);
			}
		}
	}

	if (errors === '') {
		cb(null, file);
	} else {
		cb(new gutil.PluginError(PLUGIN_NAME, errors));
	}
  });

};

module.exports = plugin;