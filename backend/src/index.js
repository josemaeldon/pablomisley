require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;
const { Pool } = require('pg');
const fs = require('fs');

// PostgreSQL connection setup
let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS example_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

async function connectWithRetry(retries = 10, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      console.log('Connected to PostgreSQL');
      await client.query(CREATE_TABLES_SQL);
      console.log('Database initialized');
      client.release();
      return;
    } catch (err) {
      console.error(`Database connection attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error('Could not connect to the database after ' + retries + ' attempts.');
      }
    }
  }
}

// Middleware
app.use(express.json());

const setupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many setup requests, please try again later.',
});

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM example_table');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

// Route to handle database configuration
app.post('/api/setup', setupLimiter, async (req, res) => {
  const { host, user, password, database } = req.body;

  const connectionString = `postgres://${user}:${password}@${host}:5432/${database}`;

  // Test database connection with the new credentials
  let newPool;
  try {
    newPool = new Pool({ connectionString });
    const client = await newPool.connect();
    await client.query(CREATE_TABLES_SQL);
    client.release();

    // Persist configuration and swap active pool
    fs.writeFileSync('.env', `DATABASE_URL=${connectionString}\n`);
    process.env.DATABASE_URL = connectionString;
    const oldPool = pool;
    pool = newPool;
    await oldPool.end();

    res.status(200).send('Database configured successfully!');
  } catch (err) {
    console.error('Database connection error:', err);
    if (newPool) {
      await newPool.end().catch(() => {});
    }
    res.status(500).send('Failed to connect to the database.');
  }
});

// Start server
connectWithRetry()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });