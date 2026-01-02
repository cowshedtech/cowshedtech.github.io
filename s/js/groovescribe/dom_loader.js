// GSLoader - shared helpers for dynamically loading JS/CSS and import maps
// Exposes a global GSLoader with utility methods that other scripts can reuse.
// Keeps simple de-dup tracking and allows an optional baseRoot for relative paths.
(function(global) {
	"use strict";

	if (global.GSLoader) return; // don't reinit

	var loadedSet = {};
	var cachedRootSrc = null;

	function normalizeUrl(filename, baseRoot) {
		if (filename && filename[0] === "." && baseRoot) {
			return baseRoot + filename;
		}
		return filename;
	}

	function loadjscssfile(filename, filetype, baseRoot) {
		filename = normalizeUrl(filename, baseRoot);

		if (loadedSet["[" + filename + "]"]) return;

		var fileref;
		if (filetype === "js") {
			fileref = document.createElement("script");
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", filename);
		} else if (filetype === "css") {
			fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
		}
		if (fileref) {
			document.getElementsByTagName("head")[0].appendChild(fileref);
			loadedSet["[" + filename + "]"] = true;
		}
	}

	function loadjsmap(map) {
		var scriptref = document.createElement("script");
		scriptref.setAttribute("type", "importmap");
		scriptref.textContent = JSON.stringify(map || {});
		document.getElementsByTagName("head")[0].appendChild(scriptref);
	}

	function getLocalScriptRoot() {
		if (cachedRootSrc) return cachedRootSrc;
		var scripts = document.getElementsByTagName("script");
		var index = scripts.length - 1;
		var myScript = scripts[index];
		var lastSlash = myScript.src.lastIndexOf("/");
		cachedRootSrc = myScript.src.slice(0, lastSlash + 1);
		return cachedRootSrc;
	}

	global.GSLoader = {
		loadjscssfile: loadjscssfile,
		loadjsmap: loadjsmap,
		getLocalScriptRoot: getLocalScriptRoot
	};
})(window);


