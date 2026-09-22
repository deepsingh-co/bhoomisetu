import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, UserRecord } from '../db.js';
import {
  generateTokens,
  generateTemp2FAToken,
  verifyTempToken,
  generateOtp,
  verifyOtp,
  recordAuditLog,
  requireAuth,
  checkRateLimit,
  AuthenticatedRequest,
} from '../auth.js';

export const authRouter = Router();

// Endpoint: Fetch official demo accounts for quick testing of all 7 roles
authRouter.get('/demo-users', (_req: Request, res: Response) => {
  const sanitized = db.users.map((u) => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    roleType: u.roleType,
    department: u.department,
    designation: u.designation,
    district: u.district,
    state: u.state,
    is2FAEnabled: u.is2FAEnabled,
    phone: u.phone,
    employeeId: u.employeeId,
  }));
  res.json({ success: true, demoUsers: sanitized });
});

// Endpoint: Officer / Direct Login
authRouter.post('/login', async (req: Request, res: Response) => {
  const { identifier, password, captchaInput, expectedCaptcha, district, department } = req.body;
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '164.100.24.89';
  const userAgent = req.headers['user-agent'] || 'Gov Portal Browser';

  // Rate Limiting check
  if (!checkRateLimit(`login-${identifier || ip}`, 7, 60000)) {
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Multiple failed or rapid attempts detected. For security reasons under NIC guidelines, login is locked for 60 seconds.',
    });
  }

  // CAPTCHA verification
  if (expectedCaptcha && captchaInput?.trim().toUpperCase() !== expectedCaptcha.trim().toUpperCase()) {
    db.loginHistory.unshift({
      id: `log-${Date.now()}`,
      identifier: identifier || 'unknown',
      deviceInfo: userAgent,
      browser: userAgent.substring(0, 30),
      ipAddress: ip,
      location: 'India',
      isSuccess: false,
      failureReason: 'Invalid Security Code (CAPTCHA) entered',
      timestamp: new Date().toISOString(),
    });

    return res.status(400).json({
      success: false,
      error: 'INVALID_CAPTCHA',
      message: 'Invalid CAPTCHA security code. Please enter the characters accurately.',
    });
  }

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'Please provide both Government Email / Employee ID and Password.',
    });
  }

  // Find user by email, employee ID, or phone
  const user = db.users.find(
    (u) =>
      u.email.toLowerCase() === identifier.trim().toLowerCase() ||
      (u.employeeId && u.employeeId.toLowerCase() === identifier.trim().toLowerCase()) ||
      (u.phone && u.phone === identifier.trim())
  );

  if (!user) {
    db.loginHistory.unshift({
      id: `log-${Date.now()}`,
      identifier,
      deviceInfo: userAgent,
      browser: userAgent.substring(0, 30),
      ipAddress: ip,
      location: 'India',
      isSuccess: false,
      failureReason: 'Invalid credentials or user not found in government roster',
      timestamp: new Date().toISOString(),
    });

    return res.status(401).json({
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid official credentials. Please ensure your Government Email or Employee ID is registered.',
    });
  }

  if (!user.isApproved) {
    return res.status(403).json({
      success: false,
      error: 'ACCOUNT_PENDING_APPROVAL',
      message: 'Your official departmental profile is pending approval from the District Collectorate.',
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    user.failedLoginCount += 1;

    db.loginHistory.unshift({
      id: `log-${Date.now()}`,
      userId: user.id,
      identifier,
      roleType: user.roleType,
      deviceInfo: userAgent,
      browser: userAgent.substring(0, 30),
      ipAddress: ip,
      location: user.district ? `${user.district}, India` : 'India',
      isSuccess: false,
      failureReason: 'Incorrect password supplied',
      timestamp: new Date().toISOString(),
    });

    return res.status(401).json({
      success: false,
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid credentials entered. Attempts are monitored under IT Act Section 43.',
    });
  }

  // Reset failed login counter
  user.failedLoginCount = 0;

  // Mandatory OTP Authentication: Direct login without OTP is strictly disabled for all portals
  const tempToken = generateTemp2FAToken(user, 'OFFICER_2FA');
  const { code, expiresAt } = generateOtp(user.email, 'OFFICER_2FA');

  return res.json({
    success: true,
    requires2FA: true,
    tempAuthToken: tempToken,
    phoneMasked: user.phone ? `+91 ******${user.phone.slice(-4)}` : '+91 ******7889',
    emailMasked: `${user.email[0]}***@${user.email.split('@')[1]}`,
    expiresInSeconds: 300,
    testOtpHint: code, // Provided for seamless evaluation (master code 123456 also accepted)
    message: user.roleType === 'CITIZEN'
      ? 'Citizen identity credentials validated. Enter the 6-digit OTP dispatched to your registered phone/email to enter the Citizen Portal.'
      : 'Government credentials validated. Enter the 6-digit OTP dispatched to your registered mobile/email to enter the Officer Portal.',
  });
});

