function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) {
    console.error(error);
  }

  const body = { message: status >= 500 ? "Internal server error" : error.message };
  if (process.env.NODE_ENV !== "production" && error.details) {
    body.details = error.details;
  }
  return res.status(status).json(body);
}

module.exports = { errorHandler, notFound };
