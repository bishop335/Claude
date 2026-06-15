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
      if (!content.includes('\nuse strict')) {
        console.log(`- ${file}: Consider adding "use strict" or ensuring consistent style`);
      }
    }
  });
  console.log('Done.');
}

if (fs.existsSync(srcDir)) simpleReview(srcDir);
else console.log('No src/ directory found.');
