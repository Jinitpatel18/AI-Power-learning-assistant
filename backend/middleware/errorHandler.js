const errorHandler = (err, req, res, next) => {
    let statuscode = err.statuscode || 500;
    let message = err.message || 'Internal Server Error';

    //mongoose bad objectId
    if (err.name === 'CastError') {
        statuscode = 400;
        message = `Resource not found with id of ${err.value}`;
    }
    
    //mongoose duplicate key
    if (err.code === 11000) {
        statuscode = 400;
        message = 'Duplicate field value entered';
    }
    //mongoose validation error
    if (err.name === 'ValidationError') {
        statuscode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // multer file size error
    if(err.code === 'LIMIT_FILE_SIZE'){
        statuscode = 400;
        message = 'File size is too large';
    }

    //jwt errors
    if (err.name === 'JsonWebTokenError') {
        statuscode = 401;
        message = 'Invalid token, authorization denied';
    }

    if (err.name === 'TokenExpiredError') {
        statuscode = 401;
        message = 'Token expired, authorization denied';
    }
    console.error('Error:',{
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    })

    res.status(statuscode).json({
        success:false,
        error:message,
        statuscode,
        ...(process.env.NODE_ENV === 'development' && {stack : err.stack })
    })
}

export default errorHandler