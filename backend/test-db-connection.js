// Test Database Connection Script
require('dotenv').config();
const { Pool } = require('pg');

console.log('\n╔════════════════════════════════════════╗');
console.log('║  🔌 Testing Database Connection        ║');
console.log('╚════════════════════════════════════════╝\n');

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL not found in .env file');
    console.log('\n💡 Please make sure .env file exists and contains DATABASE_URL');
    process.exit(1);
}

console.log('📋 Database URL:', databaseUrl.replace(/:[^:@]+@/, ':****@'));

// Create connection pool
const pool = new Pool({
    connectionString: databaseUrl
});

async function testConnection() {
    try {
        console.log('\n🔄 Attempting to connect...');

        // Test basic connection
        const client = await pool.connect();
        console.log('✅ Successfully connected to PostgreSQL!');

        // Get server version
        const versionResult = await client.query('SELECT version()');
        console.log('\n📊 PostgreSQL Version:');
        console.log('  ', versionResult.rows[0].version.split(',')[0]);

        // Get current time
        const timeResult = await client.query('SELECT NOW()');
        console.log('\n🕐 Server Time:', timeResult.rows[0].now);

        // Check if database exists
        const dbResult = await client.query('SELECT current_database()');
        console.log('🗄️  Current Database:', dbResult.rows[0].current_database);

        // Check if tables exist
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);

        console.log('\n📋 Tables in database:');
        if (tablesResult.rows.length === 0) {
            console.log('   ⚠️  No tables found');
            console.log('   💡 Run: psql -U postgres -d clinic_db -f database-schema.sql');
        } else {
            tablesResult.rows.forEach(row => {
                console.log('   ✅', row.table_name);
            });
        }

        // Release client
        client.release();

        console.log('\n╔════════════════════════════════════════╗');
        console.log('║  ✅ Database Connection Successful!    ║');
        console.log('╚════════════════════════════════════════╝\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Connection Error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Possible solutions:');
            console.log('   1. Make sure PostgreSQL service is running');
            console.log('   2. Check if PostgreSQL is listening on port 5432');
            console.log('   3. Verify DATABASE_URL in .env file');
        } else if (error.code === '28P01') {
            console.log('\n💡 Authentication failed:');
            console.log('   1. Check username and password in DATABASE_URL');
            console.log('   2. Make sure the user has access to the database');
        } else if (error.code === '3D000') {
            console.log('\n💡 Database does not exist:');
            console.log('   Run: psql -U postgres -c "CREATE DATABASE clinic_db;"');
        }

        console.log('\n📖 For detailed setup instructions, see: postgresql-setup-guide.md\n');
        process.exit(1);

    } finally {
        await pool.end();
    }
}

// Run test
testConnection();
