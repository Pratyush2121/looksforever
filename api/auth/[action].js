import { connectToDatabase } from '../lib/db.js';
import { Admin } from '../lib/models.js';
import {
  hashPassword,
  comparePassword,
  signToken,
  setAuthCookie,
  clearAuthCookie,
  requireAdmin,
  checkLoginRateLimit,
  recordLoginAttempt,
} from '../lib/auth.js';
import { validateSchema, LoginSchemaZod } from '../lib/validate.js';

export default async function handler(req, res) {
  // Support both dynamic route /api/auth/[action] and query param ?action=
  const { action } = req.query;

  try {
    await connectToDatabase();
  } catch (err) {
    console.warn('[Auth API] MongoDB connection issue:', err.message);
  }

  // 1. POST /api/auth/login
  if (action === 'login' && req.method === 'POST') {
    const validation = validateSchema(LoginSchemaZod, req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        errors: validation.errors,
      });
    }

    const { usernameOrEmail, username, password } = validation.data;
    const identifier = (usernameOrEmail || username || '').toLowerCase().trim();

    // Rate limiting check
    const rateLimit = checkLoginRateLimit(identifier);
    if (!rateLimit.allowed) {
      return res.status(429).json({ error: rateLimit.message });
    }

    try {
      // If MongoDB is not yet connected in local environment, allow default dev credentials
      if (!process.env.MONGODB_URI) {
        const devUser = (process.env.DEV_ADMIN_USERNAME || 'admin').toLowerCase();
        const devPass = process.env.DEV_ADMIN_PASSWORD || 'Admin@12345';
        if (identifier === devUser && password === devPass) {
          const devToken = signToken({
            userId: 'dev-admin-id',
            username: 'admin',
            email: 'admin@looksforever.org',
            role: 'SUPER_ADMIN',
          });
          setAuthCookie(res, devToken);
          return res.status(200).json({
            success: true,
            message: 'Logged in successfully (Dev Mode)',
            admin: {
              id: 'dev-admin-id',
              username: 'admin',
              email: 'admin@looksforever.org',
              role: 'SUPER_ADMIN',
            },
            user: {
              id: 'dev-admin-id',
              username: 'admin',
              email: 'admin@looksforever.org',
              role: 'SUPER_ADMIN',
            },
          });
        }
      }

      // Find admin by username or email
      const admin = await Admin.findOne({
        $or: [{ username: identifier }, { email: identifier }],
      });

      if (!admin) {
        recordLoginAttempt(identifier, false);
        return res.status(401).json({
          error: 'Invalid credentials. Please check your username and password.',
          errors: { usernameOrEmail: 'Invalid username or password' },
        });
      }

      // Check if account is locked in DB
      if (admin.lockUntil && admin.lockUntil > new Date()) {
        const remaining = Math.ceil((admin.lockUntil - new Date()) / 60000);
        return res.status(429).json({
          error: `Account locked due to failed attempts. Try again in ${remaining} minute(s).`,
        });
      }

      // Compare password
      const isValid = await comparePassword(password, admin.passwordHash);
      if (!isValid) {
        recordLoginAttempt(identifier, false);
        admin.failedAttempts = (admin.failedAttempts || 0) + 1;
        if (admin.failedAttempts >= 5) {
          admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
          admin.failedAttempts = 0;
        }
        await admin.save();

        return res.status(401).json({
          error: 'Invalid credentials. Please check your username and password.',
          errors: { password: 'Incorrect password' },
        });
      }

      // Success
      recordLoginAttempt(identifier, true);
      admin.failedAttempts = 0;
      admin.lockUntil = null;
      admin.lastLoginAt = new Date();
      await admin.save();

      const token = signToken({
        userId: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      });

      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
        user: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      return res.status(500).json({ error: 'Login failed', details: err.message });
    }
  }

  // 2. POST /api/auth/logout
  if (action === 'logout' && req.method === 'POST') {
    clearAuthCookie(res);
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  // 3. GET /api/auth/me
  if (action === 'me' && req.method === 'GET') {
    const user = requireAdmin(req, res);
    if (!user) return; // response sent in requireAdmin

    return res.status(200).json({
      success: true,
      admin: user,
      user,
    });
  }

  // 4. POST /api/auth/setup (Initial one-time admin setup)
  if (action === 'setup' && req.method === 'POST') {
    const setupKey = req.headers['x-admin-setup-key'] || req.body.setupKey;
    const requiredKey = process.env.ADMIN_SETUP_KEY || 'initial_admin_setup_secret_key_change_me';

    if (!setupKey || setupKey !== requiredKey) {
      return res.status(403).json({ error: 'Invalid or missing setup key.' });
    }

    const { username, email, password } = req.body;
    if (!username || !email || !password || password.length < 6) {
      return res.status(400).json({
        error: 'Please provide username, email and password (minimum 6 characters).',
      });
    }

    try {
      const existing = await Admin.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
      });

      if (existing) {
        return res.status(400).json({ error: 'Admin user already exists.' });
      }

      const passwordHash = await hashPassword(password);
      const newAdmin = await Admin.create({
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'SUPER_ADMIN',
      });

      const token = signToken({
        userId: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      });

      setAuthCookie(res, token);

      return res.status(201).json({
        success: true,
        message: 'Admin account created successfully.',
        user: {
          id: newAdmin._id,
          username: newAdmin.username,
          email: newAdmin.email,
        },
      });
    } catch (err) {
      return res.status(500).json({ error: 'Setup failed', details: err.message });
    }
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}

