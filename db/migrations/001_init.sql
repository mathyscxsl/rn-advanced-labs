CREATE TABLE IF NOT EXISTS robots (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('industrial','service','medical','educational','other'))
);
