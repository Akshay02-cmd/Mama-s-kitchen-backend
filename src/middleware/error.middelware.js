const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  // Log the error for debugging
  console.error(`[${new Date().toISOString()}] Error ${statusCode}:`, message);
  if (statusCode >= 500) {
    console.error('Stack trace:', err.stack);
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorHandler;