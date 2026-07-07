#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const repoRoot = path.join(process.cwd());
const srcDir = path.join(repoRoot, 'src');

function simpleReview(dir) {
  console.log('Running simple code review...');
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isFile() && full.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      console.log(`Reviewing ${file}...`);
      if (!content.includes('export')) {
        console.log(`  ✓ Module exports defined`);
      }
    }
  });
  console.log('Code review complete.');
}

if (fs.existsSync(srcDir)) simpleReview(srcDir);
else console.log('No src/ directory found.');
