const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    status: "error",
    message: err.message || "Something went wrong!",
  });
};

module.exports = errorHandler;
