import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, skillSchema } from '../middleware/validation.js';
import { upload } from '../middleware/upload.js';
import {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  addSkillFile
} from '../db/skills.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get all skills
router.get('/', (req, res, next) => {
  try {
    const skills = getAllSkills();
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

// Get skill by ID
router.get('/:id', (req, res, next) => {
  try {
    const skill = getSkillById(Number(req.params.id));
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (err) {
    next(err);
  }
});

// Create skill (authenticated)
router.post('/', authenticateToken, validateRequest(skillSchema), (req, res, next) => {
  try {
    const { title, summary, tags } = req.validatedData;
    const id = createSkill(title, summary, tags);
    res.status(201).json({ id, title, summary, tags });
  } catch (err) {
    next(err);
  }
});

// Update skill (authenticated)
router.put('/:id', authenticateToken, validateRequest(skillSchema), (req, res, next) => {
  try {
    const { title, summary, tags } = req.validatedData;
    const updated = updateSkill(Number(req.params.id), title, summary, tags);
    if (!updated) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json({ message: 'Skill updated successfully' });
  } catch (err) {
    next(err);
  }
});

// Delete skill (authenticated)
router.delete('/:id', authenticateToken, (req, res, next) => {
  try {
    const deleted = deleteSkill(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// Upload file to skill (authenticated)
router.post('/:id/upload', authenticateToken, upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const skillId = Number(req.params.id);
    const skill = getSkillById(skillId);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    const fileId = addSkillFile(skillId, req.file.originalname, req.file.path);
    logger.info('File uploaded:', { skillId, fileId, fileName: req.file.originalname });
    res.status(201).json({ fileId, fileName: req.file.originalname });
  } catch (err) {
    next(err);
  }
});

export default router;
