mport mysql from 'mysql2/promise';

export const handler = async (event) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });

  try {
    if (event.httpMethod === 'POST') {
      const { name } = JSON.parse(event.body);
      await connection.execute('INSERT INTO notes (name) VALUES (?)', [name]);
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    const [rows] = await connection.execute('SELECT * FROM notes ORDER BY created_at DESC');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows)
    };
  } finally {
    await connection.end();
  }
};
