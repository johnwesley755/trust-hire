CREATE TABLE media_assets (
    id UUID PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    file_size BIGINT,
    owner_clerk_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX idx_media_owner ON media_assets(owner_clerk_id);
