const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔗 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully');

    // Read and execute the total.sql file
    const sqlPath = path.join(__dirname, 'migrations', 'total.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📋 Executing database schema...');
    await client.query(sql);
    console.log('✅ Database schema created successfully');

    // Check if tables were created
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tables created:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    await client.end();
    console.log('\n✅ Database setup completed successfully');

  } catch (err) {
    console.error('❌ Database setup failed:', err.message);
    process.exit(1);
  }
}

setupDatabase();
