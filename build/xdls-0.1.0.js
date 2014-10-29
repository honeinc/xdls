require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
  "use strict";
/**
 * md5.js
 * Copyright (c) 2011, Yoshinori Kohyama (http://algobit.jp/)
 * all rights reserved.
 */

exports.digest = function (M) {
  var originalLength
    , i
    , j
    , k
    , l
    , A
    , B
    , C
    , D
    , AA
    , BB
    , CC
    , DD
    , X
    , rval
    ;

	function F(x, y, z) { return (x & y) | (~x & z); }
	function G(x, y, z) { return (x & z) | (y & ~z); }
	function H(x, y, z) { return x ^ y ^ z;          }
	function I(x, y, z) { return y ^ (x | ~z);       }

	function to4bytes(n) {
		return [n&0xff, (n>>>8)&0xff, (n>>>16)&0xff, (n>>>24)&0xff];
	}

	originalLength = M.length; // for Step.2

	// 3.1 Step 1. Append Padding Bits
	M.push(0x80);
	l = (56 - M.length)&0x3f;
	for (i = 0; i < l; i++)
		M.push(0);

	// 3.2 Step 2. Append Length
	to4bytes(8*originalLength).forEach(function (e) { M.push(e); });
	[0, 0, 0, 0].forEach(function (e) { M.push(e); });

	// 3.3 Step 3. Initialize MD Buffer
	A = [0x67452301];
	B = [0xefcdab89];
	C = [0x98badcfe];
	D = [0x10325476];

	// 3.4 Step 4. Process Message in 16-Word Blocks
	function rounds(a, b, c, d, k, s, t, f) {
		a[0] += f(b[0], c[0], d[0]) + X[k] + t;
		a[0] = ((a[0]<<s)|(a[0]>>>(32 - s)));
		a[0] += b[0];
	}

	for (i = 0; i < M.length; i += 64) {
		X = [];
		for (j = 0; j < 64; j += 4) {
			k = i + j;
			X.push(M[k]|(M[k + 1]<<8)|(M[k + 2]<<16)|(M[k + 3]<<24));
		}
		AA = A[0];
		BB = B[0];
		CC = C[0];
		DD = D[0];

		// Round 1.
		rounds(A, B, C, D,  0,  7, 0xd76aa478, F);
		rounds(D, A, B, C,  1, 12, 0xe8c7b756, F);
		rounds(C, D, A, B,  2, 17, 0x242070db, F);
		rounds(B, C, D, A,  3, 22, 0xc1bdceee, F);
		rounds(A, B, C, D,  4,  7, 0xf57c0faf, F);
		rounds(D, A, B, C,  5, 12, 0x4787c62a, F);
		rounds(C, D, A, B,  6, 17, 0xa8304613, F);
		rounds(B, C, D, A,  7, 22, 0xfd469501, F);
		rounds(A, B, C, D,  8,  7, 0x698098d8, F);
		rounds(D, A, B, C,  9, 12, 0x8b44f7af, F);
		rounds(C, D, A, B, 10, 17, 0xffff5bb1, F);
		rounds(B, C, D, A, 11, 22, 0x895cd7be, F);
		rounds(A, B, C, D, 12,  7, 0x6b901122, F);
		rounds(D, A, B, C, 13, 12, 0xfd987193, F);
		rounds(C, D, A, B, 14, 17, 0xa679438e, F);
		rounds(B, C, D, A, 15, 22, 0x49b40821, F);

		// Round 2.
		rounds(A, B, C, D,  1,  5, 0xf61e2562, G);
		rounds(D, A, B, C,  6,  9, 0xc040b340, G);
		rounds(C, D, A, B, 11, 14, 0x265e5a51, G);
		rounds(B, C, D, A,  0, 20, 0xe9b6c7aa, G);
		rounds(A, B, C, D,  5,  5, 0xd62f105d, G);
		rounds(D, A, B, C, 10,  9, 0x02441453, G);
		rounds(C, D, A, B, 15, 14, 0xd8a1e681, G);
		rounds(B, C, D, A,  4, 20, 0xe7d3fbc8, G);
		rounds(A, B, C, D,  9,  5, 0x21e1cde6, G);
		rounds(D, A, B, C, 14,  9, 0xc33707d6, G);
		rounds(C, D, A, B,  3, 14, 0xf4d50d87, G);
		rounds(B, C, D, A,  8, 20, 0x455a14ed, G);
		rounds(A, B, C, D, 13,  5, 0xa9e3e905, G);
		rounds(D, A, B, C,  2,  9, 0xfcefa3f8, G);
		rounds(C, D, A, B,  7, 14, 0x676f02d9, G);
		rounds(B, C, D, A, 12, 20, 0x8d2a4c8a, G);

		// Round 3.
		rounds(A, B, C, D,  5,  4, 0xfffa3942, H);
		rounds(D, A, B, C,  8, 11, 0x8771f681, H);
		rounds(C, D, A, B, 11, 16, 0x6d9d6122, H);
		rounds(B, C, D, A, 14, 23, 0xfde5380c, H);
		rounds(A, B, C, D,  1,  4, 0xa4beea44, H);
		rounds(D, A, B, C,  4, 11, 0x4bdecfa9, H);
		rounds(C, D, A, B,  7, 16, 0xf6bb4b60, H);
		rounds(B, C, D, A, 10, 23, 0xbebfbc70, H);
		rounds(A, B, C, D, 13,  4, 0x289b7ec6, H);
		rounds(D, A, B, C,  0, 11, 0xeaa127fa, H);
		rounds(C, D, A, B,  3, 16, 0xd4ef3085, H);
		rounds(B, C, D, A,  6, 23, 0x04881d05, H);
		rounds(A, B, C, D,  9,  4, 0xd9d4d039, H);
		rounds(D, A, B, C, 12, 11, 0xe6db99e5, H);
		rounds(C, D, A, B, 15, 16, 0x1fa27cf8, H);
		rounds(B, C, D, A,  2, 23, 0xc4ac5665, H);

		// Round 4.
		rounds(A, B, C, D,  0,  6, 0xf4292244, I);
		rounds(D, A, B, C,  7, 10, 0x432aff97, I);
		rounds(C, D, A, B, 14, 15, 0xab9423a7, I);
		rounds(B, C, D, A,  5, 21, 0xfc93a039, I);
		rounds(A, B, C, D, 12,  6, 0x655b59c3, I);
		rounds(D, A, B, C,  3, 10, 0x8f0ccc92, I);
		rounds(C, D, A, B, 10, 15, 0xffeff47d, I);
		rounds(B, C, D, A,  1, 21, 0x85845dd1, I);
		rounds(A, B, C, D,  8,  6, 0x6fa87e4f, I);
		rounds(D, A, B, C, 15, 10, 0xfe2ce6e0, I);
		rounds(C, D, A, B,  6, 15, 0xa3014314, I);
		rounds(B, C, D, A, 13, 21, 0x4e0811a1, I);
		rounds(A, B, C, D,  4,  6, 0xf7537e82, I);
		rounds(D, A, B, C, 11, 10, 0xbd3af235, I);
		rounds(C, D, A, B,  2, 15, 0x2ad7d2bb, I);
		rounds(B, C, D, A,  9, 21, 0xeb86d391, I);

		A[0] += AA;
		B[0] += BB;
		C[0] += CC;
		D[0] += DD;
	}

	rval = [];
	to4bytes(A[0]).forEach(function (e) { rval.push(e); });
	to4bytes(B[0]).forEach(function (e) { rval.push(e); });
	to4bytes(C[0]).forEach(function (e) { rval.push(e); });
	to4bytes(D[0]).forEach(function (e) { rval.push(e); });

	return rval;
}

