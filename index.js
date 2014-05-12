module.exports = function( methods, fn ) {
    if ( !Array.isArray( methods ) ) {
        fn = methods
        methods = [ "GET", "PUT", "POST", "PATCH", "DELETE" ]
    }

    return function( req, res, next ) {
        var method, m, deny = false, allowed = [];
        if ( fn ) req.allowed = fn;
        if ( !req.allowed ) req.allowed = function() { return false };
        for ( m = 0 ; m < methods.length ; m += 1 ) {
            method = methods[ m ];
            if ( req.allowed( req.originalUrl, method ) ) {
                allowed.push( method )
            } else if ( method == req.method ) {
                deny = true
            }
        }

        res.setHeader( "Allow", allowed.join( "," ) );
        if ( deny ) {
            res.writeHead( 405, "Not Allowed" );
            res.write( "Not Allowed" );
            res.end();
            return
        }

        next()
    }
};