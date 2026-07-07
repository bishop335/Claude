import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../skills.db');

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    tags TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS skill_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    skillId INTEGER NOT NULL,
    fileName TEXT NOT NULL,
    filePath TEXT NOT NULL,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skillId) REFERENCES skills(id) ON DELETE CASCADE
  );
`);

logger.info('Database initialized:', dbPath);

// Helper functions
export function getAllSkills() {
  try {
    const stmt = db.prepare('SELECT * FROM skills ORDER BY createdAt DESC');
    return stmt.all();
  } catch (err) {
    logger.error('Error fetching skills:', err.message);
    throw err;
  }
}

export function getSkillById(id) {
  try {
    const stmt = db.prepare('SELECT * FROM skills WHERE id = ?');
    return stmt.get(id);
  } catch (err) {
    logger.error('Error fetching skill:', err.message);
    throw err;
  }
}

export function createSkill(title, summary, tags) {
  try {
    const stmt = db.prepare(
      'INSERT INTO skills (title, summary, tags) VALUES (?, ?, ?)'
    );
    const tagsJson = tags ? JSON.stringify(tags) : null;
    const result = stmt.run(title, summary, tagsJson);
    logger.info('Skill created:', { id: result.lastInsertRowid });
    return result.lastInsertRowid;
  } catch (err) {
    logger.error('Error creating skill:', err.message);
    throw err;
  }
}

export function updateSkill(id, title, summary, tags) {
  try {
    const stmt = db.prepare(
      'UPDATE skills SET title = ?, summary = ?, tags = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?'
    );
    const tagsJson = tags ? JSON.stringify(tags) : null;
    const result = stmt.run(title, summary, tagsJson, id);
    logger.info('Skill updated:', { id, changes: result.changes });
    return result.changes > 0;
  } catch (err) {
    logger.error('Error updating skill:', err.message);
    throw err;
  }
}

export function deleteSkill(id) {
  try {
    const stmt = db.prepare('DELETE FROM skills WHERE id = ?');
    const result = stmt.run(id);
    logger.info('Skill deleted:', { id, changes: result.changes });
    return result.changes > 0;
  } catch (err) {
    logger.error('Error deleting skill:', err.message);
    throw err;
  }
}

export function addSkillFile(skillId, fileName, filePath) {
  try {
    const stmt = db.prepare(
      'INSERT INTO skill_files (skillId, fileName, filePath) VALUES (?, ?, ?)'
    );
    const result = stmt.run(skillId, fileName, filePath);
    logger.info('File attached to skill:', { skillId, fileId: result.lastInsertRowid });
    return result.lastInsertRowid;
  } catch (err) {
    logger.error('Error adding file:', err.message);
    throw err;
  }
}

export default db;
