#!/usr/bin/nodejs
var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.evalWorksForGlobals_ = null;
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.getObjectByName(a) && !goog.implicitNamespaces_[a]) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    for(var b = a;b = b.substring(0, b.lastIndexOf("."));) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.implicitNamespaces_ = {});
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
  }
};
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(!COMPILED) {
    for(var d, a = a.replace(/\\/g, "/"), e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a;
      a in e.pathToNames || (e.pathToNames[a] = {});
      e.pathToNames[a][d] = true
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {});
      e.requires[a][b] = true
    }
  }
};
goog.require = function(a) {
  if(!COMPILED && !goog.getObjectByName(a)) {
    var b = goog.getPathFromDeps_(a);
    if(b) {
      goog.included_[b] = true;
      goog.writeScripts_()
    }else {
      a = "goog.require could not find: " + a;
      goog.global.console && goog.global.console.error(a);
      throw Error(a);
    }
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    return a.instance_ || (a.instance_ = new a)
  }
};
COMPILED || (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return typeof a != "undefined" && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;b >= 0;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = d == -1 ? c.length : d;
        if(c.substr(d - 7, 7) == "base.js") {
          goog.basePath = c.substr(0, d - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = true)
}, goog.writeScriptTag_ = function(a) {
  if(goog.inHtmlDocument_()) {
    goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>');
    return true
  }
  return false
}, goog.writeScripts_ = function() {
  function a(e) {
    if(!(e in d.written)) {
      if(!(e in d.visited)) {
        d.visited[e] = true;
        if(e in d.requires) {
          for(var g in d.requires[e]) {
            if(g in d.nameToPath) {
              a(d.nameToPath[g])
            }else {
              if(!goog.getObjectByName(g)) {
                throw Error("Undefined nameToPath for " + g);
              }
            }
          }
        }
      }
      if(!(e in c)) {
        c[e] = true;
        b.push(e)
      }
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for(e in goog.included_) {
    d.written[e] || a(e)
  }
  for(e = 0;e < b.length;e++) {
    if(b[e]) {
      goog.importScript_(goog.basePath + b[e])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if(b == "object") {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if(c == "[object Window]") {
        return"object"
      }
      if(c == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(c == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(b == "function" && typeof a.call == "undefined") {
      return"object"
    }
  }
  return b
};
goog.propertyIsEnumerableCustom_ = function(a, b) {
  if(b in a) {
    for(var c in a) {
      if(c == b && Object.prototype.hasOwnProperty.call(a, b)) {
        return true
      }
    }
  }
  return false
};
goog.propertyIsEnumerable_ = function(a, b) {
  return a instanceof Object ? Object.prototype.propertyIsEnumerable.call(a, b) : goog.propertyIsEnumerableCustom_(a, b)
};
goog.isDef = function(a) {
  return a !== void 0
};
goog.isNull = function(a) {
  return a === null
};
goog.isDefAndNotNull = function(a) {
  return a != null
};
goog.isArray = function(a) {
  return goog.typeOf(a) == "array"
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return b == "array" || b == "object" && typeof a.length == "number"
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && typeof a.getFullYear == "function"
};
goog.isString = function(a) {
  return typeof a == "string"
};
goog.isBoolean = function(a) {
  return typeof a == "boolean"
};
goog.isNumber = function(a) {
  return typeof a == "number"
};
goog.isFunction = function(a) {
  return goog.typeOf(a) == "function"
};
goog.isObject = function(a) {
  a = goog.typeOf(a);
  return a == "object" || a == "array" || a == "function"
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if(b == "object" || b == "array") {
    if(a.clone) {
      return a.clone()
    }
    var b = b == "array" ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  var d = b || goog.global;
  if(arguments.length > 2) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function() {
      var b = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(b, e);
      return a.apply(d, b)
    }
  }
  return function() {
    return a.apply(d, arguments)
  }
};
goog.bind = function(a, b, c) {
  goog.bind = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global._et_ != "undefined") {
          delete goog.global._et_;
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = false;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d;
  d = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? c : function(a) {
    for(var a = a.split("-"), b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  } : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$"), a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = false, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = true
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.subs = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = ("" + arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return" " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = ("" + a).toLowerCase(), d = ("" + b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(a) {
  a = "" + a;
  return!goog.string.encodeUriRegExp_.test(a) ? encodeURIComponent(a) : a
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }
  if(!goog.string.allRe_.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(goog.string.amperRe_, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(goog.string.ltRe_, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(goog.string.gtRe_, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "&quot;"));
  return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? "document" in goog.global && !goog.string.contains(a, "<") ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = goog.global.document.createElement("div");
  b.innerHTML = "<pre>x" + a + "</pre>";
  if(b.firstChild[goog.string.NORMALIZE_FN_]) {
    b.firstChild[goog.string.NORMALIZE_FN_]()
  }
  a = b.firstChild.firstChild.nodeValue.slice(1);
  b.innerHTML = "";
  return goog.string.canonicalizeNewlines(a)
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.NORMALIZE_FN_ = "normalize";
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d) {
    d > b && (d = b);
    var e = a.length - d, a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = "" + a;
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
  }
  b.push('"');
  return b.join("")
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(31 < c && 127 > c) {
    b = a
  }else {
    if(256 > c) {
      if(b = "\\x", 16 > c || 256 < c) {
        b += "0"
      }
    }else {
      b = "\\u", 4096 > c && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b)
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return("" + a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : "" + a;
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : "" + a
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim("" + a).split("."), e = goog.string.trim("" + b).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", i = e[g] || "", j = RegExp("(\\d*)(\\D*)", "g"), k = RegExp("(\\d*)(\\D*)", "g");
    do {
      var l = j.exec(h) || ["", "", ""], m = k.exec(i) || ["", "", ""];
      if(0 == l[0].length && 0 == m[0].length) {
        break
      }
      var c = 0 == l[1].length ? 0 : parseInt(l[1], 10), n = 0 == m[1].length ? 0 : parseInt(m[1], 10), c = goog.string.compareElements_(c, n) || goog.string.compareElements_(0 == l[2].length, 0 == m[2].length) || goog.string.compareElements_(l[2], m[2])
    }while(0 == c)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.toCamelCaseCache_ = {};
goog.string.toCamelCase = function(a) {
  return goog.string.toCamelCaseCache_[a] || (goog.string.toCamelCaseCache_[a] = ("" + a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  }))
};
goog.string.toSelectorCaseCache_ = {};
goog.string.toSelectorCase = function(a) {
  return goog.string.toSelectorCaseCache_[a] || (goog.string.toSelectorCaseCache_[a] = ("" + a).replace(/([A-Z])/g, "-$1").toLowerCase())
};
goog.userAgent = {};
goog.userAgent.jscript = {};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT = !1;
goog.userAgent.jscript.init_ = function() {
  goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ = "ScriptEngine" in goog.global && "JScript" == goog.global.ScriptEngine();
  goog.userAgent.jscript.DETECTED_VERSION_ = goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ ? goog.global.ScriptEngineMajorVersion() + "." + goog.global.ScriptEngineMinorVersion() + "." + goog.global.ScriptEngineBuildVersion() : "0"
};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT || goog.userAgent.jscript.init_();
goog.userAgent.jscript.HAS_JSCRIPT = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? !1 : goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_;
goog.userAgent.jscript.VERSION = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? "0" : goog.userAgent.jscript.DETECTED_VERSION_;
goog.userAgent.jscript.isVersion = function(a) {
  return 0 <= goog.string.compareVersions(goog.userAgent.jscript.VERSION, a)
};
goog.string.StringBuffer = function(a, b) {
  this.buffer_ = goog.userAgent.jscript.HAS_JSCRIPT ? [] : "";
  null != a && this.append.apply(this, arguments)
};
goog.string.StringBuffer.prototype.set = function(a) {
  this.clear();
  this.append(a)
};
goog.userAgent.jscript.HAS_JSCRIPT ? (goog.string.StringBuffer.prototype.bufferLength_ = 0, goog.string.StringBuffer.prototype.append = function(a, b, c) {
  null == b ? this.buffer_[this.bufferLength_++] = a : (this.buffer_.push.apply(this.buffer_, arguments), this.bufferLength_ = this.buffer_.length);
  return this
}) : goog.string.StringBuffer.prototype.append = function(a, b, c) {
  this.buffer_ += a;
  if(null != b) {
    for(var d = 1;d < arguments.length;d++) {
      this.buffer_ += arguments[d]
    }
  }
  return this
};
goog.string.StringBuffer.prototype.clear = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    this.bufferLength_ = this.buffer_.length = 0
  }else {
    this.buffer_ = ""
  }
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.toString().length
};
goog.string.StringBuffer.prototype.toString = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    var a = this.buffer_.join("");
    this.clear();
    a && this.append(a);
    return a
  }
  return this.buffer_
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && !(a = a[d[c]], !goog.isDef(a));c++) {
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
goog.object.extend = function(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0
  }
  return c
};
goog.debug = {};
goog.debug.Error = function(a) {
  this.stack = Error().stack || "";
  a && (this.message = "" + a)
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    var e = e + (": " + c), f = d
  }else {
    a && (e += ": " + a, f = b)
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, b) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3))
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = !0;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.lastIndexOf(b, c)
  }
  for(;0 <= c;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var i = g[h];
      b.call(c, i, h, a) && (e[f++] = i)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
  return 0 == a.length
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;0 <= b;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(a) {
  if(goog.isArray(a)) {
    return goog.array.concat(a)
  }
  for(var b = [], c = 0, d = a.length;c < d;c++) {
    b[c] = a[c]
  }
  return b
};
goog.array.toArray = function(a) {
  return goog.isArray(a) ? goog.array.concat(a) : goog.array.clone(a)
};
goog.array.extend = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && d.hasOwnProperty("callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h]
        }
      }else {
        a.push(d)
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  for(var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var i = f + g >> 1, j;
    j = c ? b.call(e, a[i], i, a) : b(d, a[i]);
    0 < j ? f = i + 1 : (g = i, h = !j)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  for(var b = b || goog.array.defaultCompare, d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(0 < e || 0 == e && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  for(var d = a.length, c = c || goog.array.defaultCompareEquality, e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b) {
  for(var c = {}, d = 0;d < a.length;d++) {
    var e = a[d], f = b(e, d, a);
    goog.isDef(f) && (c[f] || (c[f] = [])).push(e)
  }
  return c
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function(a) {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }
  return b
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var b = [], c = 0;;c++) {
    for(var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if(c >= f.length) {
        return b
      }
      d.push(f[c])
    }
    b.push(d)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
var cljs = {core:{}};
cljs.core._STAR_unchecked_if_STAR_ = !1;
cljs.core._STAR_print_fn_STAR_ = function() {
  throw Error("No *print-fn* fn set for evaluation environment");
};
void 0;
void 0;
void 0;
cljs.core.truth_ = function(a) {
  return null != a && !1 !== a
};
cljs.core.type_satisfies_ = function(a, b) {
  var c = a[goog.typeOf.call(null, b)];
  if(cljs.core.truth_(c)) {
    return c
  }
  c = a._;
  return cljs.core.truth_(c) ? c : !1
};
cljs.core.is_proto_ = function(a) {
  return a.constructor.prototype === a
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.missing_protocol = function(a, b) {
  return Error("No protocol method " + a + " defined for type " + goog.typeOf.call(null, b) + ": " + b)
};
cljs.core.aclone = function(a) {
  return Array.prototype.slice.call(a)
};
cljs.core.array = function(a) {
  return Array.prototype.slice.call(arguments)
};
cljs.core.make_array = function() {
  var a = null, b = function(b, d) {
    return a.call(null, d)
  }, a = function(a, d) {
    switch(arguments.length) {
      case 1:
        return Array(a);
      case 2:
        return b.call(this, a, d)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = function(a) {
    return Array(a)
  };
  a.cljs$lang$arity$2 = b;
  return a
}();
void 0;
cljs.core.aget = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.apply.call(null, a, a.call(null, b, c), g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.apply.call(null, a, a.call(null, c, f), b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 2:
        return a[d];
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$lang$arity$2 = function(a, b) {
    return a[b]
  };
  a.cljs$lang$arity$3 = b;
  return a
}();
cljs.core.aset = function(a, b, c) {
  return a[b] = c
};
cljs.core.alength = function(a) {
  return a.length
};
void 0;
cljs.core.into_array = function() {
  var a = null, b = function(b) {
    return a.call(null, null, b)
  }, c = function(a, b) {
    return cljs.core.reduce.call(null, function(a, b) {
      a.push(b);
      return a
    }, [], b)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
void 0;
cljs.core.IFn = {};
cljs.core._invoke = function() {
  var a = null, b = function(a) {
    if(a ? a.cljs$core$IFn$_invoke$arity$1 : a) {
      a = a.cljs$core$IFn$_invoke$arity$1(a)
    }else {
      var b;
      b = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!b && (b = cljs.core._invoke._, !b)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = b.call(null, a)
    }
    return a
  }, c = function(a, b) {
    var c;
    if(a ? a.cljs$core$IFn$_invoke$arity$2 : a) {
      c = a.cljs$core$IFn$_invoke$arity$2(a, b)
    }else {
      c = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!c && (c = cljs.core._invoke._, !c)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      c = c.call(null, a, b)
    }
    return c
  }, d = function(a, b, c) {
    if(a ? a.cljs$core$IFn$_invoke$arity$3 : a) {
      a = a.cljs$core$IFn$_invoke$arity$3(a, b, c)
    }else {
      var d;
      d = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!d && (d = cljs.core._invoke._, !d)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = d.call(null, a, b, c)
    }
    return a
  }, e = function(a, b, c, d) {
    if(a ? a.cljs$core$IFn$_invoke$arity$4 : a) {
      a = a.cljs$core$IFn$_invoke$arity$4(a, b, c, d)
    }else {
      var e;
      e = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!e && (e = cljs.core._invoke._, !e)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = e.call(null, a, b, c, d)
    }
    return a
  }, f = function(a, b, c, d, e) {
    if(a ? a.cljs$core$IFn$_invoke$arity$5 : a) {
      a = a.cljs$core$IFn$_invoke$arity$5(a, b, c, d, e)
    }else {
      var f;
      f = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!f && (f = cljs.core._invoke._, !f)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = f.call(null, a, b, c, d, e)
    }
    return a
  }, g = function(a, b, c, d, e, f) {
    if(a ? a.cljs$core$IFn$_invoke$arity$6 : a) {
      a = a.cljs$core$IFn$_invoke$arity$6(a, b, c, d, e, f)
    }else {
      var g;
      g = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!g && (g = cljs.core._invoke._, !g)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = g.call(null, a, b, c, d, e, f)
    }
    return a
  }, h = function(a, b, c, d, e, f, g) {
    if(a ? a.cljs$core$IFn$_invoke$arity$7 : a) {
      a = a.cljs$core$IFn$_invoke$arity$7(a, b, c, d, e, f, g)
    }else {
      var h;
      h = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!h && (h = cljs.core._invoke._, !h)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = h.call(null, a, b, c, d, e, f, g)
    }
    return a
  }, i = function(a, b, c, d, e, f, g, h) {
    if(a ? a.cljs$core$IFn$_invoke$arity$8 : a) {
      a = a.cljs$core$IFn$_invoke$arity$8(a, b, c, d, e, f, g, h)
    }else {
      var i;
      i = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!i && (i = cljs.core._invoke._, !i)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = i.call(null, a, b, c, d, e, f, g, h)
    }
    return a
  }, j = function(a, b, c, d, e, f, g, h, i) {
    if(a ? a.cljs$core$IFn$_invoke$arity$9 : a) {
      a = a.cljs$core$IFn$_invoke$arity$9(a, b, c, d, e, f, g, h, i)
    }else {
      var j;
      j = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!j && (j = cljs.core._invoke._, !j)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = j.call(null, a, b, c, d, e, f, g, h, i)
    }
    return a
  }, k = function(a, b, c, d, e, f, g, h, i, j) {
    if(a ? a.cljs$core$IFn$_invoke$arity$10 : a) {
      a = a.cljs$core$IFn$_invoke$arity$10(a, b, c, d, e, f, g, h, i, j)
    }else {
      var k;
      k = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!k && (k = cljs.core._invoke._, !k)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = k.call(null, a, b, c, d, e, f, g, h, i, j)
    }
    return a
  }, l = function(a, b, c, d, e, f, g, h, i, j, k) {
    if(a ? a.cljs$core$IFn$_invoke$arity$11 : a) {
      a = a.cljs$core$IFn$_invoke$arity$11(a, b, c, d, e, f, g, h, i, j, k)
    }else {
      var m;
      m = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!m && (m = cljs.core._invoke._, !m)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = m.call(null, a, b, c, d, e, f, g, h, i, j, k)
    }
    return a
  }, m = function(a, b, c, d, e, f, g, h, i, j, k, m) {
    if(a ? a.cljs$core$IFn$_invoke$arity$12 : a) {
      a = a.cljs$core$IFn$_invoke$arity$12(a, b, c, d, e, f, g, h, i, j, k, m)
    }else {
      var n;
      n = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!n && (n = cljs.core._invoke._, !n)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = n.call(null, a, b, c, d, e, f, g, h, i, j, k, m)
    }
    return a
  }, n = function(a, b, c, d, e, f, g, h, i, j, k, m, n) {
    if(a ? a.cljs$core$IFn$_invoke$arity$13 : a) {
      a = a.cljs$core$IFn$_invoke$arity$13(a, b, c, d, e, f, g, h, i, j, k, m, n)
    }else {
      var l;
      l = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!l && (l = cljs.core._invoke._, !l)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = l.call(null, a, b, c, d, e, f, g, h, i, j, k, m, n)
    }
    return a
  }, o = function(a, b, c, d, e, f, g, h, i, j, k, m, n, l) {
    if(a ? a.cljs$core$IFn$_invoke$arity$14 : a) {
      a = a.cljs$core$IFn$_invoke$arity$14(a, b, c, d, e, f, g, h, i, j, k, m, n, l)
    }else {
      var o;
      o = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!o && (o = cljs.core._invoke._, !o)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = o.call(null, a, b, c, d, e, f, g, h, i, j, k, m, n, l)
    }
    return a
  }, p = function(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o) {
    if(a ? a.cljs$core$IFn$_invoke$arity$15 : a) {
      a = a.cljs$core$IFn$_invoke$arity$15(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o)
    }else {
      var p;
      p = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!p && (p = cljs.core._invoke._, !p)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = p.call(null, a, b, c, d, e, f, g, h, i, j, k, m, n, l, o)
    }
    return a
  }, q = function(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p) {
    if(a ? a.cljs$core$IFn$_invoke$arity$16 : a) {
      a = a.cljs$core$IFn$_invoke$arity$16(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p)
    }else {
      var q;
      q = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!q && (q = cljs.core._invoke._, !q)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = q.call(null, a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p)
    }
    return a
  }, A = function(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q) {
    if(a ? a.cljs$core$IFn$_invoke$arity$17 : a) {
      a = a.cljs$core$IFn$_invoke$arity$17(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q)
    }else {
      var s;
      s = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!s && (s = cljs.core._invoke._, !s)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = s.call(null, a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q)
    }
    return a
  }, w = function(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s) {
    if(a ? a.cljs$core$IFn$_invoke$arity$18 : a) {
      a = a.cljs$core$IFn$_invoke$arity$18(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s)
    }else {
      var w;
      w = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!w && (w = cljs.core._invoke._, !w)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = w.call(null, a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s)
    }
    return a
  }, s = function(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s, w) {
    if(a ? a.cljs$core$IFn$_invoke$arity$19 : a) {
      a = a.cljs$core$IFn$_invoke$arity$19(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s, w)
    }else {
      var A;
      A = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!A && (A = cljs.core._invoke._, !A)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = A.call(null, a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s, w)
    }
    return a
  }, E = function(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s, w, A) {
    if(a ? a.cljs$core$IFn$_invoke$arity$20 : a) {
      a = a.cljs$core$IFn$_invoke$arity$20(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s, w, A)
    }else {
      var E;
      E = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!E && (E = cljs.core._invoke._, !E)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = E.call(null, a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s, w, A)
    }
    return a
  }, I = function(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s, w, A, E) {
    if(a ? a.cljs$core$IFn$_invoke$arity$21 : a) {
      a = a.cljs$core$IFn$_invoke$arity$21(a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s, w, A, E)
    }else {
      var I;
      I = cljs.core._invoke[goog.typeOf.call(null, a)];
      if(!I && (I = cljs.core._invoke._, !I)) {
        throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
      }
      a = I.call(null, a, b, c, d, e, f, g, h, i, j, k, m, n, l, o, p, q, s, w, A, E)
    }
    return a
  }, a = function(a, r, t, u, v, x, y, z, B, C, D, F, G, H, J, K, L, M, N, O, P) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, r);
      case 3:
        return d.call(this, a, r, t);
      case 4:
        return e.call(this, a, r, t, u);
      case 5:
        return f.call(this, a, r, t, u, v);
      case 6:
        return g.call(this, a, r, t, u, v, x);
      case 7:
        return h.call(this, a, r, t, u, v, x, y);
      case 8:
        return i.call(this, a, r, t, u, v, x, y, z);
      case 9:
        return j.call(this, a, r, t, u, v, x, y, z, B);
      case 10:
        return k.call(this, a, r, t, u, v, x, y, z, B, C);
      case 11:
        return l.call(this, a, r, t, u, v, x, y, z, B, C, D);
      case 12:
        return m.call(this, a, r, t, u, v, x, y, z, B, C, D, F);
      case 13:
        return n.call(this, a, r, t, u, v, x, y, z, B, C, D, F, G);
      case 14:
        return o.call(this, a, r, t, u, v, x, y, z, B, C, D, F, G, H);
      case 15:
        return p.call(this, a, r, t, u, v, x, y, z, B, C, D, F, G, H, J);
      case 16:
        return q.call(this, a, r, t, u, v, x, y, z, B, C, D, F, G, H, J, K);
      case 17:
        return A.call(this, a, r, t, u, v, x, y, z, B, C, D, F, G, H, J, K, L);
      case 18:
        return w.call(this, a, r, t, u, v, x, y, z, B, C, D, F, G, H, J, K, L, M);
      case 19:
        return s.call(this, a, r, t, u, v, x, y, z, B, C, D, F, G, H, J, K, L, M, N);
      case 20:
        return E.call(this, a, r, t, u, v, x, y, z, B, C, D, F, G, H, J, K, L, M, N, O);
      case 21:
        return I.call(this, a, r, t, u, v, x, y, z, B, C, D, F, G, H, J, K, L, M, N, O, P)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  a.cljs$lang$arity$3 = d;
  a.cljs$lang$arity$4 = e;
  a.cljs$lang$arity$5 = f;
  a.cljs$lang$arity$6 = g;
  a.cljs$lang$arity$7 = h;
  a.cljs$lang$arity$8 = i;
  a.cljs$lang$arity$9 = j;
  a.cljs$lang$arity$10 = k;
  a.cljs$lang$arity$11 = l;
  a.cljs$lang$arity$12 = m;
  a.cljs$lang$arity$13 = n;
  a.cljs$lang$arity$14 = o;
  a.cljs$lang$arity$15 = p;
  a.cljs$lang$arity$16 = q;
  a.cljs$lang$arity$17 = A;
  a.cljs$lang$arity$18 = w;
  a.cljs$lang$arity$19 = s;
  a.cljs$lang$arity$20 = E;
  a.cljs$lang$arity$21 = I;
  return a
}();
void 0;
void 0;
cljs.core.ICounted = {};
cljs.core._count = function(a) {
  if(a ? a.cljs$core$ICounted$_count$arity$1 : a) {
    a = a.cljs$core$ICounted$_count$arity$1(a)
  }else {
    var b;
    b = cljs.core._count[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._count._, !b)) {
      throw cljs.core.missing_protocol.call(null, "ICounted.-count", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.IEmptyableCollection = {};
cljs.core._empty = function(a) {
  if(a ? a.cljs$core$IEmptyableCollection$_empty$arity$1 : a) {
    a = a.cljs$core$IEmptyableCollection$_empty$arity$1(a)
  }else {
    var b;
    b = cljs.core._empty[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._empty._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.ICollection = {};
cljs.core._conj = function(a, b) {
  var c;
  if(a ? a.cljs$core$ICollection$_conj$arity$2 : a) {
    c = a.cljs$core$ICollection$_conj$arity$2(a, b)
  }else {
    c = cljs.core._conj[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._conj._, !c)) {
      throw cljs.core.missing_protocol.call(null, "ICollection.-conj", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
void 0;
void 0;
cljs.core.IIndexed = {};
cljs.core._nth = function() {
  var a = null, b = function(a, b) {
    var c;
    if(a ? a.cljs$core$IIndexed$_nth$arity$2 : a) {
      c = a.cljs$core$IIndexed$_nth$arity$2(a, b)
    }else {
      c = cljs.core._nth[goog.typeOf.call(null, a)];
      if(!c && (c = cljs.core._nth._, !c)) {
        throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
      }
      c = c.call(null, a, b)
    }
    return c
  }, c = function(a, b, c) {
    if(a ? a.cljs$core$IIndexed$_nth$arity$3 : a) {
      a = a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
    }else {
      var g;
      g = cljs.core._nth[goog.typeOf.call(null, a)];
      if(!g && (g = cljs.core._nth._, !g)) {
        throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
      }
      a = g.call(null, a, b, c)
    }
    return a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
void 0;
void 0;
cljs.core.ISeq = {};
cljs.core._first = function(a) {
  if(a ? a.cljs$core$ISeq$_first$arity$1 : a) {
    a = a.cljs$core$ISeq$_first$arity$1(a)
  }else {
    var b;
    b = cljs.core._first[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._first._, !b)) {
      throw cljs.core.missing_protocol.call(null, "ISeq.-first", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core._rest = function(a) {
  if(a ? a.cljs$core$ISeq$_rest$arity$1 : a) {
    a = a.cljs$core$ISeq$_rest$arity$1(a)
  }else {
    var b;
    b = cljs.core._rest[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._rest._, !b)) {
      throw cljs.core.missing_protocol.call(null, "ISeq.-rest", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.ILookup = {};
cljs.core._lookup = function() {
  var a = null, b = function(a, b) {
    var c;
    if(a ? a.cljs$core$ILookup$_lookup$arity$2 : a) {
      c = a.cljs$core$ILookup$_lookup$arity$2(a, b)
    }else {
      c = cljs.core._lookup[goog.typeOf.call(null, a)];
      if(!c && (c = cljs.core._lookup._, !c)) {
        throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
      }
      c = c.call(null, a, b)
    }
    return c
  }, c = function(a, b, c) {
    if(a ? a.cljs$core$ILookup$_lookup$arity$3 : a) {
      a = a.cljs$core$ILookup$_lookup$arity$3(a, b, c)
    }else {
      var g;
      g = cljs.core._lookup[goog.typeOf.call(null, a)];
      if(!g && (g = cljs.core._lookup._, !g)) {
        throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
      }
      a = g.call(null, a, b, c)
    }
    return a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
void 0;
void 0;
cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = function(a, b) {
  var c;
  if(a ? a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 : a) {
    c = a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(a, b)
  }else {
    c = cljs.core._contains_key_QMARK_[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._contains_key_QMARK_._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core._assoc = function(a, b, c) {
  if(a ? a.cljs$core$IAssociative$_assoc$arity$3 : a) {
    a = a.cljs$core$IAssociative$_assoc$arity$3(a, b, c)
  }else {
    var d;
    d = cljs.core._assoc[goog.typeOf.call(null, a)];
    if(!d && (d = cljs.core._assoc._, !d)) {
      throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
void 0;
void 0;
cljs.core.IMap = {};
cljs.core._dissoc = function(a, b) {
  var c;
  if(a ? a.cljs$core$IMap$_dissoc$arity$2 : a) {
    c = a.cljs$core$IMap$_dissoc$arity$2(a, b)
  }else {
    c = cljs.core._dissoc[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._dissoc._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
void 0;
void 0;
cljs.core.IMapEntry = {};
cljs.core._key = function(a) {
  if(a ? a.cljs$core$IMapEntry$_key$arity$1 : a) {
    a = a.cljs$core$IMapEntry$_key$arity$1(a)
  }else {
    var b;
    b = cljs.core._key[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._key._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IMapEntry.-key", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core._val = function(a) {
  if(a ? a.cljs$core$IMapEntry$_val$arity$1 : a) {
    a = a.cljs$core$IMapEntry$_val$arity$1(a)
  }else {
    var b;
    b = cljs.core._val[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._val._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IMapEntry.-val", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.ISet = {};
cljs.core._disjoin = function(a, b) {
  var c;
  if(a ? a.cljs$core$ISet$_disjoin$arity$2 : a) {
    c = a.cljs$core$ISet$_disjoin$arity$2(a, b)
  }else {
    c = cljs.core._disjoin[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._disjoin._, !c)) {
      throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
void 0;
void 0;
cljs.core.IStack = {};
cljs.core._peek = function(a) {
  if(a ? a.cljs$core$IStack$_peek$arity$1 : a) {
    a = a.cljs$core$IStack$_peek$arity$1(a)
  }else {
    var b;
    b = cljs.core._peek[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._peek._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IStack.-peek", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core._pop = function(a) {
  if(a ? a.cljs$core$IStack$_pop$arity$1 : a) {
    a = a.cljs$core$IStack$_pop$arity$1(a)
  }else {
    var b;
    b = cljs.core._pop[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._pop._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IStack.-pop", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.IVector = {};
cljs.core._assoc_n = function(a, b, c) {
  if(a ? a.cljs$core$IVector$_assoc_n$arity$3 : a) {
    a = a.cljs$core$IVector$_assoc_n$arity$3(a, b, c)
  }else {
    var d;
    d = cljs.core._assoc_n[goog.typeOf.call(null, a)];
    if(!d && (d = cljs.core._assoc_n._, !d)) {
      throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
void 0;
void 0;
cljs.core.IDeref = {};
cljs.core._deref = function(a) {
  if(a ? a.cljs$core$IDeref$_deref$arity$1 : a) {
    a = a.cljs$core$IDeref$_deref$arity$1(a)
  }else {
    var b;
    b = cljs.core._deref[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._deref._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IDeref.-deref", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = function(a, b, c) {
  if(a ? a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3 : a) {
    a = a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(a, b, c)
  }else {
    var d;
    d = cljs.core._deref_with_timeout[goog.typeOf.call(null, a)];
    if(!d && (d = cljs.core._deref_with_timeout._, !d)) {
      throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
void 0;
void 0;
cljs.core.IMeta = {};
cljs.core._meta = function(a) {
  if(a ? a.cljs$core$IMeta$_meta$arity$1 : a) {
    a = a.cljs$core$IMeta$_meta$arity$1(a)
  }else {
    var b;
    b = cljs.core._meta[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._meta._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IMeta.-meta", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.IWithMeta = {};
cljs.core._with_meta = function(a, b) {
  var c;
  if(a ? a.cljs$core$IWithMeta$_with_meta$arity$2 : a) {
    c = a.cljs$core$IWithMeta$_with_meta$arity$2(a, b)
  }else {
    c = cljs.core._with_meta[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._with_meta._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
void 0;
void 0;
cljs.core.IReduce = {};
cljs.core._reduce = function() {
  var a = null, b = function(a, b) {
    var c;
    if(a ? a.cljs$core$IReduce$_reduce$arity$2 : a) {
      c = a.cljs$core$IReduce$_reduce$arity$2(a, b)
    }else {
      c = cljs.core._reduce[goog.typeOf.call(null, a)];
      if(!c && (c = cljs.core._reduce._, !c)) {
        throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
      }
      c = c.call(null, a, b)
    }
    return c
  }, c = function(a, b, c) {
    if(a ? a.cljs$core$IReduce$_reduce$arity$3 : a) {
      a = a.cljs$core$IReduce$_reduce$arity$3(a, b, c)
    }else {
      var g;
      g = cljs.core._reduce[goog.typeOf.call(null, a)];
      if(!g && (g = cljs.core._reduce._, !g)) {
        throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
      }
      a = g.call(null, a, b, c)
    }
    return a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
void 0;
void 0;
cljs.core.IEquiv = {};
cljs.core._equiv = function(a, b) {
  var c;
  if(a ? a.cljs$core$IEquiv$_equiv$arity$2 : a) {
    c = a.cljs$core$IEquiv$_equiv$arity$2(a, b)
  }else {
    c = cljs.core._equiv[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._equiv._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
void 0;
void 0;
cljs.core.IHash = {};
cljs.core._hash = function(a) {
  if(a ? a.cljs$core$IHash$_hash$arity$1 : a) {
    a = a.cljs$core$IHash$_hash$arity$1(a)
  }else {
    var b;
    b = cljs.core._hash[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._hash._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IHash.-hash", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.ISeqable = {};
cljs.core._seq = function(a) {
  if(a ? a.cljs$core$ISeqable$_seq$arity$1 : a) {
    a = a.cljs$core$ISeqable$_seq$arity$1(a)
  }else {
    var b;
    b = cljs.core._seq[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._seq._, !b)) {
      throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.ISequential = {};
void 0;
void 0;
cljs.core.IList = {};
void 0;
void 0;
cljs.core.IRecord = {};
void 0;
void 0;
cljs.core.IReversible = {};
cljs.core._rseq = function(a) {
  if(a ? a.cljs$core$IReversible$_rseq$arity$1 : a) {
    a = a.cljs$core$IReversible$_rseq$arity$1(a)
  }else {
    var b;
    b = cljs.core._rseq[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._rseq._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IReversible.-rseq", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.ISorted = {};
cljs.core._sorted_seq = function(a, b) {
  var c;
  if(a ? a.cljs$core$ISorted$_sorted_seq$arity$2 : a) {
    c = a.cljs$core$ISorted$_sorted_seq$arity$2(a, b)
  }else {
    c = cljs.core._sorted_seq[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._sorted_seq._, !c)) {
      throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core._sorted_seq_from = function(a, b, c) {
  if(a ? a.cljs$core$ISorted$_sorted_seq_from$arity$3 : a) {
    a = a.cljs$core$ISorted$_sorted_seq_from$arity$3(a, b, c)
  }else {
    var d;
    d = cljs.core._sorted_seq_from[goog.typeOf.call(null, a)];
    if(!d && (d = cljs.core._sorted_seq_from._, !d)) {
      throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq-from", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core._entry_key = function(a, b) {
  var c;
  if(a ? a.cljs$core$ISorted$_entry_key$arity$2 : a) {
    c = a.cljs$core$ISorted$_entry_key$arity$2(a, b)
  }else {
    c = cljs.core._entry_key[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._entry_key._, !c)) {
      throw cljs.core.missing_protocol.call(null, "ISorted.-entry-key", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core._comparator = function(a) {
  if(a ? a.cljs$core$ISorted$_comparator$arity$1 : a) {
    a = a.cljs$core$ISorted$_comparator$arity$1(a)
  }else {
    var b;
    b = cljs.core._comparator[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._comparator._, !b)) {
      throw cljs.core.missing_protocol.call(null, "ISorted.-comparator", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.IPrintable = {};
cljs.core._pr_seq = function(a, b) {
  var c;
  if(a ? a.cljs$core$IPrintable$_pr_seq$arity$2 : a) {
    c = a.cljs$core$IPrintable$_pr_seq$arity$2(a, b)
  }else {
    c = cljs.core._pr_seq[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._pr_seq._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IPrintable.-pr-seq", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
void 0;
void 0;
cljs.core.IPending = {};
cljs.core._realized_QMARK_ = function(a) {
  if(a ? a.cljs$core$IPending$_realized_QMARK_$arity$1 : a) {
    a = a.cljs$core$IPending$_realized_QMARK_$arity$1(a)
  }else {
    var b;
    b = cljs.core._realized_QMARK_[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._realized_QMARK_._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IPending.-realized?", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.IWatchable = {};
cljs.core._notify_watches = function(a, b, c) {
  if(a ? a.cljs$core$IWatchable$_notify_watches$arity$3 : a) {
    a = a.cljs$core$IWatchable$_notify_watches$arity$3(a, b, c)
  }else {
    var d;
    d = cljs.core._notify_watches[goog.typeOf.call(null, a)];
    if(!d && (d = cljs.core._notify_watches._, !d)) {
      throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core._add_watch = function(a, b, c) {
  if(a ? a.cljs$core$IWatchable$_add_watch$arity$3 : a) {
    a = a.cljs$core$IWatchable$_add_watch$arity$3(a, b, c)
  }else {
    var d;
    d = cljs.core._add_watch[goog.typeOf.call(null, a)];
    if(!d && (d = cljs.core._add_watch._, !d)) {
      throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core._remove_watch = function(a, b) {
  var c;
  if(a ? a.cljs$core$IWatchable$_remove_watch$arity$2 : a) {
    c = a.cljs$core$IWatchable$_remove_watch$arity$2(a, b)
  }else {
    c = cljs.core._remove_watch[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._remove_watch._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IWatchable.-remove-watch", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
void 0;
void 0;
cljs.core.IEditableCollection = {};
cljs.core._as_transient = function(a) {
  if(a ? a.cljs$core$IEditableCollection$_as_transient$arity$1 : a) {
    a = a.cljs$core$IEditableCollection$_as_transient$arity$1(a)
  }else {
    var b;
    b = cljs.core._as_transient[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._as_transient._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IEditableCollection.-as-transient", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.ITransientCollection = {};
cljs.core._conj_BANG_ = function(a, b) {
  var c;
  if(a ? a.cljs$core$ITransientCollection$_conj_BANG_$arity$2 : a) {
    c = a.cljs$core$ITransientCollection$_conj_BANG_$arity$2(a, b)
  }else {
    c = cljs.core._conj_BANG_[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._conj_BANG_._, !c)) {
      throw cljs.core.missing_protocol.call(null, "ITransientCollection.-conj!", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core._persistent_BANG_ = function(a) {
  if(a ? a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 : a) {
    a = a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(a)
  }else {
    var b;
    b = cljs.core._persistent_BANG_[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._persistent_BANG_._, !b)) {
      throw cljs.core.missing_protocol.call(null, "ITransientCollection.-persistent!", a);
    }
    a = b.call(null, a)
  }
  return a
};
void 0;
void 0;
cljs.core.ITransientAssociative = {};
cljs.core._assoc_BANG_ = function(a, b, c) {
  if(a ? a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 : a) {
    a = a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(a, b, c)
  }else {
    var d;
    d = cljs.core._assoc_BANG_[goog.typeOf.call(null, a)];
    if(!d && (d = cljs.core._assoc_BANG_._, !d)) {
      throw cljs.core.missing_protocol.call(null, "ITransientAssociative.-assoc!", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core._dissoc_BANG_ = function(a, b) {
  var c;
  if(a ? a.cljs$core$ITransientAssociative$_dissoc_BANG_$arity$2 : a) {
    c = a.cljs$core$ITransientAssociative$_dissoc_BANG_$arity$2(a, b)
  }else {
    c = cljs.core._dissoc_BANG_[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._dissoc_BANG_._, !c)) {
      throw cljs.core.missing_protocol.call(null, "ITransientAssociative.-dissoc!", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
void 0;
cljs.core.identical_QMARK_ = function(a, b) {
  return a === b
};
void 0;
void 0;
cljs.core._EQ_ = function() {
  var a = null, b = function(a, b) {
    var c = a === b;
    return c ? c : cljs.core._equiv.call(null, a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.call(null, b, c))) {
          if(cljs.core.truth_(cljs.core.next.call(null, d))) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
          }else {
            return a.call(null, c, cljs.core.first.call(null, d))
          }
        }else {
          return!1
        }
      }
    }, c = function(a, c, e) {
      var i = null;
      goog.isDef(e) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, i)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), e = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, c, e, a)
    };
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function() {
    return!0
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.nil_QMARK_ = function(a) {
  return null === a
};
cljs.core.type = function(a) {
  var b = null === a;
  return(b ? b : void 0 === a) ? null : a.constructor
};
void 0;
void 0;
void 0;
cljs.core.IHash["null"] = !0;
cljs.core._hash["null"] = function() {
  return 0
};
cljs.core.ILookup["null"] = !0;
cljs.core._lookup["null"] = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return null;
      case 3:
        return c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IAssociative["null"] = !0;
cljs.core._assoc["null"] = function(a, b, c) {
  return cljs.core.hash_map.call(null, b, c)
};
cljs.core.ICollection["null"] = !0;
cljs.core._conj["null"] = function(a, b) {
  return cljs.core.list.call(null, b)
};
cljs.core.IReduce["null"] = !0;
cljs.core._reduce["null"] = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return b.call(null);
      case 3:
        return c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IPrintable["null"] = !0;
cljs.core._pr_seq["null"] = function() {
  return cljs.core.list.call(null, "nil")
};
cljs.core.ISet["null"] = !0;
cljs.core._disjoin["null"] = function() {
  return null
};
cljs.core.ICounted["null"] = !0;
cljs.core._count["null"] = function() {
  return 0
};
cljs.core.IStack["null"] = !0;
cljs.core._peek["null"] = function() {
  return null
};
cljs.core._pop["null"] = function() {
  return null
};
cljs.core.ISeq["null"] = !0;
cljs.core._first["null"] = function() {
  return null
};
cljs.core._rest["null"] = function() {
  return cljs.core.list.call(null)
};
cljs.core.IEquiv["null"] = !0;
cljs.core._equiv["null"] = function(a, b) {
  return null === b
};
cljs.core.IWithMeta["null"] = !0;
cljs.core._with_meta["null"] = function() {
  return null
};
cljs.core.IMeta["null"] = !0;
cljs.core._meta["null"] = function() {
  return null
};
cljs.core.IIndexed["null"] = !0;
cljs.core._nth["null"] = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return null;
      case 3:
        return c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IEmptyableCollection["null"] = !0;
cljs.core._empty["null"] = function() {
  return null
};
cljs.core.IMap["null"] = !0;
cljs.core._dissoc["null"] = function() {
  return null
};
Date.prototype.cljs$core$IEquiv$ = !0;
Date.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return a.toString() === b.toString()
};
cljs.core.IHash.number = !0;
cljs.core._hash.number = function(a) {
  return a
};
cljs.core.IEquiv.number = !0;
cljs.core._equiv.number = function(a, b) {
  return a === b
};
cljs.core.IHash["boolean"] = !0;
cljs.core._hash["boolean"] = function(a) {
  return!0 === a ? 1 : 0
};
cljs.core.IHash["function"] = !0;
cljs.core._hash["function"] = function(a) {
  return goog.getUid.call(null, a)
};
cljs.core.inc = function(a) {
  return a + 1
};
cljs.core.ci_reduce = function() {
  var a = null, b = function(a, b) {
    if(cljs.core._EQ_.call(null, 0, cljs.core._count.call(null, a))) {
      return b.call(null)
    }
    for(var c = cljs.core._nth.call(null, a, 0), d = 1;;) {
      if(d < cljs.core._count.call(null, a)) {
        c = b.call(null, c, cljs.core._nth.call(null, a, d)), d += 1
      }else {
        return c
      }
    }
  }, c = function(a, b, c) {
    for(var d = 0;;) {
      if(d < cljs.core._count.call(null, a)) {
        c = b.call(null, c, cljs.core._nth.call(null, a, d)), d += 1
      }else {
        return c
      }
    }
  }, d = function(a, b, c, d) {
    for(;;) {
      if(d < cljs.core._count.call(null, a)) {
        c = b.call(null, c, cljs.core._nth.call(null, a, d)), d += 1
      }else {
        return c
      }
    }
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  a.cljs$lang$arity$4 = d;
  return a
}();
void 0;
void 0;
void 0;
cljs.core.IndexedSeq = function(a, b) {
  this.a = a;
  this.i = b
};
cljs.core.IndexedSeq.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.IndexedSeq")
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISequential$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.IndexedSeq.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this.a, b, this.a[this.i], this.i + 1)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, this.a, b, c, this.i)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.a.length - this.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return this.a[this.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return this.i + 1 < this.a.length ? new cljs.core.IndexedSeq(this.a, this.i + 1) : cljs.core.list.call(null)
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  var c = b + this.i;
  return c < this.a.length ? this.a[c] : null
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  a = b + this.i;
  return a < this.a.length ? this.a[a] : c
};
cljs.core.IndexedSeq;
cljs.core.prim_seq = function(a, b) {
  return cljs.core._EQ_.call(null, 0, a.length) ? null : new cljs.core.IndexedSeq(a, b)
};
cljs.core.array_seq = function(a, b) {
  return cljs.core.prim_seq.call(null, a, b)
};
cljs.core.IReduce.array = !0;
cljs.core._reduce.array = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, b);
      case 3:
        return cljs.core.ci_reduce.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ILookup.array = !0;
cljs.core._lookup.array = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return a[b];
      case 3:
        return cljs.core._nth.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IIndexed.array = !0;
cljs.core._nth.array = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return b < a.length ? a[b] : null;
      case 3:
        return b < a.length ? a[b] : c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ICounted.array = !0;
cljs.core._count.array = function(a) {
  return a.length
};
cljs.core.ISeqable.array = !0;
cljs.core._seq.array = function(a) {
  return cljs.core.array_seq.call(null, a, 0)
};
cljs.core.seq = function(a) {
  return cljs.core.truth_(a) ? cljs.core._seq.call(null, a) : null
};
cljs.core.first = function(a) {
  a = cljs.core.seq.call(null, a);
  return cljs.core.truth_(a) ? cljs.core._first.call(null, a) : null
};
cljs.core.rest = function(a) {
  return cljs.core._rest.call(null, cljs.core.seq.call(null, a))
};
cljs.core.next = function(a) {
  return cljs.core.truth_(a) ? cljs.core.seq.call(null, cljs.core.rest.call(null, a)) : null
};
cljs.core.second = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a))
};
cljs.core.ffirst = function(a) {
  return cljs.core.first.call(null, cljs.core.first.call(null, a))
};
cljs.core.nfirst = function(a) {
  return cljs.core.next.call(null, cljs.core.first.call(null, a))
};
cljs.core.fnext = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a))
};
cljs.core.nnext = function(a) {
  return cljs.core.next.call(null, cljs.core.next.call(null, a))
};
cljs.core.last = function(a) {
  for(;;) {
    if(cljs.core.truth_(cljs.core.next.call(null, a))) {
      a = cljs.core.next.call(null, a)
    }else {
      return cljs.core.first.call(null, a)
    }
  }
};
cljs.core.ICounted._ = !0;
cljs.core._count._ = function(a) {
  for(var a = cljs.core.seq.call(null, a), b = 0;;) {
    if(cljs.core.truth_(a)) {
      a = cljs.core.next.call(null, a), b += 1
    }else {
      return b
    }
  }
};
cljs.core.IEquiv._ = !0;
cljs.core._equiv._ = function(a, b) {
  return a === b
};
cljs.core.not = function(a) {
  return cljs.core.truth_(a) ? !1 : !0
};
cljs.core.conj = function() {
  var a = null, b = function(a, b) {
    return cljs.core._conj.call(null, a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(d)) {
          b = a.call(null, b, c), c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return a.call(null, b, c)
        }
      }
    }, c = function(a, c, e) {
      var i = null;
      goog.isDef(e) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, i)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), e = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, c, e, a)
    };
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.empty = function(a) {
  return cljs.core._empty.call(null, a)
};
cljs.core.count = function(a) {
  return cljs.core._count.call(null, a)
};
cljs.core.nth = function() {
  var a = null, b = function(a, b) {
    return cljs.core._nth.call(null, a, Math.floor(b))
  }, c = function(a, b, c) {
    return cljs.core._nth.call(null, a, Math.floor(b), c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.get = function() {
  var a = null, b = function(a, b) {
    return cljs.core._lookup.call(null, a, b)
  }, c = function(a, b, c) {
    return cljs.core._lookup.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.assoc = function() {
  var a = null, b = function(a, b, c) {
    return cljs.core._assoc.call(null, a, b, c)
  }, c = function() {
    var b = function(b, c, d, e) {
      for(;;) {
        if(b = a.call(null, b, c, d), cljs.core.truth_(e)) {
          c = cljs.core.first.call(null, e), d = cljs.core.second.call(null, e), e = cljs.core.nnext.call(null, e)
        }else {
          return b
        }
      }
    }, c = function(a, c, e, i) {
      var j = null;
      goog.isDef(i) && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, j)
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), e = cljs.core.first(cljs.core.next(a)), i = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return b.call(this, c, e, i, a)
    };
    return c
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$3 = b;
  a.cljs$lang$arity$4 = c;
  return a
}();
cljs.core.dissoc = function() {
  var a = null, b = function(a, b) {
    return cljs.core._dissoc.call(null, a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(b = a.call(null, b, c), cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return b
        }
      }
    }, c = function(a, c, e) {
      var i = null;
      goog.isDef(e) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, i)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), e = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, c, e, a)
    };
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function(a) {
    return a
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.with_meta = function(a, b) {
  return cljs.core._with_meta.call(null, a, b)
};
cljs.core.meta = function(a) {
  return cljs.core.truth_(function() {
    return cljs.core.truth_(function() {
      if(cljs.core.truth_(a)) {
        var b = a.cljs$core$IMeta$;
        return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IMeta$")) : b
      }
      return a
    }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IMeta, a)
  }()) ? cljs.core._meta.call(null, a) : null
};
cljs.core.peek = function(a) {
  return cljs.core._peek.call(null, a)
};
cljs.core.pop = function(a) {
  return cljs.core._pop.call(null, a)
};
cljs.core.disj = function() {
  var a = null, b = function(a, b) {
    return cljs.core._disjoin.call(null, a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(b = a.call(null, b, c), cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return b
        }
      }
    }, c = function(a, c, e) {
      var i = null;
      goog.isDef(e) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, i)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), e = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, c, e, a)
    };
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function(a) {
    return a
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.hash = function(a) {
  return cljs.core._hash.call(null, a)
};
cljs.core.empty_QMARK_ = function(a) {
  return cljs.core.not.call(null, cljs.core.seq.call(null, a))
};
cljs.core.coll_QMARK_ = function(a) {
  return null === a ? !1 : cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$ICollection$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$ICollection$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ICollection, a)
};
cljs.core.set_QMARK_ = function(a) {
  return null === a ? !1 : cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$ISet$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$ISet$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ISet, a)
};
cljs.core.associative_QMARK_ = function(a) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$IAssociative$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IAssociative$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, a)
};
cljs.core.sequential_QMARK_ = function(a) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$ISequential$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$ISequential$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ISequential, a)
};
cljs.core.counted_QMARK_ = function(a) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$ICounted$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$ICounted$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ICounted, a)
};
cljs.core.map_QMARK_ = function(a) {
  return null === a ? !1 : cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$IMap$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IMap$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IMap, a)
};
cljs.core.vector_QMARK_ = function(a) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$IVector$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IVector$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IVector, a)
};
cljs.core.js_obj = function() {
  return{}
};
cljs.core.js_keys = function(a) {
  var b = [];
  goog.object.forEach.call(null, a, function(a, d) {
    return b.push(d)
  });
  return b
};
cljs.core.js_delete = function(a, b) {
  return delete a[b]
};
cljs.core.lookup_sentinel = cljs.core.js_obj.call(null);
cljs.core.false_QMARK_ = function(a) {
  return!1 === a
};
cljs.core.true_QMARK_ = function(a) {
  return!0 === a
};
cljs.core.undefined_QMARK_ = function(a) {
  return void 0 === a
};
cljs.core.instance_QMARK_ = function(a, b) {
  return null != b && (b instanceof a || b.constructor === a || a === Object)
};
cljs.core.seq_QMARK_ = function(a) {
  return null === a ? !1 : cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$ISeq$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$ISeq$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)
};
cljs.core.seqable_QMARK_ = function(a) {
  return null === a ? !1 : cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$ISeqable$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$ISeqable$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, a)
};
cljs.core.boolean$ = function(a) {
  return cljs.core.truth_(a) ? !0 : !1
};
cljs.core.string_QMARK_ = function(a) {
  var b = goog.isString.call(null, a);
  return cljs.core.truth_(b) ? cljs.core.not.call(null, function() {
    var b = cljs.core._EQ_.call(null, a.charAt(0), "\ufdd0");
    return b ? b : cljs.core._EQ_.call(null, a.charAt(0), "\ufdd1")
  }()) : b
};
cljs.core.keyword_QMARK_ = function(a) {
  var b = goog.isString.call(null, a);
  return cljs.core.truth_(b) ? cljs.core._EQ_.call(null, a.charAt(0), "\ufdd0") : b
};
cljs.core.symbol_QMARK_ = function(a) {
  var b = goog.isString.call(null, a);
  return cljs.core.truth_(b) ? cljs.core._EQ_.call(null, a.charAt(0), "\ufdd1") : b
};
cljs.core.number_QMARK_ = function(a) {
  return goog.isNumber.call(null, a)
};
cljs.core.fn_QMARK_ = function(a) {
  return goog.isFunction.call(null, a)
};
cljs.core.ifn_QMARK_ = function(a) {
  var b = cljs.core.fn_QMARK_.call(null, a);
  return b ? b : cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$IFn$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IFn$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IFn, a)
};
cljs.core.integer_QMARK_ = function(a) {
  var b = cljs.core.number_QMARK_.call(null, a);
  return b ? a == a.toFixed() : b
};
cljs.core.contains_QMARK_ = function(a, b) {
  return cljs.core._lookup.call(null, a, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? !1 : !0
};
cljs.core.find = function(a, b) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var c = cljs.core.associative_QMARK_.call(null, a);
      return c ? cljs.core.contains_QMARK_.call(null, a, b) : c
    }
    return a
  }()) ? cljs.core.PersistentVector.fromArray([b, cljs.core._lookup.call(null, a, b)]) : null
};
cljs.core.distinct_QMARK_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core.not.call(null, cljs.core._EQ_.call(null, a, b))
  }, c = function() {
    var a = function(a, b, c) {
      if(cljs.core.not.call(null, cljs.core._EQ_.call(null, a, b))) {
        a = cljs.core.set([b, a]);
        for(b = c;;) {
          var d = cljs.core.first.call(null, b), c = cljs.core.next.call(null, b);
          if(cljs.core.truth_(b)) {
            if(cljs.core.contains_QMARK_.call(null, a, d)) {
              return!1
            }
            a = cljs.core.conj.call(null, a, d);
            b = c
          }else {
            return!0
          }
        }
      }else {
        return!1
      }
    }, b = function(b, c, e) {
      var i = null;
      goog.isDef(e) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, i)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), e = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return a.call(this, c, e, b)
    };
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function() {
    return!0
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.compare = function(a, b) {
  if(cljs.core.type.call(null, a) === cljs.core.type.call(null, b)) {
    return goog.array.defaultCompare.call(null, a, b)
  }
  if(null === a) {
    return-1
  }
  if(null === b) {
    return 1
  }
  throw Error("compare on non-nil objects of different types");
};
cljs.core.fn__GT_comparator = function(a) {
  return cljs.core._EQ_.call(null, a, cljs.core.compare) ? cljs.core.compare : function(b, c) {
    var d = a.call(null, b, c);
    return cljs.core.number_QMARK_.call(null, d) ? d : cljs.core.truth_(d) ? -1 : cljs.core.truth_(a.call(null, c, b)) ? 1 : 0
  }
};
void 0;
cljs.core.sort = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.compare, b)
  }, c = function(a, b) {
    if(cljs.core.truth_(cljs.core.seq.call(null, b))) {
      var c = cljs.core.to_array.call(null, b);
      goog.array.stableSort.call(null, c, cljs.core.fn__GT_comparator.call(null, a));
      return cljs.core.seq.call(null, c)
    }
    return cljs.core.List.EMPTY
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.sort_by = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, cljs.core.compare, c)
  }, c = function(a, b, c) {
    return cljs.core.sort.call(null, function(c, f) {
      return cljs.core.fn__GT_comparator.call(null, b).call(null, a.call(null, c), a.call(null, f))
    }, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.reduce = function() {
  var a = null, b = function(a, b) {
    return cljs.core._reduce.call(null, b, a)
  }, c = function(a, b, c) {
    return cljs.core._reduce.call(null, c, a, b)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.seq_reduce = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core.seq.call(null, b);
    return cljs.core.truth_(c) ? cljs.core.reduce.call(null, a, cljs.core.first.call(null, c), cljs.core.next.call(null, c)) : a.call(null)
  }, c = function(a, b, c) {
    for(c = cljs.core.seq.call(null, c);;) {
      if(cljs.core.truth_(c)) {
        b = a.call(null, b, cljs.core.first.call(null, c)), c = cljs.core.next.call(null, c)
      }else {
        return b
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.IReduce._ = !0;
cljs.core._reduce._ = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.seq_reduce.call(null, b, a);
      case 3:
        return cljs.core.seq_reduce.call(null, b, c, a)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core._PLUS_ = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, b + c, g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, c + f, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$lang$arity$0 = function() {
    return 0
  };
  a.cljs$lang$arity$1 = function(a) {
    return a
  };
  a.cljs$lang$arity$2 = function(a, b) {
    return a + b
  };
  a.cljs$lang$arity$3 = b;
  return a
}();
cljs.core._ = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, b - c, g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, c - f, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function(a) {
    return-a
  };
  a.cljs$lang$arity$2 = function(a, b) {
    return a - b
  };
  a.cljs$lang$arity$3 = b;
  return a
}();
cljs.core._STAR_ = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, b * c, g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, c * f, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$lang$arity$0 = function() {
    return 1
  };
  a.cljs$lang$arity$1 = function(a) {
    return a
  };
  a.cljs$lang$arity$2 = function(a, b) {
    return a * b
  };
  a.cljs$lang$arity$3 = b;
  return a
}();
cljs.core._SLASH_ = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b)
  }, c = function() {
    var b = function(b, c, d) {
      var h = null;
      goog.isDef(d) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, a.call(null, b, c), h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, a.call(null, c, d), b)
    };
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return a / e;
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = function(a, b) {
    return a / b
  };
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core._LT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a < b) {
          if(cljs.core.truth_(cljs.core.next.call(null, c))) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b < cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return a.call(this, d, g, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a < d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function() {
    return!0
  };
  a.cljs$lang$arity$2 = function(a, b) {
    return a < b
  };
  a.cljs$lang$arity$3 = b;
  return a
}();
cljs.core._LT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a <= b) {
          if(cljs.core.truth_(cljs.core.next.call(null, c))) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b <= cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return a.call(this, d, g, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a <= d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function() {
    return!0
  };
  a.cljs$lang$arity$2 = function(a, b) {
    return a <= b
  };
  a.cljs$lang$arity$3 = b;
  return a
}();
cljs.core._GT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a > b) {
          if(cljs.core.truth_(cljs.core.next.call(null, c))) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b > cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return a.call(this, d, g, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a > d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function() {
    return!0
  };
  a.cljs$lang$arity$2 = function(a, b) {
    return a > b
  };
  a.cljs$lang$arity$3 = b;
  return a
}();
cljs.core._GT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a >= b) {
          if(cljs.core.truth_(cljs.core.next.call(null, c))) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
          }else {
            return b >= cljs.core.first.call(null, c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return a.call(this, d, g, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a >= d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function() {
    return!0
  };
  a.cljs$lang$arity$2 = function(a, b) {
    return a >= b
  };
  a.cljs$lang$arity$3 = b;
  return a
}();
cljs.core.dec = function(a) {
  return a - 1
};
cljs.core.max = function() {
  var a = null, b = function(a, b) {
    return a > b ? a : b
  }, c = function() {
    var b = function(b, c, d) {
      var h = null;
      goog.isDef(d) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, b > c ? b : c, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, c > d ? c : d, b)
    };
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function(a) {
    return a
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.min = function() {
  var a = null, b = function(a, b) {
    return a < b ? a : b
  }, c = function() {
    var b = function(b, c, d) {
      var h = null;
      goog.isDef(d) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, b < c ? b : c, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, c < d ? c : d, b)
    };
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function(a) {
    return a
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.fix = function(a) {
  return 0 <= a ? Math.floor.call(null, a) : Math.ceil.call(null, a)
};
cljs.core.int$ = function(a) {
  return cljs.core.fix.call(null, a)
};
cljs.core.long$ = function(a) {
  return cljs.core.fix.call(null, a)
};
cljs.core.mod = function(a, b) {
  return a % b
};
cljs.core.quot = function(a, b) {
  return cljs.core.fix.call(null, (a - a % b) / b)
};
cljs.core.rem = function(a, b) {
  var c = cljs.core.quot.call(null, a, b);
  return a - b * c
};
cljs.core.rand = function() {
  var a = null, b = function() {
    return Math.random.call(null)
  }, c = function(b) {
    return b * a.call(null)
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$0 = b;
  a.cljs$lang$arity$1 = c;
  return a
}();
cljs.core.rand_int = function(a) {
  return cljs.core.fix.call(null, cljs.core.rand.call(null, a))
};
cljs.core.bit_xor = function(a, b) {
  return a ^ b
};
cljs.core.bit_and = function(a, b) {
  return a & b
};
cljs.core.bit_or = function(a, b) {
  return a | b
};
cljs.core.bit_and_not = function(a, b) {
  return a & ~b
};
cljs.core.bit_clear = function(a, b) {
  return a & ~(1 << b)
};
cljs.core.bit_flip = function(a, b) {
  return a ^ 1 << b
};
cljs.core.bit_not = function(a) {
  return~a
};
cljs.core.bit_set = function(a, b) {
  return a | 1 << b
};
cljs.core.bit_test = function(a, b) {
  return 0 != (a & 1 << b)
};
cljs.core.bit_shift_left = function(a, b) {
  return a << b
};
cljs.core.bit_shift_right = function(a, b) {
  return a >> b
};
cljs.core.bit_shift_right_zero_fill = function(a, b) {
  return a >>> b
};
cljs.core.bit_count = function(a) {
  for(var b = 0;;) {
    if(0 === a) {
      return b
    }
    a &= a - 1;
    b += 1
  }
};
cljs.core._EQ__EQ_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core._equiv.call(null, a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.call(null, b, c))) {
          if(cljs.core.truth_(cljs.core.next.call(null, d))) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
          }else {
            return a.call(null, c, cljs.core.first.call(null, d))
          }
        }else {
          return!1
        }
      }
    }, c = function(a, c, e) {
      var i = null;
      goog.isDef(e) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, i)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), e = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, c, e, a)
    };
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = function() {
    return!0
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.pos_QMARK_ = function(a) {
  return 0 < a
};
cljs.core.zero_QMARK_ = function(a) {
  return 0 === a
};
cljs.core.neg_QMARK_ = function(a) {
  return 0 > a
};
cljs.core.nthnext = function(a, b) {
  for(var c = b, d = cljs.core.seq.call(null, a);;) {
    if(cljs.core.truth_(function() {
      var a = d;
      return cljs.core.truth_(a) ? 0 < c : a
    }())) {
      var e = c - 1, f = cljs.core.next.call(null, d), c = e, d = f
    }else {
      return d
    }
  }
};
cljs.core.IIndexed._ = !0;
cljs.core._nth._ = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        var d;
        d = cljs.core.nthnext.call(null, a, b);
        if(cljs.core.truth_(d)) {
          d = cljs.core.first.call(null, d)
        }else {
          throw Error("Index out of bounds");
        }
        return d;
      case 3:
        return d = cljs.core.nthnext.call(null, a, b), d = cljs.core.truth_(d) ? cljs.core.first.call(null, d) : c, d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.str_STAR_ = function() {
  var a = null, b = function(a) {
    return null === a ? "" : a.toString()
  }, c = function() {
    var b = function(b, c) {
      return function(b, c) {
        for(;;) {
          if(cljs.core.truth_(c)) {
            var d = b.append(a.call(null, cljs.core.first.call(null, c))), e = cljs.core.next.call(null, c), b = d, c = e
          }else {
            return a.call(null, b)
          }
        }
      }.call(null, new goog.string.StringBuffer(a.call(null, b)), c)
    }, c = function(a, c) {
      var e = null;
      goog.isDef(c) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e)
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), a = cljs.core.rest(a);
      return b.call(this, c, a)
    };
    return c
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return b.call(this, a);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$0 = function() {
    return""
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.str = function() {
  var a = null, b = function(a) {
    return cljs.core.symbol_QMARK_.call(null, a) ? a.substring(2, a.length) : cljs.core.keyword_QMARK_.call(null, a) ? cljs.core.str_STAR_.call(null, ":", a.substring(2, a.length)) : null === a ? "" : a.toString()
  }, c = function() {
    var b = function(b, c) {
      return function(b, c) {
        for(;;) {
          if(cljs.core.truth_(c)) {
            var d = b.append(a.call(null, cljs.core.first.call(null, c))), e = cljs.core.next.call(null, c), b = d, c = e
          }else {
            return cljs.core.str_STAR_.call(null, b)
          }
        }
      }.call(null, new goog.string.StringBuffer(a.call(null, b)), c)
    }, c = function(a, c) {
      var e = null;
      goog.isDef(c) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e)
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), a = cljs.core.rest(a);
      return b.call(this, c, a)
    };
    return c
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return b.call(this, a);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$0 = function() {
    return""
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.subs = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return a.substring(c);
      case 3:
        return a.substring(c, d)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = function(a, c) {
    return a.substring(c)
  };
  a.cljs$lang$arity$3 = function(a, c, d) {
    return a.substring(c, d)
  };
  return a
}();
cljs.core.symbol = function() {
  var a = null, b = function(a) {
    cljs.core.symbol_QMARK_.call(null, a) ? a : cljs.core.keyword_QMARK_.call(null, a) && cljs.core.str_STAR_.call(null, "\ufdd1", "'", cljs.core.subs.call(null, a, 2));
    return cljs.core.str_STAR_.call(null, "\ufdd1", "'", a)
  }, c = function(b, c) {
    return a.call(null, cljs.core.str_STAR_.call(null, b, "/", c))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.keyword = function() {
  var a = null, b = function(a) {
    return cljs.core.keyword_QMARK_.call(null, a) ? a : cljs.core.symbol_QMARK_.call(null, a) ? cljs.core.str_STAR_.call(null, "\ufdd0", "'", cljs.core.subs.call(null, a, 2)) : cljs.core.str_STAR_.call(null, "\ufdd0", "'", a)
  }, c = function(b, c) {
    return a.call(null, cljs.core.str_STAR_.call(null, b, "/", c))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.equiv_sequential = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.sequential_QMARK_.call(null, b) ? function() {
    for(var c = cljs.core.seq.call(null, a), d = cljs.core.seq.call(null, b);;) {
      if(null === c) {
        return null === d
      }
      if(null !== d && cljs.core._EQ_.call(null, cljs.core.first.call(null, c), cljs.core.first.call(null, d))) {
        c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d)
      }else {
        return!1
      }
    }
  }() : null)
};
cljs.core.hash_combine = function(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2)
};
cljs.core.hash_coll = function(a) {
  return cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.hash_combine.call(null, a, cljs.core.hash.call(null, c))
  }, cljs.core.hash.call(null, cljs.core.first.call(null, a)), cljs.core.next.call(null, a))
};
void 0;
void 0;
cljs.core.hash_imap = function(a) {
  for(var b = 0, a = cljs.core.seq.call(null, a);;) {
    if(cljs.core.truth_(a)) {
      var c = cljs.core.first.call(null, a), b = (b + (cljs.core.hash.call(null, cljs.core.key.call(null, c)) ^ cljs.core.hash.call(null, cljs.core.val.call(null, c)))) % 4503599627370496, a = cljs.core.next.call(null, a)
    }else {
      return b
    }
  }
};
cljs.core.hash_iset = function(a) {
  for(var b = 0, a = cljs.core.seq.call(null, a);;) {
    if(cljs.core.truth_(a)) {
      var c = cljs.core.first.call(null, a), b = (b + cljs.core.hash.call(null, c)) % 4503599627370496, a = cljs.core.next.call(null, a)
    }else {
      return b
    }
  }
};
void 0;
cljs.core.extend_object_BANG_ = function(a, b) {
  var c = cljs.core.seq.call(null, b);
  if(cljs.core.truth_(c)) {
    var d = cljs.core.first.call(null, c);
    cljs.core.nth.call(null, d, 0, null);
    for(cljs.core.nth.call(null, d, 1, null);;) {
      var e = d, d = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), d = cljs.core.name.call(null, d);
      a[d] = e;
      c = cljs.core.next.call(null, c);
      if(cljs.core.truth_(c)) {
        d = c, c = cljs.core.first.call(null, d), e = d, d = c, c = e
      }else {
        break
      }
    }
  }
  return a
};
cljs.core.List = function(a, b, c, d) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.count = d
};
cljs.core.List.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.List")
};
cljs.core.List.prototype.cljs$core$IHash$ = !0;
cljs.core.List.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.List.prototype.cljs$core$ISequential$ = !0;
cljs.core.List.prototype.cljs$core$ICollection$ = !0;
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, a, this.count + 1)
};
cljs.core.List.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.List.prototype.cljs$core$ISeqable$ = !0;
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.List.prototype.cljs$core$ICounted$ = !0;
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.count
};
cljs.core.List.prototype.cljs$core$IStack$ = !0;
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return this.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core._rest.call(null, a)
};
cljs.core.List.prototype.cljs$core$ISeq$ = !0;
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return this.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return this.rest
};
cljs.core.List.prototype.cljs$core$IEquiv$ = !0;
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.List.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.List(b, this.first, this.rest, this.count)
};
cljs.core.List.prototype.cljs$core$IMeta$ = !0;
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.List.EMPTY
};
cljs.core.List.prototype.cljs$core$IList$ = !0;
cljs.core.List;
cljs.core.EmptyList = function(a) {
  this.meta = a
};
cljs.core.EmptyList.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.EmptyList")
};
cljs.core.EmptyList.prototype.cljs$core$IHash$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.EmptyList.prototype.cljs$core$ISequential$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ICollection$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, null, 1)
};
cljs.core.EmptyList.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.EmptyList(b)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return a
};
cljs.core.EmptyList.prototype.cljs$core$IList$ = !0;
cljs.core.EmptyList;
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reversible_QMARK_ = function(a) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$IReversible$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IReversible$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IReversible, a)
};
cljs.core.rseq = function(a) {
  return cljs.core._rseq.call(null, a)
};
cljs.core.reverse = function(a) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a)
};
cljs.core.list = function() {
  var a = function(a) {
    return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, cljs.core.reverse.call(null, a))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.Cons = function(a, b, c) {
  this.meta = a;
  this.first = b;
  this.rest = c
};
cljs.core.Cons.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Cons")
};
cljs.core.Cons.prototype.cljs$core$IHash$ = !0;
cljs.core.Cons.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Cons.prototype.cljs$core$ISequential$ = !0;
cljs.core.Cons.prototype.cljs$core$ICollection$ = !0;
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.Cons(null, b, a)
};
cljs.core.Cons.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.Cons.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.Cons.prototype.cljs$core$ISeq$ = !0;
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return this.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return null === this.rest ? cljs.core.List.EMPTY : this.rest
};
cljs.core.Cons.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Cons(b, this.first, this.rest)
};
cljs.core.Cons.prototype.cljs$core$IMeta$ = !0;
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.Cons.prototype.cljs$core$IList$ = !0;
cljs.core.Cons;
cljs.core.cons = function(a, b) {
  return new cljs.core.Cons(null, a, b)
};
cljs.core.list_QMARK_ = function(a) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var b = a.cljs$core$IList$;
      return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IList$")) : b
    }
    return a
  }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IList, a)
};
cljs.core.IReduce.string = !0;
cljs.core._reduce.string = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, b);
      case 3:
        return cljs.core.ci_reduce.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ILookup.string = !0;
cljs.core._lookup.string = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._nth.call(null, a, b);
      case 3:
        return cljs.core._nth.call(null, a, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IIndexed.string = !0;
cljs.core._nth.string = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return b < cljs.core._count.call(null, a) ? a.charAt(b) : null;
      case 3:
        return b < cljs.core._count.call(null, a) ? a.charAt(b) : c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ICounted.string = !0;
cljs.core._count.string = function(a) {
  return a.length
};
cljs.core.ISeqable.string = !0;
cljs.core._seq.string = function(a) {
  return cljs.core.prim_seq.call(null, a, 0)
};
cljs.core.IHash.string = !0;
cljs.core._hash.string = function(a) {
  return goog.string.hashCode.call(null, a)
};
String.prototype.cljs$core$IFn$ = !0;
String.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core.get.call(null, b, this.toString());
      case 3:
        return cljs.core.get.call(null, b, this.toString(), c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
String.prototype.apply = function(a, b) {
  return 2 > cljs.core.count.call(null, b) ? cljs.core.get.call(null, b[0], a) : cljs.core.get.call(null, b[0], a, b[1])
};
cljs.core.lazy_seq_value = function(a) {
  var b = a.x;
  if(cljs.core.truth_(a.realized)) {
    return b
  }
  a.x = b.call(null);
  a.realized = !0;
  return a.x
};
cljs.core.LazySeq = function(a, b, c) {
  this.meta = a;
  this.realized = b;
  this.x = c
};
cljs.core.LazySeq.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.LazySeq")
};
cljs.core.LazySeq.prototype.cljs$core$IHash$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.LazySeq.prototype.cljs$core$ISequential$ = !0;
cljs.core.LazySeq.prototype.cljs$core$ICollection$ = !0;
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.LazySeq.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$ = !0;
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.seq.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$ = !0;
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.rest.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.LazySeq(b, this.realized, this.x)
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.LazySeq;
cljs.core.to_array = function(a) {
  for(var b = [];;) {
    if(cljs.core.truth_(cljs.core.seq.call(null, a))) {
      b.push(cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a)
    }else {
      return b
    }
  }
};
cljs.core.to_array_2d = function(a) {
  for(var b = cljs.core.make_array.call(null, cljs.core.count.call(null, a)), c = 0, a = cljs.core.seq.call(null, a);;) {
    if(cljs.core.truth_(a)) {
      b[c] = cljs.core.to_array.call(null, cljs.core.first.call(null, a)), c += 1, a = cljs.core.next.call(null, a)
    }else {
      break
    }
  }
  return b
};
cljs.core.long_array = function() {
  var a = null, b = function(b) {
    if(cljs.core.number_QMARK_.call(null, b)) {
      return a.call(null, b, null)
    }
    if(cljs.core.seq_QMARK_.call(null, b)) {
      return cljs.core.into_array.call(null, b)
    }
    throw Error("long-array called with something other than size or ISeq");
  }, c = function(a, b) {
    var c = cljs.core.make_array.call(null, a);
    if(cljs.core.seq_QMARK_.call(null, b)) {
      for(var g = 0, h = cljs.core.seq.call(null, b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return cljs.core.truth_(b) ? g < a : b
        }())) {
          c[g] = cljs.core.first.call(null, h);
          var i = g + 1, j = cljs.core.next.call(null, h), g = i, h = j
        }else {
          return c
        }
      }
    }else {
      for(i = 0;;) {
        if(i < a) {
          c[i] = b, i += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.double_array = function() {
  var a = null, b = function(b) {
    if(cljs.core.number_QMARK_.call(null, b)) {
      return a.call(null, b, null)
    }
    if(cljs.core.seq_QMARK_.call(null, b)) {
      return cljs.core.into_array.call(null, b)
    }
    throw Error("double-array called with something other than size or ISeq");
  }, c = function(a, b) {
    var c = cljs.core.make_array.call(null, a);
    if(cljs.core.seq_QMARK_.call(null, b)) {
      for(var g = 0, h = cljs.core.seq.call(null, b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return cljs.core.truth_(b) ? g < a : b
        }())) {
          c[g] = cljs.core.first.call(null, h);
          var i = g + 1, j = cljs.core.next.call(null, h), g = i, h = j
        }else {
          return c
        }
      }
    }else {
      for(i = 0;;) {
        if(i < a) {
          c[i] = b, i += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.object_array = function() {
  var a = null, b = function(b) {
    if(cljs.core.number_QMARK_.call(null, b)) {
      return a.call(null, b, null)
    }
    if(cljs.core.seq_QMARK_.call(null, b)) {
      return cljs.core.into_array.call(null, b)
    }
    throw Error("object-array called with something other than size or ISeq");
  }, c = function(a, b) {
    var c = cljs.core.make_array.call(null, a);
    if(cljs.core.seq_QMARK_.call(null, b)) {
      for(var g = 0, h = cljs.core.seq.call(null, b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return cljs.core.truth_(b) ? g < a : b
        }())) {
          c[g] = cljs.core.first.call(null, h);
          var i = g + 1, j = cljs.core.next.call(null, h), g = i, h = j
        }else {
          return c
        }
      }
    }else {
      for(i = 0;;) {
        if(i < a) {
          c[i] = b, i += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.bounded_count = function(a, b) {
  for(var c = a, d = b, e = 0;;) {
    if(cljs.core.truth_(function() {
      var a = 0 < d;
      return a ? cljs.core.seq.call(null, c) : a
    }())) {
      var f = cljs.core.next.call(null, c), g = d - 1, e = e + 1, c = f, d = g
    }else {
      return e
    }
  }
};
cljs.core.spread = function spread(b) {
  return null === b ? null : null === cljs.core.next.call(null, b) ? cljs.core.seq.call(null, cljs.core.first.call(null, b)) : cljs.core.cons.call(null, cljs.core.first.call(null, b), spread.call(null, cljs.core.next.call(null, b)))
};
cljs.core.concat = function() {
  var a = null, b = function() {
    return new cljs.core.LazySeq(null, !1, function() {
      return null
    })
  }, c = function(a) {
    return new cljs.core.LazySeq(null, !1, function() {
      return a
    })
  }, d = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var d = cljs.core.seq.call(null, b);
      return cljs.core.truth_(d) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), a.call(null, cljs.core.rest.call(null, d), c)) : c
    })
  }, e = function() {
    var b = function(b, c, d) {
      return function l(a, b) {
        return new cljs.core.LazySeq(null, !1, function() {
          var c = cljs.core.seq.call(null, a);
          return cljs.core.truth_(c) ? cljs.core.cons.call(null, cljs.core.first.call(null, c), l.call(null, cljs.core.rest.call(null, c), b)) : cljs.core.truth_(b) ? l.call(null, cljs.core.first.call(null, b), cljs.core.next.call(null, b)) : null
        })
      }.call(null, a.call(null, b, c), d)
    }, c = function(a, c, d) {
      var e = null;
      goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, e)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, c, d, a)
    };
    return c
  }(), a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$lang$arity$0 = b;
  a.cljs$lang$arity$1 = c;
  a.cljs$lang$arity$2 = d;
  a.cljs$lang$arity$3 = e;
  return a
}();
cljs.core.list_STAR_ = function() {
  var a = null, b = function(a) {
    return cljs.core.seq.call(null, a)
  }, c = function(a, b) {
    return cljs.core.cons.call(null, a, b)
  }, d = function(a, b, c) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, c))
  }, e = function(a, b, c, d) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, d)))
  }, f = function() {
    var a = function(a, b, c, d, e) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, e)))))
    }, b = function(b, c, d, e, f) {
      var h = null;
      goog.isDef(f) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, h)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), f = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(b)))), b = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(b))));
      return a.call(this, c, d, e, f, b)
    };
    return b
  }(), a = function(a, h, i, j, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, h);
      case 3:
        return d.call(this, a, h, i);
      case 4:
        return e.call(this, a, h, i, j);
      default:
        return f.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  a.cljs$lang$arity$3 = d;
  a.cljs$lang$arity$4 = e;
  a.cljs$lang$arity$5 = f;
  return a
}();
cljs.core.apply = function() {
  var a = null, b = function(a, b) {
    var c = a.cljs$lang$maxFixedArity;
    return cljs.core.truth_(a.cljs$lang$applyTo) ? cljs.core.bounded_count.call(null, b, c + 1) <= c ? a.apply(a, cljs.core.to_array.call(null, b)) : a.cljs$lang$applyTo(b) : a.apply(a, cljs.core.to_array.call(null, b))
  }, c = function(a, b, c) {
    b = cljs.core.list_STAR_.call(null, b, c);
    c = a.cljs$lang$maxFixedArity;
    return cljs.core.truth_(a.cljs$lang$applyTo) ? cljs.core.bounded_count.call(null, b, c) <= c ? a.apply(a, cljs.core.to_array.call(null, b)) : a.cljs$lang$applyTo(b) : a.apply(a, cljs.core.to_array.call(null, b))
  }, d = function(a, b, c, d) {
    b = cljs.core.list_STAR_.call(null, b, c, d);
    c = a.cljs$lang$maxFixedArity;
    return cljs.core.truth_(a.cljs$lang$applyTo) ? cljs.core.bounded_count.call(null, b, c) <= c ? a.apply(a, cljs.core.to_array.call(null, b)) : a.cljs$lang$applyTo(b) : a.apply(a, cljs.core.to_array.call(null, b))
  }, e = function(a, b, c, d, e) {
    b = cljs.core.list_STAR_.call(null, b, c, d, e);
    c = a.cljs$lang$maxFixedArity;
    return cljs.core.truth_(a.cljs$lang$applyTo) ? cljs.core.bounded_count.call(null, b, c) <= c ? a.apply(a, cljs.core.to_array.call(null, b)) : a.cljs$lang$applyTo(b) : a.apply(a, cljs.core.to_array.call(null, b))
  }, f = function() {
    var a = function(a, b, c, d, e, f) {
      b = cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.cons.call(null, e, cljs.core.spread.call(null, f)))));
      c = a.cljs$lang$maxFixedArity;
      return cljs.core.truth_(a.cljs$lang$applyTo) ? cljs.core.bounded_count.call(null, b, c) <= c ? a.apply(a, cljs.core.to_array.call(null, b)) : a.cljs$lang$applyTo(b) : a.apply(a, cljs.core.to_array.call(null, b))
    }, b = function(b, c, d, e, f, h) {
      var o = null;
      goog.isDef(h) && (o = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return a.call(this, b, c, d, e, f, o)
    };
    b.cljs$lang$maxFixedArity = 5;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), f = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(b)))), h = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(b))))), b = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(b)))));
      return a.call(this, c, d, e, f, h, b)
    };
    return b
  }(), a = function(a, h, i, j, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, h);
      case 3:
        return c.call(this, a, h, i);
      case 4:
        return d.call(this, a, h, i, j);
      case 5:
        return e.call(this, a, h, i, j, k);
      default:
        return f.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  a.cljs$lang$arity$4 = d;
  a.cljs$lang$arity$5 = e;
  a.cljs$lang$arity$6 = f;
  return a
}();
cljs.core.vary_meta = function() {
  var a = function(a, b, e) {
    return cljs.core.with_meta.call(null, a, cljs.core.apply.call(null, b, cljs.core.meta.call(null, a), e))
  }, b = function(b, d, e) {
    var f = null;
    goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), e = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
    return a.call(this, d, e, b)
  };
  return b
}();
cljs.core.not_EQ_ = function() {
  var a = null, b = function() {
    return!1
  }, c = function(a, b) {
    return cljs.core.not.call(null, cljs.core._EQ_.call(null, a, b))
  }, d = function() {
    var a = function(a, b, c) {
      var d = null;
      goog.isDef(c) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, a, b, d))
    };
    a.cljs$lang$maxFixedArity = 2;
    a.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, b, c, a))
    };
    return a
  }(), a = function(a, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      default:
        return d.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  a.cljs$lang$arity$3 = d;
  return a
}();
cljs.core.not_empty = function(a) {
  return cljs.core.truth_(cljs.core.seq.call(null, a)) ? a : null
};
cljs.core.every_QMARK_ = function(a, b) {
  for(;;) {
    if(null === cljs.core.seq.call(null, b)) {
      return!0
    }
    if(cljs.core.truth_(a.call(null, cljs.core.first.call(null, b)))) {
      var c = a, d = cljs.core.next.call(null, b), a = c, b = d
    }else {
      return!1
    }
  }
};
cljs.core.not_every_QMARK_ = function(a, b) {
  return cljs.core.not.call(null, cljs.core.every_QMARK_.call(null, a, b))
};
cljs.core.some = function(a, b) {
  for(;;) {
    if(cljs.core.truth_(cljs.core.seq.call(null, b))) {
      var c = a.call(null, cljs.core.first.call(null, b));
      if(cljs.core.truth_(c)) {
        return c
      }
      var c = a, d = cljs.core.next.call(null, b), a = c, b = d
    }else {
      return null
    }
  }
};
cljs.core.not_any_QMARK_ = function(a, b) {
  return cljs.core.not.call(null, cljs.core.some.call(null, a, b))
};
cljs.core.even_QMARK_ = function(a) {
  if(cljs.core.integer_QMARK_.call(null, a)) {
    return 0 === (a & 1)
  }
  throw Error(cljs.core.str.call(null, "Argument must be an integer: ", a));
};
cljs.core.odd_QMARK_ = function(a) {
  return cljs.core.not.call(null, cljs.core.even_QMARK_.call(null, a))
};
cljs.core.identity = function(a) {
  return a
};
cljs.core.complement = function(a) {
  return function() {
    var b = null, c = function() {
      var b = function(b, c, d) {
        var h = null;
        goog.isDef(d) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return cljs.core.not.call(null, cljs.core.apply.call(null, a, b, c, h))
      };
      b.cljs$lang$maxFixedArity = 2;
      b.cljs$lang$applyTo = function(b) {
        var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
        return cljs.core.not.call(null, cljs.core.apply.call(null, a, c, d, b))
      };
      return b
    }(), b = function(b, e, f) {
      switch(arguments.length) {
        case 0:
          return cljs.core.not.call(null, a.call(null));
        case 1:
          return cljs.core.not.call(null, a.call(null, b));
        case 2:
          return cljs.core.not.call(null, a.call(null, b, e));
        default:
          return c.apply(this, arguments)
      }
      throw"Invalid arity: " + arguments.length;
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = c.cljs$lang$applyTo;
    return b
  }()
};
cljs.core.constantly = function(a) {
  return function() {
    var b = function(b) {
      goog.isDef(b) && cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      return a
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      cljs.core.seq(b);
      return a
    };
    return b
  }()
};
cljs.core.comp = function() {
  var a = null, b = function() {
    return cljs.core.identity
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, e, h) {
          var i = null;
          goog.isDef(h) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return a.call(null, cljs.core.apply.call(null, b, c, d, e, i))
        };
        c.cljs$lang$maxFixedArity = 3;
        c.cljs$lang$applyTo = function(c) {
          var d = cljs.core.first(c), e = cljs.core.first(cljs.core.next(c)), h = cljs.core.first(cljs.core.next(cljs.core.next(c))), c = cljs.core.rest(cljs.core.next(cljs.core.next(c)));
          return a.call(null, cljs.core.apply.call(null, b, d, e, h, c))
        };
        return c
      }(), c = function(c, e, h, m) {
        switch(arguments.length) {
          case 0:
            return a.call(null, b.call(null));
          case 1:
            return a.call(null, b.call(null, c));
          case 2:
            return a.call(null, b.call(null, c, e));
          case 3:
            return a.call(null, b.call(null, c, e, h));
          default:
            return d.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        var d = function(d, e, i, j) {
          var k = null;
          goog.isDef(j) && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return a.call(null, b.call(null, cljs.core.apply.call(null, c, d, e, i, k)))
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(d) {
          var e = cljs.core.first(d), i = cljs.core.first(cljs.core.next(d)), j = cljs.core.first(cljs.core.next(cljs.core.next(d))), d = cljs.core.rest(cljs.core.next(cljs.core.next(d)));
          return a.call(null, b.call(null, cljs.core.apply.call(null, c, e, i, j, d)))
        };
        return d
      }(), d = function(d, i, m, n) {
        switch(arguments.length) {
          case 0:
            return a.call(null, b.call(null, c.call(null)));
          case 1:
            return a.call(null, b.call(null, c.call(null, d)));
          case 2:
            return a.call(null, b.call(null, c.call(null, d, i)));
          case 3:
            return a.call(null, b.call(null, c.call(null, d, i, m)));
          default:
            return e.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, a, b, c, d));
      return function() {
        var a = function(a) {
          for(var a = cljs.core.apply.call(null, cljs.core.first.call(null, e), a), b = cljs.core.next.call(null, e);;) {
            if(cljs.core.truth_(b)) {
              a = cljs.core.first.call(null, b).call(null, a), b = cljs.core.next.call(null, b)
            }else {
              return a
            }
          }
        }, b = function(b) {
          var c = null;
          goog.isDef(b) && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return a.call(this, c)
        };
        b.cljs$lang$maxFixedArity = 0;
        b.cljs$lang$applyTo = function(b) {
          b = cljs.core.seq(b);
          return a.call(this, b)
        };
        return b
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, e, b)
    };
    return b
  }(), a = function(a, g, h, i) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a;
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$lang$arity$0 = b;
  a.cljs$lang$arity$1 = function(a) {
    return a
  };
  a.cljs$lang$arity$2 = c;
  a.cljs$lang$arity$3 = d;
  a.cljs$lang$arity$4 = e;
  return a
}();
cljs.core.partial = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = function(c) {
        var d = null;
        goog.isDef(c) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return cljs.core.apply.call(null, a, b, d)
      };
      c.cljs$lang$maxFixedArity = 0;
      c.cljs$lang$applyTo = function(c) {
        c = cljs.core.seq(c);
        return cljs.core.apply.call(null, a, b, c)
      };
      return c
    }()
  }, c = function(a, b, c) {
    return function() {
      var d = function(d) {
        var e = null;
        goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return cljs.core.apply.call(null, a, b, c, e)
      };
      d.cljs$lang$maxFixedArity = 0;
      d.cljs$lang$applyTo = function(d) {
        d = cljs.core.seq(d);
        return cljs.core.apply.call(null, a, b, c, d)
      };
      return d
    }()
  }, d = function(a, b, c, d) {
    return function() {
      var e = function(e) {
        var j = null;
        goog.isDef(e) && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return cljs.core.apply.call(null, a, b, c, d, j)
      };
      e.cljs$lang$maxFixedArity = 0;
      e.cljs$lang$applyTo = function(e) {
        e = cljs.core.seq(e);
        return cljs.core.apply.call(null, a, b, c, d, e)
      };
      return e
    }()
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return function() {
        var f = function(f) {
          return cljs.core.apply.call(null, a, b, c, d, cljs.core.concat.call(null, e, f))
        }, g = function(a) {
          var b = null;
          goog.isDef(a) && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return f.call(this, b)
        };
        g.cljs$lang$maxFixedArity = 0;
        g.cljs$lang$applyTo = function(a) {
          a = cljs.core.seq(a);
          return f.call(this, a)
        };
        return g
      }()
    }, b = function(b, c, d, e, g) {
      var m = null;
      goog.isDef(g) && (m = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, m)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), g = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(b)))), b = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(b))));
      return a.call(this, c, d, e, g, b)
    };
    return b
  }(), a = function(a, g, h, i, j) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, i);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  a.cljs$lang$arity$4 = d;
  a.cljs$lang$arity$5 = e;
  return a
}();
cljs.core.fnil = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, g, h) {
          var i = null;
          goog.isDef(h) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return cljs.core.apply.call(null, a, null === c ? b : c, d, g, i)
        };
        c.cljs$lang$maxFixedArity = 3;
        c.cljs$lang$applyTo = function(c) {
          var d = cljs.core.first(c), g = cljs.core.first(cljs.core.next(c)), h = cljs.core.first(cljs.core.next(cljs.core.next(c))), c = cljs.core.rest(cljs.core.next(cljs.core.next(c)));
          return cljs.core.apply.call(null, a, null === d ? b : d, g, h, c)
        };
        return c
      }(), c = function(c, g, k, l) {
        switch(arguments.length) {
          case 1:
            return a.call(null, null === c ? b : c);
          case 2:
            return a.call(null, null === c ? b : c, g);
          case 3:
            return a.call(null, null === c ? b : c, g, k);
          default:
            return d.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, c = function(a, b, c) {
    return function() {
      var d = null, i = function() {
        var d = function(d, h, i, n) {
          var j = null;
          goog.isDef(n) && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return cljs.core.apply.call(null, a, null === d ? b : d, null === h ? c : h, i, j)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(d) {
          var h = cljs.core.first(d), i = cljs.core.first(cljs.core.next(d)), n = cljs.core.first(cljs.core.next(cljs.core.next(d))), d = cljs.core.rest(cljs.core.next(cljs.core.next(d)));
          return cljs.core.apply.call(null, a, null === h ? b : h, null === i ? c : i, n, d)
        };
        return d
      }(), d = function(d, h, l, m) {
        switch(arguments.length) {
          case 2:
            return a.call(null, null === d ? b : d, null === h ? c : h);
          case 3:
            return a.call(null, null === d ? b : d, null === h ? c : h, l);
          default:
            return i.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = i.cljs$lang$applyTo;
      return d
    }()
  }, d = function(a, b, c, d) {
    return function() {
      var i = null, j = function() {
        var i = function(i, n, j, l) {
          return cljs.core.apply.call(null, a, null === i ? b : i, null === n ? c : n, null === j ? d : j, l)
        }, j = function(a, b, c, d) {
          var e = null;
          goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return i.call(this, a, b, c, e)
        };
        j.cljs$lang$maxFixedArity = 3;
        j.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return i.call(this, b, c, d, a)
        };
        return j
      }(), i = function(i, l, m, n) {
        switch(arguments.length) {
          case 2:
            return a.call(null, null === i ? b : i, null === l ? c : l);
          case 3:
            return a.call(null, null === i ? b : i, null === l ? c : l, null === m ? d : m);
          default:
            return j.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      i.cljs$lang$maxFixedArity = 3;
      i.cljs$lang$applyTo = j.cljs$lang$applyTo;
      return i
    }()
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  a.cljs$lang$arity$4 = d;
  return a
}();
cljs.core.map_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      return cljs.core.truth_(g) ? cljs.core.cons.call(null, a.call(null, b, cljs.core.first.call(null, g)), d.call(null, b + 1, cljs.core.rest.call(null, g))) : null
    })
  }.call(null, 0, b)
};
cljs.core.keep = function keep(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(cljs.core.truth_(d)) {
      var e = b.call(null, cljs.core.first.call(null, d));
      return e === null ? keep.call(null, b, cljs.core.rest.call(null, d)) : cljs.core.cons.call(null, e, keep.call(null, b, cljs.core.rest.call(null, d)))
    }
    return null
  })
};
cljs.core.keep_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      if(cljs.core.truth_(g)) {
        var h = a.call(null, b, cljs.core.first.call(null, g));
        return h === null ? d.call(null, b + 1, cljs.core.rest.call(null, g)) : cljs.core.cons.call(null, h, d.call(null, b + 1, cljs.core.rest.call(null, g)))
      }
      return null
    })
  }.call(null, 0, b)
};
cljs.core.every_pred = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b) {
        return cljs.core.boolean$.call(null, a.call(null, b))
      }, d = function(b, c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, b);
          return cljs.core.truth_(d) ? a.call(null, c) : d
        }())
      }, e = function(b, c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, b);
          return cljs.core.truth_(e) ? (e = a.call(null, c), cljs.core.truth_(e) ? a.call(null, d) : e) : e
        }())
      }, k = function() {
        var c = function(c, d, e, h) {
          return cljs.core.boolean$.call(null, function() {
            var i = b.call(null, c, d, e);
            return cljs.core.truth_(i) ? cljs.core.every_QMARK_.call(null, a, h) : i
          }())
        }, d = function(a, b, d, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return c.call(this, b, d, e, a)
        };
        return d
      }(), b = function(a, b, f, g) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return c.call(this, a);
          case 2:
            return d.call(this, a, b);
          case 3:
            return e.call(this, a, b, f);
          default:
            return k.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = k.cljs$lang$applyTo;
      b.cljs$lang$arity$0 = function() {
        return!0
      };
      b.cljs$lang$arity$1 = c;
      b.cljs$lang$arity$2 = d;
      b.cljs$lang$arity$3 = e;
      b.cljs$lang$arity$4 = k;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, c);
          return cljs.core.truth_(d) ? b.call(null, c) : d
        }())
      }, e = function(c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, c);
          return cljs.core.truth_(e) && (e = a.call(null, d), cljs.core.truth_(e)) ? (e = b.call(null, c), cljs.core.truth_(e) ? b.call(null, d) : e) : e
        }())
      }, k = function(c, d, e) {
        return cljs.core.boolean$.call(null, function() {
          var h = a.call(null, c);
          return cljs.core.truth_(h) && (h = a.call(null, d), cljs.core.truth_(h) && (h = a.call(null, e), cljs.core.truth_(h) && (h = b.call(null, c), cljs.core.truth_(h)))) ? (h = b.call(null, d), cljs.core.truth_(h) ? b.call(null, e) : h) : h
        }())
      }, l = function() {
        var d = function(d, e, i, j) {
          return cljs.core.boolean$.call(null, function() {
            var n = c.call(null, d, e, i);
            return cljs.core.truth_(n) ? cljs.core.every_QMARK_.call(null, function(c) {
              var d = a.call(null, c);
              return cljs.core.truth_(d) ? b.call(null, c) : d
            }, j) : n
          }())
        }, e = function(a, b, c, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return d.call(this, b, c, e, a)
        };
        return e
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return k.call(this, a, b, c);
          default:
            return l.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = l.cljs$lang$applyTo;
      c.cljs$lang$arity$0 = function() {
        return!0
      };
      c.cljs$lang$arity$1 = d;
      c.cljs$lang$arity$2 = e;
      c.cljs$lang$arity$3 = k;
      c.cljs$lang$arity$4 = l;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, d);
          return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e
        }())
      }, k = function(d, e) {
        return cljs.core.boolean$.call(null, function() {
          var i = a.call(null, d);
          return cljs.core.truth_(i) && (i = b.call(null, d), cljs.core.truth_(i) && (i = c.call(null, d), cljs.core.truth_(i) && (i = a.call(null, e), cljs.core.truth_(i)))) ? (i = b.call(null, e), cljs.core.truth_(i) ? c.call(null, e) : i) : i
        }())
      }, l = function(d, e, i) {
        return cljs.core.boolean$.call(null, function() {
          var j = a.call(null, d);
          return cljs.core.truth_(j) && (j = b.call(null, d), cljs.core.truth_(j) && (j = c.call(null, d), cljs.core.truth_(j) && (j = a.call(null, e), cljs.core.truth_(j) && (j = b.call(null, e), cljs.core.truth_(j) && (j = c.call(null, e), cljs.core.truth_(j) && (j = a.call(null, i), cljs.core.truth_(j))))))) ? (j = b.call(null, i), cljs.core.truth_(j) ? c.call(null, i) : j) : j
        }())
      }, m = function() {
        var e = function(e, j, m, l) {
          return cljs.core.boolean$.call(null, function() {
            var n = d.call(null, e, j, m);
            return cljs.core.truth_(n) ? cljs.core.every_QMARK_.call(null, function(d) {
              var e = a.call(null, d);
              return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e
            }, l) : n
          }())
        }, j = function(a, b, c, d) {
          var f = null;
          goog.isDef(d) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f)
        };
        j.cljs$lang$maxFixedArity = 3;
        j.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return e.call(this, b, c, d, a)
        };
        return j
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return e.call(this, a);
          case 2:
            return k.call(this, a, b);
          case 3:
            return l.call(this, a, b, c);
          default:
            return m.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = m.cljs$lang$applyTo;
      d.cljs$lang$arity$0 = function() {
        return!0
      };
      d.cljs$lang$arity$1 = e;
      d.cljs$lang$arity$2 = k;
      d.cljs$lang$arity$3 = l;
      d.cljs$lang$arity$4 = m;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.every_QMARK_.call(null, function(b) {
            return b.call(null, a)
          }, e)
        }, c = function(a, b) {
          return cljs.core.every_QMARK_.call(null, function(c) {
            var d = c.call(null, a);
            return cljs.core.truth_(d) ? c.call(null, b) : d
          }, e)
        }, d = function(a, b, c) {
          return cljs.core.every_QMARK_.call(null, function(d) {
            var e = d.call(null, a);
            return cljs.core.truth_(e) ? (e = d.call(null, b), cljs.core.truth_(e) ? d.call(null, c) : e) : e
          }, e)
        }, f = function() {
          var b = function(b, c, d, f) {
            return cljs.core.boolean$.call(null, function() {
              var g = a.call(null, b, c, d);
              return cljs.core.truth_(g) ? cljs.core.every_QMARK_.call(null, function(a) {
                return cljs.core.every_QMARK_.call(null, a, f)
              }, e) : g
            }())
          }, c = function(a, c, d, e) {
            var f = null;
            goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f)
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
            return b.call(this, c, d, e, a)
          };
          return c
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return!0;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        a.cljs$lang$arity$0 = function() {
          return!0
        };
        a.cljs$lang$arity$1 = b;
        a.cljs$lang$arity$2 = c;
        a.cljs$lang$arity$3 = d;
        a.cljs$lang$arity$4 = f;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, e, b)
    };
    return b
  }(), a = function(a, g, h, i) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  a.cljs$lang$arity$3 = d;
  a.cljs$lang$arity$4 = e;
  return a
}();
cljs.core.some_fn = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b) {
        return a.call(null, b)
      }, d = function(b, c) {
        var d = a.call(null, b);
        return cljs.core.truth_(d) ? d : a.call(null, c)
      }, e = function(b, c, d) {
        b = a.call(null, b);
        if(cljs.core.truth_(b)) {
          return b
        }
        c = a.call(null, c);
        return cljs.core.truth_(c) ? c : a.call(null, d)
      }, k = function() {
        var c = function(c, d, e, h) {
          c = b.call(null, c, d, e);
          return cljs.core.truth_(c) ? c : cljs.core.some.call(null, a, h)
        }, d = function(a, b, d, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return c.call(this, b, d, e, a)
        };
        return d
      }(), b = function(a, b, f, g) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return c.call(this, a);
          case 2:
            return d.call(this, a, b);
          case 3:
            return e.call(this, a, b, f);
          default:
            return k.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = k.cljs$lang$applyTo;
      b.cljs$lang$arity$0 = function() {
        return null
      };
      b.cljs$lang$arity$1 = c;
      b.cljs$lang$arity$2 = d;
      b.cljs$lang$arity$3 = e;
      b.cljs$lang$arity$4 = k;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        var d = a.call(null, c);
        return cljs.core.truth_(d) ? d : b.call(null, c)
      }, e = function(c, d) {
        var e = a.call(null, c);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = a.call(null, d);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = b.call(null, c);
        return cljs.core.truth_(e) ? e : b.call(null, d)
      }, k = function(c, d, e) {
        var h = a.call(null, c);
        if(cljs.core.truth_(h)) {
          return h
        }
        h = a.call(null, d);
        if(cljs.core.truth_(h)) {
          return h
        }
        h = a.call(null, e);
        if(cljs.core.truth_(h)) {
          return h
        }
        c = b.call(null, c);
        if(cljs.core.truth_(c)) {
          return c
        }
        d = b.call(null, d);
        return cljs.core.truth_(d) ? d : b.call(null, e)
      }, l = function() {
        var d = function(d, e, i, j) {
          d = c.call(null, d, e, i);
          return cljs.core.truth_(d) ? d : cljs.core.some.call(null, function(c) {
            var d = a.call(null, c);
            return cljs.core.truth_(d) ? d : b.call(null, c)
          }, j)
        }, e = function(a, b, c, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return d.call(this, b, c, e, a)
        };
        return e
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return k.call(this, a, b, c);
          default:
            return l.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = l.cljs$lang$applyTo;
      c.cljs$lang$arity$0 = function() {
        return null
      };
      c.cljs$lang$arity$1 = d;
      c.cljs$lang$arity$2 = e;
      c.cljs$lang$arity$3 = k;
      c.cljs$lang$arity$4 = l;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        var e = a.call(null, d);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = b.call(null, d);
        return cljs.core.truth_(e) ? e : c.call(null, d)
      }, k = function(d, e) {
        var i = a.call(null, d);
        if(cljs.core.truth_(i)) {
          return i
        }
        i = b.call(null, d);
        if(cljs.core.truth_(i)) {
          return i
        }
        i = c.call(null, d);
        if(cljs.core.truth_(i)) {
          return i
        }
        i = a.call(null, e);
        if(cljs.core.truth_(i)) {
          return i
        }
        i = b.call(null, e);
        return cljs.core.truth_(i) ? i : c.call(null, e)
      }, l = function(d, e, i) {
        var j = a.call(null, d);
        if(cljs.core.truth_(j)) {
          return j
        }
        j = b.call(null, d);
        if(cljs.core.truth_(j)) {
          return j
        }
        d = c.call(null, d);
        if(cljs.core.truth_(d)) {
          return d
        }
        d = a.call(null, e);
        if(cljs.core.truth_(d)) {
          return d
        }
        d = b.call(null, e);
        if(cljs.core.truth_(d)) {
          return d
        }
        e = c.call(null, e);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = a.call(null, i);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = b.call(null, i);
        return cljs.core.truth_(e) ? e : c.call(null, i)
      }, m = function() {
        var e = function(e, j, k, l) {
          e = d.call(null, e, j, k);
          return cljs.core.truth_(e) ? e : cljs.core.some.call(null, function(d) {
            var e = a.call(null, d);
            if(cljs.core.truth_(e)) {
              return e
            }
            e = b.call(null, d);
            return cljs.core.truth_(e) ? e : c.call(null, d)
          }, l)
        }, j = function(a, b, c, d) {
          var f = null;
          goog.isDef(d) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f)
        };
        j.cljs$lang$maxFixedArity = 3;
        j.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return e.call(this, b, c, d, a)
        };
        return j
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return e.call(this, a);
          case 2:
            return k.call(this, a, b);
          case 3:
            return l.call(this, a, b, c);
          default:
            return m.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = m.cljs$lang$applyTo;
      d.cljs$lang$arity$0 = function() {
        return null
      };
      d.cljs$lang$arity$1 = e;
      d.cljs$lang$arity$2 = k;
      d.cljs$lang$arity$3 = l;
      d.cljs$lang$arity$4 = m;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.some.call(null, function(b) {
            return b.call(null, a)
          }, e)
        }, c = function(a, b) {
          return cljs.core.some.call(null, function(c) {
            var d = c.call(null, a);
            return cljs.core.truth_(d) ? d : c.call(null, b)
          }, e)
        }, d = function(a, b, c) {
          return cljs.core.some.call(null, function(d) {
            var e = d.call(null, a);
            if(cljs.core.truth_(e)) {
              return e
            }
            e = d.call(null, b);
            return cljs.core.truth_(e) ? e : d.call(null, c)
          }, e)
        }, f = function() {
          var b = function(b, c, d, f) {
            b = a.call(null, b, c, d);
            return cljs.core.truth_(b) ? b : cljs.core.some.call(null, function(a) {
              return cljs.core.some.call(null, a, f)
            }, e)
          }, c = function(a, c, d, e) {
            var f = null;
            goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f)
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
            return b.call(this, c, d, e, a)
          };
          return c
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return null;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        a.cljs$lang$arity$0 = function() {
          return null
        };
        a.cljs$lang$arity$1 = b;
        a.cljs$lang$arity$2 = c;
        a.cljs$lang$arity$3 = d;
        a.cljs$lang$arity$4 = f;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, e, b)
    };
    return b
  }(), a = function(a, g, h, i) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  a.cljs$lang$arity$3 = d;
  a.cljs$lang$arity$4 = e;
  return a
}();
cljs.core.map = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var d = cljs.core.seq.call(null, c);
      return cljs.core.truth_(d) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, d)), a.call(null, b, cljs.core.rest.call(null, d))) : null
    })
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, !1, function() {
      var e = cljs.core.seq.call(null, c), j = cljs.core.seq.call(null, d);
      return cljs.core.truth_(cljs.core.truth_(e) ? j : e) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, e), cljs.core.first.call(null, j)), a.call(null, b, cljs.core.rest.call(null, e), cljs.core.rest.call(null, j))) : null
    })
  }, d = function(b, c, d, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var j = cljs.core.seq.call(null, c), k = cljs.core.seq.call(null, d), l = cljs.core.seq.call(null, e);
      return cljs.core.truth_(cljs.core.truth_(j) ? cljs.core.truth_(k) ? l : k : j) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, j), cljs.core.first.call(null, k), cljs.core.first.call(null, l)), a.call(null, b, cljs.core.rest.call(null, j), cljs.core.rest.call(null, k), cljs.core.rest.call(null, l))) : null
    })
  }, e = function() {
    var b = function(b, c, d, e, f) {
      return a.call(null, function(a) {
        return cljs.core.apply.call(null, b, a)
      }, function n(b) {
        return new cljs.core.LazySeq(null, !1, function() {
          var c = a.call(null, cljs.core.seq, b);
          return cljs.core.every_QMARK_.call(null, cljs.core.identity, c) ? cljs.core.cons.call(null, a.call(null, cljs.core.first, c), n.call(null, a.call(null, cljs.core.rest, c))) : null
        })
      }.call(null, cljs.core.conj.call(null, f, e, d, c)))
    }, c = function(a, c, d, e, g) {
      var m = null;
      goog.isDef(g) && (m = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, a, c, d, e, m)
    };
    c.cljs$lang$maxFixedArity = 4;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), g = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a)))), a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(a))));
      return b.call(this, c, d, e, g, a)
    };
    return c
  }(), a = function(a, g, h, i, j) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, i);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  a.cljs$lang$arity$4 = d;
  a.cljs$lang$arity$5 = e;
  return a
}();
cljs.core.take = function take(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    if(b > 0) {
      var d = cljs.core.seq.call(null, c);
      if(cljs.core.truth_(d)) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, d), take.call(null, b - 1, cljs.core.rest.call(null, d)))
      }
    }
    return null
  })
};
cljs.core.drop = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq.call(null, b);
      if(cljs.core.truth_(function() {
        var b = 0 < a;
        return b ? c : b
      }())) {
        var g = a - 1, h = cljs.core.rest.call(null, c), a = g, b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, !1, function() {
    return c.call(null, a, b)
  })
};
cljs.core.drop_last = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b)
  }, c = function(a, b) {
    return cljs.core.map.call(null, function(a) {
      return a
    }, b, cljs.core.drop.call(null, a, b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.take_last = function(a, b) {
  for(var c = cljs.core.seq.call(null, b), d = cljs.core.seq.call(null, cljs.core.drop.call(null, a, b));;) {
    if(cljs.core.truth_(d)) {
      c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d)
    }else {
      return c
    }
  }
};
cljs.core.drop_while = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq.call(null, b);
      if(cljs.core.truth_(function() {
        var b = c;
        return cljs.core.truth_(b) ? a.call(null, cljs.core.first.call(null, c)) : b
      }())) {
        var g = a, h = cljs.core.rest.call(null, c), a = g, b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, !1, function() {
    return c.call(null, a, b)
  })
};
cljs.core.cycle = function cycle(b) {
  return new cljs.core.LazySeq(null, !1, function() {
    var c = cljs.core.seq.call(null, b);
    return cljs.core.truth_(c) ? cljs.core.concat.call(null, c, cycle.call(null, c)) : null
  })
};
cljs.core.split_at = function(a, b) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take.call(null, a, b), cljs.core.drop.call(null, a, b)])
};
cljs.core.repeat = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, b, a.call(null, b))
    })
  }, c = function(b, c) {
    return cljs.core.take.call(null, b, a.call(null, c))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.replicate = function(a, b) {
  return cljs.core.take.call(null, a, cljs.core.repeat.call(null, b))
};
cljs.core.repeatedly = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, b.call(null), a.call(null, b))
    })
  }, c = function(b, c) {
    return cljs.core.take.call(null, b, a.call(null, c))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.iterate = function iterate(b, c) {
  return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, !1, function() {
    return iterate.call(null, b, b.call(null, c))
  }))
};
cljs.core.interleave = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, b), g = cljs.core.seq.call(null, c);
      return cljs.core.truth_(cljs.core.truth_(f) ? g : f) ? cljs.core.cons.call(null, cljs.core.first.call(null, f), cljs.core.cons.call(null, cljs.core.first.call(null, g), a.call(null, cljs.core.rest.call(null, f), cljs.core.rest.call(null, g)))) : null
    })
  }, c = function() {
    var b = function(b, c, d) {
      return new cljs.core.LazySeq(null, !1, function() {
        var e = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, d, c, b));
        return cljs.core.every_QMARK_.call(null, cljs.core.identity, e) ? cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, e), cljs.core.apply.call(null, a, cljs.core.map.call(null, cljs.core.rest, e))) : null
      })
    }, c = function(a, c, e) {
      var i = null;
      goog.isDef(e) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, i)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), e = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, c, e, a)
    };
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.interpose = function(a, b) {
  return cljs.core.drop.call(null, 1, cljs.core.interleave.call(null, cljs.core.repeat.call(null, a), b))
};
cljs.core.flatten1 = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, a);
      return cljs.core.truth_(f) ? cljs.core.cons.call(null, cljs.core.first.call(null, f), c.call(null, cljs.core.rest.call(null, f), e)) : cljs.core.truth_(cljs.core.seq.call(null, e)) ? c.call(null, cljs.core.first.call(null, e), cljs.core.rest.call(null, e)) : null
    })
  }.call(null, null, a)
};
cljs.core.mapcat = function() {
  var a = null, b = function(a, b) {
    return cljs.core.flatten1.call(null, cljs.core.map.call(null, a, b))
  }, c = function() {
    var a = function(a, b, c) {
      var d = null;
      goog.isDef(c) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, a, b, d))
    };
    a.cljs$lang$maxFixedArity = 2;
    a.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, b, c, a))
    };
    return a
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.filter = function filter(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(cljs.core.truth_(d)) {
      var e = cljs.core.first.call(null, d), d = cljs.core.rest.call(null, d);
      return cljs.core.truth_(b.call(null, e)) ? cljs.core.cons.call(null, e, filter.call(null, b, d)) : filter.call(null, b, d)
    }
    return null
  })
};
cljs.core.remove = function(a, b) {
  return cljs.core.filter.call(null, cljs.core.complement.call(null, a), b)
};
cljs.core.tree_seq = function(a, b, c) {
  return function e(c) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, c, cljs.core.truth_(a.call(null, c)) ? cljs.core.mapcat.call(null, e, b.call(null, c)) : null)
    })
  }.call(null, c)
};
cljs.core.flatten = function(a) {
  return cljs.core.filter.call(null, function(a) {
    return cljs.core.not.call(null, cljs.core.sequential_QMARK_.call(null, a))
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, a)))
};
cljs.core.into = function(a, b) {
  return cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.partition = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, b, c)
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, !1, function() {
      var h = cljs.core.seq.call(null, d);
      if(cljs.core.truth_(h)) {
        var i = cljs.core.take.call(null, b, h);
        return cljs.core._EQ_.call(null, b, cljs.core.count.call(null, i)) ? cljs.core.cons.call(null, i, a.call(null, b, c, cljs.core.drop.call(null, c, h))) : null
      }
      return null
    })
  }, d = function(b, c, d, h) {
    return new cljs.core.LazySeq(null, !1, function() {
      var i = cljs.core.seq.call(null, h);
      if(cljs.core.truth_(i)) {
        var j = cljs.core.take.call(null, b, i);
        return cljs.core._EQ_.call(null, b, cljs.core.count.call(null, j)) ? cljs.core.cons.call(null, j, a.call(null, b, c, d, cljs.core.drop.call(null, c, i))) : cljs.core.list.call(null, cljs.core.take.call(null, b, cljs.core.concat.call(null, j, d)))
      }
      return null
    })
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  a.cljs$lang$arity$4 = d;
  return a
}();
cljs.core.get_in = function() {
  var a = null, b = function(a, b) {
    return cljs.core.reduce.call(null, cljs.core.get, a, b)
  }, c = function(a, b, c) {
    for(var g = cljs.core.lookup_sentinel, b = cljs.core.seq.call(null, b);;) {
      if(cljs.core.truth_(b)) {
        a = cljs.core.get.call(null, a, cljs.core.first.call(null, b), g);
        if(g === a) {
          return c
        }
        b = cljs.core.next.call(null, b)
      }else {
        return a
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.assoc_in = function assoc_in(b, c, d) {
  var e = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nthnext.call(null, c, 1);
  return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, e, assoc_in.call(null, cljs.core.get.call(null, b, e), c, d)) : cljs.core.assoc.call(null, b, e, d)
};
cljs.core.update_in = function() {
  var a = function(a, d, e, f) {
    var g = cljs.core.nth.call(null, d, 0, null), d = cljs.core.nthnext.call(null, d, 1);
    return cljs.core.truth_(d) ? cljs.core.assoc.call(null, a, g, cljs.core.apply.call(null, b, cljs.core.get.call(null, a, g), d, e, f)) : cljs.core.assoc.call(null, a, g, cljs.core.apply.call(null, e, cljs.core.get.call(null, a, g), f))
  }, b = function(b, d, e, f) {
    var g = null;
    goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return a.call(this, b, d, e, g)
  };
  b.cljs$lang$maxFixedArity = 3;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), e = cljs.core.first(cljs.core.next(b)), f = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
    return a.call(this, d, e, f, b)
  };
  return b
}();
cljs.core.Vector = function(a, b) {
  this.meta = a;
  this.array = b
};
cljs.core.Vector.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Vector")
};
cljs.core.Vector.prototype.cljs$core$IHash$ = !0;
cljs.core.Vector.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Vector.prototype.cljs$core$ILookup$ = !0;
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, a, b, null)
};
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, a, b, c)
};
cljs.core.Vector.prototype.cljs$core$IAssociative$ = !0;
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = cljs.core.aclone.call(null, this.array);
  a[b] = c;
  return new cljs.core.Vector(this.meta, a)
};
cljs.core.Vector.prototype.cljs$core$IFn$ = !0;
cljs.core.Vector.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Vector.prototype.cljs$core$ISequential$ = !0;
cljs.core.Vector.prototype.cljs$core$ICollection$ = !0;
cljs.core.Vector.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  var c = cljs.core.aclone.call(null, this.array);
  c.push(b);
  return new cljs.core.Vector(this.meta, c)
};
cljs.core.Vector.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.Vector.prototype.cljs$core$IReduce$ = !0;
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this.array, b)
};
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, this.array, b, c)
};
cljs.core.Vector.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  var a = this;
  return 0 < a.array.length ? function c(d) {
    return new cljs.core.LazySeq(null, !1, function() {
      return d < a.array.length ? cljs.core.cons.call(null, a.array[d], c.call(null, d + 1)) : null
    })
  }.call(null, 0) : null
};
cljs.core.Vector.prototype.cljs$core$ICounted$ = !0;
cljs.core.Vector.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.array.length
};
cljs.core.Vector.prototype.cljs$core$IStack$ = !0;
cljs.core.Vector.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  var a = this.array.length;
  return 0 < a ? this.array[a - 1] : null
};
cljs.core.Vector.prototype.cljs$core$IStack$_pop$arity$1 = function() {
  if(0 < this.array.length) {
    var a = cljs.core.aclone.call(null, this.array);
    a.pop();
    return new cljs.core.Vector(this.meta, a)
  }
  throw Error("Can't pop empty vector");
};
cljs.core.Vector.prototype.cljs$core$IVector$ = !0;
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc.call(null, a, b, c)
};
cljs.core.Vector.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Vector.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Vector(b, this.array)
};
cljs.core.Vector.prototype.cljs$core$IMeta$ = !0;
cljs.core.Vector.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.Vector.prototype.cljs$core$IIndexed$ = !0;
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  var c = 0 <= b;
  return(c ? b < this.array.length : c) ? this.array[b] : null
};
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return((a = 0 <= b) ? b < this.array.length : a) ? this.array[b] : c
};
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this.meta)
};
cljs.core.Vector;
cljs.core.Vector.EMPTY = new cljs.core.Vector(null, []);
cljs.core.Vector.fromArray = function(a) {
  return new cljs.core.Vector(null, a)
};
cljs.core.tail_off = function(a) {
  a = a.cnt;
  return 32 > a ? 0 : a - 1 >> 5 << 5
};
cljs.core.new_path = function(a, b) {
  for(var c = a, d = b;;) {
    if(0 === c) {
      return d
    }
    var e = cljs.core.aclone.call(null, cljs.core.PersistentVector.EMPTY_NODE);
    e[0] = d;
    d = e;
    c -= 5
  }
};
cljs.core.push_tail = function push_tail(b, c, d, e) {
  var f = cljs.core.aclone.call(null, d), g = b.cnt - 1 >> c & 31;
  5 === c ? f[g] = e : (d = d[g], b = cljs.core.truth_(d) ? push_tail.call(null, b, c - 5, d, e) : cljs.core.new_path.call(null, c - 5, e), f[g] = b);
  return f
};
cljs.core.array_for = function(a, b) {
  var c = 0 <= b;
  if(c ? b < a.cnt : c) {
    if(b >= cljs.core.tail_off.call(null, a)) {
      return a.tail
    }
    for(var c = a.root, d = a.shift;;) {
      if(0 < d) {
        var e = d - 5, c = c[b >> d & 31], d = e
      }else {
        return c
      }
    }
  }else {
    throw Error(cljs.core.str.call(null, "No item ", b, " in vector of length ", a.cnt));
  }
};
cljs.core.do_assoc = function do_assoc(b, c, d, e, f) {
  var g = cljs.core.aclone.call(null, d);
  if(0 === c) {
    g[e & 31] = f
  }else {
    var h = e >> c & 31;
    g[h] = do_assoc.call(null, b, c - 5, d[h], e, f)
  }
  return g
};
cljs.core.pop_tail = function pop_tail(b, c, d) {
  var e = b.cnt - 2 >> c & 31;
  if(5 < c) {
    b = pop_tail.call(null, b, c - 5, d[e]);
    if((c = null === b) ? 0 === e : c) {
      return null
    }
    d = cljs.core.aclone.call(null, d);
    d[e] = b;
    return d
  }
  if(0 === e) {
    return null
  }
  d = cljs.core.aclone.call(null, d);
  d[e] = null;
  return d
};
cljs.core.PersistentVector = function(a, b, c, d, e) {
  this.meta = a;
  this.cnt = b;
  this.shift = c;
  this.root = d;
  this.tail = e
};
cljs.core.PersistentVector.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.PersistentVector")
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, a, b, null)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = 0 <= b;
  if(d ? b < this.cnt : d) {
    return cljs.core.tail_off.call(null, a) <= b ? (a = cljs.core.aclone.call(null, this.tail), a[b & 31] = c, new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, this.root, a)) : new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, cljs.core.do_assoc.call(null, a, this.shift, this.root, b, c), this.tail)
  }
  if(b === this.cnt) {
    return cljs.core._conj.call(null, a, c)
  }
  throw Error(cljs.core.str.call(null, "Index ", b, " out of bounds  [0,", this.cnt, "]"));
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$ = !0;
cljs.core.PersistentVector.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.PersistentVector.prototype.cljs$core$ISequential$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$ICollection$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  if(32 > this.cnt - cljs.core.tail_off.call(null, a)) {
    var c = cljs.core.aclone.call(null, this.tail);
    c.push(b);
    return new cljs.core.PersistentVector(this.meta, this.cnt + 1, this.shift, this.root, c)
  }
  var d = this.cnt >> 5 > 1 << this.shift, c = d ? this.shift + 5 : this.shift;
  d ? (d = cljs.core.aclone.call(null, cljs.core.PersistentVector.EMPTY_NODE), d[0] = this.root, d[1] = cljs.core.new_path.call(null, this.shift, this.tail)) : d = cljs.core.push_tail.call(null, a, this.shift, this.root, this.tail);
  return new cljs.core.PersistentVector(this.meta, this.cnt + 1, c, d, [b])
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return cljs.core._nth.call(null, a, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return cljs.core._nth.call(null, a, 1)
};
cljs.core.PersistentVector.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this;
  return 0 < b.cnt ? function d(e) {
    return new cljs.core.LazySeq(null, !1, function() {
      return e < b.cnt ? cljs.core.cons.call(null, cljs.core._nth.call(null, a, e), d.call(null, e + 1)) : null
    })
  }.call(null, 0) : null
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.cnt
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return 0 < this.cnt ? cljs.core._nth.call(null, a, this.cnt - 1) : null
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  if(0 === this.cnt) {
    throw Error("Can't pop empty vector");
  }
  if(1 === this.cnt) {
    return cljs.core._with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta)
  }
  if(1 < this.cnt - cljs.core.tail_off.call(null, a)) {
    return new cljs.core.PersistentVector(this.meta, this.cnt - 1, this.shift, this.root, this.tail.slice(0, -1))
  }
  var b = cljs.core.array_for.call(null, a, this.cnt - 2), a = cljs.core.pop_tail.call(null, a, this.shift, this.root), a = null === a ? cljs.core.PersistentVector.EMPTY_NODE : a, c = this.cnt - 1, d = 5 < this.shift;
  return(d ? null === a[1] : d) ? new cljs.core.PersistentVector(this.meta, c, this.shift - 5, a[0], b) : new cljs.core.PersistentVector(this.meta, c, this.shift, a, b)
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc.call(null, a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentVector(b, this.cnt, this.shift, this.root, this.tail)
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return cljs.core.array_for.call(null, a, b)[b & 31]
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  var d = 0 <= b;
  return(d ? b < this.cnt : d) ? cljs.core._nth.call(null, a, b) : c
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta)
};
cljs.core.PersistentVector;
cljs.core.PersistentVector.EMPTY_NODE = cljs.core.make_array.call(null, 32);
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, []);
cljs.core.PersistentVector.fromArray = function(a) {
  return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, a)
};
cljs.core.vec = function(a) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.PersistentVector.EMPTY, a)
};
cljs.core.vector = function() {
  var a = function(a) {
    var c = null;
    goog.isDef(a) && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return cljs.core.vec.call(null, c)
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = function(a) {
    a = cljs.core.seq(a);
    return cljs.core.vec.call(null, a)
  };
  return a
}();
cljs.core.Subvec = function(a, b, c, d) {
  this.meta = a;
  this.v = b;
  this.start = c;
  this.end = d
};
cljs.core.Subvec.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Subvec")
};
cljs.core.Subvec.prototype.cljs$core$IHash$ = !0;
cljs.core.Subvec.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$ = !0;
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, a, b, null)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$ = !0;
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = this.start + b;
  return new cljs.core.Subvec(this.meta, cljs.core._assoc.call(null, this.v, a, c), this.start, this.end > a + 1 ? this.end : a + 1)
};
cljs.core.Subvec.prototype.cljs$core$IFn$ = !0;
cljs.core.Subvec.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Subvec.prototype.cljs$core$ISequential$ = !0;
cljs.core.Subvec.prototype.cljs$core$ICollection$ = !0;
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.Subvec(this.meta, cljs.core._assoc_n.call(null, this.v, this.end, b), this.start, this.end + 1)
};
cljs.core.Subvec.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$ = !0;
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  var a = this;
  return function c(d) {
    return cljs.core._EQ_.call(null, d, a.end) ? null : cljs.core.cons.call(null, cljs.core._nth.call(null, a.v, d), new cljs.core.LazySeq(null, !1, function() {
      return c.call(null, d + 1)
    }))
  }.call(null, a.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$ = !0;
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.end - this.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$ = !0;
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return cljs.core._nth.call(null, this.v, this.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = function() {
  if(cljs.core._EQ_.call(null, this.start, this.end)) {
    throw Error("Can't pop empty vector");
  }
  return new cljs.core.Subvec(this.meta, this.v, this.start, this.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IVector$ = !0;
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc.call(null, a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Subvec(b, this.v, this.start, this.end)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$ = !0;
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$ = !0;
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, this.v, this.start + b)
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, this.v, this.start + b, c)
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this.meta)
};
cljs.core.Subvec;
cljs.core.subvec = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, cljs.core.count.call(null, b))
  }, c = function(a, b, c) {
    return new cljs.core.Subvec(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.PersistentQueueSeq = function(a, b, c) {
  this.meta = a;
  this.front = b;
  this.rear = c
};
cljs.core.PersistentQueueSeq.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISequential$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.PersistentQueueSeq.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return cljs.core._first.call(null, this.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  var b = cljs.core.next.call(null, this.front);
  return cljs.core.truth_(b) ? new cljs.core.PersistentQueueSeq(this.meta, b, this.rear) : null === this.rear ? cljs.core._empty.call(null, a) : new cljs.core.PersistentQueueSeq(this.meta, this.rear, null)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueueSeq(b, this.front, this.rear)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.PersistentQueueSeq;
cljs.core.PersistentQueue = function(a, b, c, d) {
  this.meta = a;
  this.count = b;
  this.front = c;
  this.rear = d
};
cljs.core.PersistentQueue.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.PersistentQueue")
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISequential$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  var c = this;
  return cljs.core.truth_(c.front) ? new cljs.core.PersistentQueue(c.meta, c.count + 1, c.front, cljs.core.conj.call(null, function() {
    var a = c.rear;
    return cljs.core.truth_(a) ? a : cljs.core.PersistentVector.fromArray([])
  }(), b)) : new cljs.core.PersistentQueue(c.meta, c.count + 1, cljs.core.conj.call(null, c.front, b), cljs.core.PersistentVector.fromArray([]))
};
cljs.core.PersistentQueue.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  var a = this, b = cljs.core.seq.call(null, a.rear);
  return cljs.core.truth_(function() {
    var c = a.front;
    return cljs.core.truth_(c) ? c : b
  }()) ? new cljs.core.PersistentQueueSeq(null, a.front, cljs.core.seq.call(null, b)) : cljs.core.List.EMPTY
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return cljs.core._first.call(null, this.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core.truth_(this.front) ? (a = cljs.core.next.call(null, this.front), cljs.core.truth_(a) ? new cljs.core.PersistentQueue(this.meta, this.count - 1, a, this.rear) : new cljs.core.PersistentQueue(this.meta, this.count - 1, cljs.core.seq.call(null, this.rear), cljs.core.PersistentVector.fromArray([]))) : a
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return cljs.core.first.call(null, this.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.rest.call(null, cljs.core.seq.call(null, a))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueue(b, this.count, this.front, this.rear)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.PersistentQueue.EMPTY
};
cljs.core.PersistentQueue;
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.PersistentVector.fromArray([]));
cljs.core.NeverEquiv = function() {
};
cljs.core.NeverEquiv.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.NeverEquiv")
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$ = !0;
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv$arity$2 = function() {
  return!1
};
cljs.core.NeverEquiv;
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.map_QMARK_.call(null, b) ? cljs.core._EQ_.call(null, cljs.core.count.call(null, a), cljs.core.count.call(null, b)) ? cljs.core.every_QMARK_.call(null, cljs.core.identity, cljs.core.map.call(null, function(a) {
    return cljs.core._EQ_.call(null, cljs.core.get.call(null, b, cljs.core.first.call(null, a), cljs.core.never_equiv), cljs.core.second.call(null, a))
  }, a)) : null : null)
};
cljs.core.scan_array = function(a, b, c) {
  for(var d = c.length, e = 0;;) {
    if(e < d) {
      if(cljs.core._EQ_.call(null, b, c[e])) {
        return e
      }
      e += a
    }else {
      return null
    }
  }
};
cljs.core.obj_map_contains_key_QMARK_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, !0, !1)
  }, c = function(a, b, c, g) {
    return cljs.core.truth_(function() {
      var c = goog.isString.call(null, a);
      return cljs.core.truth_(c) ? b.hasOwnProperty(a) : c
    }()) ? c : g
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$4 = c;
  return a
}();
cljs.core.obj_map_compare_keys = function(a, b) {
  var c = cljs.core.hash.call(null, a), d = cljs.core.hash.call(null, b);
  return c < d ? -1 : c > d ? 1 : 0
};
cljs.core.ObjMap = function(a, b, c) {
  this.meta = a;
  this.keys = b;
  this.strobj = c
};
cljs.core.ObjMap.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.ObjMap")
};
cljs.core.ObjMap.prototype.cljs$core$IHash$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_imap.call(null, a)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, a, b, null)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core.obj_map_contains_key_QMARK_.call(null, b, this.strobj, this.strobj[b], c)
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if(cljs.core.truth_(goog.isString.call(null, b))) {
    var a = goog.object.clone.call(null, this.strobj), d = a.hasOwnProperty(b);
    a[b] = c;
    if(cljs.core.truth_(d)) {
      return new cljs.core.ObjMap(this.meta, this.keys, a)
    }
    c = cljs.core.aclone.call(null, this.keys);
    c.push(b);
    return new cljs.core.ObjMap(this.meta, c, a)
  }
  return cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.hash_map.call(null, b, c), cljs.core.seq.call(null, a)), this.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return cljs.core.obj_map_contains_key_QMARK_.call(null, b, this.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IFn$ = !0;
cljs.core.ObjMap.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ObjMap.prototype.cljs$core$ICollection$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? cljs.core._assoc.call(null, a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.ObjMap.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  var a = this;
  return 0 < a.keys.length ? cljs.core.map.call(null, function(b) {
    return cljs.core.vector.call(null, b, a.strobj[b])
  }, a.keys.sort(cljs.core.obj_map_compare_keys)) : null
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ObjMap(b, this.keys, this.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c = this;
  if(cljs.core.truth_(function() {
    var a = goog.isString.call(null, b);
    return cljs.core.truth_(a) ? c.strobj.hasOwnProperty(b) : a
  }())) {
    var d = cljs.core.aclone.call(null, c.keys), e = goog.object.clone.call(null, c.strobj);
    d.splice(cljs.core.scan_array.call(null, 1, b, d), 1);
    cljs.core.js_delete.call(null, e, b);
    return new cljs.core.ObjMap(c.meta, d, e)
  }
  return a
};
cljs.core.ObjMap;
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], cljs.core.js_obj.call(null));
cljs.core.ObjMap.fromObject = function(a, b) {
  return new cljs.core.ObjMap(null, a, b)
};
cljs.core.HashMap = function(a, b, c) {
  this.meta = a;
  this.count = b;
  this.hashobj = c
};
cljs.core.HashMap.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.HashMap")
};
cljs.core.HashMap.prototype.cljs$core$IHash$ = !0;
cljs.core.HashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_imap.call(null, a)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$ = !0;
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, a, b, null)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = this.hashobj[cljs.core.hash.call(null, b)];
  b = cljs.core.truth_(a) ? cljs.core.scan_array.call(null, 2, b, a) : null;
  return cljs.core.truth_(b) ? a[b + 1] : c
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$ = !0;
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var a = cljs.core.hash.call(null, b), d = this.hashobj[a];
  if(cljs.core.truth_(d)) {
    var d = cljs.core.aclone.call(null, d), e = goog.object.clone.call(null, this.hashobj);
    e[a] = d;
    a = cljs.core.scan_array.call(null, 2, b, d);
    if(cljs.core.truth_(a)) {
      return d[a + 1] = c, new cljs.core.HashMap(this.meta, this.count, e)
    }
    d.push(b, c);
    return new cljs.core.HashMap(this.meta, this.count + 1, e)
  }
  d = goog.object.clone.call(null, this.hashobj);
  d[a] = [b, c];
  return new cljs.core.HashMap(this.meta, this.count + 1, d)
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  var c = this.hashobj[cljs.core.hash.call(null, b)], c = cljs.core.truth_(c) ? cljs.core.scan_array.call(null, 2, b, c) : null;
  return cljs.core.truth_(c) ? !0 : !1
};
cljs.core.HashMap.prototype.cljs$core$IFn$ = !0;
cljs.core.HashMap.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.HashMap.prototype.cljs$core$ICollection$ = !0;
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? cljs.core._assoc.call(null, a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.HashMap.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.HashMap.prototype.cljs$core$ISeqable$ = !0;
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  var a = this;
  if(0 < a.count) {
    var b = cljs.core.js_keys.call(null, a.hashobj).sort();
    return cljs.core.mapcat.call(null, function(b) {
      return cljs.core.map.call(null, cljs.core.vec, cljs.core.partition.call(null, 2, a.hashobj[b]))
    }, b)
  }
  return null
};
cljs.core.HashMap.prototype.cljs$core$ICounted$ = !0;
cljs.core.HashMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.count
};
cljs.core.HashMap.prototype.cljs$core$IEquiv$ = !0;
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.HashMap.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.HashMap(b, this.count, this.hashobj)
};
cljs.core.HashMap.prototype.cljs$core$IMeta$ = !0;
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.HashMap.EMPTY, this.meta)
};
cljs.core.HashMap.prototype.cljs$core$IMap$ = !0;
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c = cljs.core.hash.call(null, b), d = this.hashobj[c], e = cljs.core.truth_(d) ? cljs.core.scan_array.call(null, 2, b, d) : null;
  if(cljs.core.not.call(null, e)) {
    return a
  }
  var f = goog.object.clone.call(null, this.hashobj);
  3 > d.length ? cljs.core.js_delete.call(null, f, c) : (d = cljs.core.aclone.call(null, d), d.splice(e, 2), f[c] = d);
  return new cljs.core.HashMap(this.meta, this.count - 1, f)
};
cljs.core.HashMap;
cljs.core.HashMap.EMPTY = new cljs.core.HashMap(null, 0, cljs.core.js_obj.call(null));
cljs.core.HashMap.fromArrays = function(a, b) {
  for(var c = a.length, d = 0, e = cljs.core.HashMap.EMPTY;;) {
    if(d < c) {
      var f = d + 1, e = cljs.core.assoc.call(null, e, a[d], b[d]), d = f
    }else {
      return e
    }
  }
};
cljs.core.transient$ = function(a) {
  return cljs.core._as_transient.call(null, a)
};
cljs.core.persistent_BANG_ = function(a) {
  return cljs.core._persistent_BANG_.call(null, a)
};
cljs.core.conj_BANG_ = function(a, b) {
  return cljs.core._conj_BANG_.call(null, a, b)
};
cljs.core.assoc_BANG_ = function(a, b, c) {
  return cljs.core._assoc_BANG_.call(null, a, b, c)
};
cljs.core.dissoc_BANG_ = function(a, b) {
  return cljs.core._dissoc_BANG_.call(null, a, b)
};
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
cljs.core.mask = function(a, b) {
  return a >>> b & 31
};
cljs.core.clone_and_set = function() {
  var a = null, b = function(a, b, c) {
    a = cljs.core.aclone.call(null, a);
    a[b] = c;
    return a
  }, c = function(a, b, c, g, h) {
    a = cljs.core.aclone.call(null, a);
    a[b] = c;
    a[g] = h;
    return a
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$3 = b;
  a.cljs$lang$arity$5 = c;
  return a
}();
cljs.core.array_copy = function(a, b, c, d, e) {
  for(;;) {
    if(0 === e) {
      return c
    }
    c[d] = a[b];
    d += 1;
    e -= 1;
    b += 1
  }
};
cljs.core.array_copy_downward = function(a, b, c, d, e) {
  b += e - 1;
  for(d += e - 1;;) {
    if(0 === e) {
      return c
    }
    c[d] = a[b];
    d -= 1;
    e -= 1;
    b -= 1
  }
};
cljs.core.remove_pair = function(a, b) {
  var c = cljs.core.make_array.call(null, a.length - 2);
  cljs.core.array_copy.call(null, a, 0, c, 0, 2 * b);
  cljs.core.array_copy.call(null, a, 2 * (b + 1), c, 2 * b, c.length - 2 * b);
  return c
};
cljs.core.bitmap_indexed_node_index = function(a, b) {
  return cljs.core.bit_count.call(null, a & b - 1)
};
cljs.core.bitpos = function(a, b) {
  return 1 << (a >>> b & 31)
};
cljs.core.edit_and_set = function() {
  var a = null, b = function(a, b, c, g) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    return a
  }, c = function(a, b, c, g, h, i) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    a.arr[h] = i;
    return a
  }, a = function(a, e, f, g, h, i) {
    switch(arguments.length) {
      case 4:
        return b.call(this, a, e, f, g);
      case 6:
        return c.call(this, a, e, f, g, h, i)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$4 = b;
  a.cljs$lang$arity$6 = c;
  return a
}();
void 0;
cljs.core.BitmapIndexedNode = function(a, b, c) {
  this.edit = a;
  this.bitmap = b;
  this.arr = c
};
cljs.core.BitmapIndexedNode.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.BitmapIndexedNode")
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = 1 << (b >>> a & 31), g = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, f);
  if(0 === (this.bitmap & f)) {
    var h = cljs.core.bit_count.call(null, this.bitmap);
    if(16 <= h) {
      g = cljs.core.make_array.call(null, 32);
      g[b >>> a & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e);
      for(d = c = 0;;) {
        if(32 > c) {
          0 !== (this.bitmap >>> c & 1) && (g[c] = null != this.arr[d] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, cljs.core.hash.call(null, this.arr[d]), this.arr[d], this.arr[d + 1], e) : this.arr[d + 1], d += 2), c += 1
        }else {
          break
        }
      }
      return new cljs.core.ArrayNode(null, h + 1, g)
    }
    a = cljs.core.make_array.call(null, 2 * (h + 1));
    cljs.core.array_copy.call(null, this.arr, 0, a, 0, 2 * g);
    a[2 * g] = c;
    e[0] = !0;
    a[2 * g + 1] = d;
    cljs.core.array_copy.call(null, this.arr, 2 * g, a, 2 * (g + 1), 2 * (h - g));
    return new cljs.core.BitmapIndexedNode(null, this.bitmap | f, a)
  }
  f = this.arr[2 * g];
  h = this.arr[2 * g + 1];
  if(null == f) {
    return e = h.inode_assoc(a + 5, b, c, d, e), e === h ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g + 1, e))
  }
  if(cljs.core._EQ_.call(null, c, f)) {
    return d === h ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g + 1, d))
  }
  e[0] = !0;
  return new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g, null, 2 * g + 1, cljs.core.create_node.call(null, a + 5, f, h, b, c, d)))
};
cljs.core.BitmapIndexedNode.prototype.inode_without = function(a, b, c) {
  var d = 1 << (b >>> a & 31);
  if(0 === (this.bitmap & d)) {
    return this
  }
  var e = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, d), f = this.arr[2 * e], g = this.arr[2 * e + 1];
  return null == f ? (a = g.inode_without(a + 5, b, c), a === g ? this : null != a ? new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * e + 1, a)) : this.bitmap === d ? null : new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair.call(null, this.arr, e))) : cljs.core._EQ_.call(null, c, f) ? new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair.call(null, this.arr, e)) : this
};
cljs.core.BitmapIndexedNode.prototype.inode_find = function() {
  return function(a, b, c, d) {
    switch(arguments.length) {
      case 3:
        var e;
        e = 1 << (b >>> a & 31);
        if(0 === (this.bitmap & e)) {
          e = null
        }else {
          var f = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, e);
          e = this.arr[2 * f];
          f = this.arr[2 * f + 1];
          e = null == e ? f.inode_find(a + 5, b, c) : cljs.core._EQ_.call(null, c, e) ? cljs.core.PersistentVector.fromArray([e, f]) : null
        }
        return e;
      case 4:
        return e = 1 << (b >>> a & 31), 0 === (this.bitmap & e) ? e = d : (f = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, e), e = this.arr[2 * f], f = this.arr[2 * f + 1], e = null == e ? f.inode_find(a + 5, b, c, d) : cljs.core._EQ_.call(null, c, e) ? cljs.core.PersistentVector.fromArray([e, f]) : d), e
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.BitmapIndexedNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.call(null, this.arr)
};
cljs.core.BitmapIndexedNode.prototype.ensure_editable = function(a) {
  if(a === this.edit) {
    return this
  }
  var b = cljs.core.bit_count.call(null, this.bitmap), c = cljs.core.make_array.call(null, 0 > b ? 4 : 2 * (b + 1));
  cljs.core.array_copy.call(null, this.arr, 0, c, 0, 2 * b);
  return new cljs.core.BitmapIndexedNode(a, this.bitmap, c)
};
cljs.core.BitmapIndexedNode.prototype.edit_and_remove_pair = function(a, b, c) {
  if(this.bitmap === b) {
    return null
  }
  var a = this.ensure_editable(a), d = a.arr, e = d.length;
  a.bitmap ^= b;
  cljs.core.array_copy.call(null, d, 2 * (c + 1), d, 2 * c, e - 2 * (c + 1));
  d[e - 2] = null;
  d[e - 1] = null;
  return a
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = 1 << (c >>> b & 31), h = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, g);
  if(0 === (this.bitmap & g)) {
    var i = cljs.core.bit_count.call(null, this.bitmap);
    if(2 * i < this.arr.length) {
      return a = this.ensure_editable(a), b = a.arr, f[0] = !0, cljs.core.array_copy_downward.call(null, b, 2 * h, b, 2 * (h + 1), 2 * (i - h)), b[2 * h] = d, b[2 * h + 1] = e, a.bitmap |= g, a
    }
    if(16 <= i) {
      h = cljs.core.make_array.call(null, 32);
      h[c >>> b & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f);
      for(e = d = 0;;) {
        if(32 > d) {
          0 !== (this.bitmap >>> d & 1) && (h[d] = null != this.arr[e] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, cljs.core.hash.call(null, this.arr[e]), this.arr[e], this.arr[e + 1], f) : this.arr[e + 1], e += 2), d += 1
        }else {
          break
        }
      }
      return new cljs.core.ArrayNode(a, i + 1, h)
    }
    b = cljs.core.make_array.call(null, 2 * (i + 4));
    cljs.core.array_copy.call(null, this.arr, 0, b, 0, 2 * h);
    b[2 * h] = d;
    f[0] = !0;
    b[2 * h + 1] = e;
    cljs.core.array_copy.call(null, this.arr, 2 * h, b, 2 * (h + 1), 2 * (i - h));
    f = this.ensure_editable(a);
    f.arr = b;
    f.bitmap |= g;
    return f
  }
  g = this.arr[2 * h];
  i = this.arr[2 * h + 1];
  if(null == g) {
    return f = i.inode_assoc_BANG_(a, b + 5, c, d, e, f), f === i ? this : cljs.core.edit_and_set.call(null, this, a, 2 * h + 1, f)
  }
  if(cljs.core._EQ_.call(null, d, g)) {
    return e === i ? this : cljs.core.edit_and_set.call(null, this, a, 2 * h + 1, e)
  }
  f[0] = !0;
  return cljs.core.edit_and_set.call(null, this, a, 2 * h, null, 2 * h + 1, cljs.core.create_node.call(null, a, b + 5, g, i, c, d, e))
};
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = 1 << (c >>> b & 31);
  if(0 === (this.bitmap & f)) {
    return this
  }
  var g = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, f), h = this.arr[2 * g], i = this.arr[2 * g + 1];
  return null == h ? (b = i.inode_without_BANG_(a, b + 5, c, d, e), b === i ? this : null != b ? cljs.core.edit_and_set.call(null, this, a, 2 * g + 1, b) : this.bitmap === f ? null : this.edit_and_remove_pair(a, f, g)) : cljs.core._EQ_.call(null, d, h) ? (e[0] = !0, this.edit_and_remove_pair(a, f, g)) : this
};
cljs.core.BitmapIndexedNode;
cljs.core.BitmapIndexedNode.EMPTY = new cljs.core.BitmapIndexedNode(null, 0, cljs.core.make_array.call(null, 0));
cljs.core.pack_array_node = function(a, b, c) {
  for(var d = a.arr, a = 2 * (a.cnt - 1), e = cljs.core.make_array.call(null, a), f = 0, g = 1, h = 0;;) {
    if(f < a) {
      var i = f != c;
      if(i ? null != d[f] : i) {
        e[g] = d[f], g += 2, h |= 1 << f
      }
      f += 1
    }else {
      return new cljs.core.BitmapIndexedNode(b, h, e)
    }
  }
};
cljs.core.ArrayNode = function(a, b, c) {
  this.edit = a;
  this.cnt = b;
  this.arr = c
};
cljs.core.ArrayNode.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.ArrayNode")
};
cljs.core.ArrayNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = b >>> a & 31, g = this.arr[f];
  if(null == g) {
    return new cljs.core.ArrayNode(null, this.cnt + 1, cljs.core.clone_and_set.call(null, this.arr, f, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e)))
  }
  a = g.inode_assoc(a + 5, b, c, d, e);
  return a === g ? this : new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.call(null, this.arr, f, a))
};
cljs.core.ArrayNode.prototype.inode_without = function(a, b, c) {
  var d = b >>> a & 31, e = this.arr[d];
  return null != e ? (a = e.inode_without(a + 5, b, c), a === e ? this : null === a ? 8 >= this.cnt ? cljs.core.pack_array_node.call(null, this, null, d) : new cljs.core.ArrayNode(null, this.cnt - 1, cljs.core.clone_and_set.call(null, this.arr, d, a)) : new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.call(null, this.arr, d, a))) : this
};
cljs.core.ArrayNode.prototype.inode_find = function() {
  return function(a, b, c, d) {
    switch(arguments.length) {
      case 3:
        var e = this.arr[b >>> a & 31];
        return null != e ? e.inode_find(a + 5, b, c) : null;
      case 4:
        return e = this.arr[b >>> a & 31], null != e ? e.inode_find(a + 5, b, c, d) : d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ArrayNode.prototype.inode_seq = function() {
  return cljs.core.create_array_node_seq.call(null, this.arr)
};
cljs.core.ArrayNode.prototype.ensure_editable = function(a) {
  return a === this.edit ? this : new cljs.core.ArrayNode(a, this.cnt, cljs.core.aclone.call(null, this.arr))
};
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = c >>> b & 31, h = this.arr[g];
  if(null == h) {
    return a = cljs.core.edit_and_set.call(null, this, a, g, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f)), a.cnt += 1, a
  }
  b = h.inode_assoc_BANG_(a, b + 5, c, d, e, f);
  return b === h ? this : cljs.core.edit_and_set.call(null, this, a, g, b)
};
cljs.core.ArrayNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = c >>> b & 31, g = this.arr[f];
  if(null == g) {
    return this
  }
  b = g.inode_without_BANG_(a, b + 5, c, d, e);
  if(b === g) {
    return this
  }
  if(null == b) {
    if(8 >= this.cnt) {
      return cljs.core.pack_array_node.call(null, this, a, f)
    }
    a = cljs.core.edit_and_set.call(null, this, a, f, b);
    a.cnt -= 1;
    return a
  }
  return cljs.core.edit_and_set.call(null, this, a, f, b)
};
cljs.core.ArrayNode;
cljs.core.hash_collision_node_find_index = function(a, b, c) {
  for(var b = 2 * b, d = 0;;) {
    if(d < b) {
      if(cljs.core._EQ_.call(null, c, a[d])) {
        return d
      }
      d += 2
    }else {
      return-1
    }
  }
};
cljs.core.HashCollisionNode = function(a, b, c, d) {
  this.edit = a;
  this.__hash = b;
  this.cnt = c;
  this.arr = d
};
cljs.core.HashCollisionNode.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.HashCollisionNode")
};
cljs.core.HashCollisionNode.prototype.inode_assoc = function(a, b, c, d, e) {
  return b === this.__hash ? (a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c), -1 === a ? (a = this.arr.length, b = cljs.core.make_array.call(null, a + 2), cljs.core.array_copy.call(null, this.arr, 0, b, 0, a), b[a] = c, b[a + 1] = d, e[0] = !0, new cljs.core.HashCollisionNode(null, this.__hash, this.cnt + 1, b)) : cljs.core._EQ_.call(null, this.arr[a], d) ? this : new cljs.core.HashCollisionNode(null, this.__hash, this.cnt, cljs.core.clone_and_set.call(null, this.arr, 
  a + 1, d))) : (new cljs.core.BitmapIndexedNode(null, 1 << (this.__hash >>> a & 31), [null, this])).inode_assoc(a, b, c, d, e)
};
cljs.core.HashCollisionNode.prototype.inode_without = function(a, b, c) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return-1 === a ? this : 1 === this.cnt ? null : new cljs.core.HashCollisionNode(null, this.__hash, this.cnt - 1, cljs.core.remove_pair.call(null, this.arr, cljs.core.quot.call(null, a, 2)))
};
cljs.core.HashCollisionNode.prototype.inode_find = function() {
  return function(a, b, c, d) {
    switch(arguments.length) {
      case 3:
        var e = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
        return 0 > e ? null : cljs.core._EQ_.call(null, c, this.arr[e]) ? cljs.core.PersistentVector.fromArray([this.arr[e], this.arr[e + 1]]) : null;
      case 4:
        return e = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c), 0 > e ? d : cljs.core._EQ_.call(null, c, this.arr[e]) ? cljs.core.PersistentVector.fromArray([this.arr[e], this.arr[e + 1]]) : d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.HashCollisionNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.call(null, this.arr)
};
cljs.core.HashCollisionNode.prototype.ensure_editable = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 1:
        var d;
        a === this.edit ? d = this : (d = cljs.core.make_array.call(null, 2 * (this.cnt + 1)), cljs.core.array_copy.call(null, this.arr, 0, d, 0, 2 * this.cnt), d = new cljs.core.HashCollisionNode(a, this.__hash, this.cnt, d));
        return d;
      case 3:
        return a === this.edit ? (this.arr = c, this.cnt = b, d = this) : d = new cljs.core.HashCollisionNode(this.edit, this.__hash, b, c), d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  if(c === this.__hash) {
    b = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, d);
    if(-1 === b) {
      if(this.arr.length > 2 * this.cnt) {
        return a = cljs.core.edit_and_set.call(null, this, a, 2 * this.cnt, d, 2 * this.cnt + 1, e), f[0] = !0, a.cnt += 1, a
      }
      b = this.arr.length;
      c = cljs.core.make_array.call(null, b + 2);
      cljs.core.array_copy.call(null, this.arr, 0, c, 0, b);
      c[b] = d;
      c[b + 1] = e;
      f[0] = !0;
      return this.ensure_editable(a, this.cnt + 1, c)
    }
    return this.arr[b + 1] === e ? this : cljs.core.edit_and_set.call(null, this, a, b + 1, e)
  }
  return(new cljs.core.BitmapIndexedNode(a, 1 << (this.__hash >>> b & 31), [null, this, null, null])).inode_assoc_BANG_(a, b, c, d, e, f)
};
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  b = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, d);
  if(-1 === b) {
    return this
  }
  e[0] = !0;
  if(1 === this.cnt) {
    return null
  }
  a = this.ensure_editable(a);
  e = a.arr;
  e[b] = e[2 * this.cnt - 2];
  e[b + 1] = e[2 * this.cnt - 1];
  e[2 * this.cnt - 1] = null;
  e[2 * this.cnt - 2] = null;
  a.cnt -= 1;
  return a
};
cljs.core.HashCollisionNode;
cljs.core.create_node = function() {
  var a = null, b = function(a, b, c, g, h, i) {
    var j = cljs.core.hash.call(null, b);
    if(j === g) {
      return new cljs.core.HashCollisionNode(null, j, 2, [b, c, h, i])
    }
    var k = [!1];
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a, j, b, c, k).inode_assoc(a, g, h, i, k)
  }, c = function(a, b, c, g, h, i, j) {
    var k = cljs.core.hash.call(null, c);
    if(k === h) {
      return new cljs.core.HashCollisionNode(null, k, 2, [c, g, i, j])
    }
    var l = [!1];
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b, k, c, g, l).inode_assoc_BANG_(a, b, h, i, j, l)
  }, a = function(a, e, f, g, h, i, j) {
    switch(arguments.length) {
      case 6:
        return b.call(this, a, e, f, g, h, i);
      case 7:
        return c.call(this, a, e, f, g, h, i, j)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$6 = b;
  a.cljs$lang$arity$7 = c;
  return a
}();
cljs.core.NodeSeq = function(a, b, c, d) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d
};
cljs.core.NodeSeq.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.NodeSeq")
};
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return null === this.s ? cljs.core.PersistentVector.fromArray([this.nodes[this.i], this.nodes[this.i + 1]]) : cljs.core.first.call(null, this.s)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return null === this.s ? cljs.core.create_inode_seq.call(null, this.nodes, this.i + 2, null) : cljs.core.create_inode_seq.call(null, this.nodes, this.i, cljs.core.next.call(null, this.s))
};
cljs.core.NodeSeq.prototype.cljs$core$ISequential$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.NodeSeq(b, this.nodes, this.i, this.s)
};
cljs.core.NodeSeq.prototype.cljs$core$IMeta$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.NodeSeq;
cljs.core.create_inode_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 0, null)
  }, c = function(a, b, c) {
    if(null === c) {
      for(c = a.length;;) {
        if(b < c) {
          if(null != a[b]) {
            return new cljs.core.NodeSeq(null, a, b, null)
          }
          var g = a[b + 1];
          if(cljs.core.truth_(g) && (g = g.inode_seq(), cljs.core.truth_(g))) {
            return new cljs.core.NodeSeq(null, a, b + 2, g)
          }
          b += 2
        }else {
          return null
        }
      }
    }else {
      return new cljs.core.NodeSeq(null, a, b, c)
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.ArrayNodeSeq = function(a, b, c, d) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d
};
cljs.core.ArrayNodeSeq.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.ArrayNodeSeq")
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return cljs.core.first.call(null, this.s)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return cljs.core.create_array_node_seq.call(null, null, this.nodes, this.i, cljs.core.next.call(null, this.s))
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISequential$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ArrayNodeSeq(b, this.nodes, this.i, this.s)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.ArrayNodeSeq;
cljs.core.create_array_node_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, null, b, 0, null)
  }, c = function(a, b, c, g) {
    if(null === g) {
      for(g = b.length;;) {
        if(c < g) {
          var h = b[c];
          if(cljs.core.truth_(h) && (h = h.inode_seq(), cljs.core.truth_(h))) {
            return new cljs.core.ArrayNodeSeq(a, b, c + 1, h)
          }
          c += 1
        }else {
          return null
        }
      }
    }else {
      return new cljs.core.ArrayNodeSeq(a, b, c, g)
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$4 = c;
  return a
}();
void 0;
cljs.core.PersistentHashMap = function(a, b, c, d, e) {
  this.meta = a;
  this.cnt = b;
  this.root = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e
};
cljs.core.PersistentHashMap.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.PersistentHashMap")
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function() {
  return new cljs.core.TransientHashMap(cljs.core.js_obj.call(null), this.root, this.cnt, this.has_nil_QMARK_, this.nil_val)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_imap.call(null, a)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, a, b, null)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null === b ? cljs.core.truth_(this.has_nil_QMARK_) ? this.nil_val : c : null === this.root ? c : cljs.core.nth.call(null, this.root.inode_find(0, cljs.core.hash.call(null, b), b, [null, c]), 1)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = this;
  if(null === b) {
    return cljs.core.truth_(function() {
      var a = d.has_nil_QMARK_;
      return cljs.core.truth_(a) ? c === d.nil_val : a
    }()) ? a : new cljs.core.PersistentHashMap(d.meta, cljs.core.truth_(d.has_nil_QMARK_) ? d.cnt : d.cnt + 1, d.root, !0, c)
  }
  var e = [!1], b = (null === d.root ? cljs.core.BitmapIndexedNode.EMPTY : d.root).inode_assoc(0, cljs.core.hash.call(null, b), b, c, e);
  return b === d.root ? a : new cljs.core.PersistentHashMap(d.meta, cljs.core.truth_(e[0]) ? d.cnt + 1 : d.cnt, b, d.has_nil_QMARK_, d.nil_val)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null === b ? this.has_nil_QMARK_ : null === this.root ? !1 : cljs.core.not.call(null, this.root.inode_find(0, cljs.core.hash.call(null, b), b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IFn$ = !0;
cljs.core.PersistentHashMap.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? cljs.core._assoc.call(null, a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.PersistentHashMap.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  if(0 < this.cnt) {
    var a = null != this.root ? this.root.inode_seq() : null;
    return cljs.core.truth_(this.has_nil_QMARK_) ? cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([null, this.nil_val]), a) : a
  }
  return null
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.cnt
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashMap(b, this.cnt, this.root, this.has_nil_QMARK_, this.nil_val)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core._with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, this.meta)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if(null === b) {
    return cljs.core.truth_(this.has_nil_QMARK_) ? new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, this.root, !1, null) : a
  }
  if(null === this.root) {
    return a
  }
  var c = this.root.inode_without(0, cljs.core.hash.call(null, b), b);
  return c === this.root ? a : new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, c, this.has_nil_QMARK_, this.nil_val)
};
cljs.core.PersistentHashMap;
cljs.core.PersistentHashMap.EMPTY = new cljs.core.PersistentHashMap(null, 0, null, !1, null);
cljs.core.PersistentHashMap.fromArrays = function(a, b) {
  for(var c = a.length, d = 0, e = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
    if(d < c) {
      var f = d + 1, e = cljs.core.assoc_BANG_.call(null, e, a[d], b[d]), d = f
    }else {
      return cljs.core.persistent_BANG_.call(null, e)
    }
  }
};
cljs.core.TransientHashMap = function(a, b, c, d, e) {
  this.edit = a;
  this.root = b;
  this.count = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e
};
cljs.core.TransientHashMap.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.TransientHashMap")
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$ = !0;
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  return a.assoc_BANG_(b, c)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_dissoc_BANG_$arity$2 = function(a, b) {
  return a.without_BANG_(b)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$ = !0;
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  return a.conj_BANG_(b)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  return a.persistent_BANG_()
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$ = !0;
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return null === b ? cljs.core.truth_(this.has_nil_QMARK_) ? this.nil_val : null : null === this.root ? null : cljs.core.nth.call(null, this.root.inode_find(0, cljs.core.hash.call(null, b), b), 1)
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null === b ? cljs.core.truth_(this.has_nil_QMARK_) ? this.nil_val : c : null === this.root ? c : cljs.core.nth.call(null, this.root.inode_find(0, cljs.core.hash.call(null, b), b, c), 1)
};
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$ = !0;
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  if(cljs.core.truth_(this.edit)) {
    return this.count
  }
  throw Error("count after persistent!");
};
cljs.core.TransientHashMap.prototype.conj_BANG_ = function(a) {
  if(cljs.core.truth_(this.edit)) {
    if(cljs.core.truth_(function() {
      return cljs.core.truth_(function() {
        if(cljs.core.truth_(a)) {
          var b = a.cljs$core$IMapEntry$;
          return cljs.core.truth_(b) ? cljs.core.not.call(null, a.hasOwnProperty("cljs$core$IMapEntry$")) : b
        }
        return a
      }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, a)
    }())) {
      return this.assoc_BANG_(cljs.core.key.call(null, a), cljs.core.val.call(null, a))
    }
    for(var b = cljs.core.seq.call(null, a), c = this;;) {
      var d = cljs.core.first.call(null, b);
      if(cljs.core.truth_(d)) {
        b = cljs.core.next.call(null, b), c = c.assoc_BANG_(cljs.core.key.call(null, d), cljs.core.val.call(null, d))
      }else {
        return c
      }
    }
  }else {
    throw Error("conj! after persistent");
  }
};
cljs.core.TransientHashMap.prototype.assoc_BANG_ = function(a, b) {
  if(cljs.core.truth_(this.edit)) {
    if(null === a) {
      if(this.nil_val !== b && (this.nil_val = b), !cljs.core.truth_(this.has_nil_QMARK_)) {
        this.count += 1, this.has_nil_QMARK_ = !0
      }
    }else {
      var c = [!1], d = (null === this.root ? cljs.core.BitmapIndexedNode.EMPTY : this.root).inode_assoc_BANG_(this.edit, 0, cljs.core.hash.call(null, a), a, b, c);
      d !== this.root && (this.root = d);
      cljs.core.truth_(c[0]) && (this.count += 1)
    }
    return this
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.without_BANG_ = function(a) {
  if(cljs.core.truth_(this.edit)) {
    if(null === a) {
      cljs.core.truth_(this.has_nil_QMARK_) && (this.has_nil_QMARK_ = !1, this.nil_val = null, this.count -= 1)
    }else {
      if(null !== this.root) {
        var b = [!1], a = this.root.inode_without_BANG_(this.edit, 0, cljs.core.hash.call(null, a), a, b);
        a !== this.root && (this.root = a);
        cljs.core.truth_(b[0]) && (this.count -= 1)
      }
    }
    return this
  }
  throw Error("dissoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.persistent_BANG_ = function() {
  if(cljs.core.truth_(this.edit)) {
    return this.edit = null, new cljs.core.PersistentHashMap(null, this.count, this.root, this.has_nil_QMARK_, this.nil_val)
  }
  throw Error("persistent! called twice");
};
cljs.core.TransientHashMap;
cljs.core.tree_map_seq_push = function(a, b, c) {
  for(var d = b;;) {
    if(null != a) {
      b = cljs.core.truth_(c) ? a.left : a.right, d = cljs.core.conj.call(null, d, a), a = b
    }else {
      return d
    }
  }
};
cljs.core.PersistentTreeMapSeq = function(a, b, c, d) {
  this.meta = a;
  this.stack = b;
  this.ascending_QMARK_ = c;
  this.cnt = d
};
cljs.core.PersistentTreeMapSeq.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.PersistentTreeMapSeq")
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISequential$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.PersistentTreeMapSeq.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 0 > this.cnt ? cljs.core.count.call(null, cljs.core.next.call(null, a)) + 1 : this.cnt
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return cljs.core.peek.call(null, this.stack)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  var a = cljs.core.peek.call(null, this.stack), a = cljs.core.tree_map_seq_push.call(null, cljs.core.truth_(this.ascending_QMARK_) ? a.right : a.left, cljs.core.pop.call(null, this.stack), this.ascending_QMARK_);
  return null != a ? new cljs.core.PersistentTreeMapSeq(null, a, this.ascending_QMARK_, this.cnt - 1) : null
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMapSeq(b, this.stack, this.ascending_QMARK_, this.cnt)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentTreeMapSeq;
cljs.core.create_tree_map_seq = function(a, b, c) {
  return new cljs.core.PersistentTreeMapSeq(null, cljs.core.tree_map_seq_push.call(null, a, null, b), b, c)
};
void 0;
void 0;
cljs.core.balance_left = function(a, b, c, d) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c) ? cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c.left) ? new cljs.core.RedNode(c.key, c.val, c.left.blacken(), new cljs.core.BlackNode(a, b, c.right, d)) : cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c.right) ? new cljs.core.RedNode(c.right.key, c.right.val, new cljs.core.BlackNode(c.key, c.val, c.left, c.right.left), new cljs.core.BlackNode(a, b, c.right.right, d)) : new cljs.core.BlackNode(a, b, c, d) : new cljs.core.BlackNode(a, 
  b, c, d)
};
cljs.core.balance_right = function(a, b, c, d) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d) ? cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d.right) ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(a, b, c, d.left), d.right.blacken()) : cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d.left) ? new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left), new cljs.core.BlackNode(d.key, d.val, d.left.right, d.right)) : new cljs.core.BlackNode(a, b, c, d) : new cljs.core.BlackNode(a, 
  b, c, d)
};
cljs.core.balance_left_del = function(a, b, c, d) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c)) {
    return new cljs.core.RedNode(a, b, c.blacken(), d)
  }
  if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, d)) {
    return cljs.core.balance_right.call(null, a, b, c, d.redden())
  }
  var e = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d);
  if(e ? cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, d.left) : e) {
    return new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left), cljs.core.balance_right.call(null, d.key, d.val, d.left.right, d.right.redden()))
  }
  throw Error("red-black tree invariant violation");
};
cljs.core.balance_right_del = function(a, b, c, d) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d)) {
    return new cljs.core.RedNode(a, b, c, d.blacken())
  }
  if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, c)) {
    return cljs.core.balance_left.call(null, a, b, c.redden(), d)
  }
  var e = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c);
  if(e ? cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, c.right) : e) {
    return new cljs.core.RedNode(c.right.key, c.right.val, cljs.core.balance_left.call(null, c.key, c.val, c.left.redden(), c.right.left), new cljs.core.BlackNode(a, b, c.right.right, d))
  }
  throw Error("red-black tree invariant violation");
};
cljs.core.BlackNode = function(a, b, c, d) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d
};
cljs.core.BlackNode.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.BlackNode")
};
cljs.core.BlackNode.prototype.cljs$core$IHash$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$ = !0;
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, a, b, null)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, a, b, c)
};
cljs.core.BlackNode.prototype.cljs$core$IAssociative$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val]), b, c)
};
cljs.core.BlackNode.prototype.cljs$core$IFn$ = !0;
cljs.core.BlackNode.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.BlackNode.prototype.cljs$core$ISequential$ = !0;
cljs.core.BlackNode.prototype.cljs$core$ICollection$ = !0;
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.PersistentVector.fromArray([this.key, this.val, b])
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function() {
  return this.key
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function() {
  return this.val
};
cljs.core.BlackNode.prototype.add_right = function(a) {
  return a.balance_right(this)
};
cljs.core.BlackNode.prototype.redden = function() {
  return new cljs.core.RedNode(this.key, this.val, this.left, this.right)
};
cljs.core.BlackNode.prototype.remove_right = function(a) {
  return cljs.core.balance_right_del.call(null, this.key, this.val, this.left, a)
};
cljs.core.BlackNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.BlackNode(a, b, c, d)
};
cljs.core.BlackNode.prototype.remove_left = function(a) {
  return cljs.core.balance_left_del.call(null, this.key, this.val, a, this.right)
};
cljs.core.BlackNode.prototype.add_left = function(a) {
  return a.balance_left(this)
};
cljs.core.BlackNode.prototype.balance_left = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, this, a.right)
};
cljs.core.BlackNode.prototype.balance_right = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, a.left, this)
};
cljs.core.BlackNode.prototype.blacken = function() {
  return this
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return b.call(null, this.key, this.val)
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return b.call(null, b.call(null, c, this.key))
};
cljs.core.BlackNode.prototype.cljs$core$ISeqable$ = !0;
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return cljs.core.list.call(null, this.key, this.val)
};
cljs.core.BlackNode.prototype.cljs$core$ICounted$ = !0;
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return 2
};
cljs.core.BlackNode.prototype.cljs$core$IStack$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return this.val
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = function() {
  return cljs.core.PersistentVector.fromArray([this.key])
};
cljs.core.BlackNode.prototype.cljs$core$IVector$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val]), b, c)
};
cljs.core.BlackNode.prototype.cljs$core$IEquiv$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val]), b)
};
cljs.core.BlackNode.prototype.cljs$core$IMeta$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return 0 === b ? this.key : 1 === b ? this.val : null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : c
};
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.PersistentVector.fromArray([])
};
cljs.core.BlackNode;
cljs.core.RedNode = function(a, b, c, d) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d
};
cljs.core.RedNode.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.RedNode")
};
cljs.core.RedNode.prototype.cljs$core$IHash$ = !0;
cljs.core.RedNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$ = !0;
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, a, b, null)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, a, b, c)
};
cljs.core.RedNode.prototype.cljs$core$IAssociative$ = !0;
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val]), b, c)
};
cljs.core.RedNode.prototype.cljs$core$IFn$ = !0;
cljs.core.RedNode.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.RedNode.prototype.cljs$core$ISequential$ = !0;
cljs.core.RedNode.prototype.cljs$core$ICollection$ = !0;
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.PersistentVector.fromArray([this.key, this.val, b])
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$ = !0;
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function() {
  return this.key
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function() {
  return this.val
};
cljs.core.RedNode.prototype.add_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a)
};
cljs.core.RedNode.prototype.redden = function() {
  throw Error("red-black tree invariant violation");
};
cljs.core.RedNode.prototype.remove_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a)
};
cljs.core.RedNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.RedNode(a, b, c, d)
};
cljs.core.RedNode.prototype.remove_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right)
};
cljs.core.RedNode.prototype.add_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right)
};
cljs.core.RedNode.prototype.balance_left = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this.left) ? new cljs.core.RedNode(this.key, this.val, this.left.blacken(), new cljs.core.BlackNode(a.key, a.val, this.right, a.right)) : cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this.right) ? new cljs.core.RedNode(this.right.key, this.right.val, new cljs.core.BlackNode(this.key, this.val, this.left, this.right.left), new cljs.core.BlackNode(a.key, a.val, this.right.right, a.right)) : new cljs.core.BlackNode(a.key, a.val, 
  this, a.right)
};
cljs.core.RedNode.prototype.balance_right = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this.right) ? new cljs.core.RedNode(this.key, this.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left), this.right.blacken()) : cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this.left) ? new cljs.core.RedNode(this.left.key, this.left.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left.left), new cljs.core.BlackNode(this.key, this.val, this.left.right, this.right)) : new cljs.core.BlackNode(a.key, a.val, 
  a.left, this)
};
cljs.core.RedNode.prototype.blacken = function() {
  return new cljs.core.BlackNode(this.key, this.val, this.left, this.right)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$ = !0;
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return b.call(null, this.key, this.val)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return b.call(null, b.call(null, c, this.key))
};
cljs.core.RedNode.prototype.cljs$core$ISeqable$ = !0;
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return cljs.core.list.call(null, this.key, this.val)
};
cljs.core.RedNode.prototype.cljs$core$ICounted$ = !0;
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return 2
};
cljs.core.RedNode.prototype.cljs$core$IStack$ = !0;
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return this.val
};
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = function() {
  return cljs.core.PersistentVector.fromArray([this.key])
};
cljs.core.RedNode.prototype.cljs$core$IVector$ = !0;
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val]), b, c)
};
cljs.core.RedNode.prototype.cljs$core$IEquiv$ = !0;
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.RedNode.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val]), b)
};
cljs.core.RedNode.prototype.cljs$core$IMeta$ = !0;
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$ = !0;
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return 0 === b ? this.key : 1 === b ? this.val : null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : c
};
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.PersistentVector.fromArray([])
};
cljs.core.RedNode;
cljs.core.tree_map_add = function tree_map_add(b, c, d, e, f) {
  if(null == c) {
    return new cljs.core.RedNode(d, e, null, null)
  }
  var g = b.call(null, d, c.key);
  if(0 === g) {
    return f[0] = c, null
  }
  if(0 > g) {
    return b = tree_map_add.call(null, b, c.left, d, e, f), null != b ? c.add_left(b) : null
  }
  b = tree_map_add.call(null, b, c.right, d, e, f);
  return null != b ? c.add_right(b) : null
};
cljs.core.tree_map_append = function tree_map_append(b, c) {
  if(null == b) {
    return c
  }
  if(null == c) {
    return b
  }
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, b)) {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c)) {
      var d = tree_map_append.call(null, b.right, c.left);
      return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d) ? new cljs.core.RedNode(d.key, d.val, new cljs.core.RedNode(b.key, b.val, b.left, d.left), new cljs.core.RedNode(c.key, c.val, d.right, c.right)) : new cljs.core.RedNode(b.key, b.val, new cljs.core.RedNode(c.key, c.val, d, c.right))
    }
    return new cljs.core.RedNode(b.key, b.val, b.left, tree_map_append.call(null, b.right, c))
  }
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c)) {
    return new cljs.core.RedNode(c.key, c.val, tree_map_append.call(null, b, c.left), c.right)
  }
  d = tree_map_append.call(null, b.right, c.left);
  return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d) ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(b.key, b.val, b.left, d.left), new cljs.core.BlackNode(c.key, c.val, d.right, c.right)) : cljs.core.balance_left_del.call(null, b.key, b.val, b.left, new cljs.core.BlackNode(c.key, c.val, d, c.right))
};
cljs.core.tree_map_remove = function tree_map_remove(b, c, d, e) {
  if(null != c) {
    var f = b.call(null, d, c.key);
    if(0 === f) {
      return e[0] = c, cljs.core.tree_map_append.call(null, c.left, c.right)
    }
    if(0 > f) {
      var g = tree_map_remove.call(null, b, c.left, d, e);
      return function() {
        var b = null != g;
        return b ? b : null != e[0]
      }() ? cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, c.left) ? cljs.core.balance_left_del.call(null, c.key, c.val, g, c.right) : new cljs.core.RedNode(c.key, c.val, g, c.right) : null
    }
    var h = tree_map_remove.call(null, b, c.right, d, e);
    return function() {
      var b = null != h;
      return b ? b : null != e[0]
    }() ? cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, c.right) ? cljs.core.balance_right_del.call(null, c.key, c.val, c.left, h) : new cljs.core.RedNode(c.key, c.val, c.left, h) : null
  }
  return null
};
cljs.core.tree_map_replace = function tree_map_replace(b, c, d, e) {
  var f = c.key, g = b.call(null, d, f);
  return 0 === g ? c.replace(f, e, c.left, c.right) : 0 > g ? c.replace(f, c.val, tree_map_replace.call(null, b, c.left, d, e), c.right) : c.replace(f, c.val, c.left, tree_map_replace.call(null, b, c.right, d, e))
};
void 0;
cljs.core.PersistentTreeMap = function(a, b, c, d) {
  this.comp = a;
  this.tree = b;
  this.cnt = c;
  this.meta = d
};
cljs.core.PersistentTreeMap.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.PersistentTreeMap")
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_imap.call(null, a)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, a, b, null)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = a.entry_at(b);
  return null != a ? a.val : c
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = [null], e = cljs.core.tree_map_add.call(null, this.comp, this.tree, b, c, d);
  return null == e ? (d = cljs.core.nth.call(null, d, 0), cljs.core._EQ_.call(null, c, d.val) ? a : new cljs.core.PersistentTreeMap(this.comp, cljs.core.tree_map_replace.call(null, this.comp, this.tree, b, c), this.cnt, this.meta)) : new cljs.core.PersistentTreeMap(this.comp, e.blacken(), this.cnt + 1, this.meta)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null != a.entry_at(b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IFn$ = !0;
cljs.core.PersistentTreeMap.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? cljs.core._assoc.call(null, a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = function() {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, !1, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentTreeMap.prototype.entry_at = function(a) {
  for(var b = this.tree;;) {
    if(null != b) {
      var c = this.comp.call(null, a, b.key);
      if(0 === c) {
        return b
      }
      b = 0 > c ? b.left : b.right
    }else {
      return null
    }
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, b, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  if(0 < this.cnt) {
    for(var a = null, d = this.tree;;) {
      if(null != d) {
        var e = this.comp.call(null, b, d.key);
        if(0 === e) {
          return new cljs.core.PersistentTreeMapSeq(null, cljs.core.conj.call(null, a, d), c, -1)
        }
        cljs.core.truth_(c) ? 0 > e ? (a = cljs.core.conj.call(null, a, d), d = d.left) : d = d.right : 0 < e ? (a = cljs.core.conj.call(null, a, d), d = d.right) : d = d.left
      }else {
        return null == a ? new cljs.core.PersistentTreeMapSeq(null, a, c, -1) : null
      }
    }
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return cljs.core.key.call(null, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = function() {
  return this.comp
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, !0, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.cnt
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMap(this.comp, this.tree, this.cnt, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeMap.EMPTY, this.meta)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c = [null], d = cljs.core.tree_map_remove.call(null, this.comp, this.tree, b, c);
  return null == d ? null == cljs.core.nth.call(null, c, 0) ? a : new cljs.core.PersistentTreeMap(this.comp, null, 0, this.meta) : new cljs.core.PersistentTreeMap(this.comp, d.blacken(), this.cnt - 1, this.meta)
};
cljs.core.PersistentTreeMap;
cljs.core.PersistentTreeMap.EMPTY = new cljs.core.PersistentTreeMap(cljs.core.compare, null, 0, null);
cljs.core.hash_map = function() {
  var a = function(a) {
    for(var a = cljs.core.seq.call(null, a), b = cljs.core.PersistentHashMap.EMPTY;;) {
      if(cljs.core.truth_(a)) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a)), a = e
      }else {
        return b
      }
    }
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.sorted_map = function() {
  var a = function(a) {
    for(var a = cljs.core.seq.call(null, a), b = cljs.core.PersistentTreeMap.EMPTY;;) {
      if(cljs.core.truth_(a)) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a)), a = e
      }else {
        return b
      }
    }
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.sorted_map_by = function() {
  var a = function(a, b) {
    for(var e = cljs.core.seq.call(null, b), f = new cljs.core.PersistentTreeMap(a, null, 0, null);;) {
      if(cljs.core.truth_(e)) {
        var g = cljs.core.nnext.call(null, e), f = cljs.core.assoc.call(null, f, cljs.core.first.call(null, e), cljs.core.second.call(null, e)), e = g
      }else {
        return f
      }
    }
  }, b = function(b, d) {
    var e = null;
    goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), b = cljs.core.rest(b);
    return a.call(this, d, b)
  };
  return b
}();
cljs.core.keys = function(a) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.first, a))
};
cljs.core.key = function(a) {
  return cljs.core._key.call(null, a)
};
cljs.core.vals = function(a) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.second, a))
};
cljs.core.val = function(a) {
  return cljs.core._val.call(null, a)
};
cljs.core.merge = function() {
  var a = function(a) {
    return cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, a)) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.conj.call(null, cljs.core.truth_(a) ? a : cljs.core.PersistentHashMap.fromArrays([], []), b)
    }, a) : null
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.merge_with = function() {
  var a = function(a, b) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, b))) {
      var e = function(b, d) {
        var e = cljs.core.first.call(null, d), i = cljs.core.second.call(null, d);
        return cljs.core.contains_QMARK_.call(null, b, e) ? cljs.core.assoc.call(null, b, e, a.call(null, cljs.core.get.call(null, b, e), i)) : cljs.core.assoc.call(null, b, e, i)
      };
      return cljs.core.reduce.call(null, function(a, b) {
        return cljs.core.reduce.call(null, e, cljs.core.truth_(a) ? a : cljs.core.PersistentHashMap.fromArrays([], []), cljs.core.seq.call(null, b))
      }, b)
    }
    return null
  }, b = function(b, d) {
    var e = null;
    goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), b = cljs.core.rest(b);
    return a.call(this, d, b)
  };
  return b
}();
cljs.core.select_keys = function(a, b) {
  for(var c = cljs.core.PersistentHashMap.fromArrays([], []), d = cljs.core.seq.call(null, b);;) {
    if(cljs.core.truth_(d)) {
      var e = cljs.core.first.call(null, d), f = cljs.core.get.call(null, a, e, "\ufdd0'user/not-found"), c = cljs.core.not_EQ_.call(null, f, "\ufdd0'user/not-found") ? cljs.core.assoc.call(null, c, e, f) : c, d = cljs.core.next.call(null, d)
    }else {
      return c
    }
  }
};
cljs.core.Set = function(a, b) {
  this.meta = a;
  this.hash_map = b
};
cljs.core.Set.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Set")
};
cljs.core.Set.prototype.cljs$core$IHash$ = !0;
cljs.core.Set.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_iset.call(null, a)
};
cljs.core.Set.prototype.cljs$core$ILookup$ = !0;
cljs.core.Set.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, a, b, null)
};
cljs.core.Set.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this.hash_map, b)) ? b : c
};
cljs.core.Set.prototype.cljs$core$IFn$ = !0;
cljs.core.Set.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Set.prototype.cljs$core$ICollection$ = !0;
cljs.core.Set.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.Set(this.meta, cljs.core.assoc.call(null, this.hash_map, b, null))
};
cljs.core.Set.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.Set.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Set.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return cljs.core.keys.call(null, this.hash_map)
};
cljs.core.Set.prototype.cljs$core$ISet$ = !0;
cljs.core.Set.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.Set(this.meta, cljs.core.dissoc.call(null, this.hash_map, b))
};
cljs.core.Set.prototype.cljs$core$ICounted$ = !0;
cljs.core.Set.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.count.call(null, cljs.core.seq.call(null, a))
};
cljs.core.Set.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Set.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = cljs.core.set_QMARK_.call(null, b);
  return c ? (c = cljs.core._EQ_.call(null, cljs.core.count.call(null, a), cljs.core.count.call(null, b))) ? cljs.core.every_QMARK_.call(null, function(b) {
    return cljs.core.contains_QMARK_.call(null, a, b)
  }, b) : c : c
};
cljs.core.Set.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Set.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Set(b, this.hash_map)
};
cljs.core.Set.prototype.cljs$core$IMeta$ = !0;
cljs.core.Set.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.Set.EMPTY, this.meta)
};
cljs.core.Set;
cljs.core.Set.EMPTY = new cljs.core.Set(null, cljs.core.hash_map.call(null));
cljs.core.PersistentTreeSet = function(a, b) {
  this.meta = a;
  this.tree_map = b
};
cljs.core.PersistentTreeSet.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.PersistentTreeSet")
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_iset.call(null, a)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, a, b, null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this.tree_map, b)) ? b : c
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IFn$ = !0;
cljs.core.PersistentTreeSet.prototype.call = function() {
  return function(a, b, c) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, b);
      case 3:
        return cljs.core._lookup.call(null, this, b, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.assoc.call(null, this.tree_map, b, null))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = function() {
  return cljs.core.map.call(null, cljs.core.key, cljs.core.rseq.call(null, this.tree_map))
};
cljs.core.PersistentTreeSet.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq.call(null, this.tree_map, b))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq_from.call(null, this.tree_map, b, c))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return b
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = function() {
  return cljs.core._comparator.call(null, this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return cljs.core.keys.call(null, this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.dissoc.call(null, this.tree_map, b))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return cljs.core.count.call(null, this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = cljs.core.set_QMARK_.call(null, b);
  return c ? (c = cljs.core._EQ_.call(null, cljs.core.count.call(null, a), cljs.core.count.call(null, b))) ? cljs.core.every_QMARK_.call(null, function(b) {
    return cljs.core.contains_QMARK_.call(null, a, b)
  }, b) : c : c
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(b, this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeSet.EMPTY, this.meta)
};
cljs.core.PersistentTreeSet;
cljs.core.PersistentTreeSet.EMPTY = new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map.call(null));
cljs.core.set = function(a) {
  for(var a = cljs.core.seq.call(null, a), b = cljs.core.Set.EMPTY;;) {
    if(cljs.core.not.call(null, cljs.core.empty_QMARK_.call(null, a))) {
      var c = cljs.core.rest.call(null, a), b = cljs.core.conj.call(null, b, cljs.core.first.call(null, a)), a = c
    }else {
      return b
    }
  }
};
cljs.core.sorted_set = function() {
  var a = function(a) {
    return cljs.core.reduce.call(null, cljs.core._conj, cljs.core.PersistentTreeSet.EMPTY, a)
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.sorted_set_by = function() {
  var a = function(a, b) {
    return cljs.core.reduce.call(null, cljs.core._conj, new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map_by.call(null, a)), b)
  }, b = function(b, d) {
    var e = null;
    goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), b = cljs.core.rest(b);
    return a.call(this, d, b)
  };
  return b
}();
cljs.core.replace = function(a, b) {
  if(cljs.core.vector_QMARK_.call(null, b)) {
    var c = cljs.core.count.call(null, b);
    return cljs.core.reduce.call(null, function(b, c) {
      var f = cljs.core.find.call(null, a, cljs.core.nth.call(null, b, c));
      return cljs.core.truth_(f) ? cljs.core.assoc.call(null, b, c, cljs.core.second.call(null, f)) : b
    }, b, cljs.core.take.call(null, c, cljs.core.iterate.call(null, cljs.core.inc, 0)))
  }
  return cljs.core.map.call(null, function(b) {
    var c = cljs.core.find.call(null, a, b);
    return cljs.core.truth_(c) ? cljs.core.second.call(null, c) : b
  }, b)
};
cljs.core.distinct = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      return function(a, d) {
        for(;;) {
          var e = a, i = cljs.core.nth.call(null, e, 0, null), e = cljs.core.seq.call(null, e);
          if(cljs.core.truth_(e)) {
            if(cljs.core.contains_QMARK_.call(null, d, i)) {
              i = cljs.core.rest.call(null, e);
              e = d;
              a = i;
              d = e
            }else {
              return cljs.core.cons.call(null, i, c.call(null, cljs.core.rest.call(null, e), cljs.core.conj.call(null, d, i)))
            }
          }else {
            return null
          }
        }
      }.call(null, a, e)
    })
  }.call(null, a, cljs.core.set([]))
};
cljs.core.butlast = function(a) {
  for(var b = cljs.core.PersistentVector.fromArray([]);;) {
    if(cljs.core.truth_(cljs.core.next.call(null, a))) {
      b = cljs.core.conj.call(null, b, cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a)
    }else {
      return cljs.core.seq.call(null, b)
    }
  }
};
cljs.core.name = function(a) {
  if(cljs.core.string_QMARK_.call(null, a)) {
    return a
  }
  var b = cljs.core.keyword_QMARK_.call(null, a);
  if(b ? b : cljs.core.symbol_QMARK_.call(null, a)) {
    return b = a.lastIndexOf("/"), 0 > b ? cljs.core.subs.call(null, a, 2) : cljs.core.subs.call(null, a, b + 1)
  }
  throw Error(cljs.core.str.call(null, "Doesn't support name: ", a));
};
cljs.core.namespace = function(a) {
  var b = cljs.core.keyword_QMARK_.call(null, a);
  if(b ? b : cljs.core.symbol_QMARK_.call(null, a)) {
    return b = a.lastIndexOf("/"), -1 < b ? cljs.core.subs.call(null, a, 2, b) : null
  }
  throw Error(cljs.core.str.call(null, "Doesn't support namespace: ", a));
};
cljs.core.zipmap = function(a, b) {
  for(var c = cljs.core.PersistentHashMap.fromArrays([], []), d = cljs.core.seq.call(null, a), e = cljs.core.seq.call(null, b);;) {
    if(cljs.core.truth_(function() {
      var a = d;
      return cljs.core.truth_(a) ? e : a
    }())) {
      var c = cljs.core.assoc.call(null, c, cljs.core.first.call(null, d), cljs.core.first.call(null, e)), f = cljs.core.next.call(null, d), g = cljs.core.next.call(null, e), d = f, e = g
    }else {
      return c
    }
  }
};
cljs.core.max_key = function() {
  var a = null, b = function(a, b, c) {
    return a.call(null, b) > a.call(null, c) ? b : c
  }, c = function() {
    var b = function(b, c, d, e) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d)
      }, a.call(null, b, c, d), e)
    }, c = function(a, c, e, i) {
      var j = null;
      goog.isDef(i) && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, j)
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), e = cljs.core.first(cljs.core.next(a)), i = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return b.call(this, c, e, i, a)
    };
    return c
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return e;
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$2 = function(a, b) {
    return b
  };
  a.cljs$lang$arity$3 = b;
  a.cljs$lang$arity$4 = c;
  return a
}();
cljs.core.min_key = function() {
  var a = null, b = function(a, b, c) {
    return a.call(null, b) < a.call(null, c) ? b : c
  }, c = function() {
    var b = function(b, c, d, e) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d)
      }, a.call(null, b, c, d), e)
    }, c = function(a, c, e, i) {
      var j = null;
      goog.isDef(i) && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, j)
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), e = cljs.core.first(cljs.core.next(a)), i = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return b.call(this, c, e, i, a)
    };
    return c
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return e;
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$2 = function(a, b) {
    return b
  };
  a.cljs$lang$arity$3 = b;
  a.cljs$lang$arity$4 = c;
  return a
}();
cljs.core.partition_all = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, b, c)
  }, c = function(b, c, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      return cljs.core.truth_(g) ? cljs.core.cons.call(null, cljs.core.take.call(null, b, g), a.call(null, b, c, cljs.core.drop.call(null, c, g))) : null
    })
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.take_while = function take_while(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    return cljs.core.truth_(d) ? cljs.core.truth_(b.call(null, cljs.core.first.call(null, d))) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_while.call(null, b, cljs.core.rest.call(null, d))) : null : null
  })
};
cljs.core.mk_bound_fn = function(a, b, c) {
  return function(d) {
    var e = cljs.core._comparator.call(null, a);
    return b.call(null, e.call(null, cljs.core._entry_key.call(null, a, d), c), 0)
  }
};
cljs.core.subseq = function() {
  var a = null, b = function(a, b, c) {
    var g = cljs.core.mk_bound_fn.call(null, a, b, c);
    return cljs.core.truth_(cljs.core.set([cljs.core._GT_, cljs.core._GT__EQ_]).call(null, b)) ? (a = cljs.core._sorted_seq_from.call(null, a, c, !0), cljs.core.truth_(a) ? (b = cljs.core.nth.call(null, a, 0, null), cljs.core.truth_(g.call(null, b)) ? a : cljs.core.next.call(null, a)) : null) : cljs.core.take_while.call(null, g, cljs.core._sorted_seq.call(null, a, !0))
  }, c = function(a, b, c, g, h) {
    var i = cljs.core._sorted_seq_from.call(null, a, c, !0);
    if(cljs.core.truth_(i)) {
      var j = cljs.core.nth.call(null, i, 0, null);
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, a, g, h), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, a, b, c).call(null, j)) ? i : cljs.core.next.call(null, i))
    }
    return null
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$3 = b;
  a.cljs$lang$arity$5 = c;
  return a
}();
cljs.core.Range = function(a, b, c, d) {
  this.meta = a;
  this.start = b;
  this.end = c;
  this.step = d
};
cljs.core.Range.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Range")
};
cljs.core.Range.prototype.cljs$core$IHash$ = !0;
cljs.core.Range.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Range.prototype.cljs$core$ISequential$ = !0;
cljs.core.Range.prototype.cljs$core$ICollection$ = !0;
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.Range.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.Range.prototype.cljs$core$IReduce$ = !0;
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.Range.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.truth_((0 < this.step ? cljs.core._LT_ : cljs.core._GT_).call(null, this.start, this.end)) ? a : null
};
cljs.core.Range.prototype.cljs$core$ICounted$ = !0;
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.not.call(null, cljs.core._seq.call(null, a)) ? 0 : Math.ceil((this.end - this.start) / this.step)
};
cljs.core.Range.prototype.cljs$core$ISeq$ = !0;
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return this.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.truth_(cljs.core._seq.call(null, a)) ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step) : cljs.core.list.call(null)
};
cljs.core.Range.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Range(b, this.start, this.end, this.step)
};
cljs.core.Range.prototype.cljs$core$IMeta$ = !0;
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$ = !0;
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if(b < cljs.core._count.call(null, a)) {
    return this.start + b * this.step
  }
  var c = this.start > this.end;
  if(c ? cljs.core._EQ_.call(null, this.step, 0) : c) {
    return this.start
  }
  throw Error("Index out of bounds");
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  c = b < cljs.core._count.call(null, a) ? this.start + b * this.step : ((a = this.start > this.end) ? cljs.core._EQ_.call(null, this.step, 0) : a) ? this.start : c;
  return c
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.Range;
cljs.core.range = function() {
  var a = null, b = function() {
    return a.call(null, 0, Number.MAX_VALUE, 1)
  }, c = function(b) {
    return a.call(null, 0, b, 1)
  }, d = function(b, c) {
    return a.call(null, b, c, 1)
  }, e = function(a, b, c) {
    return new cljs.core.Range(null, a, b, c)
  }, a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      case 3:
        return e.call(this, a, g, h)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$0 = b;
  a.cljs$lang$arity$1 = c;
  a.cljs$lang$arity$2 = d;
  a.cljs$lang$arity$3 = e;
  return a
}();
cljs.core.take_nth = function take_nth(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    return cljs.core.truth_(d) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_nth.call(null, b, cljs.core.drop.call(null, b, d))) : null
  })
};
cljs.core.split_with = function(a, b) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take_while.call(null, a, b), cljs.core.drop_while.call(null, a, b)])
};
cljs.core.partition_by = function partition_by(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(cljs.core.truth_(d)) {
      var e = cljs.core.first.call(null, d), f = b.call(null, e), e = cljs.core.cons.call(null, e, cljs.core.take_while.call(null, function(c) {
        return cljs.core._EQ_.call(null, f, b.call(null, c))
      }, cljs.core.next.call(null, d)));
      return cljs.core.cons.call(null, e, partition_by.call(null, b, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, e), d))))
    }
    return null
  })
};
cljs.core.frequencies = function(a) {
  return cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.assoc.call(null, a, c, cljs.core.get.call(null, a, c, 0) + 1)
  }, cljs.core.PersistentHashMap.fromArrays([], []), a)
};
cljs.core.reductions = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, c);
      return cljs.core.truth_(f) ? a.call(null, b, cljs.core.first.call(null, f), cljs.core.rest.call(null, f)) : cljs.core.list.call(null, b.call(null))
    })
  }, c = function(b, c, f) {
    return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      return cljs.core.truth_(g) ? a.call(null, b, b.call(null, c, cljs.core.first.call(null, g)), cljs.core.rest.call(null, g)) : null
    }))
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.juxt = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function() {
        var b = function(b, c, d, e) {
          var g = null;
          goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, b, c, d, g))
        };
        b.cljs$lang$maxFixedArity = 3;
        b.cljs$lang$applyTo = function(b) {
          var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, c, d, e, b))
        };
        return b
      }(), b = function(b, d, e, g) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, b));
          case 2:
            return cljs.core.vector.call(null, a.call(null, b, d));
          case 3:
            return cljs.core.vector.call(null, a.call(null, b, d, e));
          default:
            return c.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = c.cljs$lang$applyTo;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, e, h) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, c, d, e, h), cljs.core.apply.call(null, b, c, d, e, h))
        }, d = function(a, b, d, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return c.call(this, b, d, e, a)
        };
        return d
      }(), c = function(c, e, h, m) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null), b.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, c), b.call(null, c));
          case 2:
            return cljs.core.vector.call(null, a.call(null, c, e), b.call(null, c, e));
          case 3:
            return cljs.core.vector.call(null, a.call(null, c, e, h), b.call(null, c, e, h));
          default:
            return d.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        var d = function(d, e, i, j) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, d, e, i, j), cljs.core.apply.call(null, b, d, e, i, j), cljs.core.apply.call(null, c, d, e, i, j))
        }, e = function(a, b, c, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return d.call(this, b, c, e, a)
        };
        return e
      }(), d = function(d, i, m, n) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null), b.call(null), c.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, d), b.call(null, d), c.call(null, d));
          case 2:
            return cljs.core.vector.call(null, a.call(null, d, i), b.call(null, d, i), c.call(null, d, i));
          case 3:
            return cljs.core.vector.call(null, a.call(null, d, i, m), b.call(null, d, i, m), c.call(null, d, i, m));
          default:
            return e.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function() {
          return cljs.core.reduce.call(null, function(a, b) {
            return cljs.core.conj.call(null, a, b.call(null))
          }, cljs.core.PersistentVector.fromArray([]), e)
        }, c = function(a) {
          return cljs.core.reduce.call(null, function(b, c) {
            return cljs.core.conj.call(null, b, c.call(null, a))
          }, cljs.core.PersistentVector.fromArray([]), e)
        }, d = function(a, b) {
          return cljs.core.reduce.call(null, function(c, d) {
            return cljs.core.conj.call(null, c, d.call(null, a, b))
          }, cljs.core.PersistentVector.fromArray([]), e)
        }, f = function(a, b, c) {
          return cljs.core.reduce.call(null, function(d, e) {
            return cljs.core.conj.call(null, d, e.call(null, a, b, c))
          }, cljs.core.PersistentVector.fromArray([]), e)
        }, g = function() {
          var a = function(a, b, c, d) {
            return cljs.core.reduce.call(null, function(e, f) {
              return cljs.core.conj.call(null, e, cljs.core.apply.call(null, f, a, b, c, d))
            }, cljs.core.PersistentVector.fromArray([]), e)
          }, b = function(b, c, d, e) {
            var f = null;
            goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return a.call(this, b, c, d, f)
          };
          b.cljs$lang$maxFixedArity = 3;
          b.cljs$lang$applyTo = function(b) {
            var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
            return a.call(this, c, d, e, b)
          };
          return b
        }(), a = function(a, e, h, i) {
          switch(arguments.length) {
            case 0:
              return b.call(this);
            case 1:
              return c.call(this, a);
            case 2:
              return d.call(this, a, e);
            case 3:
              return f.call(this, a, e, h);
            default:
              return g.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = g.cljs$lang$applyTo;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, e, b)
    };
    return b
  }(), a = function(a, g, h, i) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  a.cljs$lang$arity$3 = d;
  a.cljs$lang$arity$4 = e;
  return a
}();
cljs.core.dorun = function() {
  var a = null, b = function(a) {
    for(;;) {
      if(cljs.core.truth_(cljs.core.seq.call(null, a))) {
        a = cljs.core.next.call(null, a)
      }else {
        return null
      }
    }
  }, c = function(a, b) {
    for(;;) {
      if(cljs.core.truth_(function() {
        var c = cljs.core.seq.call(null, b);
        return cljs.core.truth_(c) ? 0 < a : c
      }())) {
        var c = a - 1, g = cljs.core.next.call(null, b), a = c, b = g
      }else {
        return null
      }
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.doall = function() {
  var a = null, b = function(a) {
    cljs.core.dorun.call(null, a);
    return a
  }, c = function(a, b) {
    cljs.core.dorun.call(null, a, b);
    return b
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.re_matches = function(a, b) {
  var c = a.exec(b);
  return cljs.core._EQ_.call(null, cljs.core.first.call(null, c), b) ? cljs.core._EQ_.call(null, cljs.core.count.call(null, c), 1) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c) : null
};
cljs.core.re_find = function(a, b) {
  var c = a.exec(b);
  return null === c ? null : cljs.core._EQ_.call(null, cljs.core.count.call(null, c), 1) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c)
};
cljs.core.re_seq = function re_seq(b, c) {
  var d = cljs.core.re_find.call(null, b, c), e = c.search(b), f = cljs.core.coll_QMARK_.call(null, d) ? cljs.core.first.call(null, d) : d, g = cljs.core.subs.call(null, c, e + cljs.core.count.call(null, f));
  return cljs.core.truth_(d) ? new cljs.core.LazySeq(null, !1, function() {
    return cljs.core.cons.call(null, d, re_seq.call(null, b, g))
  }) : null
};
cljs.core.re_pattern = function(a) {
  var b = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, a);
  cljs.core.nth.call(null, b, 0, null);
  a = cljs.core.nth.call(null, b, 1, null);
  b = cljs.core.nth.call(null, b, 2, null);
  return RegExp(b, a)
};
cljs.core.pr_sequential = function(a, b, c, d, e, f) {
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([b]), cljs.core.flatten1.call(null, cljs.core.interpose.call(null, cljs.core.PersistentVector.fromArray([c]), cljs.core.map.call(null, function(b) {
    return a.call(null, b, e)
  }, f))), cljs.core.PersistentVector.fromArray([d]))
};
cljs.core.string_print = function(a) {
  cljs.core._STAR_print_fn_STAR_.call(null, a);
  return null
};
cljs.core.flush = function() {
  return null
};
cljs.core.pr_seq = function pr_seq(b, c) {
  return null === b ? cljs.core.list.call(null, "nil") : void 0 === b ? cljs.core.list.call(null, "#<undefined>") : cljs.core.concat.call(null, cljs.core.truth_(function() {
    var d = cljs.core.get.call(null, c, "\ufdd0'meta");
    return cljs.core.truth_(d) ? (d = function() {
      return cljs.core.truth_(function() {
        if(cljs.core.truth_(b)) {
          var c = b.cljs$core$IMeta$;
          return cljs.core.truth_(c) ? cljs.core.not.call(null, b.hasOwnProperty("cljs$core$IMeta$")) : c
        }
        return b
      }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IMeta, b)
    }(), cljs.core.truth_(d) ? cljs.core.meta.call(null, b) : d) : d
  }()) ? cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["^"]), pr_seq.call(null, cljs.core.meta.call(null, b), c), cljs.core.PersistentVector.fromArray([" "])) : null, cljs.core.truth_(function() {
    return cljs.core.truth_(function() {
      if(cljs.core.truth_(b)) {
        var c = b.cljs$core$IPrintable$;
        return cljs.core.truth_(c) ? cljs.core.not.call(null, b.hasOwnProperty("cljs$core$IPrintable$")) : c
      }
      return b
    }()) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, b)
  }()) ? cljs.core._pr_seq.call(null, b, c) : cljs.core.list.call(null, "#<", cljs.core.str.call(null, b), ">"))
};
cljs.core.pr_sb = function(a, b) {
  var c = cljs.core.first.call(null, a), d = new goog.string.StringBuffer, e = cljs.core.seq.call(null, a);
  if(cljs.core.truth_(e)) {
    for(var f = cljs.core.first.call(null, e);;) {
      f !== c && d.append(" ");
      var g = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, f, b));
      if(cljs.core.truth_(g)) {
        for(f = cljs.core.first.call(null, g);;) {
          if(d.append(f), f = cljs.core.next.call(null, g), cljs.core.truth_(f)) {
            g = f, f = cljs.core.first.call(null, g)
          }else {
            break
          }
        }
      }
      e = cljs.core.next.call(null, e);
      if(cljs.core.truth_(e)) {
        f = e, e = cljs.core.first.call(null, f), g = f, f = e, e = g
      }else {
        break
      }
    }
  }
  return d
};
cljs.core.pr_str_with_opts = function(a, b) {
  return cljs.core.str.call(null, cljs.core.pr_sb.call(null, a, b))
};
cljs.core.prn_str_with_opts = function(a, b) {
  var c = cljs.core.pr_sb.call(null, a, b);
  c.append("\n");
  return cljs.core.str.call(null, c)
};
cljs.core.pr_with_opts = function(a, b) {
  var c = cljs.core.first.call(null, a), d = cljs.core.seq.call(null, a);
  if(cljs.core.truth_(d)) {
    for(var e = cljs.core.first.call(null, d);;) {
      e !== c && cljs.core.string_print.call(null, " ");
      var f = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, e, b));
      if(cljs.core.truth_(f)) {
        for(e = cljs.core.first.call(null, f);;) {
          if(cljs.core.string_print.call(null, e), e = cljs.core.next.call(null, f), cljs.core.truth_(e)) {
            f = e, e = cljs.core.first.call(null, f)
          }else {
            break
          }
        }
      }
      d = cljs.core.next.call(null, d);
      if(cljs.core.truth_(d)) {
        e = d, d = cljs.core.first.call(null, e), f = e, e = d, d = f
      }else {
        return null
      }
    }
  }else {
    return null
  }
};
cljs.core.newline = function(a) {
  cljs.core.string_print.call(null, "\n");
  return cljs.core.truth_(cljs.core.get.call(null, a, "\ufdd0'flush-on-newline")) ? cljs.core.flush.call(null) : null
};
cljs.core._STAR_flush_on_newline_STAR_ = !0;
cljs.core._STAR_print_readably_STAR_ = !0;
cljs.core._STAR_print_meta_STAR_ = !1;
cljs.core._STAR_print_dup_STAR_ = !1;
cljs.core.pr_opts = function() {
  return cljs.core.PersistentHashMap.fromArrays(["\ufdd0'flush-on-newline", "\ufdd0'readably", "\ufdd0'meta", "\ufdd0'dup"], [cljs.core._STAR_flush_on_newline_STAR_, cljs.core._STAR_print_readably_STAR_, cljs.core._STAR_print_meta_STAR_, cljs.core._STAR_print_dup_STAR_])
};
cljs.core.pr_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.prn_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.pr = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.print = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", !1))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.print_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", !1))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.println = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", !1));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.println_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", !1))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.prn = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = !0;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, function(a) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
cljs.core.IPrintable.number = !0;
cljs.core._pr_seq.number = function(a) {
  return cljs.core.list.call(null, cljs.core.str.call(null, a))
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.Subvec.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Subvec.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", b, a)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintable$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, function(a) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
cljs.core.LazySeq.prototype.cljs$core$IPrintable$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintable$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#{", " ", "}", b, a)
};
cljs.core.IPrintable["boolean"] = !0;
cljs.core._pr_seq["boolean"] = function(a) {
  return cljs.core.list.call(null, cljs.core.str.call(null, a))
};
cljs.core.Set.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Set.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#{", " ", "}", b, a)
};
cljs.core.IPrintable.string = !0;
cljs.core._pr_seq.string = function(a, b) {
  return cljs.core.keyword_QMARK_.call(null, a) ? cljs.core.list.call(null, cljs.core.str.call(null, ":", function() {
    var b = cljs.core.namespace.call(null, a);
    return cljs.core.truth_(b) ? cljs.core.str.call(null, b, "/") : null
  }(), cljs.core.name.call(null, a))) : cljs.core.symbol_QMARK_.call(null, a) ? cljs.core.list.call(null, cljs.core.str.call(null, function() {
    var b = cljs.core.namespace.call(null, a);
    return cljs.core.truth_(b) ? cljs.core.str.call(null, b, "/") : null
  }(), cljs.core.name.call(null, a))) : cljs.core.list.call(null, cljs.core.truth_("\ufdd0'readably".call(null, b)) ? goog.string.quote.call(null, a) : a)
};
cljs.core.NodeSeq.prototype.cljs$core$IPrintable$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.RedNode.prototype.cljs$core$IPrintable$ = !0;
cljs.core.RedNode.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", b, a)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintable$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, function(a) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
cljs.core.Vector.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Vector.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", b, a)
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", b, a)
};
cljs.core.List.prototype.cljs$core$IPrintable$ = !0;
cljs.core.List.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.IPrintable.array = !0;
cljs.core._pr_seq.array = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#<Array [", ", ", "]>", b, a)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintable$ = !0;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.IPrintable["function"] = !0;
cljs.core._pr_seq["function"] = function(a) {
  return cljs.core.list.call(null, "#<", cljs.core.str.call(null, a), ">")
};
cljs.core.EmptyList.prototype.cljs$core$IPrintable$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function() {
  return cljs.core.list.call(null, "()")
};
cljs.core.BlackNode.prototype.cljs$core$IPrintable$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", b, a)
};
cljs.core.Cons.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Cons.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.Range.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Range.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintable$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.ObjMap.prototype.cljs$core$IPrintable$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, function(a) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintable$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.Atom = function(a, b, c, d) {
  this.state = a;
  this.meta = b;
  this.validator = c;
  this.watches = d
};
cljs.core.Atom.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Atom")
};
cljs.core.Atom.prototype.cljs$core$IHash$ = !0;
cljs.core.Atom.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid.call(null, a)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$ = !0;
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = function(a, b, c) {
  var d = cljs.core.seq.call(null, this.watches);
  if(cljs.core.truth_(d)) {
    var e = cljs.core.first.call(null, d);
    cljs.core.nth.call(null, e, 0, null);
    for(cljs.core.nth.call(null, e, 1, null);;) {
      var f = e, e = cljs.core.nth.call(null, f, 0, null), f = cljs.core.nth.call(null, f, 1, null);
      f.call(null, e, a, b, c);
      d = cljs.core.next.call(null, d);
      if(cljs.core.truth_(d)) {
        e = d, d = cljs.core.first.call(null, e), f = e, e = d, d = f
      }else {
        return null
      }
    }
  }else {
    return null
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = function(a, b, c) {
  return a.watches = cljs.core.assoc.call(null, this.watches, b, c)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = function(a, b) {
  return a.watches = cljs.core.dissoc.call(null, this.watches, b)
};
cljs.core.Atom.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, b) {
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["#<Atom: "]), cljs.core._pr_seq.call(null, this.state, b), ">")
};
cljs.core.Atom.prototype.cljs$core$IMeta$ = !0;
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$ = !0;
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = function() {
  return this.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return a === b
};
cljs.core.Atom;
cljs.core.atom = function() {
  var a = null, b = function(a) {
    return new cljs.core.Atom(a, null, null, null)
  }, c = function() {
    var a = function(a, b) {
      var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core.get.call(null, c, "\ufdd0'validator"), c = cljs.core.get.call(null, c, "\ufdd0'meta");
      return new cljs.core.Atom(a, c, d, null)
    }, b = function(b, c) {
      var e = null;
      goog.isDef(c) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, e)
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), b = cljs.core.rest(b);
      return a.call(this, c, b)
    };
    return b
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.reset_BANG_ = function(a, b) {
  var c = a.validator;
  if(cljs.core.truth_(c) && !cljs.core.truth_(c.call(null, b))) {
    throw Error(cljs.core.str.call(null, "Assert failed: ", "Validator rejected reference state", "\n", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'validate", "\ufdd1'new-value"), cljs.core.hash_map("\ufdd0'line", 5057)))));
  }
  c = a.state;
  a.state = b;
  cljs.core._notify_watches.call(null, a, c, b);
  return b
};
cljs.core.swap_BANG_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state))
  }, c = function(a, b, c) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c))
  }, d = function(a, b, c, d) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c, d))
  }, e = function(a, b, c, d, e) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c, d, e))
  }, f = function() {
    var a = function(a, b, c, d, e, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, b, a.state, c, d, e, g))
    };
    a.cljs$lang$maxFixedArity = 5;
    a.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), e = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a)))), f = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a))))), a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a)))));
      return cljs.core.reset_BANG_.call(null, b, cljs.core.apply.call(null, c, b.state, d, e, f, a))
    };
    return a
  }(), a = function(a, h, i, j, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, h);
      case 3:
        return c.call(this, a, h, i);
      case 4:
        return d.call(this, a, h, i, j);
      case 5:
        return e.call(this, a, h, i, j, k);
      default:
        return f.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  a.cljs$lang$arity$4 = d;
  a.cljs$lang$arity$5 = e;
  a.cljs$lang$arity$6 = f;
  return a
}();
cljs.core.compare_and_set_BANG_ = function(a, b, c) {
  return cljs.core._EQ_.call(null, a.state, b) ? (cljs.core.reset_BANG_.call(null, a, c), !0) : !1
};
cljs.core.deref = function(a) {
  return cljs.core._deref.call(null, a)
};
cljs.core.set_validator_BANG_ = function(a, b) {
  return a.validator = b
};
cljs.core.get_validator = function(a) {
  return a.validator
};
cljs.core.alter_meta_BANG_ = function() {
  var a = function(a, c, d) {
    var e = null;
    goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.meta = cljs.core.apply.call(null, c, a.meta, e)
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
    return c.meta = cljs.core.apply.call(null, d, c.meta, a)
  };
  return a
}();
cljs.core.reset_meta_BANG_ = function(a, b) {
  return a.meta = b
};
cljs.core.add_watch = function(a, b, c) {
  return cljs.core._add_watch.call(null, a, b, c)
};
cljs.core.remove_watch = function(a, b) {
  return cljs.core._remove_watch.call(null, a, b)
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var a = null, b = function() {
    return a.call(null, "G__")
  }, c = function(a) {
    null === cljs.core.gensym_counter && (cljs.core.gensym_counter = cljs.core.atom.call(null, 0));
    return cljs.core.symbol.call(null, cljs.core.str.call(null, a, cljs.core.swap_BANG_.call(null, cljs.core.gensym_counter, cljs.core.inc)))
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$0 = b;
  a.cljs$lang$arity$1 = c;
  return a
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(a, b) {
  this.state = a;
  this.f = b
};
cljs.core.Delay.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.Delay")
};
cljs.core.Delay.prototype.cljs$core$IPending$ = !0;
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = function() {
  return"\ufdd0'done".call(null, cljs.core.deref.call(null, this.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$ = !0;
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = function() {
  var a = this;
  return"\ufdd0'value".call(null, cljs.core.swap_BANG_.call(null, a.state, function(b) {
    var b = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, c = cljs.core.get.call(null, b, "\ufdd0'done");
    return cljs.core.truth_(c) ? b : cljs.core.PersistentHashMap.fromArrays(["\ufdd0'done", "\ufdd0'value"], [!0, a.f.call(null)])
  }))
};
cljs.core.Delay;
cljs.core.delay_QMARK_ = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.Delay, a)
};
cljs.core.force = function(a) {
  return cljs.core.delay_QMARK_.call(null, a) ? cljs.core.deref.call(null, a) : a
};
cljs.core.realized_QMARK_ = function(a) {
  return cljs.core._realized_QMARK_.call(null, a)
};
cljs.core.js__GT_clj = function() {
  var a = function(a, b) {
    var e = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, e = cljs.core.get.call(null, e, "\ufdd0'keywordize-keys"), f = cljs.core.truth_(e) ? cljs.core.keyword : cljs.core.str;
    return function h(a) {
      return cljs.core.seq_QMARK_.call(null, a) ? cljs.core.doall.call(null, cljs.core.map.call(null, h, a)) : cljs.core.coll_QMARK_.call(null, a) ? cljs.core.into.call(null, cljs.core.empty.call(null, a), cljs.core.map.call(null, h, a)) : cljs.core.truth_(goog.isArray.call(null, a)) ? cljs.core.vec.call(null, cljs.core.map.call(null, h, a)) : cljs.core.type.call(null, a) === Object ? cljs.core.into.call(null, cljs.core.PersistentHashMap.fromArrays([], []), function() {
        return function k(b) {
          return new cljs.core.LazySeq(null, !1, function() {
            for(;;) {
              if(cljs.core.truth_(cljs.core.seq.call(null, b))) {
                var c = cljs.core.first.call(null, b);
                return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([f.call(null, c), h.call(null, a[c])]), k.call(null, cljs.core.rest.call(null, b)))
              }
              return null
            }
          })
        }.call(null, cljs.core.js_keys.call(null, a))
      }()) : a
    }.call(null, a)
  }, b = function(b, d) {
    var e = null;
    goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), b = cljs.core.rest(b);
    return a.call(this, d, b)
  };
  return b
}();
cljs.core.memoize = function(a) {
  var b = cljs.core.atom.call(null, cljs.core.PersistentHashMap.fromArrays([], []));
  return function() {
    var c = function(c) {
      var d = cljs.core.get.call(null, cljs.core.deref.call(null, b), c);
      if(cljs.core.truth_(d)) {
        return d
      }
      d = cljs.core.apply.call(null, a, c);
      cljs.core.swap_BANG_.call(null, b, cljs.core.assoc, c, d);
      return d
    }, d = function(a) {
      var b = null;
      goog.isDef(a) && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return c.call(this, b)
    };
    d.cljs$lang$maxFixedArity = 0;
    d.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return c.call(this, a)
    };
    return d
  }()
};
cljs.core.trampoline = function() {
  var a = null, b = function(a) {
    for(;;) {
      if(a = a.call(null), !cljs.core.fn_QMARK_.call(null, a)) {
        return a
      }
    }
  }, c = function() {
    var b = function(b, c) {
      return a.call(null, function() {
        return cljs.core.apply.call(null, b, c)
      })
    }, c = function(a, c) {
      var e = null;
      goog.isDef(c) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e)
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), a = cljs.core.rest(a);
      return b.call(this, c, a)
    };
    return c
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.rand = function() {
  var a = null, b = function() {
    return a.call(null, 1)
  }, c = function(a) {
    return Math.random() * a
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$0 = b;
  a.cljs$lang$arity$1 = c;
  return a
}();
cljs.core.rand_int = function(a) {
  return Math.floor(Math.random() * a)
};
cljs.core.rand_nth = function(a) {
  return cljs.core.nth.call(null, a, cljs.core.rand_int.call(null, cljs.core.count.call(null, a)))
};
cljs.core.group_by = function(a, b) {
  return cljs.core.reduce.call(null, function(b, d) {
    var e = a.call(null, d);
    return cljs.core.assoc.call(null, b, e, cljs.core.conj.call(null, cljs.core.get.call(null, b, e, cljs.core.PersistentVector.fromArray([])), d))
  }, cljs.core.PersistentHashMap.fromArrays([], []), b)
};
cljs.core.make_hierarchy = function() {
  return cljs.core.PersistentHashMap.fromArrays(["\ufdd0'parents", "\ufdd0'descendants", "\ufdd0'ancestors"], [cljs.core.PersistentHashMap.fromArrays([], []), cljs.core.PersistentHashMap.fromArrays([], []), cljs.core.PersistentHashMap.fromArrays([], [])])
};
cljs.core.global_hierarchy = cljs.core.atom.call(null, cljs.core.make_hierarchy.call(null));
cljs.core.isa_QMARK_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), b, c)
  }, c = function(b, c, f) {
    var g = cljs.core._EQ_.call(null, c, f);
    if(!g && !(g = cljs.core.contains_QMARK_.call(null, "\ufdd0'ancestors".call(null, b).call(null, c), f)) && (g = cljs.core.vector_QMARK_.call(null, f))) {
      if(g = cljs.core.vector_QMARK_.call(null, c)) {
        if(g = cljs.core._EQ_.call(null, cljs.core.count.call(null, f), cljs.core.count.call(null, c))) {
          for(var g = !0, h = 0;;) {
            var i = cljs.core.not.call(null, g);
            if(i ? i : cljs.core._EQ_.call(null, h, cljs.core.count.call(null, f))) {
              return g
            }
            g = a.call(null, b, c.call(null, h), f.call(null, h));
            h += 1
          }
        }else {
          return g
        }
      }else {
        return g
      }
    }else {
      return g
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.parents = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), b)
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'parents".call(null, a), b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.ancestors = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), b)
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'ancestors".call(null, a), b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.descendants = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), b)
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'descendants".call(null, a), b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$1 = b;
  a.cljs$lang$arity$2 = c;
  return a
}();
cljs.core.derive = function() {
  var a = null, b = function(b, c) {
    if(!cljs.core.truth_(cljs.core.namespace.call(null, c))) {
      throw Error(cljs.core.str.call(null, "Assert failed: ", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'namespace", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 5341)))));
    }
    cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, a, b, c);
    return null
  }, c = function(a, b, c) {
    if(!cljs.core.not_EQ_.call(null, b, c)) {
      throw Error(cljs.core.str.call(null, "Assert failed: ", cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'not=", "\ufdd1'tag", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 5345)))));
    }
    var g = "\ufdd0'parents".call(null, a), h = "\ufdd0'descendants".call(null, a), i = "\ufdd0'ancestors".call(null, a), j = function(a, b, c, d, e) {
      return cljs.core.reduce.call(null, function(a, b) {
        return cljs.core.assoc.call(null, a, b, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.get.call(null, e, b, cljs.core.set([])), cljs.core.cons.call(null, d, e.call(null, d))))
      }, a, cljs.core.cons.call(null, b, c.call(null, b)))
    };
    if(cljs.core.contains_QMARK_.call(null, g.call(null, b), c)) {
      b = null
    }else {
      if(cljs.core.contains_QMARK_.call(null, i.call(null, b), c)) {
        throw Error(cljs.core.str.call(null, b, "already has", c, "as ancestor"));
      }
      if(cljs.core.contains_QMARK_.call(null, i.call(null, c), b)) {
        throw Error(cljs.core.str.call(null, "Cyclic derivation:", c, "has", b, "as ancestor"));
      }
      b = cljs.core.PersistentHashMap.fromArrays(["\ufdd0'parents", "\ufdd0'ancestors", "\ufdd0'descendants"], [cljs.core.assoc.call(null, "\ufdd0'parents".call(null, a), b, cljs.core.conj.call(null, cljs.core.get.call(null, g, b, cljs.core.set([])), c)), j.call(null, "\ufdd0'ancestors".call(null, a), b, h, c, i), j.call(null, "\ufdd0'descendants".call(null, a), c, i, b, h)])
    }
    return cljs.core.truth_(b) ? b : a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.underive = function() {
  var a = null, b = function(b, c) {
    cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, a, b, c);
    return null
  }, c = function(a, b, c) {
    var g = "\ufdd0'parents".call(null, a), h = cljs.core.truth_(g.call(null, b)) ? cljs.core.disj.call(null, g.call(null, b), c) : cljs.core.set([]), h = cljs.core.truth_(cljs.core.not_empty.call(null, h)) ? cljs.core.assoc.call(null, g, b, h) : cljs.core.dissoc.call(null, g, b), h = cljs.core.flatten.call(null, cljs.core.map.call(null, function(a) {
      return cljs.core.cons.call(null, cljs.core.first.call(null, a), cljs.core.interpose.call(null, cljs.core.first.call(null, a), cljs.core.second.call(null, a)))
    }, cljs.core.seq.call(null, h)));
    return cljs.core.contains_QMARK_.call(null, g.call(null, b), c) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.apply.call(null, cljs.core.derive, a, b)
    }, cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, h)) : a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$arity$2 = b;
  a.cljs$lang$arity$3 = c;
  return a
}();
cljs.core.reset_cache = function(a, b, c, d) {
  cljs.core.swap_BANG_.call(null, a, function() {
    return cljs.core.deref.call(null, b)
  });
  return cljs.core.swap_BANG_.call(null, c, function() {
    return cljs.core.deref.call(null, d)
  })
};
cljs.core.prefers_STAR_ = function prefers_STAR_(b, c, d) {
  var e = cljs.core.deref.call(null, d).call(null, b), e = cljs.core.truth_(cljs.core.truth_(e) ? e.call(null, c) : e) ? !0 : null;
  if(cljs.core.truth_(e)) {
    return e
  }
  e = function() {
    for(var e = cljs.core.parents.call(null, c);;) {
      if(0 < cljs.core.count.call(null, e)) {
        cljs.core.truth_(prefers_STAR_.call(null, b, cljs.core.first.call(null, e), d)), e = cljs.core.rest.call(null, e)
      }else {
        return null
      }
    }
  }();
  if(cljs.core.truth_(e)) {
    return e
  }
  e = function() {
    for(var e = cljs.core.parents.call(null, b);;) {
      if(0 < cljs.core.count.call(null, e)) {
        cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, e), c, d)), e = cljs.core.rest.call(null, e)
      }else {
        return null
      }
    }
  }();
  return cljs.core.truth_(e) ? e : !1
};
cljs.core.dominates = function(a, b, c) {
  c = cljs.core.prefers_STAR_.call(null, a, b, c);
  return cljs.core.truth_(c) ? c : cljs.core.isa_QMARK_.call(null, a, b)
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(b, c, d, e, f, g, h) {
  var i = cljs.core.reduce.call(null, function(d, e) {
    var g = cljs.core.nth.call(null, e, 0, null);
    cljs.core.nth.call(null, e, 1, null);
    if(cljs.core.isa_QMARK_.call(null, c, g)) {
      var h = cljs.core.truth_(function() {
        var b = null === d;
        return b ? b : cljs.core.dominates.call(null, g, cljs.core.first.call(null, d), f)
      }()) ? e : d;
      if(!cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, h), g, f))) {
        throw Error(cljs.core.str.call(null, "Multiple methods in multimethod '", b, "' match dispatch value: ", c, " -> ", g, " and ", cljs.core.first.call(null, h), ", and neither is preferred"));
      }
      return h
    }
    return d
  }, null, cljs.core.deref.call(null, e));
  if(cljs.core.truth_(i)) {
    if(cljs.core._EQ_.call(null, cljs.core.deref.call(null, h), cljs.core.deref.call(null, d))) {
      return cljs.core.swap_BANG_.call(null, g, cljs.core.assoc, c, cljs.core.second.call(null, i)), cljs.core.second.call(null, i)
    }
    cljs.core.reset_cache.call(null, g, e, h, d);
    return find_and_cache_best_method.call(null, b, c, d, e, f, g, h)
  }
  return null
};
void 0;
cljs.core.IMultiFn = {};
cljs.core._reset = function(a) {
  if(a ? a.cljs$core$IMultiFn$_reset$arity$1 : a) {
    a = a.cljs$core$IMultiFn$_reset$arity$1(a)
  }else {
    var b;
    b = cljs.core._reset[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._reset._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core._add_method = function(a, b, c) {
  if(a ? a.cljs$core$IMultiFn$_add_method$arity$3 : a) {
    a = a.cljs$core$IMultiFn$_add_method$arity$3(a, b, c)
  }else {
    var d;
    d = cljs.core._add_method[goog.typeOf.call(null, a)];
    if(!d && (d = cljs.core._add_method._, !d)) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core._remove_method = function(a, b) {
  var c;
  if(a ? a.cljs$core$IMultiFn$_remove_method$arity$2 : a) {
    c = a.cljs$core$IMultiFn$_remove_method$arity$2(a, b)
  }else {
    c = cljs.core._remove_method[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._remove_method._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core._prefer_method = function(a, b, c) {
  if(a ? a.cljs$core$IMultiFn$_prefer_method$arity$3 : a) {
    a = a.cljs$core$IMultiFn$_prefer_method$arity$3(a, b, c)
  }else {
    var d;
    d = cljs.core._prefer_method[goog.typeOf.call(null, a)];
    if(!d && (d = cljs.core._prefer_method._, !d)) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", a);
    }
    a = d.call(null, a, b, c)
  }
  return a
};
cljs.core._get_method = function(a, b) {
  var c;
  if(a ? a.cljs$core$IMultiFn$_get_method$arity$2 : a) {
    c = a.cljs$core$IMultiFn$_get_method$arity$2(a, b)
  }else {
    c = cljs.core._get_method[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._get_method._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
cljs.core._methods = function(a) {
  if(a ? a.cljs$core$IMultiFn$_methods$arity$1 : a) {
    a = a.cljs$core$IMultiFn$_methods$arity$1(a)
  }else {
    var b;
    b = cljs.core._methods[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._methods._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core._prefers = function(a) {
  if(a ? a.cljs$core$IMultiFn$_prefers$arity$1 : a) {
    a = a.cljs$core$IMultiFn$_prefers$arity$1(a)
  }else {
    var b;
    b = cljs.core._prefers[goog.typeOf.call(null, a)];
    if(!b && (b = cljs.core._prefers._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", a);
    }
    a = b.call(null, a)
  }
  return a
};
cljs.core._dispatch = function(a, b) {
  var c;
  if(a ? a.cljs$core$IMultiFn$_dispatch$arity$2 : a) {
    c = a.cljs$core$IMultiFn$_dispatch$arity$2(a, b)
  }else {
    c = cljs.core._dispatch[goog.typeOf.call(null, a)];
    if(!c && (c = cljs.core._dispatch._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", a);
    }
    c = c.call(null, a, b)
  }
  return c
};
void 0;
cljs.core.do_dispatch = function(a, b, c) {
  b = cljs.core.apply.call(null, b, c);
  a = cljs.core._get_method.call(null, a, b);
  if(!cljs.core.truth_(a)) {
    throw Error(cljs.core.str.call(null, "No method in multimethod '", cljs.core.name, "' for dispatch value: ", b));
  }
  return cljs.core.apply.call(null, a, c)
};
cljs.core.MultiFn = function(a, b, c, d, e, f, g, h) {
  this.name = a;
  this.dispatch_fn = b;
  this.default_dispatch_val = c;
  this.hierarchy = d;
  this.method_table = e;
  this.prefer_table = f;
  this.method_cache = g;
  this.cached_hierarchy = h
};
cljs.core.MultiFn.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "cljs.core.MultiFn")
};
cljs.core.MultiFn.prototype.cljs$core$IHash$ = !0;
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid.call(null, a)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$ = !0;
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = function(a) {
  cljs.core.swap_BANG_.call(null, this.method_table, function() {
    return cljs.core.PersistentHashMap.fromArrays([], [])
  });
  cljs.core.swap_BANG_.call(null, this.method_cache, function() {
    return cljs.core.PersistentHashMap.fromArrays([], [])
  });
  cljs.core.swap_BANG_.call(null, this.prefer_table, function() {
    return cljs.core.PersistentHashMap.fromArrays([], [])
  });
  cljs.core.swap_BANG_.call(null, this.cached_hierarchy, function() {
    return null
  });
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = function(a, b, c) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.assoc, b, c);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = function(a, b) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.dissoc, b);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = function(a, b) {
  cljs.core._EQ_.call(null, cljs.core.deref.call(null, this.cached_hierarchy), cljs.core.deref.call(null, this.hierarchy)) || cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  var c = cljs.core.deref.call(null, this.method_cache).call(null, b);
  if(cljs.core.truth_(c)) {
    return c
  }
  c = cljs.core.find_and_cache_best_method.call(null, this.name, b, this.hierarchy, this.method_table, this.prefer_table, this.method_cache, this.cached_hierarchy);
  return cljs.core.truth_(c) ? c : cljs.core.deref.call(null, this.method_table).call(null, this.default_dispatch_val)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null, b, c, this.prefer_table))) {
    throw Error(cljs.core.str.call(null, "Preference conflict in multimethod '", this.name, "': ", c, " is already preferred to ", b));
  }
  cljs.core.swap_BANG_.call(null, this.prefer_table, function(a) {
    return cljs.core.assoc.call(null, a, b, cljs.core.conj.call(null, cljs.core.get.call(null, a, b, cljs.core.set([])), c))
  });
  return cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = function() {
  return cljs.core.deref.call(null, this.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = function() {
  return cljs.core.deref.call(null, this.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch$arity$2 = function(a, b) {
  return cljs.core.do_dispatch.call(null, a, this.dispatch_fn, b)
};
cljs.core.MultiFn;
cljs.core.MultiFn.prototype.call = function() {
  var a = function(a, c) {
    var d = null;
    goog.isDef(c) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return cljs.core._dispatch.call(null, this, d)
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = function(a) {
    cljs.core.first(a);
    a = cljs.core.rest(a);
    return cljs.core._dispatch.call(null, this, a)
  };
  return a
}();
cljs.core.MultiFn.prototype.apply = function(a, b) {
  return cljs.core._dispatch.call(null, this, b)
};
cljs.core.remove_all_methods = function(a) {
  return cljs.core._reset.call(null, a)
};
cljs.core.remove_method = function(a, b) {
  return cljs.core._remove_method.call(null, a, b)
};
cljs.core.prefer_method = function(a, b, c) {
  return cljs.core._prefer_method.call(null, a, b, c)
};
cljs.core.methods$ = function(a) {
  return cljs.core._methods.call(null, a)
};
cljs.core.get_method = function(a, b) {
  return cljs.core._get_method.call(null, a, b)
};
cljs.core.prefers = function(a) {
  return cljs.core._prefers.call(null, a)
};
cljs.nodejs = {};
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.core.string_print = cljs.nodejs.require.call(null, "sys").print;
cljs.nodejscli = {};
cljs.core.apply.call(null, cljs.core._STAR_main_cli_fn_STAR_, cljs.core.drop.call(null, 2, cljs.nodejs.process.argv));