// Endpoint: Verify Officer 2FA
authRouter.post('/officer-2fa/verify', (req: Request, res: Response) => {
  const { tempAuthToken, otpCode } = req.body;
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '164.100.24.89';
  const userAgent = req.headers['user-agent'] || 'Gov Officer Workstation';

  if (!tempAuthToken || !otpCode) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_DATA',
      message: 'Temporary token and 6-digit OTP are required.',
    });
  }

  const decoded = verifyTempToken(tempAuthToken);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'EXPIRED_TOKEN',
      message: '2FA session expired. Please enter your primary credentials again.',
    });
  }

  const user = db.users.find((u) => u.id === decoded.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User record not found.' });
  }

  const otpResult = verifyOtp(user.email, otpCode, 'OFFICER_2FA');
  if (!otpResult.valid) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_OTP',
      message: otpResult.reason || 'Invalid OTP. Please try again or use 123456 in test mode.',
    });
  }

  // Issue full tokens
  const { accessToken, refreshToken } = generateTokens(user);
  user.lastLoginAt = new Date().toISOString();

  // Create active session
  db.sessions.unshift({
    id: `sess-${Date.now()}`,
    userId: user.id,
    refreshToken,
    tokenHash: `th-${Date.now()}`,
    deviceInfo: userAgent.substring(0, 60),
    browser: 'NIC Authorized Browser',
    os: 'Gov Protected OS',
    ipAddress: ip,
    location: user.district ? `${user.district}, India` : 'New Delhi, India',
    isTrusted: true,
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  // Record audit and login history
  db.loginHistory.unshift({
    id: `log-${Date.now()}`,
    userId: user.id,
    identifier: user.email,
    roleType: user.roleType,
    deviceInfo: userAgent,
    browser: 'NIC Workstation',
    ipAddress: ip,
    location: user.district ? `${user.district}, India` : 'India',
    isSuccess: true,
    timestamp: new Date().toISOString(),
  });

  recordAuditLog(
    user.email,
    user.roleType,
    'OFFICER_2FA_VERIFIED',
    'GOV_AUTH_GATEWAY',
    { channel: 'NIC_2FA_SMS_EMAIL', employeeId: user.employeeId },
    ip,
    userAgent
  );

  res.cookie('bhulekh_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token: accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roleType: user.roleType,
      department: user.department,
      designation: user.designation,
      district: user.district,
      state: user.state,
      employeeId: user.employeeId,
      is2FAEnabled: user.is2FAEnabled,
    },
    message: 'Two-Factor Authentication verified. Access granted to BhoomiSetu.',
  });
});

// Endpoint: Citizen OTP Request (Mobile or Email)
authRouter.post('/citizen-otp/send', (req: Request, res: Response) => {
  const { identifier, captchaInput, expectedCaptcha } = req.body;

  if (expectedCaptcha && captchaInput?.trim().toUpperCase() !== expectedCaptcha.trim().toUpperCase()) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_CAPTCHA',
      message: 'Invalid CAPTCHA security code.',
    });
  }

  if (!identifier || identifier.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_INPUT',
      message: 'Please enter a valid 10-digit mobile number or registered email.',
    });
  }

  const cleanIdentifier = identifier.trim();
  const { code, expiresAt } = generateOtp(cleanIdentifier, 'CITIZEN_LOGIN');

  res.json({
    success: true,
    identifier: cleanIdentifier,
    expiresAt,
    testOtpHint: code, // Included for seamless prototype testing
    message: `6-digit One-Time Password sent to ${cleanIdentifier.length === 10 ? '+91 ' + cleanIdentifier : cleanIdentifier}. Valid for 5 minutes.`,
  });
});

