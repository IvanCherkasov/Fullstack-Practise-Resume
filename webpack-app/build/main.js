/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(17);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_styl__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_styl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__main_styl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__blocks_block_header_block_styl__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__blocks_block_header_block_styl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__blocks_block_header_block_styl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__blocks_block_profile_block_styl__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__blocks_block_profile_block_styl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__blocks_block_profile_block_styl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__blocks_block_contacts_block_styl__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__blocks_block_contacts_block_styl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__blocks_block_contacts_block_styl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__blocks_block_skills_block_styl__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__blocks_block_skills_block_styl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__blocks_block_skills_block_styl__);







/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/stylus-loader/index.js!./main.styl", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/stylus-loader/index.js!./main.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: MyriadPro;\n  src: url(" + __webpack_require__(5) + ") format('truetype'), url(" + __webpack_require__(6) + ") format('woff'), url(" + __webpack_require__(7) + ") format('eot');\n  font-weight: normal;\n  font-style: normal;\n}\n@font-face {\n  font-family: MyriadPro;\n  src: url(" + __webpack_require__(8) + ") format('truetype'), url(" + __webpack_require__(9) + ") format('woff'), url(" + __webpack_require__(10) + ") format('eot');\n  font-weight: normal;\n  font-style: italic;\n}\n@font-face {\n  font-family: MyriadPro;\n  src: url(" + __webpack_require__(11) + ") format('truetype'), url(" + __webpack_require__(12) + ") format('woff'), url(" + __webpack_require__(13) + ") format('eot');\n  font-weight: bold;\n  font-style: normal;\n}\n@font-face {\n  font-family: MyriadPro;\n  src: url(" + __webpack_require__(14) + ") format('truetype'), url(" + __webpack_require__(15) + ") format('woff'), url(" + __webpack_require__(16) + ") format('eot');\n  font-weight: bold;\n  font-style: italic;\n}\nhtml {\n  font-size: 12px;\n}\nbody {\n  margin: 0;\n  padding: 0;\n}\n.main {\n  font-family: MyriadPro;\n  display: flex;\n  margin: 0 auto;\n  min-width: 320px;\n  margin-top: 7.33rem;\n  padding-left: 38px;\n  padding-right: 38px;\n}\n.main .text-black {\n  color: #000 !important;\n}\n.main .text-blue {\n  color: #006cb4 !important;\n}\n.main .left {\n  width: 37%;\n  display: flex;\n  flex-flow: column;\n  padding-right: 38px;\n}\n.main .right {\n  width: 57%;\n  display: flex;\n  flex-flow: column;\n  padding-left: 38px;\n}\n.main section {\n  width: 100%;\n  display: block;\n  margin: 0 auto;\n  margin-bottom: 3.16rem;\n}\n.main section .sec-header {\n  display: table;\n  height: 6rem;\n  width: 100%;\n}\n.main section .sec-header .icon {\n  display: table-cell;\n  width: 5.84rem;\n  padding-right: 5.84rem;\n  background-color: #006cb4;\n  border-radius: 50%;\n  border: 0.08rem solid #006cb4;\n  vertical-align: middle;\n  box-shadow: inset 0 0 0 0.25rem #fff;\n  position: relative;\n}\n.main section .sec-header .title {\n  display: table-cell;\n  vertical-align: middle;\n  font-size: 3.43rem;\n  text-transform: uppercase;\n  color: #006cb4;\n  padding-left: 1.1rem;\n}\n.main section .sec-header .buffer-line {\n  width: 100%;\n  display: table-cell;\n  vertical-align: middle;\n  padding-left: 0.5rem;\n}\n.main section .sec-header .buffer-line .line {\n  height: 0.42rem;\n  width: 100%;\n  background-color: #006cb4;\n}\n.main section .sec-content {\n  padding-top: 1.2rem;\n  line-height: 1.45rem;\n}\n.main section .sec-content span {\n  font-size: 1.29rem;\n}\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-Regular.ttf";

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-Regular.woff";

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-Regular.eot";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-It.ttf";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-It.woff";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-It.eot";

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-Bold.ttf";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-Bold.woff";

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-Bold.eot";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-BoldIt.ttf";

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-BoldIt.woff";

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/MyriadPro/MyriadPro-BoldIt.eot";

