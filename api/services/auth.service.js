import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config.js';

export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
export const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';
export const ACCOUNT_LOCKED_MESSAGE = 'Account is temporarily locked. Please try again later.';

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = (plainPassword, hashedPassword) => {
  try {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  } catch (error) {
    return false;
  }
};

export const DUMMY_PASSWORD_HASH = bcrypt.hashSync('dummy', 10);

export const signAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, restaurantId: user.restaurantId },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

export const issueCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const issueRefreshTokenValue = () => {
  return crypto.randomBytes(64).toString('hex');
};

export const hashRefreshToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const buildCookieOptions = () => {
  return {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000
  };
};

export const buildCsrfCookieOptions = () => {
  return {
    httpOnly: false,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000
  };
};

export const buildRefreshCookieOptions = () => {
  return {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
};

export const REFRESH_COOKIE_NAME = 'refresh_token';

export const getRefreshTtlMs = () => {
  return 7 * 24 * 60 * 60 * 1000;
};

export const getUserAgent = (req) => {
  return req.headers['user-agent'] || 'unknown';
};

export const getActiveLockoutUntil = (user) => {
  if (user.security?.lockoutUntil && new Date(user.security.lockoutUntil) > new Date()) {
    return new Date(user.security.lockoutUntil);
  }
  return null;
};

export const resetSigninSecurityState = async (user) => {
  if (user.security) {
    user.security.failedLoginAttempts = 0;
    user.security.lockoutUntil = null;
    user.security.lockoutCount = 0;
    user.security.lastFailedLoginAt = null;
  }
};

export const recordFailedSigninAttempt = async (user) => {
  if (!user.security) {
    user.security = {
      failedLoginAttempts: 0,
      lockoutUntil: null,
      lockoutCount: 0,
      lastFailedLoginAt: null
    };
  }

  user.security.failedLoginAttempts = (user.security.failedLoginAttempts || 0) + 1;
  user.security.lastFailedLoginAt = new Date();

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

  let locked = false;
  if (user.security.failedLoginAttempts >= MAX_ATTEMPTS) {
    user.security.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
    user.security.lockoutCount = (user.security.lockoutCount || 0) + 1;
    locked = true;
  }

  await user.save();

  return {
    locked,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - user.security.failedLoginAttempts),
    lockoutUntil: user.security.lockoutUntil
  };
};

export const issueSession = async ({ req, res, user }) => {
  const accessToken = signAccessToken(user);
  const csrfToken = issueCsrfToken();

  res.cookie('access_token', accessToken, buildCookieOptions());
  res.cookie('csrf_token', csrfToken, buildCsrfCookieOptions());

  return { accessToken, csrfToken };
};

export const revokeRefreshTokenFromRequest = async (req, action) => {
  return { success: true };
};

export const incrementSecurityEvent = async (event, count = 1) => {
  return { success: true };
};
