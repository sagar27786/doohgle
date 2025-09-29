import { pool } from "./src/db.ts";

async function runMigration() {
  try {
    console.log("Creating favorite_screens table...");
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorite_screens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Ensure a user can only favorite a screen once
        UNIQUE(user_id, screen_id)
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_favorite_screens_user_id ON favorite_screens(user_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_favorite_screens_screen_id ON favorite_screens(screen_id);
    `);

    console.log("✅ favorite_screens table created successfully!");
    
    // Test the table
    const result = await pool.query("SELECT COUNT(*) FROM favorite_screens");
    console.log(`Favorite screens count: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error("Error creating favorite_screens table:", error);
  } finally {
    process.exit(0);
  }
}

runMigration();