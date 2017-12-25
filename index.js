// (c) Rogier Schouten <rogier.schouten@gmail.com>
// License: MIT

var fs = require("fs");
var path = require("path");
var util = require("util");

var compiler = require("tsreflect-compiler");
var File = require("vinyl");
var through = require("through2");
const PluginError = require("plugin-error");

const PLUGIN_NAME = "gulp-tsreflect";


function plugin(options) {
	// tsreflect-compiler cannot handle undefined options, so create empty object
	var opts = options || {};

	// Creating a stream through which each file will pass
	return through.obj(function(file, enc, cb) {
		var me = this;
		if (file.isNull()) {
			// return empty file, replace extension by .json
			var jsonFile = new File({
				cwd: file.cwd,
				base: file.base,
				path: path.join(path.dirname(file.path), path.basename(file.path, path.extname(file.path)) + ".json"),
				contents: new Buffer("{}", "utf8")
			});
			me.push(jsonFile);
		}
		if (file.isStream()) {
			me.emit("error", new PluginError(PLUGIN_NAME, "Streams are not supported!"));
			return cb();
		}

		// custom functions to pass to compiler to read/write files from/to stream
		var compilerHost = {
			readFile: function(filename, onError) {
				var text = "";
				try {
					if (path.normalize(filename) === path.normalize(file.path) || filename === file.relative) {
						// read current file in stream
						text = file.contents.toString("utf8");
					} else {
						// need to silently return undefined for not-found file, as per default compilerHost implementation
						if (!fs.existsSync(filename)) {
							return undefined;
						}
						// read from disk
						var buffer = fs.readFileSync(filename);
						text = fs.readFileSync(filename, { encoding: "utf8" });
					}
				} catch (e) {
					console.log(e);
					if (onError) {
						onError(e.message);
					}
					return undefined;
				}
				return text;
			},
			writeFile: function(filename, data, writeByteOrderMark, onError) {
				// write data to stream instead of disk
				try {
					var jsonFile = new File({
						cwd: file.cwd,
						base: file.base,
						path: filename,
						contents: new Buffer(data, "utf8")
					});
					me.push(jsonFile);
				} catch (e) {
					console.log(e);
					if (onError) {
						onError(e.message);
					}
				}
			}
		};

		// compile
		try {
			var diagnostics = compiler.compile([file.path], opts, compilerHost);
		} catch (e) {
			console.log(e.stack);
			me.emit(new PluginError(PLUGIN_NAME, e));
			return cb(e);
		}

		// check for errors
		var errors = "";
		var warnings = "";
		if (Array.isArray(diagnostics)) {
			for (var i = 0; i < diagnostics.length; ++i) {
				var d = diagnostics[i];
				if (d.category === compiler.DiagnosticCategory.Error) {
					if (errors !== "") {
						errors += "\n";
					}
					errors += util.format("Error: code %d, file %s:%d,%d '%s'", d.code, d.filename, d.line, d.character, d.messageText);
				}
				console.log(util.format("%s: code %d, file %s:%d,%d '%s'", compiler.DiagnosticCategory[d.category], d.code, d.filename, d.line, d.character, d.messageText));
			}
		}
		if (errors !== "") {
			me.emit(new PluginError(PLUGIN_NAME, errors));
		}

		// all done
		cb();
	});
};

module.exports = plugin;
