import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { db, UserRecord, RoleType } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'BHULEKH_AI_NIC_GOV_SECURE_JWT_KEY_2026_X9#21';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'BHULEKH_AI_REFRESH_SECRET_KEY_GOI_7719';

export interface TokenPayload {
  userId: string;
  email: string;
  roleType: RoleType;
  fullName: string;
  district?: string;
  department?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

// Generate Access and Refresh tokens
export function generateTokens(user: UserRecord) {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    roleType: user.roleType,
    fullName: user.fullName,
    district: user.district,
    department: user.department,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken, payload };
}

// Generate 2FA / Temporary login token
export function generateTemp2FAToken(user: UserRecord, purpose: 'OFFICER_2FA' | 'CITIZEN_OTP') {
  return jwt.sign(
    { userId: user.id, email: user.email, roleType: user.roleType, purpose },
    JWT_SECRET,
    { expiresIn: '10m' }
  );
}

export function verifyTempToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      roleType: RoleType;
      purpose: string;
    };
  } catch (err) {
    return null;
  }
}

// Middleware: Authenticate JWT from Authorization header or cookie
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.bhulekh_token) {
    token = req.cookies.bhulekh_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'AUTHENTICATION_REQUIRED',
      message: 'Access denied: Valid Government of India authentication session required.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'SESSION_EXPIRED',
      message: 'Your government session has expired or token is invalid. Please re-authenticate.',
    });
  }
}

// Middleware: Role Based Access Control (RBAC)
export function requireRoles(allowedRoles: RoleType[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.roleType)) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN_ROLE',
        message: `Security Clearance Violation: The role [${req.user.roleType}] does not possess clearance for this departmental resource.`,
      });
    }

    next();
  };
}

// In-memory rate limiter per IP/Identifier
const rateLimitMap = new Map<string, { count: number; firstAttempt: number }>();

export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { count: 1, firstAttempt: now });
    return true;
  }

  if (now - record.firstAttempt > windowMs) {
    rateLimitMap.set(key, { count: 1, firstAttempt: now });
    return true;
  }

  record.count += 1;
  return record.count <= maxAttempts;
}

// OTP Generator abstraction
export function generateOtp(identifier: string, purpose: 'CITIZEN_LOGIN' | 'OFFICER_2FA' | 'PASSWORD_RESET') {
  // Generate 6 digit OTP (for testing convenience, 123456 or a random 6-digit)
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  // Remove any existing active otp for this identifier and purpose
  db.otps = db.otps.filter((o) => !(o.identifier === identifier && o.purpose === purpose));

  const otpRecord = {
    id: `otp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    identifier,
    code,
    purpose,
    expiresAt,
    attempts: 0,
    isConsumed: false,
  };

  db.otps.push(otpRecord);
  return { code, expiresAt };
}

export function verifyOtp(identifier: string, code: string, purpose: 'CITIZEN_LOGIN' | 'OFFICER_2FA' | 'PASSWORD_RESET') {
  // Allow test master OTP '123456' for ease of testing or verify real code
  if (code === '123456') {
    return { valid: true };
  }

  const otp = db.otps.find(
    (o) => o.identifier === identifier && o.purpose === purpose && !o.isConsumed
  );

  if (!otp) {
    return { valid: false, reason: 'OTP expired or not requested. Please request a new OTP.' };
  }

  if (Date.now() > otp.expiresAt) {
    otp.isConsumed = true;
    return { valid: false, reason: 'OTP has expired after 5 minutes.' };
  }

  otp.attempts += 1;
  if (otp.attempts > 3) {
    otp.isConsumed = true;
    return { valid: false, reason: 'Maximum OTP verification attempts exceeded. Please request a fresh OTP.' };
  }

  if (otp.code !== code.trim()) {
    return { valid: false, reason: 'Incorrect OTP entered. Please check and try again.' };
  }

  otp.isConsumed = true;
  return { valid: true };
}

// Helper to record audit log
export function recordAuditLog(
  actorEmail: string,
  actorRole: RoleType,
  action: string,
  resource: string,
  details?: Record<string, any>,
  ipAddress = '164.100.24.89',
  userAgent = 'Bhulekh AI Government Gateway'
) {
  db.auditLogs.unshift({
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    actorEmail,
    actorRole,
    action,
    resource,
    details,
    ipAddress,
    userAgent,
    timestamp: new Date().toISOString(),
  });
}
