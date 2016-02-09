;( function () {
	"use strict";

	var notSearchKeys = [ 16, 17, 18, 37, 38, 39, 40 ];

	if ( !window.ajax ) {
		var ajax = ( function () {
			var x;

			var get = function ( o ) {

				if ( x && x.readyState !== 4 ) {
					x.abort();
				}

				x = new XMLHttpRequest();
				x.onload = function () {
					o.success( x.response );
				};

				x.open( 'GET', o.url + o.data, true );
				x.send( null );
			};

			return {
				get: get
			};
		})();
	}

	var autocomplete = function ( url ) {
		
		var request = function ( d, cb ) {
			ajax.get({
				url: url
				, data: '?term='+ d
				, success: cb
			});
		};

		var displayOptions = function ( a ) {
			// a is an array
			console.log( a );
		};

		this.onkeyup = function ( event ) {

			if ( notSearchKeys.indexOf( event.keyCode ) > -1 ) {
				return;
			}

			request( this.value, function ( d ) {
				d = JSON.parse( d );
				displayOptions( d );
			});
		};

		
	};


	window.Autocomplete = autocomplete;
})();