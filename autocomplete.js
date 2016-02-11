;var Autocomplete = ( function () {
	"use strict";

	var notSearchKeys = [ 13, 16, 17, 18, 37, 38, 39, 40 ];
	var optionTemplate = document.getElementById( 'tpl-option' ).innerHTML;
	var resultList;

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


	/*
	* Actions to change on autocomplete box
	**/
	var actions = ( function () {
		
		var down = function () {
			var items = this.childNodes;
			for ( var i = 0, l = items.length; i < l; i++ ) {
				var el = items[ i ];
				if ( el.classList && el.classList.contains( 'selected' ) ) {
					el.classList.remove( 'selected' );

					if ( el.nextElementSibling ) {
						el.nextElementSibling.classList.add( 'selected' );
					} else {
						el.parentNode.firstChild.classList.add( 'selected' );
					}
					break; // Break loop to avoid removing the class
				}
			}
		};

		var up = function () {
			var items = this.childNodes;
			for ( var i = 0, l = items.length; i < l; i++ ) {
				var el = items[ i ];
				if ( el.classList && el.classList.contains( 'selected' ) ) {
					el.classList.remove( 'selected' );
					
					if ( el.previousElementSibling ) {
						el.previousElementSibling.classList.add( 'selected' );
					} else {
						el.parentNode.lastChild.classList.add( 'selected' );
					}
					break; // Break loop to avoid removing the class
				}
			}
		};

		var select = function ( isClick, callback, input ) {
			console.log( arguments );
			if ( isClick ) {
				
				var sel = { id: this.dataset.id, label: this.innerText };
				callback && callback.call( sel );
				boxDisplay.hide.call( this );

			} else {

				var items = this.childNodes;
				for ( var i = 0, l = items.length; i < l; i++ ) {
					var el = items[ i ];
					if ( el.classList && el.classList.contains( 'selected' ) ) {

						var sel = { id: el.dataset.id, label: el.innerText };
						callback && callback.call( sel );
						boxDisplay.hide.call( input );

						break;
					}
				}
			}
		};

		return {
			down: down
			, up: up
			, select: select
		};

	})();


	var boxDisplay = ( function () {

		var show = function ( a ) {
			// ~a~ is a data array
			// ~this~ refers to the input
			var t = templateEngine( optionTemplate, { data: a }, true );
			var children = this.parentNode.childNodes;

			for ( var i = 0, l = children.length; i < l; i++ ) {
				var c = children[ i ];
				if ( c.classList && c.classList.contains( 'autocomplete' ) ) {
					c.innerHTML = t;
					resultList = c.childNodes[ 0 ]; // Get the first element "ul"
				}
			}
		};

		var hide = function () {
			// ~this~ refers the input
			var children = this.parentNode.childNodes;
			for ( var i = 0, l = children.length; i < l; i++ ) {
				var c = children[ i ];
				if ( c.classList && c.classList.contains( 'autocomplete' ) ) {
					c.innerHTML = '';
				}
			}
		};

		return {
			show: show
			, hide: hide
		};
	})();


	var init = function ( opt ) {
		
		var input = this;

		var request = function ( d, cb ) {
			ajax.get({
				url: opt.source
				, data: '?term='+ d
				, success: cb
			});
		};

		var doRequest = function () {
			if ( !input.value ) {
				return;
			}
			request( input.value, function ( d ) {
				d = JSON.parse( d );

				boxDisplay.show.call( input, d );
			});
		};

		this.onfocusout = function () {
			boxDisplay.hide.call( this );
		};

		this.onkeydown = function ( event ) {
			var k = event.keyCode;
			if ( notSearchKeys.indexOf( k ) > -1 ) {
				return false;
			}
		};

		this.onkeyup = function ( event ) {
			var key = event.keyCode;
			if ( notSearchKeys.indexOf( key ) > -1 ) {
				if ( !!this.value && ( key === 13 || key === 38 || key === 40 ) ) {
					key === 38 && actions.up.call( resultList );
					key === 40 && actions.down.call( resultList );
					key === 13 && actions.select.call( resultList, null, opt.select, input );
				}
				return;
			}

			doRequest();
		};

	};

	return {
		init: init
		, actions: actions
	};

})();