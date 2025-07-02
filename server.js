import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://neondb_owner:npg_LkeOG3l1bKJF@ep-odd-wind-ad1k8hv1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

app.get('/timetable', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM timetable ORDER BY id DESC LIMIT 1');
    if (result.rows.length === 0) {
      return res.json({
        period1: '',
        period2: '',
        period3: '',
        period4: '',
        period5: '',
        school_day: ''
      });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/timetable', async (req, res) => {
  const { period1, period2, period3, period4, period5, school_day } = req.body;

  if (!school_day) {
    return res.status(400).json({ error: 'school_day (date) is required' });
  }

  try {
    await pool.query(
      'INSERT INTO timetable (period1, period2, period3, period4, period5, school_day) VALUES ($1, $2, $3, $4, $5, $6)',
      [period1, period2, period3, period4, period5, school_day]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving timetable:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
