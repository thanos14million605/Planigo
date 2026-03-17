import pool from "../config/db.js";

const createTableTodos = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const query = `
        CREATE TABLE IF NOT EXISTS todos (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            user_id UUID NOT NULL,

            title VARCHAR(200) NOT NULL,
            description TEXT,

            is_completed BOOLEAN DEFAULT FALSE,
            is_pinned BOOLEAN DEFAULT FALSE,
            is_important BOOLEAN DEFAULT FALSE,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_user
                FOREIGN KEY(user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
        );
    `;
    await client.query(query);
    await client.query("COMMIT");
    console.log("Todos table created successfully.");
  } catch (error) {
    console.log("Error in creating todos table", error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

createTableTodos();
