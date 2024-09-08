require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

async function hashAndUpdatePasswords() {
  try {
    const result = await pool.query('SELECT id, password FROM users');

    for (let row of result.rows) {
      const { id, password } = row;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await pool.query('UPDATE users SET password = $1 WHERE id =$2', [hashedPassword, id]);

      console.log(`Updated password for user ID ${id}`);
    }

    console.log('All passwords have been updated to hashed versions.');
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    pool.end();
  }
}

hashAndUpdatePasswords();