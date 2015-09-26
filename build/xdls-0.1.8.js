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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGF0YXNldC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tZDUvaW5kZXguanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz1kYXRhc2V0O1xuXG4vKmdsb2JhbCBkb2N1bWVudCovXG5cblxuLy8gcmVwbGFjZSBuYW1lc0xpa2VUaGlzIHdpdGggbmFtZXMtbGlrZS10aGlzXG5mdW5jdGlvbiB0b0Rhc2hlZChuYW1lKSB7XG4gIHJldHVybiBuYW1lLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24odSkge1xuICAgIHJldHVybiBcIi1cIiArIHUudG9Mb3dlckNhc2UoKTtcbiAgfSk7XG59XG5cbnZhciBmbjtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudC5oZWFkICYmIGRvY3VtZW50LmhlYWQuZGF0YXNldCkge1xuICBmbiA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uKG5vZGUsIGF0dHIsIHZhbHVlKSB7XG4gICAgICBub2RlLmRhdGFzZXRbYXR0cl0gPSB2YWx1ZTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24obm9kZSwgYXR0cikge1xuICAgICAgcmV0dXJuIG5vZGUuZGF0YXNldFthdHRyXTtcbiAgICB9LFxuICAgIGRlbDogZnVuY3Rpb24gKG5vZGUsIGF0dHIpIHtcbiAgICAgIGRlbGV0ZSBub2RlLmRhdGFzZXRbYXR0cl07XG4gICAgfVxuICB9O1xufSBlbHNlIHtcbiAgZm4gPSB7XG4gICAgc2V0OiBmdW5jdGlvbihub2RlLCBhdHRyLCB2YWx1ZSkge1xuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIHRvRGFzaGVkKGF0dHIpLCB2YWx1ZSk7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKG5vZGUsIGF0dHIpIHtcbiAgICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS0nICsgdG9EYXNoZWQoYXR0cikpO1xuICAgIH0sXG4gICAgZGVsOiBmdW5jdGlvbiAobm9kZSwgYXR0cikge1xuICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtJyArIHRvRGFzaGVkKGF0dHIpKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRhdGFzZXQobm9kZSwgYXR0ciwgdmFsdWUpIHtcbiAgdmFyIHNlbGYgPSB7XG4gICAgc2V0OiBzZXQsXG4gICAgZ2V0OiBnZXQsXG4gICAgZGVsOiBkZWxcbiAgfTtcblxuICBmdW5jdGlvbiBzZXQoYXR0ciwgdmFsdWUpIHtcbiAgICBmbi5zZXQobm9kZSwgYXR0ciwgdmFsdWUpO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVsKGF0dHIpIHtcbiAgICBmbi5kZWwobm9kZSwgYXR0cik7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICBmdW5jdGlvbiBnZXQoYXR0cikge1xuICAgIHJldHVybiBmbi5nZXQobm9kZSwgYXR0cik7XG4gIH1cblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgIHJldHVybiBzZXQoYXR0ciwgdmFsdWUpO1xuICB9XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIpIHtcbiAgICByZXR1cm4gZ2V0KGF0dHIpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGY7XG59XG4iLCIoZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogbWQ1LmpzXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEsIFlvc2hpbm9yaSBLb2h5YW1hIChodHRwOi8vYWxnb2JpdC5qcC8pXG4gKiBhbGwgcmlnaHRzIHJlc2VydmVkLlxuICovXG5cbmV4cG9ydHMuZGlnZXN0ID0gZnVuY3Rpb24gKE0pIHtcbiAgdmFyIG9yaWdpbmFsTGVuZ3RoXG4gICAgLCBpXG4gICAgLCBqXG4gICAgLCBrXG4gICAgLCBsXG4gICAgLCBBXG4gICAgLCBCXG4gICAgLCBDXG4gICAgLCBEXG4gICAgLCBBQVxuICAgICwgQkJcbiAgICAsIENDXG4gICAgLCBERFxuICAgICwgWFxuICAgICwgcnZhbFxuICAgIDtcblxuXHRmdW5jdGlvbiBGKHgsIHksIHopIHsgcmV0dXJuICh4ICYgeSkgfCAofnggJiB6KTsgfVxuXHRmdW5jdGlvbiBHKHgsIHksIHopIHsgcmV0dXJuICh4ICYgeikgfCAoeSAmIH56KTsgfVxuXHRmdW5jdGlvbiBIKHgsIHksIHopIHsgcmV0dXJuIHggXiB5IF4gejsgICAgICAgICAgfVxuXHRmdW5jdGlvbiBJKHgsIHksIHopIHsgcmV0dXJuIHkgXiAoeCB8IH56KTsgICAgICAgfVxuXG5cdGZ1bmN0aW9uIHRvNGJ5dGVzKG4pIHtcblx0XHRyZXR1cm4gW24mMHhmZiwgKG4+Pj44KSYweGZmLCAobj4+PjE2KSYweGZmLCAobj4+PjI0KSYweGZmXTtcblx0fVxuXG5cdG9yaWdpbmFsTGVuZ3RoID0gTS5sZW5ndGg7IC8vIGZvciBTdGVwLjJcblxuXHQvLyAzLjEgU3RlcCAxLiBBcHBlbmQgUGFkZGluZyBCaXRzXG5cdE0ucHVzaCgweDgwKTtcblx0bCA9ICg1NiAtIE0ubGVuZ3RoKSYweDNmO1xuXHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKVxuXHRcdE0ucHVzaCgwKTtcblxuXHQvLyAzLjIgU3RlcCAyLiBBcHBlbmQgTGVuZ3RoXG5cdHRvNGJ5dGVzKDgqb3JpZ2luYWxMZW5ndGgpLmZvckVhY2goZnVuY3Rpb24gKGUpIHsgTS5wdXNoKGUpOyB9KTtcblx0WzAsIDAsIDAsIDBdLmZvckVhY2goZnVuY3Rpb24gKGUpIHsgTS5wdXNoKGUpOyB9KTtcblxuXHQvLyAzLjMgU3RlcCAzLiBJbml0aWFsaXplIE1EIEJ1ZmZlclxuXHRBID0gWzB4Njc0NTIzMDFdO1xuXHRCID0gWzB4ZWZjZGFiODldO1xuXHRDID0gWzB4OThiYWRjZmVdO1xuXHREID0gWzB4MTAzMjU0NzZdO1xuXG5cdC8vIDMuNCBTdGVwIDQuIFByb2Nlc3MgTWVzc2FnZSBpbiAxNi1Xb3JkIEJsb2Nrc1xuXHRmdW5jdGlvbiByb3VuZHMoYSwgYiwgYywgZCwgaywgcywgdCwgZikge1xuXHRcdGFbMF0gKz0gZihiWzBdLCBjWzBdLCBkWzBdKSArIFhba10gKyB0O1xuXHRcdGFbMF0gPSAoKGFbMF08PHMpfChhWzBdPj4+KDMyIC0gcykpKTtcblx0XHRhWzBdICs9IGJbMF07XG5cdH1cblxuXHRmb3IgKGkgPSAwOyBpIDwgTS5sZW5ndGg7IGkgKz0gNjQpIHtcblx0XHRYID0gW107XG5cdFx0Zm9yIChqID0gMDsgaiA8IDY0OyBqICs9IDQpIHtcblx0XHRcdGsgPSBpICsgajtcblx0XHRcdFgucHVzaChNW2tdfChNW2sgKyAxXTw8OCl8KE1bayArIDJdPDwxNil8KE1bayArIDNdPDwyNCkpO1xuXHRcdH1cblx0XHRBQSA9IEFbMF07XG5cdFx0QkIgPSBCWzBdO1xuXHRcdENDID0gQ1swXTtcblx0XHRERCA9IERbMF07XG5cblx0XHQvLyBSb3VuZCAxLlxuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgMCwgIDcsIDB4ZDc2YWE0NzgsIEYpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgMSwgMTIsIDB4ZThjN2I3NTYsIEYpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAgMiwgMTcsIDB4MjQyMDcwZGIsIEYpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgMywgMjIsIDB4YzFiZGNlZWUsIEYpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgNCwgIDcsIDB4ZjU3YzBmYWYsIEYpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgNSwgMTIsIDB4NDc4N2M2MmEsIEYpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAgNiwgMTcsIDB4YTgzMDQ2MTMsIEYpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgNywgMjIsIDB4ZmQ0Njk1MDEsIEYpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgOCwgIDcsIDB4Njk4MDk4ZDgsIEYpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgOSwgMTIsIDB4OGI0NGY3YWYsIEYpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAxMCwgMTcsIDB4ZmZmZjViYjEsIEYpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAxMSwgMjIsIDB4ODk1Y2Q3YmUsIEYpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAxMiwgIDcsIDB4NmI5MDExMjIsIEYpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAxMywgMTIsIDB4ZmQ5ODcxOTMsIEYpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAxNCwgMTcsIDB4YTY3OTQzOGUsIEYpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAxNSwgMjIsIDB4NDliNDA4MjEsIEYpO1xuXG5cdFx0Ly8gUm91bmQgMi5cblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDEsICA1LCAweGY2MWUyNTYyLCBHKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDYsICA5LCAweGMwNDBiMzQwLCBHKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgMTEsIDE0LCAweDI2NWU1YTUxLCBHKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDAsIDIwLCAweGU5YjZjN2FhLCBHKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDUsICA1LCAweGQ2MmYxMDVkLCBHKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgMTAsICA5LCAweDAyNDQxNDUzLCBHKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgMTUsIDE0LCAweGQ4YTFlNjgxLCBHKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDQsIDIwLCAweGU3ZDNmYmM4LCBHKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgIDksICA1LCAweDIxZTFjZGU2LCBHKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgMTQsICA5LCAweGMzMzcwN2Q2LCBHKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgIDMsIDE0LCAweGY0ZDUwZDg3LCBHKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgIDgsIDIwLCAweDQ1NWExNGVkLCBHKTtcblx0XHRyb3VuZHMoQSwgQiwgQywgRCwgMTMsICA1LCAweGE5ZTNlOTA1LCBHKTtcblx0XHRyb3VuZHMoRCwgQSwgQiwgQywgIDIsICA5LCAweGZjZWZhM2Y4LCBHKTtcblx0XHRyb3VuZHMoQywgRCwgQSwgQiwgIDcsIDE0LCAweDY3NmYwMmQ5LCBHKTtcblx0XHRyb3VuZHMoQiwgQywgRCwgQSwgMTIsIDIwLCAweDhkMmE0YzhhLCBHKTtcblxuXHRcdC8vIFJvdW5kIDMuXG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA1LCAgNCwgMHhmZmZhMzk0MiwgSCk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICA4LCAxMSwgMHg4NzcxZjY4MSwgSCk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDExLCAxNiwgMHg2ZDlkNjEyMiwgSCk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsIDE0LCAyMywgMHhmZGU1MzgwYywgSCk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICAxLCAgNCwgMHhhNGJlZWE0NCwgSCk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICA0LCAxMSwgMHg0YmRlY2ZhOSwgSCk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICA3LCAxNiwgMHhmNmJiNGI2MCwgSCk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsIDEwLCAyMywgMHhiZWJmYmM3MCwgSCk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsIDEzLCAgNCwgMHgyODliN2VjNiwgSCk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsICAwLCAxMSwgMHhlYWExMjdmYSwgSCk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsICAzLCAxNiwgMHhkNGVmMzA4NSwgSCk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICA2LCAyMywgMHgwNDg4MWQwNSwgSCk7XG5cdFx0cm91bmRzKEEsIEIsIEMsIEQsICA5LCAgNCwgMHhkOWQ0ZDAzOSwgSCk7XG5cdFx0cm91bmRzKEQsIEEsIEIsIEMsIDEyLCAxMSwgMHhlNmRiOTllNSwgSCk7XG5cdFx0cm91bmRzKEMsIEQsIEEsIEIsIDE1LCAxNiwgMHgxZmEyN2NmOCwgSCk7XG5cdFx0cm91bmRzKEIsIEMsIEQsIEEsICAyLCAyMywgMHhjNGFjNTY2NSwgSCk7XG5cblx0XHQvLyBSb3VuZCA0LlxuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgMCwgIDYsIDB4ZjQyOTIyNDQsIEkpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgNywgMTAsIDB4NDMyYWZmOTcsIEkpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAxNCwgMTUsIDB4YWI5NDIzYTcsIEkpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgNSwgMjEsIDB4ZmM5M2EwMzksIEkpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAxMiwgIDYsIDB4NjU1YjU5YzMsIEkpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAgMywgMTAsIDB4OGYwY2NjOTIsIEkpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAxMCwgMTUsIDB4ZmZlZmY0N2QsIEkpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgMSwgMjEsIDB4ODU4NDVkZDEsIEkpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgOCwgIDYsIDB4NmZhODdlNGYsIEkpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAxNSwgMTAsIDB4ZmUyY2U2ZTAsIEkpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAgNiwgMTUsIDB4YTMwMTQzMTQsIEkpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAxMywgMjEsIDB4NGUwODExYTEsIEkpO1xuXHRcdHJvdW5kcyhBLCBCLCBDLCBELCAgNCwgIDYsIDB4Zjc1MzdlODIsIEkpO1xuXHRcdHJvdW5kcyhELCBBLCBCLCBDLCAxMSwgMTAsIDB4YmQzYWYyMzUsIEkpO1xuXHRcdHJvdW5kcyhDLCBELCBBLCBCLCAgMiwgMTUsIDB4MmFkN2QyYmIsIEkpO1xuXHRcdHJvdW5kcyhCLCBDLCBELCBBLCAgOSwgMjEsIDB4ZWI4NmQzOTEsIEkpO1xuXG5cdFx0QVswXSArPSBBQTtcblx0XHRCWzBdICs9IEJCO1xuXHRcdENbMF0gKz0gQ0M7XG5cdFx0RFswXSArPSBERDtcblx0fVxuXG5cdHJ2YWwgPSBbXTtcblx0dG80Ynl0ZXMoQVswXSkuZm9yRWFjaChmdW5jdGlvbiAoZSkgeyBydmFsLnB1c2goZSk7IH0pO1xuXHR0bzRieXRlcyhCWzBdKS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7IHJ2YWwucHVzaChlKTsgfSk7XG5cdHRvNGJ5dGVzKENbMF0pLmZvckVhY2goZnVuY3Rpb24gKGUpIHsgcnZhbC5wdXNoKGUpOyB9KTtcblx0dG80Ynl0ZXMoRFswXSkuZm9yRWFjaChmdW5jdGlvbiAoZSkgeyBydmFsLnB1c2goZSk7IH0pO1xuXG5cdHJldHVybiBydmFsO1xufVxuXG5leHBvcnRzLmRpZ2VzdF9zID0gZnVuY3Rpb24gKHMpIHtcblx0dmFyIE0gPSBbXVxuICAgICwgaVxuICAgICwgZFxuICAgICwgcnN0clxuICAgICwgc1xuICAgIDtcblxuXHRmb3IgKGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKylcblx0XHRNLnB1c2gocy5jaGFyQ29kZUF0KGkpKTtcblxuXHRkID0gZXhwb3J0cy5kaWdlc3QoTSk7XG5cdHJzdHIgPSAnJztcblxuXHRkLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcblx0XHRzID0gZS50b1N0cmluZygxNik7XG5cdFx0d2hpbGUgKHMubGVuZ3RoIDwgMilcblx0XHRcdHMgPSAnMCcgKyBzO1xuXHRcdHJzdHIgKz0gcztcblx0fSk7XG5cblx0cmV0dXJuIHJzdHI7XG59XG5cbn0oKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gWERMUztcblxudmFyIG1kNSA9IHJlcXVpcmUoICdtZDUnICk7XG52YXIgZGF0YXNldCA9IHJlcXVpcmUoICdkYXRhc2V0JyApO1xuXG52YXIgUFJFRklYID0gJ3hkbHM6JztcblxuLy8gbXVzdCBtYXRjaCBsb2NhbGZvcmFnZVxudmFyIE1FVEhPRFMgPSBbXG4gICAgJ2NsZWFyJyxcbiAgICAnZ2V0SXRlbScsXG4gICAgJ2tleScsXG4gICAgJ2tleXMnLFxuICAgICdsZW5ndGgnLFxuICAgICdyZW1vdmVJdGVtJyxcbiAgICAnc2V0SXRlbScgIFxuXTtcblxudmFyIF9pbnN0YW5jZUlkID0gMDtcblxuZnVuY3Rpb24gWERMUyggb3B0aW9ucyApIHtcbiAgICB0aGlzLm9yaWdpbiA9IG9wdGlvbnMub3JpZ2luO1xuICAgIHRoaXMucGF0aCA9IG9wdGlvbnMucGF0aDtcbiAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgIHRoaXMubWVzc2FnZUlkID0gMDtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IHt9O1xuICAgIHRoaXMuaW5zdGFuY2VJZCA9IF9pbnN0YW5jZUlkKys7XG4gICAgXG4gICAgaWYgKCAhKCB0aGlzLm9yaWdpbiAmJiB0aGlzLnBhdGggKSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnWERMUyBuZWVkcyBib3RoIGFuIG9yaWdpbiBhbmQgYSBwYXRoIHNwZWNpZmllZCBpbiB0aGUgY29uc3RydWN0b3Igb3B0aW9ucy4nICk7XG4gICAgfVxuICAgIFxuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IE1FVEhPRFMubGVuZ3RoOyArK2kgKSB7XG4gICAgICAgIHRoaXNbIE1FVEhPRFNbIGkgXSBdID0gdGhpcy5faGFuZGxlTWV0aG9kLmJpbmQoIHRoaXMsIE1FVEhPRFNbIGkgXSApO1xuICAgIH1cbiAgICBcbiAgICBpZiAoIHR5cGVvZiggb3B0aW9ucy5pbml0ICkgPT09ICd1bmRlZmluZWQnIHx8IG9wdGlvbnMuaW5pdCApIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxufVxuXG5YRExTLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgIGlmICggc2VsZi5faWZyYW1lICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICggISggd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5KU09OICkgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ1hETFMgcmVxdWlyZXMgYm90aCBwb3N0TW9zc2FnZSBhbmQgSlNPTiBzdXBwb3J0LicgKTtcbiAgICB9XG5cbiAgICB2YXIgb25Mb2FkZWQgPSBzZWxmLl9vbkxvYWRlZC5iaW5kKCBzZWxmICk7XG4gICAgdmFyIG9uTWVzc2FnZSA9IHNlbGYuX29uTWVzc2FnZS5iaW5kKCBzZWxmICk7XG5cbiAgICB2YXIgaWZyYW1lSUQgPSAneGRscy0nICsgbWQ1LmRpZ2VzdF9zKCBzZWxmLmhvc3QgKyBzZWxmLnBhdGggKTtcbiAgICBcbiAgICB2YXIgZXhpc3RpbmdJZnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggaWZyYW1lSUQgKTtcbiAgICBpZiAoIGV4aXN0aW5nSWZyYW1lICkge1xuICAgICAgICBzZWxmLl9pZnJhbWUgPSBleGlzdGluZ0lmcmFtZTtcbiAgICAgICAgaWYgKCBkYXRhc2V0KCBzZWxmLl9pZnJhbWUsICdsb2FkZWQnICkgKSB7XG4gICAgICAgICAgICBvbkxvYWRlZCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzZWxmLl9pZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaWZyYW1lJyApO1xuICAgICAgICBzZWxmLl9pZnJhbWUuaWQgPSBpZnJhbWVJRDtcbiAgICAgICAgc2VsZi5faWZyYW1lLnNldEF0dHJpYnV0ZSggJ3NhbmRib3gnLCAnYWxsb3ctc2NyaXB0cyBhbGxvdy1zYW1lLW9yaWdpbicgKTtcbiAgICAgICAgZGF0YXNldCggc2VsZi5faWZyYW1lLCAnb3JpZ2luJywgc2VsZi5vcmlnaW4gKTtcbiAgICAgICAgZGF0YXNldCggc2VsZi5faWZyYW1lLCAncGF0aCcsIHNlbGYucGF0aCApO1xuICAgICAgICBzZWxmLl9pZnJhbWUuc3R5bGUuY3NzVGV4dCA9ICd3aWR0aDoxcHg7IGhlaWdodDoxcHg7IGRpc3BsYXk6IG5vbmU7JztcbiAgICAgICAgKGZ1bmN0aW9uIF9hZGRJZnJhbWUoKSB7XG4gICAgICAgICAgICBpZiAoIGRvY3VtZW50LmJvZHkgKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggc2VsZi5faWZyYW1lICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCBfYWRkSWZyYW1lLCAxMDAgKTtcbiAgICAgICAgfSkoKTtcbiAgICB9XG5cbiAgICBpZiAoIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuICAgICAgICBzZWxmLl9pZnJhbWUuYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBvbkxvYWRlZCwgZmFsc2UgKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtZXNzYWdlJywgb25NZXNzYWdlLCBmYWxzZSApO1xuICAgIH1cbiAgICBlbHNlIGlmICggc2VsZi5faWZyYW1lLmF0dGFjaEV2ZW50ICkge1xuICAgICAgICBzZWxmLl9pZnJhbWUuYXR0YWNoRXZlbnQoICdvbmxvYWQnLCBvbkxvYWRlZCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cuYXR0YWNoRXZlbnQoICdvbm1lc3NhZ2UnLCBvbk1lc3NhZ2UgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ1hETFMgY291bGQgbm90IHByb3Blcmx5IGJpbmQgZm9yIGV2ZW50IGhhbmRsaW5nLicgKTtcbiAgICB9XG5cbiAgICBpZiAoICFleGlzdGluZ0lmcmFtZSApIHtcbiAgICAgICAgc2VsZi5faWZyYW1lLnNyYyA9IHNlbGYub3JpZ2luICsgc2VsZi5wYXRoO1xuICAgIH1cbn07XG5cblhETFMucHJvdG90eXBlLl9vbkxvYWRlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBcbiAgICBzZWxmLnJlYWR5ID0gdHJ1ZTtcbiAgICBkYXRhc2V0KCBzZWxmLl9pZnJhbWUsICdsb2FkZWQnLCB0cnVlICk7XG4gICAgXG4gICAgdmFyIG1lc3NhZ2U7XG4gICAgd2hpbGUgKCAoIG1lc3NhZ2UgPSBzZWxmLnF1ZXVlLnNoaWZ0KCkgKSApIHtcbiAgICAgICAgc2VsZi5fc2VuZE1lc3NhZ2UoIG1lc3NhZ2UgKTtcbiAgICB9XG59O1xuXG5YRExTLnByb3RvdHlwZS5faGFuZGxlTWV0aG9kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBfYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDAgKTsgLy8gY29udmVydCBhcmd1bWVudHMgdG8gYW4gYXJyYXlcbiAgICB2YXIgbWV0aG9kID0gX2FyZ3Muc2hpZnQoKTtcbiAgICB2YXIgY2FsbGJhY2sgPSBudWxsO1xuICAgIFxuICAgIHNlbGYuaW5pdCgpO1xuICAgIFxuICAgIGlmICggX2FyZ3MubGVuZ3RoICYmIHR5cGVvZiggX2FyZ3NbIF9hcmdzLmxlbmd0aCAtIDEgXSApID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgICBjYWxsYmFjayA9IF9hcmdzLnBvcCgpO1xuICAgIH1cblxuICAgICsrc2VsZi5tZXNzYWdlSWQ7XG4gICAgdmFyIGlkID0gc2VsZi5pbnN0YW5jZUlkICsgJy4nICsgc2VsZi5tZXNzYWdlSWQ7XG4gICAgXG4gICAgaWYgKCBjYWxsYmFjayApIHtcbiAgICAgICAgc2VsZi5jYWxsYmFja3NbIGlkIF0gPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgYXJndW1lbnRzOiBfYXJnc1xuICAgIH07XG4gICAgXG4gICAgaWYgKCBzZWxmLnJlYWR5ICkge1xuICAgICAgICBzZWxmLl9zZW5kTWVzc2FnZSggbWVzc2FnZSApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc2VsZi5xdWV1ZS5wdXNoKCBtZXNzYWdlICk7XG4gICAgfVxufTtcblxuWERMUy5wcm90b3R5cGUuX3NlbmRNZXNzYWdlID0gZnVuY3Rpb24oIG1lc3NhZ2UgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX2lmcmFtZS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCBQUkVGSVggKyBKU09OLnN0cmluZ2lmeSggbWVzc2FnZSApLCBzZWxmLm9yaWdpbiApO1xufTtcblxuWERMUy5wcm90b3R5cGUuX29uTWVzc2FnZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgaWYgKCAoICFldmVudC5vcmlnaW4gfHwgc2VsZi5vcmlnaW4uaW5kZXhPZiggZXZlbnQub3JpZ2luICkgPT09IC0xICkgfHwgKCAhZXZlbnQuZGF0YSB8fCBldmVudC5kYXRhLmluZGV4T2YoIFBSRUZJWCApICE9PSAwICkgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKCBldmVudC5kYXRhLnN1YnN0cmluZyggUFJFRklYLmxlbmd0aCApICk7XG4gICAgXG4gICAgaWYgKCBzZWxmLmNhbGxiYWNrc1sgZGF0YS5pZCBdICkge1xuICAgICAgICBpZiAoIGRhdGEuZXJyb3IgKSB7XG4gICAgICAgICAgICBzZWxmLmNhbGxiYWNrc1sgZGF0YS5pZCBdKCBkYXRhICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWxmLmNhbGxiYWNrc1sgZGF0YS5pZCBdKCBudWxsLCBkYXRhLnJlc3VsdCApO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIHNlbGYuY2FsbGJhY2tzWyBkYXRhLmlkIF07XG4gICAgfVxufTtcbiJdfQ==
