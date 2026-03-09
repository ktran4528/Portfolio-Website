import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import db, { dbReady } from "../src/db/index.js"; 

dotenv.config();

const app = express();
app.use(express.json());

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ensure DB is ready before handling requests
app.use(async (req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (error) {
    console.error("Database initialization failed:", error);
    res.status(500).json({ error: "Database initialization failed" });
  }
});

// 1. Configure Cloudinary
if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// --- Auth API ---
// ... (existing routes)

// --- Gallery API ---
app.get("/api/gallery", async (req, res) => {
  try {
    const result = await db.execute("SELECT * FROM gallery ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

app.post("/api/gallery", upload.single("image"), async (req, res) => {
  try {
    const { description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Upload to Cloudinary
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    
    const cloudRes = await cloudinary.uploader.upload(dataURI, {
      folder: "gallery",
    });

    // Save to DB
    await db.execute({
      sql: "INSERT INTO gallery (image_url, description) VALUES (?, ?)",
      args: [cloudRes.secure_url, description || ""]
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Gallery upload error:", error);
    res.status(500).json({ error: "Failed to upload to gallery" });
  }
});

app.delete("/api/gallery/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({
      sql: "DELETE FROM gallery WHERE id = ?",
      args: [Number(id)]
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// --- Auth API ---
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "123";

  if (username === adminUser && password === adminPass) {
    res.json({ success: true, token: "admin-token-123" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// --- Comics API ---
app.get("/api/comics", async (req, res) => {
  try {
    const result = await db.execute("SELECT * FROM comics ORDER BY created_at ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comics" });
  }
});

app.post("/api/comics", async (req, res) => {
  const { id, title, description, thumbnail_url, status } = req.body;
  
  if (!id || !title) {
    return res.status(400).json({ error: "ID and Title are required" });
  }

  try {
    // In Cloudinary, folders are created implicitly. 
    // We can't "create" an empty folder via API easily, 
    // but we can ensure the DB record is set up to point to a folder structure.
    // The folder structure will be: [ComicID]/Chapter[Num]
    
    await db.execute({
      sql: "INSERT INTO comics (id, title, description, thumbnail_url, status) VALUES (?, ?, ?, ?, ?)",
      args: [id, title, description || "", thumbnail_url || `https://picsum.photos/seed/${id}/300/400`, status || "Ongoing"]
    });

    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY' || error.message?.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "Comic ID already exists" });
    }
    console.error("Create comic error:", error);
    res.status(500).json({ error: "Failed to create comic" });
  }
});

app.delete("/api/comics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({
      sql: "DELETE FROM comics WHERE id = ?",
      args: [id]
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Delete comic error:", error);
    res.status(500).json({ error: "Delete failed" });
  }
});

app.post("/api/comics/:id/thumbnail", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Upload to Cloudinary
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    
    const cloudRes = await cloudinary.uploader.upload(dataURI, {
      folder: `comics/${id}/thumbnails`,
    });

    // Save to thumbnails table
    await db.execute({
      sql: "INSERT INTO thumbnails (comic_id, image_url) VALUES (?, ?)",
      args: [id, cloudRes.secure_url]
    });

    // Update comics table thumbnail_url
    await db.execute({
      sql: "UPDATE comics SET thumbnail_url = ? WHERE id = ?",
      args: [cloudRes.secure_url, id]
    });

    res.json({ success: true, thumbnail_url: cloudRes.secure_url });
  } catch (error) {
    console.error("Thumbnail upload error:", error);
    res.status(500).json({ error: "Failed to upload thumbnail" });
  }
});

// --- Episodes API ---
app.get("/api/episodes", async (req, res) => {
  const comicId = (req.query.comic_id as string) || "hold-my-hand";
  try {
    const result = await db.execute({
      sql: "SELECT * FROM episodes WHERE comic_id = ? ORDER BY chapter_number ASC",
      args: [comicId]
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch episodes" });
  }
});

// ADD EPISODE ROUTE
app.post("/api/episodes", async (req, res) => {
  const { chapter_number, title, comic_id } = req.body;
  const comicId = comic_id || "hold-my-hand";
  
  // Helper to convert "hold-my-hand" -> "Hold-My-Hand"
  const toTitleCase = (str: string) => {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };
  const titleCaseId = toTitleCase(comicId);

  // Search multiple folder patterns for the thumbnail
  const folderExpressions = [
    `folder:"${comicId}/Chapter${chapter_number}/*"`,
    `folder:"${comicId}/chapter${chapter_number}/*"`,
    `folder:"${titleCaseId}/Chapter${chapter_number}/*"`,
    `folder:"${titleCaseId}/chapter${chapter_number}/*"`
  ];
  
  // Unique expressions only
  const uniqueExpressions = [...new Set(folderExpressions)];
  const searchExpression = `(${uniqueExpressions.join(" OR ")}) AND resource_type:image`;

  try {
    const cloudRes = await cloudinary.search
      .expression(searchExpression)
      .max_results(20) 
      .execute();

    let thumbnail_url = `https://picsum.photos/seed/${comicId}-ep${chapter_number}/300/300`;

    if (cloudRes.resources.length > 0) {
      const sortedImages = cloudRes.resources.sort((a: any, b: any) => 
        a.public_id.localeCompare(b.public_id, undefined, { numeric: true, sensitivity: 'base' })
      );
      thumbnail_url = sortedImages[0].secure_url;
    }

    await db.execute({
      sql: `INSERT INTO episodes (comic_id, chapter_number, title, thumbnail_url) VALUES (?, ?, ?, ?)
            ON CONFLICT(comic_id, chapter_number) DO UPDATE SET
            title=excluded.title,
            thumbnail_url=excluded.thumbnail_url`,
      args: [comicId, chapter_number, title, thumbnail_url]
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to create episode" });
  }
});

// DELETE EPISODE ROUTE (Fixes the "Delete" error)
app.delete("/api/episodes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({
      sql: "DELETE FROM episodes WHERE id = ?",
      args: [Number(id)]
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// --- Chapter Images API ---
app.get("/api/chapter/:id", async (req, res) => {
  const chapterId = req.params.id;
  const comicId = (req.query.comic_id as string) || "hold-my-hand";
  
  try {
    // 1. Check Cache (Database)
    const cached = await db.execute({
      sql: "SELECT image_public_id FROM chapter_pages WHERE comic_id = ? AND chapter_number = ? ORDER BY page_number ASC",
      args: [comicId, Number(chapterId)]
    });

    if (cached.rows.length > 0) {
      console.log(`⚡ Cache Hit: Found ${cached.rows.length} pages for ${comicId} Ch ${chapterId}`);
      const images = cached.rows.map(row => row.image_public_id);
      return res.json({ images });
    }

    // 2. Cache Miss - Search Cloudinary
    // Helper to convert "hold-my-hand" -> "Hold-My-Hand"
    const toTitleCase = (str: string) => {
      return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
    };

    const titleCaseId = toTitleCase(comicId);

    // Try a few common folder patterns to be helpful
    const folderOptions = [
      `${comicId}/Chapter${chapterId}`,
      `${comicId}/chapter${chapterId}`,
      `${comicId}/Chapter ${chapterId}`,
      `${comicId}/chapter ${chapterId}`,
      // Dynamic Title-Case support (e.g. hold-my-hand -> Hold-My-Hand)
      `${titleCaseId}/Chapter${chapterId}`,
      `${titleCaseId}/chapter${chapterId}`,
      // Also try with capitalization if comicId is lowercase (legacy/hardcoded fallback)
      comicId.toLowerCase() === "hold-my-hand" ? `Hold-My-Hand/Chapter${chapterId}` : null,
      // Try the reverse: if comicId is capitalized, try lowercase
      `${comicId.toLowerCase()}/Chapter${chapterId}`,
      `${comicId.toLowerCase()}/chapter${chapterId}`,
    ].filter(Boolean) as string[];

    // Remove duplicates
    const uniqueFolderOptions = [...new Set(folderOptions)];

    console.log(`🔍 Searching Cloudinary for ${comicId} Chapter ${chapterId}...`);
    console.log(`📂 Folder options: ${uniqueFolderOptions.join(", ")}`);

    let resources: any[] = [];
    
    // Try the folders in order until we find one with images
    for (const folder of uniqueFolderOptions) {
      // Try both exact folder and folder with subfolders
      const expressions = [
        `folder:"${folder}" AND resource_type:image`,
        `folder:"${folder}/*" AND resource_type:image`
      ];

      for (const expression of expressions) {
        console.log(`📡 Querying: ${expression}`);
        const result = await cloudinary.search
          .expression(expression)
          .sort_by("public_id", "asc")
          .execute();
        
        if (result.resources && result.resources.length > 0) {
          console.log(`✅ Found ${result.resources.length} images in folder: ${folder}`);
          resources = result.resources;
          break;
        }
      }
      
      if (resources.length > 0) break;
    }

    if (resources.length === 0) {
      return res.status(404).json({ 
        error: "No images found", 
        details: `Looked in: ${folderOptions.join(", ")}. Please ensure your Cloudinary folder matches one of these exactly.`
      });
    }

    let images = resources.map((resource: any) => resource.public_id);
    // Natural sort for filenames like "page1.jpg", "page10.jpg"
    images.sort((a: string, b: string) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    
    // 3. Save to Cache
    console.log(`💾 Caching ${images.length} pages for ${comicId} Ch ${chapterId}`);
    
    // Batch insert
    const placeholders = images.map(() => "(?, ?, ?, ?)").join(", ");
    const args = images.flatMap((img: string, index: number) => [comicId, Number(chapterId), index + 1, img]);
    
    await db.execute({
      sql: `INSERT INTO chapter_pages (comic_id, chapter_number, page_number, image_public_id) VALUES ${placeholders}`,
      args: args
    });

    res.json({ images });
  } catch (error: any) {
    console.error("Cloudinary search error:", error);
    res.status(500).json({ error: "Failed to fetch images", details: error.message });
  }
});

// --- Site Settings API ---
app.get("/api/settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const result = await db.execute({
      sql: "SELECT value FROM site_settings WHERE key = ?",
      args: [key]
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Setting not found" });
    }
    
    res.json({ value: result.rows[0].value });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch setting" });
  }
});

app.post("/api/settings/:key", upload.single("image"), async (req, res) => {
  try {
    const { key } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Upload to Cloudinary
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    
    const cloudRes = await cloudinary.uploader.upload(dataURI, {
      folder: `site/settings`,
    });

    // Update site_settings table
    await db.execute({
      sql: "INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)",
      args: [key, cloudRes.secure_url]
    });

    res.json({ success: true, value: cloudRes.secure_url });
  } catch (error) {
    console.error("Settings update error:", error);
    res.status(500).json({ error: "Failed to update setting" });
  }
});

// Local Development Heartbeat
if (process.env.NODE_ENV !== "production") {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`✅ Backend active at http://localhost:${PORT}`);
  });
}

export default app;
