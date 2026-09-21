export type RoleType =
  | 'SUPER_ADMIN'
  | 'STATE_ADMIN'
  | 'DISTRICT_COLLECTOR'
  | 'GOVERNMENT_OFFICER'
  | 'VERIFICATION_OFFICER'
  | 'SURVEY_OFFICER'
  | 'CITIZEN';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  fullName: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  district?: string;
  state?: string;
  roleType: RoleType;
  isApproved: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  is2FAEnabled: boolean;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  deviceInfo?: string;
  deviceName?: string;
  userAgent?: string;
  browser?: string;
  os?: string;
  ipAddress: string;
  location: string;
  isTrusted?: boolean;
  isCurrent?: boolean;
  lastActiveAt?: string;
  createdAt: string;
}

export type SessionItem = ActiveSession;

export interface LoginHistoryEntry {
  id: string;
  userId?: string;
  identifier: string;
  roleType?: RoleType;
  deviceInfo: string;
  browser: string;
  ipAddress: string;
  location: string;
  isSuccess: boolean;
  failureReason?: string;
  timestamp: string;
}

export interface GovernmentEmployeeRequestItem {
  id: string;
  fullName: string;
  employeeId: string;
  department: string;
  designation: string;
  district: string;
  state: string;
  officialEmail: string;
  phoneNumber: string;
  idCardDocUrl: string;
  idCardFileName: string;
  status: RequestStatus;
  reviewNotes?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedByEmail?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SECURITY' | 'ACCOUNT_APPROVAL' | 'LOGIN_ALERT' | 'VERIFICATION_ASSIGNED' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorEmail: string;
  actorRole: RoleType | string;
  actionType?: string;
  action?: string;
  status?: string;
  resource?: string;
  details?: any;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
}

export type AuditLogItem = AuditLogEntry;

export interface SecurityStats {
  twoFactorEnabled: boolean;
  activeSessionsCount: number;
  trustedDevicesCount: number;
  suspiciousActivityCount: number;
  lastPasswordChanged?: string;
  failedLoginAttemptsCount: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
