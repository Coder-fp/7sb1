import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Connect to Neon
const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_LkeOG3l1bKJF@ep-odd-wind-ad1k8hv1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

// Get the latest timetable
app.get('/timetable', async (req, res) => {
  const result = await pool.query('SELECT * FROM timetable ORDER BY id DESC LIMIT 1');
  res.json(result.rows[0] || {});
});

// Save a new timetable
app.post('/timetable', async (req, res) => {
  const { period1, period2, period3, period4, period5, school_day } = req.body;
  await pool.query(
    `INSERT INTO timetable (period1, period2, period3, period4, period5, school_day)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [period1, period2, period3, period4, period5, school_day]
  );
  res.json({ success: true });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
