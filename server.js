import express from 'express';
import cors from 'cors';
import fs from 'fs/promises'; // Node's promise-based fs module
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;
const DATA_FILE = path.resolve('./timetable.json');

app.use(cors());
app.use(express.json());

// Load timetable data from file
async function loadTimetable() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {
      period1: '',
      period2: '',
      period3: '',
      period4: '',
      period5: '',
      school_day: ''
    };
  }
}

// Save timetable data to file
async function saveTimetable(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get the latest timetable
app.get('/timetable', async (req, res) => {
  const data = await loadTimetable();
  res.json(data);
});

// Save a new timetable
app.post('/timetable', async (req, res) => {
  const { period1, period2, period3, period4, period5, school_day } = req.body;

  if (!school_day) {
    return res.status(400).json({ error: 'school_day (date) is required' });
  }

  const newData = { period1, period2, period3, period4, period5, school_day };

  try {
    await saveTimetable(newData);
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving timetable:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
