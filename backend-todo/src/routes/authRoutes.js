const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../middleware/validationMiddleware');

/**
 * Public authentication routes
 */
router.post('/register', validateRegisterInput, AuthController.register);
router.post('/login', validateLoginInput, AuthController.login);

/**
 * Protected authentication routes
 */
router.get('/me', authMiddleware, AuthController.me);
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;
