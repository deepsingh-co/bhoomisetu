-- Bhulekh AI v3 - National Land Records Intelligence Platform
-- PostgreSQL Enterprise Database Schema (NIC / MeitY Architecture Standard)
-- Compliant with Digital India Land Records Modernization Programme (DILRMP)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Table: land_records
CREATE TABLE IF NOT EXISTS land_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_uid VARCHAR(64) UNIQUE NOT NULL, -- e.g. IN-MH-PUN-HAV-2024-00142-A
    survey_number VARCHAR(64) NOT NULL,
    khasra_number VARCHAR(64) NOT NULL,
    khata_number VARCHAR(64) NOT NULL,
    village VARCHAR(128) NOT NULL,
    taluka VARCHAR(128) NOT NULL,
    district VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL DEFAULT 'Maharashtra',
    land_area_hectares NUMERIC(10, 4) NOT NULL,
    land_area_sqft NUMERIC(14, 2) NOT NULL,
    land_type VARCHAR(64) NOT NULL, -- Irrigated Agricultural, Non-Agricultural, Forest, Commercial
    revenue_assessment_inr NUMERIC(10, 2) DEFAULT 0.00,
    current_owner_name VARCHAR(255) NOT NULL,
    father_husband_name VARCHAR(255),
    owner_aadhaar_hash VARCHAR(128),
    co_sharers_count INT DEFAULT 1,
    mutation_number VARCHAR(64),
    registration_number VARCHAR(64),
    document_year INT NOT NULL,
    verification_status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED, FLAGGED
    trust_index NUMERIC(5, 2) DEFAULT 85.00,
    dispute_risk_level VARCHAR(32) DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, CRITICAL
    version INT DEFAULT 1,
    is_current BOOLEAN DEFAULT TRUE,
    created_by_officer_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. Table: parcel_dna
CREATE TABLE IF NOT EXISTS parcel_dna (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES land_records(id) ON DELETE CASCADE,
    parcel_uid VARCHAR(64) NOT NULL,
    dna_hash VARCHAR(128) UNIQUE NOT NULL, -- SHA-384 cryptographic integrity fingerprint
    geo_polygon JSONB NOT NULL,
    centroid_lat NUMERIC(10, 7) NOT NULL,
    centroid_lng NUMERIC(10, 7) NOT NULL,
    elevation_meters NUMERIC(7, 2),
    soil_classification VARCHAR(64),
    encumbrance_status VARCHAR(64) DEFAULT 'UNENCUMBERED', -- UNENCUMBERED, BANK_MORTGAGE, COURT_STAY, GOV_ACQUISITION
    total_mutations_count INT DEFAULT 0,
    total_inspections_count INT DEFAULT 0,
    risk_score INT DEFAULT 15, -- 0-100
    last_drone_survey_date DATE,
    version INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 3. Table: documents
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES land_records(id) ON DELETE CASCADE,
    document_type VARCHAR(64) NOT NULL, -- 7/12_ROR, 8A_HOLDING, SALE_DEED, MUTATION_ENTRY, KHASRA_MAP
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(64) NOT NULL,
    file_sha256 VARCHAR(64) NOT NULL,
    source VARCHAR(64) DEFAULT 'OFFICER_PORTAL', -- OFFICER_PORTAL, MOBILE_SCANNER, DIGILOCKER, REVENUE_API
    ocr_status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    ocr_confidence NUMERIC(5, 2) DEFAULT 0.00,
    uploaded_by_id UUID,
    uploaded_by_name VARCHAR(255),
    version INT DEFAULT 1,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 4. Table: ocr_fields
CREATE TABLE IF NOT EXISTS ocr_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    parcel_id UUID REFERENCES land_records(id),
    field_name VARCHAR(64) NOT NULL,
    field_label VARCHAR(128) NOT NULL,
    extracted_value TEXT NOT NULL,
    verified_value TEXT,
    confidence_score NUMERIC(5, 2) NOT NULL,
    bounding_box JSONB NOT NULL, -- { x, y, width, height, page }
    raw_ocr_text TEXT,
    ai_engine VARCHAR(64) DEFAULT 'PaddleOCR + TrOCR Devnagari',
    ai_explanation TEXT,
    is_handwritten BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    verification_state VARCHAR(32) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, MANUALLY_EDITED
    edited_by_officer_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table: verification_history
CREATE TABLE IF NOT EXISTS verification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES land_records(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id),
    officer_id UUID NOT NULL,
    officer_name VARCHAR(255) NOT NULL,
    officer_designation VARCHAR(128) NOT NULL,
    previous_status VARCHAR(32),
    new_status VARCHAR(32) NOT NULL,
    verification_type VARCHAR(64) NOT NULL, -- DOCUMENTARY, SATELLITE_GIS, ON_SITE_INSPECTION, BIOMETRIC
    remarks TEXT,
    digital_signature_hash VARCHAR(128),
    ip_address VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table: timeline_events
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES land_records(id) ON DELETE CASCADE,
    event_year INT NOT NULL,
    event_date DATE NOT NULL,
    event_type VARCHAR(64) NOT NULL, -- OWNERSHIP_CHANGE, MUTATION_APPROVAL, SUBDIVISION, MERGE, GOV_ACQUISITION, COURT_DISPUTE, SATELLITE_SNAPSHOT
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    parties_involved JSONB,
    source_document_ref VARCHAR(128),
    mutation_number VARCHAR(64),
    area_affected_hectares NUMERIC(10, 4),
    satellite_thumbnail_url TEXT,
    is_disputed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table: fraud_analysis
CREATE TABLE IF NOT EXISTS fraud_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES land_records(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id),
    fraud_fingerprint_score INT NOT NULL, -- 0-100 (0 = Clean, 100 = Definitive Tampering)
    risk_classification VARCHAR(32) NOT NULL, -- CLEAN, SUSPICIOUS, HIGH_RISK, FRAUD_CONFIRMED
    edited_pdf_detected BOOLEAN DEFAULT FALSE,
    metadata_inconsistency BOOLEAN DEFAULT FALSE,
    duplicate_hash_detected BOOLEAN DEFAULT FALSE,
    seal_mismatch_detected BOOLEAN DEFAULT FALSE,
    signature_anomaly_detected BOOLEAN DEFAULT FALSE,
    image_manipulation_detected BOOLEAN DEFAULT FALSE,
    ocr_overwrite_detected BOOLEAN DEFAULT FALSE,
    suspicious_regions JSONB, -- Array of [{ x, y, width, height, reason, severity }]
    investigation_summary TEXT NOT NULL,
    recommended_action VARCHAR(64),
    status VARCHAR(32) DEFAULT 'QUEUED_FOR_REVIEW', -- QUEUED_FOR_REVIEW, CLEARED_BY_OFFICER, REFERRED_TO_ACB
    reviewed_by_id UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Table: dispute_scores
CREATE TABLE IF NOT EXISTS dispute_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES land_records(id) ON DELETE CASCADE,
    dispute_risk_index INT NOT NULL, -- 0-100
    risk_category VARCHAR(32) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    ownership_volatility_score NUMERIC(5, 2) DEFAULT 0,
    area_discrepancy_score NUMERIC(5, 2) DEFAULT 0,
    gis_overlap_score NUMERIC(5, 2) DEFAULT 0,
    pending_litigation_flag BOOLEAN DEFAULT FALSE,
    court_case_numbers TEXT[],
    primary_reasons TEXT[] NOT NULL,
    documentary_evidence JSONB,
    suggested_actions TEXT[] NOT NULL,
    collector_alerted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Table: gis_parcels
CREATE TABLE IF NOT EXISTS gis_parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES land_records(id) ON DELETE CASCADE,
    cadastral_boundary_geojson JSONB NOT NULL,
    satellite_detected_boundary_geojson JSONB,
    document_stated_boundary_geojson JSONB,
    area_discrepancy_percentage NUMERIC(6, 2) DEFAULT 0.00,
    encroachment_detected BOOLEAN DEFAULT FALSE,
    encroachment_area_sqm NUMERIC(10, 2) DEFAULT 0.00,
    land_use_stated VARCHAR(64),
    land_use_satellite_detected VARCHAR(64),
    land_use_match BOOLEAN DEFAULT TRUE,
    verification_certificate_id VARCHAR(64),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Table: voice_search_logs
CREATE TABLE IF NOT EXISTS voice_search_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    officer_or_citizen_id UUID,
    language VARCHAR(16) NOT NULL, -- hi, mr, en
    audio_transcript TEXT NOT NULL,
    parsed_intent VARCHAR(64) NOT NULL,
    extracted_entities JSONB NOT NULL, -- { owner_name, survey_no, khasra_no, village }
    matched_parcel_count INT DEFAULT 0,
    matched_parcel_ids UUID[],
    ip_address VARCHAR(64),
    device_type VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Table: trust_scores
CREATE TABLE IF NOT EXISTS trust_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES land_records(id) ON DELETE CASCADE,
    overall_trust_score NUMERIC(5, 2) NOT NULL, -- 0-100%
    ai_confidence_score NUMERIC(5, 2) NOT NULL,
    officer_verification_score NUMERIC(5, 2) NOT NULL,
    satellite_consistency_score NUMERIC(5, 2) NOT NULL,
    fraud_safety_score NUMERIC(5, 2) NOT NULL,
    trust_badge_level VARCHAR(32) NOT NULL, -- VERIFIED_GOLD, VERIFIED_SILVER, UNDER_REVIEW, HIGH_ATTENTION
    qr_verification_token VARCHAR(128) UNIQUE NOT NULL,
    digital_signature_reference VARCHAR(128),
    last_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Table: ai_agents
CREATE TABLE IF NOT EXISTS ai_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_code VARCHAR(32) NOT NULL, -- OCR_OFFICER, VERIFICATION_OFFICER, GIS_OFFICER, FRAUD_OFFICER, LEGAL_ASSISTANT
    agent_name VARCHAR(128) NOT NULL,
    agent_role_description TEXT NOT NULL,
    model_underlying VARCHAR(64) NOT NULL, -- e.g. PaddleOCR-v4, Gemini-Cadastral, ISRO-Bhuvan-Net
    status VARCHAR(32) DEFAULT 'IDLE', -- IDLE, ANALYZING, COMPLETED, FLAGGED_ALERT
    last_execution_parcel_id UUID,
    confidence_score NUMERIC(5, 2) DEFAULT 95.00,
    evidence_payload JSONB,
    recommendation_text TEXT,
    action_suggested VARCHAR(64),
    execution_logs TEXT[],
    officer_decision VARCHAR(32) DEFAULT 'PENDING', -- PENDING, APPROVED_BY_OFFICER, OVERRIDDEN_BY_OFFICER
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Table: inspection_reports
CREATE TABLE IF NOT EXISTS inspection_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_reference_no VARCHAR(64) UNIQUE NOT NULL, -- e.g. NIC-BHU-MH-2026-INSP-0491
    parcel_id UUID REFERENCES land_records(id) ON DELETE CASCADE,
    inspecting_officer_id UUID NOT NULL,
    inspecting_officer_name VARCHAR(255) NOT NULL,
    inspecting_officer_designation VARCHAR(128) NOT NULL,
    inspection_date DATE NOT NULL,
    weather_condition VARCHAR(64),
    boundary_verification_result VARCHAR(64) NOT NULL,
    on_site_land_use VARCHAR(64) NOT NULL,
    crop_standing_details TEXT,
    structures_present TEXT,
    neighbouring_boundaries_match BOOLEAN DEFAULT TRUE,
    ai_satellite_discrepancy_summary TEXT,
    officer_recommendation TEXT NOT NULL,
    digital_signature_hash VARCHAR(128),
    qr_code_verification_url TEXT,
    pdf_export_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) NOT NULL, -- SECURITY, ACCOUNT_APPROVAL, LOGIN_ALERT, FRAUD_ALERT, MUTATION_REQUEST, VERIFICATION_ASSIGNED
    priority VARCHAR(16) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    parcel_id UUID,
    action_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL, -- UPLOAD, CORRECTION, VERIFICATION, APPROVAL, DOWNLOAD, GIS_INSPECTION, VOICE_SEARCH, AI_RECOMMENDATION_ACCEPTED
    resource VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64),
    details JSONB,
    ip_address VARCHAR(64) NOT NULL,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning queries
CREATE INDEX IF NOT EXISTS idx_land_records_parcel_uid ON land_records(parcel_uid);
CREATE INDEX IF NOT EXISTS idx_land_records_survey_khasra ON land_records(survey_number, khasra_number, village);
CREATE INDEX IF NOT EXISTS idx_documents_parcel_id ON documents(parcel_id);
CREATE INDEX IF NOT EXISTS idx_ocr_fields_document_id ON ocr_fields(document_id);
CREATE INDEX IF NOT EXISTS idx_timeline_parcel_year ON timeline_events(parcel_id, event_year);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
