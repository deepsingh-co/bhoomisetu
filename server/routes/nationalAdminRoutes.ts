import { Router, Request, Response } from 'express';
import { nationalAdminDb, OfficerRecord, ReportItem, DisasterAlert } from '../nationalAdminDb.js';

export const nationalAdminRouter = Router();

// Helper to calculate total national aggregates
function getNationalAggregates() {
  const totalStates = nationalAdminDb.states.length;
  const totalDistricts = nationalAdminDb.states.reduce((sum, s) => sum + s.totalDistricts, 0);
  const totalParcels = nationalAdminDb.states.reduce((sum, s) => sum + s.totalParcels, 0);
  const verifiedParcels = nationalAdminDb.states.reduce((sum, s) => sum + s.verifiedParcels, 0);
  const pendingParcels = nationalAdminDb.states.reduce((sum, s) => sum + s.pendingParcels, 0);
  const fraudAlerts = nationalAdminDb.states.reduce((sum, s) => sum + s.fraudCasesCount, 0);
  const disputeAlerts = nationalAdminDb.states.reduce((sum, s) => sum + s.activeDisputesCount, 0);
  const satelliteAlerts = nationalAdminDb.states.reduce((sum, s) => sum + s.satelliteAlertsCount, 0);
  const nationalVerificationPct = Number(((verifiedParcels / totalParcels) * 100).toFixed(1));

  return {
    totalStates,
    totalDistricts,
    totalParcels,
    verifiedParcels,
    pendingParcels,
    fraudAlerts,
    disputeAlerts,
    satelliteAlerts,
    nationalVerificationPct,
    activeOfficers: nationalAdminDb.officers.filter((o) => o.isActive).length,
    activeDisasters: nationalAdminDb.disasterAlerts.filter((d) => d.status === 'ACTIVE').length,
  };
}

// 1. National Command Center Executive Summary
const handleNationalSummary = (req: Request, res: Response) => {
  const aggregates = getNationalAggregates();

  res.json({
    success: true,
    portal: 'BhoomiSetu National Command Center',
    department: 'Department of Land Resources (DoLR), MoRD, Government of India',
    sessionTimestamp: new Date().toISOString(),
    aggregates,
    topStates: nationalAdminDb.states.slice(0, 8),
    recentAudits: nationalAdminDb.auditEvents.slice(0, 5),
    activeEmergencyAlerts: nationalAdminDb.disasterAlerts.filter((d) => d.status === 'ACTIVE'),
    data: {
      states: nationalAdminDb.states,
      recentAudits: nationalAdminDb.auditEvents.slice(0, 10),
      disasters: nationalAdminDb.disasterAlerts,
      summary: {
        totalStates: aggregates.totalStates,
        totalParcels: aggregates.totalParcels,
        verifiedParcels: aggregates.verifiedParcels,
        pendingParcels: aggregates.pendingParcels,
        totalFraudCases: aggregates.fraudAlerts,
        totalDisputes: aggregates.disputeAlerts,
        nationalVerificationPercentage: aggregates.nationalVerificationPct,
        activeOfficersCount: aggregates.activeOfficers,
        aiAccuracyAvg: 98.0,
      },
    },
    aiSystemHealth: {
      overallStatus: 'OPTIMAL',
      agentsActive: nationalAdminDb.aiAgents.length,
      averageAccuracy: 98.0,
      totalProcessedToday: nationalAdminDb.aiAgents.reduce((sum, a) => sum + a.requestsProcessedToday, 0),
    },
  });
};

nationalAdminRouter.get('/national-summary', handleNationalSummary);
nationalAdminRouter.get('/dashboard/overview', handleNationalSummary);
nationalAdminRouter.get('/overview', handleNationalSummary);

// 2. States Roster & State Drilldown
nationalAdminRouter.get('/states', (req: Request, res: Response) => {
  const { zone, status, search } = req.query;
  let items = [...nationalAdminDb.states];

  if (zone && zone !== 'ALL') {
    items = items.filter((s) => s.zone === zone);
  }
  if (status && status !== 'ALL') {
    items = items.filter((s) => s.status === status);
  }
  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
  }

  res.json({
    success: true,
    count: items.length,
    states: items,
  });
});

