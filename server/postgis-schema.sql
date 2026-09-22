-- ============================================================================
-- BhoomiSetu - Module 3: ISRO x NIC GeoAI Intelligence Layer
-- PostgreSQL + PostGIS Schema Definition
-- Government of India, Ministry of Rural Development & Department of Land Resources
-- Inspired by ISRO Bhuvan, PM GatiShakti, and Digital India Land Records
-- ============================================================================

-- 1. Enable PostGIS & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "postgis_raster";

-- 2. Enumerated Types
CREATE TYPE verification_status_enum AS ENUM ('PENDING', 'VERIFIED', 'FLAGGED', 'REJECTED', 'UNDER_REVIEW');
CREATE TYPE risk_level_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE alert_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE land_use_class_enum AS ENUM ('AGRICULTURE', 'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'FOREST', 'WATER_BODY', 'BARREN');
CREATE TYPE inspection_status_enum AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'DISPUTED', 'CANCELLED');
CREATE TYPE graph_node_type_enum AS ENUM ('PARCEL', 'OWNER', 'FAMILY', 'VILLAGE', 'MUTATION', 'VERIFICATION', 'INSPECTION', 'LOAN_HYPOTHECATION', 'COURT_CASE', 'DOCUMENT');
CREATE TYPE graph_edge_type_enum AS ENUM ('OWNS', 'OWNED_PREVIOUSLY', 'TRANSFERRED_TO', 'LOCATED_IN', 'VERIFIED_BY', 'INSPECTED_BY', 'LINKED_MUTATION', 'LINKED_DOCUMENT', 'ENCROACHES_UPON', 'HAS_INJUNCTION');

-- 3. Districts & Villages
CREATE TABLE IF NOT EXISTS gis_villages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    census_village_code VARCHAR(32) UNIQUE NOT NULL,
    village_name VARCHAR(128) NOT NULL,
    village_name_local VARCHAR(128),
    taluka VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL DEFAULT 'Maharashtra',
    pin_code VARCHAR(10),
    total_geographical_area_ha NUMERIC(12, 4) NOT NULL,
    total_parcels INTEGER NOT NULL DEFAULT 0,
    digitized_parcels INTEGER NOT NULL DEFAULT 0,
    verified_parcels INTEGER NOT NULL DEFAULT 0,
    high_risk_parcels INTEGER NOT NULL DEFAULT 0,
    boundary_polygon GEOMETRY(Polygon, 4326),
    centroid_point GEOMETRY(Point, 4326),
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gis_villages_boundary ON gis_villages USING GIST (boundary_polygon);
CREATE INDEX IF NOT EXISTS idx_gis_villages_centroid ON gis_villages USING GIST (centroid_point);
CREATE INDEX IF NOT EXISTS idx_gis_villages_dist_tal ON gis_villages (district, taluka);

-- 4. GIS Land Parcels
CREATE TABLE IF NOT EXISTS gis_parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_uid VARCHAR(32) UNIQUE NOT NULL, -- Unique Land Parcel Identification Number (ULPIN / Bhu-Aadhaar)
    survey_number VARCHAR(64) NOT NULL,
    subdivision_number VARCHAR(32),
    khasra_number VARCHAR(64),
    khata_number VARCHAR(64),
    village_id UUID REFERENCES gis_villages(id) ON DELETE RESTRICT,
    village_name VARCHAR(128) NOT NULL,
    taluka VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    cadastral_area_sqm NUMERIC(14, 4) NOT NULL,
    cadastral_area_ha NUMERIC(10, 4) NOT NULL,
    satellite_observed_area_ha NUMERIC(10, 4),
    current_land_use land_use_class_enum DEFAULT 'AGRICULTURE',
    primary_owner_name VARCHAR(256) NOT NULL,
    primary_owner_aadhaar_hash VARCHAR(128),
    co_owners JSONB DEFAULT '[]'::jsonb,
    verification_status verification_status_enum DEFAULT 'PENDING',
    trust_score_pct NUMERIC(5, 2) DEFAULT 85.00,
    dispute_risk_level risk_level_enum DEFAULT 'LOW',
    has_encroachment BOOLEAN DEFAULT FALSE,
    has_pending_mutation BOOLEAN DEFAULT FALSE,
    has_court_stay BOOLEAN DEFAULT FALSE,
    dna_hash VARCHAR(128),
    version_id INTEGER DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gis_parcels_uid ON gis_parcels (parcel_uid);
