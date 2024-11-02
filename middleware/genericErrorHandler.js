const genericErrorHandler = (err, req, res) => {
  const errorStatus = err.statusCode || 500;
  const errorMessage = err.message || "Oops somethings went wrong";

  res.status(errorStatus).send({
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
};

module.exports = genericErrorHandler;
