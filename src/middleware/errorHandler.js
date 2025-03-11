

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Default to 500 if no statusCode
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack in production
  });
};

export { errorHandler };
