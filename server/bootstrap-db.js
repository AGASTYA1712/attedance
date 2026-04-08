const mysql = require('mysql2/promise');
require('dotenv').config();

const URL = process.env.DATABASE_URL;

async function bootstrap() {
  console.log('Connecting to Railway MySQL...');
  const connection = await mysql.createConnection(URL);
  
  try {
    console.log('Creating tables...');
    
    // Create User Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS User (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('STUDENT', 'ADMIN') DEFAULT 'STUDENT',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create LeaveRequest Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS LeaveRequest (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(255) NOT NULL,
        reason TEXT NOT NULL,
        startDate DATETIME NOT NULL,
        endDate DATETIME NOT NULL,
        status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        userId INT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id)
      )
    `);
    
    console.log('SUCCESS: Database bootstrapped successfully!');
  } catch (error) {
    console.error('ERROR: Bootstrap failed:', error);
  } finally {
    await connection.end();
  }
}

bootstrap();