CREATE INDEX IF NOT EXISTS idx_gis_parcels_survey ON gis_parcels (survey_number);
CREATE INDEX IF NOT EXISTS idx_gis_parcels_village ON gis_parcels (village_id);
CREATE INDEX IF NOT EXISTS idx_gis_parcels_verification ON gis_parcels (verification_status);

-- 5. Parcel Boundaries & PostGIS Geometries (Historical & Current versions)
CREATE TABLE IF NOT EXISTS parcel_boundaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES gis_parcels(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    survey_date DATE NOT NULL,
    source_type VARCHAR(64) NOT NULL, -- 'CADASTRAL_SHEET_1968', 'ETS_SURVEY', 'DRONE_SVAMITVA', 'CARTOSAT_3'
    geom GEOMETRY(Polygon, 4326) NOT NULL,
    centroid GEOMETRY(Point, 4326) NOT NULL,
    bounding_box GEOMETRY(Polygon, 4326),
    perimeter_meters NUMERIC(12, 2),
    area_sqm NUMERIC(14, 4) NOT NULL,
    accuracy_tolerance_cm NUMERIC(6, 2) DEFAULT 10.0,
    is_active_cadastral BOOLEAN DEFAULT TRUE,
    created_by_officer_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_parcel_boundaries_geom ON parcel_boundaries USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_parcel_boundaries_centroid ON parcel_boundaries USING GIST (centroid);

-- 6. Satellite Snapshots & Multi-Spectral Imagery Catalog
CREATE TABLE IF NOT EXISTS satellite_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    satellite_name VARCHAR(64) NOT NULL, -- 'Cartosat-3', 'Resourcesat-2A', 'Sentinel-2B'
    sensor_type VARCHAR(64) NOT NULL, -- 'PAN', 'MS', 'SAR'
    capture_date DATE NOT NULL,
    spatial_resolution_meters NUMERIC(4, 2) NOT NULL,
    cloud_cover_percentage NUMERIC(5, 2) DEFAULT 0.0,
    sun_azimuth_deg NUMERIC(6, 2),
    tile_url TEXT NOT NULL,
    coverage_envelope GEOMETRY(Polygon, 4326) NOT NULL,
    ndvi_mean NUMERIC(5, 4),
    ndbi_mean NUMERIC(5, 4),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_satellite_snapshots_envelope ON satellite_snapshots USING GIST (coverage_envelope);
CREATE INDEX IF NOT EXISTS idx_satellite_snapshots_date ON satellite_snapshots (capture_date);

-- 7. AI Land Use Change Detection Records
CREATE TABLE IF NOT EXISTS land_use_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES gis_parcels(id) ON DELETE CASCADE,
    previous_snapshot_id UUID REFERENCES satellite_snapshots(id),
    current_snapshot_id UUID REFERENCES satellite_snapshots(id),
    previous_land_use land_use_class_enum NOT NULL,
    current_land_use land_use_class_enum NOT NULL,
    change_percentage NUMERIC(6, 2) NOT NULL,
    built_up_area_expansion_sqm NUMERIC(12, 2) DEFAULT 0.0,
    vegetation_loss_sqm NUMERIC(12, 2) DEFAULT 0.0,
    confidence_score NUMERIC(5, 2) NOT NULL,
    ai_detection_summary TEXT NOT NULL,
    difference_mask_raster TEXT, -- Raster URI or GeoJSON feature
    flagged_for_unauthorized_conversion BOOLEAN DEFAULT FALSE,
    reviewed_by_officer_id UUID,
    officer_action_taken VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_land_use_changes_parcel ON land_use_changes (parcel_id);

-- 8. Spatial Encroachments & Buffer Violation Center
CREATE TABLE IF NOT EXISTS encroachment_detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_id UUID REFERENCES gis_parcels(id) ON DELETE CASCADE,
    encroachment_type VARCHAR(64) NOT NULL, -- 'ROAD_RESERVE_VIOLATION', 'WATERBODY_BUFFER', 'NEIGHBOR_OVERLAP', 'FOREST_ZONE'
    severity risk_level_enum DEFAULT 'MEDIUM',
    encroaching_polygon GEOMETRY(Polygon, 4326) NOT NULL,
    encroached_feature_name VARCHAR(128) NOT NULL,
    overlap_area_sqm NUMERIC(10, 2) NOT NULL,
    violation_percentage NUMERIC(5, 2) NOT NULL,
    ai_confidence_score NUMERIC(5, 2) NOT NULL,
    detected_via VARCHAR(64) DEFAULT 'Cartosat-3 0.28m Orthorectified',
    inspection_requisitioned BOOLEAN DEFAULT FALSE,
    notice_served BOOLEAN DEFAULT FALSE,
    notice_reference_no VARCHAR(64),
    status VARCHAR(32) DEFAULT 'FLAGGED_FOR_INSPECTION',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_encroachments_geom ON encroachment_detections USING GIST (encroaching_polygon);

-- 9. Geo Inspection Mission Records (Mobile + Laptop Ground Truthing)
CREATE TABLE IF NOT EXISTS inspection_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_code VARCHAR(32) UNIQUE NOT NULL,
    parcel_id UUID REFERENCES gis_parcels(id) ON DELETE CASCADE,
    inspector_id UUID NOT NULL,
    inspector_name VARCHAR(128) NOT NULL,
    inspector_designation VARCHAR(64) NOT NULL,
    status inspection_status_enum DEFAULT 'SCHEDULED',
    scheduled_date DATE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    gps_checkin_point GEOMETRY(Point, 4326),
    gps_accuracy_meters NUMERIC(6, 2),
    compass_bearing_degrees NUMERIC(6, 2),
    geo_tagged_photos JSONB DEFAULT '[]'::jsonb,
    boundary_markers_verified BOOLEAN DEFAULT FALSE,
    owner_present BOOLEAN DEFAULT FALSE,
    encroachment_confirmed BOOLEAN DEFAULT FALSE,
    audio_notes_url TEXT,
    inspector_remarks TEXT,
    digital_signature_hash VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inspections_parcel ON inspection_missions (parcel_id);
CREATE INDEX IF NOT EXISTS idx_inspections_checkin ON inspection_missions USING GIST (gps_checkin_point);

-- 10. Geo Alerts Engine (Collector & Tehsildar Notification Support)
CREATE TABLE IF NOT EXISTS geo_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_code VARCHAR(32) UNIQUE NOT NULL,
    parcel_id UUID REFERENCES gis_parcels(id) ON DELETE CASCADE,
    village_id UUID REFERENCES gis_villages(id),
    title VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'SATELLITE_CHANGE', 'ENCROACHMENT', 'DISPUTE_RISK', 'MUTATION_ALERT', 'ENVIRONMENTAL'
    priority alert_priority_enum DEFAULT 'MEDIUM',
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID,
    action_taken TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_geo_alerts_priority ON geo_alerts (priority, is_acknowledged);

-- 11. Environmental Intelligence Layers
CREATE TABLE IF NOT EXISTS environment_layers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    layer_name VARCHAR(128) NOT NULL,
    layer_type VARCHAR(64) NOT NULL, -- 'FLOOD_ZONE', 'RIVER_BUFFER', 'RESERVED_FOREST', 'DRAINAGE_CANAL'
    feature_polygon GEOMETRY(MultiPolygon, 4326) NOT NULL,
    statutory_buffer_meters NUMERIC(8, 2) DEFAULT 50.0,
    source_agency VARCHAR(128) NOT NULL, -- 'CWC', 'Forest Survey of India', 'State Water Resources'
    risk_classification VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_env_layers_geom ON environment_layers USING GIST (feature_polygon);

-- 12. Land Intelligence Knowledge Graph (Nodes & Edges)
CREATE TABLE IF NOT EXISTS knowledge_graph_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_key VARCHAR(64) UNIQUE NOT NULL,
    node_type graph_node_type_enum NOT NULL,
    label VARCHAR(256) NOT NULL,
    subtitle VARCHAR(256),
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS knowledge_graph_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_node_id UUID REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE,
    relationship graph_edge_type_enum NOT NULL,
    weight NUMERIC(4, 2) DEFAULT 1.0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_graph_edges_src ON knowledge_graph_edges (source_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_tgt ON knowledge_graph_edges (target_node_id);
