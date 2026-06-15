import fs from 'fs';
import path from 'path';
import assert from 'assert';

const skillsPath = path.join(process.cwd(), 'skills.json');

Deno?.

try {
  const raw = fs.readFileSync(skillsPath, 'utf8');
  const skills = JSON.parse(raw);
  assert.ok(Array.isArray(skills), 'skills.json should contain an array');
  console.log('skills.json looks good');
} catch (err) {
  console.error('Test failed:', err.message);
  process.exit(1);
}
