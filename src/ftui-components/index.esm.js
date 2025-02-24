import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import React, { useState, useMemo } from 'react';
import { styled, Box, ListItemButton, Avatar, ListItemText, ListItemSecondaryAction, unstable_composeClasses, Stack, IconButton, TextField, InputAdornment, Chip, List, ListItemAvatar, OutlinedInput, InputLabel, Select, Checkbox, MenuItem, Typography, Button, FormControl, FormLabel, FormGroup, FormControlLabel, Slider, AppBar, Container, Toolbar, Menu, Paper, Card, CardHeader, CardContent, CardActions, Grid } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { useThemeProps as useThemeProps$1, css } from '@mui/system';
import { createDarkTheme, getThemeValue } from '@dndbeyond/ddb-theme';
import CloseIcon from '@mui/icons-material/Close';
import GlobalStyles from '@mui/material/GlobalStyles';
import MoreIcon from '@mui/icons-material/MoreVert';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Box$1 from '@mui/material/Box';
import Chip$1 from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global$v =
  // eslint-disable-next-line es-x/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

var objectGetOwnPropertyDescriptor = {};

var fails$e = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var fails$d = fails$e;

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails$d(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var fails$c = fails$e;

var functionBindNative = !fails$c(function () {
  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

var NATIVE_BIND$1 = functionBindNative;

var call$6 = Function.prototype.call;

var functionCall = NATIVE_BIND$1 ? call$6.bind(call$6) : function () {
  return call$6.apply(call$6, arguments);
};

var objectPropertyIsEnumerable = {};

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$1(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

var createPropertyDescriptor$3 = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var NATIVE_BIND = functionBindNative;

var FunctionPrototype$1 = Function.prototype;
var bind = FunctionPrototype$1.bind;
var call$5 = FunctionPrototype$1.call;
var uncurryThis$f = NATIVE_BIND && bind.bind(call$5, call$5);

var functionUncurryThis = NATIVE_BIND ? function (fn) {
  return fn && uncurryThis$f(fn);
} : function (fn) {
  return fn && function () {
    return call$5.apply(fn, arguments);
  };
};

var uncurryThis$e = functionUncurryThis;

var toString$6 = uncurryThis$e({}.toString);
var stringSlice$1 = uncurryThis$e(''.slice);

var classofRaw$1 = function (it) {
  return stringSlice$1(toString$6(it), 8, -1);
};

var global$u = global$v;
var uncurryThis$d = functionUncurryThis;
var fails$b = fails$e;
var classof$4 = classofRaw$1;

var Object$5 = global$u.Object;
var split = uncurryThis$d(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails$b(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object$5('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof$4(it) == 'String' ? split(it, '') : Object$5(it);
} : Object$5;

var global$t = global$v;

var TypeError$a = global$t.TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible$4 = function (it) {
  if (it == undefined) throw TypeError$a("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings
var IndexedObject$2 = indexedObject;
var requireObjectCoercible$3 = requireObjectCoercible$4;

var toIndexedObject$5 = function (it) {
  return IndexedObject$2(requireObjectCoercible$3(it));
};

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
var isCallable$g = function (argument) {
  return typeof argument == 'function';
};

var isCallable$f = isCallable$g;

var isObject$6 = function (it) {
  return typeof it == 'object' ? it !== null : isCallable$f(it);
};

var global$s = global$v;
var isCallable$e = isCallable$g;

var aFunction = function (argument) {
  return isCallable$e(argument) ? argument : undefined;
};

var getBuiltIn$4 = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global$s[namespace]) : global$s[namespace] && global$s[namespace][method];
};

var uncurryThis$c = functionUncurryThis;

var objectIsPrototypeOf = uncurryThis$c({}.isPrototypeOf);

var getBuiltIn$3 = getBuiltIn$4;

var engineUserAgent = getBuiltIn$3('navigator', 'userAgent') || '';

var global$r = global$v;
var userAgent = engineUserAgent;

var process = global$r.process;
var Deno = global$r.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

var engineV8Version = version;

/* eslint-disable es-x/no-symbol -- required for testing */

var V8_VERSION = engineV8Version;
var fails$a = fails$e;

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$a(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

/* eslint-disable es-x/no-symbol -- required for testing */

var NATIVE_SYMBOL$2 = nativeSymbol;

var useSymbolAsUid = NATIVE_SYMBOL$2
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var global$q = global$v;
var getBuiltIn$2 = getBuiltIn$4;
var isCallable$d = isCallable$g;
var isPrototypeOf$1 = objectIsPrototypeOf;
var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

var Object$4 = global$q.Object;

var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn$2('Symbol');
  return isCallable$d($Symbol) && isPrototypeOf$1($Symbol.prototype, Object$4(it));
};

var global$p = global$v;

var String$4 = global$p.String;

var tryToString$1 = function (argument) {
  try {
    return String$4(argument);
  } catch (error) {
    return 'Object';
  }
};

var global$o = global$v;
var isCallable$c = isCallable$g;
var tryToString = tryToString$1;

var TypeError$9 = global$o.TypeError;

// `Assert: IsCallable(argument) is true`
var aCallable$2 = function (argument) {
  if (isCallable$c(argument)) return argument;
  throw TypeError$9(tryToString(argument) + ' is not a function');
};

var aCallable$1 = aCallable$2;

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
var getMethod$1 = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable$1(func);
};

var global$n = global$v;
var call$4 = functionCall;
var isCallable$b = isCallable$g;
var isObject$5 = isObject$6;

var TypeError$8 = global$n.TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
var ordinaryToPrimitive$1 = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable$b(fn = input.toString) && !isObject$5(val = call$4(fn, input))) return val;
  if (isCallable$b(fn = input.valueOf) && !isObject$5(val = call$4(fn, input))) return val;
  if (pref !== 'string' && isCallable$b(fn = input.toString) && !isObject$5(val = call$4(fn, input))) return val;
  throw TypeError$8("Can't convert object to primitive value");
};

var shared$3 = { exports: {} };

var global$m = global$v;

// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty$5 = Object.defineProperty;

var setGlobal$3 = function (key, value) {
  try {
    defineProperty$5(global$m, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global$m[key] = value;
  } return value;
};

var global$l = global$v;
var setGlobal$2 = setGlobal$3;

var SHARED = '__core-js_shared__';
var store$3 = global$l[SHARED] || setGlobal$2(SHARED, {});

var sharedStore = store$3;

var store$2 = sharedStore;

(shared$3.exports = function (key, value) {
  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.22.4',
  mode: 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.22.4/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

var global$k = global$v;
var requireObjectCoercible$2 = requireObjectCoercible$4;

var Object$3 = global$k.Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject$4 = function (argument) {
  return Object$3(requireObjectCoercible$2(argument));
};

var uncurryThis$b = functionUncurryThis;
var toObject$3 = toObject$4;

var hasOwnProperty = uncurryThis$b({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es-x/no-object-hasown -- safe
var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject$3(it), key);
};

var uncurryThis$a = functionUncurryThis;

var id = 0;
var postfix = Math.random();
var toString$5 = uncurryThis$a(1.0.toString);

var uid$2 = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$5(++id + postfix, 36);
};

var global$j = global$v;
var shared$2 = shared$3.exports;
var hasOwn$9 = hasOwnProperty_1;
var uid$1 = uid$2;
var NATIVE_SYMBOL$1 = nativeSymbol;
var USE_SYMBOL_AS_UID = useSymbolAsUid;

var WellKnownSymbolsStore = shared$2('wks');
var Symbol$2 = global$j.Symbol;
var symbolFor = Symbol$2 && Symbol$2['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$2 : Symbol$2 && Symbol$2.withoutSetter || uid$1;

var wellKnownSymbol$a = function (name) {
  if (!hasOwn$9(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL$1 || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL$1 && hasOwn$9(Symbol$2, name)) {
      WellKnownSymbolsStore[name] = Symbol$2[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};

var global$i = global$v;
var call$3 = functionCall;
var isObject$4 = isObject$6;
var isSymbol$1 = isSymbol$2;
var getMethod = getMethod$1;
var ordinaryToPrimitive = ordinaryToPrimitive$1;
var wellKnownSymbol$9 = wellKnownSymbol$a;

var TypeError$7 = global$i.TypeError;
var TO_PRIMITIVE = wellKnownSymbol$9('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
var toPrimitive$1 = function (input, pref) {
  if (!isObject$4(input) || isSymbol$1(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call$3(exoticToPrim, input, pref);
    if (!isObject$4(result) || isSymbol$1(result)) return result;
    throw TypeError$7("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

var toPrimitive = toPrimitive$1;
var isSymbol = isSymbol$2;

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
var toPropertyKey$2 = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

var global$h = global$v;
var isObject$3 = isObject$6;

var document$1 = global$h.document;
// typeof document.createElement is 'object' in old IE
var EXISTS$1 = isObject$3(document$1) && isObject$3(document$1.createElement);

var documentCreateElement$2 = function (it) {
  return EXISTS$1 ? document$1.createElement(it) : {};
};

var DESCRIPTORS$9 = descriptors;
var fails$9 = fails$e;
var createElement = documentCreateElement$2;

// Thanks to IE8 for its funny defineProperty
var ie8DomDefine = !DESCRIPTORS$9 && !fails$9(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var DESCRIPTORS$8 = descriptors;
var call$2 = functionCall;
var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
var createPropertyDescriptor$2 = createPropertyDescriptor$3;
var toIndexedObject$4 = toIndexedObject$5;
var toPropertyKey$1 = toPropertyKey$2;
var hasOwn$8 = hasOwnProperty_1;
var IE8_DOM_DEFINE$1 = ie8DomDefine;

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
objectGetOwnPropertyDescriptor.f = DESCRIPTORS$8 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject$4(O);
  P = toPropertyKey$1(P);
  if (IE8_DOM_DEFINE$1) try {
    return $getOwnPropertyDescriptor$1(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn$8(O, P)) return createPropertyDescriptor$2(!call$2(propertyIsEnumerableModule$1.f, O, P), O[P]);
};

var objectDefineProperty = {};

var DESCRIPTORS$7 = descriptors;
var fails$8 = fails$e;

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
var v8PrototypeDefineBug = DESCRIPTORS$7 && fails$8(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

var global$g = global$v;
var isObject$2 = isObject$6;

var String$3 = global$g.String;
var TypeError$6 = global$g.TypeError;

// `Assert: Type(argument) is Object`
var anObject$5 = function (argument) {
  if (isObject$2(argument)) return argument;
  throw TypeError$6(String$3(argument) + ' is not an object');
};

var global$f = global$v;
var DESCRIPTORS$6 = descriptors;
var IE8_DOM_DEFINE = ie8DomDefine;
var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
var anObject$4 = anObject$5;
var toPropertyKey = toPropertyKey$2;

var TypeError$5 = global$f.TypeError;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE$1 = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
objectDefineProperty.f = DESCRIPTORS$6 ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
  anObject$4(O);
  P = toPropertyKey(P);
  anObject$4(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject$4(O);
  P = toPropertyKey(P);
  anObject$4(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError$5('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var DESCRIPTORS$5 = descriptors;
var definePropertyModule$3 = objectDefineProperty;
var createPropertyDescriptor$1 = createPropertyDescriptor$3;

var createNonEnumerableProperty$5 = DESCRIPTORS$5 ? function (object, key, value) {
  return definePropertyModule$3.f(object, key, createPropertyDescriptor$1(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var makeBuiltIn$2 = { exports: {} };

var DESCRIPTORS$4 = descriptors;
var hasOwn$7 = hasOwnProperty_1;

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS$4 && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn$7(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS$4 || (DESCRIPTORS$4 && getDescriptor(FunctionPrototype, 'name').configurable));

var functionName = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

var uncurryThis$9 = functionUncurryThis;
var isCallable$a = isCallable$g;
var store$1 = sharedStore;

var functionToString = uncurryThis$9(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable$a(store$1.inspectSource)) {
  store$1.inspectSource = function (it) {
    return functionToString(it);
  };
}

var inspectSource$2 = store$1.inspectSource;

var global$e = global$v;
var isCallable$9 = isCallable$g;
var inspectSource$1 = inspectSource$2;

var WeakMap$1 = global$e.WeakMap;

var nativeWeakMap = isCallable$9(WeakMap$1) && /native code/.test(inspectSource$1(WeakMap$1));

var shared$1 = shared$3.exports;
var uid = uid$2;

var keys = shared$1('keys');

var sharedKey$3 = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys$4 = {};

var NATIVE_WEAK_MAP = nativeWeakMap;
var global$d = global$v;
var uncurryThis$8 = functionUncurryThis;
var isObject$1 = isObject$6;
var createNonEnumerableProperty$4 = createNonEnumerableProperty$5;
var hasOwn$6 = hasOwnProperty_1;
var shared = sharedStore;
var sharedKey$2 = sharedKey$3;
var hiddenKeys$3 = hiddenKeys$4;

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError$4 = global$d.TypeError;
var WeakMap = global$d.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject$1(it) || (state = get(it)).type !== TYPE) {
      throw TypeError$4('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis$8(store.get);
  var wmhas = uncurryThis$8(store.has);
  var wmset = uncurryThis$8(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError$4(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey$2('state');
  hiddenKeys$3[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn$6(it, STATE)) throw new TypeError$4(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty$4(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn$6(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn$6(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

var fails$7 = fails$e;
var isCallable$8 = isCallable$g;
var hasOwn$5 = hasOwnProperty_1;
var defineProperty$4 = objectDefineProperty.f;
var CONFIGURABLE_FUNCTION_NAME$1 = functionName.CONFIGURABLE;
var inspectSource = inspectSource$2;
var InternalStateModule$1 = internalState;

var enforceInternalState = InternalStateModule$1.enforce;
var getInternalState$1 = InternalStateModule$1.get;

var CONFIGURABLE_LENGTH = !fails$7(function () {
  return defineProperty$4(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn$1 = makeBuiltIn$2.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn$5(value, 'name') || (CONFIGURABLE_FUNCTION_NAME$1 && value.name !== name)) {
    defineProperty$4(value, 'name', { value: name, configurable: true });
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn$5(options, 'arity') && value.length !== options.arity) {
    defineProperty$4(value, 'length', { value: options.arity });
  }
  var state = enforceInternalState(value);
  if (!hasOwn$5(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn$1(function toString() {
  return isCallable$8(this) && getInternalState$1(this).source || inspectSource(this);
}, 'toString');

var global$c = global$v;
var isCallable$7 = isCallable$g;
var createNonEnumerableProperty$3 = createNonEnumerableProperty$5;
var makeBuiltIn = makeBuiltIn$2.exports;
var setGlobal$1 = setGlobal$3;

var defineBuiltIn$3 = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var name = options && options.name !== undefined ? options.name : key;
  if (isCallable$7(value)) makeBuiltIn(value, name, options);
  if (O === global$c) {
    if (simple) O[key] = value;
    else setGlobal$1(key, value);
    return O;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty$3(O, key, value);
  return O;
};

var objectGetOwnPropertyNames = {};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
var toIntegerOrInfinity$2 = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- safe
  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
};

var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex$1 = function (index, length) {
  var integer = toIntegerOrInfinity$1(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

var toIntegerOrInfinity = toIntegerOrInfinity$2;

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength$1 = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var toLength = toLength$1;

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
var lengthOfArrayLike$2 = function (obj) {
  return toLength(obj.length);
};

var toIndexedObject$3 = toIndexedObject$5;
var toAbsoluteIndex = toAbsoluteIndex$1;
var lengthOfArrayLike$1 = lengthOfArrayLike$2;

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod$2 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject$3($this);
    var length = lengthOfArrayLike$1(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod$2(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod$2(false)
};

var uncurryThis$7 = functionUncurryThis;
var hasOwn$4 = hasOwnProperty_1;
var toIndexedObject$2 = toIndexedObject$5;
var indexOf = arrayIncludes.indexOf;
var hiddenKeys$2 = hiddenKeys$4;

var push = uncurryThis$7([].push);

var objectKeysInternal = function (object, names) {
  var O = toIndexedObject$2(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn$4(hiddenKeys$2, key) && hasOwn$4(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn$4(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys$3 = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var internalObjectKeys$1 = objectKeysInternal;
var enumBugKeys$2 = enumBugKeys$3;

var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es-x/no-object-getownpropertynames -- safe
objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys$1(O, hiddenKeys$1);
};

var objectGetOwnPropertySymbols = {};

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

var getBuiltIn$1 = getBuiltIn$4;
var uncurryThis$6 = functionUncurryThis;
var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
var anObject$3 = anObject$5;

var concat$1 = uncurryThis$6([].concat);

// all object keys, includes non-enumerable and symbols
var ownKeys$1 = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject$3(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
  return getOwnPropertySymbols ? concat$1(keys, getOwnPropertySymbols(it)) : keys;
};

var hasOwn$3 = hasOwnProperty_1;
var ownKeys = ownKeys$1;
var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
var definePropertyModule$2 = objectDefineProperty;

var copyConstructorProperties$2 = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule$2.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn$3(target, key) && !(exceptions && hasOwn$3(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

var fails$6 = fails$e;
var isCallable$6 = isCallable$g;

var replacement = /#|\.prototype\./;

var isForced$1 = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
      : isCallable$6(detection) ? fails$6(detection)
        : !!detection;
};

var normalize = isForced$1.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced$1.data = {};
var NATIVE = isForced$1.NATIVE = 'N';
var POLYFILL = isForced$1.POLYFILL = 'P';

var isForced_1 = isForced$1;

var global$b = global$v;
var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
var createNonEnumerableProperty$2 = createNonEnumerableProperty$5;
var defineBuiltIn$2 = defineBuiltIn$3;
var setGlobal = setGlobal$3;
var copyConstructorProperties$1 = copyConstructorProperties$2;
var isForced = isForced_1;

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
  options.name        - the .name of the function if it does not match the key
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global$b;
  } else if (STATIC) {
    target = global$b[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global$b[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties$1(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty$2(sourceProperty, 'sham', true);
    }
    defineBuiltIn$2(target, key, sourceProperty, options);
  }
};

var internalObjectKeys = objectKeysInternal;
var enumBugKeys$1 = enumBugKeys$3;

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es-x/no-object-keys -- safe
var objectKeys$2 = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys$1);
};

var DESCRIPTORS$3 = descriptors;
var uncurryThis$5 = functionUncurryThis;
var call$1 = functionCall;
var fails$5 = fails$e;
var objectKeys$1 = objectKeys$2;
var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
var propertyIsEnumerableModule = objectPropertyIsEnumerable;
var toObject$2 = toObject$4;
var IndexedObject$1 = indexedObject;

// eslint-disable-next-line es-x/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
var defineProperty$3 = Object.defineProperty;
var concat = uncurryThis$5([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign = !$assign || fails$5(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS$3 && $assign({ b: 1 }, $assign(defineProperty$3({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty$3(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es-x/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys$1($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject$2(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject$1(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys$1(S), getOwnPropertySymbols(S)) : objectKeys$1(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS$3 || call$1(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

var $$6 = _export;
var assign = objectAssign;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es-x/no-object-assign -- required for testing
$$6({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
  assign: assign
});

var wellKnownSymbol$8 = wellKnownSymbol$a;

var TO_STRING_TAG$3 = wellKnownSymbol$8('toStringTag');
var test = {};

test[TO_STRING_TAG$3] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var global$a = global$v;
var TO_STRING_TAG_SUPPORT = toStringTagSupport;
var isCallable$5 = isCallable$g;
var classofRaw = classofRaw$1;
var wellKnownSymbol$7 = wellKnownSymbol$a;

var TO_STRING_TAG$2 = wellKnownSymbol$7('toStringTag');
var Object$2 = global$a.Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof$3 = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object$2(it), TO_STRING_TAG$2)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
        // ES3 arguments fallback
        : (result = classofRaw(O)) == 'Object' && isCallable$5(O.callee) ? 'Arguments' : result;
};

var global$9 = global$v;
var classof$2 = classof$3;

var String$2 = global$9.String;

var toString$4 = function (argument) {
  if (classof$2(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return String$2(argument);
};

var $$5 = _export;
var DESCRIPTORS$2 = descriptors;
var global$8 = global$v;
var uncurryThis$4 = functionUncurryThis;
var hasOwn$2 = hasOwnProperty_1;
var isCallable$4 = isCallable$g;
var isPrototypeOf = objectIsPrototypeOf;
var toString$3 = toString$4;
var defineProperty$2 = objectDefineProperty.f;
var copyConstructorProperties = copyConstructorProperties$2;

var NativeSymbol = global$8.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

if (DESCRIPTORS$2 && isCallable$4(NativeSymbol) && (!('description' in SymbolPrototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString$3(arguments[0]);
    var result = isPrototypeOf(SymbolPrototype, this)
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };

  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;

  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
  var symbolToString = uncurryThis$4(SymbolPrototype.toString);
  var symbolValueOf = uncurryThis$4(SymbolPrototype.valueOf);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace$1 = uncurryThis$4(''.replace);
  var stringSlice = uncurryThis$4(''.slice);

  defineProperty$2(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = symbolValueOf(this);
      var string = symbolToString(symbol);
      if (hasOwn$2(EmptyStringDescriptionStore, symbol)) return '';
      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace$1(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $$5({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}

function toVal(mix) {
  var k, y, str = '';

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix;
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      for (k = 0; k < mix.length; k++) {
        if (mix[k]) {
          if (y = toVal(mix[k])) {
            str && (str += ' ');
            str += y;
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix[k]) {
          str && (str += ' ');
          str += k;
        }
      }
    }
  }

  return str;
}

function clsx() {
  var i = 0, tmp, x, str = '';
  while (i < arguments.length) {
    if (tmp = arguments[i++]) {
      if (x = toVal(tmp)) {
        str && (str += ' ');
        str += x;
      }
    }
  }
  return str;
}

const defaultGenerator = componentName => componentName;

const createClassNameGenerator = () => {
  let generate = defaultGenerator;
  return {
    configure(generator) {
      generate = generator;
    },

    generate(componentName) {
      return generate(componentName);
    },

    reset() {
      generate = defaultGenerator;
    }

  };
};

const ClassNameGenerator = createClassNameGenerator();
var ClassNameGenerator$1 = ClassNameGenerator;

const globalStateClassesMapping = {
  active: 'Mui-active',
  checked: 'Mui-checked',
  completed: 'Mui-completed',
  disabled: 'Mui-disabled',
  error: 'Mui-error',
  expanded: 'Mui-expanded',
  focused: 'Mui-focused',
  focusVisible: 'Mui-focusVisible',
  required: 'Mui-required',
  selected: 'Mui-selected'
};
function generateUtilityClass(componentName, slot) {
  const globalStateClass = globalStateClassesMapping[slot];
  return globalStateClass || `${ClassNameGenerator$1.generate(componentName)}-${slot}`;
}

function generateUtilityClasses(componentName, slots) {
  const result = {};
  slots.forEach(slot => {
    result[slot] = generateUtilityClass(componentName, slot);
  });
  return result;
}

const componentName$7 = 'FtuiFilterableListView';

function getFilterableListViewUtilityClass(slot) {
  return generateUtilityClass(componentName$7, slot);
}
const filterableListViewClasses = generateUtilityClasses(componentName$7, ['root', 'item', 'itemAvatar', 'imageSizeSmall', 'imageSizeMedium', 'itemText', 'itemActions']);

function useThemeProps({
  props,
  name
}) {
  return useThemeProps$1({
    props,
    name,
    defaultTheme: Object.assign(Object.assign({}, createDarkTheme()), {
      components: {}
    })
  });
}

const useUtilityClasses$a = ownerState => {
  const {
    imageSize
  } = ownerState;
  const slots = {
    root: ['root'],
    item: ['item'],
    itemAvatar: ['itemAvatar', imageSize === 'small' && 'imageSizeSmall', imageSize === 'medium' && 'imageSizeMedium'],
    itemText: ['itemText'],
    itemActions: ['itemActions']
  };
  return unstable_composeClasses(slots, getFilterableListViewUtilityClass, {});
};

const FilterableListViewRoot = styled(Box, {
  name: componentName$7,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => ({
  color: theme.palette.text.primary,
  maxHeight: '100vh',
  minWidth: 320,
  width: '100%',
  overflow: 'auto'
}));
const Item = styled(ListItemButton, {
  name: componentName$7,
  slot: 'Item'
})(({
  theme
}) => ({
  justifyContent: 'flex-start',
  alignItems: 'center',
  boxShadow: `0px 16px 1px -16px ${theme.palette.text.secondary}`,
  ':hover': {
    background: theme.palette.action.hover
  },
  '&.Mui-selected': {
    background: theme.palette.action.selected
  }
}));
const ItemAvatar = styled(Avatar, {
  name: componentName$7,
  slot: 'ItemAvatar',
  overridesResolver: (props, styles) => styles.itemAvatar
})(({
  theme,
  ownerState
}) => ({
  height: 56,
  width: 56,
  marginRight: 12,
  [`&.${filterableListViewClasses.imageSizeSmall}`]: {
    height: 40,
    width: 40
  }
}));
const ItemText = styled(ListItemText, {
  name: componentName$7,
  slot: 'ItemText',
  overridesResolver: (props, styles) => styles.itemText
})(({
  theme
}) => ({
  '.Mui-selected &': {
    '.MuiListItemText-primary': {
      fontWeight: theme.typography.fontWeightBold
    }
  },
  '.MuiListItemText-secondary': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}));
const ItemActions = styled(ListItemSecondaryAction, {
  name: componentName$7,
  slot: 'ItemActions',
  overridesResolver: (props, styles) => styles.itemActions
})({
  position: 'relative',
  top: 'auto',
  right: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transform: 'none',
  margin: 'auto 0'
});
const FilterableListView = /*#__PURE__*/React.forwardRef(function FilterableListView(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: componentName$7
  });

  const {
    endRef,
    className,
    filterButtonAlign = 'left',
    filters,
    imageSize = 'medium',
    items = [],
    onSearch,
    onToggleFilters,
    searchLabel = 'Search',
    showImages = true,
    selected = 0
  } = props,
    other = __rest(props, ["endRef", "className", "filterButtonAlign", "filters", "imageSize", "items", "onSearch", "onToggleFilters", "searchLabel", "showImages", "selected"]);

  const ownerState = Object.assign({
    imageSize
  }, props);
  const classes = useUtilityClasses$a(ownerState);
  return jsxs(FilterableListViewRoot, Object.assign({
    className: clsx(classes.root, className),
    ownerState: ownerState
  }, other, {
    children: [jsxs(Stack, Object.assign({
      direction: filterButtonAlign === 'left' ? 'row' : 'row-reverse',
      sx: {
        p: 1
      }
    }, {
      children: [onToggleFilters && jsx(IconButton, Object.assign({
        onClick: onToggleFilters,
        "aria-label": "Show Filters"
      }, {
        children: jsx(TuneIcon, {}, void 0)
      }), void 0), onSearch && jsx(TextField, {
        variant: "outlined",
        size: "small",
        placeholder: searchLabel,
        onChange: e => onSearch(e),
        InputProps: {
          startAdornment: jsx(InputAdornment, Object.assign({
            position: "start"
          }, {
            children: jsx(SearchIcon, {}, void 0)
          }), void 0)
        },
        sx: {
          flex: 1
        }
      }, void 0)]
    }), void 0), filters && jsx(Stack, Object.assign({
      direction: "row",
      spacing: 1,
      sx: {
        p: 1
      }
    }, {
      children: filters.map(filter => jsx(Chip, {
        label: filter.label,
        onDelete: filter.onDelete,
        deleteIcon: jsx(HighlightOffOutlinedIcon, {}, void 0),
        sx: {
          backgroundColor: 'background.paper',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'text.disabled'
        }
      }, filter.label))
    }), void 0), jsx(List, Object.assign({
      sx: {
        width: '100%'
      }
    }, {
      children: items.map((item, i) => jsxs(Item, Object.assign({
        className: clsx(classes.item, className),
        onClick: () => item.onClick(item, i),
        alignItems: "flex-start",
        selected: selected === i,
        ref: endRef && i === items.length - 1 ? endRef : null
      }, {
        children: [showImages && jsx(ListItemAvatar, {
          children: jsx(ItemAvatar, {
            className: clsx(classes.itemAvatar, className),
            variant: "rounded",
            alt: item.name,
            src: item.image,
            ownerState: ownerState
          }, void 0)
        }, void 0), jsx(ItemText, {
          className: clsx(classes.itemText, className),
          primary: jsxs(Fragment, {
            children: [item.name, item.isLegacy && jsx(Chip, {
              label: "Legacy",
              size: "small",
              sx: {
                borderRadius: 1,
                ml: 1
              }
            }, void 0)]
          }, void 0),
          secondary: item.description
        }, void 0), jsx(ItemActions, {
          className: clsx(classes.itemActions, className),
          children: item.actions
        }, void 0)]
      }), `${item.name}-${i}`))
    }), void 0)]
  }), void 0);
});

var objectDefineProperties = {};

var DESCRIPTORS$1 = descriptors;
var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
var definePropertyModule$1 = objectDefineProperty;
var anObject$2 = anObject$5;
var toIndexedObject$1 = toIndexedObject$5;
var objectKeys = objectKeys$2;

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es-x/no-object-defineproperties -- safe
objectDefineProperties.f = DESCRIPTORS$1 && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject$2(O);
  var props = toIndexedObject$1(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule$1.f(O, key = keys[index++], props[key]);
  return O;
};

var getBuiltIn = getBuiltIn$4;

var html$1 = getBuiltIn('document', 'documentElement');

/* global ActiveXObject -- old IE, WSH */

var anObject$1 = anObject$5;
var definePropertiesModule = objectDefineProperties;
var enumBugKeys = enumBugKeys$3;
var hiddenKeys = hiddenKeys$4;
var html = html$1;
var documentCreateElement$1 = documentCreateElement$2;
var sharedKey$1 = sharedKey$3;

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO$1 = sharedKey$1('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement$1('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO$1] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es-x/no-object-create -- safe
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject$1(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};

var wellKnownSymbol$6 = wellKnownSymbol$a;
var create$1 = objectCreate;
var definePropertyModule = objectDefineProperty;

var UNSCOPABLES = wellKnownSymbol$6('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create$1(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables$2 = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var $$4 = _export;
var $includes = arrayIncludes.includes;
var fails$4 = fails$e;
var addToUnscopables$1 = addToUnscopables$2;

// FF99+ bug
var BROKEN_ON_SPARSE = fails$4(function () {
  return !Array(1).includes();
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$$4({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables$1('includes');

var isObject = isObject$6;
var classof$1 = classofRaw$1;
var wellKnownSymbol$5 = wellKnownSymbol$a;

var MATCH$1 = wellKnownSymbol$5('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH$1]) !== undefined ? !!isRegExp : classof$1(it) == 'RegExp');
};

var global$7 = global$v;
var isRegExp = isRegexp;

var TypeError$3 = global$7.TypeError;

var notARegexp = function (it) {
  if (isRegExp(it)) {
    throw TypeError$3("The method doesn't accept regular expressions");
  } return it;
};

var wellKnownSymbol$4 = wellKnownSymbol$a;

var MATCH = wellKnownSymbol$4('match');

var correctIsRegexpLogic = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};

var $$3 = _export;
var uncurryThis$3 = functionUncurryThis;
var notARegExp = notARegexp;
var requireObjectCoercible$1 = requireObjectCoercible$4;
var toString$2 = toString$4;
var correctIsRegExpLogic = correctIsRegexpLogic;

var stringIndexOf = uncurryThis$3(''.indexOf);

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
$$3({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~stringIndexOf(
      toString$2(requireObjectCoercible$1(this)),
      toString$2(notARegExp(searchString)),
      arguments.length > 1 ? arguments[1] : undefined
    );
  }
});

// a string of all valid unicode whitespaces
var whitespaces$2 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var uncurryThis$2 = functionUncurryThis;
var requireObjectCoercible = requireObjectCoercible$4;
var toString$1 = toString$4;
var whitespaces$1 = whitespaces$2;

var replace = uncurryThis$2(''.replace);
var whitespace = '[' + whitespaces$1 + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$1 = function (TYPE) {
  return function ($this) {
    var string = toString$1(requireObjectCoercible($this));
    if (TYPE & 1) string = replace(string, ltrim, '');
    if (TYPE & 2) string = replace(string, rtrim, '');
    return string;
  };
};

var stringTrim = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod$1(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod$1(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod$1(3)
};

var global$6 = global$v;
var fails$3 = fails$e;
var uncurryThis$1 = functionUncurryThis;
var toString = toString$4;
var trim = stringTrim.trim;
var whitespaces = whitespaces$2;

var $parseInt$1 = global$6.parseInt;
var Symbol$1 = global$6.Symbol;
var ITERATOR$3 = Symbol$1 && Symbol$1.iterator;
var hex = /^[+-]?0x/i;
var exec = uncurryThis$1(hex.exec);
var FORCED = $parseInt$1(whitespaces + '08') !== 8 || $parseInt$1(whitespaces + '0x16') !== 22
  // MS Edge 18- broken with boxed symbols
  || (ITERATOR$3 && !fails$3(function () { $parseInt$1(Object(ITERATOR$3)); }));

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
var numberParseInt = FORCED ? function parseInt(string, radix) {
  var S = trim(toString(string));
  return $parseInt$1(S, (radix >>> 0) || (exec(hex, S) ? 16 : 10));
} : $parseInt$1;

var $$2 = _export;
var $parseInt = numberParseInt;

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
$$2({ global: true, forced: parseInt != $parseInt }, {
  parseInt: $parseInt
});

const componentName$6 = 'FtuiFilterInput';

function getFilterInputUtilityClass(slot) {
  return generateUtilityClass(componentName$6, slot);
}
generateUtilityClasses(componentName$6, ['root', 'input', 'chipbox', 'chip', 'icon', 'label']);

const useUtilityClasses$9 = ownerState => {
  const slots = {
    root: ['root'],
    input: ['input'],
    chipbox: ['chipbox'],
    chip: ['chip'],
    icon: ['icon'],
    label: ['label']
  };
  return unstable_composeClasses(slots, getFilterInputUtilityClass, {});
};

const FilterInputInput = styled(OutlinedInput, {
  name: componentName$6,
  slot: 'Input',
  overridesResolver: (props, styles) => styles.input
})(({
  theme,
  ownerState
}) => ({// color: theme.palette.text.primary,
}));
const FilterInputLabel = styled(InputLabel, {
  name: componentName$6,
  slot: 'Label',
  overridesResolver: (props, styles) => styles.label
})(({
  theme,
  ownerState
}) => ({
  '&.MuiInputLabel-shrink:not(.Mui-error, .Mui-disabled)': {
    color: getThemeValue(theme, ownerState.color) || theme.palette.text.primary
  }
}));
const FilterInputChipBox = styled(Box, {
  name: componentName$6,
  slot: 'Chipbox',
  overridesResolver: (props, styles) => styles.chipbox
})(({
  theme,
  ownerState
}) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: -5,
  marginBottom: -5
}));
const FilterInputChip = styled(Chip, {
  name: componentName$6,
  slot: 'Chip',
  overridesResolver: (props, styles) => styles.chip
})(({
  theme,
  ownerState
}) => ({
  color: theme.palette.text.secondary,
  borderWidth: 1,
  borderColor: theme.palette.grey[500],
  borderStyle: 'solid',
  backgroundColor: theme.palette.grey[200]
}));
const FilterInputDeleteIcon = styled(CloseIcon, {
  name: componentName$6,
  slot: 'Icon',
  overridesResolver: (props, styles) => styles.icon
})(({
  theme,
  ownerState
}) => ({
  fill: theme.palette.grey[500],
  '&:hover': {
    fill: theme.palette.grey[700]
  }
}));
const FilterInputRoot = styled(Select, {
  name: componentName$6,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => ({
  '.MuiSelect-icon': {
    color: getThemeValue(theme, ownerState.color) || theme.palette.grey[700]
  },
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: getThemeValue(theme, ownerState.color) || theme.palette.grey[900]
  },
  '&:hover:not(.Mui-error, .Mui-disabled) .MuiOutlinedInput-notchedOutline': {
    borderColor: getThemeValue(theme, ownerState.color) || theme.palette.grey[900]
  },
  '&.Mui-focused:not(.Mui-error, .Mui-disabled) .MuiOutlinedInput-notchedOutline': {
    borderColor: getThemeValue(theme, ownerState.color) || theme.palette.grey[900]
  }
}));
const FilterInput = /*#__PURE__*/React.forwardRef(function FilterInput(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: componentName$6
  });

  const {
    className,
    children,
    label = '',
    value,
    multiple = false,
    onChipDelete,
    color
  } = props,
    other = __rest(props, ["className", "children", "label", "value", "multiple", "onChipDelete", "color"]);

  const ownerState = Object.assign(Object.assign({}, props), {
    color,
    multiple,
    label
  });
  const classes = useUtilityClasses$9();

  const handleDelete = (e, value) => {
    if (typeof onChipDelete === 'function') {
      onChipDelete(e, value);
    }
  };

  return jsxs(Fragment, {
    children: [jsx(FilterInputLabel, Object.assign({
      className: clsx(classes.label, className),
      ownerState: ownerState,
      id: "filter-input-label"
    }, {
      children: label
    }), void 0), jsx(FilterInputRoot, Object.assign({
      className: clsx(classes.root, className),
      ownerState: ownerState
    }, other, {
      labelId: "filter-input-label",
      value: value,
      multiple: multiple,
      input: jsx(FilterInputInput, {
        className: clsx(classes.input, className),
        ownerState: ownerState,
        label: label
      }, void 0),
      renderValue: selected => jsx(FilterInputChipBox, Object.assign({
        className: clsx(classes.chipbox, className),
        ownerState: ownerState
      }, {
        children: Array.isArray(selected) && multiple ? selected.map(value => jsx(FilterInputChip, {
          className: clsx(classes.chip, className),
          ownerState: ownerState,
          label: value,
          onMouseDown: e => {
            e.stopPropagation();
          },
          onDelete: e => handleDelete(e, value),
          deleteIcon: jsx(FilterInputDeleteIcon, {
            className: clsx(classes.icon, className),
            ownerState: ownerState
          }, void 0)
        }, value)) : selected
      }), void 0)
    }, {
      children: children
    }), void 0)]
  }, void 0);
});

const componentName$5 = 'FtuiFilterInput';

function getFilterInputItemUtilityClass(slot) {
  return generateUtilityClass(componentName$5, slot);
}
generateUtilityClasses(componentName$5, ['root', 'checkbox', 'text']);

const useUtilityClasses$8 = ownerState => {
  const slots = {
    root: ['root'],
    checkbox: ['checkbox'],
    text: ['text']
  };
  return unstable_composeClasses(slots, getFilterInputItemUtilityClass, {});
};

const FilterInputItemText = styled(ListItemText, {
  name: componentName$5,
  slot: 'Text',
  overridesResolver: (props, styles) => styles.input
})(({
  theme,
  ownerState
}) => ({// color: theme.palette.text.primary,
}));
const FilterInputItemCheckbox = styled(Checkbox, {
  name: componentName$5,
  slot: 'Checkbox',
  overridesResolver: (props, styles) => styles.input
})(({
  theme,
  ownerState
}) => ({// color: theme.palette.text.primary,
}));
const FilterInputItemRoot = styled(MenuItem, {
  name: componentName$5,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => ({// color: theme.palette.text.primary,
  // background: theme.palette.background.scroll,
}));
const FilterInputItem = /*#__PURE__*/React.forwardRef(function FilterInputItem(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: componentName$5
  });

  const {
    className,
    children,
    label = '',
    value = '',
    checked = false,
    hideCheckbox = false
  } = props,
    other = __rest(props, ["className", "children", "label", "value", "checked", "hideCheckbox"]);

  const ownerState = Object.assign(Object.assign({}, props), {
    label,
    value,
    checked,
    hideCheckbox
  });
  const classes = useUtilityClasses$8();
  return jsxs(FilterInputItemRoot, Object.assign({
    className: clsx(classes.root, className),
    ownerState: ownerState
  }, other, {
    children: [jsx(FilterInputItemText, {
      className: clsx(classes.text, className),
      ownerState: ownerState,
      primary: label
    }, void 0), !hideCheckbox && jsx(FilterInputItemCheckbox, {
      className: clsx(classes.checkbox, className),
      ownerState: ownerState,
      checked: checked
    }, void 0)]
  }), void 0);
});

const FilterPanel = ({
  filters,
  onClearFilters,
  sx
}) => jsxs(Box, Object.assign({
  sx: Object.assign({
    width: 320,
    mb: 20
  }, sx)
}, {
  children: [jsxs(Stack, Object.assign({
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }, {
    children: [jsx(Typography, Object.assign({
      variant: "h5",
      component: "p",
      sx: {
        fontVariant: 'small-caps'
      }
    }, {
      children: "Filters"
    }), void 0), jsx(Button, Object.assign({
      color: "secondary",
      size: "small",
      onClick: onClearFilters
    }, {
      children: "Clear Filters"
    }), void 0)]
  }), void 0),
  /* eslint-disable-next-line array-callback-return */
  filters.map(filter => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;

    switch (filter.type) {
      case 'select':
        {
          return jsx(FormControl, Object.assign({
            fullWidth: true,
            sx: {
              mb: 2
            }
          }, {
            children: jsx(FilterInput, Object.assign({
              label: filter.label,
              name: filter.name,
              onChange: filter.onSelect,
              value: filter.value,
              color: "text.disabled"
            }, {
              children: filter.options.map(({
                value,
                label
              }) => {
                var _a;

                return jsx(FilterInputItem, {
                  value: label,
                  label: label,
                  checked: (_a = filter === null || filter === void 0 ? void 0 : filter.value) === null || _a === void 0 ? void 0 : _a.includes(value)
                }, value);
              })
            }), void 0)
          }), filter === null || filter === void 0 ? void 0 : filter.name);
        }

      case 'multiselect':
        {
          return jsx(FormControl, Object.assign({
            fullWidth: true,
            sx: {
              mb: 2
            }
          }, {
            children: jsx(FilterInput, Object.assign({
              multiple: true,
              label: filter.label,
              name: filter.name,
              onChange: filter.onSelect,
              value: filter.value,
              onChipDelete: (e, value) => filter.onDelete(filter.name, value),
              color: "text.disabled"
            }, {
              children: filter.options.map(({
                value,
                label
              }) => {
                var _a;

                return jsx(FilterInputItem, {
                  value: label,
                  label: label,
                  checked: (_a = filter === null || filter === void 0 ? void 0 : filter.value) === null || _a === void 0 ? void 0 : _a.includes(value)
                }, value);
              })
            }), void 0)
          }), filter === null || filter === void 0 ? void 0 : filter.name);
        }

      case 'slider':
        {
          const minMax = (filter === null || filter === void 0 ? void 0 : filter.options) ? [(_b = (_a = filter === null || filter === void 0 ? void 0 : filter.options) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value, (_e = (_c = filter === null || filter === void 0 ? void 0 : filter.options) === null || _c === void 0 ? void 0 : _c[((_d = filter === null || filter === void 0 ? void 0 : filter.options) === null || _d === void 0 ? void 0 : _d.length) - 1]) === null || _e === void 0 ? void 0 : _e.value] : [];
          const sliderValue = filter === null || filter === void 0 ? void 0 : filter.value;
          const marks = (filter === null || filter === void 0 ? void 0 : filter.marks) || false;
          return jsxs(Box, Object.assign({
            sx: {
              mb: 2
            }
          }, {
            children: [jsxs(Stack, Object.assign({
              direction: "row",
              justifyContent: "space-between"
            }, {
              children: [jsxs(Typography, {
                children: [filter === null || filter === void 0 ? void 0 : filter.label, ' ', (filter === null || filter === void 0 ? void 0 : filter.subLabel) && jsx(Typography, Object.assign({
                  component: "span",
                  sx: {
                    color: 'GrayText'
                  }
                }, {
                  children: filter === null || filter === void 0 ? void 0 : filter.subLabel
                }), void 0)]
              }, void 0), jsxs(Box, {
                children: [jsx(Typography, Object.assign({
                  component: "span",
                  color: "secondary",
                  sx: {
                    fontWeight: 'bold',
                    mr: 1
                  }
                }, {
                  children: (_g = (_f = filter === null || filter === void 0 ? void 0 : filter.options) === null || _f === void 0 ? void 0 : _f[sliderValue === null || sliderValue === void 0 ? void 0 : sliderValue[0]]) === null || _g === void 0 ? void 0 : _g.label
                }), void 0), "-", jsx(Typography, Object.assign({
                  component: "span",
                  color: "secondary",
                  sx: {
                    fontWeight: 'bold',
                    ml: 1
                  }
                }, {
                  children: (_j = (_h = filter === null || filter === void 0 ? void 0 : filter.options) === null || _h === void 0 ? void 0 : _h[sliderValue === null || sliderValue === void 0 ? void 0 : sliderValue[1]]) === null || _j === void 0 ? void 0 : _j.label
                }), void 0)]
              }, void 0)]
            }), void 0), jsx(Slider, {
              color: "secondary",
              size: "small",
              defaultValue: minMax,
              getAriaLabel: () => filter.label,
              value: sliderValue,
              onChange: e => filter === null || filter === void 0 ? void 0 : filter.onSlide(e, filter.name),
              valueLabelDisplay: "off",
              marks: filter.options.map((opt, i) => ({
                value: opt.value,
                label: i === 0 ? opt.label : i === filter.options.length - 1 ? opt.label : null
              })) || [],
              step: null,
              sx: {
                '.MuiSlider-mark': {
                  opacity: marks ? 0.8 : 0
                },
                '.MuiSlider-markLabel': {
                  transform: 'none'
                },
                '.MuiSlider-markLabel[data-index="0"]': {
                  marginLeft: '-5px'
                },
                [`.MuiSlider-markLabel[data-index="${filter.options.length - 1}"]`]: {
                  marginRight: '-5px',
                  left: 'auto !important',
                  right: 0
                }
              },
              min: minMax[0],
              max: minMax[1],
              disableSwap: true
            }, void 0)]
          }), filter === null || filter === void 0 ? void 0 : filter.name);
        }

      case 'checkbox':
        {
          const updateArray = value => {
            const arr = filter.value;

            if (arr.includes(value)) {
              arr.splice(arr.indexOf(value), 1);
            } else {
              arr.push(value);
            }

            return arr;
          };

          return jsx(Box, {
            children: jsxs(FormControl, Object.assign({
              sx: {
                mb: 2
              },
              component: "fieldset",
              variant: "standard"
            }, {
              children: [jsx(FormLabel, Object.assign({
                component: "legend"
              }, {
                children: filter.label
              }), void 0), jsx(FormGroup, {
                children: filter.options.map(({
                  value,
                  label
                }) => {
                  return jsx(FormControlLabel, {
                    control: jsx(Checkbox, {
                      checked: filter.value.includes(value),
                      onChange: e => filter.onCheck(filter.name, updateArray(e.target.name)),
                      name: value
                    }, void 0),
                    label: label
                  }, value);
                })
              }, void 0)]
            }), void 0)
          }, filter === null || filter === void 0 ? void 0 : filter.name);
        }

      case 'radio':
        {
          return jsx(Box, {
            children: jsxs(FormControl, Object.assign({
              sx: {
                mb: 2
              },
              component: "fieldset",
              variant: "standard"
            }, {
              children: [jsx(FormLabel, Object.assign({
                component: "legend"
              }, {
                children: filter.label
              }), void 0), jsx(FormGroup, {
                children: filter.options.map(({
                  value,
                  label
                }) => {
                  return jsx(FormControlLabel, {
                    control: jsx(Checkbox, {
                      checked: filter.value.includes(value),
                      onChange: e => filter.onCheck(filter.name, e.target.name),
                      name: value
                    }, void 0),
                    label: label
                  }, value);
                })
              }, void 0)]
            }), void 0)
          }, filter === null || filter === void 0 ? void 0 : filter.name);
        }

      case 'minmax':
        {
          const updateValues = (i, value) => {
            const arr = filter.value;
            arr.splice(i, 1, parseInt(value));
            return arr;
          };

          return jsx(Box, {
            children: jsx(FormControl, Object.assign({
              sx: {
                mb: 2
              }
            }, {
              children: jsxs(Stack, Object.assign({
                direction: "row",
                spacing: 2
              }, {
                children: [jsx(TextField, {
                  inputProps: {
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  },
                  label: `Min ${filter.label}`,
                  value: filter.value[0] >= 0 ? filter.value[0] : '',
                  onChange: e => filter.onChange(filter.name, updateValues(0, e.target.value))
                }, void 0), jsx(TextField, {
                  inputProps: {
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  },
                  label: `Max ${filter.label}`,
                  value: filter.value[1] >= 0 ? filter.value[1] : '',
                  onChange: e => filter.onChange(filter.name, updateValues(1, e.target.value))
                }, void 0)]
              }), void 0)
            }), void 0)
          }, filter === null || filter === void 0 ? void 0 : filter.name);
        }

      default:
        {
          return jsx(Box, {}, void 0);
        }
    }
  })]
}), void 0);

var global$5 = global$v;
var aCallable = aCallable$2;
var toObject$1 = toObject$4;
var IndexedObject = indexedObject;
var lengthOfArrayLike = lengthOfArrayLike$2;

var TypeError$2 = global$5.TypeError;

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aCallable(callbackfn);
    var O = toObject$1(that);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(O);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError$2('Reduce of empty array with no initial value');
      }
    }
    for (; IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

var arrayReduce = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};

var fails$2 = fails$e;

var arrayMethodIsStrict$1 = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails$2(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};

var classof = classofRaw$1;
var global$4 = global$v;

var engineIsNode = classof(global$4.process) == 'process';

var $$1 = _export;
var $reduce = arrayReduce.left;
var arrayMethodIsStrict = arrayMethodIsStrict$1;
var CHROME_VERSION = engineV8Version;
var IS_NODE = engineIsNode;

var STRICT_METHOD = arrayMethodIsStrict('reduce');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$$1({ target: 'Array', proto: true, forced: !STRICT_METHOD || CHROME_BUG }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});

let _ = t => t,
  _t;

const FontProvider = ({
  fonts
}) => {
  return jsx(GlobalStyles, {
    styles: theme => {
      const fontFaces = fonts.reduce((acc, font) => {
        return `${acc}@font-face { font-family: '${font.family}'; src: url('${font.url}') format('${font.type}'); }\n`;
      }, '');
      return css(_t || (_t = _`
					${0}
				`), fontFaces);
    }
  }, void 0);
};

const componentName$4 = 'FtuiHeader';

function getHeaderUtilityClass(slot) {
  return generateUtilityClass(componentName$4, slot);
}
generateUtilityClasses(componentName$4, ['root']);

const useUtilityClasses$7 = () => {
  const slots = {
    root: ['root']
  };
  return unstable_composeClasses(slots, getHeaderUtilityClass, {});
};

const HeaderRoot = styled(AppBar, {
  name: componentName$4,
  slot: 'Root',
  overridesResolver: styles => styles.root
})(({
  theme
}) => ({
  color: theme.palette.text.primary,
  background: theme.palette.background.scroll
}));
const Header = function Header(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: componentName$4
  });

  const {
    className,
    children,
    maxWidth = 'xl'
  } = props,
    other = __rest(props, ["className", "children", "maxWidth"]);

  const ownerState = Object.assign({}, props);
  const classes = useUtilityClasses$7();
  return jsx(HeaderRoot, Object.assign({
    className: clsx(classes.root, className),
    ownerState: ownerState
  }, other, {
    children: jsx(Container, Object.assign({
      maxWidth: maxWidth
    }, {
      children: jsx(Toolbar, {
        children: children
      }, void 0)
    }), void 0)
  }), void 0);
};

var iterators = {};

var fails$1 = fails$e;

var correctPrototypeGetter = !fails$1(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es-x/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var global$3 = global$v;
var hasOwn$1 = hasOwnProperty_1;
var isCallable$3 = isCallable$g;
var toObject = toObject$4;
var sharedKey = sharedKey$3;
var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

var IE_PROTO = sharedKey('IE_PROTO');
var Object$1 = global$3.Object;
var ObjectPrototype = Object$1.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? Object$1.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn$1(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable$3(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof Object$1 ? ObjectPrototype : null;
};

var fails = fails$e;
var isCallable$2 = isCallable$g;
var getPrototypeOf$1 = objectGetPrototypeOf;
var defineBuiltIn$1 = defineBuiltIn$3;
var wellKnownSymbol$3 = wellKnownSymbol$a;

var ITERATOR$2 = wellKnownSymbol$3('iterator');
var BUGGY_SAFARI_ITERATORS$1 = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es-x/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf$1(getPrototypeOf$1(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype$2[ITERATOR$2].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable$2(IteratorPrototype$2[ITERATOR$2])) {
  defineBuiltIn$1(IteratorPrototype$2, ITERATOR$2, function () {
    return this;
  });
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype$2,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
};

var defineProperty$1 = objectDefineProperty.f;
var hasOwn = hasOwnProperty_1;
var wellKnownSymbol$2 = wellKnownSymbol$a;

var TO_STRING_TAG$1 = wellKnownSymbol$2('toStringTag');

var setToStringTag$2 = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG$1)) {
    defineProperty$1(target, TO_STRING_TAG$1, { configurable: true, value: TAG });
  }
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
var create = objectCreate;
var createPropertyDescriptor = createPropertyDescriptor$3;
var setToStringTag$1 = setToStringTag$2;
var Iterators$2 = iterators;

var returnThis$1 = function () { return this; };

var createIteratorConstructor$1 = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype$1, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag$1(IteratorConstructor, TO_STRING_TAG, false);
  Iterators$2[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var global$2 = global$v;
var isCallable$1 = isCallable$g;

var String$1 = global$2.String;
var TypeError$1 = global$2.TypeError;

var aPossiblePrototype$1 = function (argument) {
  if (typeof argument == 'object' || isCallable$1(argument)) return argument;
  throw TypeError$1("Can't set " + String$1(argument) + ' as a prototype');
};

/* eslint-disable no-proto -- safe */

var uncurryThis = functionUncurryThis;
var anObject = anObject$5;
var aPossiblePrototype = aPossiblePrototype$1;

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es-x/no-object-setprototypeof -- safe
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var $ = _export;
var call = functionCall;
var FunctionName = functionName;
var isCallable = isCallable$g;
var createIteratorConstructor = createIteratorConstructor$1;
var getPrototypeOf = objectGetPrototypeOf;
var setPrototypeOf = objectSetPrototypeOf;
var setToStringTag = setToStringTag$2;
var createNonEnumerableProperty$1 = createNonEnumerableProperty$5;
var defineBuiltIn = defineBuiltIn$3;
var wellKnownSymbol$1 = wellKnownSymbol$a;
var Iterators$1 = iterators;
var IteratorsCore = iteratorsCore;

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol$1('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

var defineIterator$1 = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$1]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$1])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR$1, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty$1(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if (IterablePrototype[ITERATOR$1] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR$1, defaultIterator, { name: DEFAULT });
  }
  Iterators$1[NAME] = defaultIterator;

  return methods;
};

var toIndexedObject = toIndexedObject$5;
var addToUnscopables = addToUnscopables$2;
var Iterators = iterators;
var InternalStateModule = internalState;
var defineProperty = objectDefineProperty.f;
var defineIterator = defineIterator$1;
var DESCRIPTORS = descriptors;

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = documentCreateElement$2;

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype$1 = classList && classList.constructor && classList.constructor.prototype;

var domTokenListPrototype = DOMTokenListPrototype$1 === Object.prototype ? undefined : DOMTokenListPrototype$1;

var global$1 = global$v;
var DOMIterables = domIterables;
var DOMTokenListPrototype = domTokenListPrototype;
var ArrayIteratorMethods = es_array_iterator;
var createNonEnumerableProperty = createNonEnumerableProperty$5;
var wellKnownSymbol = wellKnownSymbol$a;

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global$1[COLLECTION_NAME] && global$1[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

const componentName$3 = 'FtuiHeaderButtonBar';

function getHeaderButtonBarUtilityClass(slot) {
  return generateUtilityClass(componentName$3, slot);
}
generateUtilityClasses(componentName$3, ['root', 'menu']);

const useUtilityClasses$6 = ownerState => {
  const slots = {
    root: ['root'],
    menu: ['menu']
  };
  return unstable_composeClasses(slots, getHeaderButtonBarUtilityClass, {});
};

const HeaderButtonBarMenu = styled(Menu, {
  name: componentName$3,
  slot: 'Menu',
  overridesResolver: (props, styles) => styles.button
})(({
  theme,
  ownerState
}) => ({
  [`.MuiPaper-root`]: {
    background: theme.palette.background.scroll,
    color: theme.palette.secondary.main,
    fontSize: 15
  }
}));

const mobileChildrenWithOnClick = (children, onClick) => {
  return React.Children.map(children, child => {
    if ( /*#__PURE__*/React.isValidElement(child)) {
      return /*#__PURE__*/React.createElement(MenuItem, Object.assign(Object.assign({}, child.props), {
        onClick: () => {
          if (typeof child.props.onClick === 'function') {
            child.props.onClick();
          }

          onClick();
        }
      }));
    }
  });
};

const HeaderButtonBarRoot = styled('div', {
  name: componentName$3,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => ({
  [`.MuiButton-root`]: {
    color: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
    fontSize: 15,
    [`&:hover`]: {
      borderColor: theme.palette.secondary.dark
    }
  }
}));
const HeaderButtonBar = /*#__PURE__*/React.forwardRef(function HeaderButtonBar(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: componentName$3
  });

  const {
    className,
    component = 'div',
    children,
    componentsProps = {}
  } = props,
    other = __rest(props, ["className", "component", "children", "componentsProps"]);

  const ComponentProp = component;
  const ownerState = Object.assign(Object.assign({}, props), {
    component
  });
  const classes = useUtilityClasses$6();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const mobileMenuId = 'header-button-bar-mobile-menu';

  const renderMobileMenu = jsx(HeaderButtonBarMenu, Object.assign({}, componentsProps.menu, {
    ownerState: ownerState,
    id: mobileMenuId,
    anchorEl: mobileMoreAnchorEl,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left'
    },
    keepMounted: true,
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left'
    },
    open: isMobileMenuOpen,
    onClose: handleMobileMenuClose
  }, {
    children: mobileChildrenWithOnClick(children, handleMobileMenuClose)
  }), void 0);

  return jsxs(HeaderButtonBarRoot, Object.assign({
    as: ComponentProp,
    className: clsx(classes.root, className),
    ownerState: ownerState
  }, other, {
    children: [jsx(Box, Object.assign({
      sx: {
        display: {
          xs: 'none',
          md: 'flex'
        }
      }
    }, {
      children: children
    }), void 0), jsx(Box, Object.assign({
      sx: {
        display: {
          xs: 'flex',
          md: 'none'
        }
      }
    }, {
      children: jsx(IconButton, Object.assign({
        size: "large",
        "aria-label": "show more",
        "aria-controls": mobileMenuId,
        "aria-haspopup": "true",
        onClick: handleMobileMenuOpen
      }, {
        children: jsx(MoreIcon, {}, void 0)
      }), void 0)
    }), void 0), renderMobileMenu]
  }), void 0);
});

const componentName$2 = 'FtuiHeaderTitle';

function getHeaderTitleUtilityClass(slot) {
  return generateUtilityClass(componentName$2, slot);
}
generateUtilityClasses(componentName$2, ['root', 'button', 'menu']);

const useUtilityClasses$5 = ownerState => {
  const slots = {
    root: ['root'],
    button: ['button'],
    menu: ['menu']
  };
  return unstable_composeClasses(slots, getHeaderTitleUtilityClass, {});
};

const HeaderTitleButton = styled(Button, {
  name: componentName$2,
  slot: 'Button',
  overridesResolver: (props, styles) => styles.button
})(({
  theme,
  ownerState
}) => ({
  fontWeight: 700,
  fontSize: 28,
  textTransform: 'none'
}));
const HeaderTitleMenu = styled(Menu, {
  name: componentName$2,
  slot: 'Menu',
  overridesResolver: (props, styles) => styles.button
})(({
  theme,
  ownerState
}) => ({
  [`.MuiPaper-root`]: {
    background: theme.palette.background.scroll
  }
}));

const childrenWithOnClick = (children, onClick) => {
  return React.Children.map(children, child => {
    if ( /*#__PURE__*/React.isValidElement(child)) {
      return /*#__PURE__*/React.cloneElement(child, {
        onClick: () => {
          if (typeof child.props.onClick === 'function') {
            child.props.onClick();
          }

          onClick();
        }
      });
    }
  });
};

const HeaderTitleRoot = styled('div', {
  name: componentName$2,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => ({
  color: theme.palette.text.primary,
  flexGrow: 1
}));
const HeaderTitle = /*#__PURE__*/React.forwardRef(function HeaderTitle(inProps, ref) {
  var _a;

  const props = useThemeProps({
    props: inProps,
    name: componentName$2
  });

  const {
    className,
    component = 'div',
    componentsProps = {},
    label,
    children
  } = props,
    other = __rest(props, ["className", "component", "componentsProps", "label", "children"]);

  const ComponentProp = component;
  const ownerState = Object.assign(Object.assign({}, props), {
    component
  });
  const classes = useUtilityClasses$5();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'header-title-menu';

  const renderMenu = jsx(HeaderTitleMenu, Object.assign({}, componentsProps.menu, {
    ownerState: ownerState,
    id: menuId,
    anchorEl: anchorEl,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left'
    },
    keepMounted: true,
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left'
    },
    open: isMenuOpen,
    onClose: handleMenuClose
  }, {
    children: childrenWithOnClick(children, handleMenuClose)
  }), void 0);

  return jsxs(HeaderTitleRoot, Object.assign({
    as: ComponentProp,
    className: clsx(classes.root, className),
    ownerState: ownerState
  }, other, {
    children: [jsx(HeaderTitleButton, Object.assign({}, componentsProps.button, {
      ownerState: ownerState,
      className: clsx(classes.button, (_a = componentsProps.button) === null || _a === void 0 ? void 0 : _a.className),
      "aria-controls": isMenuOpen ? menuId : undefined,
      "aria-haspopup": "true",
      "aria-expanded": isMenuOpen ? 'true' : undefined,
      variant: "text",
      disableElevation: true,
      onClick: handleMenuOpen,
      endIcon: jsx(ArrowDropDownIcon, {}, void 0)
    }, {
      children: label
    }), void 0), renderMenu]
  }), void 0);
});

function getInfoItemUtilityClass(slot) {
  return generateUtilityClass('FtuiInfoItem', slot);
}
const infoItemClasses = generateUtilityClasses('FtuiInfoItem', ['root', 'label', 'align', 'color', 'italic', 'inline']);

const useUtilityClasses$4 = ownerState => {
  const {
    align,
    color,
    labelProps
  } = ownerState;
  const slots = {
    root: ['root', color && 'color', (labelProps === null || labelProps === void 0 ? void 0 : labelProps.inline) && 'inline'],
    label: ['label', align && 'align', color && 'color', (labelProps === null || labelProps === void 0 ? void 0 : labelProps.inline) && 'inline', (labelProps === null || labelProps === void 0 ? void 0 : labelProps.italic) && 'italic'],
    content: ['content', color && 'color']
  };
  return unstable_composeClasses(slots, getInfoItemUtilityClass, {});
};

const InfoItemRoot = styled('div', {
  name: 'FtuiInfoItem',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => {
  return {
    display: 'block'
  };
});
const InfoItemLabel = styled(Typography, {
  name: 'FtuiInfoItem',
  slot: 'Label',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => {
  return {
    color: theme.palette.text.primary,
    display: 'block',
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    marginRight: 0,
    [`&.${infoItemClasses.color}`]: {
      color: getThemeValue(theme, ownerState.color)
    },
    [`&.${infoItemClasses.inline}`]: {
      display: 'inline-block',
      fontSize: theme.typography.body2.fontSize,
      marginRight: 5
    },
    [`&.${infoItemClasses.italic}`]: {
      fontStyle: 'italic'
    }
  };
});
const InfoItemContent = styled('div', {
  name: 'FtuiInfoItem',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => {
  return {
    color: theme.palette.text.secondary,
    display: 'inline-block',
    fontSize: theme.typography.body2.fontSize,
    [`svg`]: {
      verticalAlign: 'bottom'
    },
    [`&.${infoItemClasses.color}`]: {
      color: getThemeValue(theme, ownerState.color)
    },
    [`&.${infoItemClasses.inline}:not(.${infoItemClasses.color})`]: {
      color: theme.palette.text.primary
    }
  };
});
const InfoItem = /*#__PURE__*/React.forwardRef(function InfoItem(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'FtuiInfoItem'
  });

  const {
    children,
    className,
    color,
    label,
    labelProps
  } = props,
    other = __rest(props, ["children", "className", "color", "label", "labelProps"]);

  const ownerState = Object.assign(Object.assign({}, props), {
    color,
    labelProps
  });
  const classes = useUtilityClasses$4(ownerState);
  return jsxs(InfoItemRoot, Object.assign({
    className: clsx(classes.root, className),
    ownerState: ownerState
  }, other, {
    children: [jsx(InfoItemLabel, Object.assign({
      as: "span",
      className: clsx(classes.label, className),
      ownerState: ownerState
    }, other, {
      children: label
    }), void 0), typeof children === 'string' ? jsx(InfoItemContent, {
      className: clsx(classes.content, className),
      ownerState: ownerState,
      dangerouslySetInnerHTML: {
        __html: children
      }
    }, void 0) : jsx(InfoItemContent, {
      className: clsx(classes.content, className),
      ownerState: ownerState,
      children: children
    }, void 0)]
  }), void 0);
});

const InfoItemList = ({
  items: _items = [],
  inline: _inline = true
}) => jsx(Fragment, {
  children: _items.map(({
    label,
    children
  }, i) => jsx(InfoItem, Object.assign({
    label: label,
    labelProps: {
      inline: _inline
    }
  }, {
    children: children
  }), i))
}, void 0);

const TooltipBox = styled(Box$1)(({
  theme
}) => Object.assign(Object.assign({}, theme.typography.body2), {
  alignItems: 'center',
  background: theme.palette.grey[700],
  borderRadius: '2px',
  color: theme.palette.primary.contrastText,
  display: 'flex',
  flexDirection: 'row',
  margin: theme.spacing(0.5, 0),
  padding: theme.spacing(0.75, 1.5),
  textAlign: 'center'
}));
const TextChip = styled(Chip$1)(({
  theme
}) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.action.selected,
  height: 'auto',
  ':hover': {
    backgroundColor: theme.palette.action.focus
  },
  '& .MuiChip-label': Object.assign(Object.assign({}, theme.typography.caption), {
    padding: theme.spacing(0, 0.8125)
  })
}));
const LabelChip = _a => {
  var {
    tooltip
  } = _a,
    props = __rest(_a, ["tooltip"]);

  return tooltip ? jsx(Tooltip, Object.assign({
    title: tooltip,
    components: {
      Tooltip: TooltipBox
    }
  }, {
    children: jsx(TextChip, Object.assign({
      size: "small"
    }, props), void 0)
  }), void 0) : jsx(TextChip, Object.assign({
    size: "small"
  }, props), void 0);
};

const componentName$1 = 'FtuiPaywallScrollBlock';

function getPaywallScrollBlockUtilityClass(slot) {
  return generateUtilityClass(componentName$1, slot);
}
generateUtilityClasses(componentName$1, ['root']);

function getScrollUtilityClass(slot) {
  return generateUtilityClass('FtuiScroll', slot);
}
generateUtilityClasses('FtuiScroll', ['root']);

const useUtilityClasses$3 = ownerState => {
  const slots = {
    root: ['root']
  };
  return unstable_composeClasses(slots, getScrollUtilityClass, ownerState.classes);
};

const ScrollRoot = styled(Paper, {
  name: 'FtuiScroll',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => {
  return {
    borderTop: `3px solid ${getThemeValue(theme, ownerState.color) || theme.palette.grey[700]}`,
    borderLeft: `none`,
    borderRight: `none`,
    borderBottom: `2px solid ${getThemeValue(theme, ownerState.color) || theme.palette.grey[700]}`,
    borderRadius: `0`,
    background: `linear-gradient(to right, transparent 4px, ${getThemeValue(theme, 'background.scroll')} 4px, ${getThemeValue(theme, 'background.scroll')} calc(100% - 4px), transparent 4px)`,
    padding: `16px`
  };
});
const Scroll = /*#__PURE__*/React.forwardRef(function Scroll(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'FtuiScroll'
  });

  const {
    className,
    color,
    component = 'div'
  } = props,
    other = __rest(props, ["className", "color", "component"]);

  const ownerState = Object.assign(Object.assign({}, props), {
    color,
    component
  });
  const classes = useUtilityClasses$3(ownerState);
  return jsx(ScrollRoot, Object.assign({
    className: clsx(classes.root, className),
    component: component,
    ownerState: ownerState,
    elevation: 0
  }, other, {
    children: props.children
  }), void 0);
});

function getScrollBlockUtilityClass(slot) {
  return generateUtilityClass('FtuiScrollBlock', slot);
}
generateUtilityClasses('FtuiScrollBlock', ['root']);

const useUtilityClasses$2 = ownerState => unstable_composeClasses({
  root: ['root'],
  header: ['header'],
  title: ['title'],
  subtitle: ['subtitle'],
  detailButton: ['detailButton'],
  footer: ['footer']
}, getScrollBlockUtilityClass, ownerState.classes);

const ScrollBlockRoot = styled(Card, {
  name: 'FtuiScrollBlock',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => ({
  background: 'none',
  maxWidth: 656
}));
const ScrollBlockHeader = styled(CardHeader, {
  name: 'FtuiScrollBlock',
  slot: 'Header',
  overridesResolver: (props, styles) => styles.header
})(({
  theme,
  ownerState
}) => ({
  [`.FtuiScrollBlock-title`]: {
    display: `inline-block`
  },
  [`.MuiCardHeader-action`]: {
    alignSelf: 'flex-end'
  }
}));
const ScrollBlockTitle = styled(Typography, {
  name: 'FtuiScrollBlock',
  slot: 'Title',
  overridesResolver: (props, styles) => styles.title
})(({
  theme,
  ownerState
}) => ({
  fontWeight: 700
}));
const ScrollBlockSubtitle = styled(Typography, {
  name: 'FtuiScrollBlock',
  slot: 'Subtitle',
  overridesResolver: (props, styles) => styles.subtitle
})(({
  theme,
  ownerState
}) => ({
  fontSize: 12,
  fontStyle: `italic`
}));
const ScrollBlockDetailButton = styled(Button, {
  name: 'FtuiScrollBlock',
  slot: 'DetailButton',
  overridesResolver: (props, styles) => styles.detailButton
})(({
  theme,
  ownerState
}) => ({}));
const ScrollBlockContent = styled(CardContent, {
  name: 'FtuiScrollBlock',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content
})(({
  theme,
  ownerState
}) => ({
  paddingTop: 0,
  paddingBottom: 0
}));
const ScrollBlockFooter = styled(CardActions, {
  name: 'FtuiScrollBlock',
  slot: 'Footer',
  overridesResolver: (props, styles) => styles.footer
})(({
  theme,
  ownerState
}) => ({
  padding: '8px 32px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  fontStyle: 'italic'
}));
const ScrollBlock = /*#__PURE__*/React.forwardRef(function ScrollBlock(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'FtuiScrollBlock'
  });

  const {
    className,
    color,
    component = 'div',
    detailUrl,
    notes,
    pronunciation,
    source,
    subtitle = '',
    title = ''
  } = props,
    other = __rest(props, ["className", "color", "component", "detailUrl", "notes", "pronunciation", "source", "subtitle", "title"]);

  const ownerState = Object.assign(Object.assign({}, props), {
    color,
    component,
    subtitle,
    title
  });
  const classes = useUtilityClasses$2(ownerState);
  const [playing, setPlaying] = useState(false);
  const audio = useMemo(() => new Audio(pronunciation), [pronunciation]);

  audio.onplay = () => setPlaying(true);

  audio.onended = () => setPlaying(false);

  return jsxs(ScrollBlockRoot, Object.assign({
    className: clsx(classes.root, className),
    component: component,
    ownerState: ownerState,
    elevation: 0
  }, other, {
    children: [jsx(ScrollBlockHeader, {
      disableTypography: true,
      title: jsxs(Fragment, {
        children: [jsx(ScrollBlockTitle, Object.assign({
          component: "h2",
          variant: "h3",
          gutterBottom: false,
          className: clsx(classes.title, className),
          ownerState: ownerState
        }, {
          children: title
        }), void 0), pronunciation && jsx(IconButton, Object.assign({
          size: "small",
          sx: {
            margin: `-10px 0 0 2px`
          },
          onClick: () => audio.play(),
          disabled: playing
        }, {
          children: jsx(VolumeUpIcon, {}, void 0)
        }), void 0)]
      }, void 0),
      subheader: jsx(ScrollBlockSubtitle, Object.assign({
        component: "p",
        variant: "subtitle1",
        color: "text.secondary",
        gutterBottom: false,
        className: clsx(classes.subtitle, className),
        ownerState: ownerState
      }, {
        children: subtitle
      }), void 0),
      action: detailUrl && jsx(ScrollBlockDetailButton, Object.assign({
        component: "a",
        color: "secondary",
        href: detailUrl,
        className: clsx(classes.detailButton, className),
        ownerState: ownerState
      }, {
        children: "View Details"
      }), void 0),
      className: clsx(classes.header, className),
      component: component,
      ownerState: ownerState
    }, void 0), jsx(ScrollBlockContent, Object.assign({
      className: clsx(classes.header, className),
      component: component,
      ownerState: ownerState
    }, {
      children: jsx(Scroll, Object.assign({
        color: color
      }, {
        children: props.children
      }), void 0)
    }), void 0), jsxs(ScrollBlockFooter, Object.assign({
      component: "footer",
      className: clsx(classes.header, className),
      ownerState: ownerState
    }, {
      children: [notes && jsxs(Typography, Object.assign({
        variant: "body2",
        color: "text.secondary"
      }, {
        children: ["Notes: ", notes]
      }), void 0), source && jsxs(Typography, Object.assign({
        variant: "body2",
        color: "text.secondary"
      }, {
        children: ["Source: ", source]
      }), void 0)]
    }), void 0)]
  }), void 0);
});

/**
 * Build classes for slots based on props
 */

const useUtilityClasses$1 = ownerState => {
  const slots = {
    root: ['root'],
    sourceImage: ['sourceImage'],
    sourceTitle: ['sourceTitle'],
    sourceDescription: ['sourceDescription']
  };
  return unstable_composeClasses(slots, getPaywallScrollBlockUtilityClass, {});
};
/**
 * Root component and overrides
 */


const PaywallScrollBlockRoot = styled(ScrollBlock, {
  name: componentName$1,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => ({}));
/**
 * Source Image component and overrides
 */

const PaywallScrollBlockSourceImage = styled('img', {
  name: componentName$1,
  slot: 'SourceImage',
  overridesResolver: (props, styles) => styles.sourceImage
})(() => ({
  maxWidth: '100%',
  display: 'block',
  margin: '0 auto'
}));
/**
 * Source Title component and overrides
 */

const PaywallScrollBlockSourceTitle = styled(Typography, {
  name: componentName$1,
  slot: 'SourceTitle',
  overridesResolver: (props, styles) => styles.sourceTitle
})(({
  theme
}) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.h4.fontSize,
  fontStyle: 'italic',
  marginBottom: 30
}));
/**
 * Source Description component and overrides
 */

const PaywallScrollBlockSourceDescription = styled('p', {
  name: componentName$1,
  slot: 'SourceDescription',
  overridesResolver: (props, styles) => styles.sourceDescription
})(({
  theme
}) => ({
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  letterSpacing: '0.46px',
  marginBottom: 30
}));
/**
 * Create component to be
 */

const PaywallScrollBlock = /*#__PURE__*/React.forwardRef(function PaywallScrollBlock(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: componentName$1
  });

  const {
    className,
    name,
    description,
    color,
    sourceImage,
    sourceTitle,
    sourceDescription,
    sourceLink
  } = props,
    other = __rest(props, ["className", "name", "description", "color", "sourceImage", "sourceTitle", "sourceDescription", "sourceLink"]);

  const ownerState = props;
  const classes = useUtilityClasses$1();
  return jsx(PaywallScrollBlockRoot, Object.assign({
    className: clsx(classes.root, className),
    ownerState: ownerState,
    title: name,
    subtitle: description,
    color: color
  }, other, {
    children: jsxs(Grid, Object.assign({
      container: true,
      rowSpacing: 2,
      columnSpacing: 2
    }, {
      children: [jsx(Grid, Object.assign({
        item: true,
        xs: 12,
        sm: 4
      }, {
        children: jsx("a", Object.assign({
          href: sourceLink
        }, {
          children: jsx(PaywallScrollBlockSourceImage, {
            className: clsx(classes.sourceImage, className),
            src: sourceImage,
            alt: sourceTitle,
            ownerState: ownerState
          }, void 0)
        }), void 0)
      }), void 0), jsxs(Grid, Object.assign({
        item: true,
        xs: 12,
        sm: 8
      }, {
        children: [jsx(PaywallScrollBlockSourceTitle, Object.assign({
          className: clsx(classes.sourceTitle, className),
          ownerState: ownerState
        }, {
          children: sourceTitle
        }), void 0), jsx(PaywallScrollBlockSourceDescription, Object.assign({
          className: clsx(classes.sourceDescription, className),
          ownerState: ownerState
        }, {
          children: sourceDescription
        }), void 0), jsx(Button, Object.assign({
          component: "a",
          href: sourceLink,
          variant: "contained",
          color: "secondary"
        }, {
          children: "View Purchase Options"
        }), void 0)]
      }), void 0)]
    }), void 0)
  }), void 0);
});

const componentName = 'FtuiSampleComponent';

function getSampleComponentUtilityClass(slot) {
  return generateUtilityClass(componentName, slot);
}
const sampleComponentClasses = generateUtilityClasses(componentName, ['root', 'fullWidth', 'text']);

const useUtilityClasses = ownerState => {
  const {
    fullWidth
  } = ownerState;
  const slots = {
    root: ['root'],
    text: ['text', fullWidth && 'fullWidth']
  };
  return unstable_composeClasses(slots, getSampleComponentUtilityClass, {});
};

const SampleComponentText = styled('span', {
  name: componentName,
  slot: 'Text',
  overridesResolver: (props, styles) => styles.text
})(() => ({
  fontStyle: 'italic',
  [`&.${sampleComponentClasses.fullWidth}`]: {
    display: 'block'
  }
}));
const SampleComponentRoot = styled('div', {
  name: componentName,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({
  theme,
  ownerState
}) => ({
  color: theme.palette.text.primary
}));
const SampleComponent = /*#__PURE__*/React.forwardRef(function SampleComponent(inProps, ref) {
  var _a;

  const props = useThemeProps({
    props: inProps,
    name: componentName
  });

  const {
    className,
    component = 'div',
    variant = 'contained',
    fullWidth = false,
    componentsProps = {}
  } = props,
    other = __rest(props, ["className", "component", "variant", "fullWidth", "componentsProps"]);

  const ComponentProp = component;
  const ownerState = Object.assign(Object.assign({}, props), {
    component,
    fullWidth,
    variant
  });
  const classes = useUtilityClasses(ownerState);
  return jsx(SampleComponentRoot, Object.assign({
    as: ComponentProp,
    className: clsx(classes.root, className),
    ownerState: ownerState
  }, other, {
    children: jsx(SampleComponentText, Object.assign({}, componentsProps.text, {
      ownerState: ownerState,
      className: clsx(classes.text, (_a = componentsProps.text) === null || _a === void 0 ? void 0 : _a.className)
    }, {
      children: "Sample Component!"
    }), void 0)
  }), void 0);
});

export { FilterInput, FilterInputItem, FilterPanel, FilterableListView, FontProvider, Header, HeaderButtonBar, HeaderTitle, InfoItem, InfoItemList, LabelChip, PaywallScrollBlock, SampleComponent, Scroll, ScrollBlock };
