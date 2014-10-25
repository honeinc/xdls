require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"xdls":[function(require,module,exports){
'use strict';

module.exports = XDLS;

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

    self._iframe = document.createElement( 'iframe' );
    self._iframe.id = 'xdls';
    self._iframe.style.cssText = "width:1px; height:1px; display: none;";
    document.body.appendChild( self._iframe );

    var onLoaded = self._onLoaded.bind( self );
    var onMessage = self._onMessage.bind( self );

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

    self._iframe.src = self.origin + self.path;
};

XDLS.prototype._onLoaded = function() {
    var self = this;
    
    self.ready = true;
    
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

},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gWERMUztcblxudmFyIFBSRUZJWCA9ICd4ZGxzOic7XG5cbi8vIG11c3QgbWF0Y2ggbG9jYWxmb3JhZ2VcbnZhciBNRVRIT0RTID0gW1xuICAgICdjbGVhcicsXG4gICAgJ2dldEl0ZW0nLFxuICAgICdrZXknLFxuICAgICdrZXlzJyxcbiAgICAnbGVuZ3RoJyxcbiAgICAncmVtb3ZlSXRlbScsXG4gICAgJ3NldEl0ZW0nICBcbl07XG5cbmZ1bmN0aW9uIFhETFMoIG9wdGlvbnMgKSB7XG4gICAgdGhpcy5vcmlnaW4gPSBvcHRpb25zLm9yaWdpbjtcbiAgICB0aGlzLnBhdGggPSBvcHRpb25zLnBhdGg7XG4gICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLm1lc3NhZ2VJZCA9IDA7XG4gICAgdGhpcy5jYWxsYmFja3MgPSB7fTtcbiAgICBcbiAgICBpZiAoICEoIHRoaXMub3JpZ2luICYmIHRoaXMucGF0aCApICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoICdYRExTIG5lZWRzIGJvdGggYW4gb3JpZ2luIGFuZCBhIHBhdGggc3BlY2lmaWVkIGluIHRoZSBjb25zdHJ1Y3RvciBvcHRpb25zLicgKTtcbiAgICB9XG4gICAgXG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgTUVUSE9EUy5sZW5ndGg7ICsraSApIHtcbiAgICAgICAgdGhpc1sgTUVUSE9EU1sgaSBdIF0gPSB0aGlzLl9oYW5kbGVNZXRob2QuYmluZCggdGhpcywgTUVUSE9EU1sgaSBdICk7XG4gICAgfVxuICAgIFxuICAgIGlmICggdHlwZW9mKCBvcHRpb25zLmluaXQgKSA9PT0gJ3VuZGVmaW5lZCcgfHwgb3B0aW9ucy5pbml0ICkge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG59XG5cblhETFMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgaWYgKCBzZWxmLl9pZnJhbWUgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKCAhKCB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LkpTT04gKSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnWERMUyByZXF1aXJlcyBib3RoIHBvc3RNb3NzYWdlIGFuZCBKU09OIHN1cHBvcnQuJyApO1xuICAgIH1cblxuICAgIHNlbGYuX2lmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpZnJhbWUnICk7XG4gICAgc2VsZi5faWZyYW1lLmlkID0gJ3hkbHMnO1xuICAgIHNlbGYuX2lmcmFtZS5zdHlsZS5jc3NUZXh0ID0gXCJ3aWR0aDoxcHg7IGhlaWdodDoxcHg7IGRpc3BsYXk6IG5vbmU7XCI7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggc2VsZi5faWZyYW1lICk7XG5cbiAgICB2YXIgb25Mb2FkZWQgPSBzZWxmLl9vbkxvYWRlZC5iaW5kKCBzZWxmICk7XG4gICAgdmFyIG9uTWVzc2FnZSA9IHNlbGYuX29uTWVzc2FnZS5iaW5kKCBzZWxmICk7XG5cbiAgICBpZiAoIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuICAgICAgICBzZWxmLl9pZnJhbWUuYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBvbkxvYWRlZCwgZmFsc2UgKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtZXNzYWdlJywgb25NZXNzYWdlLCBmYWxzZSApO1xuICAgIH1cbiAgICBlbHNlIGlmICggc2VsZi5faWZyYW1lLmF0dGFjaEV2ZW50ICkge1xuICAgICAgICBzZWxmLl9pZnJhbWUuYXR0YWNoRXZlbnQoICdvbmxvYWQnLCBvbkxvYWRlZCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cuYXR0YWNoRXZlbnQoICdvbm1lc3NhZ2UnLCBvbk1lc3NhZ2UgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ1hETFMgY291bGQgbm90IHByb3Blcmx5IGJpbmQgZm9yIGV2ZW50IGhhbmRsaW5nLicgKTtcbiAgICB9XG5cbiAgICBzZWxmLl9pZnJhbWUuc3JjID0gc2VsZi5vcmlnaW4gKyBzZWxmLnBhdGg7XG59O1xuXG5YRExTLnByb3RvdHlwZS5fb25Mb2FkZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgc2VsZi5yZWFkeSA9IHRydWU7XG4gICAgXG4gICAgdmFyIG1lc3NhZ2U7XG4gICAgd2hpbGUgKCAoIG1lc3NhZ2UgPSBzZWxmLnF1ZXVlLnNoaWZ0KCkgKSApIHtcbiAgICAgICAgc2VsZi5fc2VuZE1lc3NhZ2UoIG1lc3NhZ2UgKTtcbiAgICB9XG59O1xuXG5YRExTLnByb3RvdHlwZS5faGFuZGxlTWV0aG9kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBfYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDAgKTsgLy8gY29udmVydCBhcmd1bWVudHMgdG8gYW4gYXJyYXlcbiAgICB2YXIgbWV0aG9kID0gX2FyZ3Muc2hpZnQoKTtcbiAgICB2YXIgY2FsbGJhY2sgPSBudWxsO1xuICAgIFxuICAgIHNlbGYuaW5pdCgpO1xuICAgIFxuICAgIGlmICggX2FyZ3MubGVuZ3RoICYmIHR5cGVvZiggX2FyZ3NbIF9hcmdzLmxlbmd0aCAtIDEgXSApID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgICBjYWxsYmFjayA9IF9hcmdzLnBvcCgpO1xuICAgIH1cblxuICAgIHZhciBpZCA9ICsrc2VsZi5tZXNzYWdlSWQ7XG4gICAgXG4gICAgaWYgKCBjYWxsYmFjayApIHtcbiAgICAgICAgc2VsZi5jYWxsYmFja3NbIGlkIF0gPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgICAgaWQ6IGlkLFxuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgYXJndW1lbnRzOiBfYXJnc1xuICAgIH07XG4gICAgXG4gICAgaWYgKCBzZWxmLnJlYWR5ICkge1xuICAgICAgICBzZWxmLl9zZW5kTWVzc2FnZSggbWVzc2FnZSApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc2VsZi5xdWV1ZS5wdXNoKCBtZXNzYWdlICk7XG4gICAgfVxufTtcblxuWERMUy5wcm90b3R5cGUuX3NlbmRNZXNzYWdlID0gZnVuY3Rpb24oIG1lc3NhZ2UgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuX2lmcmFtZS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCBQUkVGSVggKyBKU09OLnN0cmluZ2lmeSggbWVzc2FnZSApLCBzZWxmLm9yaWdpbiApO1xufTtcblxuWERMUy5wcm90b3R5cGUuX29uTWVzc2FnZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgaWYgKCAoICFldmVudC5vcmlnaW4gfHwgc2VsZi5vcmlnaW4uaW5kZXhPZiggZXZlbnQub3JpZ2luICkgPT09IC0xICkgfHwgKCAhZXZlbnQuZGF0YSB8fCBldmVudC5kYXRhLmluZGV4T2YoIFBSRUZJWCApICE9PSAwICkgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKCBldmVudC5kYXRhLnN1YnN0cmluZyggUFJFRklYLmxlbmd0aCApICk7XG4gICAgXG4gICAgaWYgKCBzZWxmLmNhbGxiYWNrc1sgZGF0YS5pZCBdICkge1xuICAgICAgICBpZiAoIGRhdGEuZXJyb3IgKSB7XG4gICAgICAgICAgICBzZWxmLmNhbGxiYWNrc1sgZGF0YS5pZCBdKCBkYXRhICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZWxmLmNhbGxiYWNrc1sgZGF0YS5pZCBdKCBudWxsLCBkYXRhLnJlc3VsdCApO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIHNlbGYuY2FsbGJhY2tzWyBkYXRhLmlkIF07XG4gICAgfVxufTtcbiJdfQ==