/***/ }),
/* 17 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(19);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js!./block.styl", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js!./block.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".main section.header {\n  padding-bottom: 6.08rem;\n  margin-bottom: 0.1rem;\n}\n.main section.header .header-top {\n  margin: 0 auto;\n  width: 19.16rem;\n  height: 19.16rem;\n  border-radius: 50%;\n  background-color: #006cb4;\n  border: 1px solid #006cb4;\n  box-shadow: inset 0 0 0 1.17rem #fff;\n}\n.main section.header .header-bottom {\n  padding-top: 2.3rem;\n}\n.main section.header .header-bottom .name {\n  font-size: 4.42rem;\n  letter-spacing: 0;\n  word-wrap: normal;\n}\n.main section.header .header-bottom .surname {\n  font-size: 5.08rem;\n  line-height: 3.33rem;\n}\n.main section.header .header-bottom .profession {\n  font-size: 2rem;\n  padding-top: 1.33rem;\n}\n.main section.header .header-text {\n  text-transform: uppercase;\n  text-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js!./block.styl", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js!./block.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".main section .icon .i-profile::after {\n  content: \"\";\n  position: absolute;\n  width: 1.42rem;\n  height: 1.42rem;\n  background-color: #fff;\n  border-radius: 50%;\n  top: calc(50% - 1.17rem);\n  left: calc(50% - 0.71rem);\n}\n.main section .icon .i-profile::before {\n  content: \"\";\n  position: absolute;\n  width: 0;\n  height: 0;\n  background-color: transparent;\n  border-radius: 50%;\n  border: 1.42rem solid #fff;\n  border-right-color: transparent;\n  border-bottom-color: transparent;\n  transform: rotate(45deg);\n  left: calc(50% - 1.42rem);\n}\n", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js!./block.styl", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js!./block.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".main section table.contacts {\n  border-collapse: collapse;\n  margin-top: 2rem;\n}\n.main section table.contacts td {\n  font-size: 1.67rem;\n  padding-left: 3.58rem;\n  padding-top: 1.83rem;\n  padding-bottom: 1.3rem;\n}\n.main section table.contacts tr:nth-child(1) td {\n  padding-top: 0;\n}\n.main section table.contacts tr:nth:last-child td {\n  padding-bottom: 0;\n}\n.main section table.contacts tr td.td-title {\n  text-transform: uppercase;\n  color: #006cb4;\n  font-size: 1.67rem;\n  font-weight: bold;\n  padding-left: 0;\n}\n.main section .icon .i-contacts {\n  content: \"\";\n  width: 100%;\n  height: 100%;\n  top: 0;\n  position: absolute;\n  background-image: url(" + __webpack_require__(24) + ");\n  background-repeat: no-repeat;\n  background-position: 50% 100%;\n  background-size: 57%;\n}\n", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgd2lkdGg9IjIxMG1tIgogICBoZWlnaHQ9IjI5N21tIgogICB2aWV3Qm94PSIwIDAgMjEwIDI5NyIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnNDUyNiI+CiAgPGRlZnMKICAgICBpZD0iZGVmczQ1MjAiIC8+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNDUyMyI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGcKICAgICBpZD0ibGF5ZXIxIj4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxLjM0OTA0NTYzcHg7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGQ9Im0gNDAuODQwMzEsNC4zODU2NTU2IGMgLTAuODgzOTYsMC4wMTAwNyAtMS43MzM1OTUsMC4yNTU1MzkgLTIuNTQyNDgyLDAuNzY3OTEyIEMgMjcuMDMxNjI0LDEyLjI4OTkwOCAxNC40MDA2MTEsMjUuMzM5MDI4IDYuNTEyMTcyOCwzNy40NTA4MjIgbCAtMC4wNTExNiwtMC4wNTE2OCBjIC0wLjAyNDE2LDAuMDc4ODYgLTAuMDQ2NDcsMC4xNTgyMzkgLTAuMDcwMjgsMC4yMzcxOTQgLTAuMDE0ODQsMC4wMjI5MSAtMC4wMzA2NywwLjA0NTgzIC0wLjA0NTQ4LDAuMDY4NzMgbCAwLjAxOTEyLDAuMDE5MTIgQyAtMTYuMjUxMDgxLDExMy4xNzcwNyAxMjEuMzM4OTcsMjI5LjI3MTQxIDE3My4zNDkwMSwyMDYuMjEyNjEgbCAwLjAyNDgsMC4wMjQ4IGMgMTYuMzQ0MjMsLTYuOTA3NDkgMjguOTEzMjYsLTIzLjUxODc3IDMxLjIzODQsLTMxLjQ0ODIxIDEuNTUwMzcsLTUuNDg1MDkgMS43Nzc2LC0xMC4xMzYwNCAtMS4zNzE0OSwtMTQuOTY0NDYgLTcuNTEyMTYsLTEwLjYxMjQgLTM1LjQ3Mzc1LC0yNC41MDM2NSAtMzcuOTE4MSwtMjUuODc0OSAtMi41MDQwNCwtMC44MzQ2NyAtMTQuMDcwMzYsLTIuODYxOSAtMTcuNjQ3NSwtMS41NTAzIC0zLjA0MDcsMC40MTczMyAtOC41MjU4Miw2LjE0MDk1IC0xNy4yMDQ2NCwxNi43NDQ3MiAtNy45MDg2MiwtMC45OTkxNiAtMjAuMjQ3OTQsLTguOTExMjMgLTMyLjMyOTgwNiwtMTkuMzE4NzIgTCA3Ni44NjEzNjcsMTA4LjM3MzEgQyA2OC4wNjg5OSw5Ny44OTkzMDMgNjEuNzkyMTUzLDg3LjYzNzAwNiA2MS4zMTE0MSw4MC42NjYyNyA3OC4wMDQ4ODgsNjMuMjkxNDQgNzcuMTUzNDA5LDU2LjM5NTU3MyA3NS4zNjQ4MTcsNTAuOTYxNjI0IDY2LjQ2MDkxNCwzNi45Mzg0NTMgNTEuMjcxMDM5LDQuMjY2ODE5NiA0MC44NDAzMSw0LjM4NTY1NTYgWiIKICAgICAgIGlkPSJwYXRoNTA4NiIgLz4KICA8L2c+Cjwvc3ZnPgo="

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js!./block.styl", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js!./block.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".main section.skills {\n  width: 100%;\n  main-width: 300px;\n}\n.main section.skills .skill {\n  width: 78%;\n  margin: 0 auto;\n  margin-top: 0.83rem;\n  padding-bottom: 1.5rem;\n}\n.main section.skills .skill .skill-title {\n  text-align: center;\n  text-transform: uppercase;\n  font-size: 25.5px;\n  padding: 0;\n}\n.main section.skills .skill .skill-progress {\n  width: 100%;\n  min-width: 260px;\n  max-width: 400px;\n  margin: 0 auto;\n}\n.main section.skills .skill .skill-progress ul {\n  display: flex;\n  flex-flow: row;\n  justify-content: space-between;\n  flex-wrap: nowrap;\n  width: 100%;\n  padding: 0;\n  margin: 0;\n  margin-top: 15px;\n  height: 1.41rem;\n}\n.main section.skills .skill .skill-progress ul li {\n  list-style: none;\n  width: 1.41rem;\n  height: 1.41rem;\n  background-color: #006cb4;\n  border-radius: 50%;\n  margin-left: 0.33rem;\n  margin-right: 0.33rem;\n}\n.main section.skills .skill .skill-progress ul li:nth-last-child {\n  margin-right: 0;\n}\n.main section.skills .skill .skill-progress ul li:nth-child(1) {\n  margin-left: 0;\n}\n.main section.skills .skill .skill-progress ul li.active {\n  background-color: #006cb4;\n}\n.main section.skills .skill .skill-progress ul li.active ~ li {\n  background-color: #e7e7e7;\n}\n.main section.skills .icon .i-skills {\n  content: \"\";\n  width: 100%;\n  height: 100%;\n  top: 0;\n  position: absolute;\n  background-image: url(" + __webpack_require__(27) + ");\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 47%;\n}\n", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIGlkPSJzdmc4Ig0KICAgdmVyc2lvbj0iMS4xIg0KICAgdmlld0JveD0iMCAwIDIxMCAyOTciDQogICBoZWlnaHQ9IjI5N21tIg0KICAgd2lkdGg9IjIxMG1tIj4NCiAgPGRlZnMNCiAgICAgaWQ9ImRlZnMyIiAvPg0KICA8bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhNSI+DQogICAgPHJkZjpSREY+DQogICAgICA8Y2M6V29yaw0KICAgICAgICAgcmRmOmFib3V0PSIiPg0KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4NCiAgICAgICAgPGRjOnR5cGUNCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4NCiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+DQogICAgICA8L2NjOldvcms+DQogICAgPC9yZGY6UkRGPg0KICA8L21ldGFkYXRhPg0KICA8Zw0KICAgICBpZD0ibGF5ZXIxIj4NCiAgICA8Y2lyY2xlDQogICAgICAgcj0iOTYuODkzNyINCiAgICAgICBjeT0iMTAwLjEzODY1Ig0KICAgICAgIGN4PSIxMDIuOTk4ODYiDQogICAgICAgaWQ9InBhdGg0NDk4Ig0KICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIuMzM4ODEzNTQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4NCiAgICA8ZWxsaXBzZQ0KICAgICAgIGN4PSIxMDIuMjQxODciDQogICAgICAgY3k9IjE4Ny43ODI2OCINCiAgICAgICByeD0iNTIuOTg4NzQ3Ig0KICAgICAgIHJ5PSIzNy44ODg4NjMiDQogICAgICAgaWQ9InBhdGg0NTAwIg0KICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIuMDM2MTY0MDU7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4NCiAgICA8cmVjdA0KICAgICAgIHJ4PSIyMC4zMTI0OTYiDQogICAgICAgcnk9IjEzLjk1NzY0OSINCiAgICAgICB5PSIyMzcuOTA5MzkiDQogICAgICAgeD0iNTEuNTI0MTA5Ig0KICAgICAgIGhlaWdodD0iMzguNjA2MDg3Ig0KICAgICAgIHdpZHRoPSIxMDMuNzA2NTQiDQogICAgICAgaWQ9InJlY3Q0NTE4Ig0KICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIuMTE5NTQ5NzU7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4NCiAgPC9nPg0KPC9zdmc+DQo="

/***/ })
/******/ ]);