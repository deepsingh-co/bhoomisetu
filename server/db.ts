import bcrypt from 'bcryptjs';

export type RoleType =
  | 'SUPER_ADMIN'
  | 'STATE_ADMIN'
  | 'DISTRICT_COLLECTOR'
  | 'GOVERNMENT_OFFICER'
  | 'VERIFICATION_OFFICER'
  | 'SURVEY_OFFICER'
  | 'CITIZEN';

export interface UserRecord {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  district?: string;
  state?: string;
  passwordHash: string;
  roleType: RoleType;
  isApproved: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  is2FAEnabled: boolean;
  lastLoginAt?: string;
  failedLoginCount: number;
  lockoutUntil?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  refreshToken: string;
  tokenHash: string;
  deviceInfo: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  isTrusted: boolean;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  expiresAt: string;
  lastActiveAt: string;
  createdAt: string;
}

export interface LoginHistoryRecord {
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

export interface EmployeeRequestRecord {
  id: string;
  userId?: string;
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewNotes?: string;
  reviewedById?: string;
  reviewedByEmail?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SECURITY' | 'ACCOUNT_APPROVAL' | 'LOGIN_ALERT' | 'VERIFICATION_ASSIGNED' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  userId?: string;
  actorEmail: string;
  actorRole: RoleType;
  action: string;
  resource: string;
  details?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface OtpRecord {
  id: string;
  identifier: string; // email or phone
  code: string;
  purpose: 'CITIZEN_LOGIN' | 'OFFICER_2FA' | 'PASSWORD_RESET';
  expiresAt: number; // timestamp in ms
  attempts: number;
  isConsumed: boolean;
}

// Global state container
class DatabaseStore {
  users: UserRecord[] = [];
  sessions: SessionRecord[] = [];
  loginHistory: LoginHistoryRecord[] = [];
  employeeRequests: EmployeeRequestRecord[] = [];
  notifications: NotificationRecord[] = [];
  auditLogs: AuditLogRecord[] = [];
  otps: OtpRecord[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    const defaultPasswordHash = bcrypt.hashSync('Nic@Bhulekh2026', 10);
    const citizenPasswordHash = bcrypt.hashSync('Citizen@2026', 10);

    this.users = [
      {
        id: 'u-super-admin-01',
        email: 'rajesh.verma@nic.in',
        phone: '9810011223',
        fullName: 'Dr. Rajesh Verma, IAS',
        employeeId: 'NIC-GOI-001',
        department: 'Ministry of Rural Development / NIC',
        designation: 'Mission Director & Super Administrator',
        district: 'New Delhi',
        state: 'Central Jurisdiction',
        passwordHash: defaultPasswordHash,
        roleType: 'SUPER_ADMIN',
        isApproved: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        is2FAEnabled: true,
        lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
        failedLoginCount: 0,
        createdAt: '2025-01-15T10:00:00.000Z',
        updatedAt: '2026-09-20T08:00:00.000Z',
      },
      {
        id: 'u-state-admin-02',
        email: 'ananya.deshmukh@maharashtra.gov.in',
        phone: '9820033445',
        fullName: 'Smt. Ananya Deshmukh, IAS',
        employeeId: 'MH-REV-ADM-102',
        department: 'Revenue and Forest Department',
        designation: 'Principal Secretary (Land Records)',
        district: 'Mumbai Headquarters',
        state: 'Maharashtra',
        passwordHash: defaultPasswordHash,
        roleType: 'STATE_ADMIN',
        isApproved: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        is2FAEnabled: true,
        lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
        failedLoginCount: 0,
        createdAt: '2025-02-10T11:00:00.000Z',
        updatedAt: '2026-09-19T09:30:00.000Z',
      },
      {
        id: 'u-collector-03',
        email: 'vikram.meena@ias.gov.in',
        phone: '9830055667',
        fullName: 'Shri Vikram Meena, IAS',
        employeeId: 'IAS-MH-PUN-084',
        department: 'District Collectorate Pune',
        designation: 'District Magistrate & Collector',
        district: 'Pune',
        state: 'Maharashtra',
        passwordHash: defaultPasswordHash,
        roleType: 'DISTRICT_COLLECTOR',
        isApproved: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        is2FAEnabled: true,
        lastLoginAt: new Date(Date.now() - 14400000).toISOString(),
        failedLoginCount: 0,
        createdAt: '2025-03-01T09:00:00.000Z',
        updatedAt: '2026-09-21T06:15:00.000Z',
      },
      {
        id: 'u-govt-officer-04',
        email: 'suresh.patil@rev.gov.in',
        phone: '9840077889',
        fullName: 'Shri Suresh Patil',
        employeeId: 'MH-TEH-HAV-491',
        department: 'Taluka Revenue Office (Haveli)',
        designation: 'Sub-Divisional Magistrate / Tehsildar',
        district: 'Pune',
        state: 'Maharashtra',
        passwordHash: defaultPasswordHash,
        roleType: 'GOVERNMENT_OFFICER',
        isApproved: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        is2FAEnabled: true,
        lastLoginAt: new Date(Date.now() - 86400000).toISOString(),
        failedLoginCount: 0,
        createdAt: '2025-04-12T14:20:00.000Z',
        updatedAt: '2026-09-20T11:45:00.000Z',
      },
      {
        id: 'u-verification-05',
        email: 'priya.nair@audit.gov.in',
        phone: '9850099001',
        fullName: 'Dr. Priya Nair',
        employeeId: 'AUD-LR-PUN-039',
        department: 'State Land Records Title Audit Wing',
        designation: 'Senior Title & Registry Auditor',
        district: 'Pune',
        state: 'Maharashtra',
        passwordHash: defaultPasswordHash,
        roleType: 'VERIFICATION_OFFICER',
        isApproved: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        is2FAEnabled: true,
        lastLoginAt: new Date(Date.now() - 43200000).toISOString(),
        failedLoginCount: 0,
        createdAt: '2025-05-18T16:00:00.000Z',
        updatedAt: '2026-09-21T05:20:00.000Z',
      },
      {
        id: 'u-survey-06',
        email: 'arun.singh@survey.gov.in',
        phone: '9860012345',
        fullName: 'Er. Arun Kumar Singh',
        employeeId: 'SOI-MH-DRN-201',
        department: 'Survey of India / Drone Survey Cell',
        designation: 'Chief Geospatial & Cadastral Surveyor',
        district: 'Pune',
        state: 'Maharashtra',
        passwordHash: defaultPasswordHash,
        roleType: 'SURVEY_OFFICER',
        isApproved: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        is2FAEnabled: true,
        lastLoginAt: new Date(Date.now() - 172800000).toISOString(),
        failedLoginCount: 0,
        createdAt: '2025-06-05T08:30:00.000Z',
        updatedAt: '2026-09-18T14:10:00.000Z',
      },
      {
        id: 'u-citizen-07',
        email: 'ramesh.kisan@gmail.com',
        phone: '9876543210',
        fullName: 'Rameshwar Kisan Patil',
        employeeId: undefined,
        department: undefined,
        designation: 'Registered Landowner (Khasra No. 142/A)',
        district: 'Pune',
        state: 'Maharashtra',
        passwordHash: citizenPasswordHash,
        roleType: 'CITIZEN',
        isApproved: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        is2FAEnabled: false,
        lastLoginAt: new Date(Date.now() - 21600000).toISOString(),
        failedLoginCount: 0,
        createdAt: '2025-08-20T12:00:00.000Z',
        updatedAt: '2026-09-20T19:00:00.000Z',
      },
    ];

    // Seed pending Government Employee requests
    this.employeeRequests = [
      {
        id: 'req-emp-101',
        fullName: 'Mahesh Gopal Kulkarni',
        employeeId: 'MH-REV-KOT-712',
        department: 'Taluka Land Records Office (Baramati)',
        designation: 'Naib Tehsildar & Circle Officer',
        district: 'Pune',
        state: 'Maharashtra',
        officialEmail: 'mahesh.kulkarni@rev.gov.in',
        phoneNumber: '9422019283',
        idCardDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
        idCardFileName: 'GOV_ID_KULKARNI_MH_REV.pdf',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'req-emp-102',
        fullName: 'Kavita Sundaram Rao',
        employeeId: 'SOI-CAD-NGP-114',
        department: 'Survey of India (Cadastral Wing)',
        designation: 'Assistant Survey Inspector',
        district: 'Nagpur',
        state: 'Maharashtra',
        officialEmail: 'kavita.rao@survey.gov.in',
        phoneNumber: '9845091238',
        idCardDocUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=60',
        idCardFileName: 'ID_CARD_RAO_SOI.pdf',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'req-emp-103',
        fullName: 'Dilip R. Jadhav',
        employeeId: 'MH-PAT-PUN-992',
        department: 'Village Revenue Administrative Office',
        designation: 'Talathi / Patwari',
        district: 'Pune',
        state: 'Maharashtra',
        officialEmail: 'dilip.jadhav@rev.gov.in',
        phoneNumber: '9765431290',
        idCardDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
        idCardFileName: 'GOI_PATWARI_CARD.pdf',
        status: 'APPROVED',
        reviewNotes: 'Verified with Pune District Collectorate Gazette roster.',
        reviewedById: 'u-collector-03',
        reviewedByEmail: 'vikram.meena@ias.gov.in',
        reviewedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      },
    ];

    // Seed initial Login History
    this.loginHistory = [
      {
        id: 'log-001',
        userId: 'u-collector-03',
        identifier: 'vikram.meena@ias.gov.in',
        roleType: 'DISTRICT_COLLECTOR',
        deviceInfo: 'Edge 128 / Windows 11 Enterprise (NIC Protected)',
        browser: 'Microsoft Edge 128',
        ipAddress: '164.100.24.89 (NIC National Gateway)',
        location: 'Pune, Maharashtra, India',
        isSuccess: true,
        timestamp: new Date(Date.now() - 14400000).toISOString(),
      },
      {
        id: 'log-002',
        userId: 'u-super-admin-01',
        identifier: 'rajesh.verma@nic.in',
        roleType: 'SUPER_ADMIN',
        deviceInfo: 'Chrome 129 / macOS Sonoma (MeitY VPN)',
        browser: 'Google Chrome 129',
        ipAddress: '164.100.15.22 (NIC CGO Complex, New Delhi)',
        location: 'New Delhi, Delhi, India',
        isSuccess: true,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'log-003',
        userId: 'u-govt-officer-04',
        identifier: 'suresh.patil@rev.gov.in',
        roleType: 'GOVERNMENT_OFFICER',
        deviceInfo: 'Firefox 130 / Ubuntu LTS 24.04 (Gov Intranet)',
        browser: 'Mozilla Firefox 130',
        ipAddress: '10.128.44.12 (State WAN - SWAN MH)',
        location: 'Haveli, Pune, India',
        isSuccess: true,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'log-004',
        userId: undefined,
        identifier: 'unknown.intruder@temp-mail.org',
        roleType: undefined,
        deviceInfo: 'Chrome 115 / Linux x86_64',
        browser: 'Unknown Chrome Automated',
        ipAddress: '185.220.101.5 (Tor Exit Node Flagged)',
        location: 'Frankfurt, Germany',
        isSuccess: false,
        failureReason: 'Invalid Government Domain Credentials & Rate Limit Exceeded',
        timestamp: new Date(Date.now() - 54000000).toISOString(),
      },
      {
        id: 'log-005',
        userId: 'u-citizen-07',
        identifier: '9876543210',
        roleType: 'CITIZEN',
        deviceInfo: 'Chrome Mobile 128 / Android 14 (Aadhaar OTP Validated)',
        browser: 'Chrome Mobile 128',
        ipAddress: '157.34.120.91 (Jio Telecom Mobile Network)',
        location: 'Pune, Maharashtra, India',
        isSuccess: true,
        timestamp: new Date(Date.now() - 21600000).toISOString(),
      },
    ];

    // Seed Initial Active Sessions
    this.sessions = [
      {
        id: 'sess-01',
        userId: 'u-collector-03',
        refreshToken: 'rt-collector-sample-token-pune',
        tokenHash: 'th-collector-03',
        deviceInfo: 'Collectorate Desktop (Dell OptiPlex) / Windows 11 Enterprise',
        browser: 'Microsoft Edge 128',
        os: 'Windows 11',
        ipAddress: '164.100.24.89 (NIC Pune)',
        location: 'District Collectorate, Pune',
        isTrusted: true,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
        lastActiveAt: new Date(Date.now() - 14400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'sess-02',
        userId: 'u-collector-03',
        refreshToken: 'rt-collector-ipad-mobile',
        tokenHash: 'th-collector-04',
        deviceInfo: 'Apple iPad Pro (Govt Issued Official Tablet)',
        browser: 'Mobile Safari 18',
        os: 'iPadOS 18',
        ipAddress: '164.100.24.95 (NIC Wireless SSL)',
        location: 'Pune Collectorate Camp Office',
        isTrusted: true,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 86400000 * 4).toISOString(),
        lastActiveAt: new Date(Date.now() - 45000000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
    ];

    // Seed System Notifications
    this.notifications = [
      {
        id: 'notif-001',
        userId: 'u-collector-03',
        title: 'New Employee Department Access Application',
        message: 'Mahesh Gopal Kulkarni (Employee ID: MH-REV-KOT-712) has applied for Naib Tehsildar role in Pune District.',
        type: 'ACCOUNT_APPROVAL',
        isRead: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'notif-002',
        userId: 'u-collector-03',
        title: 'Security Audit: High Privileged Login',
        message: 'Successful 2FA Authenticated Session initiated from NIC Gateway IP 164.100.24.89.',
        type: 'LOGIN_ALERT',
        isRead: false,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
      {
        id: 'notif-003',
        userId: 'u-super-admin-01',
        title: 'National Land Records Sync Completed',
        message: 'Central DILRMP RoR sync updated for 18,402 cadastral parcels across Maharashtra and MP.',
        type: 'SYSTEM',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    // Seed Audit Logs
    this.auditLogs = [
      {
        id: 'audit-001',
        userId: 'u-super-admin-01',
        actorEmail: 'rajesh.verma@nic.in',
        actorRole: 'SUPER_ADMIN',
        action: 'POLICY_UPDATE',
        resource: 'AUTH_POLICIES',
        details: { policy: 'Enforce 2FA for all Level-3+ Officers via NIC SMS / Gov OTP' },
        ipAddress: '164.100.15.22',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'audit-002',
        userId: 'u-collector-03',
        actorEmail: 'vikram.meena@ias.gov.in',
        actorRole: 'DISTRICT_COLLECTOR',
        action: 'EMPLOYEE_APPROVED',
        resource: 'GOV_EMPLOYEE_REQUEST',
        details: { applicantEmail: 'dilip.jadhav@rev.gov.in', role: 'GOVERNMENT_OFFICER' },
        ipAddress: '164.100.24.89',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: 'audit-003',
        userId: 'u-collector-03',
        actorEmail: 'vikram.meena@ias.gov.in',
        actorRole: 'DISTRICT_COLLECTOR',
        action: '2FA_SESSION_VERIFIED',
        resource: 'AUTHENTICATION_GATEWAY',
        details: { method: 'NIC_SMS_OTP_GATEWAY', otpChannel: 'SMS-GOV-AUTH' },
        ipAddress: '164.100.24.89',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
      },
    ];
  }
}

export const db = new DatabaseStore();
