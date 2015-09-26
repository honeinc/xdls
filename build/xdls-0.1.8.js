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

if (typeof document !== "undefined" && document.head && document.head.dataset) {
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

var _instanceId = 0;

function XDLS( options ) {
    this.origin = options.origin;
    this.host = options.host;
    this.path = options.path;
    this.ready = false;
    this.queue = [];
    this.messageId = 0;
    this.callbacks = {};
    this.instanceId = _instanceId++;
    
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

    var iframeID = 'xdls-' + md5.digest_s( self.host + self.path );
    
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
        self._iframe.style.cssText = 'width:1px; height:1px; display: none;';
        (function _addIframe() {
            if ( document.body ) {
                document.body.appendChild( self._iframe );
                return;
            }
            
            setTimeout( _addIframe, 100 );
        })();
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

    ++self.messageId;
    var id = self.instanceId + '.' + self.messageId;
    
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGF0YXNldC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tZDUvaW5kZXguanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPWRhdGFzZXQ7XG5cbi8qZ2xvYmFsIGRvY3VtZW50Ki9cblxuXG4vLyByZXBsYWNlIG5hbWVzTGlrZVRoaXMgd2l0aCBuYW1lcy1saWtlLXRoaXNcbmZ1bmN0aW9uIHRvRGFzaGVkKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWUucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbih1KSB7XG4gICAgcmV0dXJuIFwiLVwiICsgdS50b0xvd2VyQ2FzZSgpO1xuICB9KTtcbn1cblxudmFyIGZuO1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50LmhlYWQgJiYgZG9jdW1lbnQuaGVhZC5kYXRhc2V0KSB7XG4gIGZuID0ge1xuICAgIHNldDogZnVuY3Rpb24obm9kZSwgYXR0ciwgdmFsdWUpIHtcbiAgICAgIG5vZGUuZGF0YXNldFthdHRyXSA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihub2RlLCBhdHRyKSB7XG4gICAgICByZXR1cm4gbm9kZS5kYXRhc2V0W2F0dHJdO1xuICAgIH0sXG4gICAgZGVsOiBmdW5jdGlvbiAobm9kZSwgYXR0cikge1xuICAgICAgZGVsZXRlIG5vZGUuZGF0YXNldFthdHRyXTtcbiAgICB9XG4gIH07XG59IGVsc2Uge1xuICBmbiA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uKG5vZGUsIGF0dHIsIHZhbHVlKSB7XG4gICAgICBub2RlLnNldEF0dHJpYnV0ZSgnZGF0YS0nICsgdG9EYXNoZWQoYXR0ciksIHZhbHVlKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24obm9kZSwgYXR0cikge1xuICAgICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLScgKyB0b0Rhc2hlZChhdHRyKSk7XG4gICAgfSxcbiAgICBkZWw6IGZ1bmN0aW9uIChub2RlLCBhdHRyKSB7XG4gICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS0nICsgdG9EYXNoZWQoYXR0cikpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZGF0YXNldChub2RlLCBhdHRyLCB2YWx1ZSkge1xuICB2YXIgc2VsZiA9IHtcbiAgICBzZXQ6IHNldCxcbiAgICBnZXQ6IGdldCxcbiAgICBkZWw6IGRlbFxuICB9O1xuXG4gIGZ1bmN0aW9uIHNldChhdHRyLCB2YWx1ZSkge1xuICAgIGZuLnNldChub2RlLCBhdHRyLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICBmdW5jdGlvbiBkZWwoYXR0cikge1xuICAgIGZuLmRlbChub2RlLCBhdHRyKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldChhdHRyKSB7XG4gICAgcmV0dXJuIGZuLmdldChub2RlLCBhdHRyKTtcbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgcmV0dXJuIHNldChhdHRyLCB2YWx1ZSk7XG4gIH1cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xuICAgIHJldHVybiBnZXQoYXR0cik7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn1cbiIsIihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBtZDUuanNcbiAqIENvcHlyaWdodCAoYykgMjAxMSwgWW9zaGlub3JpIEtvaHlhbWEgKGh0dHA6Ly9hbGdvYml0LmpwLylcbiAqIGFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKi9cblxuZXhwb3J0cy5kaWdlc3QgPSBmdW5jdGlvbiAoTSkge1xuICB2YXIgb3JpZ2luYWxMZW5ndGhcbiAgICAsIGlcbiAgICAsIGpcbiAgICAsIGtcbiAgICAsIGxcbiAgICAsIEFcbiAgICAsIEJcbiAgICAsIENcbiAgICAsIERcbiAgICAsIEFBXG4gICAgLCBCQlxuICAgICwgQ0NcbiAgICAsIEREXG4gICAgLCBYXG4gICAgLCBydmFsXG4gICAgO1xuXG5cdGZ1bmN0aW9uIEYoeCwgeSwgeikgeyByZXR1cm4gKHggJiB5KSB8ICh+eCAmIHopOyB9XG5cdGZ1bmN0aW9uIEcoeCwgeSwgeikgeyByZXR1cm4gKHggJiB6KSB8ICh5ICYgfnopOyB9XG5cdGZ1bmN0aW9uIEgoeCwgeSwgeikgeyByZXR1cm4geCBeIHkgXiB6OyAgICAgICAgICB9XG5cdGZ1bmN0aW9uIEkoeCwgeSwgeikgeyByZXR1cm4geSBeICh4IHwgfnopOyAgICAgICB9XG5cblx0ZnVuY3Rpb24gdG80Ynl0ZXMobikge1xuXHRcdHJldHVybiBbbiYweGZmLCAobj4+PjgpJjB4ZmYsIChuPj4+MTYpJjB4ZmYsIChuPj4+MjQpJjB4ZmZdO1xuXHR9XG5cblx0b3JpZ2luYWxMZW5ndGggPSBNLmxlbmd0aDsgLy8gZm9yIFN0ZXAuMlxuXG5cdC8vIDMuMSBTdGVwIDEuIEFwcGVuZCBQYWRkaW5nIEJpdHNcblx0TS5wdXNoKDB4ODApO1xuXHRsID0gKDU2IC0gTS5sZW5ndGgpJjB4M2Y7XG5cdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspXG5cdFx0TS5wdXNoKDApO1xuXG5cdC8vIDMuMiBTdGVwIDIuIEFwcGVuZCBMZW5ndGhcblx0dG80Ynl0ZXMoOCpvcmlnaW5hbExlbmd0aCkuZm9yRWFjaChmdW5jdGlvbiAoZSkgeyBNLnB1c2goZSk7IH0pO1xuXHRbMCwgMCwgMCwgMF0uZm9yRWFjaChmdW5jdGlvbiAoZSkgeyBNLnB1c2goZSk7IH0pO1xuXG5cdC8vIDMuMyBTdGVwIDMuIEluaXRpYWxpemUgTUQgQnVmZmVyXG5cdEEgPSBbMHg2NzQ1MjMwMV07XG5cdEIgPSBbMHhlZmNkYWI4OV07XG5cdEMgPSBbMHg5OGJhZGNmZV07XG5cdEQgPSBbMHgxMDMyNTQ3Nl07XG5cblx0Ly8gMy40IFN0ZXAgNC4gUHJvY2VzcyBNZXNzYWdlIGluIDE2LVdvcmQgQmxvY2tzXG5cdGZ1bmN0aW9uIHJvdW5kcyhhLCBiLCBjLCBkLCBrLCBzLCB0LCBmKSB7XG5cdFx0YVswXSArPSBmKGJbMF0sIGNbMF0sIGRbMF0pICsgWFtrXSArIHQ7XG5cdFx0YVswXSA9ICgoYVswXTw8cyl8KGFbMF0+Pj4oMzIgLSBzKSkpO1xuXHRcdGFbMF0gKz0gYlswXTtcblx0fVxuXG5cdGZvciAoaSA9IDA7IGkgPCBNLmxlbmd0aDsgaSArPSA2NCkge1xuXHRcdFggPSBbXTtcblx0XHRmb3IgKGogPSAwOyBqIDwgNjQ7IGogKz0gNCkge1xuXHRcdFx0ayA9IGkgKyBqO1xuXHRcdFx0WC5wdXNoKE1ba118KE1bayArIDFdPDw4KXwoTVtrICsgMl08PDE2KXwoTVtrICsgM108PDI0KSk7XG5cdFx0fVxuXHRcdEFBID0gQVswXTtcblx0XHRCQiA9IEJbMF07XG5cdFx0Q0MgPSBDWzBdO1xuXHRcdEREID0gRFswXTtcblxuXHRcdC8vIFJvdW5kIDEuXG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICAwLCAgNywgMHhkNzZhYTQ3OCwgRik7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICAxLCAxMiwgMHhlOGM3Yjc1NiwgRik7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICAyLCAxNywgMHgyNDIwNzBkYiwgRik7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICAzLCAyMiwgMHhjMWJkY2VlZSwgRik7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA0LCAgNywgMHhmNTdjMGZhZiwgRik7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICA1LCAxMiwgMHg0Nzg3YzYyYSwgRik7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICA2LCAxNywgMHhhODMwNDYxMywgRik7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICA3LCAyMiwgMHhmZDQ2OTUwMSwgRik7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA4LCAgNywgMHg2OTgwOThkOCwgRik7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICA5LCAxMiwgMHg4YjQ0ZjdhZiwgRik7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDEwLCAxNywgMHhmZmZmNWJiMSwgRik7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsIDExLCAyMiwgMHg4OTVjZDdiZSwgRik7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsIDEyLCAgNywgMHg2YjkwMTEyMiwgRik7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsIDEzLCAxMiwgMHhmZDk4NzE5MywgRik7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDE0LCAxNywgMHhhNjc5NDM4ZSwgRik7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsIDE1LCAyMiwgMHg0OWI0MDgyMSwgRik7XG5cblx0XHQvLyBSb3VuZCAyLlxuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgMSwgIDUsIDB4ZjYxZTI1NjIsIEcpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgNiwgIDksIDB4YzA0MGIzNDAsIEcpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAxMSwgMTQsIDB4MjY1ZTVhNTEsIEcpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgMCwgMjAsIDB4ZTliNmM3YWEsIEcpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgNSwgIDUsIDB4ZDYyZjEwNWQsIEcpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAxMCwgIDksIDB4MDI0NDE0NTMsIEcpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAxNSwgMTQsIDB4ZDhhMWU2ODEsIEcpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgNCwgMjAsIDB4ZTdkM2ZiYzgsIEcpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgOSwgIDUsIDB4MjFlMWNkZTYsIEcpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAxNCwgIDksIDB4YzMzNzA3ZDYsIEcpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAgMywgMTQsIDB4ZjRkNTBkODcsIEcpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgOCwgMjAsIDB4NDU1YTE0ZWQsIEcpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAxMywgIDUsIDB4YTllM2U5MDUsIEcpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgMiwgIDksIDB4ZmNlZmEzZjgsIEcpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAgNywgMTQsIDB4Njc2ZjAyZDksIEcpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAxMiwgMjAsIDB4OGQyYTRjOGEsIEcpO1xuXG5cdFx0Ly8gUm91bmQgMy5cblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDUsICA0LCAweGZmZmEzOTQyLCBIKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDgsIDExLCAweDg3NzFmNjgxLCBIKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgMTEsIDE2LCAweDZkOWQ2MTIyLCBIKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgMTQsIDIzLCAweGZkZTUzODBjLCBIKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDEsICA0LCAweGE0YmVlYTQ0LCBIKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDQsIDExLCAweDRiZGVjZmE5LCBIKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgIDcsIDE2LCAweGY2YmI0YjYwLCBIKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgMTAsIDIzLCAweGJlYmZiYzcwLCBIKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgMTMsICA0LCAweDI4OWI3ZWM2LCBIKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDAsIDExLCAweGVhYTEyN2ZhLCBIKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgIDMsIDE2LCAweGQ0ZWYzMDg1LCBIKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDYsIDIzLCAweDA0ODgxZDA1LCBIKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDksICA0LCAweGQ5ZDRkMDM5LCBIKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgMTIsIDExLCAweGU2ZGI5OWU1LCBIKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgMTUsIDE2LCAweDFmYTI3Y2Y4LCBIKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDIsIDIzLCAweGM0YWM1NjY1LCBIKTtcblxuXHRcdC8vIFJvdW5kIDQuXG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICAwLCAgNiwgMHhmNDI5MjI0NCwgSSk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICA3LCAxMCwgMHg0MzJhZmY5NywgSSk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDE0LCAxNSwgMHhhYjk0MjNhNywgSSk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICA1LCAyMSwgMHhmYzkzYTAzOSwgSSk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsIDEyLCAgNiwgMHg2NTViNTljMywgSSk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICAzLCAxMCwgMHg4ZjBjY2M5MiwgSSk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDEwLCAxNSwgMHhmZmVmZjQ3ZCwgSSk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICAxLCAyMSwgMHg4NTg0NWRkMSwgSSk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA4LCAgNiwgMHg2ZmE4N2U0ZiwgSSk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsIDE1LCAxMCwgMHhmZTJjZTZlMCwgSSk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICA2LCAxNSwgMHhhMzAxNDMxNCwgSSk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsIDEzLCAyMSwgMHg0ZTA4MTFhMSwgSSk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA0LCAgNiwgMHhmNzUzN2U4MiwgSSk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsIDExLCAxMCwgMHhiZDNhZjIzNSwgSSk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICAyLCAxNSwgMHgyYWQ3ZDJiYiwgSSk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICA5LCAyMSwgMHhlYjg2ZDM5MSwgSSk7XG5cblx0XHRBWzBdICs9IEFBO1xuXHRcdEJbMF0gKz0gQkI7XG5cdFx0Q1swXSArPSBDQztcblx0XHREWzBdICs9IEREO1xuXHR9XG5cblx0cnZhbCA9IFtdO1xuXHR0bzRieXRlcyhBWzBdKS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7IHJ2YWwucHVzaChlKTsgfSk7XG5cdHRvNGJ5dGVzKEJbMF0pLmZvckVhY2goZnVuY3Rpb24gKGUpIHsgcnZhbC5wdXNoKGUpOyB9KTtcblx0dG80Ynl0ZXMoQ1swXSkuZm9yRWFjaChmdW5jdGlvbiAoZSkgeyBydmFsLnB1c2goZSk7IH0pO1xuXHR0bzRieXRlcyhEWzBdKS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7IHJ2YWwucHVzaChlKTsgfSk7XG5cblx0cmV0dXJuIHJ2YWw7XG59XG5cbmV4cG9ydHMuZGlnZXN0X3MgPSBmdW5jdGlvbiAocykge1xuXHR2YXIgTSA9IFtdXG4gICAgLCBpXG4gICAgLCBkXG4gICAgLCByc3RyXG4gICAgLCBzXG4gICAgO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKVxuXHRcdE0ucHVzaChzLmNoYXJDb2RlQXQoaSkpO1xuXG5cdGQgPSBleHBvcnRzLmRpZ2VzdChNKTtcblx0cnN0ciA9ICcnO1xuXG5cdGQuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuXHRcdHMgPSBlLnRvU3RyaW5nKDE2KTtcblx0XHR3aGlsZSAocy5sZW5ndGggPCAyKVxuXHRcdFx0cyA9ICcwJyArIHM7XG5cdFx0cnN0ciArPSBzO1xuXHR9KTtcblxuXHRyZXR1cm4gcnN0cjtcbn1cblxufSgpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBYRExTO1xuXG52YXIgbWQ1ID0gcmVxdWlyZSggJ21kNScgKTtcbnZhciBkYXRhc2V0ID0gcmVxdWlyZSggJ2RhdGFzZXQnICk7XG5cbnZhciBQUkVGSVggPSAneGRsczonO1xuXG4vLyBtdXN0IG1hdGNoIGxvY2FsZm9yYWdlXG52YXIgTUVUSE9EUyA9IFtcbiAgICAnY2xlYXInLFxuICAgICdnZXRJdGVtJyxcbiAgICAna2V5JyxcbiAgICAna2V5cycsXG4gICAgJ2xlbmd0aCcsXG4gICAgJ3JlbW92ZUl0ZW0nLFxuICAgICdzZXRJdGVtJyAgXG5dO1xuXG52YXIgX2luc3RhbmNlSWQgPSAwO1xuXG5mdW5jdGlvbiBYRExTKCBvcHRpb25zICkge1xuICAgIHRoaXMub3JpZ2luID0gb3B0aW9ucy5vcmlnaW47XG4gICAgdGhpcy5ob3N0ID0gb3B0aW9ucy5ob3N0O1xuICAgIHRoaXMucGF0aCA9IG9wdGlvbnMucGF0aDtcbiAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgIHRoaXMubWVzc2FnZUlkID0gMDtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuaW5zdGFuY2VJZCA9IF9pbnN0YW5jZUlkKys7XG4gICAgXG4gICAgaWYgKCAhKCB0aGlzLm9yaWdpbiAmJiB0aGlzLnBhdGggKSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnWERMUyBuZWVkcyBib3RoIGFuIG9yaWdpbiBhbmQgYSBwYXRoIHNwZWNpZmllZCBpbiB0aGUgY29uc3RydWN0b3Igb3B0aW9ucy4nICk7XG4gICAgfVxuICAgIFxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IE1FVEhPRFMubGVuZ3RoOyArK2kgKSB7XG4gICAgICAgIHRoaXNbIE1FVEhPRFNbIGkgXSBdID0gdGhpcy5faGFuZGxlTWV0aG9kLmJpbmQoIHRoaXMsIE1FVEhPRFNbIGkgXSApO1xuICAgIH1cbiAgICBcbiAgICBpZiAoIHR5cGVvZiggb3B0aW9ucy5pbml0ICkgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMuaW5pdCApIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxufVxuXG5YRExTLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgIGlmICggc2VsZi5faWZyYW1lICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICggISggd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5KU09OICkgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ1hETFMgcmVxdWlyZXMgYm90aCBwb3N0TW9zc2FnZSBhbmQgSlNPTiBzdXBwb3J0LicgKTtcbiAgICB9XG5cbiAgICB2YXIgb25Mb2FkZWQgPSBzZWxmLl9vbkxvYWRlZC5iaW5kKCBzZWxmICk7XG4gICAgdmFyIG9uTWVzc2FnZSA9IHNlbGYuX29uTWVzc2FnZS5iaW5kKCBzZWxmICk7XG5cbiAgICB2YXIgaWZyYW1lSUQgPSAneGRscy0nICsgbWQ1LmRpZ2VzdF9zKCBzZWxmLmhvc3QgKyBzZWxmLnBhdGggKTtcbiAgICBcbiAgICB2YXIgZXhpc3RpbmdJZnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggaWZyYW1lSUQgKTtcbiAgICBpZiAoIGV4aXN0aW5nSWZyYW1lICkge1xuICAgICAgICBzZWxmLl9pZnJhbWUgPSBleGlzdGluZ0lmcmFtZTtcbiAgICAgICAgaWYgKCBkYXRhc2V0KCBzZWxmLl9pZnJhbWUsICdsb2FkZWQnICkgKSB7XG4gICAgICAgICAgICBvbkxvYWRlZCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzZWxmLl9pZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaWZyYW1lJyApO1xuICAgICAgICBzZWxmLl9pZnJhbWUuaWQgPSBpZnJhbWVJRDtcbiAgICAgICAgc2VsZi5faWZyYW1lLnNldEF0dHJpYnV0ZSggJ3NhbmRib3gnLCAnYWxsb3ctc2NyaXB0cyBhbGxvdy1zYW1lLW9yaWdpbicgKTtcbiAgICAgICAgZGF0YXNldCggc2VsZi5faWZyYW1lLCAnb3JpZ2luJywgc2VsZi5vcmlnaW4gKTtcbiAgICAgICAgZGF0YXNldCggc2VsZi5faWZyYW1lLCAncGF0aCcsIHNlbGYucGF0aCApO1xuICAgICAgICBzZWxmLl9pZnJhbWUuc3R5bGUuY3NzVGV4dCA9ICd3aWR0aDoxcHg7IGhlaWdodDoxcHg7IGRpc3BsYXk6IG5vbmU7JztcbiAgICAgICAgKGZ1bmN0aW9uIF9hZGRJZnJhbWUoKSB7XG4gICAgICAgICAgICBpZiAoIGRvY3VtZW50LmJvZHkgKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggc2VsZi5faWZyYW1lICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCBfYWRkSWZyYW1lLCAxMDAgKTtcbiAgICAgICAgfSkoKTtcbiAgICB9XG5cbiAgICBpZiAoIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuICAgICAgICBzZWxmLl9pZnJhbWUuYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBvbkxvYWRlZCwgZmFsc2UgKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtZXNzYWdlJywgb25NZXNzYWdlLCBmYWxzZSApO1xuICAgIH1cbiAgICBlbHNlIGlmICggc2VsZi5faWZyYW1lLmF0dGFjaEV2ZW50ICkge1xuICAgICAgICBzZWxmLl9pZnJhbWUuYXR0YWNoRXZlbnQoICdvbmxvYWQnLCBvbkxvYWRlZCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cuYXR0YWNoRXZlbnQoICdvbm1lc3NhZ2UnLCBvbk1lc3NhZ2UgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ1hETFMgY291bGQgbm90IHByb3Blcmx5IGJpbmQgZm9yIGV2ZW50IGhhbmRsaW5nLicgKTtcbiAgICB9XG5cbiAgICBpZiAoICFleGlzdGluZ0lmcmFtZSApIHtcbiAgICAgICAgc2VsZi5faWZyYW1lLnNyYyA9IHNlbGYub3JpZ2luICsgc2VsZi5wYXRoO1xuICAgIH1cbn07XG5cblhETFMucHJvdG90eXBlLl9vbkxvYWRlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBcbiAgICBzZWxmLnJlYWR5ID0gdHJ1ZTtcbiAgICBkYXRhc2V0KCBzZWxmLl9pZnJhbWUsICdsb2FkZWQnLCB0cnVlICk7XG4gICAgXG4gICAgdmFyIG1lc3NhZ2U7XG4gICAgd2hpbGUgKCAoIG1lc3NhZ2UgPSBzZWxmLnF1ZXVlLnNoaWZ0KCkgKSApIHtcbiAgICAgICAgc2VsZi5fc2VuZE1lc3NhZ2UoIG1lc3NhZ2UgKTtcbiAgICB9XG59O1xuXG5YRExTLnByb3RvdHlwZS5faGFuZGxlTWV0aG9kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBfYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDAgKTsgLy8gY29udmVydCBhcmd1bWVudHMgdG8gYW4gYXJyYXlcbiAgICB2YXIgbWV0aG9kID0gX2FyZ3Muc2hpZnQoKTtcbiAgICB2YXIgY2FsbGJhY2sgPSBudWxsO1xuICAgIFxuICAgIHNlbGYuaW5pdCgpO1xuICAgIFxuICAgIGlmICggX2FyZ3MubGVuZ3RoICYmIHR5cGVvZiggX2FyZ3NbIF9hcmdzLmxlbmd0aCAtIDEgXSApID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgICBjYWxsYmFjayA9IF9hcmdzLnBvcCgpO1xuICAgIH1cblxuICAgICsrc2VsZi5tZXNzYWdlSWQ7XG4gICAgdmFyIGlkID0gc2VsZi5pbnN0YW5jZUlkICsgJy4nICsgc2VsZi5tZXNzYWdlSWQ7XG4gICAgXG4gICAgaWYgKCBjYWxsYmFjayApIHtcbiAgICAgICAgc2VsZi5jYWxsYmFja3NbIGlkIF0gPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgYXJndW1lbnRzOiBfYXJnc1xuICAgIH07XG4gICAgXG4gICAgaWYgKCBzZWxmLnJlYWR5ICkge1xuICAgICAgICBzZWxmLl9zZW5kTWVzc2FnZSggbWVzc2FnZSApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc2VsZi5xdWV1ZS5wdXNoKCBtZXNzYWdlICk7XG4gICAgfVxufTtcblxuWERMUy5wcm90b3R5cGUuX3NlbmRNZXNzYWdlID0gZnVuY3Rpb24oIG1lc3NhZ2UgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX2lmcmFtZS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCBQUkVGSVggKyBKU09OLnN0cmluZ2lmeSggbWVzc2FnZSApLCBzZWxmLm9yaWdpbiApO1xufTtcblxuWERMUy5wcm90b3R5cGUuX29uTWVzc2FnZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgaWYgKCAoICFldmVudC5vcmlnaW4gfHwgc2VsZi5vcmlnaW4uaW5kZXhPZiggZXZlbnQub3JpZ2luICkgPT09IC0xICkgfHwgKCAhZXZlbnQuZGF0YSB8fCBldmVudC5kYXRhLmluZGV4T2YoIFBSRUZJWCApICE9PSAwICkgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKCBldmVudC5kYXRhLnN1YnN0cmluZyggUFJFRklYLmxlbmd0aCApICk7XG4gICAgXG4gICAgaWYgKCBzZWxmLmNhbGxiYWNrc1sgZGF0YS5pZCBdICkge1xuICAgICAgICBpZiAoIGRhdGEuZXJyb3IgKSB7XG4gICAgICAgICAgICBzZWxmLmNhbGxiYWNrc1sgZGF0YS5pZCBdKCBkYXRhICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWxmLmNhbGxiYWNrc1sgZGF0YS5pZCBdKCBudWxsLCBkYXRhLnJlc3VsdCApO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIHNlbGYuY2FsbGJhY2tzWyBkYXRhLmlkIF07XG4gICAgfVxufTtcbiJdfQ==
