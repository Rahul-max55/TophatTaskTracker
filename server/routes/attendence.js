import express from 'express';
import {
  deleteAttendence,
  getAllAttendence,
  markAttendence,
  singleAttendence,
  updateAttendence,
} from '../controllers/attendence.js';
import { verifyAccessToken, verifyAccessType } from '../middlewares/index.js';

const router = express.Router();

router.post('/', verifyAccessToken, verifyAccessType, getAllAttendence);
router.post('/mark', verifyAccessToken, markAttendence);
router.get('/:attendenceId', verifyAccessToken, singleAttendence);
router.put('/:attendenceId', verifyAccessToken, updateAttendence);
router.delete('/:attendenceId', verifyAccessToken, deleteAttendence);

export default router;
