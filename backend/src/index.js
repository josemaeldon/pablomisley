require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { Pool } = require('pg');
const fs = require('fs');

// PostgreSQL connection setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Database connection error:', err));

// Middleware
app.use(express.json());

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
app.post('/api/setup', async (req, res) => {
  const { host, user, password, database } = req.body;

  // Save configuration to .env file
  const envContent = `DATABASE_URL=postgres://${user}:${password}@${host}:5432/${database}`;
  fs.writeFileSync('.env', envContent);

  // Test database connection
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    await pool.connect();
    res.status(200).send('Database configured successfully!');
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send('Failed to connect to the database.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});