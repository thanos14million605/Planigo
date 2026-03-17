import pool from "../config/db.js";

const createTableUsers = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const query = `
        CREATE TABLE IF NOT EXISTS users(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password VARCHAR(300) NOT NULL,
            role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
            isActive BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        );
    `;
    await client.query(query);
    await client.query("COMMIT");
    console.log("Users table created successfully");
  } catch (error) {
    console.log("Error in creating users table.", error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

createTableUsers();