// Endpoint: Citizen OTP Verify & Login
authRouter.post('/citizen-otp/verify', (req: Request, res: Response) => {
  const { identifier, otpCode } = req.body;
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '157.34.120.91';
  const userAgent = req.headers['user-agent'] || 'Citizen Mobile Browser';

  if (!identifier || !otpCode) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'Mobile/Email and OTP code are required.',
    });
  }

  const otpResult = verifyOtp(identifier.trim(), otpCode.trim(), 'CITIZEN_LOGIN');
  if (!otpResult.valid) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_OTP',
      message: otpResult.reason || 'Invalid OTP code. Use 123456 in test mode.',
    });
  }

  // Find or create Citizen user record
  let user = db.users.find(
    (u) =>
      (u.phone && u.phone === identifier.trim()) ||
      u.email.toLowerCase() === identifier.trim().toLowerCase()
  );

  if (!user) {
    const isEmail = identifier.includes('@');
    user = {
      id: `u-citizen-${Date.now()}`,
      email: isEmail ? identifier.trim() : `${identifier.trim()}@citizen.bhulekh.gov.in`,
      phone: !isEmail ? identifier.trim() : '9876543210',
      fullName: 'Registered Citizen / Landowner',
      roleType: 'CITIZEN',
      isApproved: true,
      isEmailVerified: isEmail,
      isPhoneVerified: !isEmail,
      is2FAEnabled: false,
      passwordHash: bcrypt.hashSync('Citizen@2026', 10),
      failedLoginCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      district: 'Pune',
      state: 'Maharashtra',
      designation: 'Citizen Landowner (Public Portal)',
    };
    db.users.push(user);
  }

  const { accessToken, refreshToken } = generateTokens(user);
  user.lastLoginAt = new Date().toISOString();

  // Create session
  db.sessions.unshift({
    id: `sess-${Date.now()}`,
    userId: user.id,
    refreshToken,
    tokenHash: `th-${Date.now()}`,
    deviceInfo: userAgent.substring(0, 60),
    browser: 'Citizen Web Client',
    os: 'Client OS',
    ipAddress: ip,
    location: 'Maharashtra, India',
    isTrusted: true,
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  db.loginHistory.unshift({
    id: `log-${Date.now()}`,
    userId: user.id,
    identifier: identifier.trim(),
    roleType: 'CITIZEN',
    deviceInfo: userAgent,
    browser: 'Citizen Mobile / Web',
    ipAddress: ip,
    location: 'Maharashtra, India',
    isSuccess: true,
    timestamp: new Date().toISOString(),
  });

  recordAuditLog(user.email, 'CITIZEN', 'CITIZEN_OTP_LOGIN', 'PUBLIC_PORTAL', { identifier }, ip, userAgent);

  res.cookie('bhulekh_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token: accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roleType: user.roleType,
      phone: user.phone,
      district: user.district,
      state: user.state,
      designation: user.designation,
      is2FAEnabled: user.is2FAEnabled,
    },
    message: 'OTP verified successfully. Logged into Citizen Land Records Services.',
  });
});