exports.digest_s = function (s) {
	var M = []
    , i
    , d
    , rstr
    , s
    ;

	for (i = 0; i < s.length; i++)
		M.push(s.charCodeAt(i));

	d = exports.digest(M);
	rstr = '';

	d.forEach(function (e) {
		s = e.toString(16);
		while (s.length < 2)
			s = '0' + s;
		rstr += s;
	});

	return rstr;
}

}());

},{}],"xdls":[function(require,module,exports){
'use strict';

module.exports = XDLS;

var md5 = require( 'md5' );

var PREFIX = 'xdls:';

// must match localforage
var METHODS = [
    'clear',
    'getItem',
    'key',
    'keys',
    'length',
    'removeItem',
    'setItem'  
];

function XDLS( options ) {
    this.origin = options.origin;
    this.path = options.path;
    this.ready = false;
    this.queue = [];
    this.messageId = 0;
    this.callbacks = {};
    
    if ( !( this.origin && this.path ) ) {
        throw new Error( 'XDLS needs both an origin and a path specified in the constructor options.' );
    }
    
    for ( var i = 0; i < METHODS.length; ++i ) {
        this[ METHODS[ i ] ] = this._handleMethod.bind( this, METHODS[ i ] );
    }
    
    if ( typeof( options.init ) === 'undefined' || options.init ) {
        this.init();
    }
}

XDLS.prototype.init = function() {
    var self = this;
    
    if ( self._iframe ) {
        return;
    }
    
    if ( !( window.postMessage && window.JSON ) ) {
        throw new Error( 'XDLS requires both postMossage and JSON support.' );
    }

    var onLoaded = self._onLoaded.bind( self );
    var onMessage = self._onMessage.bind( self );

    var iframeID = 'xdls-' + md5.digest_s( self.origin + self.path );
    
    var existingIframe = document.getElementById( iframeID );
    if ( existingIframe ) {
        self._iframe = existingIframe;
        if ( self._iframe.dataset.loaded ) {
            onLoaded();
        }
    }
    else {
        self._iframe = document.createElement( 'iframe' );
        self._iframe.id = iframeID;
        self._iframe.dataset.origin = self.origin;
        self._iframe.dataset.path = self.path;
        self._iframe.style.cssText = "width:1px; height:1px; display: none;";
        document.body.appendChild( self._iframe );
    }

    if ( window.addEventListener ) {
        self._iframe.addEventListener( 'load', onLoaded, false );
        window.addEventListener( 'message', onMessage, false );
    }
    else if ( self._iframe.attachEvent ) {
        self._iframe.attachEvent( 'onload', onLoaded, false);
        window.attachEvent( 'onmessage', onMessage );
    }
    else {
        throw new Error( 'XDLS could not properly bind for event handling.' );
    }

    if ( !existingIframe ) {
        self._iframe.src = self.origin + self.path;
    }
};

XDLS.prototype._onLoaded = function() {
    var self = this;
    
    self.ready = true;
    self._iframe.dataset.loaded = true;
    
    var message;
    while ( ( message = self.queue.shift() ) ) {
        self._sendMessage( message );
    }
};

XDLS.prototype._handleMethod = function() {
    var self = this;
    var _args = Array.prototype.slice.call( arguments, 0 ); // convert arguments to an array
    var method = _args.shift();
    var callback = null;
    
    self.init();
    
    if ( _args.length && typeof( _args[ _args.length - 1 ] ) === 'function' ) {
        callback = _args.pop();
    }

    var id = ++self.messageId;
    
    if ( callback ) {
        self.callbacks[ id ] = callback;
    }

    var message = {
        id: id,
        method: method,
        arguments: _args
    };
    
    if ( self.ready ) {
        self._sendMessage( message );
    }
    else {
        self.queue.push( message );
    }
};

XDLS.prototype._sendMessage = function( message ) {
    var self = this;
    self._iframe.contentWindow.postMessage( PREFIX + JSON.stringify( message ), self.origin );
};

XDLS.prototype._onMessage = function( event ) {
    var self = this;
    
    if ( ( !event.origin || self.origin.indexOf( event.origin ) === -1 ) || ( !event.data || event.data.indexOf( PREFIX ) !== 0 ) ) {
        return;
    }
    
    var data = JSON.parse( event.data.substring( PREFIX.length ) );
    
    if ( self.callbacks[ data.id ] ) {
        if ( data.error ) {
            self.callbacks[ data.id ]( data );
        }
        else {
            self.callbacks[ data.id ]( null, data.result );
        }

        delete self.callbacks[ data.id ];
    }
};

},{"md5":1}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbWQ1L2luZGV4LmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBtZDUuanNcbiAqIENvcHlyaWdodCAoYykgMjAxMSwgWW9zaGlub3JpIEtvaHlhbWEgKGh0dHA6Ly9hbGdvYml0LmpwLylcbiAqIGFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKi9cblxuZXhwb3J0cy5kaWdlc3QgPSBmdW5jdGlvbiAoTSkge1xuICB2YXIgb3JpZ2luYWxMZW5ndGhcbiAgICAsIGlcbiAgICAsIGpcbiAgICAsIGtcbiAgICAsIGxcbiAgICAsIEFcbiAgICAsIEJcbiAgICAsIENcbiAgICAsIERcbiAgICAsIEFBXG4gICAgLCBCQlxuICAgICwgQ0NcbiAgICAsIEREXG4gICAgLCBYXG4gICAgLCBydmFsXG4gICAgO1xuXG5cdGZ1bmN0aW9uIEYoeCwgeSwgeikgeyByZXR1cm4gKHggJiB5KSB8ICh+eCAmIHopOyB9XG5cdGZ1bmN0aW9uIEcoeCwgeSwgeikgeyByZXR1cm4gKHggJiB6KSB8ICh5ICYgfnopOyB9XG5cdGZ1bmN0aW9uIEgoeCwgeSwgeikgeyByZXR1cm4geCBeIHkgXiB6OyAgICAgICAgICB9XG5cdGZ1bmN0aW9uIEkoeCwgeSwgeikgeyByZXR1cm4geSBeICh4IHwgfnopOyAgICAgICB9XG5cblx0ZnVuY3Rpb24gdG80Ynl0ZXMobikge1xuXHRcdHJldHVybiBbbiYweGZmLCAobj4+PjgpJjB4ZmYsIChuPj4+MTYpJjB4ZmYsIChuPj4+MjQpJjB4ZmZdO1xuXHR9XG5cblx0b3JpZ2luYWxMZW5ndGggPSBNLmxlbmd0aDsgLy8gZm9yIFN0ZXAuMlxuXG5cdC8vIDMuMSBTdGVwIDEuIEFwcGVuZCBQYWRkaW5nIEJpdHNcblx0TS5wdXNoKDB4ODApO1xuXHRsID0gKDU2IC0gTS5sZW5ndGgpJjB4M2Y7XG5cdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspXG5cdFx0TS5wdXNoKDApO1xuXG5cdC8vIDMuMiBTdGVwIDIuIEFwcGVuZCBMZW5ndGhcblx0dG80Ynl0ZXMoOCpvcmlnaW5hbExlbmd0aCkuZm9yRWFjaChmdW5jdGlvbiAoZSkgeyBNLnB1c2goZSk7IH0pO1xuXHRbMCwgMCwgMCwgMF0uZm9yRWFjaChmdW5jdGlvbiAoZSkgeyBNLnB1c2goZSk7IH0pO1xuXG5cdC8vIDMuMyBTdGVwIDMuIEluaXRpYWxpemUgTUQgQnVmZmVyXG5cdEEgPSBbMHg2NzQ1MjMwMV07XG5cdEIgPSBbMHhlZmNkYWI4OV07XG5cdEMgPSBbMHg5OGJhZGNmZV07XG5cdEQgPSBbMHgxMDMyNTQ3Nl07XG5cblx0Ly8gMy40IFN0ZXAgNC4gUHJvY2VzcyBNZXNzYWdlIGluIDE2LVdvcmQgQmxvY2tzXG5cdGZ1bmN0aW9uIHJvdW5kcyhhLCBiLCBjLCBkLCBrLCBzLCB0LCBmKSB7XG5cdFx0YVswXSArPSBmKGJbMF0sIGNbMF0sIGRbMF0pICsgWFtrXSArIHQ7XG5cdFx0YVswXSA9ICgoYVswXTw8cyl8KGFbMF0+Pj4oMzIgLSBzKSkpO1xuXHRcdGFbMF0gKz0gYlswXTtcblx0fVxuXG5cdGZvciAoaSA9IDA7IGkgPCBNLmxlbmd0aDsgaSArPSA2NCkge1xuXHRcdFggPSBbXTtcblx0XHRmb3IgKGogPSAwOyBqIDwgNjQ7IGogKz0gNCkge1xuXHRcdFx0ayA9IGkgKyBqO1xuXHRcdFx0WC5wdXNoKE1ba118KE1bayArIDFdPDw4KXwoTVtrICsgMl08PDE2KXwoTVtrICsgM108PDI0KSk7XG5cdFx0fVxuXHRcdEFBID0gQVswXTtcblx0XHRCQiA9IEJbMF07XG5cdFx0Q0MgPSBDWzBdO1xuXHRcdEREID0gRFswXTtcblxuXHRcdC8vIFJvdW5kIDEuXG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICAwLCAgNywgMHhkNzZhYTQ3OCwgRik7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICAxLCAxMiwgMHhlOGM3Yjc1NiwgRik7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICAyLCAxNywgMHgyNDIwNzBkYiwgRik7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICAzLCAyMiwgMHhjMWJkY2VlZSwgRik7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA0LCAgNywgMHhmNTdjMGZhZiwgRik7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICA1LCAxMiwgMHg0Nzg3YzYyYSwgRik7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICA2LCAxNywgMHhhODMwNDYxMywgRik7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICA3LCAyMiwgMHhmZDQ2OTUwMSwgRik7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA4LCAgNywgMHg2OTgwOThkOCwgRik7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICA5LCAxMiwgMHg4YjQ0ZjdhZiwgRik7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDEwLCAxNywgMHhmZmZmNWJiMSwgRik7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsIDExLCAyMiwgMHg4OTVjZDdiZSwgRik7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsIDEyLCAgNywgMHg2YjkwMTEyMiwgRik7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsIDEzLCAxMiwgMHhmZDk4NzE5MywgRik7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDE0LCAxNywgMHhhNjc5NDM4ZSwgRik7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsIDE1LCAyMiwgMHg0OWI0MDgyMSwgRik7XG5cblx0XHQvLyBSb3VuZCAyLlxuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgMSwgIDUsIDB4ZjYxZTI1NjIsIEcpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgNiwgIDksIDB4YzA0MGIzNDAsIEcpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAxMSwgMTQsIDB4MjY1ZTVhNTEsIEcpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgMCwgMjAsIDB4ZTliNmM3YWEsIEcpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgNSwgIDUsIDB4ZDYyZjEwNWQsIEcpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAxMCwgIDksIDB4MDI0NDE0NTMsIEcpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAxNSwgMTQsIDB4ZDhhMWU2ODEsIEcpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgNCwgMjAsIDB4ZTdkM2ZiYzgsIEcpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgOSwgIDUsIDB4MjFlMWNkZTYsIEcpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAxNCwgIDksIDB4YzMzNzA3ZDYsIEcpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAgMywgMTQsIDB4ZjRkNTBkODcsIEcpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgOCwgMjAsIDB4NDU1YTE0ZWQsIEcpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAxMywgIDUsIDB4YTllM2U5MDUsIEcpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgMiwgIDksIDB4ZmNlZmEzZjgsIEcpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAgNywgMTQsIDB4Njc2ZjAyZDksIEcpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAxMiwgMjAsIDB4OGQyYTRjOGEsIEcpO1xuXG5cdFx0Ly8gUm91bmQgMy5cblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDUsICA0LCAweGZmZmEzOTQyLCBIKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDgsIDExLCAweDg3NzFmNjgxLCBIKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgMTEsIDE2LCAweDZkOWQ2MTIyLCBIKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgMTQsIDIzLCAweGZkZTUzODBjLCBIKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDEsICA0LCAweGE0YmVlYTQ0LCBIKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDQsIDExLCAweDRiZGVjZmE5LCBIKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgIDcsIDE2LCAweGY2YmI0YjYwLCBIKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgMTAsIDIzLCAweGJlYmZiYzcwLCBIKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgMTMsICA0LCAweDI4OWI3ZWM2LCBIKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDAsIDExLCAweGVhYTEyN2ZhLCBIKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgIDMsIDE2LCAweGQ0ZWYzMDg1LCBIKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDYsIDIzLCAweDA0ODgxZDA1LCBIKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDksICA0LCAweGQ5ZDRkMDM5LCBIKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgMTIsIDExLCAweGU2ZGI5OWU1LCBIKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgMTUsIDE2LCAweDFmYTI3Y2Y4LCBIKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDIsIDIzLCAweGM0YWM1NjY1LCBIKTtcblxuXHRcdC8vIFJvdW5kIDQuXG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICAwLCAgNiwgMHhmNDI5MjI0NCwgSSk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICA3LCAxMCwgMHg0MzJhZmY5NywgSSk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDE0LCAxNSwgMHhhYjk0MjNhNywgSSk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICA1LCAyMSwgMHhmYzkzYTAzOSwgSSk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsIDEyLCAgNiwgMHg2NTViNTljMywgSSk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICAzLCAxMCwgMHg4ZjBjY2M5MiwgSSk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDEwLCAxNSwgMHhmZmVmZjQ3ZCwgSSk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICAxLCAyMSwgMHg4NTg0NWRkMSwgSSk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA4LCAgNiwgMHg2ZmE4N2U0ZiwgSSk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsIDE1LCAxMCwgMHhmZTJjZTZlMCwgSSk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICA2LCAxNSwgMHhhMzAxNDMxNCwgSSk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsIDEzLCAyMSwgMHg0ZTA4MTFhMSwgSSk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA0LCAgNiwgMHhmNzUzN2U4MiwgSSk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsIDExLCAxMCwgMHhiZDNhZjIzNSwgSSk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICAyLCAxNSwgMHgyYWQ3ZDJiYiwgSSk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICA5LCAyMSwgMHhlYjg2ZDM5MSwgSSk7XG5cblx0XHRBWzBdICs9IEFBO1xuXHRcdEJbMF0gKz0gQkI7XG5cdFx0Q1swXSArPSBDQztcblx0XHREWzBdICs9IEREO1xuXHR9XG5cblx0cnZhbCA9IFtdO1xuXHR0bzRieXRlcyhBWzBdKS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7IHJ2YWwucHVzaChlKTsgfSk7XG5cdHRvNGJ5dGVzKEJbMF0pLmZvckVhY2goZnVuY3Rpb24gKGUpIHsgcnZhbC5wdXNoKGUpOyB9KTtcblx0dG80Ynl0ZXMoQ1swXSkuZm9yRWFjaChmdW5jdGlvbiAoZSkgeyBydmFsLnB1c2goZSk7IH0pO1xuXHR0bzRieXRlcyhEWzBdKS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7IHJ2YWwucHVzaChlKTsgfSk7XG5cblx0cmV0dXJuIHJ2YWw7XG59XG5cbmV4cG9ydHMuZGlnZXN0X3MgPSBmdW5jdGlvbiAocykge1xuXHR2YXIgTSA9IFtdXG4gICAgLCBpXG4gICAgLCBkXG4gICAgLCByc3RyXG4gICAgLCBzXG4gICAgO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKVxuXHRcdE0ucHVzaChzLmNoYXJDb2RlQXQoaSkpO1xuXG5cdGQgPSBleHBvcnRzLmRpZ2VzdChNKTtcblx0cnN0ciA9ICcnO1xuXG5cdGQuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuXHRcdHMgPSBlLnRvU3RyaW5nKDE2KTtcblx0XHR3aGlsZSAocy5sZW5ndGggPCAyKVxuXHRcdFx0cyA9ICcwJyArIHM7XG5cdFx0cnN0ciArPSBzO1xuXHR9KTtcblxuXHRyZXR1cm4gcnN0cjtcbn1cblxufSgpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBYRExTO1xuXG52YXIgbWQ1ID0gcmVxdWlyZSggJ21kNScgKTtcblxudmFyIFBSRUZJWCA9ICd4ZGxzOic7XG5cbi8vIG11c3QgbWF0Y2ggbG9jYWxmb3JhZ2VcbnZhciBNRVRIT0RTID0gW1xuICAgICdjbGVhcicsXG4gICAgJ2dldEl0ZW0nLFxuICAgICdrZXknLFxuICAgICdrZXlzJyxcbiAgICAnbGVuZ3RoJyxcbiAgICAncmVtb3ZlSXRlbScsXG4gICAgJ3NldEl0ZW0nICBcbl07XG5cbmZ1bmN0aW9uIFhETFMoIG9wdGlvbnMgKSB7XG4gICAgdGhpcy5vcmlnaW4gPSBvcHRpb25zLm9yaWdpbjtcbiAgICB0aGlzLnBhdGggPSBvcHRpb25zLnBhdGg7XG4gICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLm1lc3NhZ2VJZCA9IDA7XG4gICAgdGhpcy5jYWxsYmFja3MgPSB7fTtcbiAgICBcbiAgICBpZiAoICEoIHRoaXMub3JpZ2luICYmIHRoaXMucGF0aCApICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoICdYRExTIG5lZWRzIGJvdGggYW4gb3JpZ2luIGFuZCBhIHBhdGggc3BlY2lmaWVkIGluIHRoZSBjb25zdHJ1Y3RvciBvcHRpb25zLicgKTtcbiAgICB9XG4gICAgXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgTUVUSE9EUy5sZW5ndGg7ICsraSApIHtcbiAgICAgICAgdGhpc1sgTUVUSE9EU1sgaSBdIF0gPSB0aGlzLl9oYW5kbGVNZXRob2QuYmluZCggdGhpcywgTUVUSE9EU1sgaSBdICk7XG4gICAgfVxuICAgIFxuICAgIGlmICggdHlwZW9mKCBvcHRpb25zLmluaXQgKSA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5pbml0ICkge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG59XG5cblhETFMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgaWYgKCBzZWxmLl9pZnJhbWUgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKCAhKCB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LkpTT04gKSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnWERMUyByZXF1aXJlcyBib3RoIHBvc3RNb3NzYWdlIGFuZCBKU09OIHN1cHBvcnQuJyApO1xuICAgIH1cblxuICAgIHZhciBvbkxvYWRlZCA9IHNlbGYuX29uTG9hZGVkLmJpbmQoIHNlbGYgKTtcbiAgICB2YXIgb25NZXNzYWdlID0gc2VsZi5fb25NZXNzYWdlLmJpbmQoIHNlbGYgKTtcblxuICAgIHZhciBpZnJhbWVJRCA9ICd4ZGxzLScgKyBtZDUuZGlnZXN0X3MoIHNlbGYub3JpZ2luICsgc2VsZi5wYXRoICk7XG4gICAgXG4gICAgdmFyIGV4aXN0aW5nSWZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGlmcmFtZUlEICk7XG4gICAgaWYgKCBleGlzdGluZ0lmcmFtZSApIHtcbiAgICAgICAgc2VsZi5faWZyYW1lID0gZXhpc3RpbmdJZnJhbWU7XG4gICAgICAgIGlmICggc2VsZi5faWZyYW1lLmRhdGFzZXQubG9hZGVkICkge1xuICAgICAgICAgICAgb25Mb2FkZWQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc2VsZi5faWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lmcmFtZScgKTtcbiAgICAgICAgc2VsZi5faWZyYW1lLmlkID0gaWZyYW1lSUQ7XG4gICAgICAgIHNlbGYuX2lmcmFtZS5kYXRhc2V0Lm9yaWdpbiA9IHNlbGYub3JpZ2luO1xuICAgICAgICBzZWxmLl9pZnJhbWUuZGF0YXNldC5wYXRoID0gc2VsZi5wYXRoO1xuICAgICAgICBzZWxmLl9pZnJhbWUuc3R5bGUuY3NzVGV4dCA9IFwid2lkdGg6MXB4OyBoZWlnaHQ6MXB4OyBkaXNwbGF5OiBub25lO1wiO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBzZWxmLl9pZnJhbWUgKTtcbiAgICB9XG5cbiAgICBpZiAoIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuICAgICAgICBzZWxmLl9pZnJhbWUuYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBvbkxvYWRlZCwgZmFsc2UgKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtZXNzYWdlJywgb25NZXNzYWdlLCBmYWxzZSApO1xuICAgIH1cbiAgICBlbHNlIGlmICggc2VsZi5faWZyYW1lLmF0dGFjaEV2ZW50ICkge1xuICAgICAgICBzZWxmLl9pZnJhbWUuYXR0YWNoRXZlbnQoICdvbmxvYWQnLCBvbkxvYWRlZCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cuYXR0YWNoRXZlbnQoICdvbm1lc3NhZ2UnLCBvbk1lc3NhZ2UgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ1hETFMgY291bGQgbm90IHByb3Blcmx5IGJpbmQgZm9yIGV2ZW50IGhhbmRsaW5nLicgKTtcbiAgICB9XG5cbiAgICBpZiAoICFleGlzdGluZ0lmcmFtZSApIHtcbiAgICAgICAgc2VsZi5faWZyYW1lLnNyYyA9IHNlbGYub3JpZ2luICsgc2VsZi5wYXRoO1xuICAgIH1cbn07XG5cblhETFMucHJvdG90eXBlLl9vbkxvYWRlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBcbiAgICBzZWxmLnJlYWR5ID0gdHJ1ZTtcbiAgICBzZWxmLl9pZnJhbWUuZGF0YXNldC5sb2FkZWQgPSB0cnVlO1xuICAgIFxuICAgIHZhciBtZXNzYWdlO1xuICAgIHdoaWxlICggKCBtZXNzYWdlID0gc2VsZi5xdWV1ZS5zaGlmdCgpICkgKSB7XG4gICAgICAgIHNlbGYuX3NlbmRNZXNzYWdlKCBtZXNzYWdlICk7XG4gICAgfVxufTtcblxuWERMUy5wcm90b3R5cGUuX2hhbmRsZU1ldGhvZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgX2FyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAwICk7IC8vIGNvbnZlcnQgYXJndW1lbnRzIHRvIGFuIGFycmF5XG4gICAgdmFyIG1ldGhvZCA9IF9hcmdzLnNoaWZ0KCk7XG4gICAgdmFyIGNhbGxiYWNrID0gbnVsbDtcbiAgICBcbiAgICBzZWxmLmluaXQoKTtcbiAgICBcbiAgICBpZiAoIF9hcmdzLmxlbmd0aCAmJiB0eXBlb2YoIF9hcmdzWyBfYXJncy5sZW5ndGggLSAxIF0gKSA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgY2FsbGJhY2sgPSBfYXJncy5wb3AoKTtcbiAgICB9XG5cbiAgICB2YXIgaWQgPSArK3NlbGYubWVzc2FnZUlkO1xuICAgIFxuICAgIGlmICggY2FsbGJhY2sgKSB7XG4gICAgICAgIHNlbGYuY2FsbGJhY2tzWyBpZCBdID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgIGFyZ3VtZW50czogX2FyZ3NcbiAgICB9O1xuICAgIFxuICAgIGlmICggc2VsZi5yZWFkeSApIHtcbiAgICAgICAgc2VsZi5fc2VuZE1lc3NhZ2UoIG1lc3NhZ2UgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHNlbGYucXVldWUucHVzaCggbWVzc2FnZSApO1xuICAgIH1cbn07XG5cblhETFMucHJvdG90eXBlLl9zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKCBtZXNzYWdlICkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLl9pZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSggUFJFRklYICsgSlNPTi5zdHJpbmdpZnkoIG1lc3NhZ2UgKSwgc2VsZi5vcmlnaW4gKTtcbn07XG5cblhETFMucHJvdG90eXBlLl9vbk1lc3NhZ2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgIGlmICggKCAhZXZlbnQub3JpZ2luIHx8IHNlbGYub3JpZ2luLmluZGV4T2YoIGV2ZW50Lm9yaWdpbiApID09PSAtMSApIHx8ICggIWV2ZW50LmRhdGEgfHwgZXZlbnQuZGF0YS5pbmRleE9mKCBQUkVGSVggKSAhPT0gMCApICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZSggZXZlbnQuZGF0YS5zdWJzdHJpbmcoIFBSRUZJWC5sZW5ndGggKSApO1xuICAgIFxuICAgIGlmICggc2VsZi5jYWxsYmFja3NbIGRhdGEuaWQgXSApIHtcbiAgICAgICAgaWYgKCBkYXRhLmVycm9yICkge1xuICAgICAgICAgICAgc2VsZi5jYWxsYmFja3NbIGRhdGEuaWQgXSggZGF0YSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5jYWxsYmFja3NbIGRhdGEuaWQgXSggbnVsbCwgZGF0YS5yZXN1bHQgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBzZWxmLmNhbGxiYWNrc1sgZGF0YS5pZCBdO1xuICAgIH1cbn07XG4iXX0=
