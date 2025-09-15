CREATE TABLE IF NOT EXISTS runs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  kind VARCHAR(64) NOT NULL,
  status ENUM('pending','running','succeeded','failed') NOT NULL DEFAULT 'pending',
  graph_json JSON NULL,
  input_json JSON NULL,
  output_json JSON NULL,
  error_text TEXT NULL,
  started_at TIMESTAMP NULL,
  finished_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS run_steps (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  run_id BIGINT NOT NULL,
  node VARCHAR(64) NOT NULL,
  status ENUM('running','succeeded','failed') NOT NULL,
  in_json JSON NULL,
  out_json JSON NULL,
  tokens_json JSON NULL,
  timings_json JSON NULL,
  error_text TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (run_id) REFERENCES runs(id)
);

CREATE TABLE IF NOT EXISTS sources (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  url TEXT,
  title VARCHAR(512),
  domain VARCHAR(255),
  license VARCHAR(64),
  published_at DATETIME NULL,
  score DOUBLE NULL,
  meta_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS source_chunks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  source_id BIGINT NOT NULL,
  ord INT NOT NULL,
  text MEDIUMTEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL,
  meta_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_id) REFERENCES sources(id)
);
CREATE INDEX idx_source_chunks_source ON source_chunks(source_id);
-- If your TiDB supports vector indexes, enable the HNSW index; otherwise omit.
-- CREATE VECTOR INDEX v_idx_source_chunks_embedding
--   ON source_chunks (embedding) USING HNSW WITH (dim=1536, distance='cosine');

CREATE TABLE IF NOT EXISTS documents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NULL,
  title VARCHAR(512),
  mime VARCHAR(128),
  meta_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_chunks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  document_id BIGINT NOT NULL,
  ord INT NOT NULL,
  text MEDIUMTEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL,
  meta_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id)
);
CREATE INDEX idx_document_chunks_doc ON document_chunks(document_id);
-- CREATE VECTOR INDEX v_idx_document_chunks_embedding
--   ON document_chunks (embedding) USING HNSW WITH (dim=1536, distance='cosine');
