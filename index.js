module.exports = function( fn ) {
    return function( req, res, next ) {

        // check if a given action string is allowed for this request
        req.allowed = function( action ) {
            return fn( req, action );
        }

        // set the response Allow header to the given list of actions
        // this method will first verify that the request is indeed allowed
        // to access these actions using the req.allowed()
        res.allow = function( actions ) {
            res.setHeader( "Allow", actions.filter( req.allowed ).join( "," ) );
        }

        // negates req.allowed, but also sets the response to 405 Not Allowed
        req.denied = function( action, others ) {
            if ( others ) res.allow( others ); // first notify the response of the other allowed actions
            if ( !req.allowed( action ) ) {
                res.writeHead( 405, "Not Allowed" );
                res.write( "Not Allowed" );
                res.end();
                return true;
            }
            return false
        }
        next()
    }
};