/**
 * CODE WALKTHROUGH: DATABASE CONNECTION (The Bridge)
 * 1. Imports 'mysql2/promise' to talk to the database using modern async code.
 * 2. Uses 'dotenv' to pull your passwords securely from the .env file.
 * 3. Creates a 'Pool' of connections. This is the industry standard because it 
 *    allows multiple people to visit the site at once without slowing down.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

console.log(`📡 Attempting DB connection to: ${process.env.DB_HOST}:${process.env.DB_PORT}...`);
    
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'amyntortech_db',
    port: process.env.DB_PORT || 8889,
    waitForConnections: true,
    connectionLimit: 10, // Industry standard: allows 10 concurrent DB connections
    queueLimit: 0
});

// We test the connection to help you debug errors faster
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database connected successfully!');
        connection.release(); // Important: Put the worker back in the pool!
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
        console.log('💡 TIP: Make sure your MySQL server (XAMPP/MAMP) is running.');
    }
};

testConnection();

module.exports = pool;
