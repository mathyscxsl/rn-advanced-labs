import { openDb } from "../db";

type RobotType = "industrial" | "service" | "medical" | "educational" | "other";

export type RobotRow = {
  id: string;
  name: string;
  label: string;
  year: number;
  type: RobotType;
  archived?: number;
  created_at?: string;
  updated_at?: string;
};

export type CreateRobotInput = {
  id: string;
  name: string;
  label: string;
  year: number;
  type: RobotType;
  archived?: number;
};

export type UpdateRobotChanges = Partial<Omit<CreateRobotInput, "id">>;

export type ListParams = {
  q?: string;
  sort?: string;
  limit?: number;
  offset?: number;
  includeArchived?: boolean;
};

let dbPromise: ReturnType<typeof openDb> | null = null;
let schemaInfo: { hasUpdatedAt: boolean; hasArchived: boolean } | null = null;

async function getDb() {
  if (!dbPromise) dbPromise = openDb();
  return dbPromise;
}

async function loadSchemaInfo() {
  if (schemaInfo) return schemaInfo;
  const db = await getDb();
  const cols = await db.getAllAsync<{ name: string }>("PRAGMA table_info(robots)");
  const names = new Set(cols.map((c) => c.name));
  schemaInfo = {
    hasUpdatedAt: names.has("updated_at"),
    hasArchived: names.has("archived"),
  };
  return schemaInfo;
}

export async function create(input: CreateRobotInput): Promise<RobotRow> {
  const db = await getDb();
  const cols: string[] = ["id", "name", "label", "year", "type"];
  const vals: any[] = [input.id, input.name, input.label, input.year, input.type];
  const info = await loadSchemaInfo();
  if (info.hasArchived && typeof input.archived !== "undefined") {
    cols.push("archived");
    vals.push(input.archived);
  }
  const placeholders = cols.map(() => "?").join(", ");
  const sql = `INSERT INTO robots (${cols.join(", ")}) VALUES (${placeholders})`;
  await db.runAsync(sql, vals);
  const created = await getById(input.id);
  if (!created) throw new Error("Robot non trouvé après création");
  return created;
}

export async function update(id: string, changes: UpdateRobotChanges): Promise<RobotRow | null> {
  const db = await getDb();
  const info = await loadSchemaInfo();
  const sets: string[] = [];
  const params: any[] = [];
  if (typeof changes.name !== "undefined") {
    sets.push("name = ?");
    params.push(changes.name);
  }
  if (typeof changes.label !== "undefined") {
    sets.push("label = ?");
    params.push(changes.label);
  }
  if (typeof changes.year !== "undefined") {
    sets.push("year = ?");
    params.push(changes.year);
  }
  if (typeof changes.type !== "undefined") {
    sets.push("type = ?");
    params.push(changes.type);
  }
  if (info.hasArchived && typeof changes.archived !== "undefined") {
    sets.push("archived = ?");
    params.push(changes.archived);
  }
  if (info.hasUpdatedAt) {
    sets.push("updated_at = CURRENT_TIMESTAMP");
  }
  if (sets.length === 0) return getById(id);
  const sql = `UPDATE robots SET ${sets.join(", ")} WHERE id = ?`;
  params.push(id);
  await db.runAsync(sql, params);
  return getById(id);
}

export async function remove(id: string): Promise<void> {
  const db = await getDb();
  const info = await loadSchemaInfo();
  if (info.hasArchived) {
    const sets: string[] = ["archived = 1"];
    if (info.hasUpdatedAt) sets.push("updated_at = CURRENT_TIMESTAMP");
    const sql = `UPDATE robots SET ${sets.join(", ")} WHERE id = ?`;
    await db.runAsync(sql, [id]);
  } else {
    await db.runAsync("DELETE FROM robots WHERE id = ?", [id]);
  }
}

export async function getById(id: string): Promise<RobotRow | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<RobotRow>("SELECT * FROM robots WHERE id = ?", [id]);
  return row ?? null;
}

export async function list(params: ListParams = {}): Promise<RobotRow[]> {
  const db = await getDb();
  const info = await loadSchemaInfo();
  const where: string[] = [];
  const bind: any[] = [];
  if (!params.includeArchived && info.hasArchived) {
    where.push("archived = 0");
  }
  if (params.q && params.q.trim().length > 0) {
    where.push("(LOWER(name) LIKE ? OR LOWER(label) LIKE ?)");
    const q = `%${params.q.toLowerCase()}%`;
    bind.push(q, q);
  }
  let orderBy = "name ASC";
  if (params.sort) {
    const desc = params.sort.startsWith("-");
    const colRaw = desc ? params.sort.slice(1) : params.sort;
    const allowed = new Set(["id", "name", "label", "year", "type", ...(info.hasArchived ? ["archived"] : [])]);
    const col = allowed.has(colRaw) ? colRaw : "name";
    orderBy = `${col} ${desc ? "DESC" : "ASC"}`;
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const limitSql = typeof params.limit === "number" ? " LIMIT ?" : "";
  const offsetSql = typeof params.offset === "number" ? " OFFSET ?" : "";
  const sql = `SELECT * FROM robots ${whereSql} ORDER BY ${orderBy}${limitSql}${offsetSql}`;
  if (typeof params.limit === "number") bind.push(params.limit);
  if (typeof params.offset === "number") bind.push(params.offset);
  const rows = await db.getAllAsync<RobotRow>(sql, bind);
  return rows;
}
