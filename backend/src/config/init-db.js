const db = require('./database');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    try {
        console.log('🔄 Initializing database...');

        // Read the SQL schema file
        const schemaPath = path.join(__dirname, '../../database-schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute the schema
        await db.query(schema);

        console.log('✅ Database initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    initializeDatabase();
}

module.exports = initializeDatabase;