nationalAdminRouter.get('/states/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const state = nationalAdminDb.states.find((s) => s.code.toUpperCase() === code.toUpperCase());

  if (!state) {
    return res.status(404).json({ success: false, message: 'State record not found in national cadastre.' });
  }

  const stateDistricts = nationalAdminDb.districts.filter(
    (d) => d.stateCode.toUpperCase() === state.code.toUpperCase()
  );
  const stateOfficers = nationalAdminDb.officers.filter(
    (o) => o.stateCode.toUpperCase() === state.code.toUpperCase()
  );
  const stateFraudCases = nationalAdminDb.fraudCases.filter(
    (f) => f.stateCode.toUpperCase() === state.code.toUpperCase()
  );
  const stateDisputes = nationalAdminDb.disputeCases.filter(
    (d) => d.stateCode.toUpperCase() === state.code.toUpperCase()
  );
  const stateDisaster = nationalAdminDb.disasterAlerts.filter(
    (d) => d.stateCode.toUpperCase() === state.code.toUpperCase() && d.status === 'ACTIVE'
  );

  res.json({
    success: true,
    state,
    districts: stateDistricts,
    officerCount: stateOfficers.length,
    fraudCases: stateFraudCases,
    disputeCases: stateDisputes,
    disasterAlerts: stateDisaster,
  });
});

// 3. District Collector Command Center Data
nationalAdminRouter.get('/districts', (req: Request, res: Response) => {
  const { stateCode } = req.query;
  let items = [...nationalAdminDb.districts];

  if (stateCode && stateCode !== 'ALL') {
    items = items.filter((d) => d.stateCode.toUpperCase() === String(stateCode).toUpperCase());
  }

  res.json({
    success: true,
    districts: items,
  });
});

nationalAdminRouter.get('/districts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const district =
    nationalAdminDb.districts.find((d) => d.id === id || d.name.toLowerCase() === id.toLowerCase()) ||
    nationalAdminDb.districts[0];

  const officers = nationalAdminDb.officers.filter((o) => o.districtId === district.id);
  const fraudCases = nationalAdminDb.fraudCases.filter((f) => f.districtId === district.id);
  const disputes = nationalAdminDb.disputeCases.filter((d) => d.districtId === district.id);

  res.json({
    success: true,
    district,
    officers,
    fraudCases,
    disputes,
    queues: {
      pendingRecords: district.pendingRecords,
      verificationQueue: district.verificationQueueCount,
      fraudQueue: district.fraudQueueCount,
      inspectionQueue: district.inspectionQueueCount,
      disputeQueue: district.disputeQueueCount,
      mutationQueue: district.mutationQueueCount,
    },
    performance: {
      aiAccuracy: district.aiAccuracyPercentage,
      productivity: district.productivityIndex,
      slaCompliance: 94.8,
    },
  });
});

// 4. Officer Management Center (HRMS)
nationalAdminRouter.get('/officers', (req: Request, res: Response) => {
  const { role, stateCode, search, status } = req.query;
  let officers = [...nationalAdminDb.officers];

  if (role && role !== 'ALL') {
    officers = officers.filter((o) => o.roleType === role);
  }
  if (stateCode && stateCode !== 'ALL') {
    officers = officers.filter((o) => o.stateCode === stateCode);
  }
  if (status && status !== 'ALL') {
    officers = officers.filter((o) => (status === 'ACTIVE' ? o.isActive : !o.isActive));
  }
  if (search) {
    const q = String(search).toLowerCase();
    officers = officers.filter(
      (o) =>
        o.fullName.toLowerCase().includes(q) ||
        o.officialEmail.toLowerCase().includes(q) ||
        o.employeeId.toLowerCase().includes(q) ||
        o.districtName.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    totalOfficers: nationalAdminDb.officers.length,
    activeOfficers: nationalAdminDb.officers.filter((o) => o.isActive).length,
    officers,
  });
});

