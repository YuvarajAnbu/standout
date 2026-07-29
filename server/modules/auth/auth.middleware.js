const jwt = require("jsonwebtoken");
const User = require("#modules/users/user.model");
const { COOKIE_NAME } = require("#modules/auth/auth.cookies");

function readCookies(header = "") {
  return Object.fromEntries(
    header.split(";").flatMap((entry) => {
      const separator = entry.indexOf("=");
      if (separator < 1) return [];
      return [[entry.slice(0, separator).trim(), decodeURIComponent(entry.slice(separator + 1))]];
    })
  );
}

function optionalAuth(req, res, next) {
  try {
    const cookies = readCookies(req.headers.cookie);
    const token = cookies[COOKIE_NAME] || cookies["__Host-token"] || cookies.token;
    if (!token) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;
    req.token = token;
  } catch (_error) {
    // Invalid and expired cookies are treated as an anonymous session.
  }

  return next();
}

function requireAuth(req, res, next) {
  optionalAuth(req, res, () => {
    if (!req.userId) return res.status(401).json({ message: "Authentication required" });
    return next();
  });
}

async function requireAdmin(req, res, next) {
  try {
    optionalAuth(req, res, () => {});
    if (!req.userId) return res.status(401).json({ message: "Authentication required" });
    const user = await User.findOne({ _id: req.userId, tokens: req.token }, "type").lean();
    if (!user || user.type !== "admin") {
      return res.status(403).json({ message: "Administrator access required" });
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = optionalAuth;
module.exports.optionalAuth = optionalAuth;
module.exports.requireAuth = requireAuth;
module.exports.requireAdmin = requireAdmin;
module.exports.readCookies = readCookies;
