const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL not set');
  }

  // Parse a MySQL DATABASE_URL like: mysql://user:pass@host:port/dbname
  const match = databaseUrl.match(/mysql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)$/);
  if (!match) {
    throw new Error('DATABASE_URL not in expected mysql://user:pass@host:port/db format');
  }

  const [, user, password, host, port, database] = match;

  const conn = await mysql.createConnection({
    host,
    port: Number(port),
    user,
    password: decodeURIComponent(password),
    database
  });

  try {
    const hashedPassword = await bcrypt.hash('hisabwala123', 12);

    // Use INSERT ... ON DUPLICATE KEY UPDATE to upsert by unique email
    const sql = `INSERT INTO super_admins (email, password, createdAt, updatedAt)
      VALUES (?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE password = VALUES(password), updatedAt = NOW()`;

    const [result] = await conn.execute(sql, ['hisabwala@gmail.com', hashedPassword]);

    console.log('Super Admin seeded successfully');
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
