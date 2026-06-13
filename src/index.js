import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillsPath = path.join(__dirname, 'skills.json');

let skills = [];
try {
  const raw = fs.readFileSync(skillsPath, 'utf8');
  skills = JSON.parse(raw);
} catch (err) {
  console.warn('Could not load skills.json:', err.message);
}

app.get('/', (req, res) => {
  res.send('Claude Skills - Node.js starter app');
});

app.get('/api/skills', (req, res) => {
  res.json(skills);
});

app.get('/api/skills/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = skills.find(s => s.id === id);
  if (!item) return res.status(404).json({ error: 'Skill not found' });
  res.json(item);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
