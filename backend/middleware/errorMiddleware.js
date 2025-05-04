const errorHandler = (err, req, res, next) => {
  const code = res.statusCode || 500;
  res.status(code).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };