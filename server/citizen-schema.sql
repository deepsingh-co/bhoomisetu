-- Bhulekh AI v3 — Citizen Portal & Land Intelligence Database Schema
-- Compatible with PostgreSQL 14+ / Cloud SQL / PostGIS

CREATE TABLE IF NOT EXISTS citizen_profiles (
    id VARCHAR(64) PRIMARY KEY,
    aadhar_masked VARCHAR(20) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    email VARCHAR(128),
    district VARCHAR(64) DEFAULT 'Pune',
    taluka VARCHAR(64) DEFAULT 'Haveli',
    village VARCHAR(64) DEFAULT 'Wagholi',
    preferred_language VARCHAR(8) DEFAULT 'en',
    is_otp_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_searches (
    id VARCHAR(64) PRIMARY KEY,
    citizen_id VARCHAR(64) REFERENCES citizen_profiles(id) ON DELETE CASCADE,
    search_type VARCHAR(32) NOT NULL,
    query TEXT NOT NULL,
    filters JSONB,
    results_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voice_search_logs (
    id VARCHAR(64) PRIMARY KEY,
    citizen_id VARCHAR(64) REFERENCES citizen_profiles(id) ON DELETE SET NULL,
    language VARCHAR(8) DEFAULT 'hi',
    raw_transcript TEXT NOT NULL,
    structured_filters JSONB NOT NULL,
    parsed_survey VARCHAR(32),
    parsed_village VARCHAR(64),
    matched_count INT DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trust_certificates (
    id VARCHAR(64) PRIMARY KEY,
    certificate_number VARCHAR(64) UNIQUE NOT NULL,
    parcel_uid VARCHAR(64) NOT NULL,
    owner_name VARCHAR(128) NOT NULL,
    survey_number VARCHAR(32) NOT NULL,
    village VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    area_hectares NUMERIC(10, 4) NOT NULL,
    trust_score INT NOT NULL,
    ai_confidence NUMERIC(5, 2) NOT NULL,
    officer_verified_by VARCHAR(128) NOT NULL,
    qr_hash VARCHAR(128) UNIQUE NOT NULL,
    digital_signature TEXT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(32) DEFAULT 'VALID'
);

CREATE TABLE IF NOT EXISTS correction_requests (
    id VARCHAR(64) PRIMARY KEY,
    tracking_id VARCHAR(64) UNIQUE NOT NULL,
    citizen_id VARCHAR(64) REFERENCES citizen_profiles(id) ON DELETE CASCADE,
    parcel_uid VARCHAR(64) NOT NULL,
    request_type VARCHAR(32) NOT NULL,
    current_details TEXT NOT NULL,
    requested_correction TEXT NOT NULL,
    evidence_files JSONB,
    status VARCHAR(32) DEFAULT 'SUBMITTED',
    assigned_officer VARCHAR(128),
    officer_remarks TEXT,
    citizen_replies JSONB,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grievance_tickets (
    id VARCHAR(64) PRIMARY KEY,
    ticket_number VARCHAR(64) UNIQUE NOT NULL,
    citizen_id VARCHAR(64) REFERENCES citizen_profiles(id) ON DELETE CASCADE,
    category VARCHAR(64) NOT NULL,
    subject VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(16) DEFAULT 'MEDIUM',
    status VARCHAR(32) DEFAULT 'OPEN',
    assigned_officer VARCHAR(128),
    resolution_notes TEXT,
    satisfaction_rating INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS citizen_documents (
    id VARCHAR(64) PRIMARY KEY,
    citizen_id VARCHAR(64) REFERENCES citizen_profiles(id) ON DELETE CASCADE,
    parcel_uid VARCHAR(64) NOT NULL,
    title VARCHAR(256) NOT NULL,
    document_type VARCHAR(64) NOT NULL,
    folder VARCHAR(64) DEFAULT 'VERIFIED_RECORDS',
    file_size VARCHAR(32) NOT NULL,
    file_format VARCHAR(16) DEFAULT 'PDF',
    download_url TEXT NOT NULL,
    verification_hash VARCHAR(128) NOT NULL,
    qr_code_url TEXT,
    is_archived BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notification_history (
    id VARCHAR(64) PRIMARY KEY,
    citizen_id VARCHAR(64) REFERENCES citizen_profiles(id) ON DELETE CASCADE,
    title VARCHAR(256) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(64) NOT NULL,
    priority VARCHAR(16) DEFAULT 'MEDIUM',
    is_read BOOLEAN DEFAULT FALSE,
    is_archive BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(256),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS download_history (
    id VARCHAR(64) PRIMARY KEY,
    citizen_id VARCHAR(64) REFERENCES citizen_profiles(id) ON DELETE CASCADE,
    document_title VARCHAR(256) NOT NULL,
    document_type VARCHAR(64) NOT NULL,
    parcel_uid VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS qr_verification_logs (
    id VARCHAR(64) PRIMARY KEY,
    qr_hash VARCHAR(128) NOT NULL,
    parcel_uid VARCHAR(64),
    verification_result VARCHAR(32) NOT NULL,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS portfolio_parcels (
    id VARCHAR(64) PRIMARY KEY,
    citizen_id VARCHAR(64) REFERENCES citizen_profiles(id) ON DELETE CASCADE,
    parcel_uid VARCHAR(64) NOT NULL,
    ownership_type VARCHAR(32) DEFAULT 'OWNED',
    is_favorite BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_citizen_parcel UNIQUE (citizen_id, parcel_uid)
);
