import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { parseCookie, stringifyCookie } from 'cookie';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'looks_forever_fallback_dev_secret_change_in_production_min_32_chars';
const COOKIE_NAME = 'lf_admin_token';

// In-memory rate limiting map for login lockout
const loginAttempts = new Map();

export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

export async function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';
  const serialized = stringifyCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);
}

export function clearAuthCookie(res) {
  const isProduction = process.env.NODE_ENV === 'production';
  const serialized = stringifyCookie(COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);
}

export function parseTokenFromReq(req) {
  // 1. Try parsing from cookie
  const headerCookie = req.headers.cookie;
  if (headerCookie) {
    try {
      const parsed = parseCookie(headerCookie);
      if (parsed[COOKIE_NAME]) {
        return parsed[COOKIE_NAME];
      }
    } catch (e) {}
  }

  // 2. Try parsing from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Shared Middleware helper for admin protection.
 * Returns decoded admin user if valid, or sends 401 response and returns null.
 */
export function requireAdmin(req, res) {
  const token = parseTokenFromReq(req);

  if (!token) {
    res.status(401).json({
      error: 'Authentication required. Please log in to admin.',
      code: 'AUTH_REQUIRED',
    });
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    res.status(401).json({
      error: 'Session expired or invalid token. Please log in again.',
      code: 'AUTH_INVALID',
    });
    return null;
  }

  req.user = decoded;
  return decoded;
}

/**
 * Login Rate Limiting / Lockout check (5 failed attempts = 15 min cooldown)
 */
export function checkLoginRateLimit(identifier) {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) return { allowed: true };

  if (record.lockUntil && record.lockUntil > now) {
    const remainingMinutes = Math.ceil((record.lockUntil - now) / 60000);
    return {
      allowed: false,
      message: `Account temporarily locked due to excessive failed attempts. Try again in ${remainingMinutes} minute(s).`,
    };
  }

  return { allowed: true };
}

export function recordLoginAttempt(identifier, success) {
  const now = Date.now();
  if (success) {
    loginAttempts.delete(identifier);
    return;
  }

  const record = loginAttempts.get(identifier) || { count: 0, lockUntil: null };
  record.count += 1;

  if (record.count >= 5) {
    record.lockUntil = now + 15 * 60 * 1000; // 15 minutes lockout
    record.count = 0;
  }

  loginAttempts.set(identifier, record);
}
