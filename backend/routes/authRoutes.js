const express = require('express');
const router = express.Router();
const {
  registerStudent,
  registerTeacher,
  loginUser,
  getMe,
} = require('../controllers/authController'); 
const { protect } = require('../middleware/authMiddleware'); 

router.post('/register/student', registerStudent);
router.post('/register/teacher', registerTeacher);
router.post('/login', loginUser);
router.get('/me', protect, getMe); // Protect the 'me' route

module.exports = router;