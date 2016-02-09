var templateEngine = function( template, dataObject, returnAsString ) {

	var tags = /<%(.+?)%>/g
		, statements = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g
		, code = 'with ( obj ) { var r=[];\n'
		, cursor = 0
		, match
		, result;


	var add = function( line, js ) {
		if ( js ) {
			if ( line.match( statements ) ) {
				code += line + '\n';
			} else {
				code += 'r.push(' + line + ');\n';
			}
		} else {
			/*
			* There's a workaround to make it work (.replace( / {2}/g ))
			* Replaces unused spaces to prevent empty text nodes
			*/
			code += ( line != '' ? ( 'r.push("' + line.replace(/"/g, '\\"').replace( / {2}/g, '' ) + '");\n' ) : '' );
		}
		return add;
	}
	while ( match = tags.exec( template ) ) {
		add( template.slice( cursor, match.index ) )( match[1], true );
		cursor = match.index + match[0].length;
	}
	add( template.substr( cursor, template.length - cursor ) );
	code = ( code + 'return r.join( "" ); }' ).replace( /[\r\t\n]/g, '' );

	try {
		if ( !dataObject ) {
			dataObject = {};
		}
		result = new Function( 'obj', code ).apply( dataObject, [ dataObject ] );
	} catch ( err ) {
		console.error( "'" + err.message + "'", " in \n\nCode:\n", code, "\n" );
	}

	if ( !returnAsString ) {
		var d = document.createElement( 'div' );
		d.innerHTML = result;
		
		result = d.childNodes[ 0 ];
	}

	return result;
	
};