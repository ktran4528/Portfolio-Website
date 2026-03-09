import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || "file:./data/comics.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

// Ensure data directory exists if using local file
if (url.startsWith("file:")) {
  const dbPath = url.replace("file:", "");
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

const db = createClient({
  url,
  authToken,
});

// Initialize schema
export const dbReady = (async () => {
  try {
    // Enable foreign keys for SQLite
    await db.execute("PRAGMA foreign_keys = ON;");
    
    // 1. Create 'comics' table first
    await db.execute(`
      CREATE TABLE IF NOT EXISTS comics (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        thumbnail_url TEXT,
        status TEXT DEFAULT 'Ongoing',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create 'episodes' table with relational constraints
    await db.execute(`
      CREATE TABLE IF NOT EXISTS episodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comic_id TEXT NOT NULL,
        chapter_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        thumbnail_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(comic_id, chapter_number),
        FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE
      );
    `);

    // 3. Create 'gallery' table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_url TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Create 'thumbnails' table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS thumbnails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comic_id TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (comic_id) REFERENCES comics(id) ON DELETE CASCADE
      );
    `);

    // 5. Create 'site_settings' table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // 6. Create 'chapter_pages' table for caching Cloudinary results
    await db.execute(`
      CREATE TABLE IF NOT EXISTS chapter_pages (
        comic_id TEXT NOT NULL,
        chapter_number INTEGER NOT NULL,
        page_number INTEGER NOT NULL,
        image_public_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (comic_id, chapter_number, page_number)
      );
    `);

    // Initialize default about image if not exists
    await db.execute(`
      INSERT OR IGNORE INTO site_settings (key, value) VALUES ('about_image', 'https://picsum.photos/seed/about/800/800');
    `);

    console.log("Database schema initialized: Comics, Episodes, Gallery, Thumbnails, and Site Settings are ready.");
  } catch (err) {
    console.error("Failed to initialize database schema:", err);
    throw err;
  }
})();

export default db;