nationalAdminRouter.post('/officers', (req: Request, res: Response) => {
  const {
    fullName,
    officialEmail,
    phoneNumber,
    roleType,
    department,
    designation,
    stateCode,
    districtId,
    talukaName,
  } = req.body;

  if (!fullName || !officialEmail || !roleType) {
    return res.status(400).json({ success: false, message: 'Missing required employee fields.' });
  }

  const existing = nationalAdminDb.officers.find((o) => o.officialEmail.toLowerCase() === officialEmail.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'An officer with this official government email already exists.' });
  }

  const stateObj = nationalAdminDb.states.find((s) => s.code === stateCode);
  const districtObj = nationalAdminDb.districts.find((d) => d.id === districtId);

  const newOfficer: OfficerRecord = {
    id: `off-${Date.now()}`,
    employeeId: `GOI-IND-${stateCode || 'GEN'}-${Math.floor(100 + Math.random() * 900)}`,
    fullName,
    officialEmail,
    phoneNumber: phoneNumber || '+91 98000 00000',
    roleType,
    department: department || 'Revenue Department',
    designation: designation || 'Government Land Officer',
    stateCode: stateCode || 'MH',
    stateName: stateObj ? stateObj.name : 'Maharashtra',
    districtId: districtId || 'dist-mh-pune',
    districtName: districtObj ? districtObj.name : 'Pune',
    talukaName,
    isActive: true,
    is2faEnforced: true,
    loginStatus: 'OFFLINE',
    activeDevicesCount: 1,
    performanceRating: 5.0,
    totalRecordsProcessed: 0,
    approvalWorkflowStatus: 'APPROVED',
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  nationalAdminDb.officers.unshift(newOfficer);

  // Log in audit ledger
  nationalAdminDb.auditEvents.unshift({
    id: `aud-${Date.now()}`,
    eventTimestamp: new Date().toISOString(),
    actorId: 'off-001',
    actorName: 'Dr. Ramesh Chandra Verma, IAS',
    actorEmail: 'dg.landrecords@nic.in',
    actorRole: 'SUPER_ADMIN',
    actionType: 'ROLE_CHANGE',
    resourceType: 'OFFICER_ROSTER',
    resourceId: newOfficer.employeeId,
    ipAddress: '10.24.112.5 (NIC Gateway)',
    deviceInfo: 'National Command Center Console',
    justificationReason: `Onboarded new officer ${newOfficer.fullName} (${newOfficer.designation}).`,
    cryptographicHash: `hash-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  });

  res.json({
    success: true,
    message: `Officer ${newOfficer.fullName} successfully registered into National Cadre.`,
    officer: newOfficer,
  });
});

nationalAdminRouter.post('/officers/:id/transfer', (req: Request, res: Response) => {
  const { id } = req.params;
  const { targetDistrictId, targetTalukaName, justificationReason } = req.body;

  const officer = nationalAdminDb.officers.find((o) => o.id === id);
  if (!officer) {
    return res.status(404).json({ success: false, message: 'Officer not found.' });
  }

  const targetDistrict = nationalAdminDb.districts.find((d) => d.id === targetDistrictId);
  const oldDistrict = officer.districtName;

  if (targetDistrict) {
    officer.districtId = targetDistrict.id;
    officer.districtName = targetDistrict.name;
    officer.stateCode = targetDistrict.stateCode;
  }
  if (targetTalukaName) {
    officer.talukaName = targetTalukaName;
  }

  nationalAdminDb.auditEvents.unshift({
    id: `aud-${Date.now()}`,
    eventTimestamp: new Date().toISOString(),
    actorId: 'off-001',
    actorName: 'Super Admin Directorate',
    actorEmail: 'dg.landrecords@nic.in',
    actorRole: 'SUPER_ADMIN',
    actionType: 'TRANSFER',
    resourceType: 'OFFICER_TRANSFER',
    resourceId: officer.employeeId,
    ipAddress: '10.24.112.5',
    deviceInfo: 'Command Console',
    justificationReason: justificationReason || `Cadre relocation from ${oldDistrict} to ${officer.districtName}.`,
    cryptographicHash: `transfer-hash-${Date.now()}`,
  });

  res.json({
    success: true,
    message: `Official transfer order executed for ${officer.fullName} to ${officer.districtName}.`,
    officer,
  });
});

nationalAdminRouter.post('/officers/:id/toggle-status', (req: Request, res: Response) => {
  const { id } = req.params;
  const officer = nationalAdminDb.officers.find((o) => o.id === id);
  if (!officer) {
    return res.status(404).json({ success: false, message: 'Officer not found.' });
  }

  officer.isActive = !officer.isActive;
  officer.approvalWorkflowStatus = officer.isActive ? 'APPROVED' : 'SUSPENDED';

  res.json({
    success: true,
    message: `Officer status updated to ${officer.isActive ? 'ACTIVE' : 'DEACTIVATED'}.`,
    officer,
  });
});

// 5. AI Operations Center
nationalAdminRouter.get('/ai-operations', (req: Request, res: Response) => {
  const agents = nationalAdminDb.aiAgents;
  const totalProcessed = agents.reduce((sum, a) => sum + a.requestsProcessedToday, 0);
  const totalErrors = agents.reduce((sum, a) => sum + a.errorCountToday, 0);
  const avgAccuracy = Number((agents.reduce((sum, a) => sum + a.accuracyPercentage, 0) / agents.length).toFixed(1));

  res.json({
    success: true,
    agents,
    summary: {
      totalProcessedToday: totalProcessed,
      totalErrorsToday: totalErrors,
      averageAccuracy: avgAccuracy,
      errorRate: Number(((totalErrors / (totalProcessed || 1)) * 100).toFixed(2)),
      activeAgents: agents.filter((a) => a.status === 'RUNNING').length,
    },
  });
});

nationalAdminRouter.post('/ai-operations/:id/reset', (req: Request, res: Response) => {
  const { id } = req.params;
  const agent = nationalAdminDb.aiAgents.find((a) => a.agentId === id);
  if (!agent) {
    return res.status(404).json({ success: false, message: 'AI Agent not found.' });
  }

  agent.status = 'RUNNING';
  agent.queueLength = 0;
  agent.lastHealthCheck = new Date().toISOString();

  res.json({
    success: true,
    message: `AI Agent ${agent.agentName} daemon process successfully restarted and queue flushed.`,
    agent,
  });
});

// 6. Fraud Intelligence Center
nationalAdminRouter.get('/fraud-intelligence', (req: Request, res: Response) => {
  const { category, severity, status } = req.query;
  let cases = [...nationalAdminDb.fraudCases];

  if (category && category !== 'ALL') {
    cases = cases.filter((c) => c.fraudCategory === category);
  }
  if (severity && severity !== 'ALL') {
    cases = cases.filter((c) => c.severity === severity);
  }
  if (status && status !== 'ALL') {
    cases = cases.filter((c) => c.status === status);
  }

  const categoriesCount = {
    DUPLICATE_RECORD: nationalAdminDb.fraudCases.filter((c) => c.fraudCategory === 'DUPLICATE_RECORD').length,
    EDITED_DOCUMENT: nationalAdminDb.fraudCases.filter((c) => c.fraudCategory === 'EDITED_DOCUMENT').length,
    SEAL_MISMATCH: nationalAdminDb.fraudCases.filter((c) => c.fraudCategory === 'SEAL_MISMATCH').length,
    SIGNATURE_FORGERY: nationalAdminDb.fraudCases.filter((c) => c.fraudCategory === 'SIGNATURE_FORGERY').length,
    AREA_MANIPULATION: nationalAdminDb.fraudCases.filter((c) => c.fraudCategory === 'AREA_MANIPULATION').length,
    BOUNDARY_ENCROACHMENT: nationalAdminDb.fraudCases.filter((c) => c.fraudCategory === 'BOUNDARY_ENCROACHMENT').length,
  };

  res.json({
    success: true,
    totalCases: nationalAdminDb.fraudCases.length,
    activeInvestigations: nationalAdminDb.fraudCases.filter((c) => c.status !== 'RESOLVED' && c.status !== 'DISMISSED').length,
    categoriesCount,
    cases,
  });
});

// 7. Dispute Intelligence Center
nationalAdminRouter.get('/dispute-intelligence', (req: Request, res: Response) => {
  res.json({
    success: true,
    totalDisputes: nationalAdminDb.disputeCases.length,
    highRiskCount: nationalAdminDb.disputeCases.filter((d) => d.riskLevel === 'CRITICAL' || d.riskLevel === 'HIGH').length,
    cases: nationalAdminDb.disputeCases,
  });
});

// 8. Disaster & Emergency Command Dashboard
nationalAdminRouter.get('/emergency-disaster', (req: Request, res: Response) => {
  res.json({
    success: true,
    activeAlertsCount: nationalAdminDb.disasterAlerts.filter((d) => d.status === 'ACTIVE').length,
    alerts: nationalAdminDb.disasterAlerts,
  });
});

nationalAdminRouter.post('/emergency-disaster/alert', (req: Request, res: Response) => {
  const { incidentType, severity, stateCode, affectedDistricts, description, collectorActionRequired } = req.body;

  const stateObj = nationalAdminDb.states.find((s) => s.code === stateCode);

  const newAlert: DisasterAlert = {
    id: `dis-${Date.now()}`,
    alertCode: `NDMA-ISRO-${(incidentType || 'ALERT').substring(0, 3)}-${Date.now().toString().slice(-4)}`,
    incidentType: incidentType || 'FLOOD',
    severity: severity || 'WARNING',
    stateCode: stateCode || 'MH',
    stateName: stateObj ? stateObj.name : 'Maharashtra',
    affectedDistricts: Array.isArray(affectedDistricts) ? affectedDistricts : [affectedDistricts || 'Pune'],
    affectedVillagesCount: Math.floor(10 + Math.random() * 40),
    affectedParcelsCount: Math.floor(500 + Math.random() * 3000),
    isroSatelliteSource: 'ISRO Bhuvan Real-time Disaster InSAR & Sentinel-2',
    description: description || 'High priority environmental threat detected in cadastral zone.',
    collectorActionRequired: collectorActionRequired || 'Alert local taluka officials and halt title transfers in affected buffer.',
    inspectionsDispatched: 0,
    status: 'ACTIVE',
    issuedAt: new Date().toISOString(),
  };

  nationalAdminDb.disasterAlerts.unshift(newAlert);

  res.json({
    success: true,
    message: `National Emergency Alert ${newAlert.alertCode} broadcasted to all state collectors.`,
    alert: newAlert,
  });
});

// 9. Immutable Audit Ledger
nationalAdminRouter.get('/audit-ledger', (req: Request, res: Response) => {
  const { role, action, search } = req.query;
  let events = [...nationalAdminDb.auditEvents];

  if (role && role !== 'ALL') {
    events = events.filter((e) => e.actorRole === role);
  }
  if (action && action !== 'ALL') {
    events = events.filter((e) => e.actionType === action);
  }
  if (search) {
    const q = String(search).toLowerCase();
    events = events.filter(
      (e) =>
        e.actorName.toLowerCase().includes(q) ||
        e.actorEmail.toLowerCase().includes(q) ||
        e.resourceId.toLowerCase().includes(q) ||
        e.justificationReason.toLowerCase().includes(q) ||
        e.ipAddress.includes(q)
    );
  }

  res.json({
    success: true,
    totalEvents: nationalAdminDb.auditEvents.length,
    events,
  });
});

// 10. Reports Center
nationalAdminRouter.get('/reports', (req: Request, res: Response) => {
  res.json({
    success: true,
    reports: nationalAdminDb.reports,
  });
});

nationalAdminRouter.post('/reports/generate', (req: Request, res: Response) => {
  const { title, reportType, scope, fileFormat } = req.body;

  const newReport: ReportItem = {
    id: `rep-${Date.now()}`,
    title: title || 'DILRMP Cadastral Title Governance Summary',
    reportType: reportType || 'NATIONAL_DILRMP',
    scope: scope || 'National Jurisdiction',
    generatedBy: 'Director General of Land Records (Super Admin)',
    generatedAt: new Date().toISOString(),
    fileFormat: fileFormat || 'PDF',
    fileSizeBytes: Math.floor(1500000 + Math.random() * 2500000),
    downloadUrl: `/api/admin/reports/download/rep-${Date.now()}.${(fileFormat || 'PDF').toLowerCase()}`,
    status: 'READY',
  };

  nationalAdminDb.reports.unshift(newReport);

  res.json({
    success: true,
    message: `Report "${newReport.title}" generated successfully and signed with NIC digital seal.`,
    report: newReport,
  });
});

// 11. System Configuration Center
nationalAdminRouter.get('/system-settings', (req: Request, res: Response) => {
  res.json({
    success: true,
    settings: nationalAdminDb.systemSettings,
  });
});

nationalAdminRouter.put('/system-settings', (req: Request, res: Response) => {
  const updates = req.body;
  nationalAdminDb.systemSettings = {
    ...nationalAdminDb.systemSettings,
    ...updates,
  };

  nationalAdminDb.auditEvents.unshift({
    id: `aud-${Date.now()}`,
    eventTimestamp: new Date().toISOString(),
    actorId: 'off-001',
    actorName: 'Super Admin',
    actorEmail: 'dg.landrecords@nic.in',
    actorRole: 'SUPER_ADMIN',
    actionType: 'ROLE_CHANGE',
    resourceType: 'SYSTEM_SETTINGS',
    resourceId: 'GLOBAL_CONFIG',
    ipAddress: '10.24.112.5',
    deviceInfo: 'Admin Console',
    justificationReason: 'Updated national policy thresholds and SLA parameters.',
    cryptographicHash: `sys-hash-${Date.now()}`,
  });

  res.json({
    success: true,
    message: 'System configurations updated and broadcast across all state nodes.',
    settings: nationalAdminDb.systemSettings,
  });
});

// 12. Role Matrix
nationalAdminRouter.get('/role-matrix', (req: Request, res: Response) => {
  res.json({
    success: true,
    roles: nationalAdminDb.roleMatrix,
  });
});

nationalAdminRouter.put('/role-matrix/:roleType', (req: Request, res: Response) => {
  const { roleType } = req.params;
  const updates = req.body;

  const role = nationalAdminDb.roleMatrix.find((r) => r.roleType === roleType);
  if (!role) {
    return res.status(404).json({ success: false, message: 'Role not found.' });
  }

  Object.assign(role, updates);

  res.json({
    success: true,
    message: `RBAC permissions updated for role ${role.roleLabel}.`,
    role,
  });
});

// 13. Data Quality Scorecard
nationalAdminRouter.get('/data-quality', (req: Request, res: Response) => {
  res.json({
    success: true,
    nationalScore: 94.2,
    metrics: {
      missingMetadataCount: 1420,
      lowConfidenceOcrCount: 3810,
      duplicateOwnerFlagCount: 420,
      incompletePolygonsCount: 650,
      pendingTimelineEvents: 1190,
    },
    districtRankings: nationalAdminDb.districts.map((d) => ({
      districtId: d.id,
      name: d.name,
      state: d.stateName,
      dataQualityScore: Number((d.aiAccuracyPercentage * 0.6 + d.productivityIndex * 0.4).toFixed(1)),
      unlinkedRecordsCount: Math.round(d.pendingRecords * 0.08),
    })),
  });
});

// 14. Broadcast Notifications
nationalAdminRouter.post('/notifications/broadcast', (req: Request, res: Response) => {
  const { targetScope, targetRole, notificationType, title, message } = req.body;

  res.json({
    success: true,
    message: `Government broadcast dispatched to ${targetScope || 'National'} (${targetRole || 'All Officers'}).`,
    broadcastId: `BC-${Date.now()}`,
    timestamp: new Date().toISOString(),
  });
});
