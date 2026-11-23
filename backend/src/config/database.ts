import pg from "pg"

const useSsl =
  process.env.DB_SSL === "true" ||
  process.env.DATABASE_URL?.includes("supabase.co") ||
  process.env.DATABASE_URL?.includes("render.com")

const sslConfig = useSsl ? { rejectUnauthorized: false } : false

export const pool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: sslConfig
    })
  : new pg.Pool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || "hyrule",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      ssl: sslConfig
    })