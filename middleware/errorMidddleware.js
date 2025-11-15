export const errorMiddleware = (err, req, res, next)=>{
    let statusCode = err.statusCode || 500
    let statusMessage = err.statusMessage || "false"
    let message = err.message || "internal server error"
    let errors = err.errors || null


    res.status(statusCode).json({
        success : statusMessage,
        message,
        errors
    })
} 