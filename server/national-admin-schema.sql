-- ============================================================================
-- BhoomiSetu — Module 5: National Command Center & Government Administration
-- PostgreSQL + PostGIS Relational Schema
-- Ministry of Rural Development & National Informatics Centre (NIC)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. States / Union Territories Cadastre Registry
CREATE TABLE IF NOT EXISTS states (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capital VARCHAR(100) NOT NULL,
    zone VARCHAR(50) NOT NULL, -- NORTH, SOUTH, EAST, WEST, CENTRAL, NORTH_EAST
    total_districts INT NOT NULL DEFAULT 0,
    total_parcels BIGINT NOT NULL DEFAULT 0,
    verified_parcels BIGINT NOT NULL DEFAULT 0,
    pending_parcels BIGINT NOT NULL DEFAULT 0,
    fraud_cases_count INT NOT NULL DEFAULT 0,
    active_disputes_count INT NOT NULL DEFAULT 0,
    satellite_alerts_count INT NOT NULL DEFAULT 0,
    verification_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    collector_avg_score NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, UNDER_REVIEW, CRITICAL
    boundary_geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Districts Roster & Performance
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(50) PRIMARY KEY,
    state_code VARCHAR(10) REFERENCES states(code) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    headquarters VARCHAR(100) NOT NULL,
    collector_name VARCHAR(150) NOT NULL,
    collector_email VARCHAR(150) NOT NULL,
    collector_phone VARCHAR(20) NOT NULL,
    total_talukas INT NOT NULL DEFAULT 0,
    total_villages INT NOT NULL DEFAULT 0,
    total_parcels INT NOT NULL DEFAULT 0,
    verified_parcels INT NOT NULL DEFAULT 0,
    pending_records INT NOT NULL DEFAULT 0,
    verification_queue_count INT NOT NULL DEFAULT 0,
    fraud_queue_count INT NOT NULL DEFAULT 0,
    inspection_queue_count INT NOT NULL DEFAULT 0,
    dispute_queue_count INT NOT NULL DEFAULT 0,
    mutation_queue_count INT NOT NULL DEFAULT 0,
    ai_accuracy_percentage NUMERIC(5,2) NOT NULL DEFAULT 95.0,
    productivity_index NUMERIC(5,2) NOT NULL DEFAULT 88.0,
    risk_category VARCHAR(20) NOT NULL DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Talukas / Tehsils
CREATE TABLE IF NOT EXISTS talukas (
    id VARCHAR(50) PRIMARY KEY,
    district_id VARCHAR(50) REFERENCES districts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    tehsildar_name VARCHAR(150) NOT NULL,
    total_villages INT NOT NULL DEFAULT 0,
    total_parcels INT NOT NULL DEFAULT 0,
    verified_parcels INT NOT NULL DEFAULT 0,
    pending_mutations INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Villages (Gram Panchayats / Cadastral Units)
CREATE TABLE IF NOT EXISTS villages (
    id VARCHAR(50) PRIMARY KEY,
    taluka_id VARCHAR(50) REFERENCES talukas(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    patwari_name VARCHAR(150) NOT NULL,
    total_parcels INT NOT NULL DEFAULT 0,
    verified_parcels INT NOT NULL DEFAULT 0,
    pending_records INT NOT NULL DEFAULT 0,
    drone_survey_completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Enterprise Government Officers Roster
CREATE TABLE IF NOT EXISTS enterprise_officers (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    official_email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role_type VARCHAR(50) NOT NULL, -- SUPER_ADMIN, STATE_ADMIN, DISTRICT_COLLECTOR, VERIFICATION_OFFICER, SURVEY_OFFICER, AUDITOR, AI_OPS_ADMIN
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    state_code VARCHAR(10) REFERENCES states(code),
    district_id VARCHAR(50) REFERENCES districts(id),
    taluka_id VARCHAR(50) REFERENCES talukas(id),
    assigned_villages TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    is_2fa_enforced BOOLEAN DEFAULT TRUE,
    login_status VARCHAR(20) DEFAULT 'OFFLINE', -- ONLINE, IDLE, OFFLINE
    active_devices_count INT DEFAULT 1,
    performance_rating NUMERIC(3,1) DEFAULT 4.5,
    total_records_processed INT DEFAULT 0,
    approval_workflow_status VARCHAR(20) DEFAULT 'APPROVED',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. AI Agent Operations & Real-time Telemetry
CREATE TABLE IF NOT EXISTS ai_operations (
    agent_id VARCHAR(50) PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- OCR, VERIFICATION, GIS, FRAUD, LEGAL
    model_version VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL, -- RUNNING, IDLE, DEGRADED, FAILED
    accuracy_percentage NUMERIC(5,2) NOT NULL,
    queue_length INT NOT NULL DEFAULT 0,
    avg_response_time_ms INT NOT NULL DEFAULT 0,
    requests_processed_today INT NOT NULL DEFAULT 0,
    error_count_today INT NOT NULL DEFAULT 0,
    suggestions_accepted_count INT NOT NULL DEFAULT 0,
    suggestions_rejected_count INT NOT NULL DEFAULT 0,
    manual_overrides_count INT NOT NULL DEFAULT 0,
    last_health_check TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Fraud Cases & Forensic Intelligence
CREATE TABLE IF NOT EXISTS national_fraud_cases (
    id VARCHAR(50) PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    state_code VARCHAR(10) REFERENCES states(code),
    district_id VARCHAR(50) REFERENCES districts(id),
    village_name VARCHAR(100) NOT NULL,
    survey_number VARCHAR(50) NOT NULL,
    fraud_category VARCHAR(50) NOT NULL, -- DUPLICATE_RECORD, EDITED_DOCUMENT, SEAL_MISMATCH, SIGNATURE_FORGERY, AREA_MANIPULATION, BOUNDARY_ENCROACHMENT
    severity VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    ai_confidence NUMERIC(5,2) NOT NULL,
    status VARCHAR(30) NOT NULL, -- DETECTED, INVESTIGATION_QUEUED, ACB_REFERRED, RESOLVED, DISMISSED
    investigating_officer VARCHAR(150),
    description TEXT NOT NULL,
    evidence_payload JSONB,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 8. Dispute Intelligence & Early Warning System
CREATE TABLE IF NOT EXISTS national_dispute_cases (
    id VARCHAR(50) PRIMARY KEY,
    dispute_number VARCHAR(50) UNIQUE NOT NULL,
    state_code VARCHAR(10) REFERENCES states(code),
    district_id VARCHAR(50) REFERENCES districts(id),
    survey_number VARCHAR(50) NOT NULL,
    dispute_type VARCHAR(50) NOT NULL, -- BOUNDARY_OVERLAP, HEIRSHIP_CONFLICT, COURT_STAY, MORTGAGE_DEFAULT, GOV_LAND_CLAIM
    risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    ai_risk_score NUMERIC(5,2) NOT NULL,
    status VARCHAR(30) NOT NULL, -- PREDICTED, MEDIATION_SCHEDULED, REFERRED_TO_REVENUE_COURT, SETTLED
    parties_involved TEXT[],
    court_case_ref VARCHAR(100),
    summary TEXT NOT NULL,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Emergency Disaster Incidents & Monitoring
CREATE TABLE IF NOT EXISTS emergency_disaster_alerts (
    id VARCHAR(50) PRIMARY KEY,
    alert_code VARCHAR(50) UNIQUE NOT NULL,
    incident_type VARCHAR(50) NOT NULL, -- FLOOD, LANDSLIDE, RIVER_OVERFLOW, FOREST_ENCROACHMENT, CYCLONE, DROUGHT
    severity VARCHAR(20) NOT NULL, -- WATCH, ADVISORY, WARNING, CRITICAL_EMERGENCY
    state_code VARCHAR(10) REFERENCES states(code),
    district_ids TEXT[] NOT NULL,
    affected_villages_count INT NOT NULL,
    affected_parcels_count INT NOT NULL,
    isro_satellite_source VARCHAR(100) NOT NULL, -- Cartosat-3, Sentinel-2, RISAT-1A
    description TEXT NOT NULL,
    collector_action_required TEXT NOT NULL,
    inspections_dispatched INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, CONTAINED, RESOLVED
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Immutable Audit Ledger
CREATE TABLE IF NOT EXISTS national_audit_events (
    id VARCHAR(50) PRIMARY KEY,
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actor_id VARCHAR(50) NOT NULL,
    actor_name VARCHAR(150) NOT NULL,
    actor_email VARCHAR(150) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- LOGIN, APPROVAL, CORRECTION, MUTATION, EXPORT, ROLE_CHANGE, TRANSFER, EMERGENCY_BROADCAST
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    state_code VARCHAR(10),
    district_id VARCHAR(50),
    ip_address VARCHAR(50) NOT NULL,
    device_info VARCHAR(200) NOT NULL,
    justification_reason TEXT,
    cryptographic_hash VARCHAR(128) NOT NULL,
    metadata JSONB
);

-- 11. System Configuration & Policy Rules
CREATE TABLE IF NOT EXISTS system_configurations (
    key VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- AI, SECURITY, VERIFICATION, WORKFLOW, NOTIFICATIONS
    value JSONB NOT NULL,
    description TEXT NOT NULL,
    is_runtime_editable BOOLEAN DEFAULT TRUE,
    last_updated_by VARCHAR(150),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Enterprise Role & Permission Matrix
CREATE TABLE IF NOT EXISTS role_permissions (
    role_type VARCHAR(50) PRIMARY KEY,
    role_label VARCHAR(100) NOT NULL,
    security_clearance_level INT NOT NULL, -- 1 to 7
    can_read BOOLEAN DEFAULT TRUE,
    can_create BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_approve BOOLEAN DEFAULT FALSE,
    can_export BOOLEAN DEFAULT FALSE,
    can_manage_ai BOOLEAN DEFAULT FALSE,
    can_manage_gis BOOLEAN DEFAULT FALSE,
    can_manage_reports BOOLEAN DEFAULT FALSE,
    can_audit_access BOOLEAN DEFAULT FALSE,
    can_emergency_broadcast BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. National Land Use Change Statistics (ISRO Monthly Snapshots)
CREATE TABLE IF NOT EXISTS land_use_statistics (
    id VARCHAR(50) PRIMARY KEY,
    year_month VARCHAR(7) NOT NULL, -- YYYY-MM
    state_code VARCHAR(10) REFERENCES states(code),
    agriculture_sqkm NUMERIC(10,2) NOT NULL,
    residential_sqkm NUMERIC(10,2) NOT NULL,
    commercial_industrial_sqkm NUMERIC(10,2) NOT NULL,
    forest_sqkm NUMERIC(10,2) NOT NULL,
    water_bodies_sqkm NUMERIC(10,2) NOT NULL,
    government_vacant_sqkm NUMERIC(10,2) NOT NULL,
    unauthorized_conversions_detected INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid indexing & queries
CREATE INDEX IF NOT EXISTS idx_districts_state ON districts(state_code);
CREATE INDEX IF NOT EXISTS idx_officers_district ON enterprise_officers(district_id);
CREATE INDEX IF NOT EXISTS idx_fraud_district ON national_fraud_cases(district_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON national_audit_events(event_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON national_audit_events(actor_email);