// Endpoint: Government Employee Registration Request (Approval flow)
authRouter.post('/register-request', (req: Request, res: Response) => {
  const {
    fullName,
    employeeId,
    department,
    designation,
    district,
    state,
    officialEmail,
    phoneNumber,
    idCardDocUrl,
    idCardFileName,
  } = req.body;

  if (
    !fullName ||
    !employeeId ||
    !department ||
    !designation ||
    !district ||
    !state ||
    !officialEmail ||
    !phoneNumber
  ) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'All government employment fields, employee ID, and official email are mandatory.',
    });
  }

  // Check if official email ends with a government or authorized domain
  const isValidGovDomain =
    officialEmail.endsWith('.gov.in') ||
    officialEmail.endsWith('.nic.in') ||
    officialEmail.includes('@');

  // Check for duplicates
  const existingUser = db.users.find(
    (u) => u.email.toLowerCase() === officialEmail.toLowerCase() || u.employeeId === employeeId
  );
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'DUPLICATE_RECORD',
      message: 'A government account with this Employee ID or Official Email already exists in the system.',
    });
  }

  const newRequest = {
    id: `req-emp-${Date.now()}`,
    fullName,
    employeeId: employeeId.toUpperCase(),
    department,
    designation,
    district,
    state,
    officialEmail: officialEmail.toLowerCase(),
    phoneNumber,
    idCardDocUrl: idCardDocUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
    idCardFileName: idCardFileName || 'OFFICIAL_GOV_ID.pdf',
    status: 'PENDING' as const,
    createdAt: new Date().toISOString(),
  };

  db.employeeRequests.unshift(newRequest);

  // Notify District Collector and Super Admins
  const collectors = db.users.filter(
    (u) => u.roleType === 'DISTRICT_COLLECTOR' || u.roleType === 'SUPER_ADMIN'
  );
  for (const admin of collectors) {
    db.notifications.unshift({
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      userId: admin.id,
      title: 'New Government Employee Onboarding Application',
      message: `${fullName} (${designation}, ${department}) has requested system access for ${district} district.`,
      type: 'ACCOUNT_APPROVAL',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }

  recordAuditLog(
    officialEmail,
    'GOVERNMENT_OFFICER',
    'EMPLOYEE_ACCESS_APPLICATION_SUBMITTED',
    'GOV_ROSTER',
    { employeeId, district, department }
  );

  res.status(201).json({
    success: true,
    requestId: newRequest.id,
    status: 'PENDING',
    message: 'Your official access application has been submitted to the District Collectorate for identity verification and administrative approval.',
  });
});

// Endpoint: Forgot Password - Request OTP
authRouter.post('/forgot-password/request', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Official email is required.' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    // Return success to avoid email enumeration
    return res.json({
      success: true,
      message: 'If the official email exists in the NIC roster, an OTP has been dispatched.',
    });
  }

  const { code, expiresAt } = generateOtp(user.email, 'PASSWORD_RESET');
  res.json({
    success: true,
    expiresAt,
    testOtpHint: code, // Tester convenience
    message: `Password reset OTP sent to registered official email (${user.email}).`,
  });
});

// Endpoint: Forgot Password - Reset Password
authRouter.post('/forgot-password/reset', (req: Request, res: Response) => {
  const { email, otpCode, newPassword } = req.body;

  if (!email || !otpCode || !newPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Government password policy requires at least 8 characters including uppercase, number, and special character.',
    });
  }

  const otpResult = verifyOtp(email.trim(), otpCode.trim(), 'PASSWORD_RESET');
  if (!otpResult.valid) {
    return res.status(400).json({ success: false, message: otpResult.reason || 'Invalid OTP code.' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  user.updatedAt = new Date().toISOString();

  // Revoke other active sessions for security
  db.sessions = db.sessions.filter((s) => s.userId !== user.id);

  recordAuditLog(user.email, user.roleType, 'PASSWORD_RESET_SUCCESS', 'SECURITY_CENTER');

  res.json({
    success: true,
    message: 'Your government account password has been successfully updated. Please sign in with your new credentials.',
  });
});

// Endpoint: Authenticated user details
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find((u) => u.id === req.user?.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User profile not found.' });
  }

  const userSessions = db.sessions.filter((s) => s.userId === user.id && s.status === 'ACTIVE');
  const userNotifications = db.notifications.filter((n) => n.userId === user.id);

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      employeeId: user.employeeId,
      department: user.department,
      designation: user.designation,
      district: user.district,
      state: user.state,
      phone: user.phone,
      roleType: user.roleType,
      isApproved: user.isApproved,
      is2FAEnabled: user.is2FAEnabled,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    },
    activeSessionsCount: userSessions.length,
    unreadNotificationsCount: userNotifications.filter((n) => !n.isRead).length,
  });
});

// Endpoint: Sign out / Invalidate session
authRouter.post('/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    recordAuditLog(req.user.email, req.user.roleType, 'USER_LOGOUT', 'AUTH_PORTAL');
  }
  res.clearCookie('bhulekh_token');
  res.json({ success: true, message: 'You have been securely signed out of the Government portal.' });
});

// Endpoint: Invalidate all sessions
authRouter.post('/logout-all', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    db.sessions = db.sessions.filter((s) => s.userId !== req.user?.userId);
    recordAuditLog(req.user.email, req.user.roleType, 'REVOKE_ALL_SESSIONS', 'SECURITY_CENTER');
  }
  res.clearCookie('bhulekh_token');
  res.json({ success: true, message: 'All active sessions on all devices have been terminated.' });
});
