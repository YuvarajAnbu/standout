const { isProduction } = require("#config/env");

const COOKIE_NAME = isProduction ? "__Host-token" : "token";

const cookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: isProduction,
};

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookies(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  if (COOKIE_NAME !== "__Host-token") {
    res.clearCookie("__Host-token", { ...cookieOptions, secure: true });
  }
}

module.exports = { COOKIE_NAME, clearAuthCookies, setAuthCookie };
