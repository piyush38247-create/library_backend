export class ErrorHandler extends Error{
    constructor(message, statuscode, statusMessage){
        super(typeof message === "string" ? message : "validation Error");

        this.statusCode = statuscode
        this.statusMessage = statusMessage

        if(Array.isArray(message) || typeof message === "object"){
            this.message = "Validation Error"
            this.errors = message
        }
        else{
            this.errors = null
        }
        
        Error.captureStackTrace(this, this.constructor)
    }
}