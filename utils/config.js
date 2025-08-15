require("dotenv").config();

// ✅ Single source of truth for lifetime
const ACCESS_TOKEN_LIFETIME_MINUTES = 15;
const REFRESH_TOKEN_LIFETIME_DAYS = 7;

// ✅ Access token
const ACCESS_TOKEN_EXPIRES = `${ACCESS_TOKEN_LIFETIME_MINUTES}m`;

// ✅ Refresh token (JWT)
const REFRESH_TOKEN_EXPIRES = `${REFRESH_TOKEN_LIFETIME_DAYS}d`;

// ✅ Cookie maxAge in ms (for refresh token cookie)
const COOKIE_REFRESH_MAXAGE = REFRESH_TOKEN_LIFETIME_DAYS * 24 * 60 * 60 * 1000;

module.exports = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "access-secret-key",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "refresh-secret-key",

  ACCESS_TOKEN_EXPIRES, // "15m"
  REFRESH_TOKEN_EXPIRES, // "7d"
  COOKIE_REFRESH_MAXAGE, // 7 days in ms
};
