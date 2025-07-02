import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;
const DATA_FILE = path.resolve('./timetable.json');

app.use(cors());
app.use(express.json());

async function loadTimetable() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {
      school_day: '',
      period1: '',
      period2: '',
      period3: '',
      period4: '',
      period5: ''
    };
  }
}

async function saveTimetable(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/timetable', async (req, res) => {
  const data = await loadTimetable();
  res.json(data);
});

app.post('/timetable', async (req, res) => {
  const { school_day, period1, period2, period3, period4, period5 } = req.body;
  if (!school_day) {
    return res.status(400).json({ error: 'Date (school_day) is required' });
  }
  try {
    await saveTimetable({ school_day, period1, period2, period3, period4, period5 });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to save timetable:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
