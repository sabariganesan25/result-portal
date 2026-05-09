const express = require('express');
const router = express.Router();
const { loginStudent, getStudent, getResults } = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route
router.post('/login', loginStudent);

// Protected routes
router.get('/student/:registration_no', authMiddleware, getStudent);
router.get('/results/:registration_no', authMiddleware, getResults);

module.exports = router;
