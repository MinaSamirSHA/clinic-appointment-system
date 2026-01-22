const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');

// Register
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Clinic name is required'),
    body('ownerName').trim().notEmpty().withMessage('Owner name is required'),
    body('phone').matches(/^01[0-2,5]{1}[0-9]{8}$/).withMessage('Invalid Egyptian phone number'),
    body('email').isEmail().withMessage('Invalid email'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('specialty').trim().notEmpty().withMessage('Specialty is required'),
    body('workingHours').trim().notEmpty().withMessage('Working hours are required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
], authController.register);

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], authController.login);

// Refresh token
router.post('/refresh', [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
    validate
], authController.refresh);

// Get current user (protected)
const authMiddleware = require('../middleware/auth');
router.get('/me', authMiddleware, authController.me);

module.exports = router;
