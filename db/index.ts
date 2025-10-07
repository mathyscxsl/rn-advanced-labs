import * as SQLite from "expo-sqlite";

type Migration = {
  version: number;
  name: string;
  sql: string;
};

const migrations: Migration[] = [
  {
    version: 1,
    name: "001_init",
    sql: `
      CREATE TABLE IF NOT EXISTS robots (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        label TEXT NOT NULL,
        year INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('industrial','service','medical','educational','other'))
      );
    `,
  },
  {
    version: 2,
    name: "002_add_indexes",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_robots_name ON robots(name);
      CREATE INDEX IF NOT EXISTS idx_robots_year ON robots(year);
    `,
  },
  {
    version: 3,
    name: "003_add_archived",
    sql: `
      ALTER TABLE robots ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;
    `,
  },
];

async function getUserVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  return row?.user_version ?? 0;
}

async function setUserVersion(db: SQLite.SQLiteDatabase, version: number) {
  await db.execAsync(`PRAGMA user_version = ${version}`);
}

async function applyMigration(db: SQLite.SQLiteDatabase, migration: Migration) {
  await db.withTransactionAsync(async () => {
    await db.execAsync(migration.sql);
    await setUserVersion(db, migration.version);
  });
}

async function runMigrations(db: SQLite.SQLiteDatabase) {
  const current = await getUserVersion(db);
  for (const m of migrations) {
    if (m.version > current) {
      await applyMigration(db, m);
    }
  }
}

export async function openDb(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync("robots.db");
  await db.execAsync("PRAGMA foreign_keys = ON");
  await runMigrations(db);
  return db;
}

export async function getDbVersion(): Promise<number> {
  const db = await SQLite.openDatabaseAsync("robots.db");
  return getUserVersion(db);
}

export type { SQLite };

