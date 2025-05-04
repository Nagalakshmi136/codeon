// middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    // Determine statusCode: use the one set on res, or default to 500
    const statusCode = res.statusCode ? res.statusCode : 500;
  
    res.status(statusCode);
  
    res.json({
      message: err.message,
      // Include stack trace only in development mode for debugging
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = { errorHandler };