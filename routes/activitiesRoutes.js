import express from 'express';
const router = express.Router();

import {
  createActivity,
  deleteActivity,
  getAllActivities,
  updateActivity,
  showStats,
} from '../controllers/activitiesController.js';

import testUser from '../middleware/testUser.js';

router.route('/').post(testUser, createActivity).get(getAllActivities);
// remember about :id
router.route('/stats').get(showStats);
router.route('/:id').delete(testUser, deleteActivity).patch(testUser, updateActivity);

export default router;
