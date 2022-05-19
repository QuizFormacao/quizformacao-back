export enum HttpStatus {
   OK = 200, //
   BAD_REQUEST = 400, // Client sent an invalid request — such as lacking required request body or parameter
   UNAUTHORIZED = 401, // Client failed to authenticate with the server
   FORBIDDEN = 403, // Client authenticated but does not have permission to access the requested resource
   NOT_FOUND  = 404, // The requested resource does not exist
   CONFLICT = 409, //  Duplicate resource or resource already exists
   PRECONDITION_FAILED  = 412, // One or more conditions in the request header fields evaluated to false
   INTERNAL_SERVER_ERROR = 500, // A generic error occurred on the server
   SERVICE_UNAVAILABLE = 503, // The requested services is not available
}
