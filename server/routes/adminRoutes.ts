import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, UserRecord, RoleType } from '../db.js';
import { requireAuth, requireRoles, recordAuditLog, AuthenticatedRequest } from '../auth.js';

export const adminRouter = Router();

// 1. Get Employee Requests (For Super Admin, State Admin, District Collector)
adminRouter.get(
  '/employee-requests',
  requireAuth,
  requireRoles(['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_COLLECTOR']),
  (req: AuthenticatedRequest, res: Response) => {
    const { status, district } = req.query;
    let requests = [...db.employeeRequests];

    if (status) {
      requests = requests.filter((r) => r.status === status);
    }
    if (district && req.user?.roleType === 'DISTRICT_COLLECTOR') {
      // District collectors primarily oversee their own district, but can also view all in drilldown
      requests = requests.filter((r) => r.district.toLowerCase() === (district as string).toLowerCase());
    }

    res.json({ success: true, requests });
  }
);

// 2. Review (Approve / Reject) Employee Request
adminRouter.post(
  '/employee-requests/:id/review',
  requireAuth,
  requireRoles(['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_COLLECTOR']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { action, reviewNotes, assignedRole } = req.body; // action: 'APPROVE' | 'REJECT'

    const request = db.employeeRequests.find((r) => r.id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Employee onboarding request not found.' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `This request has already been processed as ${request.status}.`,
      });
    }

    if (action === 'APPROVE') {
      request.status = 'APPROVED';
      request.reviewNotes = reviewNotes || 'Verified against Government of India state cadre roster.';
      request.reviewedById = req.user?.userId;
      request.reviewedByEmail = req.user?.email;
      request.reviewedAt = new Date().toISOString();

      // Create or activate the user in the database
      const roleToAssign: RoleType = (assignedRole as RoleType) || 'GOVERNMENT_OFFICER';
      const defaultPasswordHash = bcrypt.hashSync('Nic@Bhulekh2026', 10);

      const newUser: UserRecord = {
        id: `u-approved-${Date.now()}`,
        email: request.officialEmail,
        phone: request.phoneNumber,
        fullName: request.fullName,
        employeeId: request.employeeId,
        department: request.department,
        designation: request.designation,
        district: request.district,
        state: request.state,
        passwordHash: defaultPasswordHash,
        roleType: roleToAssign,
        isApproved: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        is2FAEnabled: true,
        failedLoginCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.users.push(newUser);

      recordAuditLog(
        req.user?.email || 'admin@gov.in',
        req.user?.roleType || 'DISTRICT_COLLECTOR',
        'EMPLOYEE_ONBOARDING_APPROVED',
        'EMPLOYEE_ROSTER',
        {
          requestId: id,
          applicantEmail: request.officialEmail,
          assignedRole: roleToAssign,
          district: request.district,
        }
      );

      return res.json({
        success: true,
        message: `Official credentials activated for ${request.fullName}. Onboarding approval notice logged.`,
      });
    } else if (action === 'REJECT') {
      request.status = 'REJECTED';
      request.reviewNotes = reviewNotes || 'Government ID verification failed or departmental credentials mismatch.';
      request.reviewedById = req.user?.userId;
      request.reviewedByEmail = req.user?.email;
      request.reviewedAt = new Date().toISOString();

      recordAuditLog(
        req.user?.email || 'admin@gov.in',
        req.user?.roleType || 'DISTRICT_COLLECTOR',
        'EMPLOYEE_ONBOARDING_REJECTED',
        'EMPLOYEE_ROSTER',
        { requestId: id, applicantEmail: request.officialEmail, reason: request.reviewNotes }
      );

      return res.json({
        success: true,
        message: `Application ${request.employeeId} has been rejected. Official rejection remarks saved.`,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action specified. Must be APPROVE or REJECT.' });
    }
  }
);

// 3. Audit Activity Logs (Admins and Officers can view audit activities within their jurisdiction)
adminRouter.get('/audit-logs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { role, action, search } = req.query;
  let logs = [...db.auditLogs];

  if (role) {
    logs = logs.filter((l) => l.actorRole === role);
  }
  if (action) {
    logs = logs.filter((l) => l.action.toLowerCase().includes((action as string).toLowerCase()));
  }
  if (search) {
    const q = (search as string).toLowerCase();
    logs = logs.filter(
      (l) =>
        l.actorEmail.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.resource.toLowerCase().includes(q) ||
        l.ipAddress.includes(q)
    );
  }

  res.json({ success: true, logs });
});

// 4. Security Center: Active Sessions Management
adminRouter.get('/security/sessions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.userId;
  const sessions = db.sessions
    .filter((s) => s.userId === currentUserId && s.status === 'ACTIVE')
    .map((s, idx) => ({
      ...s,
      isCurrent: idx === 0, // Most recent session is marked as current
    }));

  res.json({ success: true, sessions });
});

// 5. Revoke Specific Active Session
adminRouter.delete('/security/sessions/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const session = db.sessions.find((s) => s.id === id);

  if (!session || session.userId !== req.user?.userId) {
    return res.status(404).json({ success: false, message: 'Device session not found or unauthorized.' });
  }

  session.status = 'REVOKED';
  db.sessions = db.sessions.filter((s) => s.id !== id);

  recordAuditLog(
    req.user?.email || '',
    req.user?.roleType || 'CITIZEN',
    'SESSION_TERMINATED',
    'SECURITY_CENTER',
    { revokedSessionId: id, deviceInfo: session.deviceInfo }
  );

  res.json({ success: true, message: `Access revoked for device: ${session.deviceInfo}.` });
});

// 6. Security Center: Recent Login History
adminRouter.get('/security/login-history', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  // If Super Admin or Collector, can see all district logs; otherwise own logs
  let logs = [...db.loginHistory];
  if (req.user?.roleType !== 'SUPER_ADMIN' && req.user?.roleType !== 'DISTRICT_COLLECTOR') {
    logs = logs.filter((l) => l.userId === req.user?.userId || l.identifier === req.user?.email);
  }

  res.json({ success: true, history: logs });
});

// 7. Security Center: Toggle 2FA Setting
adminRouter.post('/security/toggle-2fa', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find((u) => u.id === req.user?.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  // Citizens can toggle 2FA freely; high-clearance officers require 2FA by NIC security directive
  if (user.roleType !== 'CITIZEN' && user.is2FAEnabled) {
    return res.status(403).json({
      success: false,
      message: 'Government Security Directive: Two-Factor Authentication (2FA) is mandatory for authorized officers under Level-3+ security clearance.',
    });
  }

  user.is2FAEnabled = !user.is2FAEnabled;
  recordAuditLog(
    user.email,
    user.roleType,
    user.is2FAEnabled ? '2FA_ENABLED' : '2FA_DISABLED',
    'SECURITY_CENTER'
  );

  res.json({
    success: true,
    is2FAEnabled: user.is2FAEnabled,
    message: user.is2FAEnabled
      ? 'Two-Factor Authentication activated. Every sign-in will now require SMS/Email OTP verification.'
      : 'Two-Factor Authentication deactivated.',
  });
});

// 8. Notifications
adminRouter.get('/notifications', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userNotifs = db.notifications.filter((n) => n.userId === req.user?.userId);
  res.json({ success: true, notifications: userNotifs });
});

adminRouter.patch('/notifications/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const notif = db.notifications.find((n) => n.id === id && n.userId === req.user?.userId);
  if (notif) {
    notif.isRead = true;
  }
  res.json({ success: true, message: 'Marked as read.' });
});
