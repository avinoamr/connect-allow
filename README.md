connect-allow
=============

A tiny middleware for Connect and Express.js for controlling access permissions and the Allow HTTP header

### Installation

```
$ npm install connect-slashes
```

### Usage

Define a custom boolean function to determine if a certain resource (request URL, by default) is
accessible with the provided action (request method, by default):

```javascript
var connect = require("connect")
  , allow = require("allow");
  
connect()
  .use(allow(function(uri, action) {
    return action != "DELETE"; // disallow all DELETE requests
  }).listen(3000); 
```

This does two things::

1. It will reject all DELETE requests with 405 Not Allowed header
2. It will set the Allow header to `GET,PUT,POST,PATCH,DELETE`

You can also access the request itself (bound to the function) in your function to determine if the action
is allowed by the user:

```javascript
connect()
  .use(allow(function(uri, action) {
    // allow admins to DELETE
    return action != "DELETE" ||
           this.getAuthDetails().user.role == "admin";
  }).listen(3000); 
```

So far, most of the logic can be implemented quite easily as a simple middleware. The 
real benefit of `connect-allow` is when you need to abstract the permissions management
from submodules:

```javascript
var admins_app = connect()
  .use( allow([ "delete_account" ]), function() {
    // ...
  });

connect()
  .use(allow(function(uri, aciton){
    return action != "delete_account" ||
           this.getAuthDetails().user.role == "admin";
    
  })
  .use( "/admin", admins_app )
```
