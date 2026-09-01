class ApiError extends Error{
    constructor(
        statusCode,
        message = "haww glt hai",
        error = [],
        stack = ""
    )   
    {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.error = error

        if(stack){
            this.stack
        }
        else{
            Error.captureStackTrace(this,this.construtor)
        }
    }
}

export {ApiError}