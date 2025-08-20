
const ErrorHandler = (err, res) => {

      if(process.env.NODE_ENV === "development"){
            res.status(400).json({
                  success: false,
                  message: err.message,
                  stack: err.stack,
                  error: err,
            })
      }

      if(process.env.NODE_ENV === "production"){

            // wrong mongoose object id error
            // if(err.name === "CastError"){
            //       const message = `Resource not found. Invalid: ${err.path}`
            //       error = new ErrorHandler(message, 400)
            // }
            // mongoose validation error
            if(err.name === "ValidationError"){
                  const message = Object.values(err.errors).map((value)=>{
                        return value.message
                  })
                  res.status(400).json({
                        success: false,
                        message: message.toString(),
                  })
            }
            // mongoose duplicate key error
            // if(err.code === 11000){
            //       const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            //       error = new ErrorHandler(message, 400)
            // }
            // // json web token error
            // if(err.name === "JsonWebTokenError"){
            //       const message = `Json web token is invalid. Try again`
            //       error = new ErrorHandler(message, 400)
            // }
            // // json web token expired error
            // if(err.name === "TokenExpiredError"){
            //       const message = `Json web token is expired. Try again`
            //       error = new ErrorHandler(message, 400)
            // }
            
      }
}
module.exports = ErrorHandler