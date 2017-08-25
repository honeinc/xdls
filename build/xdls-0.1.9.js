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

    if ( ( !event.origin || self.origin.indexOf( event.origin ) === -1 ) || ( !event.data || !event.data.indexOf || event.data.indexOf( PREFIX ) !== 0 ) ) {
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
