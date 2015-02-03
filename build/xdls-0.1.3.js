require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=dataset;

/*global document*/


// replace namesLikeThis with names-like-this
function toDashed(name) {
  return name.replace(/([A-Z])/g, function(u) {
    return "-" + u.toLowerCase();
  });
}

var fn;

if (document.head && document.head.dataset) {
  fn = {
    set: function(node, attr, value) {
      node.dataset[attr] = value;
    },
    get: function(node, attr) {
      return node.dataset[attr];
    },
    del: function (node, attr) {
      delete node.dataset[attr];
    }
  };
} else {
  fn = {
    set: function(node, attr, value) {
      node.setAttribute('data-' + toDashed(attr), value);
    },
    get: function(node, attr) {
      return node.getAttribute('data-' + toDashed(attr));
    },
    del: function (node, attr) {
      node.removeAttribute('data-' + toDashed(attr));
    }
  };
}

function dataset(node, attr, value) {
  var self = {
    set: set,
    get: get,
    del: del
  };

  function set(attr, value) {
    fn.set(node, attr, value);
    return self;
  }

  function del(attr) {
    fn.del(node, attr);
    return self;
  }

  function get(attr) {
    return fn.get(node, attr);
  }

  if (arguments.length === 3) {
    return set(attr, value);
  }
  if (arguments.length == 2) {
    return get(attr);
  }

  return self;
}

},{}],2:[function(require,module,exports){
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
var dataset = require( 'dataset' );

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
        if ( dataset( self._iframe, 'loaded' ) ) {
            onLoaded();
        }
    }
    else {
        self._iframe = document.createElement( 'iframe' );
        self._iframe.id = iframeID;
        self._iframe.setAttribute( 'sandbox', 'allow-scripts allow-same-origin' );
        dataset( self._iframe, 'origin', self.origin );
        dataset( self._iframe, 'path', self.path );
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
    dataset( self._iframe, 'loaded', true );
    
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

},{"dataset":1,"md5":2}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGF0YXNldC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tZDUvaW5kZXguanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPWRhdGFzZXQ7XG5cbi8qZ2xvYmFsIGRvY3VtZW50Ki9cblxuXG4vLyByZXBsYWNlIG5hbWVzTGlrZVRoaXMgd2l0aCBuYW1lcy1saWtlLXRoaXNcbmZ1bmN0aW9uIHRvRGFzaGVkKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWUucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbih1KSB7XG4gICAgcmV0dXJuIFwiLVwiICsgdS50b0xvd2VyQ2FzZSgpO1xuICB9KTtcbn1cblxudmFyIGZuO1xuXG5pZiAoZG9jdW1lbnQuaGVhZCAmJiBkb2N1bWVudC5oZWFkLmRhdGFzZXQpIHtcbiAgZm4gPSB7XG4gICAgc2V0OiBmdW5jdGlvbihub2RlLCBhdHRyLCB2YWx1ZSkge1xuICAgICAgbm9kZS5kYXRhc2V0W2F0dHJdID0gdmFsdWU7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKG5vZGUsIGF0dHIpIHtcbiAgICAgIHJldHVybiBub2RlLmRhdGFzZXRbYXR0cl07XG4gICAgfSxcbiAgICBkZWw6IGZ1bmN0aW9uIChub2RlLCBhdHRyKSB7XG4gICAgICBkZWxldGUgbm9kZS5kYXRhc2V0W2F0dHJdO1xuICAgIH1cbiAgfTtcbn0gZWxzZSB7XG4gIGZuID0ge1xuICAgIHNldDogZnVuY3Rpb24obm9kZSwgYXR0ciwgdmFsdWUpIHtcbiAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLScgKyB0b0Rhc2hlZChhdHRyKSwgdmFsdWUpO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihub2RlLCBhdHRyKSB7XG4gICAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIHRvRGFzaGVkKGF0dHIpKTtcbiAgICB9LFxuICAgIGRlbDogZnVuY3Rpb24gKG5vZGUsIGF0dHIpIHtcbiAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKCdkYXRhLScgKyB0b0Rhc2hlZChhdHRyKSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBkYXRhc2V0KG5vZGUsIGF0dHIsIHZhbHVlKSB7XG4gIHZhciBzZWxmID0ge1xuICAgIHNldDogc2V0LFxuICAgIGdldDogZ2V0LFxuICAgIGRlbDogZGVsXG4gIH07XG5cbiAgZnVuY3Rpb24gc2V0KGF0dHIsIHZhbHVlKSB7XG4gICAgZm4uc2V0KG5vZGUsIGF0dHIsIHZhbHVlKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlbChhdHRyKSB7XG4gICAgZm4uZGVsKG5vZGUsIGF0dHIpO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0KGF0dHIpIHtcbiAgICByZXR1cm4gZm4uZ2V0KG5vZGUsIGF0dHIpO1xuICB9XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICByZXR1cm4gc2V0KGF0dHIsIHZhbHVlKTtcbiAgfVxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XG4gICAgcmV0dXJuIGdldChhdHRyKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmO1xufVxuIiwiKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIG1kNS5qc1xuICogQ29weXJpZ2h0IChjKSAyMDExLCBZb3NoaW5vcmkgS29oeWFtYSAoaHR0cDovL2FsZ29iaXQuanAvKVxuICogYWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqL1xuXG5leHBvcnRzLmRpZ2VzdCA9IGZ1bmN0aW9uIChNKSB7XG4gIHZhciBvcmlnaW5hbExlbmd0aFxuICAgICwgaVxuICAgICwgalxuICAgICwga1xuICAgICwgbFxuICAgICwgQVxuICAgICwgQlxuICAgICwgQ1xuICAgICwgRFxuICAgICwgQUFcbiAgICAsIEJCXG4gICAgLCBDQ1xuICAgICwgRERcbiAgICAsIFhcbiAgICAsIHJ2YWxcbiAgICA7XG5cblx0ZnVuY3Rpb24gRih4LCB5LCB6KSB7IHJldHVybiAoeCAmIHkpIHwgKH54ICYgeik7IH1cblx0ZnVuY3Rpb24gRyh4LCB5LCB6KSB7IHJldHVybiAoeCAmIHopIHwgKHkgJiB+eik7IH1cblx0ZnVuY3Rpb24gSCh4LCB5LCB6KSB7IHJldHVybiB4IF4geSBeIHo7ICAgICAgICAgIH1cblx0ZnVuY3Rpb24gSSh4LCB5LCB6KSB7IHJldHVybiB5IF4gKHggfCB+eik7ICAgICAgIH1cblxuXHRmdW5jdGlvbiB0bzRieXRlcyhuKSB7XG5cdFx0cmV0dXJuIFtuJjB4ZmYsIChuPj4+OCkmMHhmZiwgKG4+Pj4xNikmMHhmZiwgKG4+Pj4yNCkmMHhmZl07XG5cdH1cblxuXHRvcmlnaW5hbExlbmd0aCA9IE0ubGVuZ3RoOyAvLyBmb3IgU3RlcC4yXG5cblx0Ly8gMy4xIFN0ZXAgMS4gQXBwZW5kIFBhZGRpbmcgQml0c1xuXHRNLnB1c2goMHg4MCk7XG5cdGwgPSAoNTYgLSBNLmxlbmd0aCkmMHgzZjtcblx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKylcblx0XHRNLnB1c2goMCk7XG5cblx0Ly8gMy4yIFN0ZXAgMi4gQXBwZW5kIExlbmd0aFxuXHR0bzRieXRlcyg4Km9yaWdpbmFsTGVuZ3RoKS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7IE0ucHVzaChlKTsgfSk7XG5cdFswLCAwLCAwLCAwXS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7IE0ucHVzaChlKTsgfSk7XG5cblx0Ly8gMy4zIFN0ZXAgMy4gSW5pdGlhbGl6ZSBNRCBCdWZmZXJcblx0QSA9IFsweDY3NDUyMzAxXTtcblx0QiA9IFsweGVmY2RhYjg5XTtcblx0QyA9IFsweDk4YmFkY2ZlXTtcblx0RCA9IFsweDEwMzI1NDc2XTtcblxuXHQvLyAzLjQgU3RlcCA0LiBQcm9jZXNzIE1lc3NhZ2UgaW4gMTYtV29yZCBCbG9ja3Ncblx0ZnVuY3Rpb24gcm91bmRzKGEsIGIsIGMsIGQsIGssIHMsIHQsIGYpIHtcblx0XHRhWzBdICs9IGYoYlswXSwgY1swXSwgZFswXSkgKyBYW2tdICsgdDtcblx0XHRhWzBdID0gKChhWzBdPDxzKXwoYVswXT4+PigzMiAtIHMpKSk7XG5cdFx0YVswXSArPSBiWzBdO1xuXHR9XG5cblx0Zm9yIChpID0gMDsgaSA8IE0ubGVuZ3RoOyBpICs9IDY0KSB7XG5cdFx0WCA9IFtdO1xuXHRcdGZvciAoaiA9IDA7IGogPCA2NDsgaiArPSA0KSB7XG5cdFx0XHRrID0gaSArIGo7XG5cdFx0XHRYLnB1c2goTVtrXXwoTVtrICsgMV08PDgpfChNW2sgKyAyXTw8MTYpfChNW2sgKyAzXTw8MjQpKTtcblx0XHR9XG5cdFx0QUEgPSBBWzBdO1xuXHRcdEJCID0gQlswXTtcblx0XHRDQyA9IENbMF07XG5cdFx0REQgPSBEWzBdO1xuXG5cdFx0Ly8gUm91bmQgMS5cblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDAsICA3LCAweGQ3NmFhNDc4LCBGKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDEsIDEyLCAweGU4YzdiNzU2LCBGKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgIDIsIDE3LCAweDI0MjA3MGRiLCBGKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDMsIDIyLCAweGMxYmRjZWVlLCBGKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDQsICA3LCAweGY1N2MwZmFmLCBGKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDUsIDEyLCAweDQ3ODdjNjJhLCBGKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgIDYsIDE3LCAweGE4MzA0NjEzLCBGKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDcsIDIyLCAweGZkNDY5NTAxLCBGKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDgsICA3LCAweDY5ODA5OGQ4LCBGKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDksIDEyLCAweDhiNDRmN2FmLCBGKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgMTAsIDE3LCAweGZmZmY1YmIxLCBGKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgMTEsIDIyLCAweDg5NWNkN2JlLCBGKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgMTIsICA3LCAweDZiOTAxMTIyLCBGKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgMTMsIDEyLCAweGZkOTg3MTkzLCBGKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgMTQsIDE3LCAweGE2Nzk0MzhlLCBGKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgMTUsIDIyLCAweDQ5YjQwODIxLCBGKTtcblxuXHRcdC8vIFJvdW5kIDIuXG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICAxLCAgNSwgMHhmNjFlMjU2MiwgRyk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICA2LCAgOSwgMHhjMDQwYjM0MCwgRyk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDExLCAxNCwgMHgyNjVlNWE1MSwgRyk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICAwLCAyMCwgMHhlOWI2YzdhYSwgRyk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA1LCAgNSwgMHhkNjJmMTA1ZCwgRyk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsIDEwLCAgOSwgMHgwMjQ0MTQ1MywgRyk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDE1LCAxNCwgMHhkOGExZTY4MSwgRyk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICA0LCAyMCwgMHhlN2QzZmJjOCwgRyk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA5LCAgNSwgMHgyMWUxY2RlNiwgRyk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsIDE0LCAgOSwgMHhjMzM3MDdkNiwgRyk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICAzLCAxNCwgMHhmNGQ1MGQ4NywgRyk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICA4LCAyMCwgMHg0NTVhMTRlZCwgRyk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsIDEzLCAgNSwgMHhhOWUzZTkwNSwgRyk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICAyLCAgOSwgMHhmY2VmYTNmOCwgRyk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICA3LCAxNCwgMHg2NzZmMDJkOSwgRyk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsIDEyLCAyMCwgMHg4ZDJhNGM4YSwgRyk7XG5cblx0XHQvLyBSb3VuZCAzLlxuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgNSwgIDQsIDB4ZmZmYTM5NDIsIEgpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgOCwgMTEsIDB4ODc3MWY2ODEsIEgpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAxMSwgMTYsIDB4NmQ5ZDYxMjIsIEgpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAxNCwgMjMsIDB4ZmRlNTM4MGMsIEgpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgMSwgIDQsIDB4YTRiZWVhNDQsIEgpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgNCwgMTEsIDB4NGJkZWNmYTksIEgpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAgNywgMTYsIDB4ZjZiYjRiNjAsIEgpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAxMCwgMjMsIDB4YmViZmJjNzAsIEgpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAxMywgIDQsIDB4Mjg5YjdlYzYsIEgpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgMCwgMTEsIDB4ZWFhMTI3ZmEsIEgpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAgMywgMTYsIDB4ZDRlZjMwODUsIEgpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgNiwgMjMsIDB4MDQ4ODFkMDUsIEgpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgOSwgIDQsIDB4ZDlkNGQwMzksIEgpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAxMiwgMTEsIDB4ZTZkYjk5ZTUsIEgpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAxNSwgMTYsIDB4MWZhMjdjZjgsIEgpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgMiwgMjMsIDB4YzRhYzU2NjUsIEgpO1xuXG5cdFx0Ly8gUm91bmQgNC5cblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDAsICA2LCAweGY0MjkyMjQ0LCBJKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDcsIDEwLCAweDQzMmFmZjk3LCBJKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgMTQsIDE1LCAweGFiOTQyM2E3LCBJKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDUsIDIxLCAweGZjOTNhMDM5LCBJKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgMTIsICA2LCAweDY1NWI1OWMzLCBJKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDMsIDEwLCAweDhmMGNjYzkyLCBJKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgMTAsIDE1LCAweGZmZWZmNDdkLCBJKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDEsIDIxLCAweDg1ODQ1ZGQxLCBJKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDgsICA2LCAweDZmYTg3ZTRmLCBJKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgMTUsIDEwLCAweGZlMmNlNmUwLCBJKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgIDYsIDE1LCAweGEzMDE0MzE0LCBJKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgMTMsIDIxLCAweDRlMDgxMWExLCBJKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDQsICA2LCAweGY3NTM3ZTgyLCBJKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgMTEsIDEwLCAweGJkM2FmMjM1LCBJKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgIDIsIDE1LCAweDJhZDdkMmJiLCBJKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDksIDIxLCAweGViODZkMzkxLCBJKTtcblxuXHRcdEFbMF0gKz0gQUE7XG5cdFx0QlswXSArPSBCQjtcblx0XHRDWzBdICs9IENDO1xuXHRcdERbMF0gKz0gREQ7XG5cdH1cblxuXHRydmFsID0gW107XG5cdHRvNGJ5dGVzKEFbMF0pLmZvckVhY2goZnVuY3Rpb24gKGUpIHsgcnZhbC5wdXNoKGUpOyB9KTtcblx0dG80Ynl0ZXMoQlswXSkuZm9yRWFjaChmdW5jdGlvbiAoZSkgeyBydmFsLnB1c2goZSk7IH0pO1xuXHR0bzRieXRlcyhDWzBdKS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7IHJ2YWwucHVzaChlKTsgfSk7XG5cdHRvNGJ5dGVzKERbMF0pLmZvckVhY2goZnVuY3Rpb24gKGUpIHsgcnZhbC5wdXNoKGUpOyB9KTtcblxuXHRyZXR1cm4gcnZhbDtcbn1cblxuZXhwb3J0cy5kaWdlc3RfcyA9IGZ1bmN0aW9uIChzKSB7XG5cdHZhciBNID0gW11cbiAgICAsIGlcbiAgICAsIGRcbiAgICAsIHJzdHJcbiAgICAsIHNcbiAgICA7XG5cblx0Zm9yIChpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspXG5cdFx0TS5wdXNoKHMuY2hhckNvZGVBdChpKSk7XG5cblx0ZCA9IGV4cG9ydHMuZGlnZXN0KE0pO1xuXHRyc3RyID0gJyc7XG5cblx0ZC5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG5cdFx0cyA9IGUudG9TdHJpbmcoMTYpO1xuXHRcdHdoaWxlIChzLmxlbmd0aCA8IDIpXG5cdFx0XHRzID0gJzAnICsgcztcblx0XHRyc3RyICs9IHM7XG5cdH0pO1xuXG5cdHJldHVybiByc3RyO1xufVxuXG59KCkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFhETFM7XG5cbnZhciBtZDUgPSByZXF1aXJlKCAnbWQ1JyApO1xudmFyIGRhdGFzZXQgPSByZXF1aXJlKCAnZGF0YXNldCcgKTtcblxudmFyIFBSRUZJWCA9ICd4ZGxzOic7XG5cbi8vIG11c3QgbWF0Y2ggbG9jYWxmb3JhZ2VcbnZhciBNRVRIT0RTID0gW1xuICAgICdjbGVhcicsXG4gICAgJ2dldEl0ZW0nLFxuICAgICdrZXknLFxuICAgICdrZXlzJyxcbiAgICAnbGVuZ3RoJyxcbiAgICAncmVtb3ZlSXRlbScsXG4gICAgJ3NldEl0ZW0nICBcbl07XG5cbmZ1bmN0aW9uIFhETFMoIG9wdGlvbnMgKSB7XG4gICAgdGhpcy5vcmlnaW4gPSBvcHRpb25zLm9yaWdpbjtcbiAgICB0aGlzLnBhdGggPSBvcHRpb25zLnBhdGg7XG4gICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLm1lc3NhZ2VJZCA9IDA7XG4gICAgdGhpcy5jYWxsYmFja3MgPSB7fTtcbiAgICBcbiAgICBpZiAoICEoIHRoaXMub3JpZ2luICYmIHRoaXMucGF0aCApICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoICdYRExTIG5lZWRzIGJvdGggYW4gb3JpZ2luIGFuZCBhIHBhdGggc3BlY2lmaWVkIGluIHRoZSBjb25zdHJ1Y3RvciBvcHRpb25zLicgKTtcbiAgICB9XG4gICAgXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgTUVUSE9EUy5sZW5ndGg7ICsraSApIHtcbiAgICAgICAgdGhpc1sgTUVUSE9EU1sgaSBdIF0gPSB0aGlzLl9oYW5kbGVNZXRob2QuYmluZCggdGhpcywgTUVUSE9EU1sgaSBdICk7XG4gICAgfVxuICAgIFxuICAgIGlmICggdHlwZW9mKCBvcHRpb25zLmluaXQgKSA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5pbml0ICkge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG59XG5cblhETFMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgaWYgKCBzZWxmLl9pZnJhbWUgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKCAhKCB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LkpTT04gKSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnWERMUyByZXF1aXJlcyBib3RoIHBvc3RNb3NzYWdlIGFuZCBKU09OIHN1cHBvcnQuJyApO1xuICAgIH1cblxuICAgIHZhciBvbkxvYWRlZCA9IHNlbGYuX29uTG9hZGVkLmJpbmQoIHNlbGYgKTtcbiAgICB2YXIgb25NZXNzYWdlID0gc2VsZi5fb25NZXNzYWdlLmJpbmQoIHNlbGYgKTtcblxuICAgIHZhciBpZnJhbWVJRCA9ICd4ZGxzLScgKyBtZDUuZGlnZXN0X3MoIHNlbGYub3JpZ2luICsgc2VsZi5wYXRoICk7XG4gICAgXG4gICAgdmFyIGV4aXN0aW5nSWZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGlmcmFtZUlEICk7XG4gICAgaWYgKCBleGlzdGluZ0lmcmFtZSApIHtcbiAgICAgICAgc2VsZi5faWZyYW1lID0gZXhpc3RpbmdJZnJhbWU7XG4gICAgICAgIGlmICggZGF0YXNldCggc2VsZi5faWZyYW1lLCAnbG9hZGVkJyApICkge1xuICAgICAgICAgICAgb25Mb2FkZWQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc2VsZi5faWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lmcmFtZScgKTtcbiAgICAgICAgc2VsZi5faWZyYW1lLmlkID0gaWZyYW1lSUQ7XG4gICAgICAgIHNlbGYuX2lmcmFtZS5zZXRBdHRyaWJ1dGUoICdzYW5kYm94JywgJ2FsbG93LXNjcmlwdHMgYWxsb3ctc2FtZS1vcmlnaW4nICk7XG4gICAgICAgIGRhdGFzZXQoIHNlbGYuX2lmcmFtZSwgJ29yaWdpbicsIHNlbGYub3JpZ2luICk7XG4gICAgICAgIGRhdGFzZXQoIHNlbGYuX2lmcmFtZSwgJ3BhdGgnLCBzZWxmLnBhdGggKTtcbiAgICAgICAgc2VsZi5faWZyYW1lLnN0eWxlLmNzc1RleHQgPSBcIndpZHRoOjFweDsgaGVpZ2h0OjFweDsgZGlzcGxheTogbm9uZTtcIjtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggc2VsZi5faWZyYW1lICk7XG4gICAgfVxuXG4gICAgaWYgKCB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcbiAgICAgICAgc2VsZi5faWZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgb25Mb2FkZWQsIGZhbHNlICk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbWVzc2FnZScsIG9uTWVzc2FnZSwgZmFsc2UgKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIHNlbGYuX2lmcmFtZS5hdHRhY2hFdmVudCApIHtcbiAgICAgICAgc2VsZi5faWZyYW1lLmF0dGFjaEV2ZW50KCAnb25sb2FkJywgb25Mb2FkZWQsIGZhbHNlKTtcbiAgICAgICAgd2luZG93LmF0dGFjaEV2ZW50KCAnb25tZXNzYWdlJywgb25NZXNzYWdlICk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoICdYRExTIGNvdWxkIG5vdCBwcm9wZXJseSBiaW5kIGZvciBldmVudCBoYW5kbGluZy4nICk7XG4gICAgfVxuXG4gICAgaWYgKCAhZXhpc3RpbmdJZnJhbWUgKSB7XG4gICAgICAgIHNlbGYuX2lmcmFtZS5zcmMgPSBzZWxmLm9yaWdpbiArIHNlbGYucGF0aDtcbiAgICB9XG59O1xuXG5YRExTLnByb3RvdHlwZS5fb25Mb2FkZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgc2VsZi5yZWFkeSA9IHRydWU7XG4gICAgZGF0YXNldCggc2VsZi5faWZyYW1lLCAnbG9hZGVkJywgdHJ1ZSApO1xuICAgIFxuICAgIHZhciBtZXNzYWdlO1xuICAgIHdoaWxlICggKCBtZXNzYWdlID0gc2VsZi5xdWV1ZS5zaGlmdCgpICkgKSB7XG4gICAgICAgIHNlbGYuX3NlbmRNZXNzYWdlKCBtZXNzYWdlICk7XG4gICAgfVxufTtcblxuWERMUy5wcm90b3R5cGUuX2hhbmRsZU1ldGhvZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgX2FyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAwICk7IC8vIGNvbnZlcnQgYXJndW1lbnRzIHRvIGFuIGFycmF5XG4gICAgdmFyIG1ldGhvZCA9IF9hcmdzLnNoaWZ0KCk7XG4gICAgdmFyIGNhbGxiYWNrID0gbnVsbDtcbiAgICBcbiAgICBzZWxmLmluaXQoKTtcbiAgICBcbiAgICBpZiAoIF9hcmdzLmxlbmd0aCAmJiB0eXBlb2YoIF9hcmdzWyBfYXJncy5sZW5ndGggLSAxIF0gKSA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgY2FsbGJhY2sgPSBfYXJncy5wb3AoKTtcbiAgICB9XG5cbiAgICB2YXIgaWQgPSArK3NlbGYubWVzc2FnZUlkO1xuICAgIFxuICAgIGlmICggY2FsbGJhY2sgKSB7XG4gICAgICAgIHNlbGYuY2FsbGJhY2tzWyBpZCBdID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgIGFyZ3VtZW50czogX2FyZ3NcbiAgICB9O1xuICAgIFxuICAgIGlmICggc2VsZi5yZWFkeSApIHtcbiAgICAgICAgc2VsZi5fc2VuZE1lc3NhZ2UoIG1lc3NhZ2UgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHNlbGYucXVldWUucHVzaCggbWVzc2FnZSApO1xuICAgIH1cbn07XG5cblhETFMucHJvdG90eXBlLl9zZW5kTWVzc2FnZSA9IGZ1bmN0aW9uKCBtZXNzYWdlICkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLl9pZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSggUFJFRklYICsgSlNPTi5zdHJpbmdpZnkoIG1lc3NhZ2UgKSwgc2VsZi5vcmlnaW4gKTtcbn07XG5cblhETFMucHJvdG90eXBlLl9vbk1lc3NhZ2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgIGlmICggKCAhZXZlbnQub3JpZ2luIHx8IHNlbGYub3JpZ2luLmluZGV4T2YoIGV2ZW50Lm9yaWdpbiApID09PSAtMSApIHx8ICggIWV2ZW50LmRhdGEgfHwgZXZlbnQuZGF0YS5pbmRleE9mKCBQUkVGSVggKSAhPT0gMCApICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZSggZXZlbnQuZGF0YS5zdWJzdHJpbmcoIFBSRUZJWC5sZW5ndGggKSApO1xuICAgIFxuICAgIGlmICggc2VsZi5jYWxsYmFja3NbIGRhdGEuaWQgXSApIHtcbiAgICAgICAgaWYgKCBkYXRhLmVycm9yICkge1xuICAgICAgICAgICAgc2VsZi5jYWxsYmFja3NbIGRhdGEuaWQgXSggZGF0YSApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5jYWxsYmFja3NbIGRhdGEuaWQgXSggbnVsbCwgZGF0YS5yZXN1bHQgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBzZWxmLmNhbGxiYWNrc1sgZGF0YS5pZCBdO1xuICAgIH1cbn07XG4iXX0=
