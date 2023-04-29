const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  if (typeof req.headers.cookie === "undefined") {
    next();
    return;
  }

  let token;
  req.headers.cookie.split(";").forEach((el) => {
    if (el.startsWith("__Host-token")) {
      token = el.split("=")[1];
    }
  });
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded._id;
    req.token = token;
  }

  next();
  return;
};
