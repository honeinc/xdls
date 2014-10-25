XDLS - Cross-Domain Local Storage

====

Allows for storing data across domains.

Eg:

```javascipt
var XDLS = require( 'xdls' );

var xdls = new XDLS( {
    origin: 'http://yourdomain.com',
    path: '/xdls.html'
} );

xdls.setItem( 'key', 'value', function( error ) {
    console.log( 'key/value stored' );

    xdls.getItem( 'key', function( error, value ) {
        if ( error ) {
            console.error( error );
            return;
        }
        
        console.log( 'got value: ' + value );
    } );
} );

```

# INSTALLATION

You'll need to place xdls.html somewhere on the domain you'd like to use to share data. Then, in whatever client code you're developing, you'll need to include XDLS via something like browserify.

# HOW IT WORKS

When you include XDLS into your client code running on a different domain and initialize it to point at your shared/storage domain, it will create an iframe which loads up xdls.html. That iframe can now store data for that domain using [localforage](https://github.com/mozilla/localForage).

When you call the various [localforage](https://github.com/mozilla/localForage) methods on the local XDLS instance, it will send messages to the iframe, which will proxy them to/from localForage on your shared domain.

# WHY YOU MIGHT NEED XDLS

Let's say you make a nice embeddable widget that people can use to show something from your web service on their page. If you want to store any local data, it would be associated with each individual domain that has embedded you.

However, with XDLS you can store that data into your own domain's local storage, which means it can be shared by anyone who's embedded your widget (and with your own site).
